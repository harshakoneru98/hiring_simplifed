import React, { Fragment, useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch } from 'react-redux';
import { gql, useQuery } from '@apollo/client';
import AuthContext from '../../context/auth-context';
import { userDataByID } from '../../reduxSlices/userDataSlice';
import { Link, useLocation } from 'react-router-dom';
import './header.scss';

const QUERY_USER_DATA = gql`
    query getUserByID($userId: ID!) {
        getUserDataById(userId: $userId) {
            firstName
            lastName
            h1b_required
            email
            skills
            resume_uploaded
            cluster
            job_recommendations
            job_similarities
        }
    }
`;

export default function Header() {
    let contextType = useContext(AuthContext);
    let location = useLocation();
    let dispatch = useDispatch();

    const userId = localStorage.getItem('userId');

    const path = location?.pathname;

    const [authPages, setAuthPages] = useState(true);

    const {
        data: userData,
        loading: userLoading,
        error: userError
    } = useQuery(QUERY_USER_DATA, {
        variables: { userId }
    });

    useEffect(() => {
        if (userData) {
            dispatch(userDataByID(userData.getUserDataById));
        }
    }, [userData]);

    useEffect(() => {
        if (path !== '/' && path !== '/login' && path !== '/register') {
            setAuthPages(false);
        } else {
            setAuthPages(true);
        }
    }, [location]);

    return (
        <Fragment>
            {path !== '/' && (
                <Navbar expand="lg" className="header">
                    <Container>
                        <Navbar.Brand
                            as={Link}
                            to={authPages ? '/' : '/dashboard'}
                        >
                            Hiring Simplified
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse
                            id="basic-navbar-nav"
                            className="justify-content-end"
                        >
                            {authPages && (
                                <Nav>
                                    <Nav.Link
                                        as={Link}
                                        to="/login"
                                        className={
                                            path === '/login'
                                                ? 'nav-highlight'
                                                : ''
                                        }
                                    >
                                        Login
                                    </Nav.Link>
                                    <Nav.Link
                                        as={Link}
                                        to="/register"
                                        className={
                                            path === '/register'
                                                ? 'nav-highlight'
                                                : ''
                                        }
                                    >
                                        Register
                                    </Nav.Link>
                                </Nav>
                            )}
                            {!authPages && (
                                <Nav>
                                    <Nav.Link
                                        as={Link}
                                        to="/job-finder"
                                        className={
                                            path === '/job-finder'
                                                ? 'nav-highlight'
                                                : ''
                                        }
                                    >
                                        Job Finder
                                    </Nav.Link>
                                    <Nav.Link
                                        as={Link}
                                        to="/profile"
                                        className={
                                            path === '/profile'
                                                ? 'nav-highlight'
                                                : ''
                                        }
                                    >
                                        My Profile
                                    </Nav.Link>
                                    <Nav.Link onClick={contextType.logout}>
                                        Logout
                                    </Nav.Link>
                                </Nav>
                            )}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            )}
        </Fragment>
    );
}
