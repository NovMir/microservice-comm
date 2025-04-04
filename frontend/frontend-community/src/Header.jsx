// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Community Portal
        </Link>
        
        <nav className="nav-links">
          <Link to="/posts">Posts</Link>
          <Link to="/help">Help Requests</Link>
          {user && (
            <>
              <Link to="/create-post">Create Post</Link>
              <Link to="/create-help">Request Help</Link>
            </>
          )}
        </nav>
        
        <div className="user-menu">
          {user ? (
            <>
              <span className="user-name">Hello, {user.username}</span>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;