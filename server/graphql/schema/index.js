import { gql } from 'apollo-server-express';
import Upload from 'graphql-upload/Upload.mjs';

export const typeDefs = gql`
    scalar Upload

    type User {
        firstName: String!
        lastName: String!
        h1b_required: Boolean!
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
        h1b_required: Boolean!
        email: String!
        password: String!
    }

    type messageResponse {
        status: Int!
        message: String!
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    type Query {
        login(email: String!, password: String!): AuthData!
    }

    type Mutation {
        createUser(input: createUserInput!): messageResponse
        uploadResumeFile(file: Upload!): messageResponse
    }
`;
