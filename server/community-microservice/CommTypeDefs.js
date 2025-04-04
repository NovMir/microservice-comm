const {gql} = require('apollo-server-express');

const typeDefs = gql`
enum Role {
    RESIDENT
    BUSINESS_OWNER
    COMMUNITY_ORG
}
    type User @key(fields: "id") {
        id: ID!
        username: String!
    
        email: String!
        role: Role!
        
    }
    type CommunityPost{
     id: ID!
    author: User!
    title: String!
    content: String!
    category: String!
    aiSummary: String
    createdAt: String!
    updatedAt: String
    }
    type HelpRequest{
    id: ID! 
    author: User!
    description: String!
    isResolved: Boolean!
    volunteers: [User]
    createdAt: String!
    updatedAt: String
    }


  type Query {
    # Get all community posts
    posts: [CommunityPost]
    
    # Get posts by category
    postsByCategory(category: String!): [CommunityPost]
    
    # Get a specific post by ID
    post(id: ID!): CommunityPost
    
    # Get all help requests
    helpRequests: [HelpRequest]
    
    # Get a specific help request by ID
    helpRequest(id: ID!): HelpRequest
    
    # Get posts created by the current user
    myPosts: [CommunityPost]
    
    # Get help requests created by the current user
    myHelpRequests: [HelpRequest]
  }

  
  type Mutation {
    # Create a new community post
    createPost(input: CreatePostInput!): CommunityPost!
    
    # Update an existing community post
    updatePost(input: UpdatePostInput!): CommunityPost!
    
    # Delete a community post
    deletePost(id: ID!): Boolean!
    
    # Create a new help request
    createHelpRequest(input: CreateHelpRequestInput!): HelpRequest!
    
    resolveHelpRequest(id: ID!): HelpRequest
    
    # Delete a help request
    deleteHelpRequest(id: ID!): Boolean!
    
    # Volunteer for a help request
    volunteerForHelp(helpRequestId: ID!): HelpRequest!
  
  }

  input CreatePostInput {
  title: String!
  content: String!
  category: String!
}

input UpdatePostInput {
  id: ID!
  title: String
  content: String
  category: String
}

input CreateHelpRequestInput {
  description: String!
  location: String
}

`;

module.exports = typeDefs;