import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { gql, useQuery } from '@apollo/client';
import { userDataByID } from '../../reduxSlices/userDataSlice';
import ResumeModal from '../../components/ResumeModal/resumeModal.component';

const QUERY_USER_DATA = gql`
    query getUserByID($userId: ID!) {
        getUserDataById(userId: $userId) {
            firstName
            lastName
            h1b_required
            email
            skills
            resume_uploaded
        }
    }
`;

export default function ResumeView() {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    const userInfo = useSelector((state) => state.userData.value);
    if (userInfo.resume_uploaded) {
        navigate('/dashboard');
    }

    const userId = localStorage.getItem('userId');

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

    return (
        <Fragment>
            {userInfo && !userInfo.resume_uploaded && (
                <ResumeModal show={true} backdrop="static" />
            )}
        </Fragment>
    );
}
