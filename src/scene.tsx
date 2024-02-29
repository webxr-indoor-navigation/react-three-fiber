import React, {Suspense, useEffect, useState, useRef} from "react";
import {Line, Text} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {POI, Point} from "./types";
import {Vector3, Group, Mesh} from "three";
import {NavMesh} from "nav2d";

interface SceneProps {
    startPOI: POI;
    endPOI: POI;
    corridorJsonPath: string;
}

const indicator_height: number = 1.5;
const signage_height: number = 0.2;
const camera_height: number = 1.1;
const walkable_area_height: number = -0.5;
const groupRef_height: number = 1.5 - camera_height;

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
                    {props.endPOI.name}
                </Text>
            </Suspense>
        </mesh>
    )
}

function VirtualSignage(props: LineProps) {
    const {camera} = useThree();
    const [points, setPoints] = useState<Array<number>>([0, -0.7, 0, 0, -0.7, -1])

    // Update line position every frame
    useFrame(() => {
        if (camera.position && props.path) {
            const cameraPosition = new Vector3();
            const updatedPoints: number[] = [];

            camera.getWorldPosition(cameraPosition);
            updatedPoints.push(cameraPosition.x, signage_height, cameraPosition.z);

            props.path.forEach((point: { x: number; y: number; }) => {
                updatedPoints.push(point.x, signage_height, point.y);
            });

            setPoints(updatedPoints);
        } else {
            setPoints([0, -0.7, 0, 0, -0.7, -1])
        }
    });

    return (
        <Line points={points} linewidth={10} color={"red"}/>
    );
}

function WalkableArea(props: LineProps) {
    const [points, setPoints] = useState<Array<number>>([0, -0.7, 0, 0, -0.7, -1])

    // Update line position every frame
    useFrame(() => {
        if (props.path) {
            const updatedPoints: number[] = [];

            props.path.forEach((point: { x: number; y: number; }) => {
                updatedPoints.push(point.x, walkable_area_height, point.y);
            });

            updatedPoints.push(props.path[0].x, walkable_area_height, props.path[0].y);

            setPoints(updatedPoints);

        } else {
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

    function getPointOnRayFromP1ToP2(POI:POI): Point {
        const distance = 0.5;

        const dx = POI.facing.x - POI.x;
        const dy = POI.facing.y - POI.y;

        // 计算向量长度
        const length = Math.sqrt(dx * dx + dy * dy);

        // 计算单位向量
        const unitX = dx / length;
        const unitY = dy / length;

        // 计算新点的坐标
        const newX = POI.x + unitX * distance;
        const newY = POI.y + unitY * distance;

        return {x: newX, y: newY};
    }

    useEffect(() => {
        // distance control: from QR-code to camera
        const cameraPosition: Point = getPointOnRayFromP1ToP2(props.startPOI);
        groupRef.current!.position.set(cameraPosition.x, groupRef_height, cameraPosition.y);
        groupRef.current!.lookAt(props.startPOI.x, groupRef_height, props.startPOI.y)
        groupRef.current!.rotateY(Math.PI)
    }, [props.startPOI]);

    // Update line position every frame
    useFrame(() => {
        if (camera.position && navMesh) {
            const cameraPosition = new Vector3();
            camera.getWorldPosition(cameraPosition);
            const path = navMesh.findPath({x: cameraPosition.x, y: cameraPosition.z}, {
                x: props.endPOI.x,
                y: props.endPOI.y
            });
            setPath(path)
            console.log(path)
        } else {
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
            <VirtualSignage path={path}/>
            <WalkableArea path={polygonPoints[0]}></WalkableArea>

        </>
    )
}