import axiosInstance from "@/lib/axios";

export interface BrokerCredentials {
  brokerId: string;
  apiKey: string;
  apiSecret: string;
  [key: string]: string;
}

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
    const response = await axiosInstance.post('/broker/connect', credentials);
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
    const response = await axiosInstance.get('/broker/connections');
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
    await axiosInstance.delete(`/broker/connections/${connectionId}`);
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
    const response = await axiosInstance.post(`/broker/connections/${connectionId}/test`);
    return response.data.data;
  } catch (error) {
    console.error('Error testing broker connection:', error);
    throw error;
  }
}; 