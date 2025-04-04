// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_POSTS, GET_HELP_REQUESTS } from './queries';
import PostCard from './postcard';
import HelpCard from './helpcard';
import Loading from './loading';
import ErrorAlert from './error';

const Home = () => {
  const [user, setUser] = useState(null);
  
  // Get current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Query for recent posts
  const { 
    loading: postsLoading, 
    error: postsError, 
    data: postsData 
  } = useQuery(GET_POSTS, {
    variables: { limit: 3 }
  });

  // Query for recent help requests
  const { 
    loading: helpLoading, 
    error: helpError, 
    data: helpData 
  } = useQuery(GET_HELP_REQUESTS, {
    variables: { limit: 3 }
  });

  // Get a welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="home-page">
      <section className="hero" style={{
        backgroundColor: '#e3f2fd',
        padding: '40px 20px',
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '15px' }}>
          {user ? `${getWelcomeMessage()}, ${user.username}!` : 'Welcome to the Community Portal'}
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 20px' }}>
          Connect with your community, share news, discuss ideas, and help each other.
        </p>
        {!user && (
          <div className="action-buttons" style={{ marginTop: '20px' }}>
            <Link to="/login" className="btn btn-outline" style={{ marginRight: '15px' }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        )}
      </section>
      
      <div className="home-content" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        {/* Recent Posts Section */}
        <section className="recent-posts">
          <div className="section-header" style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2>Recent Posts</h2>
            <Link to="/posts" className="btn btn-outline btn-sm">View All</Link>
          </div>
          
          {postsLoading ? (
            <Loading />
          ) : postsError ? (
            <ErrorAlert message={postsError.message} />
          ) : (
            <div className="posts-list">
              {postsData?.posts?.length > 0 ? (
                postsData.posts.slice(0, 3).map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <p>No posts found</p>
              )}
              
              {user && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Link to="/create-post" className="btn btn-primary">
                    Create New Post
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
        
        {/* Help Requests Section */}
        <section className="help-requests">
          <div className="section-header" style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2>Help Requests</h2>
            <Link to="/help" className="btn btn-outline btn-sm">View All</Link>
          </div>
          
          {helpLoading ? (
            <Loading />
          ) : helpError ? (
            <ErrorAlert message={helpError.message} />
          ) : (
            <div className="help-list">
              {helpData?.helpRequests?.length > 0 ? (
                helpData.helpRequests
                  .filter(request => !request.isResolved)
                  .slice(0, 3)
                  .map(request => (
                    <HelpCard key={request.id} helpRequest={request} />
                  ))
              ) : (
                <p>No active help requests</p>
              )}
              
              {user && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Link to="/create-help" className="btn btn-primary">
                    Request Help
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;