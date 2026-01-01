#!/bin/bash
# Script to run the app on Android emulator

cd "$(dirname "$0")"

echo "🚀 Starting Expo server..."
echo ""
echo "📱 Make sure your Android emulator is running first!"
echo ""
echo "Once the server starts, press 'a' to open on Android emulator"
echo ""

npm start

