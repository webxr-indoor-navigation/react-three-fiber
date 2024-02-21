import React, {useEffect, useState} from 'react';
import Select from 'react-select';

import {PoiItem} from "./types";

interface POIsMenuProps {
    options: PoiItem[];
    onChange: (selectedUuid: string) => void;
}

const convertPoiItemToSelectOption = (poiItem: PoiItem): { label: string; value: string } => (
    {
        label: poiItem.name,
        value: poiItem.uuid
    });

export default function POIsWindow(props: POIsMenuProps) {
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        setOptions(props.options.map(convertPoiItemToSelectOption))
    }, [props.options]);

    const handleDropdownChange = (selectedOption: any) => {
        if (selectedOption) {
            props.onChange(selectedOption['value'])
        }
    };

    return (
        <>
            <Select
                className="basic-single"
                classNamePrefix="select"
                onChange={handleDropdownChange}
                isSearchable={true}
                name="color"
                options={options}
            />

        </>
    );
};