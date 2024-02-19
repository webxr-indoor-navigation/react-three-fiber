import React, {Suspense, useState} from 'react'
import {Interactive, XR, ARButton, Controllers} from '@react-three/xr'
import './App.css'
import {Canvas} from '@react-three/fiber'
import Scene from "./scene";


export default function App() {
    return (
        <>
            <ARButton/>
            <Canvas>
                <XR referenceSpace="local">
                    <Scene></Scene>
                    <Controllers />
                </XR>
            </Canvas>
        </>
    )
}
