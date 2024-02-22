import React, {Suspense, useState} from "react";
import {Interactive} from "@react-three/xr";
import {Line, Text} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {POI} from "./types";
import {Vector3} from "three";

interface SceneProps {
    startPOI: POI;
    endPOI: POI;
}

interface ButtonProps {
    endPOI: POI;
}
interface LineProps {
    endPOI: POI;
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

function Button(props: ButtonProps) {
    const [hover, setHover] = useState(false)
    const [color, setColor] = useState<any>('blue')
    const button_height: number = 1.2;

    const onSelect = () => {
        setColor((Math.random() * 0xffffff) | 0)
    }

    return (
        <Interactive onHover={() => setHover(true)} onBlur={() => setHover(false)} onSelect={onSelect}>
            <Box color={color} scale={hover ? [0.6, 0.6, 0.6] : [0.6, 0.6, 0.6]} size={[0.4, 0.1, 0.1]}
                 position={[props.endPOI.X, button_height, props.endPOI.Y]}>
                <Suspense fallback={null}>
                    <Text position={[0, 0, 0.06]} fontSize={0.05} color="#000" anchorX="center" anchorY="middle">
                        Test
                    </Text>
                </Suspense>
            </Box>
        </Interactive>
    )
}

export default function Scene(props: SceneProps) {
    const {camera} = useThree();

    return (
        <>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <group position={[props.startPOI.X, 0, props.startPOI.Y]}>
                <primitive object={camera}/>
            </group>
            <Line2Button endPOI={props.endPOI}/>
            <Button endPOI={props.endPOI}/>

        </>
    )
}