import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import { useDispatch, useSelector } from 'react-redux';
import { modifySalary } from '../../reduxSlices/filterSlice';
import './rangeSlider.scss';

function createMarks(min, max, step) {
    let output = [];
    for (let i = min; i <= max; i += step) {
        if (i !== max) {
            output.push({
                value: i,
                label: i.toString() + 'k'
            });
        } else {
            output.push({
                value: i,
                label: i.toString() + 'k+'
            });
        }
    }

    return output;
}

export default function RangeSliderField({
    min_value,
    max_value,
    step,
    min,
    max
}) {
    const dispatch = useDispatch();
    let marks = createMarks(min, max, step);

    const filterInfo = useSelector((state) => state?.filter?.salary);

    const [value, setValue] = useState([min_value, max_value]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        dispatch(modifySalary(newValue));
    };

    return (
        <React.Fragment>
            <Slider
                valueLabelDisplay="auto"
                marks={marks}
                value={filterInfo ? filterInfo : [50, 300]}
                min={min}
                max={max}
                step={step}
                onChange={handleChange}
                className="slider"
            />
        </React.Fragment>
    );
}
