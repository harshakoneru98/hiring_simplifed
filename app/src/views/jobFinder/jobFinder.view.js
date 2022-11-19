import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import './jobFinder.scss';

const QUERY_JOB_DATA = gql`
    query Skills($options: JobOptions) {
        jobs(options: $options) {
            name
            Title
            city {
                name
            }
            state {
                name
            }
            company {
                name
                company_type {
                    name
                }
            }
            job_family {
                name
            }
            education {
                name
            }
            H1B_flag
            JD
            Salary
            Work_Min
            Work_Max
            job_url
            req_skills {
                name
            }
        }
    }
`;

export default function JobFinderView() {
    const {
        data: jobData,
        loading: jobLoading,
        error: jobError,
        refetch
    } = useQuery(QUERY_JOB_DATA, {
        variables: {
            options: {
                limit: 5
            }
        }
    });

    useEffect(() => {
        console.log('Data: ', jobData);
    }, [jobData]);

    return (
        <div className="container">
            <div className="row">
                <div className="main_content">
                    <h2 className="job-search-header">
                        Ready to find your next Job?
                    </h2>
                </div>
            </div>
        </div>
    );
}
