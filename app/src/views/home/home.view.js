import React from 'react';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import './home.scss';

export default function HomeView() {
    return (
        <Container fluid>
            <Row>
                <Col xs={4} className="home-column-text">
                    <Card className="value-proposition">
                        <Card.Body>
                            <Row>
                                <img
                                    className="home-logo"
                                    src="/hiring-simplified-logo.png"
                                />
                            </Row>
                            <Row>
                                <p>
                                    Hiring Simplified provides candidates with a
                                    personalized job search experience by
                                    recommending jobs best suited to their
                                    profile using the candidate's resume.
                                </p>
                                <p>
                                    It helps candidates with interview
                                    preparation by skill radar charts of
                                    different companies and location-based
                                    salary of job roles through interactive
                                    visualizations built on massive job data. It
                                    also provides a filter-based job search
                                    service where candidates can explore jobs
                                    for all job roles on the Job Knowledge
                                    Graph.
                                </p>
                            </Row>
                            <Row>
                                <Col>
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
                <Col xs={8} className="home-image"></Col>
            </Row>
        </Container>
    );
}
