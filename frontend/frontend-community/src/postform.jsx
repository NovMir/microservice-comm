// src/components/Posts/PostForm.jsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_POST } from './mutations';
import { GET_POSTS } from './queries';
import ErrorAlert from './error';

const PostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'discussion'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Set up mutation
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      // Redirect to the newly created post
      navigate(`/posts/${data.createPost.id}`);
    },
    onError: (error) => {
      setError(error.message);
    },
    // Update cache after creation
    update: (cache, { data: { createPost } }) => {
      // Read current posts from cache
      const { posts } = cache.readQuery({ query: GET_POSTS }) || { posts: [] };
      
      // Write updated posts to cache
      cache.writeQuery({
        query: GET_POSTS,
        data: { posts: [createPost, ...posts] }
      });
    },
    // Variables for the mutation
    variables: {
      input: formData
    }
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Submit the form
    createPost();
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create New Post</h2>
      
      {error && <ErrorAlert message={error} />}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a descriptive title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="discussion">Discussion</option>
            <option value="news">News</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            id="content"
            name="content"
            className="form-textarea"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content here..."
            required
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;