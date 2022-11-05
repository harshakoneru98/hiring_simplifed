import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ResumeModal from '../../components/ResumeModal/resumeModal.component';
import './profile.scss';

export default function ProfileView() {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <div className="container">
            <div className="row">
                <div className="main_content">
                    <Button variant="primary" onClick={handleShow}>
                        Resume Upload
                    </Button>
                    {show && (
                        <ResumeModal show={show} handleClose={handleClose} />
                    )}
                </div>
            </div>
        </div>
    );
}
