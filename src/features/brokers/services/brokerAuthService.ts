import axios, { AxiosError } from 'axios';

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