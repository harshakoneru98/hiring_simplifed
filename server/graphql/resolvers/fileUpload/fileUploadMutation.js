import AWS from 'aws-sdk';
import { GraphQLError } from 'graphql';
import config from '../../../config.js';
import fs from 'fs';

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

const uploadResumeFile = async (parent, { file, userId }) => {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const s3 = new AWS.S3();

    const resumeFileParams = {
        Bucket: config.RESUME_BUCKET,
        Key: userId + '.pdf',
        Body: createReadStream(),
        ContentDisposition: 'inline',
        ContentType: 'application/pdf'
    };

    try {
        await s3.upload(resumeFileParams).promise();
        return {
            status: 200,
            message: 'File uploaded successfully'
        };
    } catch (err) {
        throw new GraphQLError(err.message);
    }
};

export default { uploadResumeFile };
