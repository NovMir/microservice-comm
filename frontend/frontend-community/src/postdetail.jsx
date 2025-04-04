// src/components/Posts/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_POST } from './queries';
import { DELETE_POST } from './mutations';
import { formatDate } from './dateFormatter';
import Loading from './loading';
import ErrorAlert from './error';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Get current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Query to get post details
  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id },
    fetchPolicy: 'network-only' // Don't use cache
  });
  
  // Delete post mutation
  const [deletePost, { loading: deleteLoading }] = useMutation(DELETE_POST, {
    onCompleted: () => {
      // Navigate back to posts list after deletion
      navigate('/posts');
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
    }
  });
  
  // Handle post deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost({ variables: { id } });
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={`Error loading post: ${error.message}`} />;
  
  const post = data.post;
  
  // Check if current user is the author
  const isAuthor = user && post.author && user.id === post.author.id;
  // Check if current user is a community organizer
  const isOrganizer = user && user.role === 'COMMUNITY_ORGANIZER';
  // Can edit/delete if author or organizer
  const canModify = isAuthor || isOrganizer;
  
  return (
    <div className="post-detail">
      <div className="post-header" style={{ marginBottom: '20px' }}>
        <Link to="/posts" className="btn btn-outline" style={{ marginRight: '10px' }}>
          ← Back to Posts
        </Link>
        
        {canModify && (
          <div className="post-actions" style={{ display: 'inline-block' }}>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        )}
      </div>
      
      <div className="card">
        <h1 className="card-title">{post.title}</h1>
        
        <div className="post-meta" style={{ marginBottom: '20px' }}>
          <span>
            Posted by {post.author?.username || 'Anonymous'} | {formatDate(post.createdAt)}
          </span>
          <span className={`badge ${post.category === 'news' ? 'badge-primary' : 'badge-warning'}`} style={{ marginLeft: '10px' }}>
            {post.category}
          </span>
          {post.updatedAt && (
            <div className="updated-at" style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
              Last updated: {formatDate(post.updatedAt)}
            </div>
          )}
        </div>
        
        {post.aiSummary && (
          <div className="ai-summary" style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderLeft: '3px solid #4a90e2',
            marginBottom: '20px' 
          }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '5px' }}>AI Summary</h3>
            <p>{post.aiSummary}</p>
          </div>
        )}
        
        <div className="post-content" style={{ 
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap'
        }}>
          {post.content}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;