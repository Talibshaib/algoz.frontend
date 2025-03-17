/**
 * Simple client-side rate limiter to prevent excessive API calls
 */

// Store the timestamps of recent API calls
const apiCallTimestamps: Record<string, number[]> = {};

// Maximum number of calls allowed in the time window
const MAX_CALLS = 5;

// Time window in milliseconds (e.g., 60 seconds)
const TIME_WINDOW = 60 * 1000;

/**
 * Check if an API call should be rate limited
 * @param key Unique identifier for the API endpoint
 * @returns Boolean indicating if the call should be allowed
 */
export function shouldAllowApiCall(key: string): boolean {
  const now = Date.now();
  
  // Initialize the timestamps array if it doesn't exist
  if (!apiCallTimestamps[key]) {
    apiCallTimestamps[key] = [];
  }
  
  // Filter out timestamps that are outside the time window
  apiCallTimestamps[key] = apiCallTimestamps[key].filter(
    timestamp => now - timestamp < TIME_WINDOW
  );
  
  // Check if we've reached the maximum number of calls
  if (apiCallTimestamps[key].length >= MAX_CALLS) {
    return false;
  }
  
  // Add the current timestamp to the array
  apiCallTimestamps[key].push(now);
  return true;
}

/**
 * Get the time remaining until the next allowed API call
 * @param key Unique identifier for the API endpoint
 * @returns Time in milliseconds until the next allowed call, or 0 if calls are allowed
 */
export function getTimeUntilNextAllowedCall(key: string): number {
  if (!apiCallTimestamps[key] || apiCallTimestamps[key].length < MAX_CALLS) {
    return 0;
  }
  
  const now = Date.now();
  const oldestTimestamp = apiCallTimestamps[key][0];
  const timeElapsed = now - oldestTimestamp;
  
  return Math.max(0, TIME_WINDOW - timeElapsed);
}

/**
 * Reset the rate limiter for a specific key
 * @param key Unique identifier for the API endpoint
 */
export function resetRateLimiter(key: string): void {
  apiCallTimestamps[key] = [];
}

/**
 * Reset all rate limiters
 */
export function resetAllRateLimiters(): void {
  Object.keys(apiCallTimestamps).forEach(key => {
    apiCallTimestamps[key] = [];
  });
} 