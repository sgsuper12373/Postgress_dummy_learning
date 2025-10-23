import React, { useState } from 'react';
import SignUp from './SignUp';
import Login from './Login';
import apiClient from './api'; // Import our new helper
import './App.css';

function App() {
  const [profileMessage, setProfileMessage] = useState('');
  
  // Function to test the protected route
  const getProfile = async () => {
    try {
      const response = await apiClient.get('/profile');
      setProfileMessage(response.data.message); // Set success message
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setProfileMessage('You are not authorized! Please log in.');
      } else {
        setProfileMessage('An error occurred.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setProfileMessage('Logged out.');
  };

  return (
    <div className="App">
      <header className="App-header">
        <SignUp />
        <hr />
        <Login />
        <hr />
        {/* --- NEW TEST SECTION --- */}
        <div>
          <h2>Test Protected Route</h2>
          <button onClick={getProfile}>Get Profile</button>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
          {profileMessage && <p>{profileMessage}</p>}
        </div>
        {/* --- END TEST SECTION --- */}
      </header>
    </div>
  );
}

export default App;