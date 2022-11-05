import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { gql, useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import './resumeModal.scss';

const UPLOAD_RESUME_MUTATION = gql`
    mutation uploadResumeFile($file: Upload!) {
        uploadResumeFile(file: $file) {
            status
            message
        }
    }
`;

export default function ResumeModal({ show, backdrop }) {
    const [files, setFiles] = useState([]);

    const [
        uploadResumeFile,
        { data: resumeData, loading: resumeLoading, error: resumeError }
    ] = useMutation(UPLOAD_RESUME_MUTATION);

    useEffect(() => {
        if (resumeData) {
            setFiles([]);
        }
    }, [resumeData]);

    const uploadFile = () => {
        if (files[0]) {
            const file = files[0];
            uploadResumeFile({ variables: { file } });
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
        <Modal show={show} backdrop={backdrop} keyboard={false}>
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
