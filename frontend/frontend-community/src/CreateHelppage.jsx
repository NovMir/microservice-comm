// src/pages/CreateHelpPage.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import HelpForm from './helpform';

const CreateHelpPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);
  
  // Show loading while checking authentication
  if (isLoading) {
    return <div className="loading">Checking authentication...</div>;
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="create-help-page">
      <h1 style={{ marginBottom: '30px' }}>Request Community Help</h1>
      
      <div className="help-guidelines" style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Guidelines for Requesting Help</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Be specific about what help you need</li>
          <li>Include location details if relevant</li>
          <li>Be respectful of volunteers' time and efforts</li>
          <li>Mark your request as resolved once help is received</li>
        </ul>
      </div>
      
      <HelpForm />
    </div>
  );
};

export default CreateHelpPage;