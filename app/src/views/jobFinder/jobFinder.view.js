import React, { Fragment, useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import FilterListIcon from '@mui/icons-material/FilterList';

import './jobFinder.scss';

const QUERY_USER_DATA = gql`
    query getUserByID($userId: ID!) {
        getUserDataById(userId: $userId) {
            skills
        }
    }
`;

const QUERY_TOTAL_JOBS = gql`
    query JobsAggregate {
        jobsAggregate {
            count
        }
    }
`;

const QUERY_JOB_DATA = gql`
    query Jobs($input: jobDataInput!) {
        getJobData(input: $input) {
            name
            title
            h1b
            jd
            job_url
            job_family
            company
            company_type
            salary
            city
            state
            max_work_exp
            min_work_exp
            education
            skills
        }
    }
`;

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.title}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.company}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.job_family}
                </TableCell>
                <TableCell>{row.city + ', ' + row.state}</TableCell>
                <TableCell>{row.min_work_exp + ' years'}</TableCell>
                <TableCell>{row.salary}</TableCell>
                <TableCell align="right">
                    <a href={row.job_url} target="_blank">
                        Apply
                    </a>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={12}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                More Job Info
                            </Typography>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Company Type</TableCell>
                                    <TableCell>
                                        Education Qualifications
                                    </TableCell>
                                    <TableCell>H1B Sponsorship</TableCell>
                                    <TableCell>Matching Skills</TableCell>
                                    <TableCell>Missing Skills</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableCell>{row.company_type}</TableCell>
                                <TableCell>
                                    {row.education.join(', ')}
                                </TableCell>
                                <TableCell>
                                    {row.h1b == 1 ? 'Yes' : 'No'}
                                </TableCell>
                                <TableCell className="skills-text">
                                    {row.matching_skills.join(', ')}
                                </TableCell>
                                <TableCell className="skills-text">
                                    {row.missing_skills.join(', ')}
                                </TableCell>
                            </TableBody>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                                className="job-description"
                            >
                                Job Description
                            </Typography>
                            <TableBody>
                                <TableCell className="job-description-text">
                                    {row.job_description}
                                </TableCell>
                            </TableBody>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        title: PropTypes.string,
        company: PropTypes.string,
        salary: PropTypes.number,
        job_url: PropTypes.string,
        job_family: PropTypes.string,
        company_type: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        education: PropTypes.array,
        h1b: PropTypes.number,
        matching_skills: PropTypes.array,
        missing_skills: PropTypes.array,
        min_work_exp: PropTypes.number,
        job_description: PropTypes.string
    }).isRequired
};

function createData(data, skills) {
    const final_data = [];

    data?.getJobData.map((job) => {
        const job_skills = job.skills;
        const matching_skills = job_skills.filter((element) =>
            skills.includes(element)
        );
        const missing_skills = job_skills.filter(
            (element) => !skills.includes(element)
        );
        final_data.push({
            title: job.title,
            company: job.company,
            salary: job.salary,
            job_url: job.job_url,
            job_family: job.job_family,
            company_type: job.company_type,
            city: job.city,
            state: job.state,
            education: job.education,
            h1b: job.h1b,
            matching_skills: matching_skills,
            missing_skills: missing_skills,
            min_work_exp: job.min_work_exp,
            job_description: job.jd
        });
    });
    return final_data;
}

