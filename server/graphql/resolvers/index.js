import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import authQuery from './auth/authQuery.js';
import userQuery from './user/userQuery.js';
import authMutation from './auth/authMutation.js';
import fileUploadMutation from './fileUpload/fileUploadMutation.js';
import userMutation from './user/userMutation.js';

export const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        ...authQuery,
        ...userQuery
    },
    Mutation: {
        ...authMutation,
        ...fileUploadMutation,
        ...userMutation
    }
};
