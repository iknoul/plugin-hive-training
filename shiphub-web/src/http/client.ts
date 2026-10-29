const API_BASE_URL = 'http://localhost:3000'; // Update with your backend URL

export async function apiRequest(endpoint: string, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: defaultHeaders,
  });

  // Automatically throw if the response isn't OK so try/catch blocks catch it
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
  }

  // Return JSON if available, otherwise return null
  return response.status !== 204 ? response.json() : null;
}