#!/bin/bash
echo "🧹 Cleaning..."
rm -rf node_modules/.cache .expo

echo "📦 Reinstalling dependencies..."
npm install

echo "🚀 Starting Expo..."
npx expo start --clear
