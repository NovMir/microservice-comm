// frontend/auth-frontend/src/apollo-client.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create HTTP link to your GraphQL server
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Your auth service endpoint
});

// Add auth token to requests
const authLink = setContext((_, { headers }) => {
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  console.log(token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;