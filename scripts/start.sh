#!/bin/bash

LOCAL_DIR=$(pwd)

# Copy the environment example file and start modifying the contents
echo "[❗] Copying .env.example file to .env (1/4)"
cp "$LOCAL_DIR/.env.example" "$LOCAL_DIR/.env"
echo "[✅] Successfully copied .env.example file to .env"

# Ask the user for user IDs
echo "[❗] User ID is a value that identifies a user (2/4)"
echo "[❗] How to get your user ID - https://github.com/FungY911/better-grass?tab=readme-ov-file#how-to-get-user-id"
read -p "User ID: " user_ids_var

# Set the environment variables
sed -i "s/USER_ID=/USER_ID=$user_ids_var/g" $LOCAL_DIR/.env
sed -i "s/NODE_ENV=/NODE_ENV=production/g" $LOCAL_DIR/.env
echo "[✅] User ID was set."

# Install all dependencies
echo "[❗] Installing all dependencies (3/4)"
npm install
echo "[✅] Successfully installed all dependencies"

# Start the app
echo "[❗] Starting the app (4/4)"
pm2 start $LOCAL_DIR/pm2.config.js
echo "[✅] Successfully started the app"

exit