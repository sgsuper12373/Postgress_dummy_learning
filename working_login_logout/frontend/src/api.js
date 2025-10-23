import axios from 'axios';

// Create a custom axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000' // Your Flask backend URL
});

// Add a request interceptor to attach the token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;