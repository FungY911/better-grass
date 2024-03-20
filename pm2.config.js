// App's PM2 Config file
require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "better-grass",
      script: "./src/app.js",
      node_args: ["--max-http-header-size=1073741824"],
      env: {
        USER_IDS: process.env.USER_IDS,
        LIMIT: process.env.LIMIT,
        NODE_ENV: process.env.NODE_ENV,
      },
      watch: ["src"],
      ignore_watch: ["node_modules", "scripts", "\\.git"],
    },
  ],
};
