import {ENV} from '../config/env.ts';

export async function apiRequest(endpoint: string, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // use ENV.API_URL as the base URL for the API
  const response = await fetch(`${ENV.API_URL}${endpoint}`, {
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