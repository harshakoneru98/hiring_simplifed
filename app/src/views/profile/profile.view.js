import React, { useContext } from 'react';
import Header from '../../components/Header/header.component';

export default function ProfileView() {
    return (
        <div className="container">
            <Header />
            <div className="row">
                <div className="main_content">
                    <div className="content">
                        <h1>Welcome to Profile</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
