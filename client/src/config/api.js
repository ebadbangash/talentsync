// API Configuration
// This file centralizes all API endpoint configurations

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  PROTECTED: `${API_BASE_URL}/api/auth/protected`,
  
  // Jobs endpoints
  JOBS: `${API_BASE_URL}/api/jobs`,
  JOB_APPLY: `${API_BASE_URL}/api/jobs/apply`,
  
  // Companies endpoints
  COMPANIES: `${API_BASE_URL}/api/companies`,
  
  // Salaries endpoints
  SALARIES: `${API_BASE_URL}/api/salaries`,
};

export default API_BASE_URL;
