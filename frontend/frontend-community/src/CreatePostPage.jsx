// src/pages/CreatePostPage.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PostForm from './postform';

const CreatePostPage = () => {
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
    <div className="create-post-page">
      <h1 style={{ marginBottom: '30px' }}>Create a New Post</h1>
      <PostForm />
    </div>
  );
};

export default CreatePostPage;