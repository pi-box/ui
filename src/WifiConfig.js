import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import WifiTetheringIcon from '@mui/icons-material/WifiTethering';

/**
 * WiFi Configuration Component for Pi-Box UI
 * 
 * This component allows users to scan available WiFi networks and connect to them.
 * It provides a UI for selecting an SSID, entering a password, and initiating the connection.
 * 
 * Features:
 * - Fetches available WiFi networks from the server
 * - Allows users to select a network and enter credentials
 * - Sends connection request to the backend
 * - Displays connection status with feedback messages
 * 
 * Usage:
 * Used in `App.js`, allowing users to configure network settings.
 */

export default function WifiConfig(props) {
  const baseUrl = "wifi/";
  const { onConfigEnded } = props;
  const [backdrop, setBackdrop] = useState(false);
  const [mode, setMode] = useState("ssid");
  const [state, setState] = useState({ ssid: "", pwd: "", hasError: false });
  const [ssids, setSsids] = useState([]);
  const [title, setTitle] = useState("בחר מהרשימה את הרשת האלחוטית הרצויה");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    reloadSsids();
  }, []);

  /**
   * Fetches available WiFi networks and updates state.
   */
  const reloadSsids = () => {
    setMode("ssid");
    setTitle("בחר מהרשימה את הרשת האלחוטית הרצויה");
    setState({ ssid: "סורק רשתות...", pwd: "", hasError: false });
    setSsids(["סורק רשתות..."]);
    setBackdrop(true);

    fetch(baseUrl)
      .then(res => res.json())
      .then(res => {
        if (res.status === "ok" && res.ssids.length > 0) {
          setSsids(res.ssids);
          setState(prev => ({ ...prev, ssid: res.ssids[0] }));
        } else {
          throw new Error("No SSIDs found");
        }
      })
      .catch(() => {
        setSsids(["לא נמצאות רשתות"]);
        setState({ ssid: "לא נמצאות רשתות", pwd: "", hasError: true });
      })
      .finally(() => setBackdrop(false));
  };

  /**
   * Handles connection attempt when user provides SSID and password.
   */
  const btnClicked = () => {
    if (mode === "ssid") {
      setTitle("הזן את סיסמת האבטחה של הרשת");
      setMode("pwd");
    } else {
      setBackdrop(true);
      fetch(`${baseUrl}?ssid=${state.ssid}&pwd=${state.pwd}`)
        .then(res => res.json())
        .then(res => {
          if (res.status === "ok") {
            setMode("Configured");
            enqueueSnackbar("הגדרות החיבור נשמרו בהצלחה!", { variant: "success" });
            onConfigEnded();
          } else {
            enqueueSnackbar(res.msg, { variant: "error" });
          }
        })
        .catch(() => {
          enqueueSnackbar("תקלה בחיבור לרשת האלחוטית", { variant: "error" });
          reloadSsids();
        })
        .finally(() => setBackdrop(false));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Backdrop sx={{ zIndex: 100, color: '#fff' }} open={backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ mt: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><WifiTetheringIcon /></Avatar>
        <Typography component="h1" variant="h5">רשת אלחוטית</Typography>
        <Typography sx={{ width: 1, mt: 5, fontWeight: 500 }} align="center">{title}</Typography>

        {mode === "ssid" && (
          <TextField select disabled={state.hasError} variant="outlined" fullWidth dir="rtl" id="ssid" label="רשת אלחוטית" value={state.ssid} onChange={(e) => setState({ ...state, ssid: e.target.value })}>
            {ssids.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </TextField>
        )}

        {mode === "pwd" && (
          <TextField variant="outlined" fullWidth type="password" id="password" label="סיסמא" autoComplete="סיסמא" value={state.pwd} onChange={(e) => setState({ ...state, pwd: e.target.value })} />
        )}

        <Grid container sx={{ width: 1, m: 2 }} justifyContent="space-between">
          <Grid item>
            {mode === "ssid" && <Link href="#" onClick={() => reloadSsids()}>רענן רשימת רשתות אלחוטיות</Link>}
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth disabled={state.hasError} variant={state.hasError ? "outlined" : "contained"} onClick={btnClicked}>{mode === "ssid" ? "הבא" : "התחבר"}</Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
