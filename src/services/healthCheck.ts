import { API_URL } from "@/constants/URI";

// List of alternative endpoints to try if the main one fails
// These could be different regions or fallback servers
const FALLBACK_ENDPOINTS: string[] = [
  // Add any fallback endpoints here if available
  // Example: Direct IP address access instead of domain name
  // "https://123.456.789.101/api/v1" // Replace with actual IP if available
];

// Cache for DNS resolution status
interface DNSCache {
  timestamp: number;
  resolved: boolean;
  workingEndpoint: string | null;
}

// Cache DNS resolution status for 5 minutes
const DNS_CACHE_DURATION = 5 * 60 * 1000;
let dnsCache: DNSCache | null = null;

/**
 * Checks if the API server is reachable
 * @returns Promise<{isOnline: boolean, endpoint: string | null}>
 */
export async function checkAPIHealth(forceCheck = false): Promise<{isOnline: boolean, endpoint: string | null}> {
  // Return cached result if available and not expired
  if (!forceCheck && dnsCache && (Date.now() - dnsCache.timestamp < DNS_CACHE_DURATION)) {
    return {
      isOnline: dnsCache.resolved,
      endpoint: dnsCache.workingEndpoint
    };
  }

  // First check browser's navigator.onLine
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    updateDNSCache(false, null);
    return { isOnline: false, endpoint: null };
  }

  // Try the main endpoint first
  try {
    const apiUrl = new URL(API_URL);
    const baseUrl = `${apiUrl.protocol}//${apiUrl.host}`;
    
    const result = await checkEndpoint(baseUrl);
    if (result) {
      updateDNSCache(true, baseUrl);
      return { isOnline: true, endpoint: baseUrl };
    }
  } catch (error) {
    console.error("Main API endpoint check failed:", error);
  }

  // Try fallback endpoints if main fails
  for (const fallbackUrl of FALLBACK_ENDPOINTS) {
    try {
      const result = await checkEndpoint(fallbackUrl);
      if (result) {
        updateDNSCache(true, fallbackUrl);
        return { isOnline: true, endpoint: fallbackUrl };
      }
    } catch (error) {
      console.error(`Fallback endpoint check failed for ${fallbackUrl}:`, error);
    }
  }

  // All endpoints failed
  updateDNSCache(false, null);
  return { isOnline: false, endpoint: null };
}

/**
 * Checks if a specific endpoint is reachable
 */
async function checkEndpoint(baseUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}/health`, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Updates the DNS cache with the latest status
 */
function updateDNSCache(resolved: boolean, endpoint: string | null) {
  dnsCache = {
    timestamp: Date.now(),
    resolved,
    workingEndpoint: endpoint
  };
}

/**
 * Gets the current working endpoint or falls back to the default
 */
export function getWorkingEndpoint(): string {
  if (dnsCache?.resolved && dnsCache.workingEndpoint) {
    return dnsCache.workingEndpoint;
  }
  
  // Fall back to the default API URL
  const apiUrl = new URL(API_URL);
  return `${apiUrl.protocol}//${apiUrl.host}`;
}

/**
 * Clears the DNS cache to force a fresh check
 */
export function clearDNSCache() {
  dnsCache = null;
}

/**
 * Manually set a custom API endpoint to bypass DNS issues
 * @param endpoint The full endpoint URL to use
 * @returns boolean indicating if the endpoint was successfully set
 */
export async function setCustomEndpoint(endpoint: string): Promise<boolean> {
  try {
    // Validate the endpoint format
    new URL(endpoint);
    
    // Test if the endpoint is reachable
    const isReachable = await checkEndpoint(endpoint);
    
    if (isReachable) {
      // Update the cache with the working endpoint
      updateDNSCache(true, endpoint);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Invalid custom endpoint:", error);
    return false;
  }
} 