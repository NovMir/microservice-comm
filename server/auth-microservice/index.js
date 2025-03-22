//entry point
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
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
        context: ({ req }) => {
            const token = req.headers.authorization || '';
            console.log(req.headers.authorization);
            if (token){
                try{
                    const user = jwt.verify(token.replace('Bearer ',''), process.env.JWT_SECRET);
                    return { user };
                
            }catch (err) {
                console.error('Invalid token',err.message);
                return { user: null };
            }
        }
        return { user: null};
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