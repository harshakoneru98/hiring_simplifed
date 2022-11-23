import AWS from 'aws-sdk';
import { GraphQLError } from 'graphql';
import config from '../../../config.js';

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

const getUserDataById = async (parent, { userId }) => {
    let documentClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: config.DATABASE_NAME,
        Key: {
            PK: userId
        }
    };

    const user = await documentClient.get(params).promise();

    if (user?.Item?.PK) {
        const userDetails = user?.Item;
        return {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            h1b_required: userDetails.h1b_required,
            email: userDetails.email,
            skills: userDetails.skills,
            resume_uploaded: userDetails.resume_uploaded,
            cluster: userDetails.cluster,
            job_recommendations: userDetails.job_recommendations
        };
    } else {
        throw new GraphQLError('User not found');
    }
};

export default { getUserDataById };
