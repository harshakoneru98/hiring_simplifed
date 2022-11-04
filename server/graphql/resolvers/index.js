import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import authQuery from './auth/authQuery.js';
import authMutation from './auth/authMutation.js';
import fileUploadMutation from './fileUpload/fileUploadMutation.js';

export const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        ...authQuery
    },
    Mutation: {
        ...authMutation,
        ...fileUploadMutation
    }
};
