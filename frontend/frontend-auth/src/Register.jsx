// frontend/auth-frontend/src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

// GraphQL register mutation
const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!, $email: String!, $role: Role!)
   {
    register(
        username: $username
         password: $password
        email: $email
        role: $role)
        {
        token
        user {
          id
          username
          
        }
      }
}
`;

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'RESIDENT',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.register.token);
      localStorage.setItem('user', JSON.stringify(data.register.user));
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      console.log("Registration error",error.message); 
      setErrorMessage(error.message);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ variables: formData });
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="RESIDENT">Resident</option>
            <option value="BUSINESS_OWNER">Business Owner</option>
            <option value="COMMUNITY_ORG">Community Organizer</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
