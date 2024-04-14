const { isProduction } = require("./utils");

let userId = process.env.USER_ID ?? undefined;
console.log("USER ID: ", userId)
if (userId === undefined) {
  console.log("[❌] No USER_ID provided!");
  console.log("[❗] Please set the USER_ID environment variable.");
  process.exit(1);
}

module.exports = {
  USER_ID: userId,
  WEBSOCKET_URLS: isProduction()
    ? ["wss://proxy.wynd.network:4650", "wss://proxy.wynd.network:4444"]
    : ["ws://proxy.dev.getgrass.io:4343"],
  NAMESPACE: "bfeb71b6-06b8-5e07-87b2-c461c20d9ff6",
  PING_INTERVAL: 20 * 1000, // 20s in ms
  COOKIE_JAR_LIFESPAN: 60 * 60 * 24 * 1000, // 24hrs in ms
  USER_AGENT:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
};
