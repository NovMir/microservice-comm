// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-text">
        &copy; {currentYear} Community Portal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;