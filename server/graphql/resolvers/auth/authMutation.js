import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { GraphQLError } from 'graphql';
import config from '../../../config.js';

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

const createUser = async (parent, args) => {
    const user = args.input;

    let documentClient = new AWS.DynamoDB.DocumentClient();

    let email_check_params = {
        TableName: config.DATABASE_NAME,
        IndexName: config.EMAIL_INDEX,
        KeyConditionExpression: '#email = :email',
        ExpressionAttributeNames: { '#email': 'email' },
        ExpressionAttributeValues: {
            ':email': user.email
        }
    };

    const email_response = await documentClient
        .query(email_check_params)
        .promise();

    if (email_response.Count === 1) {
        throw new GraphQLError('Email already exists');
    } else {
        const userId = v4();
        const hashedPassword = await bcrypt.hash(user.password, 12);
        let params = {
            TableName: config.DATABASE_NAME,
            Item: {
                PK: `USER#${userId}`,
                firstName: user.firstName,
                lastName: user.lastName,
                h1b_required: user.h1b_required,
                email: user.email,
                password: hashedPassword
            }
        };

        try {
            await documentClient.put(params).promise();
            return {
                status: 200,
                message: 'User created successfully'
            };
        } catch (err) {
            throw new GraphQLError(err.message);
        }
    }
};

export default { createUser };
