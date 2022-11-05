import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ResumeModal from '../../components/ResumeModal/resumeModal.component';
import './dashboard.scss';

export default function DashboardView() {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);

    return (
        <div className="container">
            <div className="row">
                <div className="main_content">
                    <Button variant="primary" onClick={handleShow}>
                        Resume Upload
                    </Button>
                    {show && <ResumeModal show={show} backdrop="static" />}
                </div>
            </div>
        </div>
    );
}
