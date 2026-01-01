# Android Emulator Setup Guide

## Step 1: Open Android Studio
- Open Android Studio on your Mac

## Step 2: Open AVD Manager
Two ways to open:
- **Method 1**: Click on "Device Manager" icon in the toolbar (looks like a phone/tablet icon)
- **Method 2**: Go to **Tools → Device Manager**

## Step 3: Create a New Virtual Device
1. In Device Manager, click **"+ Create Device"** button
2. Select a device definition:
   - Recommended: **Pixel 5** or **Pixel 6**
   - Or choose any device you prefer
   - Click **Next**

3. Select a system image:
   - Choose the latest **API Level** (e.g., API 34 - Android 14, or API 33 - Android 13)
   - If you see "Download" next to it, click to download it first (this may take a few minutes)
   - Click **Next**

4. Configure your AVD:
   - Give it a name (e.g., "Pixel_5_API_34")
   - You can change Advanced Settings if needed
   - Click **Finish**

## Step 4: Start the Emulator
1. In Device Manager, find your newly created device
2. Click the **▶️ Play button** next to your device
3. Wait for the emulator to boot (this may take 1-2 minutes the first time)

## Step 5: Run the Expo App
Once the emulator is running:

```bash
cd ~/Desktop/karigargocursor-mobile
npm start
```

Then press **`a`** in the terminal to open on Android emulator.

## Troubleshooting

### If you don't see "Device Manager" button:
- Make sure Android Studio is fully opened and project is loaded
- Try: **Tools → Device Manager** from the menu bar

### If system image download fails:
- Check your internet connection
- Go to **Tools → SDK Manager → SDK Platforms** and download Android SDK manually

### If emulator is slow:
- In AVD settings, increase RAM allocation (2048 MB recommended minimum)
- Enable hardware acceleration in AVD settings

### If "a" command doesn't work:
- Make sure emulator is fully booted (home screen is visible)
- Try restarting the Expo server: Press `Ctrl+C` then `npm start` again

## Quick Commands Reference
- `npm start` - Start Expo server
- Press `a` - Open on Android
- Press `r` - Reload app
- Press `m` - Open developer menu

