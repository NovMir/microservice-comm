// src/components/Help/HelpList.jsx
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_HELP_REQUESTS } from './queries';
import HelpCard from './helpcard';
import Loading from './loading';
import ErrorAlert from './error';

const HelpList = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'resolved'
  
  // Query to get all help requests
  const { loading, error, data, refetch } = useQuery(GET_HELP_REQUESTS, {
    fetchPolicy: 'network-only' // Don't use cache
  });

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={`Error loading help requests: ${error.message}`} />;

  // Filter help requests based on status
  const filteredRequests = data.helpRequests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'active') return !request.isResolved;
    if (filter === 'resolved') return request.isResolved;
    return true;
  });

  return (
    <div className="help-list">
      <div className="filter-controls" style={{ marginBottom: '20px' }}>
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
          style={{ marginRight: '10px' }}
        >
          All Requests
        </button>
        <button 
          className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('active')}
          style={{ marginRight: '10px' }}
        >
          Active
        </button>
        <button 
          className={`btn ${filter === 'resolved' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('resolved')}
        >
          Resolved
        </button>
        <button 
          className="btn btn-outline"
          onClick={() => refetch()}
          style={{ marginLeft: '15px' }}
        >
          Refresh
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <p>No help requests found.</p>
      ) : (
        <div className="grid">
          {filteredRequests.map(request => (
            <HelpCard key={request.id} helpRequest={request} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HelpList;