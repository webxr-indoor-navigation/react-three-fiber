import React, {Suspense, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Interactive} from "@react-three/xr";
import {Line, Text} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {PoiItem} from "./types";

interface SceneProps {
    POI: PoiItem;
}


function Box({color, size, scale, children, ...rest}: any) {
    return (
        <mesh scale={scale} {...rest}>
            <boxGeometry args={size}/>
            <meshPhongMaterial color={color}/>
            {children}
        </mesh>
    )
}

function Line2Button() {
    const {camera} = useThree();
    const [points, setPoints] = useState<Array<number>>([0, -0.7, 0, 0, -0.7, -1])

    // Update line position every frame
    useFrame(() => {
        if (camera.position) {
            const cameraPosition = camera.position;
            setPoints([cameraPosition.x, -0.7, cameraPosition.z, 0, -0.7, -1]);
        }
    });

    return (
        <Line points={points} linewidth={10} color={"red"}/>
    );
}

function Button(props: any) {
    const [hover, setHover] = useState(false)
    const [color, setColor] = useState<any>('blue')

    const onSelect = () => {
        setColor((Math.random() * 0xffffff) | 0)
    }

    return (
        <Interactive onHover={() => setHover(true)} onBlur={() => setHover(false)} onSelect={onSelect}>
            <Box color={color} scale={hover ? [0.6, 0.6, 0.6] : [0.6, 0.6, 0.6]} size={[0.4, 0.1, 0.1]} {...props}>
                <Suspense fallback={null}>
                    <Text position={[0, 0, 0.06]} fontSize={0.05} color="#000" anchorX="center" anchorY="middle">
                        {props.text}
                    </Text>
                </Suspense>
            </Box>
        </Interactive>
    )
}

export default function Scene(props: SceneProps) {

    return (
        <>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <Button position={[0, 0, -1]} text={props.POI.name}/>
            <Line2Button/>
        </>
    )
}