// src/components/Help/HelpForm.jsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_HELP_REQUEST } from './mutations';
import { GET_HELP_REQUESTS } from './queries';
import ErrorAlert from './error';

const HelpForm = () => {
  const [formData, setFormData] = useState({
    description: '',
    location: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Set up mutation
  const [createHelpRequest, { loading }] = useMutation(CREATE_HELP_REQUEST, {
    onCompleted: (data) => {
      // Redirect to the newly created help request
      navigate(`/help/${data.createHelpRequest.id}`);
    },
    onError: (error) => {
      setError(error.message);
    },
    // Update cache after creation
    update: (cache, { data: { createHelpRequest } }) => {
      // Read current help requests from cache
      const { helpRequests } = cache.readQuery({ query: GET_HELP_REQUESTS }) || { helpRequests: [] };
      
      // Write updated help requests to cache
      cache.writeQuery({
        query: GET_HELP_REQUESTS,
        data: { helpRequests: [createHelpRequest, ...helpRequests] }
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
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Submit the form
    createHelpRequest();
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Request Help</h2>
      
      {error && <ErrorAlert message={error} />}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what help you need..."
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="location" className="form-label">Location (Optional)</label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-input"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location where help is needed"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default HelpForm;