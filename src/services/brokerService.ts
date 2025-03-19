import axios from '@/lib/axios';
import { AxiosError } from 'axios';
import supabase from '@/lib/supabase';

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
        logo: '/brokers/dhan.png',
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
        logo: '/brokers/metatrader5.svg',
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
    
    // Return default brokers if API call fails
    return [
      {
        id: 'angelone',
        name: 'ANGELONE',
        logo: '/brokers/angelone.png',
        description: 'Connect your Angel One account to automate trading.',
        fields: [
          { name: 'apiKey', label: 'API Key', type: 'text' },
          { name: 'clientId', label: 'Client ID', type: 'text' },
          { name: 'password', label: 'Password', type: 'password' },
          { name: 'totp', label: 'TOTP Secret', type: 'password' }
        ]
      },
      {
        id: 'upstox',
        name: 'UPSTOX',
        logo: '/brokers/upstox.png',
        description: 'Connect your Upstox account to automate trading.',
        fields: [
          { name: 'apiKey', label: 'API Key', type: 'text' },
          { name: 'apiSecret', label: 'API Secret', type: 'password' },
          { name: 'redirectUri', label: 'Redirect URI', type: 'text' }
        ]
      },
      {
        id: 'zerodha',
        name: 'ZERODHA',
        logo: '/brokers/zerodha.png',
        description: 'Connect your Zerodha account to automate trading.',
        fields: [
          { name: 'apiKey', label: 'API Key', type: 'text' },
          { name: 'apiSecret', label: 'API Secret', type: 'password' },
          { name: 'userId', label: 'User ID', type: 'text' }
        ]
      },
      {
        id: 'flattrade',
        name: 'FLATTRADE',
        logo: '/brokers/flattrade.png',
        description: 'Connect your FlatTrade account to automate trading.',
        fields: [
          { name: 'apiKey', label: 'API Key', type: 'text' },
          { name: 'apiSecret', label: 'API Secret', type: 'password' },
          { name: 'toTp', label: 'TO TP', type: 'password' },
          { name: 'clientId', label: 'Client ID', type: 'text' }
        ]
      },
      {
        id: 'dhan',
        name: 'DHAN',
        logo: '/brokers/dhan.png',
        description: 'Connect your Dhan account to automate trading.',
        fields: [
          { name: 'partner_id', label: 'Partner ID', type: 'text' },
          { name: 'partner_secret', label: 'Partner Secret', type: 'password' }
        ]
      },
      {
        id: 'metatrader5',
        name: 'MetaTrader 5',
        logo: '/brokers/metatrader5.svg',
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
 * Get user's saved brokers
 */
export const getSavedBrokers = async (): Promise<SavedBroker[]> => {
  try {
    console.log('Fetching saved brokers...');
    const response = await axios.get('/api/v1/brokers/saved');
    console.log('Saved brokers response:', response.status, response.statusText);
    
    // Get brokers from response
    const brokers = response.data.data;
    
    return brokers;
  } catch (error) {
    console.error('Error fetching saved brokers:', error);
    
    // Return empty array if API call fails
    return [];
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
    console.log('Saving broker credentials for:', brokerId);
    
    // Send request to API
    const response = await axios.post('/api/v1/brokers/save', {
      brokerId,
      credentials
    });
    
    console.log('Save broker credentials response:', response.status, response.statusText);
    
    // Get saved broker from response
    const savedBroker = response.data.data;
    
    return savedBroker;
  } catch (error) {
    console.error('Error saving broker credentials:', error);
    
    // Re-throw error to be handled by caller
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || 'Failed to save broker credentials');
    } else {
      throw new Error('Failed to save broker credentials');
    }
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
    console.log('Updating broker credentials for:', id);
    
    // Send request to API
    const response = await axios.put(`/api/v1/brokers/${id}`, {
      credentials
    });
    
    console.log('Update broker credentials response:', response.status, response.statusText);
    
    // Get updated broker from response
    const updatedBroker = response.data.data;
    
    return updatedBroker;
  } catch (error) {
    console.error('Error updating broker credentials:', error);
    
    // Re-throw error to be handled by caller
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || 'Failed to update broker credentials');
    } else {
      throw new Error('Failed to update broker credentials');
    }
  }
};

/**
 * Delete broker credentials
 */
export const deleteBrokerCredentials = async (id: string): Promise<void> => {
  try {
    console.log('Deleting broker credentials for:', id);
    
    // Send request to API
    const response = await axios.delete(`/api/v1/brokers/${id}`);
    
    console.log('Delete broker credentials response:', response.status, response.statusText);
  } catch (error) {
    console.error('Error deleting broker credentials:', error);
    
    // Re-throw error to be handled by caller
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete broker credentials');
    } else {
      throw new Error('Failed to delete broker credentials');
    }
  }
};

/**
 * Toggle broker status
 */
export const toggleBrokerStatus = async (
  id: string,
  isActive: boolean
): Promise<SavedBroker> => {
  try {
    console.log('Toggling broker status for:', id, 'to:', !isActive);
    
    // Send request to API
    const response = await axios.patch(`/api/v1/brokers/${id}/toggle`);
    
    console.log('Toggle broker status response:', response.status, response.statusText);
    
    // Get updated broker from response
    const updatedBroker = response.data.data;
    
    return updatedBroker;
  } catch (error) {
    console.error('Error toggling broker status:', error);
    
    // Re-throw error to be handled by caller
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || 'Failed to toggle broker status');
    } else {
      throw new Error('Failed to toggle broker status');
    }
  }
};

/**
 * Authenticate with Dhan broker
 */
export const authenticateDhan = async (id: string): Promise<{ consentId: string }> => {
  try {
    console.log('Authenticating with Dhan for broker ID:', id);
    
    // Send request to API
    const response = await axios.post(`/api/v1/brokers/dhan/${id}/authenticate`);
    
    console.log('Dhan authentication response:', response.status, response.statusText);
    
    // Get consentId from response
    const { consentId } = response.data.data;
    
    return { consentId };
  } catch (error) {
    console.error('Error authenticating with Dhan:', error);
    
    // Re-throw error to be handled by caller
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || 'Failed to authenticate with Dhan');
    } else {
      throw new Error('Failed to authenticate with Dhan');
    }
  }
};

/**
 * Authenticate with MetaTrader 5 broker
 */
export const authenticateMetaTrader5 = async (id: string): Promise<{ connected: boolean }> => {
  try {
    console.log('Authenticating with MetaTrader 5 for broker ID:', id);
    
    // Send request to API
    const response = await axios.post(`/api/v1/brokers/metatrader5/${id}/authenticate`);
    
    console.log('MetaTrader 5 authentication response:', response.status, response.statusText);
    
    // Get connected status from response
    const { connected } = response.data.data;
    
    return { connected };
  } catch (error) {
    console.error('Error authenticating with MetaTrader 5:', error);
    
    // Re-throw error to be handled by caller
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || 'Failed to authenticate with MetaTrader 5');
    } else {
      throw new Error('Failed to authenticate with MetaTrader 5');
    }
  }
}; 