const WebSocket = require("ws");
const { v5: uuidv5, v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { default: got } = require("got");
const { createFetch } = require("got-fetch");
const { CookieJar } = require("tough-cookie");
const {
  NAMESPACE,
  USER_IDS,
  WEBSOCKET_URL,
  PING_INTERVAL,
  USER_AGENT,
  COOKIE_JAR_LIFESPAN,
} = require("./constants");

const getUnixTimestamp = () => Math.floor(Date.now() / 1000);

let websockets = {};
let cookieJars = {};
let lastLiveConnectionTimestamp = getUnixTimestamp();
const appRoot = path.resolve(__dirname);

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const performHttpRequest = async (params) => {
  const sessionHasCookieJar = !!cookieJars[params.session_id];

  if (!sessionHasCookieJar) {
    cookieJars[params.session_id] = new CookieJar();

    // Delete the new cookie jar instance for this session after 24hrs
    const cookieJarTimeout = setTimeout(() => {
      delete cookieJars[params.session_id];
      console.log(`[COOKIE] Cookie Jar for ${params.session_id} is deleted`);
      clearTimeout(cookieJarTimeout);
    }, COOKIE_JAR_LIFESPAN);
  }

  const extendedGot = got.extend({
    localAddress: params.device_ip,
    encoding: "base64",
    cookieJar: cookieJars[params.session_id],
    maxHeaderSize: 49152,
  });
  const gotFetch = createFetch(extendedGot);

  // Whether to include cookies when sending request
  const credentials_mode = params.authenticated ? "include" : "omit";

  const requestOptions = {
    headers: params.headers,
    method: params.method,
    credentials: credentials_mode,
    mode: "cors",
    cache: "no-cache",
    redirect: "follow",
  };

  // If there is a request body, we decode it
  // and set it for the request.
  if (params.body) {
    const bufferBody = Buffer.from(params.body, "base64");
    requestOptions.body = bufferBody;
  }

  let response = null;
  try {
    response = await gotFetch(params.url, requestOptions);
  } catch (err) {
    console.error(
      "[FETCH ERROR]",
      params.device_ip,
      params.method,
      params.url,
      err
    );
    return;
  }

  // response.headers is and iterable object Headers (not a json)
  // so we must manually copy before returning
  const headers = {};
  for (const [key, value] of response.headers.entries()) {
    headers[key] = value;
  }
  // Delete the :status header
  delete headers[":status"];

  return {
    url: response.url,
    status: response.status,
    status_text: response.statusText,
    headers,
    body: response.body,
  };
};

const initialize = (ipAddress, userId) => {
  const websocket = new WebSocket(WEBSOCKET_URL, {
    localAddress: ipAddress,
    ca:
      process.env.NODE_ENV === "production"
        ? fs.readFileSync(`${appRoot}/ssl/websocket.pem`, "ascii")
        : undefined,
  });
  websockets[ipAddress] = websocket;

  const authenticate = (params) => {
    const browser_id = uuidv5(ipAddress, NAMESPACE);
    const deviceType = `vps, ${os.platform}, ${os.release()}`;

    const authenticationResponse = {
      browser_id,
      user_id: userId,
      user_agent: USER_AGENT,
      timestamp: getUnixTimestamp(),
      device_type: deviceType,
    };

    return authenticationResponse;
  };

  const RPC_CALL_TABLE = {
    HTTP_REQUEST: performHttpRequest,
    AUTH: authenticate,
    PONG: () => {},
  };

  websocket.on("open", () => {
    console.log(ipAddress, "[OPEN]", "Websocket is open");
  });

  websocket.on("close", (code, reason) => {
    console.log(
      ipAddress,
      "[CLOSE]",
      `Connection closed, code=${code}, reason=${reason}`
    );
  });

  websocket.on("error", (error) => {
    console.error(ipAddress, "[ERROR]", error);
  });

  websocket.on("message", async (data) => {
    // Update last live connection timestamp
    lastLiveConnectionTimestamp = getUnixTimestamp();

    let parsed_message;
    try {
      parsed_message = JSON.parse(data);
    } catch (e) {
      console.error(ipAddress, "Could not parse WebSocket message!", data);
      console.error(e);
      return;
    }

    if (parsed_message.action in RPC_CALL_TABLE) {
      try {
        const result = await RPC_CALL_TABLE[parsed_message.action](
          parsed_message.data
        );
        if (result) {
          websocket.send(
            JSON.stringify({
              // Use same ID so it can be correlated with the response
              id: parsed_message.id,
              origin_action: parsed_message.action,
              result,
            })
          );
        }
      } catch (err) {
        console.error(
          ipAddress,
          `RPC action ${parsed_message.action} encountered error: `,
          err
        );
      }
    } else {
      console.error(ipAddress, `No RPC action ${parsed_message.action}!`);
    }
  });

  // This function pings the proxy server to keep the connection alive
  const pingInterval = setInterval(async () => {
    const PENDING_STATES = [
      0, // CONNECTING
      2, // CLOSING
    ];

    // Check WebSocket state and make sure it's appropriate
    if (PENDING_STATES.includes(websocket.readyState)) {
      console.log(
        ipAddress,
        "WebSocket not in appropriate state for liveness check..."
      );
      return;
    }

    // Check if timestamp is older than ~15 seconds. If it
    // is the connection is probably dead and we should restart it.
    const current_timestamp = getUnixTimestamp();
    const seconds_since_last_live_message =
      current_timestamp - lastLiveConnectionTimestamp;

    if (seconds_since_last_live_message > 29 || websocket.readyState === 3) {
      console.error(
        ipAddress,
        "WebSocket does not appear to be live! Restarting the WebSocket connection..."
      );

      try {
        websocket.close();
        websockets[ipAddress] = null;
      } catch (e) {
        // Do nothing.
      }
      initialize(ipAddress, userId);
      clearInterval(pingInterval);
      return;
    }

    // Send PING message down websocket, this will be
    // replied to with a PONG message form the server
    // which will trigger a function to update the
    // lastLiveConnectionTimestamp variable.

    // If this timestamp gets too old, the WebSocket
    // will be severed and started again.
    websocket.send(
      JSON.stringify({
        id: uuidv4(),
        version: "1.0.0",
        action: "PING",
        data: {},
      })
    );
  }, PING_INTERVAL);
};

const getIpAddresses = () => {
  const limit = Number(process.env.LIMIT);
  const networkInterfaces = os.networkInterfaces();
  const interfaces = Object.values(networkInterfaces);
  const ipAddresses = interfaces
    .filter((interface) => {
      const ipv4Interface = interface.find(
        (int) => int.family.toLocaleLowerCase() === "ipv4"
      );

      // Ignore 127.0.0.1 because it represents localhost
      return !!ipv4Interface && ipv4Interface.address !== "127.0.0.1";
    })
    .map((interface) => {
      const ipv4Interface = interface.find(
        (int) => int.family.toLocaleLowerCase() === "ipv4"
      );

      return ipv4Interface.address;
    });

  if (!Number.isNaN(limit) && limit > 0) {
    // Only limit a number of ip addresses to be used
    return ipAddresses.slice(0, limit);
  }

  return ipAddresses;
};

const initializeIpAddresses = async () => {
  const ipAddresses = getIpAddresses();
  const ipAddressPerUser = Math.floor(ipAddresses.length / USER_IDS.length);
  let excessIpAddress = ipAddresses.length % USER_IDS.length;
  let userIpAddresses = {};

  for (let i = 0; i < USER_IDS.length; i++) {
    const userId = USER_IDS[i];
    const slicedIpAddreses = ipAddresses.slice(
      i * ipAddressPerUser,
      (i + 1) * ipAddressPerUser
    );

    userIpAddresses[userId] = slicedIpAddreses;

    if (excessIpAddress > 0) {
      const extraIpAddress = ipAddresses[ipAddresses.length - excessIpAddress];
      userIpAddresses[userId] = [...userIpAddresses[userId], extraIpAddress];
      excessIpAddress = excessIpAddress - 1;
    }

    for (let j = 0; j < userIpAddresses[userId].length; j++) {
      const ipAddress = userIpAddresses[userId][j];
      initialize(ipAddress, userId);
      await sleep(3000);
    }
  }
};

initializeIpAddresses();
