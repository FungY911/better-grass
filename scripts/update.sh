#!/bin/bash

LOCAL_DIR=$(pwd)
GITHUB_REPO=https://github.com/FungY911/better-grass
APP_NAME=better-grass

# Make sure to change directory to the working app
cd "$LOCAL_DIR" || exit

# Clone the repository if not already present
if [ ! -d "$APP_NAME" ]; then
    git clone "$GITHUB_REPO" "$APP_NAME"
fi

# Change directory to the app
cd "$APP_NAME" || exit

# Pull from the main branch of the app
git pull origin main

# Update dependencies
npm install
