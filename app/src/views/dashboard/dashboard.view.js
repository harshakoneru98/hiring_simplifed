import React from 'react';
import { gql, useMutation } from '@apollo/client';

const UPLOAD_RESUME_MUTATION = gql`
    mutation uploadResumeFile($file: Upload!) {
        uploadResumeFile(file: $file) {
            status
            message
        }
    }
`;

export default function DashboardView() {
    const [
        uploadResumeFile,
        { data: resumeData, loading: resumeLoading, error: resumeError }
    ] = useMutation(UPLOAD_RESUME_MUTATION);

    if (resumeData) {
        console.log('Data : ', resumeData);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log('File : ', file);

        if (!file) return;

        uploadResumeFile({ variables: { file } });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="main_content">
                    <div className="content">
                        <h1>Welcome to Dashboard</h1>
                        <input type="file" onChange={handleFileChange} />
                    </div>
                </div>
            </div>
        </div>
    );
}
