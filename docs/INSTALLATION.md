# Installation Guide 🛠️

Follow these steps to set up the Digital Piggy Bank on your local machine.

## Prerequisites

- **Node.js**: Version 16.0.0 or higher.
- **npm**: Installed with Node.js.

## Setup Steps

1. **Clone the Repository**
   (skip if you have the files locally)

2. **Navigate to Project Directory**
   ```bash
   cd digital-pigibank
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Troubleshooting

- **Permissions Error (Windows)**: If you see script execution errors in PowerShell, try running with `node`:
  ```bash
  node node_modules/vite/bin/vite.js
  ```
- **PWA Not Updating**: Clear your browser storage (Application > Clear Site Data) to unregister old service workers.
