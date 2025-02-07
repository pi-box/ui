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
  const { enqueueSnackbar } = useSnackbar();

  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 20,
    reconnectInterval: 1000,
    share: true,
  });

  const syncTitles = {
    checkConn: "בודק חיבור רשת...",
    startSync: "מחפש עידכונים חדשים",
    copyFiles: `עודכנו ${fileSize.current} מגה (מתוך ${fileSize.total} סה\"כ)`,
  };

  useEffect(() => {
    checkConnectivity();
  }, []);

  useEffect(() => {
    if (syncMode === "waiting") {
      setFileSize({ current: 0, total: 0, percent: 0 });
    }
  }, [syncMode]);

  useEffect(() => {
    if (lastMessage) {
      const result = JSON.parse(lastMessage.data);
      if (result._type === "progress") {
        setFileSize({
          current: result._data.current,
          total: result._data.total,
          percent: (100 * result._data.current) / result._data.total,
        });
        setSyncMode("copyFiles");
      } else if (result._type === "complete") {
        enqueueSnackbar(result.status === "ok" ? "התהליך הסתיים בהצלחה!" : result._msg, {
          variant: result.status,
        });
        setSyncMode("waiting");
      }
    }
  }, [lastMessage]);

  const checkConnectivity = (func = null) => {
    fetch(connUrl)
      .then((res) => res.json())
      .then((res) => {
        setConnected(res.status === "ok" && res.connected);
        if (func) func(res.connected);
      })
      .catch(() => setConnected(false));
  };

  const syncClicked = () => {
    setSyncMode("checkConn");
    checkConnectivity((res) => {
      if (res) {
        setSyncMode("startSync");
        fetch(syncUrl);
      } else {
        setSyncMode("waiting");
        enqueueSnackbar("אין גישה לרשת. הפעולה בוטלה!", { variant: "error" });
      }
    });
  };

  return (
    <Box sx={{ mt: 25, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {syncMode !== "waiting" ? (
        <>
          <img src="loading.jpg" width="85px" height="85px" alt="Loading" />
          <Box sx={{ width: 1, alignItems: 'right', px: 6, mt: 10 }}>
            <Typography variant="body" color="text.secondary">
              <b>{syncTitles[syncMode]}</b>
            </Typography>
            <Box mt={2} />
            <ThemeProvider theme={(outerTheme) => ({ ...outerTheme, direction: 'ltr' })}>
              <LinearProgress variant="determinate" value={fileSize.percent} />
            </ThemeProvider>
          </Box>
        </>
      ) : (
        <Button
          sx={{ width: 230, height: 70, pb: 1.5, fontSize: 20, borderRadius: 8 }}
          disabled={!connected}
          variant={!connected ? "outlined" : "contained"}
          size="large"
          startIcon={<SyncIcon />}
          onClick={() => syncClicked()}
        >
          בצע סינכרון
        </Button>
      )}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, m: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {connected ? "ההתקן מחובר לרשת" : "ממתין לחיבור רשת..."}
          <br />
        </Typography>
        <Typography variant="body" color="text.secondary">
          לעידכון הגדרות החיבור, <Link underline="none" href="#" onClick={() => onConfigRequest()}>לחץ כאן</Link>
        </Typography>
      </Box>
    </Box>
  );
}
