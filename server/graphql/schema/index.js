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

    type Skill @exclude(operations: [CREATE, UPDATE, DELETE]) {
        name: String!
        jobs: [Job!]! @relationship(type: "Requires_Skill", direction: IN)
    }

    type City @exclude(operations: [CREATE, UPDATE, DELETE]) {
        name: String!
        jobs: [Job!]! @relationship(type: "City_has_job", direction: OUT)
    }

    type State @exclude(operations: [CREATE, UPDATE, DELETE]) {
        name: String!
        jobs: [Job!]! @relationship(type: "State_has_job", direction: OUT)
    }

    type Company @exclude(operations: [CREATE, UPDATE, DELETE]) {
        name: String!
        jobs: [Job!]! @relationship(type: "Has_Job", direction: OUT)
        company_type: Comp_Type! @relationship(type: "type_of", direction: OUT)
    }

    type Comp_Type @exclude(operations: [CREATE, UPDATE, DELETE]) {
        name: String!
        companies: [Company!]! @relationship(type: "type_of", direction: IN)
    }

    type Education_Level @exclude(operations: [CREATE, UPDATE, DELETE]) {
        name: String!
        jobs: [Job!]! @relationship(type: "Requires_degree", direction: IN)
    }

    type Job_Family @exclude(operations: [CREATE, UPDATE, DELETE]) {
        name: String!
        jobs: [Job!]! @relationship(type: "family_has_job", direction: OUT)
    }

    type Job @exclude(operations: [CREATE, UPDATE, DELETE]) {
        name: Int!
        H1B_flag: Int!
        JD: String!
        Salary: Int!
        Work_Min: Int!
        Work_Max: Int!
        Title: String!
        job_url: String!
        job_family: Job_Family!
            @relationship(type: "has_job_family", direction: OUT)
        city: City! @relationship(type: "Located_in_City", direction: OUT)
        state: State! @relationship(type: "Located_in_State", direction: OUT)
        company: Company! @relationship(type: "Work_4_Company", direction: OUT)
        education: [Education_Level!]!
            @relationship(type: "Requires_degree", direction: OUT)
        req_skills: [Skill!]!
            @relationship(type: "Requires_Skill", direction: OUT)
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
