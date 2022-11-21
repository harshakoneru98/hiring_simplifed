import React, { Fragment, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { modifyJobFamily } from '../../reduxSlices/filterSlice';
import './jobDropdown.scss';

const defaultFamily = [{ name: 'Job Families' }];

const QUERY_JOB_FAMILIY = gql`
    query JobFamily {
        jobFamilies(options: { sort: [{ name: ASC }] }) {
            name
        }
    }
`;

export default function JobDropdown({ check }) {
    const { data: jobFamilyData } = useQuery(QUERY_JOB_FAMILIY);

    const dispatch = useDispatch();
    const [checked, setChecked] = useState(check);

    const filterInfo = useSelector((state) => state?.filter?.job_family);

    const handleChange = (event, newValue) => {
        setChecked(newValue);
        dispatch(modifyJobFamily(newValue));
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
                    jobFamilyData?.jobFamilies
                        ? jobFamilyData?.jobFamilies
                        : defaultFamily
                }
                value={filterInfo}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} />}
                className="dropdown-autocomplete"
            />
        </Fragment>
    );
}
