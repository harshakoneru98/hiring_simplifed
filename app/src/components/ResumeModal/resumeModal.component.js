import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import { userDataByID } from '../../reduxSlices/userDataSlice';
import { refreshWindow } from '../../reduxSlices/refreshSlice';
import './resumeModal.scss';

const UPLOAD_RESUME_MUTATION = gql`
    mutation uploadResumeFile(
        $file: Upload!
        $userId: ID!
        $existing_skills: [String]
    ) {
        uploadResumeFile(
            file: $file
            userId: $userId
            existing_skills: $existing_skills
        ) {
            status
            message
            skills
        }
    }
`;

const UPDATE_USER_DATA_MUTATION = gql`
    mutation updateUserProfile($input: updateProfileInput!) {
        updateUserProfile(input: $input) {
            status
            message
        }
    }
`;

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

export default function ResumeModal({ show, backdrop, handleClose }) {
    const [files, setFiles] = useState([]);
    let dispatch = useDispatch();

    const userInfo = useSelector((state) => state.userData.value);

    const userId = localStorage.getItem('userId');

    const {
        data: userData,
        loading: userLoading,
        error: userError,
        refetch
    } = useQuery(QUERY_USER_DATA, {
        variables: { userId }
    });

    const [
        uploadResumeFile,
        { data: resumeData, loading: resumeLoading, error: resumeError }
    ] = useMutation(UPLOAD_RESUME_MUTATION);

    const [
        updateUserProfile,
        {
            data: updateUserData,
            loading: updateUserLoading,
            error: updateUserError
        }
    ] = useMutation(UPDATE_USER_DATA_MUTATION);

    useEffect(() => {
        if (updateUserData) {
            dispatch(userDataByID(userData.getUserDataById));
            dispatch(refreshWindow(true));
        }
    }, [updateUserData]);

    useEffect(() => {
        if (resumeData) {
            setFiles([]);
            let { firstName, lastName, h1b_required, resume_uploaded } =
                userInfo;
            resume_uploaded = true;
            const skills = resumeData?.uploadResumeFile?.skills;

            updateUserProfile({
                variables: {
                    input: {
                        userId,
                        firstName,
                        lastName,
                        h1b_required,
                        resume_uploaded,
                        skills
                    }
                }
            })
                .then((data) => {
                    refetch();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [resumeData]);

    const uploadFile = () => {
        if (files[0]) {
            const file = files[0];
            const existing_skills = userInfo?.skills;
            uploadResumeFile({ variables: { file, userId, existing_skills } });
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'application/pdf',
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                )
            );
        }
    });

    const resume_file = files.map((file) => (
        <div key={file.name}>
            <div>
                <iframe src={file.preview}></iframe>
            </div>
        </div>
    ));

    return (
        <Modal
            show={show}
            backdrop={backdrop}
            keyboard={false}
            onHide={handleClose}
        >
            <div className="resume-container">
                <h4>Upload Resume</h4>
                <div className="upload-container">
                    <div className="border-container">
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drag and drop a file here, or click</p>
                            <p className="fileNames">Only .pdf files allowed</p>
                        </div>
                        <div>
                            <div>{resume_file}</div>
                        </div>
                    </div>
                </div>
                <table className="upload-table">
                    <tbody>
                        <tr>
                            <th>
                                <a
                                    className={
                                        files[0]?.name && !resumeLoading
                                            ? 'btn btn-success'
                                            : 'btn btn-success is-diabled'
                                    }
                                    onClick={(e) => {
                                        uploadFile();
                                        e.preventDefault();
                                    }}
                                >
                                    Upload
                                </a>
                            </th>
                            <th>
                                <a
                                    className={
                                        !resumeLoading
                                            ? 'btn btn-danger'
                                            : 'btn btn-danger is-diabled'
                                    }
                                    onClick={(e) => {
                                        setFiles([]);
                                        e.preventDefault();
                                    }}
                                >
                                    Clear
                                </a>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Modal>
    );
}
