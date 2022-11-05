import AWS from 'aws-sdk';
import { GraphQLError } from 'graphql';
import { gql } from 'apollo-server-express';
import config from '../../../config.js';
import fs from 'fs';
import { PythonShell } from 'python-shell';
import fetch from 'node-fetch';

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

const extractAndUpdateSkills = async (userId, file_path) => {
    let options = {
        pythonPath: config.PYTHON_PATH,
        scriptPath: 'graphql/resolvers/fileUpload',
        args: [file_path]
    };

    let documentClient = new AWS.DynamoDB.DocumentClient();

    await PythonShell.run(
        'extractSkills.py',
        options,
        async function (err, results) {
            if (err) {
                throw new GraphQLError(err.message);
            }

            await fs.unlink(file_path, function (err) {});

            await fetch(config.SERVER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query getUserByID($userId: ID!) {
                            getUserDataById(userId: $userId) {
                                skills
                            }
                        }
                    `,
                    variables: { userId }
                })
            })
                .then((res) => res.json())
                .then(async (result) => {
                    const final_skills = [
                        ...result.data.getUserDataById.skills,
                        ...results
                    ];

                    var params = {
                        TableName: config.DATABASE_NAME,
                        ExpressionAttributeNames: {
                            '#skills': 'skills'
                        },
                        ExpressionAttributeValues: {
                            ':skills': final_skills
                        },
                        Key: {
                            PK: userId
                        },
                        ReturnValues: 'ALL_NEW',
                        UpdateExpression: 'SET #skills = :skills'
                    };
                    try {
                        await documentClient.update(params).promise();
                    } catch (err) {
                        throw new GraphQLError(err.message);
                    }
                });
        }
    );
};

const uploadResumeFile = async (parent, { file, userId }) => {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const s3 = new AWS.S3();

    const stream = createReadStream();

    const resumeFileParams = {
        Bucket: config.RESUME_BUCKET,
        Key: userId + '.pdf',
        Body: stream,
        ContentDisposition: 'inline',
        ContentType: 'application/pdf'
    };

    const file_path =
        './graphql/resolvers/fileUpload/resumes/' + userId + '.pdf';
    const out = fs.createWriteStream(file_path);
    stream.pipe(out);

    try {
        await s3.upload(resumeFileParams).promise();
        await extractAndUpdateSkills(userId, file_path);
        // await fs.unlink(file_path, function (err) {});
        return {
            status: 200,
            message: 'File uploaded successfully'
        };
    } catch (err) {
        throw new GraphQLError(err.message);
    }
};

export default { uploadResumeFile };
