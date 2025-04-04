// src/index.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { buildSubgraphSchema } = require('@apollo/subgraph');
// Import application modules
const connectDB = require('./db');
const typeDefs = require('./CommTypeDefs');
const resolvers = require('./CommResolvers');

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Enable CORS for all routes
app.use(cors());

// Start Apollo Server
async function startServer() {
  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
    // Setup context for each request (authentication)
    context: ({ req }) => {
      // Get token from Authorization header
      const authHeader = req.headers.authorization || '';
      
      if (authHeader) {
        try {
          // Verify JWT token
          const token = authHeader.replace('Bearer ', '');
          const user = jwt.verify(token, process.env.JWT_SECRET);
          
          // Return user info in context
          return { user };
        } catch (error) {
          console.error('Invalid token:', error.message);
          return { user: null };
        }
      }
      
      // Return null user if no token
      return { user: null };
    }
  });

  // Start the Apollo server
  await server.start();
  
  // Apply middleware to Express
  server.applyMiddleware({ app });

  // Connect to database
  await connectDB();

  // Start Express server
  const PORT = process.env.PORT || 4002;
  app.listen(PORT, () => {
    console.log(`Community server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Run the server
startServer().catch(error => {
  console.error('Server startup error:', error);
});