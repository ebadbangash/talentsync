// API Configuration
// Centralized endpoint construction with smart handling of:
// - Development: REACT_APP_API_URL = http://localhost:5000 (full base, endpoints append /api/...)
// - Production: No env set, use window.location.origin (same-domain, nginx proxies /api -> backend)
//
// Strategy:
// 1. If REACT_APP_API_URL is set and looks like a full URL (http/https), use it as-is for base.
// 2. Otherwise, use window.location.origin (or empty for SSR).
// 3. Endpoints are constructed as `${base}/api/...` (single /api prefix).

const rawEnvBase = process.env.REACT_APP_API_URL;
let API_BASE_URL = '';

if (rawEnvBase && rawEnvBase.trim()) {
  // Env variable provided (e.g., http://localhost:5000)
  API_BASE_URL = rawEnvBase.trim().replace(/\/+$/, ''); // strip trailing slashes
} else if (typeof window !== 'undefined') {
  // Production: use current origin (e.g., http://ec2-3-233-226-45.compute-1.amazonaws.com)
  API_BASE_URL = window.location.origin;
}

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
