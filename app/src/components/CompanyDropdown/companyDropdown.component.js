import React, { Fragment, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { modifyCompanies } from '../../reduxSlices/filterSlice';
import { defaultValues } from '../../config';
import './companyDropdown.scss';

const defaultCompanies = defaultValues.company_to_company_types;

const QUERY_COMPANIES = gql`
    query Companies {
        companies(options: { sort: [{ name: ASC }] }) {
            name
            company_type {
                name
            }
        }
    }
`;

export default function CompanyDropdown() {
    const { data: companiesData } = useQuery(QUERY_COMPANIES);

    const dispatch = useDispatch();
    const [checked, setChecked] = useState([]);

    const filterInfo = useSelector(
        (state) => state?.filter?.company_to_company_types
    );

    const handleChange = (event, newValue) => {
        setChecked(newValue);
        dispatch(modifyCompanies(newValue));
    };

    return (
        <Fragment>
            <Autocomplete
                multiple
                id="size-small-outlined-multi"
                size="small"
                limitTags={5}
                onChange={handleChange}
                options={
                    companiesData?.companies
                        ? defaultCompanies.filter(
                              (x) => !companiesData?.companies.includes(x)
                          )
                        : defaultCompanies
                }
                value={filterInfo}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} />}
                className="dropdown-companies"
            />
        </Fragment>
    );
}
