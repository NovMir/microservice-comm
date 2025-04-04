// src/utils/dateFormatter.js

/**
 * Format a date string into a more readable format
 * @param {string} dateString - ISO date string from the server
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Options for formatting
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options);
  };
  
  /**
   * Get relative time (e.g., "2 hours ago")
   * @param {string} dateString - ISO date string from the server
   * @returns {string} Relative time string
   */
  export const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const diffInMs = now - date;
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSecs < 60) {
      return 'just now';
    } else if (diffInMins < 60) {
      return `${diffInMins} minute${diffInMins !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };