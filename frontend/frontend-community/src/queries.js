// src/graphql/queries.js
import { gql } from '@apollo/client';

// Query to get all community posts
export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      category
      createdAt
      author {
        id
        username
      }
    }
  }
`;

// Query to get posts by category
export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($category: String!) {
    postsByCategory(category: $category) {
      id
      title
      content
      category
      createdAt
      author {
        id
        username
      }
    }
  }
`;

// Query to get a single post by ID
export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      category
      aiSummary
      createdAt
      updatedAt
      author {
        id
        username
      }
    }
  }
`;

// Query to get all help requests
export const GET_HELP_REQUESTS = gql`
  query GetHelpRequests {
    helpRequests {
      id
      description
      
      isResolved
      createdAt
      author {
        id
        username
      }
      volunteers {
        id
        username
      }
    }
  }
`;

// Query to get a single help request by ID
export const GET_HELP_REQUEST = gql`
  query GetHelpRequest($id: ID!) {
    helpRequest(id: $id) {
      id
      description
      
      isResolved
      createdAt
      updatedAt
      author {
        id
        username
      }
      volunteers {
        id
        username
      }
    }
  }
`;

// Query to get current user's posts
export const GET_MY_POSTS = gql`
  query GetMyPosts {
    myPosts {
      id
      title
      content
      category
      createdAt
    }
  }
`;

// Query to get current user's help requests
export const GET_MY_HELP_REQUESTS = gql`
  query GetMyHelpRequests {
    myHelpRequests {
      id
      description
      
      isResolved
      createdAt
      volunteers {
        id
        username
      }
    }
  }
`;