// API Configuration
// Centralizes API endpoint construction with robust production fallbacks.
// In production (deployed behind nginx), we proxy /api -> backend. Any hardcoded
// localhost reference breaks when accessed from a remote browser. So we derive
// the base at runtime from window.location if an explicit REACT_APP_API_URL
// isn't provided at build time.

// Priority:
// 1. Explicit build-time env REACT_APP_API_URL (must include /api or full origin)
// 2. Runtime origin + /api (works for same-domain deployments via reverse proxy)
// 3. Plain '/api' (SSR / non-browser fallback)
const API_BASE_URL = process.env.REACT_APP_API_URL || (typeof window !== 'undefined'
  ? `${window.location.origin}/api`
  : '/api');

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
