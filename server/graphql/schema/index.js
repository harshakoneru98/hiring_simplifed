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
        resume_uploaded: Boolean!
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

    input updateProfileInput {
        userId: ID!
        firstName: String!
        lastName: String!
        h1b_required: Boolean!
        resume_uploaded: Boolean!
        skills: [String]
    }

    type messageResponse {
        status: Int!
        message: String!
    }

    type skillsMessageResponse {
        status: Int!
        message: String!
        skills: [String]
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    type UserMetaData {
        firstName: String!
        lastName: String!
        h1b_required: Boolean!
        email: String!
        skills: [String]
        resume_uploaded: Boolean!
    }

    type SKILL {
        name: String!
    }

    type Query {
        login(email: String!, password: String!): AuthData!
        getUserDataById(userId: ID!): UserMetaData!
    }

    type Mutation {
        createUser(input: createUserInput!): messageResponse
        uploadResumeFile(
            file: Upload!
            userId: ID!
            existing_skills: [String]
        ): skillsMessageResponse
        updateUserProfile(input: updateProfileInput!): messageResponse
    }
`;
