import React, { useEffect, Fragment, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import './dashboard.scss';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { cluster_config } from '../../config';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export const data = {
    labels: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5'],
    datasets: [
        {
            label: 'Frequency',
            data: [25, 29, 23, 25, 24],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }
    ]
};

const QUERY_JOB_DATA = gql`
    query Skills($where: JobWhere) {
        jobs(where: $where) {
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
                <TableCell>{row.similarity + '%'}</TableCell>
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

function createData(data, skills, top_10_recommendations) {
    const final_data = [];

    data?.jobs?.map((job) => {
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
            job_description: job.JD,
            similarity: top_10_recommendations[job.name]
        });
    });

    final_data.sort((a, b) => b.similarity.localeCompare(a.similarity));
    return final_data;
}

export default function DashboardView() {
    const userInfo = useSelector((state) => state?.userData?.value);
    const top_10_recommendations = userInfo?.top_similarities
        ? JSON.parse(userInfo?.top_similarities)
        : {};
    const top_10_job_ids =
        top_10_recommendations !== {}
            ? Object.keys(top_10_recommendations).map((i) => parseInt(i))
            : [];

    const {
        data: jobData,
        loading: jobLoading,
        error: jobError
    } = useQuery(QUERY_JOB_DATA, {
        variables: {
            where: {
                name_IN: top_10_job_ids
            }
        }
    });

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (jobData && !jobLoading && userInfo) {
            const updated_job_data = createData(
                jobData,
                userInfo?.skills,
                top_10_recommendations
            );
            setTableData(updated_job_data);
        }
    }, [jobData, userInfo, jobLoading]);

    return (
        <Container>
            <Row className="dashboard-rows">
                <Card>
                    {userInfo.firstName && (
                        <Card.Body className="dasboard-label-header">
                            Hello{' '}
                            {userInfo?.firstName +
                                ' ' +
                                userInfo?.lastName +
                                '!'}{' '}
                            {
                                cluster_config[userInfo?.cluster]
                                    ?.natural_language
                            }
                        </Card.Body>
                    )}
                </Card>
            </Row>
            <Row className="dashboard-rows">
                <Typography className="recommendation-title">
                    Top 10 Job Recommendations
                </Typography>
                <TableContainer
                    component={Paper}
                    className="dashboard-search-table"
                >
                    <Table sx={{ minWidth: 500 }} aria-label="job search table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Name</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Job Role</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Work Experience</TableCell>
                                <TableCell>Salary</TableCell>
                                <TableCell>Similarity</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData?.map((row) => (
                                <JobRow key={row.name} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Row>
            <Row className="dashboard-rows">
                <Col xs={6}>
                    <Radar data={data} />
                </Col>
                <Col xs={6}></Col>
            </Row>
            <Row className="dashboard-rows"></Row>
        </Container>
    );
}
