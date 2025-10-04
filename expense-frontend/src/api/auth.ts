import axios from 'axios';
export const API = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});
// attach token on each request (optional)
API.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
export const signup = (data:any) => API.post('/auth/signup', data);
export const login  = (data:any) => API.post('/auth/login', data);
