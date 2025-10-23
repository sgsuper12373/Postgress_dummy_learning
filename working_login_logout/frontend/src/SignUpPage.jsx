// src/SignUpPage.jsx
import React, { useState } from 'react';
// import axios from 'axios'; // Not used, can be removed
import apiClient from './api';
import { useNavigate } from 'react-router-dom'; // <-- IMPORTED

function SignUpPage() { // <-- RENAMED
  const navigate = useNavigate(); // <-- ADDED
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // <-- ADDED
  const [success, setSuccess] = useState(''); // <-- ADDED


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
        // Use endpoint only, baseURL is in apiClient
        const response = await apiClient.post('/signup', {
          email: email,
          password: password
        });

        setSuccess(response.data.message + ' Redirecting to login...');

        setTimeout(() => {
          navigate('/login'); 
        }, 2000);

      } catch (error) { // <-- FILLED IN
        if (error.response) {
          setError(error.response.data.error || 'Something went wrong');
        } else {
          setError('Sign up failed. Please try again.');
        }
      }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {/* Show error or success messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUpPage; // <-- RENAMED