import React from 'react'
import './App.css'

import Navigator from "./navigator";


export default function App() {
    return (
        <>
            <Navigator poiJsonPath={process.env.PUBLIC_URL+'/test/poi.json'}  startUUID={'12beebf7-6a6d-4c33-ba9f-3d96887a48cf'}/>
        </>
    )
}
