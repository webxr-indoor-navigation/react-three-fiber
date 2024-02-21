import React from 'react';
import { PoiItem } from "./types";

interface POIsMenuProps {
    options: PoiItem[];
    onChange: (selectedUuid: string) => void;
}


export default function POIsWindow(props: POIsMenuProps) {
    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUuid = event.target.value;
        props.onChange(selectedUuid);
    };

    return (
        <select onChange={handleDropdownChange}>
            {props.options.map(option => (
                <option key={option.uuid} value={option.uuid}>{option.name}</option>
            ))}
        </select>
    );


}
