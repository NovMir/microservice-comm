// src/components/Help/HelpDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_HELP_REQUEST } from './queries';
import { 
  DELETE_HELP_REQUEST, 
  UPDATE_HELP_REQUEST,
  VOLUNTEER_FOR_HELP,
  WITHDRAW_VOLUNTEER
} from './mutations';
import { formatDate } from './dateFormatter';
import Loading from './loading';
import ErrorAlert from './error';

const HelpDetail = () => {
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
  
  // Query to get help request details
  const { loading, error, data, refetch } = useQuery(GET_HELP_REQUEST, {
    variables: { id },
    fetchPolicy: 'network-only' // Don't use cache
  });
  
  // Delete help request mutation
  const [deleteHelpRequest, { loading: deleteLoading }] = useMutation(DELETE_HELP_REQUEST, {
    onCompleted: () => {
      // Navigate back to help requests list after deletion
      navigate('/help');
    },
    onError: (error) => {
      console.error('Error deleting help request:', error);
    }
  });
  
  // Update help request mutation (for resolving/reopening)
  const [updateHelpRequest, { loading: updateLoading }] = useMutation(UPDATE_HELP_REQUEST, {
    onCompleted: () => {
      // Refetch to get updated data
      refetch();
    },
    onError: (error) => {
      console.error('Error updating help request:', error);
    }
  });
  
  // Volunteer mutation
  const [volunteerForHelp, { loading: volunteerLoading }] = useMutation(VOLUNTEER_FOR_HELP, {
    onCompleted: () => {
      refetch();
    }
  });
  
  // Withdraw volunteer mutation
  const [withdrawVolunteer, { loading: withdrawLoading }] = useMutation(WITHDRAW_VOLUNTEER, {
    onCompleted: () => {
      refetch();
    }
  });
  
  // Handle help request deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this help request?')) {
      deleteHelpRequest({ variables: { id } });
    }
  };
  
  // Handle resolving/reopening the help request
  const toggleResolved = () => {
    updateHelpRequest({
      variables: {
        input: {
          id,
          isResolved: !data.helpRequest.isResolved
        }
      }
    });
  };
  
  // Handle volunteering/withdrawing
  const handleVolunteerClick = () => {
    if (isUserVolunteering) {
      withdrawVolunteer({ variables: { helpRequestId: id } });
    } else {
      volunteerForHelp({ variables: { helpRequestId: id } });
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={`Error loading help request: ${error.message}`} />;
  
  const helpRequest = data.helpRequest;
  
  // Check if current user is the author
  const isAuthor = user && helpRequest.author && user.id === helpRequest.author.id;
  // Check if current user is a community organizer
  const isOrganizer = user && user.role === 'COMMUNITY_ORGANIZER';
  // Check if current user is volunteering
  const isUserVolunteering = user && helpRequest.volunteers.some(
    volunteer => volunteer.id === user.id
  );
  // Can modify if author or organizer
  const canModify = isAuthor || isOrganizer;
  
  return (
    <div className="help-detail">
      <div className="help-header" style={{ marginBottom: '20px' }}>
        <Link to="/help" className="btn btn-outline" style={{ marginRight: '10px' }}>
          ← Back to Help Requests
        </Link>
        
        {canModify && (
          <div className="help-actions" style={{ display: 'inline-block' }}>
            <button 
              className={`btn ${helpRequest.isResolved ? 'btn-warning' : 'btn-success'}`}
              onClick={toggleResolved}
              disabled={updateLoading}
              style={{ marginRight: '10px' }}
            >
              {updateLoading 
                ? 'Updating...' 
                : (helpRequest.isResolved ? 'Reopen Request' : 'Mark as Resolved')}
            </button>
            
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Request'}
            </button>
          </div>
        )}
      </div>
      
      <div className="card">
        <div className="help-status" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '15px' 
        }}>
          <span className={`badge ${helpRequest.isResolved ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '1rem' }}>
            {helpRequest.isResolved ? 'Resolved' : 'Active'}
          </span>
          
          {user && !isAuthor && !helpRequest.isResolved && (
            <button 
              className={`btn ${isUserVolunteering ? 'btn-danger' : 'btn-success'}`}
              onClick={handleVolunteerClick}
              disabled={volunteerLoading || withdrawLoading}
            >
              {isUserVolunteering 
                ? (withdrawLoading ? 'Withdrawing...' : 'Withdraw as Volunteer') 
                : (volunteerLoading ? 'Volunteering...' : 'Volunteer to Help')}
            </button>
          )}
        </div>
        
        <div className="help-meta" style={{ marginBottom: '20px' }}>
          <div>
            <strong>Posted by:</strong> {helpRequest.author?.username || 'Anonymous'}
          </div>
          <div>
            <strong>Date:</strong> {formatDate(helpRequest.createdAt)}
          </div>
          {helpRequest.location && (
            <div>
              <strong>Location:</strong> {helpRequest.location}
            </div>
          )}
          {helpRequest.updatedAt && (
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
              Last updated: {formatDate(helpRequest.updatedAt)}
            </div>
          )}
        </div>
        
        <div className="help-description" style={{ 
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f9f9f9',
          borderRadius: '5px'
        }}>
          {helpRequest.description}
        </div>
        
        <div className="volunteers-section">
          <h3 style={{ marginBottom: '10px' }}>Volunteers ({helpRequest.volunteers.length})</h3>
          
          {helpRequest.volunteers.length === 0 ? (
            <p>No volunteers yet</p>
          ) : (
            <ul style={{ 
              listStyle: 'none',
              padding: '0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {helpRequest.volunteers.map((volunteer) => (
                <li key={volunteer.id} style={{
                  padding: '5px 10px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '15px',
                  display: 'inline-block'
                }}>
                  {volunteer.username}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpDetail;