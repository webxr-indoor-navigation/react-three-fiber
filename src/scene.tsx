import React, {Suspense, useEffect, useState, useRef} from "react";
import {Line, Text} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {POI, Point} from "./types";
import {Vector3, Group, Mesh} from "three";
import { NavMesh } from "nav2d";

interface SceneProps {
    startPOI: POI;
    endPOI: POI;
    corridorJsonPath: string;
}

const indicator_height: number = 1.2;

interface IndicatorProps {
    endPOI: POI;
}

interface LineProps {
    path: any
}


function Indicator(props: IndicatorProps) {
    const indicatorRef = useRef<Mesh>(null);

    useEffect(() => {
        indicatorRef.current!.position.set(props.endPOI.x, indicator_height, props.endPOI.y);
        indicatorRef.current!.lookAt(props.endPOI.facing.x, indicator_height, props.endPOI.facing.y)
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
        if (camera.position && props.path) {
            const cameraPosition = new Vector3();
            camera.getWorldPosition(cameraPosition);
            // setPoints([cameraPosition.x, line_height, cameraPosition.z, props.endPOI.x, line_height, props.endPOI.y]);

            const updatedPoints: number[] = [];

            updatedPoints.push(cameraPosition.x, line_height, cameraPosition.z);

            console.log(updatedPoints);

            props.path.forEach((point: { x: number; y: number; }) => {
                updatedPoints.push(point.x, line_height, point.y);
            });

            setPoints(updatedPoints);

        }else{
            setPoints([0, -0.7, 0, 0, -0.7, -1])
        }
    });

    return (
        <Line points={points} linewidth={10} color={"red"}/>
    );
}

function WalkableArea(props: LineProps) {
    const [points, setPoints] = useState<Array<number>>([0, -0.7, 0, 0, -0.7, -1])
    const line_height: number = 0;

    // Update line position every frame
    useFrame(() => {
        if (props.path) {
            const updatedPoints: number[] = [];

            props.path.forEach((point: { x: number; y: number; }) => {
                updatedPoints.push(point.x, line_height, point.y);
            });

            updatedPoints.push(props.path[0].x, line_height, props.path[0].y);

            setPoints(updatedPoints);

        }else{
            setPoints([0, -0.7, 0, 0, -0.7, -1])
        }
    });

    return (
        <Line points={points} linewidth={10} color={"blue"}/>
    );
}



export default function Scene(props: SceneProps) {
    const {camera} = useThree();
    const groupRef = useRef<Group>(null);
    const [navMesh, setNavMesh] = useState<NavMesh>()
    const [path, setPath] = useState<any>(null)
    const [polygonPoints, setPolygonPoints] = useState<any>([])

    useEffect(() => {
        fetch(props.corridorJsonPath)
            .then(response => response.json())
            .then((data: [[Point]]) => {
                setPolygonPoints(data);
                setNavMesh(new NavMesh(data));
            })
            .catch(error => console.error('Error fetching data:', error))
    }, [props.corridorJsonPath]);

    useEffect(() => {
        groupRef.current!.position.set(props.startPOI.facing.x, 0, props.startPOI.facing.y);
        groupRef.current!.lookAt(props.startPOI.x, 0, props.startPOI.y)
        groupRef.current!.rotateY(Math.PI)
    }, [props.startPOI]);

    // Update line position every frame
    useFrame(() => {
        if (camera.position && navMesh) {
            const cameraPosition = new Vector3();
            camera.getWorldPosition(cameraPosition);
            const path = navMesh.findPath({x: cameraPosition.x, y: cameraPosition.z}, {x: props.endPOI.x, y: props.endPOI.y});
            setPath(path)
            console.log(path)
        } else{
            console.log("navMesh not defined !!!")
        }
    });

    return (
        <>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <group ref={groupRef}>
                <primitive object={camera}/>
            </group>
            <Indicator endPOI={props.endPOI}/>
            <Line2Button path={path}/>
            <WalkableArea path={polygonPoints[0]}></WalkableArea>

        </>
    )
}