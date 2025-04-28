import axios from "axios";

// Base URL for API requests (override with VITE_API_BASE_URL in .env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true // include HTTP-only cookies
});

// Add token to Authorization header if available
axiosInstance.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.token) {
          config.headers["Authorization"] = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
