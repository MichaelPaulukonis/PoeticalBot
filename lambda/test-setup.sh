#!/bin/bash

# Ensure we have the latest lib files for testing
echo "Copying lib files for Lambda testing..."
cp -r ../lib ./
cp ../config.js ./

echo "Installing dev dependencies..."
npm install

echo "Running tests..."
npm test