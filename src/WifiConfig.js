import React, {useState, useEffect} from 'react';
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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center" dir="rtl">
			{'© כל הזכויות שמורות ל-'}
      <Link underline="none" color="inherit" href="https://t.me/+wZ5XxzRheSRhNTE0">
				{'PI-Box Media Center'}
      </Link>
			{'.'}      
    </Typography>
  );
}

export default function WifiConfig(props) {
	//const baseUrl = "http://192.168.31.70:8094/wifi/";
	const baseUrl = "wifi/";
	const {onConfigEnded} = props;
	const [backdrop, setBackdrop] = useState(false);
	const [mode, setMode] = useState("ssid");
	const [state, setState] = useState({ssid:"", pwd:"", hasError: false});
	const [ssids, setSsids] = useState([]);
	const [title, setTitle] = useState("בחר מהרשימה את הרשת האלחוטית הרצויה");
	const [info, setInfo] = useState();
	const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
		reloadSsids()
  }, []);
	
	const reloadSsids = () => {
		setMode("ssid");
		setInfo("");
		setTitle("בחר מהרשימה את הרשת האלחוטית הרצויה");
		var defaultSsid = "סורק רשתות...";
		setState({ssid:defaultSsid, pwd:"", hasError: false});
		setSsids([defaultSsid]);

		setBackdrop(true)
		var url = `${baseUrl}`;
		fetch(url)
			.then(res => res.json())
			.then(res => {
				if (res.status==="ok" && res.ssids.length>0) {
					setSsids(res.ssids)
					setState(prev=>({...prev, ssid: res.ssids[0]}));
				} else {
					// eslint-disable-next-line
					throw "status failed or no ssids";
				}
			}).catch(error => {
				var defaultSsid = "לא נמצאות רשתות"
				setSsids([defaultSsid])
				setState({ssid:defaultSsid, pwd:"", hasError: true});
			}).finally(function() {
				setBackdrop(false)
			});
	};
	
	const btnClicked = () => {
		if (mode==="ssid") {
			setTitle("הזן את סיסמת האבטחה של הרשת");
			setMode("pwd");
		} else {
			if (true) {
				setBackdrop(true)
				var url = baseUrl;
				url += `?ssid=${state.ssid}&pwd=${state.pwd}`;
				fetch(url)
					.then(res => res.json())
					.then(res => {
						if (res.status==="ok") {
							setMode("Configured");
							enqueueSnackbar("הגדרות החיבור נשמרו בהצלחה!", { variant: "success",});
							onConfigEnded();
						} else {
							enqueueSnackbar(res.msg, { variant: "error",});
						}
					})
					.catch(res => {
						enqueueSnackbar("תקלה בחיבור לרשת האלחוטית", { variant: "error",});
						reloadSsids();
					})
					.finally(() => {setBackdrop(false)})
			}
		}
	};

  return (
		<Container component="main" maxWidth="xs">
			<Backdrop sx={{zIndex: 100, color: '#fff'}} open={backdrop}>
				<CircularProgress color="inherit" />
			</Backdrop>

			<Box sx={{mt: 15, display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
				<Avatar sx={{m: 1, bgcolor: 'secondary.main'}}><WifiTetheringIcon /></Avatar>
        <Typography component="h1" variant="h5">רשת אלחוטית</Typography>
				<Typography sx={{width: 1, mt: 5, fontWeight: 500,}} align="center">{title}</Typography>
				{(mode==="ssid") && 
				<TextField select disabled={state.hasError} variant="outlined" margin="normal" fullWidth dir="rtl" id="ssid" label="רשת אלחוטית" name="ssid" autoComplete="רשת אלחוטית" value={state.ssid} onChange={(e)=>setState({...state, ssid: e.target.value})} InputLabelProps={{shrink: true,}}>
					{ssids.map((option) => (
					<MenuItem key={option} value={option}>{option}</MenuItem>
					))}
				</TextField>
				}
        {mode==="pwd" && <TextField variant="outlined" margin="normal" required fullWidth type="password" id="password" label="סיסמא" name="password" autoComplete="סיסמא" autoFocus value={state.pwd} onChange={(e)=>setState({...state, pwd: e.target.value})} InputLabelProps={{shrink: true,}} />}
				<Typography sx={{width: 1, m: 1}} variant="body2" color="textSecondary" dir="rtl" align="left">{info}</Typography>
				<Grid container sx={{width: 1,  m: 2}} justifyContent="space-between" alignItems="center">
					<Grid item>
						{mode==="ssid" && <Link href="#" variant="body2" underline="none" onClick={()=>reloadSsids()}>{"רענן רשימת רשתות אלחוטיות"}</Link>}
					</Grid>
					<Grid item xs={3}>
						<Button type="submit" fullWidth disabled={state.hasError} variant={state.hasError?"outlined":"contained"} color="primary" onClick={()=>btnClicked()}>{(mode==="ssid")?"הבא":"התחבר"}</Button>
					</Grid>
        </Grid>
				<Box sx={{position: 'fixed', bottom: 0, mb:3}} ><Copyright /></Box>
			</Box>
			
    </Container>
  );
}