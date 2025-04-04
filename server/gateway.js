// server/gateway/gateway.js
const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');
require('dotenv').config();

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'auth', url: 'http://localhost:4000/graphql' },
    { name: 'community', url: 'http://localhost:4002/graphql' }
  ],
  // optional: enable schema polling for live updates
  __exposeQueryPlanExperimental: false,
});

const server = new ApolloServer({
  gateway,
  subscriptions: false, // Subscriptions are not yet supported with federation
});

server.listen({ port: 4005 }).then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`);
});
