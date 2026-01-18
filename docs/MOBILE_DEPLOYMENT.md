# Mobile Deployment & PWA Installation Guide 📱

This document outlines how to deploy the Digital Piggy Bank and install it on your mobile device as a native-like app.

## 1. Hosting Requirements ☁️

To be installable as a PWA, your application **MUST** be served over **HTTPS** (secure connection).

### Recommended Hosting Providers (Free)
- **Netlify**: Drag & drop the `dist` folder.
- **Vercel**: Connect your GitHub repo.
- **GitHub Pages**: Settings -> Pages -> Deploy from branch.

> **Note**: Localhost (`http://localhost:5173`) works for testing, but you cannot install it on your phone unless you use port forwarding or a tunneling service like `ngrok`.

## 2. Installation on iOS (iPhone/iPad) 🍎

Technically, Safari handles PWA installation on iOS.

1. **Open Safari**: Navigate to your deployed URL (e.g., `https://my-piggy-bank.netlify.app`).
2. **Tap 'Share'**: Click the Share icon (square with arrow up) at the bottom center.
3. **'Add to Home Screen'**: Scroll down and tap "Add to Home Screen".
4. **Confirm**: Tap "Add" in the top right.
5. **Launch**: The app icon will appear on your home screen. Open it to use in full-screen mode.

## 3. Installation on Android 🤖

Chrome is the primary browser for PWA installation on Android.

1. **Open Chrome**: Navigate to your deployed URL.
2. **Auto-Prompt**: You might see a "Add Digital Piggy Bank to Home screen" banner at the bottom. Tap it.
3. **Manual Install**:
   - Tap the **Three Dots Menu** (⋮) in the top right.
   - Tap **"Install App"** or **"Add to Home screen"**.
4. **Confirm**: Follow the prompt to install.
5. **Launch**: Open the app from your app drawer or home screen.

## 4. Troubleshooting 🔧

- **"Add to Home Screen" not appearing?**
  - Ensure you are using **HTTPS**.
  - Ensure you are not in "Incognito" or "Private" mode.
  - Refresh the page and wait a moment for the Service Worker to load.

- **App doesn't work offline?**
  - Launch the app once while online to allow it to download necessary files.
  - Close the app and turn off data/WiFi to test.
