import AWS from 'aws-sdk';
import { GraphQLError } from 'graphql';
import config from '../../../config.js';

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

const updateUserProfile = async (parent, args) => {
    const user = args.input;

    let documentClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: config.DATABASE_NAME,
        ExpressionAttributeNames: {
            '#firstName': 'firstName',
            '#lastName': 'lastName',
            '#h1b_required': 'h1b_required',
            '#resume_uploaded': 'resume_uploaded'
        },
        ExpressionAttributeValues: {
            ':firstName': user.firstName,
            ':lastName': user.lastName,
            ':h1b_required': user.h1b_required,
            ':resume_uploaded': user.resume_uploaded
        },
        Key: {
            PK: user.userId
        },
        ReturnValues: 'ALL_NEW',
        UpdateExpression:
            'SET #firstName = :firstName, #lastName = :lastName, #h1b_required = :h1b_required, #resume_uploaded = :resume_uploaded'
    };

    try {
        await documentClient.update(params).promise();
        return {
            status: 200,
            message: 'Updated user successfully'
        };
    } catch (err) {
        throw new GraphQLError(err.message);
    }
};

export default { updateUserProfile };