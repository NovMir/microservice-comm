//entry point
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const typeDefs = require('./authTypeDefs');
const resolvers = require('./authResolvers');

dotenv.config();

const app = express();
app.use(cors());

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        schema: buildSubgraphSchema({ typeDefs, resolvers }),
        context:async ({ req }) => {
            try{
                const authHeader = req.headers.authorization || '';
            
            console.log("authHeader",authHeader);
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.replace('Bearer ', '');
                const user = jwt.verify(token,process.env.JWT_SECRET);
                    return { user };
                
            }
                return { user: null };
            }catch (error){
                console.error('Error verifying token',error);
        
        return { user: null};
    }
            },
    });
    await server.start();
    server.applyMiddleware({ app });

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
    
    app.listen({ port: process.env.PORT || 4000 }, () => {
        console.log(`Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
    });

}

startServer();