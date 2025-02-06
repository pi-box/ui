import React, {useState, useEffect} from 'react';
import useWebSocket from 'react-use-websocket';
import { useSnackbar } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import LinearProgress from '@mui/material/LinearProgress';

import SyncIcon from '@mui/icons-material/Sync';


export default function Sync(props) {
	const connUrl = "conn/";
	const syncUrl = "sync/";
	const wsUrl = `ws://${window.location.host}/websocket/`;
	//const connUrl = "http://192.168.31.70:8094/conn/";
	//const syncUrl = "http://192.168.31.70:8094/sync/";
	//const wsUrl = "ws://192.168.31.70:8094/websocket/";

	const {onConfigRequest} = props;

	const [connected, setConnected] = useState(false);
	const [syncMode, setSyncMode] = useState("waiting");
	const [loopTimer, setLoopTimer] = useState(null);
	const [fileSize, setFileSize] = useState({current:0, total:0, percent:0});
	const {enqueueSnackbar} = useSnackbar();
	// eslint-disable-next-line
	const {sendMessage, lastMessage, readyState} = useWebSocket(wsUrl, { shouldReconnect: (closeEvent) => true, reconnectAttempts: 20, reconnectInterval: 1000, share: true });
	
	const syncTitles = {"checkConn": "בודק חיבור רשת...", "startSync": "מחפש עידכונים חדשים", "copyFiles": `עודכנו ${fileSize.current} מגה (מתוך ${fileSize.total} סה"כ)`}

	useEffect(() => {
		checkConnectivity()
		// eslint-disable-next-line
  }, []);
	
	useEffect(() => {
		if (syncMode === "waiting") {
			setFileSize({current:0, total:0, percent:0})
		}
  }, [syncMode]);
	
	useEffect(() => {
		if (lastMessage) {
			var result = JSON.parse(lastMessage.data);
			if (result._type==="progress") {
				setFileSize({current:result._data.current, total:result._data.total, percent:(100*result._data.current)/result._data.total})
				setSyncMode("copyFiles")
			} else if (result._type==="complete") {
				if (result.status==="ok") {
					enqueueSnackbar("התהליך הסתיים בהצלחה!", { variant: "success",});
				} else {
					enqueueSnackbar(result._msg, { variant: result.status,});
				}
				setSyncMode("waiting");
			}
		}
		// eslint-disable-next-line
  }, [lastMessage]); 
	
	useEffect(() => {
		if (readyState===1 && syncMode !== "waiting") {
			console.log(`${syncUrl}status`)
			fetch(`${syncUrl}status`)
				.then(res => res.json())
				.then(res => {
					if (res.status==="ok" && !res.in_progress) {
						setSyncMode("waiting");
					}
				});
		};
		// eslint-disable-next-line
  }, [readyState]);
	
	const checkConnectivity = (inLoop=false, func=null) => {
		let result = false;
		let setTimer = false;
		let url = `${connUrl}`;
		fetch(url)
			.then(res => res.json())
			.then(res => {
				if (res.status==="ok") {
					result = res.connected
					if (res.connected) {
						setLoopTimer(null)
					} else {
						if (!loopTimer || inLoop) setTimer = true
					}
				}
			}).catch(error => {
				console.log(error)
				result = false
				setTimer = true
			}).finally(() => {
				setConnected(result)
				if (setTimer) {
					let timer = setTimeout(() => checkConnectivity(true), 2000);
					setLoopTimer(timer)
				}
				if (func) func(result)
			});
	};
	
	const syncClicked = () => {
		setSyncMode("checkConn")
		checkConnectivity(false, res=>{
			if (res) {
				setSyncMode("startSync")
				fetch(syncUrl)
			} else {
				setSyncMode("waiting")
				enqueueSnackbar("אין גישה לרשת. הפעולה בוטלה!", { variant: "error",});
			}
		});
	};
	
	const configClicked = () => {
		if (syncMode !== "waiting") {
			enqueueSnackbar("לא ניתן לעדכן הגדרות בזמן סינכרון", { variant: "warning",});
		} else {
			clearTimeout(loopTimer)
			onConfigRequest()
		}
	};
	
  return (
 
		<Box sx={{mt: 25, display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
			{syncMode !== "waiting" ?
			<>
			<img src="loading.jpg" width="85px" height="85px" alt="" />
			<Box sx={{width:1, alignItems:'right', px:6, mt:10}}>
			
			<Typography  variant="body" color="text.secondary"><b>{syncTitles[syncMode]}</b></Typography>
			<Box mt={2} />
			<ThemeProvider theme={outerTheme => ({ ...outerTheme, direction: 'ltr' })}>

			<LinearProgress variant="determinate"  value={fileSize.percent}  />
			</ThemeProvider>
			</Box>
			</>
			:
			<Button  sx={{width:230, height:70, pb:1.5, fontSize: 20, borderRadius: 8,}} disabled={!connected} variant={!connected?"outlined":"contained"} size="large" startIcon={<SyncIcon />} onClick={()=>syncClicked()}>
        בצע סינכרון
      </Button>
			}
			<Box sx={{position: 'fixed', bottom: 0, left: 0, m:3}} >
				<Typography variant="body2" color="text.secondary">{connected?"ההתקן מחובר לרשת":"ממתין לחיבור רשת..."}<br/></Typography>
				<Typography variant="body" color="text.secondary">לעידכון הגדרות החיבור, <Link underline="none" href="#" onClick={()=>configClicked()}>לחץ כאן</Link></Typography>
			</Box>


		</Box>
  );
}