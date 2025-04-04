// src/pages/HelpPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HelpList from './helplist';

const HelpPage = () => {
  const [user, setUser] = useState(null);
  
  // Get current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="help-page">
      <div className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Help Requests</h1>
        {user && (
          <Link to="/create-help" className="btn btn-primary">
            Request Help
          </Link>
        )}
      </div>
      
      <div className="help-intro" style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Community Help Center</h2>
        <p>
          This is where community members can request assistance or volunteer to help others.
          Browse open requests, offer your help, or create a new request if you need assistance.
        </p>
      </div>
      
      <HelpList />
    </div>
  );
};

export default HelpPage;