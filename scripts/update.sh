#!/bin/bash

LOCAL_DIR=$(pwd)
GITHUB_REPO=https://github.com/FungY911/better-grass
APP_NAME=grass-cli

# Make sure to change directory to the working app
cd "$LOCAL_DIR" || exit

# Pull from the main branch of the app
git pull origin main

# Update dependencies if necessary
npm install
