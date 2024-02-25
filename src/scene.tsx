import React, {Suspense, useEffect, useState, useRef} from "react";
import {Interactive} from "@react-three/xr";
import {Line, Text} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {POI} from "./types";
import {Vector3, Group, Mesh} from "three";

interface SceneProps {
    startPOI: POI;
    endPOI: POI;
}

const indicator_height: number = 1.2;

interface IndicatorProps {
    endPOI: POI;
}

interface LineProps {
    endPOI: POI;
}


function Indicator(props: IndicatorProps) {
    const indicatorRef = useRef<Mesh>(null);

    useEffect(() => {
        indicatorRef.current!.position.set(props.endPOI.X, indicator_height, props.endPOI.Y);
        indicatorRef.current!.lookAt(props.endPOI.facing.X, indicator_height, props.endPOI.facing.Y)
    },);

    return (
        <mesh ref={indicatorRef}>
            <boxGeometry args={[0.4, 0.1, 0.1]}/>
            <meshPhongMaterial color={'blue'}/>
            <Suspense fallback={null}>
                <Text position={[0, 0, 0.06]} fontSize={0.05} color="#000" anchorX="center" anchorY="middle">
                    Test
                </Text>
            </Suspense>
        </mesh>
    )
}

function Line2Button(props: LineProps) {
    const {camera} = useThree();
    const [points, setPoints] = useState<Array<number>>([0, -0.7, 0, 0, -0.7, -1])
    const line_height: number = 0.5;

    // Update line position every frame
    useFrame(() => {
        if (camera.position) {
            const cameraPosition = new Vector3();
            camera.getWorldPosition(cameraPosition);
            setPoints([cameraPosition.x, line_height, cameraPosition.z, props.endPOI.X, line_height, props.endPOI.Y]);
        }
    });

    return (
        <Line points={points} linewidth={10} color={"red"}/>
    );
}


export default function Scene(props: SceneProps) {
    const {camera} = useThree();
    const groupRef = useRef<Group>(null);

    useEffect(() => {
        groupRef.current!.position.set(props.startPOI.facing.X, 0, props.startPOI.facing.Y);
        groupRef.current!.lookAt(props.startPOI.X, 0, props.startPOI.Y)
        groupRef.current!.rotateY(Math.PI)
    }, [props.startPOI]);

    return (
        <>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <group ref={groupRef}>
                <primitive object={camera}/>
            </group>
            <Indicator endPOI={props.endPOI}/>
            <Line2Button endPOI={props.endPOI}/>

        </>
    )
}