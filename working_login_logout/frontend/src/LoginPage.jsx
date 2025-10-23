// src/LoginPage.jsx
import React, { useState } from 'react';
// import axios from 'axios'; // Not used, can be removed
import apiClient from './api';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  // --- THIS MOVED HERE ---
  const navigate = useNavigate();
  // ---
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess(''); 

    try {
      // The baseURL is already in apiClient, so just use the endpoint
      const response = await apiClient.post('/login', {
        email: email,
        password: password
      });

      if (response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            navigate('/'); 
          }, 1000);
        }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'Something went wrong');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
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
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginPage;