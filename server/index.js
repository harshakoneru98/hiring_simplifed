import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { typeDefs } from './graphql/schema/index.js';
import { resolvers } from './graphql/resolvers/index.js';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';
import config from './config.js';

async function startServer() {
    const driver = neo4j.driver(
        config.NEO4J_URI,
        neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD)
    );

    const neoSchema = new Neo4jGraphQL({
        typeDefs,
        driver,
        resolvers,
        uploads: false
    });

    neoSchema
        .getSchema()
        .then(async (schema) => {
            const server = new ApolloServer({
                schema: schema
            });

            await server.start();

            const app = express();
            app.use(graphqlUploadExpress());

            server.applyMiddleware({ app });

            await new Promise((r) => app.listen({ port: 4000 }, r));

            console.log(
                `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
            );
        })
        .catch((error) => {
            console.log('Neo4j Connection Failed');
        });
}

startServer();
