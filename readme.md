# Pi-Box UI

## Overview
Pi-Box UI is the web-based management interface for Pi-Box, a Raspberry Pi-based multimedia system. The UI allows users to configure WiFi settings, trigger media synchronization, and monitor system status.

The UI is built with **React** and uses **Material-UI** for styling.

📌 The backend repository for Pi-Box can be found at: [Pi-Box Server Repository](https://github.com/pi-box/srv).

## Project Structure
This repository contains the frontend code for the Pi-Box system:

### 📂 `src/`
- **`App.js`** – Main application component that switches between sync and WiFi configuration views.
- **`Sync.js`** – Handles synchronization process, WebSocket connection, and UI updates.
- **`WifiConfig.js`** – Allows users to scan and connect to available WiFi networks.
- **`RTL.js`** – Ensures right-to-left (RTL) support for Hebrew and other RTL languages.
- **`index.js`** – Entry point of the React app.

### 📂 `public/`
- **`index.html`** – Root HTML template for the React app.
- **`favicon.ico`** – Icon for the UI.
- **`loading.jpg`** – Image displayed during loading.

## Installation and Development
To set up and build the project, follow these steps:

### 1️⃣ Clone the repository:
```bash
git clone https://github.com/pi-box/ui.git
cd ui
```

### 2️⃣ Install dependencies:
```bash
npm install
```

### 3️⃣ Build the project:
```bash
npm run build
```

### 4️⃣ Deploy to Pi-Box Server:
Copy the contents of the `build/` directory into the **public directory** of the Pi-Box server repository:

```bash
cp -r build/* /path/to/pi-box-server/src/pibox/public/
```

Alternatively, commit and push the built files to:
[Pi-Box Server Public Directory](https://github.com/pi-box/srv/tree/main/src/pibox/public).

## License
This project is licensed under the MIT License.

