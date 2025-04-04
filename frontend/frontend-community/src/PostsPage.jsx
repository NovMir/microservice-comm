// src/pages/PostsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostList from './postlist';

const PostsPage = () => {
  const [user, setUser] = useState(null);
  
  // Get current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="posts-page">
      <div className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Community Posts</h1>
        {user && (
          <Link to="/create-post" className="btn btn-primary">
            Create New Post
          </Link>
        )}
      </div>
      
      <PostList />
    </div>
  );
};

export default PostsPage;