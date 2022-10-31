const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const config = require('../../../config');

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

module.exports = {
    login: async (parent, { email, password }) => {
        let documentClient = new AWS.DynamoDB.DocumentClient();

        let params = {
            TableName: config.DATABASE_NAME,
            IndexName: config.EMAIL_INDEX,
            KeyConditionExpression: '#email = :email',
            ExpressionAttributeNames: { '#email': 'email' },
            ExpressionAttributeValues: {
                ':email': email
            }
        };

        const user = await documentClient.query(params).promise();

        if (user.Count === 1) {
            const userDetails = user?.Items[0];
            const isEqual = await bcrypt.compare(
                password,
                userDetails.password
            );
            if (!isEqual) {
                throw new GraphQLError('Incorrect Password');
            } else {
                const token = jwt.sign(
                    { userId: userDetails.PK, email: userDetails.email },
                    config.AUTH_KEY,
                    {
                        expiresIn: '1h'
                    }
                );
                return {
                    userId: userDetails.PK,
                    token: token,
                    tokenExpiration: 1
                };
            }
        } else {
            throw new GraphQLError('Invalid Credentials');
        }
    }
};
