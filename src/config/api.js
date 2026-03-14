/**
 * API Configuration
 * Handles API base URL for development and production environments
 */

const API_BASE_URL = import.meta.env.PROD
  ? 'https://quizapp-backend-yypu.onrender.com/api'  // Production backend on Render
  : 'http://localhost:5000/api';  // In development, use local backend

export default API_BASE_URL;
