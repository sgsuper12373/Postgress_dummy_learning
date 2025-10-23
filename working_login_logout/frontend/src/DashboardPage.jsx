// src/DashboardPage.jsx
import React, { useState } from 'react'; // <-- ADDED useState
import apiClient from './api'; 

function DashboardPage() {
  const [profileMessage, setProfileMessage] = useState('');

  // Function to get protected data
  const getProfile = async () => {
    try {
      const response = await apiClient.get('/profile');
      setProfileMessage(response.data.message); 
    } catch (error) {
      setProfileMessage('Could not fetch profile.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login'; 
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>You are logged in!</p>
      <button onClick={getProfile}>Get Profile Data</button>
      <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
        Logout
      </button>
      {profileMessage && <p>{profileMessage}</p>}
    </div>
  );
}

export default DashboardPage;