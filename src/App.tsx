import React from 'react'
import './App.css'

import Navigator from "./navigator";


export default function App() {
    return (
        <>
            <Navigator poiJsonPath={process.env.PUBLIC_URL+'/test/poi.json'}  startUUID={'25adc303-3adb-4402-9f44-55477d64cffa'}/>
        </>
    )
}
