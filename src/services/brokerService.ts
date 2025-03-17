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
    
    // Get brokers from response
    const brokers = response.data.data;
    
    // Check if Dhan is in the available brokers
    const hasDhan = brokers.some((broker: Broker) => broker.id === 'dhan');
    
    // Check if MetaTrader 5 is in the available brokers
    const hasMetaTrader5 = brokers.some((broker: Broker) => broker.id === 'metatrader5');
    
    // If Dhan is not in the available brokers, add it
    if (!hasDhan) {
      brokers.push({
        id: 'dhan',
        name: 'DHAN',
        description: 'Connect your Dhan account to automate trading.',
        fields: [
          { name: 'partner_id', label: 'Partner ID', type: 'text' },
          { name: 'partner_secret', label: 'Partner Secret', type: 'password' }
        ]
      });
    }
    
    // If MetaTrader 5 is not in the available brokers, add it
    if (!hasMetaTrader5) {
      brokers.push({
        id: 'metatrader5',
        name: 'MetaTrader 5',
        description: 'Connect your MetaTrader 5 account for automated trading.',
        fields: [
          { name: 'server', label: 'Server', type: 'text' },
          { name: 'login', label: 'Login', type: 'text' },
          { name: 'password', label: 'Password', type: 'password' }
        ]
      });
    }
    
    return brokers;
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
    
    // Return a default list with Dhan and MetaTrader 5 if the API call fails
    return [
      {
        id: 'dhan',
        name: 'DHAN',
        description: 'Connect your Dhan account to automate trading.',
        fields: [
          { name: 'partner_id', label: 'Partner ID', type: 'text' },
          { name: 'partner_secret', label: 'Partner Secret', type: 'password' }
        ]
      },
      {
        id: 'metatrader5',
        name: 'MetaTrader 5',
        description: 'Connect your MetaTrader 5 account for automated trading.',
        fields: [
          { name: 'server', label: 'Server', type: 'text' },
          { name: 'login', label: 'Login', type: 'text' },
          { name: 'password', label: 'Password', type: 'password' }
        ]
      }
    ];
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
    console.log(`Saving credentials for broker ${brokerId}...`, credentials);
    
    // Validate credentials based on broker type
    if (brokerId === 'dhan') {
      if (!credentials.partner_id || !credentials.partner_secret) {
        throw new Error('Partner ID and Partner Secret are required for Dhan broker');
      }
    } else if (brokerId === 'metatrader5') {
      if (!credentials.server || !credentials.login || !credentials.password) {
        throw new Error('Server, Login, and Password are required for MetaTrader 5 broker');
      }
    }
    
    const response = await axios.post('/api/v1/brokers', {
      brokerId,
      credentials
    });
    
    console.log('Save broker response:', response.status, response.statusText, response.data);
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

/**
 * Authenticate with Dhan broker
 */
export const authenticateDhan = async (id: string): Promise<{ consentId: string }> => {
  try {
    console.log(`Authenticating with Dhan for broker ${id}...`);
    const response = await axios.post(`/api/v1/brokers/${id}/dhan/authenticate`);
    console.log('Dhan authentication response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error('Error authenticating with Dhan:', error);
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
 * Authenticate with MetaTrader 5 broker
 */
export const authenticateMetaTrader5 = async (id: string): Promise<{ connected: boolean }> => {
  try {
    console.log(`Authenticating with MetaTrader 5 for broker ${id}...`);
    const response = await axios.post(`/api/v1/brokers/${id}/metatrader5/authenticate`);
    console.log('MetaTrader 5 authentication response:', response.status, response.statusText);
    return response.data.data;
  } catch (error) {
    console.error('Error authenticating with MetaTrader 5:', error);
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