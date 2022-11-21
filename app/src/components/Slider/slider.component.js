import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import { useDispatch, useSelector } from 'react-redux';
import { modifyExperience } from '../../reduxSlices/filterSlice';
import './slider.scss';

function createMarks(min, max, step) {
    let output = [];
    for (let i = min; i <= max; i += step) {
        if (i !== max) {
            output.push({
                value: i,
                label: i.toString()
            });
        } else {
            output.push({
                value: i,
                label: i.toString() + '+'
            });
        }
    }

    return output;
}

export default function SliderField({ defaultValue, step, min, max }) {
    const dispatch = useDispatch();
    let marks = createMarks(min, max, step);

    const filterInfo = useSelector((state) => state?.filter);

    const [value, setValue] = useState(defaultValue);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        dispatch(modifyExperience(newValue));
    };

    return (
        <React.Fragment>
            <Slider
                value={filterInfo?.experience ? filterInfo?.experience : 0}
                valueLabelDisplay="auto"
                step={step}
                min={min}
                max={max}
                marks={marks}
                onChange={handleChange}
                className="slider"
            />
        </React.Fragment>
    );
}
