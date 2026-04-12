/**
 * GramGrievance v2.0 - Core Backend Interaction Simulation
 * Wraps asynchronous requests with a guaranteed 500ms latency.
 */

const LATENCY_MS = 500;

export const request = async (method, endpoint, payload = null) => {
  // Simulate network latency perfectly every time
  await new Promise(resolve => setTimeout(resolve, LATENCY_MS));

  return {
    status: method === 'POST' ? 201 : 200,
    endpoint,
    data: payload ? { ...payload, __trackedId: `db_${Date.now()}` } : { ok: true }
  };
};

export const api = {
  get: (endpoint) => request('GET', endpoint),
  post: (endpoint, payload) => request('POST', endpoint, payload),
  patch: (endpoint, payload) => request('PATCH', endpoint, payload),
};

export default api;
