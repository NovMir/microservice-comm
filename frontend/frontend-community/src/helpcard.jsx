// src/components/Help/HelpCard.jsx
import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { VOLUNTEER_FOR_HELP, WITHDRAW_VOLUNTEER } from './mutations';
import { formatDate } from './dateFormatter';

const Helpcard = ({ helpRequest }) => {
  const [user, setUser] = useState(null);
  
  // Get current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Check if current user is volunteering
  const isUserVolunteering = user && helpRequest.volunteers.some(
    volunteer => volunteer.id === user.id
  );
  
  // Get count of volunteers
  const volunteerCount = helpRequest.volunteers.length;
  
  // Set up volunteer mutation
  const [volunteerForHelp, { loading: volunteerLoading }] = useMutation(VOLUNTEER_FOR_HELP, {
    variables: { helpRequestId: helpRequest.id }
  });
  
  // Set up withdraw mutation
  const [withdrawVolunteer, { loading: withdrawLoading }] = useMutation(WITHDRAW_VOLUNTEER, {
    variables: { helpRequestId: helpRequest.id }
  });
  
  // Handle volunteer button click
  const handleVolunteerClick = () => {
    if (isUserVolunteering) {
      withdrawVolunteer();
    } else {
      volunteerForHelp();
    }
  };
  
  // Truncate description if it's too long
  const truncateDescription = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="card">
      <div className="card-status" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '10px' 
      }}>
        <span className={`badge ${helpRequest.isResolved ? 'badge-success' : 'badge-warning'}`}>
          {helpRequest.isResolved ? 'Resolved' : 'Active'}
        </span>
        
        <span className="volunteer-count" style={{ fontSize: '0.9rem' }}>
          <strong>{volunteerCount}</strong> volunteer{volunteerCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="card-content">
        <p>{truncateDescription(helpRequest.description)}</p>
      </div>
      
      {helpRequest.location && (
        <div className="location" style={{ 
          fontSize: '0.9rem', 
          margin: '10px 0',
          color: '#666'
        }}>
          📍 {helpRequest.location}
        </div>
      )}
      
      <div className="card-subtitle">
        Posted by {helpRequest.author?.username || 'Anonymous'} | {formatDate(helpRequest.createdAt)}
      </div>
      
      <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to={`/help/${helpRequest.id}`} className="btn btn-outline">
          View Details
        </Link>
        
        {user && !helpRequest.isResolved && (
          <button 
            className={`btn ${isUserVolunteering ? 'btn-danger' : 'btn-success'}`}
            onClick={handleVolunteerClick}
            disabled={volunteerLoading || withdrawLoading}
          >
            {isUserVolunteering 
              ? (withdrawLoading ? 'Withdrawing...' : 'Withdraw') 
              : (volunteerLoading ? 'Volunteering...' : 'Volunteer')}
          </button>
        )}
      </div>
    </div>
  );
};

export default Helpcard;