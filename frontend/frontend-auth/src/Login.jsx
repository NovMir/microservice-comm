// frontend/auth-frontend/src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

// GraphQL login mutation
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      // Store token in localStorage
      console.log("Login data",data);
      localStorage.setItem('token', data.login.token);
      // Store user data (optional)
      localStorage.setItem('user', JSON.stringify(data.login.user));
      
      // Redirect or update UI
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: { email, password } });
  };
  
  return (
    <div className="login-form">
      <h2>Login</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;