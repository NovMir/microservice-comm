const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
const User = require('./UserSchema');
const jwt = require('jsonwebtoken');


const resolvers = {
    Query: {
      me: (_, __, context) => {
        // Check if user is authenticated
        if (!context.user) {
          throw new AuthenticationError('Not authenticated');
        }
        
        // Return user data
        return User.findById(context.user.id);
      },
      
      allUsers: (_, __, context) => {
        // Check if user is authenticated and has the right role
        if (!context.user) {
          throw new AuthenticationError('Not authenticated');
        }
        
        if (context.user.role !== 'COMMUNITY_ORGANIZER') {
          throw new ForbiddenError('Not authorized to view all users');
        }
        
        // Return all users
        return User.find({});
      }
    },
    
    Mutation: {
        register: async (_, { username, email, password, role }) => {
          const existingUser = await User.findOne({ $or: [{ email }, { username }] });
          if (existingUser) {
            throw new Error('User already exists');
          }
    
          const newUser = new User({ username, email, password, role });
          await newUser.save();
    
          const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
          return {
            token,
            user: newUser
          };
        },
        
    
        login: async (_, { email, password }) => {
          const user = await User.findOne({ email });
          if (!user) {
            throw new AuthenticationError('Invalid credentials');
          }
    
          const valid = await user.comparePassword(password);
          if (!valid) {
            throw new AuthenticationError('Invalid credentials');
          }
    
          const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
          return {
            token,
            user
          };
        } 
    }

};

module.exports = resolvers;