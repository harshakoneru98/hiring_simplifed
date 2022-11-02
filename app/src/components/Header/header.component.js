import React, { Fragment, useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AuthContext from '../../context/auth-context';
import { Link, useLocation } from 'react-router-dom';
import './header.scss';

export default function Header() {
    let contextType = useContext(AuthContext);
    let location = useLocation();
    const path = location?.pathname;

    const [authPages, setAuthPages] = useState(true);

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
