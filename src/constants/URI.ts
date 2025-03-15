// Define all possible API endpoints
export const API_ENDPOINTS = {
  MAIN: "https://algoz-backend-68rt.onrender.com/api/v1",
  RAILWAY: "https://algozbackend-production.up.railway.app/api/v1",
  RENDER: "https://algoz-backend-68rt.onrender.com/api/v1",
  FALLBACK_IP: "http://34.125.238.251/api/v1",
  FALLBACK_IP_HTTPS: "https://34.125.238.251/api/v1",
  FALLBACK_IP_PORT: "http://34.125.238.251:8000/api/v1",
  LOCAL: "http://localhost:8000/api/v1"
};

// Default API URL
export const API_URL = API_ENDPOINTS.MAIN;

// Get all available endpoints as an array for connection attempts
export function getAllApiEndpoints(): string[] {
  return Object.values(API_ENDPOINTS);
}

// Function to get the appropriate API URL
export function getApiUrl(): string {
  // Check if we have a saved working endpoint in localStorage
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('workingApiUrl');
    if (savedUrl) {
      return savedUrl;
    }
  }
  
  // Default to the main URL
  return API_URL;
}

// Function to set and save the working API URL
export function setApiUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('workingApiUrl', url);
    console.log(`Set working API URL to: ${url}`);
  }
}

// Function to reset to the default API URL
export function resetApiUrl(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('workingApiUrl');
  }
}