import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import './dashboard.scss';

const UPLOAD_RESUME_MUTATION = gql`
    mutation uploadResumeFile($file: Upload!) {
        uploadResumeFile(file: $file) {
            status
            message
        }
    }
`;

export default function DashboardView() {
    const [files, setFiles] = useState([]);

    const [
        uploadResumeFile,
        { data: resumeData, loading: resumeLoading, error: resumeError }
    ] = useMutation(UPLOAD_RESUME_MUTATION);

    if (resumeData) {
        console.log('Data : ', resumeData);
    }

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
                <iframe src={file.preview} height="500px"></iframe>
            </div>
        </div>
    ));

    return (
        <div className="container">
            <div className="row">
                <div className="main_content">
                    <div className="content">
                        <h1>Welcome to Dashboard</h1>
                    </div>
                    <br />
                    <div className="container">
                        <h4>Upload Resume</h4>
                        <div className="upload-container">
                            <div className="border-container">
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p>Drag and drop a file here, or click</p>
                                    <p className="fileNames">
                                        Only .pdf files allowed
                                    </p>
                                </div>
                                <div>
                                    <div>{resume_file}</div>
                                </div>
                            </div>
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th>
                                        <a
                                            className={
                                                files[0]?.name
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
                                            className="btn btn-danger"
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
                </div>
            </div>
        </div>
    );
}
