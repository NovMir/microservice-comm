
import { gql } from '@apollo/client';

// Create a new community post
export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
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

// Update an existing post
export const UPDATE_POST = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      id
      title
      content
      category
      updatedAt
    }
  }
`;

// Delete a post
export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

// Create a new help request
export const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest($input: CreateHelpRequestInput!) {
    createHelpRequest(input: $input) {
      id
      description
      
      isResolved
      createdAt
      author {
        id
        username
      }
    }
  }
`;

// Update a help request
export const UPDATE_HELP_REQUEST = gql`
  mutation UpdateHelpRequest($input: UpdateHelpRequestInput!) {
    updateHelpRequest(input: $input) {
      id
      description
      
      isResolved
      updatedAt
    }
  }
`;

// Delete a help request
export const DELETE_HELP_REQUEST = gql`
  mutation DeleteHelpRequest($id: ID!) {
    deleteHelpRequest(id: $id)
  }
`;

// Volunteer for a help request
export const VOLUNTEER_FOR_HELP = gql`
  mutation VolunteerForHelp($helpRequestId: ID!) {
    volunteerForHelp(helpRequestId: $helpRequestId) {
      id
      volunteers {
        id
        username
      }
    }
  }
`;

// Withdraw from volunteering
export const WITHDRAW_VOLUNTEER = gql`
  mutation WithdrawVolunteer($helpRequestId: ID!) {
    withdrawVolunteer(helpRequestId: $helpRequestId) {
      id
      volunteers {
        id
        username
      }
    }
  }
`;