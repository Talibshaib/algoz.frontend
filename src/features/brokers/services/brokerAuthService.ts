import axios, { AxiosError } from 'axios';
import { refreshToken } from '@/features/auth/utils/auth-helpers';

/**
 * Authenticate with Dhan broker
 */
export const authenticateDhan = async (brokerId: string): Promise<{ redirectUrl: string }> => {
  try {
    console.log(`Authenticating with Dhan broker ${brokerId}...`);
    
    // Use let instead of const for token-related variables to support refreshing
    let response;
    
    try {
      response = await axios.post(`/api/v1/broker-auth/authenticate/${brokerId}`);
    } catch (error) {
      // If token is expired, try to refresh and retry the request
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expired, refreshing and retrying...');
        await refreshToken();
        response = await axios.post(`/api/v1/broker-auth/authenticate/${brokerId}`);
      } else {
        throw error;
      }
    }
    
    console.log('Dhan authentication response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error(`Error authenticating with Dhan broker ${brokerId}:`, error);
    if (error instanceof Error) {
      const axiosError = error as AxiosError;
      console.error('Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        method: axiosError.config?.method
      });
    }
    throw error;
  }
};

/**
 * Deactivate a Dhan broker session
 */
export const deactivateDhan = async (brokerId: string): Promise<void> => {
  try {
    console.log(`Deactivating Dhan broker ${brokerId}...`);
    
    // Use let instead of const for token-related variables to support refreshing
    let response;
    
    try {
      response = await axios.post(`/api/v1/broker-auth/deactivate/${brokerId}`);
    } catch (error) {
      // If token is expired, try to refresh and retry the request
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expired, refreshing and retrying...');
        await refreshToken();
        response = await axios.post(`/api/v1/broker-auth/deactivate/${brokerId}`);
      } else {
        throw error;
      }
    }
    
    console.log('Dhan deactivation response:', response.status, response.statusText);
  } catch (error) {
    console.error(`Error deactivating Dhan broker ${brokerId}:`, error);
    if (error instanceof Error) {
      const axiosError = error as AxiosError;
      console.error('Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        method: axiosError.config?.method
      });
    }
    throw error;
  }
};

/**
 * Get Dhan broker status
 */
export const getDhanStatus = async (brokerId: string): Promise<{ isActive: boolean, expiresAt?: string, sessionData?: any }> => {
  try {
    console.log(`Getting Dhan broker status for ${brokerId}...`);
    
    // Use let instead of const for token-related variables to support refreshing
    let response;
    
    try {
      response = await axios.get(`/api/v1/broker-auth/status/${brokerId}`);
    } catch (error) {
      // If token is expired, try to refresh and retry the request
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expired, refreshing and retrying...');
        await refreshToken();
        response = await axios.get(`/api/v1/broker-auth/status/${brokerId}`);
      } else {
        throw error;
      }
    }
    
    console.log('Dhan status response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error(`Error getting Dhan broker status for ${brokerId}:`, error);
    if (error instanceof Error) {
      const axiosError = error as AxiosError;
      console.error('Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        method: axiosError.config?.method
      });
    }
    throw error;
  }
};

/**
 * Generate Dhan consent URL using saved credentials
 */
export const generateDhanConsentUrl = async (brokerId: string): Promise<string> => {
  try {
    console.log(`Generating Dhan consent URL for broker ${brokerId}...`);
    
    // Use let instead of const for token-related variables to support refreshing
    let response;
    
    try {
      response = await axios.get(`/api/v1/broker-auth/dhan/consent-url/${brokerId}`);
    } catch (error) {
      // If token is expired, try to refresh and retry the request
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expired, refreshing and retrying...');
        await refreshToken();
        response = await axios.get(`/api/v1/broker-auth/dhan/consent-url/${brokerId}`);
      } else {
        throw error;
      }
    }
    
    console.log('Dhan consent URL response:', response.status, response.statusText);
    return response.data.data.consentUrl;
  } catch (error) {
    console.error(`Error generating Dhan consent URL for broker ${brokerId}:`, error);
    if (error instanceof Error) {
      const axiosError = error as AxiosError;
      console.error('Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        method: axiosError.config?.method
      });
    }
    throw error;
  }
};

/**
 * Complete Dhan authentication with authorization code
 */
export const completeDhanAuth = async (brokerId: string, code: string): Promise<boolean> => {
  try {
    console.log(`Completing Dhan authentication for broker ${brokerId} with code...`);
    
    // Use let instead of const for token-related variables to support refreshing
    let response;
    
    try {
      response = await axios.post(`/api/v1/broker-auth/complete-dhan-auth/${brokerId}`, { code });
    } catch (error) {
      // If token is expired, try to refresh and retry the request
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expired, refreshing and retrying...');
        await refreshToken();
        response = await axios.post(`/api/v1/broker-auth/complete-dhan-auth/${brokerId}`, { code });
      } else {
        throw error;
      }
    }
    
    console.log('Dhan authentication completion response:', response.status, response.statusText);
    return true;
  } catch (error) {
    console.error(`Error completing Dhan authentication for broker ${brokerId}:`, error);
    if (error instanceof Error) {
      const axiosError = error as AxiosError;
      console.error('Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        method: axiosError.config?.method
      });
    }
    throw error;
  }
};