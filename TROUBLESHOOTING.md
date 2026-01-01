# Troubleshooting Guide

## If the app is not running properly:

### 1. Clear Cache and Restart
```bash
cd ~/Desktop/karigargocursor-mobile
npm start -- --clear
```

### 2. Rebuild Node Modules
If you're still having issues:
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### 3. Check for Common Errors

#### Error: "Unable to resolve module"
- Run: `npm install`
- Make sure you're in the project directory

#### Error: "Metro bundler issues"
- Stop the server (Ctrl+C)
- Run: `npm start -- --clear`
- If that doesn't work: `npx expo start --clear`

#### Error: "Babel/Runtime errors"
- Check that babel.config.js has react-native-reanimated plugin (should be last in plugins array)
- Run: `npm start -- --clear`

#### Android Emulator Issues
- Make sure emulator is fully booted (home screen visible)
- Check that emulator is running: `adb devices`
- Restart the emulator if needed
- Make sure you're using a recent Android version (API 30+)

### 4. Check Logs
Look at the terminal output for specific error messages. Common issues:
- Missing dependencies
- Port already in use (change port with `--port 8082`)
- Metro bundler cache issues

### 5. Reset Everything
If nothing works:
```bash
cd ~/Desktop/karigargocursor-mobile
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear
```

## Still having issues?
Share the specific error message you see in the terminal or emulator screen.

