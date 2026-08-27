/**
 * Lightweight axios client for landing-page routes that call the CRM backend
 * directly (agreements/sign, gyms/[slug], ops panel).
 *
 * Previously these hit NEXT_PUBLIC_API_URL. Now they go through the CRM app
 * which runs at NEXT_PUBLIC_CRM_URL (default: http://localhost:3001).
 */
import axios from 'axios';

const api = axios.create({
  baseURL:
    (process.env.NEXT_PUBLIC_CRM_URL ?? 'http://localhost:3001') + '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('fitkalp_access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
