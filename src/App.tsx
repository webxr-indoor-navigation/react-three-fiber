import React from 'react'
import './App.css'

import Navigator from "./navigator";


export default function App() {
    return (
        <>
            <Navigator poiJsonPath={process.env.PUBLIC_URL+'/test/poi.json'}  startUUID={'1249b4ad-d873-46d2-8699-a4c1a45dfc2f'}/>
        </>
    )
}
