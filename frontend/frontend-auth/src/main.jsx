// frontend/auth-frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import client from './Apolloclient';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);