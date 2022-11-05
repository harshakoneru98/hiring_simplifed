import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ResumeModal from '../../components/ResumeModal/resumeModal.component';

export default function ResumeView() {
    let navigate = useNavigate();

    const userInfo = useSelector((state) => state.userData.value);

    useEffect(() => {
        if (userInfo.resume_uploaded) {
            navigate('/dashboard');
        }
    }, [userInfo]);

    return (
        <Fragment>
            {userInfo?.email && !userInfo?.resume_uploaded && (
                <ResumeModal show={true} backdrop="static" />
            )}
        </Fragment>
    );
}
