import React, {useState} from 'react';

import WifiConfig from './WifiConfig';
import Sync from './Sync';

export default function App() {
	const [mode, setMode] = useState("sync");
	
	const changeMode = (newMode) => {
		setMode(newMode);
	}
		
  return (
		<>
		{mode==="sync"?
		<Sync onConfigRequest={()=>changeMode("wifiConfig")} />
		:
		<WifiConfig onConfigEnded={()=>changeMode("sync")} />
		}
		</>
  );
}