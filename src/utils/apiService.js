/**
 * Mock API Service to simulate network latency for a defense-grade simulation.
 */

const SIMULATE_LATENCY = true;
const LATENCY_MS = 500;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  /**
   * Mock a GET request
   */
  async get(payload) {
    if (SIMULATE_LATENCY) {
      await delay(LATENCY_MS);
    }
    return { data: payload, status: 200 };
  },

  /**
   * Mock a POST request
   */
  async post(payload) {
    if (SIMULATE_LATENCY) {
      await delay(LATENCY_MS);
    }
    
    // Simulate server-side ID assignment if not provided
    const responseData = {
      ...payload,
      _serverId: `server_${Date.now()}`
    };

    return { data: responseData, status: 201 };
  },

  /**
   * Mock a PUT/PATCH request
   */
  async patch(payload) {
    if (SIMULATE_LATENCY) {
      await delay(LATENCY_MS); 
    }
    return { data: payload, status: 200 };
  }
};

export default apiService;
