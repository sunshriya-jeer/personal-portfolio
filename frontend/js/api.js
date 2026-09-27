/**
 * api.js - REST API Client Foundation
 * 
 * ARCHITECTURE NOTE:
 * This module manages REST API communication with the Node.js/Express backend.
 * All functions are structured with async/await patterns, error handling wrappers,
 * and clean endpoints.
 */

const PortfolioAPI = (() => {
  // Base URL for backend server
  const API_BASE_URL = 'http://localhost:5000/api';

  /**
   * Helper function for HTTP requests.
   * 
   * @param {string} endpoint - API route (e.g. '/projects')
   * @param {object} options - Fetch options (method, headers, body)
   * @returns {Promise<any>}
   */
  async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Fetches projects from the backend API.
   * @returns {Promise<Array|null>}
   */
  async function getProjects() {
    const result = await request('/projects', { method: 'GET' });
    if (result && Array.isArray(result.data)) {
      return result.data;
    }
    if (Array.isArray(result)) {
      return result;
    }
    return null;
  }

  /**
   * Sends a contact message payload to the backend API.
   * @param {Object} messageData - { name, email, subject, message }
   * @returns {Promise<Object>}
   */
  async function sendContactMessage(messageData) {
    return await request('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  return {
    getProjects,
    sendContactMessage
  };
})();

// Export for module systems if applicable, and attach to global window for vanilla script tags
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioAPI;
} else {
  window.PortfolioAPI = PortfolioAPI;
}
