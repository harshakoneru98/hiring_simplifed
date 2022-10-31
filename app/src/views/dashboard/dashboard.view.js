import React, { useContext } from 'react';
import AuthContext from '../../context/auth-context';

export default function DashboardView() {
    let contextType = useContext(AuthContext);

    return (
        <div className="container">
            <div className="row">
                <div className="main_content">
                    <div className="content">
                        <h1>Welcome to Dashboard</h1>
                        <button onClick={contextType.logout}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
