import {ARButton, Controllers, XR} from "@react-three/xr";
import {Canvas} from "@react-three/fiber";
import Scene from "./scene";
import React, {useEffect, useState} from "react";
import {PoiItem} from "./types";
import POIsWindow from "./POIsWindow";


export default function Navigator({poiJsonPath}: any) {
    const [POI, setPOI] = useState<PoiItem>();
    const [options, setOptions] = useState<PoiItem[]>([] as PoiItem[]); // 使用类型断言来指定初始类型

    useEffect(() => {
        fetch(poiJsonPath)
            .then(response => response.json())
            .then((data: PoiItem[]) => {
                setOptions(data); // 直接设置数据，无需额外的映射
                setPOI(data[0])
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [poiJsonPath]);

    const handleDropdownChange = (selectedUuid: string) => {
        const selectedPOI = options.find(poi => poi.uuid === selectedUuid);
        setPOI(selectedPOI!);
    };

    return (
        <>
            <ARButton/>
            <POIsWindow options={options} onChange={handleDropdownChange}/>
            <Canvas>
                <XR referenceSpace="local">
                    {
                        POI && (
                            <Scene POI={POI!}/>
                        )
                    }
                    <Controllers/>
                </XR>
            </Canvas>

        </>
    )
}
