#!/bin/bash

LOCAL_DIR=$(pwd)
GITHUB_REPO=https://github.com/Wynd-Network/grass-vps-app
APP_NAME=grass-vps-app

# Make sure to change directory to the working app
cd "$LOCAL_DIR" || exit

# Pull from the main branch of the app
git pull origin main

# Update dependencies if necessary
npm install