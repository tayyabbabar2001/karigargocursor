#!/bin/bash
# Complete clean restart script

cd "$(dirname "$0")"

echo "🧹 Step 1: Cleaning caches..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

echo "✅ Cache cleared"
echo ""
echo "🚀 Step 2: Starting Expo with clear cache..."
echo ""
echo "When the server starts:"
echo "  - Press 'a' to open on Android emulator"
echo "  - Make sure your Android emulator is running first!"
echo ""

npx expo start --clear

