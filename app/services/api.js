import axios from 'axios';

// Replace with your local IP if testing on a physical device
const API_URL = 'https://petconnect-ulvh.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});


export default api;
