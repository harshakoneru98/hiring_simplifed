import React from 'react';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Typography from '@mui/material/Typography';
import './home.scss';

export default function HomeView() {
    return (
        <Container>
            <Row>
                <img className="home-logo" src="/hiring-simplified-logo.png" />
            </Row>

            <Row>
                <Col xs={12} className="home-column-text">
                    <Card className="value-proposition">
                        <Card.Body>
                            <Row className="card-row">
                                <Col xs={8}>
                                    <ul>
                                        Hiring Simplified provides candidates
                                        with a personalized job search
                                        experience by recommending jobs best
                                        suited to their profile using the
                                        candidate's resume.
                                        <li>
                                            Through interactive visualizations
                                            based on vast amounts of job data,
                                            Hiring Simplified aids candidates in
                                            interview preparation by providing
                                            skill radar charts of various firms
                                            and location-based salaries for job
                                            categories.
                                        </li>
                                        <li>
                                            Additionally, we offer candidate's
                                            access to a filter-based job search
                                            engine where they can go through all
                                            of the job roles on the Job
                                            Knowledge Graph.
                                        </li>
                                    </ul>
                                </Col>
                                <Col xs={4} className="auth-home">
                                    <Link
                                        className="btn btn-primary btn-block-home"
                                        to="/register"
                                    >
                                        Register
                                    </Link>

                                    <Link
                                        className="btn btn-primary btn-block-home"
                                        to="/login"
                                    >
                                        Login
                                    </Link>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="home-row">
                <p>Company Skill Matching</p>
                <Col xs={12}>
                    <img src="/skill_match.png" className="skill-image" />
                </Col>
            </Row>

            <Row className="home-row">
                <p>Location based Salary</p>
                <Col xs={8}>
                    <img src="/usa_map.png" className="skill-image" />
                </Col>
                <Col xs={4}>
                    <img
                        src="/state_stats.png"
                        className="skill-image state-stats"
                    />
                </Col>
            </Row>
        </Container>
    );
}
