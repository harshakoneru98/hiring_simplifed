import React from 'react';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import './home.scss';

export default function HomeView() {
    return (
        <Container fluid>
            <Row>
                <Col xs={4}>
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
                <Col xs={8} className="home-image"></Col>
            </Row>
        </Container>
    );
}
