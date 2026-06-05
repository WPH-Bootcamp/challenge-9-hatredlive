import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const api = axios.create({
  baseURL: (import.meta.env.VITE_TMDB_BASE_URL as string) || 'https://api.themoviedb.org/3',
  params: API_KEY ? { api_key: API_KEY } : {},
});

// Request interceptor: ensure API key present
api.interceptors.request.use((config) => {
  if (!config.params) config.params = {};
  if (API_KEY && !config.params['api_key']) config.params['api_key'] = API_KEY;
  return config;
});

// Response interceptor: pass through or normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
