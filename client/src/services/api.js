import axios from "axios";

// Base URL for API requests (override with VITE_API_BASE_URL in .env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true // include HTTP-only cookies
});

export default axiosInstance;