export default function JobFinderView() {
    const userId = localStorage.getItem('userId');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data: jobCount } = useQuery(QUERY_TOTAL_JOBS);

    const { data: userData } = useQuery(QUERY_USER_DATA, {
        variables: { userId }
    });

    const {
        data: jobData,
        loading: jobLoading,
        refetch
    } = useQuery(QUERY_JOB_DATA, {
        variables: {
            input: {
                limit: rowsPerPage,
                offset: page * rowsPerPage
            }
        }
    });

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (jobData && !jobLoading && userData) {
            const updated_job_data = createData(
                jobData,
                userData.getUserDataById.skills
            );
            setTableData(updated_job_data);
        }
    }, [jobData, userData, jobLoading]);

    useEffect(() => {
        refetch({
            input: {
                limit: rowsPerPage,
                offset: page * rowsPerPage
            }
        });
    }, [page, rowsPerPage]);

    const emptyRows =
        page > 0
            ? Math.max(
                  0,
                  (1 + page) * rowsPerPage - jobCount?.jobsAggregate?.count
              )
            : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleFirstPageButtonClick = (event) => {
        handleChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        handleChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        handleChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        const count = jobCount?.jobsAggregate?.count;
        handleChangePage(
            event,
            Math.max(0, Math.ceil(count / rowsPerPage) - 1)
        );
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="container job-search-container">
            <div className="row">
                <div className="main_content ">
                    <h2 className="job-search-header">
                        Ready to find your next Job?
                    </h2>
                    <p className="filter-popup">
                        Filters <FilterListIcon />
                    </p>
                    <TableContainer
                        component={Paper}
                        className="job-search-table"
                    >
                        <Table
                            sx={{ minWidth: 500 }}
                            aria-label="job search table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Name</TableCell>
                                    <TableCell>Company</TableCell>
                                    <TableCell>Job Type</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Work Experience</TableCell>
                                    <TableCell>Salary</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData?.map((row) => (
                                    <Row key={row.name} row={row} />
                                ))}

                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{ height: 53 * emptyRows }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter className="table-footer">
                                <td colSpan={12}>
                                    <div className="table-footer-div">
                                        <p>Rows per page:</p>
                                        <div className="row-select">
                                            <select
                                                onChange={
                                                    handleChangeRowsPerPage
                                                }
                                                value={rowsPerPage}
                                            >
                                                <optgroup>
                                                    <option value="10">
                                                        10
                                                    </option>
                                                    <option value="25">
                                                        25
                                                    </option>
                                                    <option value="50">
                                                        50
                                                    </option>
                                                    <option value="100">
                                                        100
                                                    </option>
                                                </optgroup>
                                            </select>
                                        </div>
                                        <p>
                                            {(jobCount?.jobsAggregate?.count
                                                ? page * rowsPerPage + 1
                                                : 0) +
                                                ' - ' +
                                                (page * rowsPerPage +
                                                    rowsPerPage <
                                                jobCount?.jobsAggregate?.count
                                                    ? page * rowsPerPage +
                                                      rowsPerPage
                                                    : jobCount?.jobsAggregate
                                                          ?.count) +
                                                ' of ' +
                                                jobCount?.jobsAggregate?.count}
                                        </p>
                                        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                                            <IconButton
                                                onClick={
                                                    handleFirstPageButtonClick
                                                }
                                                disabled={page === 0}
                                                aria-label="first page"
                                            >
                                                <FirstPageIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={handleBackButtonClick}
                                                disabled={page === 0}
                                                aria-label="previous page"
                                            >
                                                <KeyboardArrowLeft />
                                            </IconButton>
                                            <IconButton
                                                onClick={handleNextButtonClick}
                                                disabled={
                                                    page >=
                                                    Math.ceil(
                                                        jobCount?.jobsAggregate
                                                            ?.count /
                                                            rowsPerPage
                                                    ) -
                                                        1
                                                }
                                                aria-label="next page"
                                            >
                                                <KeyboardArrowRight />
                                            </IconButton>
                                            <IconButton
                                                onClick={
                                                    handleLastPageButtonClick
                                                }
                                                disabled={
                                                    page >=
                                                    Math.ceil(
                                                        jobCount?.jobsAggregate
                                                            ?.count /
                                                            rowsPerPage
                                                    ) -
                                                        1
                                                }
                                                aria-label="last page"
                                            >
                                                <LastPageIcon />
                                            </IconButton>
                                        </Box>
                                    </div>
                                </td>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}
