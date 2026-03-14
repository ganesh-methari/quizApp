/**
 * API Configuration
 * Handles API base URL for development and production environments
 */

const API_BASE_URL = import.meta.env.PROD
  ? '/api'  // In production, use relative paths for Vercel serverless functions
  : 'http://localhost:5000/api';  // In development, use local backend

export default API_BASE_URL;
