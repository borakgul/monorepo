import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = '#007bff', message = 'Yükleniyor...' }) => {
  return (
    <div className="loading-container">
      <div className={`spinner spinner-${size}`} style={{ borderTopColor: color }}>
        <div className="spinner-inner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;