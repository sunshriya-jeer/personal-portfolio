/**
 * api.js - REST API Client Foundation
 * 
 * ARCHITECTURE NOTE:
 * This module is prepared for future Phase 2 REST API communication with the Node.js/Express backend.
 * Currently, no backend server or database is running.
 * All functions are structured with async/await patterns, error handling wrappers,
 * and clean placeholder endpoints ready to be activated once the backend is developed.
 */

const PortfolioAPI = (() => {
  // Base URL placeholder for future backend server
  const API_BASE_URL = 'http://localhost:5000/api';

  /**
   * Helper function for future HTTP requests.
   * Currently mocked to prevent unhandled network failures.
   * 
   * @param {string} endpoint - API route (e.g. '/projects')
   * @param {object} options - Fetch options (method, headers, body)
   * @returns {Promise<any>}
   */
  async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // In Phase 2: uncomment this actual fetch call when backend is live:
    /*
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
    */

    console.info(`[PortfolioAPI] request queued for "${url}". Backend not connected yet (Foundation Phase).`);
    return null;
  }

  /**
   * Fetches projects from the backend API.
   * @returns {Promise<Array|null>}
   */
  async function getProjects() {
    return await request('/projects', { method: 'GET' });
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
