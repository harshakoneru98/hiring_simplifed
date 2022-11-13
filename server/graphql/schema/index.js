import { gql } from 'apollo-server-express';
import Upload from 'graphql-upload/Upload.mjs';

export const typeDefs = gql`
    scalar Upload

    type User @exclude {
        firstName: String!
        lastName: String!
        h1b_required: Boolean!
        email: String!
        password: String!
        skills: [String]
        resume_uploaded: Boolean!
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

    type messageResponse @exclude {
        status: Int!
        message: String!
    }

    type skillsMessageResponse @exclude {
        status: Int!
        message: String!
        skills: [String]
    }

    type AuthData @exclude {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    type UserMetaData @exclude {
        firstName: String!
        lastName: String!
        h1b_required: Boolean!
        email: String!
        skills: [String]
        resume_uploaded: Boolean!
    }

    type SKILL @exclude(operations: [CREATE, UPDATE, DELETE]) {
        name: String!
    }

    type Query {
        user(email: String!): User!
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
