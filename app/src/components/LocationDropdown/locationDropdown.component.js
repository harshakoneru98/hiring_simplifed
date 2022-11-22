import React, { Fragment, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { modifyStates } from '../../reduxSlices/filterSlice';
import { defaultValues } from '../../config';
import './locationDropdown.scss';

const defaultFamily = defaultValues.states;

const QUERY_STATES = gql`
    query States {
        states(options: { sort: [{ fullName: ASC }] }) {
            fullName
        }
    }
`;

export default function LocationDropdown({ check }) {
    const { data: statesData } = useQuery(QUERY_STATES);

    const dispatch = useDispatch();
    const [checked, setChecked] = useState(check);

    const filterInfo = useSelector((state) => state?.filter?.states);

    const handleChange = (event, newValue) => {
        setChecked(newValue);
        dispatch(modifyStates(newValue));
    };

    return (
        <Fragment>
            <Autocomplete
                multiple
                id="size-small-outlined-multi"
                size="small"
                limitTags={1}
                onChange={handleChange}
                options={
                    statesData?.states
                        ? defaultFamily.filter(
                              (x) => !statesData?.states.includes(x)
                          )
                        : defaultFamily
                }
                value={filterInfo}
                getOptionLabel={(option) => option.fullName}
                renderInput={(params) => (
                    <TextField {...params} placeholder="Locations" />
                )}
                className="dropdown-autocomplete"
            />
        </Fragment>
    );
}
