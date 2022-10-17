const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        skills: [String]
    }

    type Query {
        user(email: String!): User!
    }

    input createUserInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    type messageResponse {
        status: Int!
        message: String!
    }

    type Mutation {
        createUser(input: createUserInput!): messageResponse
    }
`;

module.exports = { typeDefs };
