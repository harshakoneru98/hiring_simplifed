const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./graphql/schema/index');
const { resolvers } = require('./graphql/resolvers/index');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`APIs are working at ${url}`);
});
