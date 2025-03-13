import { API_URL } from "@/constants/URI";

// List of alternative endpoints to try if the main one fails
// These could be different regions or fallback servers
const FALLBACK_ENDPOINTS: string[] = [
  // Direct IP address access instead of domain name
  "https://34.125.238.251/api/v1", // Railway app IP address
  // Try the same domain with different protocols
  API_URL.replace("https://", "http://"),
  // Try without www if present
  API_URL.replace("www.", ""),
  // Try with www if not present and not using IP
  !API_URL.includes("www.") && !API_URL.match(/\d+\.\d+\.\d+\.\d+/) 
    ? API_URL.replace("://", "://www.") 
    : "",
].filter(Boolean); // Remove empty strings

// Cache for DNS resolution status
interface DNSCache {
  timestamp: number;
  resolved: boolean;
  workingEndpoint: string | null;
  lastAttemptedIp: string | null;
}

// Cache DNS resolution status for 2 minutes (reduced from 5 minutes)
const DNS_CACHE_DURATION = 2 * 60 * 1000;
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
    updateDNSCache(false, null, null);
    return { isOnline: false, endpoint: null };
  }

  // Try the main endpoint first
  try {
    const apiUrl = new URL(API_URL);
    const baseUrl = `${apiUrl.protocol}//${apiUrl.host}`;
    
    const result = await checkEndpoint(baseUrl);
    if (result) {
      updateDNSCache(true, baseUrl, null);
      return { isOnline: true, endpoint: baseUrl };
    }
  } catch (error) {
    console.error("Main API endpoint check failed:", error);
  }

  // Try fallback endpoints if main fails
  for (const fallbackUrl of FALLBACK_ENDPOINTS) {
    if (!fallbackUrl) continue; // Skip empty entries
    
    try {
      // Extract the base URL without the path
      let baseUrl = fallbackUrl;
      try {
        const url = new URL(fallbackUrl);
        baseUrl = `${url.protocol}//${url.host}`;
      } catch (e) {
        // If URL parsing fails, use the fallback as is
      }
      
      console.log(`Trying fallback endpoint: ${baseUrl}`);
      const result = await checkEndpoint(baseUrl);
      if (result) {
        // Store the IP address that worked
        const ipMatch = baseUrl.match(/\d+\.\d+\.\d+\.\d+/);
        const lastIp = ipMatch ? ipMatch[0] : null;
        
        updateDNSCache(true, baseUrl, lastIp);
        return { isOnline: true, endpoint: baseUrl };
      }
    } catch (error) {
      console.error(`Fallback endpoint check failed for ${fallbackUrl}:`, error);
    }
  }

  // All endpoints failed
  updateDNSCache(false, null, null);
  return { isOnline: false, endpoint: null };
}

/**
 * Checks if a specific endpoint is reachable
 */
async function checkEndpoint(baseUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Try multiple health endpoint paths
    const healthPaths = ['/health', '/api/v1/health', '/api/health', '/ping'];
    
    for (const path of healthPaths) {
      try {
        const response = await fetch(`${baseUrl}${path}`, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });
        
        if (response.ok) {
          clearTimeout(timeoutId);
          return true;
        }
      } catch (error) {
        // Continue to the next path
        console.log(`Path ${path} failed, trying next...`);
      }
    }
    
    clearTimeout(timeoutId);
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Updates the DNS cache with the latest status
 */
function updateDNSCache(resolved: boolean, endpoint: string | null, lastAttemptedIp: string | null) {
  dnsCache = {
    timestamp: Date.now(),
    resolved,
    workingEndpoint: endpoint,
    lastAttemptedIp
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
      // Extract IP if present
      const ipMatch = endpoint.match(/\d+\.\d+\.\d+\.\d+/);
      const lastIp = ipMatch ? ipMatch[0] : null;
      
      // Update the cache with the working endpoint
      updateDNSCache(true, endpoint, lastIp);
      
      // Store this working endpoint in localStorage for persistence across sessions
      if (typeof window !== 'undefined') {
        localStorage.setItem('customApiEndpoint', endpoint);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Invalid custom endpoint:", error);
    return false;
  }
}

/**
 * Loads any previously saved custom endpoint from localStorage
 * Call this on app initialization
 */
export function loadSavedEndpoint(): void {
  if (typeof window !== 'undefined') {
    const savedEndpoint = localStorage.getItem('customApiEndpoint');
    if (savedEndpoint) {
      // Don't await, just initialize in the background
      setCustomEndpoint(savedEndpoint).then(success => {
        if (success) {
          console.log("Restored custom endpoint from localStorage");
        } else {
          // Clear invalid saved endpoint
          localStorage.removeItem('customApiEndpoint');
        }
      });
    }
  }
} 