import {ARButton, Controllers, XR} from "@react-three/xr";
import {Canvas} from "@react-three/fiber";
import Scene from "./scene";
import React, {useEffect, useState} from "react";
import {PoiItem} from "./types";
import POIsWindow from "./POIsWindow";

export default function Navigator({poiJsonPath}: any) {
    const [endPOI, setEndPOI] = useState<PoiItem>();
    const [startPOI, setStartPOI] = useState<PoiItem>();
    const [options, setOptions] = useState<PoiItem[]>([] as PoiItem[]); // 使用类型断言来指定初始类型

    useEffect(() => {
        fetch(poiJsonPath)
            .then(response => response.json())
            .then((data: PoiItem[]) => {
                setOptions(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [poiJsonPath]);

    const handleDropdownChange = (selectedUuid: string) => {
        const selectedPOI = options.find(poi => poi.uuid === selectedUuid);
        setEndPOI(selectedPOI!);
    };

    return (
        <>
            <ARButton/>
            <POIsWindow options={options} onChange={handleDropdownChange}/>
            <Canvas>
                <XR referenceSpace="local">
                    {
                        endPOI && (
                            <Scene endPOI={endPOI} />
                        )
                    }
                    <Controllers/>
                </XR>
            </Canvas>

        </>
    )
}
