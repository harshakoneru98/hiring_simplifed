import React, { Fragment, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from 'react-redux';
import { modifyEducation } from '../../reduxSlices/filterSlice';
import FormControlLabel from '@mui/material/FormControlLabel';
import './checkbox.scss';

export default function CheckboxEducation({ checks }) {
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(checks);

    const filterInfo = useSelector((state) => state?.filter?.education);

    const handleChange = (event) => {
        let new_values = [...filterInfo];
        new_values[event.target.name] = !filterInfo[event.target.name];
        setChecked(new_values);
        dispatch(modifyEducation(new_values));
    };

    return (
        <Fragment>
            <Col xs={3}>
                <FormControlLabel
                    control={<Checkbox checked={filterInfo[0]} size="small" />}
                    label="Bachelor Degree"
                    className="education-label"
                    name={0}
                    onChange={handleChange}
                />
            </Col>
            <Col xs={3}>
                <FormControlLabel
                    control={<Checkbox checked={filterInfo[1]} size="small" />}
                    label="Master Degree"
                    className="education-label"
                    name={1}
                    onChange={handleChange}
                />
            </Col>
            <Col xs={3}>
                <FormControlLabel
                    control={<Checkbox checked={filterInfo[2]} size="small" />}
                    label="PhD Degree"
                    className="education-label"
                    name={2}
                    onChange={handleChange}
                />
            </Col>
        </Fragment>
    );
}
