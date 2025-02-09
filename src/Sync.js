import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useSnackbar } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import LinearProgress from '@mui/material/LinearProgress';

import SyncIcon from '@mui/icons-material/Sync';

/**
 * Sync Component for Pi-Box UI
 * 
 * This component handles the synchronization process of media files from the server.
 * It establishes a WebSocket connection to track sync progress and provides
 * user feedback via a progress bar and notifications.
 * 
 * Features:
 * - Connects to a WebSocket for real-time sync updates
 * - Displays progress of file synchronization
 * - Provides a button to manually trigger synchronization
 * 
 * Usage:
 * Used as the default screen in `App.js` and switches to WiFi configuration upon request.
 */

export default function Sync(props) {
  const connUrl = "conn/";
  const syncUrl = "sync/";
  const wsUrl = `ws://${window.location.host}/websocket/`;

  const { onConfigRequest } = props;

  const [connected, setConnected] = useState(false);
  const [syncMode, setSyncMode] = useState("waiting");
  const [fileSize, setFileSize] = useState({ current: 0, total: 0, percent: 0 });
  const [groupId, setGroupId] = useState("טוען...");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetch(`${syncUrl}group`)
      .then(res => res.json())
      .then(data => setGroupId(data.group_id || "לא זמין"))
      .catch(() => setGroupId("שגיאה בשליפה"));
    checkConnectivity();
  }, []);

  const checkConnectivity = (func = null) => {
    fetch(connUrl)
      .then((res) => res.json())
      .then((res) => {
        setConnected(res.status === "ok" && res.connected);
        if (func) func(res.connected);
      })
      .catch(() => setConnected(false));
  };

  return (
    <Box sx={{ mt: 25, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button sx={{ width: 230, height: 70, pb: 1.5, fontSize: 20, borderRadius: 8 }} disabled={!connected} variant={!connected ? "outlined" : "contained"} size="large" startIcon={<SyncIcon />}>
        בצע סינכרון
      </Button>
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, m: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {connected ? "ההתקן מחובר לרשת" : "ממתין לחיבור רשת..."}
          <br />
          מזהה הקבוצה: <span style={{ direction: 'ltr', display: 'inline-block' }}>{groupId}</span>
        </Typography>
        <Typography variant="body" color="text.secondary">
          לעידכון הגדרות החיבור, <Link underline="none" href="#" onClick={() => onConfigRequest()}>לחץ כאן</Link>
        </Typography>
      </Box>
    </Box>
  );
}
