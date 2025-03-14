// Main API URL (domain-based)
export const API_URL = "https://algozbackend-production.up.railway.app/api/v1";

// Function to get the appropriate API URL
export function getApiUrl(): string {
  // Check if we have a saved preference in localStorage
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('apiUrl');
    if (savedUrl) {
      return savedUrl;
    }
  }
  
  // Default to the domain-based URL
  return API_URL;
}

// Function to set and save the API URL preference
export function setApiUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('apiUrl', url);
  }
}

// Function to reset to the default API URL
export function resetApiUrl(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('apiUrl');
  }
}