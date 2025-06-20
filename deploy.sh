#!/bin/bash

echo "🚀 NCDHHS PDF Downloader - Amplify Deployment Script"
echo "=================================================="

# Use npx instead of global installation to avoid permission issues
echo "✅ Using npx for Amplify CLI (no global install needed)"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first"
    exit 1
fi

echo "✅ AWS CLI configured"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize Amplify (if not already initialized)
if [ ! -d "amplify" ]; then
    echo "🔧 Initializing Amplify project..."
    npx @aws-amplify/cli init --yes
fi

# Add API if not exists
if [ ! -d "amplify/backend/api" ]; then
    echo "🔌 Adding GraphQL API..."
    npx @aws-amplify/cli add api
fi

# Add Storage if not exists
if [ ! -d "amplify/backend/storage" ]; then
    echo "💾 Adding S3 Storage..."
    npx @aws-amplify/cli add storage
fi

# Add Function if not exists
if [ ! -d "amplify/backend/function" ]; then
    echo "⚡ Adding Lambda Function..."
    npx @aws-amplify/cli add function
fi

# Deploy backend
echo "🚀 Deploying backend resources..."
npx @aws-amplify/cli push --yes

# Build and deploy frontend
echo "🎨 Building and deploying frontend..."
npx @aws-amplify/cli publish --yes

echo ""
echo "🎉 Deployment completed!"
echo "📱 Your app is now live on AWS Amplify"
echo ""
echo "Next steps:"
echo "1. Check the Amplify Console for your app URL"
echo "2. Test the PDF download functionality"
echo "3. Monitor CloudWatch logs for any issues"
echo ""
echo "💡 To update your app:"
echo "   - Make changes to your code"
echo "   - Run: npx @aws-amplify/cli publish"
