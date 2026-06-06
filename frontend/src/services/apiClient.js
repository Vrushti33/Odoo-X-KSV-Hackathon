const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Custom request wrapper around fetch API.
 * @param {string} endpoint - The relative API path.
 * @param {object} options - Request options.
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Auto-logout user if unauthorized/session expired
    if (response.status === 401) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      // Trigger a reload or redirect if appropriate
      window.location.reload();
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    // 204 No Content — return null
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
};

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body = null, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};
