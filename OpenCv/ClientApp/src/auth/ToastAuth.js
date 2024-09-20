import React from 'react';
import './ToastAuth.css'; // Import the CSS file for the toast styling

const ToastAuth = ({ message, type }) => {
    if (!message) return null;

    return (
        <div className={`toast-auth ${type}`}>
            {message}
        </div>
    );
};

export default ToastAuth;
