import React from 'react';
import { Link } from 'react-router-dom';

export default function HomeView() {
    return (
        <div className="container">
            <div className="row">
                <div className="main_content">
                    <div className="content">
                        <h2>Home Page</h2>
                        <Link className="btn btn-primary" to="/register">
                            Register
                        </Link>
                        <Link className="btn btn-primary" to="/login">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
