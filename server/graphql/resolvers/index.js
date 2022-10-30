const authQuery = require('./auth/authQuery');
const authMutation = require('./auth/authMutation');

const resolvers = {
    Query: {
        ...authQuery
    },
    Mutation: {
        ...authMutation
    }
};

module.exports = { resolvers };
