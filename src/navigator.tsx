import {ARButton, Controllers, XR} from "@react-three/xr";
import {Canvas} from "@react-three/fiber";
import Scene from "./scene";
import React, {useEffect, useState} from "react";
import {POI} from "./types";
import POIsWindow from "./POIsWindow";

interface NavigatorProps {
    poiJsonPath: string;
    startUUID: string;
}

export default function Navigator(props: NavigatorProps) {
    const [endPOI, setEndPOI] = useState<POI>();
    const [startPOI, setStartPOI] = useState<POI>();
    const [options, setOptions] = useState<POI[]>([] as POI[]); // 使用类型断言来指定初始类型


    useEffect(() => {
        fetch(props.poiJsonPath)
            .then(response => response.json())
            .then((data: POI[]) => {
                setOptions(data);
            })
            .catch(error => console.error('Error fetching data:', error))

    }, [props.poiJsonPath]);

    useEffect(() => {
        const selectedPOI = options.find(poi => poi.uuid === props.startUUID);
        if (selectedPOI) {
            setStartPOI(selectedPOI);
            console.log("find the startUUID: " + selectedPOI.name);
        } else {
            console.log("not find the startUUID: " + props.startUUID);
        }
    }, [props.startUUID, options]);

    const handleDropdownChange = (selectedUuid: string) => {
        const selectedPOI = options.find(poi => poi.uuid === selectedUuid);
        setEndPOI(selectedPOI!);
    };

    return (
        <>
            <POIsWindow options={options} onChange={handleDropdownChange}/>
            <Canvas>
                <XR referenceSpace="local-floor">
                    {
                        endPOI && startPOI && (
                            <Scene endPOI={endPOI} startPOI={startPOI!}/>
                        )
                    }
                    <Controllers/>
                </XR>
            </Canvas>

        </>
    )
}
