import axios, { AxiosError } from 'axios';
import { refreshToken } from '@/features/auth/utils/auth-helpers';

/**
 * Authenticate with any broker
 */
export const authenticateBroker = async (brokerId: string): Promise<any> => {
  try {
    console.log(`Authenticating with broker ${brokerId}...`);
    
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
    
    console.log('Broker authentication response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error(`Error authenticating with broker ${brokerId}:`, error);
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
 * Deactivate a broker session
 */
export const deactivateBroker = async (brokerId: string): Promise<void> => {
  try {
    console.log(`Deactivating broker ${brokerId}...`);
    
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
    
    console.log('Broker deactivation response:', response.status, response.statusText);
  } catch (error) {
    console.error(`Error deactivating broker ${brokerId}:`, error);
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
 * Get broker status
 */
export const getBrokerStatus = async (brokerId: string): Promise<{ isActive: boolean, expiresAt?: string, sessionData?: any }> => {
  try {
    console.log(`Getting status for broker ${brokerId}...`);
    
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
    
    console.log('Broker status response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error(`Error getting status for broker ${brokerId}:`, error);
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
 * Get all broker sessions
 */
export const getAllBrokerSessions = async (): Promise<Array<{ brokerId: string, isActive: boolean, expiresAt: string }>> => {
  try {
    console.log('Getting all broker sessions...');
    
    // Use let instead of const for token-related variables to support refreshing
    let response;
    
    try {
      response = await axios.get('/api/v1/broker-auth/sessions');
    } catch (error) {
      // If token is expired, try to refresh and retry the request
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log('Token expired, refreshing and retrying...');
        await refreshToken();
        response = await axios.get('/api/v1/broker-auth/sessions');
      } else {
        throw error;
      }
    }
    
    console.log('All broker sessions response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error('Error getting all broker sessions:', error);
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
 * Authenticate with Dhan broker
 */
export const authenticateDhan = async (id: string): Promise<{ consentId: string }> => {
  try {
    console.log(`Authenticating with Dhan for broker ${id}...`);
    return await authenticateBroker(id);
  } catch (error) {
    console.error('Error authenticating with Dhan:', error);
    throw error;
  }
};

/**
 * Authenticate with MetaTrader 5 broker
 */
export const authenticateMetaTrader5 = async (id: string): Promise<{ connected: boolean }> => {
  try {
    console.log(`Authenticating with MetaTrader 5 for broker ${id}...`);
    return await authenticateBroker(id);
  } catch (error) {
    console.error('Error authenticating with MetaTrader 5:', error);
    throw error;
  }
};