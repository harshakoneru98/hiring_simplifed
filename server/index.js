import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { typeDefs } from './graphql/schema/index.js';
import { resolvers } from './graphql/resolvers/index.js';

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        uploads: false
    });

    await server.start();

    const app = express();
    app.use(graphqlUploadExpress());

    server.applyMiddleware({ app });

    await new Promise((r) => app.listen({ port: 4000 }, r));

    console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
}

startServer();
