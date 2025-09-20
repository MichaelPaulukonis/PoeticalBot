#!/bin/bash

set -e

echo "Building Lambda Function..."
# Copy necessary files to lambda directory
cp -r lib lambda/
cp config.js lambda/

cd lambda
npm install --production
# Create zip from within lambda directory so files are at root level
zip -r ../terraform/poeticalbot-lambda.zip . -x "node_modules/.cache/*"
cd ..

echo "Deploying with Terraform..."
cd terraform
terraform init
terraform plan
terraform apply

echo "Deployment complete!"