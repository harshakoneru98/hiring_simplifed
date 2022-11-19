import React, { Fragment, useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
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

import './jobFinder.scss';

const QUERY_USER_DATA = gql`
    query getUserByID($userId: ID!) {
        getUserDataById(userId: $userId) {
            skills
        }
    }
`;

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

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? (
                    <LastPageIcon />
                ) : (
                    <FirstPageIcon />
                )}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? (
                    <FirstPageIcon />
                ) : (
                    <LastPageIcon />
                )}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};

function createData(data, skills) {
    const final_data = [];

    data?.jobs.map((job) => {
        const job_skills = job.req_skills.map((skill) => skill.name);
        const matching_skills = job_skills.filter((element) =>
            skills.includes(element)
        );
        const missing_skills = job_skills.filter(
            (element) => !skills.includes(element)
        );
        final_data.push({
            title: job.Title,
            company: job.company.name,
            salary: job.Salary,
            job_url: job.job_url,
            job_family: job.job_family.name,
            company_type: job.company.company_type.name,
            city: job.city.name,
            state: job.state.name,
            education: job.education.map((edu) => edu.name),
            h1b: job.H1B_flag,
            matching_skills: matching_skills,
            missing_skills: missing_skills,
            min_work_exp: job.Work_Min,
            job_description: job.JD
        });
    });
    return final_data;
}

export default function JobFinderView() {
    const userId = localStorage.getItem('userId');

    const {
        data: userData,
        loading: userLoading,
        error: userError
    } = useQuery(QUERY_USER_DATA, {
        variables: { userId }
    });

    const {
        data: jobData,
        loading: jobLoading,
        error: jobError
    } = useQuery(QUERY_JOB_DATA, {
        variables: {
            options: {
                limit: 27
            }
        }
    });

    const [tableData, setTableData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    useEffect(() => {
        if (jobData && userData) {
            const updated_job_data = createData(
                jobData,
                userData.getUserDataById.skills
            );
            console.log('Updated Data : ', updated_job_data);
            setTableData(updated_job_data);
        }
    }, [jobData, userData]);

    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - tableData?.length)
            : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
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
                                {(rowsPerPage > 0
                                    ? tableData?.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                      )
                                    : tableData
                                )?.map((row) => (
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
                                <TablePagination
                                    rowsPerPageOptions={[
                                        10,
                                        25,
                                        50,
                                        100,
                                        { label: 'All', value: -1 }
                                    ]}
                                    colSpan={12}
                                    count={tableData?.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page'
                                        },
                                        native: true
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={
                                        handleChangeRowsPerPage
                                    }
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}
