import AWS from 'aws-sdk';
import { GraphQLError } from 'graphql';
import { gql } from 'apollo-server-express';
import config from '../../../config.js';
import fs from 'fs';
import { PythonShell } from 'python-shell';
import { cluster_config } from './cluster_config.js';
import fetch from 'node-fetch';

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

const extractSkills = async (userId, file_path) => {
    let options = {
        pythonPath: config.PYTHON_PATH,
        scriptPath: 'graphql/resolvers/fileUpload',
        args: [
            file_path,
            './graphql/resolvers/fileUpload/skills_embeddings.json'
        ]
    };

    const result = await new Promise((resolve, reject) => {
        PythonShell.run(
            'extractSkills.py',
            options,
            async function (err, results) {
                if (err) {
                    throw new GraphQLError(err.message);
                }

                await fs.unlink(file_path, function (err) {});
                if (err) return reject(err);
                return resolve(results);
            }
        );
    });
    return result;
};

const extractRecommendations = async (final_skills) => {
    let options = {
        pythonPath: config.PYTHON_PATH,
        scriptPath: 'graphql/resolvers/fileUpload',
        args: [
            final_skills,
            './graphql/resolvers/fileUpload/sentence_embedder.pkl',
            './graphql/resolvers/fileUpload/data_for_recommendation.pkl',
            './graphql/resolvers/fileUpload/clustering_model_10.pkl'
        ]
    };

    let result = await new Promise((resolve, reject) => {
        PythonShell.run(
            'extractRecommendations.py',
            options,
            async function (err, results) {
                if (err) {
                    throw new GraphQLError(err.message);
                }

                if (err) return reject(err);
                return resolve(results);
            }
        );
    });
    result = result.map((i) => parseInt(i));
    return {
        job_family: cluster_config[result[0]],
        job_recommendations: result.slice(1)
    };
};

const uploadResumeFile = async (parent, { file, userId, existing_skills }) => {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const s3 = new AWS.S3();
    const documentClient = new AWS.DynamoDB.DocumentClient();

    const stream = createReadStream();

    const file_path =
        './graphql/resolvers/fileUpload/resumes/' + userId + '.pdf';
    const out = fs.createWriteStream(file_path);
    stream.pipe(out);

    try {
        out.on('finish', async function () {
            const fileContent = fs.readFileSync(file_path);
            const resumeFileParams = {
                Bucket: config.RESUME_BUCKET,
                Key: userId + '.pdf',
                Body: fileContent,
                ContentDisposition: 'inline',
                ContentType: 'application/pdf'
            };

            await s3.upload(resumeFileParams).promise();
        });

        let skills = await extractSkills(userId, file_path);
        let final_skills = [...existing_skills, ...skills].sort();
        let user_skills = [...new Set(final_skills)];

        const { job_family, job_recommendations } =
            await extractRecommendations(final_skills);

        var params = {
            TableName: config.DATABASE_NAME,
            ExpressionAttributeNames: {
                '#skills': 'skills',
                '#job_family': 'job_family',
                '#job_recommendations': 'job_recommendations'
            },
            ExpressionAttributeValues: {
                ':skills': final_skills,
                ':job_family': job_family,
                ':job_recommendations': job_recommendations
            },
            Key: {
                PK: userId
            },
            ReturnValues: 'ALL_NEW',
            UpdateExpression:
                'SET #skills = :skills, #job_family = :job_family, #job_recommendations = :job_recommendations'
        };

        try {
            await documentClient.update(params).promise();
        } catch (err) {
            throw new GraphQLError(err.message);
        }

        return {
            status: 200,
            message: 'File uploaded successfully',
            skills: final_skills,
            job_family: job_family,
            job_recommendations: job_recommendations
        };
    } catch (err) {
        throw new GraphQLError(err.message);
    }
};

export default { uploadResumeFile };
