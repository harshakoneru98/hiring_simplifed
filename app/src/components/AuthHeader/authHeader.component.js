import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './authHeader.scss';

export default function AuthHeader() {
    let location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Hiring Simplified
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link
                                className={
                                    location.pathname === '/register'
                                        ? 'nav-link nav-highlight'
                                        : 'nav-link'
                                }
                                to="/register"
                            >
                                Register
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={
                                    location.pathname === '/login'
                                        ? 'nav-link nav-highlight'
                                        : 'nav-link'
                                }
                                to="/login"
                            >
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
