import React, { Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './jobDropdown.scss';

const defaultFamily = [{ name: 'Job Families' }];

const QUERY_JOB_FAMILIY = gql`
    query JobFamily {
        jobFamilies(options: { sort: [{ name: ASC }] }) {
            name
        }
    }
`;

export default function JobDropdown() {
    const { data: jobFamilyData } = useQuery(QUERY_JOB_FAMILIY);
    console.log('Job Family : ', jobFamilyData?.jobFamilies);
    return (
        <Fragment>
            <Autocomplete
                multiple
                id="size-small-outlined-multi"
                size="small"
                limitTags={1}
                options={
                    jobFamilyData?.jobFamilies
                        ? jobFamilyData?.jobFamilies
                        : defaultFamily
                }
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} />}
                className="dropdown-autocomplete"
            />
        </Fragment>
    );
}

// import React from 'react';
// import { gql, useQuery } from '@apollo/client';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';

// const QUERY_JOB_FAMILIY = gql`
//     query JobFamily {
//         jobFamilies(options: { sort: [{ name: ASC }] }) {
//             name
//         }
//     }
// `;

// export default function JobDropdown() {
//     const { data: jobFamilyData } = useQuery(QUERY_JOB_FAMILIY);
//     return (
//         <Autocomplete
//             multiple
//             id="size-small-outlined-multi"
//             size="small"
//             options={jobFamilyData?.jobFamilies}
//             getOptionLabel={(option) => option.name}
//             renderInput={(params) => (
//                 <TextField {...params} placeholder="Job Family" />
//             )}
//         />
//     );
// }
