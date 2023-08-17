#!/bin/bash

LOCAL_DIR=$(pwd)

# Copy the environment example file and start modifying the contents
echo Copying the contents of .env.example
cp "$LOCAL_DIR/.env.example" "$LOCAL_DIR/.env"
echo Completed

# Ask the user for user IDs
echo User ID is a value that identifies a user
echo Please set the User ID/s that you want to attach to this machine
echo Note: Declaring multiple User IDs is possible by separating each ID with a comma and the program will automatically divide the User IDs to the number of available IPs
read -p "User ID/s: " user_ids_var

# Set the environment variables
sed -i "" "s/USER_IDS=/USER_IDS=$user_ids_var/g" $LOCAL_DIR/.env
sed -i "" "s/NODE_ENV=/NODE_ENV=production/g" $LOCAL_DIR/.env

# Install git
echo Installing git that will be used for automatic updates
sudo apt-get update
sudo apt-get install git-all

# Installing node and npm
echo Installing NodeJS and NPM which are used for running the actual app
sudo apt update
sudo apt install nodejs
sudo apt install npm

# Install pm2
echo Installing PM2 that will let the app run forever and restart automatically when it crashses
sudo npm install pm2

# Start the app
echo Starting the app...
pm2 start $LOCAL_DIR/pm2.config.js
echo It has now started! You can monitor the app using the "pm2 monit" command.

# Add the update.sh file as a cron job
crontab -l > vpscron
echo "00 00 * * * $LOCAL_DIR/scripts/update.sh" >> vpscron
crontab vpscron
rm vpscron

exit