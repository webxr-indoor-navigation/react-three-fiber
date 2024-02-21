import React, {Suspense, useState} from 'react'
import './App.css'

import Navigator from "./navigator";


export default function App() {
    return (
        <>
            <Navigator poiJsonPath={process.env.PUBLIC_URL+'/test/poi.json'}/>
        </>
    )
}
