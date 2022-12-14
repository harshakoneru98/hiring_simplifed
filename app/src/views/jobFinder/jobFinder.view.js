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
import Modal from 'react-bootstrap/Modal';
import Button from '@mui/material/Button';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Stack from '@mui/material/Stack';
import SliderField from '../../components/Slider/slider.component';
import RangeSliderField from '../../components/RangeSlider/rangeSlider.component';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Switch from '@mui/material/Switch';
import { useSelector, useDispatch } from 'react-redux';
import { updateFinalFilters } from '../../reduxSlices/finalFilterSlice';
import { modifySort, updateFilters } from '../../reduxSlices/filterSlice';
import './jobFinder.scss';
import { defaultValues } from '../../config';
import CheckboxEducation from '../../components/Checkbox/checkbox.component';
import SwitchH1b from '../../components/Switch/switch.component';
import JobDropdown from '../../components/JobDropdown/jobDropdown.component';
import LocationDropdown from '../../components/LocationDropdown/locationDropdown.component';
import CompanyDropdown from '../../components/CompanyDropdown/companyDropdown.component';

const QUERY_USER_DATA = gql`
    query getUserByID($userId: ID!) {
        getUserDataById(userId: $userId) {
            skills
        }
    }
`;

const QUERY_TOTAL_JOBS = gql`
    query JobsAggregate($where: JobWhere) {
        jobsAggregate(where: $where) {
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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

function JobRow(props) {
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
                <TableCell>{'$' + numberWithCommas(row.salary)}</TableCell>
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
                                    <TableCell>
                                        Matching Skills{' '}
                                        <CheckIcon color="success" />
                                    </TableCell>
                                    <TableCell>
                                        Missing Skills{' '}
                                        <ClearIcon color="error" />
                                    </TableCell>
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

JobRow.propTypes = {
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
    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterData, setFilterData] = useState({});
    const [filterCountData, setFilterCountData] = useState({});

    const filterInfo = useSelector((state) => state?.filter);
    const finalFilterInfo = useSelector((state) => state?.finalFilter);

    useEffect(() => {
        let filter_query = {};
        let filter_count_query = {};
        if (finalFilterInfo) {
            filter_query['experience'] = finalFilterInfo.experience;
            filter_count_query['experience'] = finalFilterInfo.experience;

            filter_query['salary_min'] = finalFilterInfo.salary[0] * 1000;
            filter_count_query['salary_min'] = finalFilterInfo.salary[0] * 1000;

            if (finalFilterInfo.salary[1] !== 300) {
                filter_query['salary_max'] = finalFilterInfo.salary[1] * 1000;
                filter_count_query['salary_max'] =
                    finalFilterInfo.salary[1] * 1000;
            } else {
                filter_query['salary_max'] = -1;
                filter_count_query['salary_max'] = 1000 * 1000;
            }

            filter_query['h1b'] = finalFilterInfo.h1b ? '[1]' : '[0, 1]';
            filter_count_query['h1b'] = finalFilterInfo.h1b ? [1] : [0, 1];

            filter_query['sort_experience'] = finalFilterInfo.sortValues[
                'experience'
            ]
                ? 'DESC'
                : 'ASC';
            filter_query['sort_salary'] = finalFilterInfo.sortValues['salary']
                ? 'DESC'
                : 'ASC';
            const degrees = ['PhD Degree', 'Master Degree', 'Bachelor Degree'];
            const indices = finalFilterInfo.education.flatMap((bool, index) =>
                bool ? index : []
            );
            filter_query['education'] =
                "['" + indices.map((i) => degrees[i]).join("','") + "']";

            filter_count_query['education'] = indices.map((i) => degrees[i]);

            filter_query['job_family'] =
                "['" +
                finalFilterInfo.job_family.map((a) => a.name).join("','") +
                "']";

            filter_count_query['job_family'] = finalFilterInfo.job_family.map(
                (a) => a.name
            );

            filter_query['states'] =
                "['" +
                finalFilterInfo.states.map((a) => a.name).join("','") +
                "']";

            filter_count_query['states'] = finalFilterInfo.states.map(
                (a) => a.name
            );

            filter_query['companies'] =
                '["' +
                finalFilterInfo.company_to_company_types
                    .map((a) => a.name)
                    .join('","') +
                '"]';

            filter_count_query['companies'] =
                finalFilterInfo.company_to_company_types.map((a) => a.name);

            setFilterData(filter_query);
            setFilterCountData(filter_count_query);
        }
    }, [finalFilterInfo]);

    const { data: jobCount, refetchFilterData } = useQuery(QUERY_TOTAL_JOBS, {
        variables: {
            where: {
                Salary_GTE: filterCountData.salary_min,
                Salary_LTE: filterCountData.salary_max,
                H1B_flag_IN: filterCountData.h1b,
                Work_Min_GTE: filterCountData.experience,
                company: {
                    name_IN: filterCountData.companies
                },
                education: {
                    name_IN: filterCountData.education
                },
                job_family: {
                    name_IN: filterCountData.job_family
                },
                state: {
                    name_IN: filterCountData.states
                },
                Valid: 1
            }
        }
    });

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
                offset: page * rowsPerPage,
                companies: filterData?.companies,
                education: filterData?.education,
                experience: filterData?.experience,
                h1b: filterData?.h1b,
                job_family: filterData?.job_family,
                salary_max: filterData?.salary_max,
                salary_min: filterData?.salary_min,
                sort_experience: filterData?.sort_experience,
                sort_salary: filterData?.sort_salary,
                states: filterData?.states
            }
        }
    });

    const [tableData, setTableData] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!show) {
            dispatch(updateFilters(finalFilterInfo));
        } else {
            setSortValues(finalFilterInfo?.sortValues);
        }
    }, [show]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                offset: page * rowsPerPage,
                companies: filterData?.companies,
                education: filterData?.education,
                experience: filterData?.experience,
                h1b: filterData?.h1b,
                job_family: filterData?.job_family,
                salary_max: filterData?.salary_max,
                salary_min: filterData?.salary_min,
                sort_experience: filterData?.sort_experience,
                sort_salary: filterData?.sort_salary,
                states: filterData?.states
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

    const handleClearFilters = () => {
        dispatch(updateFilters(defaultValues));
        dispatch(updateFinalFilters(defaultValues));
        setSortValues(defaultValues.sortValues);
    };

    const handleSubmitFilters = () => {
        dispatch(updateFinalFilters(filterInfo));
        setPage(0);
        setShow(false);
        refetch({
            input: {
                limit: rowsPerPage,
                offset: 0,
                companies: filterData?.companies,
                education: filterData?.education,
                experience: filterData?.experience,
                h1b: filterData?.h1b,
                job_family: filterData?.job_family,
                salary_max: filterData?.salary_max,
                salary_min: filterData?.salary_min,
                sort_experience: filterData?.sort_experience,
                sort_salary: filterData?.sort_salary,
                states: filterData?.states
            }
        });

        refetchFilterData({
            where: {
                Salary_GTE: filterCountData.salary_min,
                Salary_LTE: filterCountData.salary_max,
                H1B_flag_IN: filterCountData.h1b,
                Work_Min_GTE: filterCountData.experience,
                company: {
                    name_IN: filterCountData.companies
                },
                education: {
                    name_IN: filterCountData.education
                },
                job_family: {
                    name_IN: filterCountData.job_family
                },
                state: {
                    name_IN: filterCountData.states
                },
                Valid: 1
            }
        });
    };

    const [sortValues, setSortValues] = useState(finalFilterInfo?.sortValues);

    const handleSortChange = (event) => {
        const name = event.target.name;
        const value = !sortValues[name];
        let newValues = { ...sortValues };
        newValues[name] = value;
        setSortValues(newValues);
        dispatch(modifySort(newValues));
    };

    return (
        <div
            className="container job-search-container"
            className={jobLoading ? 'loading' : ''}
        >
            {jobLoading && (
                <img
                    src="/loading.gif"
                    alt="preview"
                    className="loader-image"
                />
            )}
            <div className="row">
                <div className="main_content">
                    <h2 className="job-search-header">
                        Ready to find your next Job?
                    </h2>
                    <p className="filter-popup" onClick={handleShow}>
                        Filters <FilterListIcon />
                    </p>
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                        className="filter-modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Want to narrow Jobs?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Container>
                                <Row>
                                    <Col xs={8} className="first_column">
                                        <Typography
                                            variant="h6"
                                            className="filter_header"
                                        >
                                            Filter Jobs
                                        </Typography>
                                    </Col>
                                    <Col xs={4} className="second_column">
                                        <Typography
                                            variant="h6"
                                            className="filter_header"
                                        >
                                            Sort Attributes
                                        </Typography>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={8} className="first_column">
                                        <Row className="row-margin">
                                            <Col xs={6}>
                                                <p>Job Family</p>
                                                <JobDropdown
                                                    check={
                                                        finalFilterInfo?.job_family
                                                    }
                                                />
                                            </Col>
                                            <Col xs={6}>
                                                <p>Location</p>
                                                <LocationDropdown
                                                    check={
                                                        finalFilterInfo?.states
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="row-margin">
                                            <Col xs={12}>
                                                <p>Companies</p>
                                                <CompanyDropdown
                                                    check={
                                                        finalFilterInfo?.company_to_company_types
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="row-margin">
                                            <CheckboxEducation
                                                checks={
                                                    finalFilterInfo?.education
                                                }
                                            />
                                            <Col xs={3}></Col>
                                            <Col xs={3}>
                                                <p>H-1B required?</p>
                                                <SwitchH1b
                                                    check={finalFilterInfo?.h1b}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="row-margin">
                                            <Col xs={6}>
                                                <p>Work Experience</p>
                                                <SliderField
                                                    defaultValue={
                                                        finalFilterInfo?.experience
                                                    }
                                                    step={1}
                                                    min={0}
                                                    max={10}
                                                />
                                            </Col>
                                            <Col xs={6}>
                                                <p>Salary</p>
                                                <RangeSliderField
                                                    min_value={
                                                        finalFilterInfo
                                                            ?.salary[0]
                                                    }
                                                    max_value={
                                                        finalFilterInfo
                                                            ?.salary[1]
                                                    }
                                                    step={50}
                                                    min={50}
                                                    max={300}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={4} className="second_column">
                                        ASC <Switch disabled defaultChecked />{' '}
                                        DESC
                                        <Row className="sort-rows">
                                            <Col xs={6}>Experience</Col>
                                            <Col xs={6}>
                                                <Switch
                                                    checked={
                                                        sortValues['experience']
                                                    }
                                                    onChange={handleSortChange}
                                                    name="experience"
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="sort-rows">
                                            <Col xs={6}>Salary</Col>
                                            <Col xs={6}>
                                                <Switch
                                                    checked={
                                                        sortValues['salary']
                                                    }
                                                    onChange={handleSortChange}
                                                    name="salary"
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<ClearAllIcon />}
                                    onClick={handleClearFilters}
                                >
                                    Clear
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    endIcon={<SendIcon />}
                                    onClick={handleSubmitFilters}
                                >
                                    Apply
                                </Button>
                            </Stack>
                        </Modal.Footer>
                    </Modal>
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
                                    <TableCell>Job Role</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Work Experience</TableCell>
                                    <TableCell>Salary</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData?.map((row) => (
                                    <JobRow key={row.name} row={row} />
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
