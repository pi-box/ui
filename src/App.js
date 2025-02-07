import React, { useState } from 'react';

import WifiConfig from './WifiConfig';
import Sync from './Sync';

/**
 * App Component for Pi-Box UI
 * 
 * This is the main application component that controls the navigation between
 * the synchronization screen (`Sync.js`) and the WiFi configuration screen (`WifiConfig.js`).
 * 
 * Features:
 * - Toggles between the sync and WiFi config views
 * - Uses `useState` to manage UI state
 * 
 * Usage:
 * Render this component at the root of the application in `index.js`
 */

export default function App() {
  // State to manage the active view: "sync" or "wifiConfig"
  const [mode, setMode] = useState("sync");
  
  /**
   * Function to change the application mode
   * @param {string} newMode - The new mode to set ("sync" or "wifiConfig")
   */
  const changeMode = (newMode) => {
    setMode(newMode);
  };

  return (
    <>
      {mode === "sync" ? (
        <Sync onConfigRequest={() => changeMode("wifiConfig")} />
      ) : (
        <WifiConfig onConfigEnded={() => changeMode("sync")} />
      )}
    </>
  );
}
