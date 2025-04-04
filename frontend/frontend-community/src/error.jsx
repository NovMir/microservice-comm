import React from 'react';

const ErrorAlert = ({ message }) => {
  return (
    <div className="error-alert">
      {message}
    </div>
  );
};

export default ErrorAlert;