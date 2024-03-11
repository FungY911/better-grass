const { isProduction } = require("./utils");

let userIds = process.env.USER_ID !== undefined && process.env.USER_IDS !== "" ? process.env.USER_IDS.split(",") : [];
// If USER_IDS is not defined or empty, an empty array will be used

if (userIds.length === 0) {
  console.log("[❌] No user IDs provided!");
  console.log("[❗] Please set the USER_IDS environment variable.");
  process.exit(1);
}

module.exports = {
  USER_IDS: userIds,
  WEBSOCKET_URLS: isProduction()
    ? ["wss://proxy.wynd.network:4650", "wss://proxy.wynd.network:4444"]
    : ["ws://proxy.dev.getgrass.io:4343"],
  NAMESPACE: "bfeb71b6-06b8-5e07-87b2-c461c20d9ff6",
  PING_INTERVAL: 20 * 1000, // 20s in ms
  COOKIE_JAR_LIFESPAN: 60 * 60 * 24 * 1000, // 24hrs in ms
  USER_AGENT:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
};
