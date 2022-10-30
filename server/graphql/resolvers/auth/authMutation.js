const AWS = require('aws-sdk');
const config = require('../../../config');
const { GraphQLError } = require('graphql');

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
});

module.exports = {
    createUser: async (parent, args) => {
        const user = args.input;
        let params = {
            TableName: config.DATABASE_NAME,
            Item: {
                PK: `USER#${user.email}`,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password
            }
        };
        let documentClient = new AWS.DynamoDB.DocumentClient();
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
