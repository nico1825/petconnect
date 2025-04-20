import axios from 'axios';

// Replace with your local IP if testing on a physical device
const API_URL = 'http://192.168.1.170:3001/api';

const api = axios.create({
  baseURL: API_URL,
});


export default api;
