// API endpoint for backend service
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://algoz-backend-68rt.onrender.com/api/v1";

// Function to get the API URL
export function getApiUrl(): string {
  return API_URL;
}