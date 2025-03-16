import axios from '@/lib/axios';
import { AxiosError } from 'axios';

// Define broker interfaces
export interface BrokerField {
  name: string;
  label: string;
  type: string;
}

export interface Broker {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  fields: BrokerField[];
}

export interface SavedBroker {
  id: string;
  brokerId: string;
  name: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all available brokers
 */
export const getAvailableBrokers = async (): Promise<Broker[]> => {
  try {
    console.log('Fetching available brokers...');
    const response = await axios.get('/api/v1/brokers/available');
    console.log('Available brokers response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching available brokers:', error);
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
 * Get all saved brokers for the current user
 */
export const getSavedBrokers = async (): Promise<SavedBroker[]> => {
  try {
    console.log('Fetching saved brokers...');
    const response = await axios.get('/api/v1/brokers/saved');
    console.log('Saved brokers response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching saved brokers:', error);
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
 * Save broker credentials
 */
export const saveBrokerCredentials = async (
  brokerId: string,
  credentials: Record<string, string>
): Promise<SavedBroker> => {
  try {
    console.log(`Saving credentials for broker ${brokerId}...`);
    const response = await axios.post('/api/v1/brokers', {
      brokerId,
      credentials
    });
    console.log('Save broker response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error('Error saving broker credentials:', error);
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
 * Update broker credentials
 */
export const updateBrokerCredentials = async (
  id: string,
  credentials: Record<string, string>
): Promise<SavedBroker> => {
  try {
    console.log(`Updating credentials for broker ${id}...`);
    const response = await axios.put(`/api/v1/brokers/${id}`, {
      credentials
    });
    console.log('Update broker response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error('Error updating broker credentials:', error);
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
 * Delete broker credentials
 */
export const deleteBrokerCredentials = async (id: string): Promise<void> => {
  try {
    console.log(`Deleting broker ${id}...`);
    const response = await axios.delete(`/api/v1/brokers/${id}`);
    console.log('Delete broker response:', response.status, response.statusText);
  } catch (error) {
    console.error('Error deleting broker credentials:', error);
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
 * Toggle broker active status
 */
export const toggleBrokerStatus = async (
  id: string,
  isActive: boolean
): Promise<SavedBroker> => {
  try {
    console.log(`Toggling broker ${id} to ${isActive ? 'active' : 'inactive'}...`);
    // We don't need to send isActive since the backend will toggle the current value
    // But we keep the parameter for backward compatibility
    const response = await axios.put(`/api/v1/brokers/${id}/toggle`);
    console.log('Toggle broker response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error('Error toggling broker status:', error);
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