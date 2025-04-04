const CommunityPost = require('./CommPostSchema');
const HelpRequest = require('./HelpReqSchema');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');

const resolvers = {
  Query: {
    posts: async () => CommunityPost.find().populate('author'),
    postsByCategory: async (_, { category }) =>
      CommunityPost.find({ category }).populate('author'),
    post: async (_, { id }) => CommunityPost.findById(id).populate('author'),
    helpRequests: async () => HelpRequest.find().populate('author volunteers'),
    helpRequest: async (_, { id }) => HelpRequest.findById(id).populate('author volunteers'),
    myPosts: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return CommunityPost.find({ author: user.id });
    },
    myHelpRequests: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return HelpRequest.find({ author: user.id });
    },
  },

  Mutation: {
    createPost: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return CommunityPost.create({ ...input, author: user.id });
    },

    updatePost: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const post = await CommunityPost.findById(input.id);
      if (!post) throw new Error('Post not found');
      if (post.author.toString() !== user.id) throw new ForbiddenError('Not authorized');
      Object.assign(post, input, { updatedAt: new Date() });
      return post.save();
    },

    deletePost: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const post = await CommunityPost.findById(id);
      if (!post) throw new Error('Post not found');
      if (post.author.toString() !== user.id) throw new ForbiddenError('Not authorized');
      await post.remove();
      return true;
    },

    createHelpRequest: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return HelpRequest.create({ ...input, author: user.id });
    },

    deleteHelpRequest: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const req = await HelpRequest.findById(id);
      if (!req) throw new Error('Help request not found');
      if (req.author.toString() !== user.id) throw new ForbiddenError('Not authorized');
      await req.remove();
      return true;
    },

    resolveHelpRequest: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      if (user.role !== 'COMMUNITY_ORG') throw new ForbiddenError('Only organizers can resolve requests');
      const req = await HelpRequest.findById(id);
      if (!req) throw new Error('Help request not found');
      req.isResolved = true;
      req.updatedAt = new Date();
      return req.save();
    },

    volunteerForHelp: async (_, { helpRequestId }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const req = await HelpRequest.findById(helpRequestId);
      if (!req) throw new Error('Help request not found');
      if (!req.volunteers.includes(user.id)) {
        req.volunteers.push(user.id);
        req.updatedAt = new Date();
        await req.save();
      }
      return req.populate('author volunteers');
    },
  }
};

module.exports = resolvers;
