import axios from 'axios';

// Define the base API URL - replace with your actual API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Define broker interface
export interface BrokerCredentials {
  id: string;
  name: string;
  isActive: boolean;
  credentials: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

// Get all saved brokers
export const getSavedBrokers = async (): Promise<BrokerCredentials[]> => {
  try {
    const response = await axios.get(`${API_URL}/brokers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching brokers:', error);
    throw error;
  }
};

// Save a new broker
export const saveBroker = async (
  brokerId: string, 
  brokerName: string, 
  credentials: Record<string, string>
): Promise<BrokerCredentials> => {
  try {
    const response = await axios.post(`${API_URL}/brokers`, {
      id: brokerId,
      name: brokerName,
      credentials,
      isActive: true
    });
    return response.data;
  } catch (error) {
    console.error('Error saving broker:', error);
    throw error;
  }
};

// Update broker credentials
export const updateBroker = async (
  brokerId: string, 
  credentials: Record<string, string>
): Promise<BrokerCredentials> => {
  try {
    const response = await axios.put(`${API_URL}/brokers/${brokerId}`, {
      credentials
    });
    return response.data;
  } catch (error) {
    console.error('Error updating broker:', error);
    throw error;
  }
};

// Delete a broker
export const deleteBroker = async (brokerId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/brokers/${brokerId}`);
  } catch (error) {
    console.error('Error deleting broker:', error);
    throw error;
  }
};

// Toggle broker active status
export const toggleBrokerStatus = async (
  brokerId: string, 
  isActive: boolean
): Promise<BrokerCredentials> => {
  try {
    const response = await axios.patch(`${API_URL}/brokers/${brokerId}/toggle`, {
      isActive
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling broker status:', error);
    throw error;
  }
};

export interface BrokerConnection {
  id: string;
  brokerId: string;
  userId: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: string;
  updatedAt: string;
}

/**
 * Connect a broker by saving API credentials
 */
export const connectBroker = async (credentials: BrokerCredentials): Promise<BrokerConnection> => {
  try {
    const response = await axios.post(`${API_URL}/broker/connect`, credentials);
    return response.data.data;
  } catch (error) {
    console.error('Error connecting broker:', error);
    throw error;
  }
};

/**
 * Get all connected brokers for the current user
 */
export const getConnectedBrokers = async (): Promise<BrokerConnection[]> => {
  try {
    const response = await axios.get(`${API_URL}/broker/connections`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching connected brokers:', error);
    throw error;
  }
};

/**
 * Disconnect a broker connection
 */
export const disconnectBroker = async (connectionId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/broker/connections/${connectionId}`);
  } catch (error) {
    console.error('Error disconnecting broker:', error);
    throw error;
  }
};

/**
 * Test a broker connection
 */
export const testBrokerConnection = async (connectionId: string): Promise<{ status: string; message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/broker/connections/${connectionId}/test`);
    return response.data.data;
  } catch (error) {
    console.error('Error testing broker connection:', error);
    throw error;
  }
}; 