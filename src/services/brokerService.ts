import axios from '@/lib/axios';
import { AxiosError } from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
  isActive: boolean;
  credentials?: Record<string, string>;
  updatedAt?: string;
}

// Default brokers configuration - keeping only Dhan
const DEFAULT_BROKERS: Broker[] = [
  {
    id: 'dhan',
    name: 'DHAN',
    logo: '/brokers/dhan.png',
    description: 'Connect your Dhan account to automate trading.',
    fields: [
      { name: 'partner_id', label: 'Partner ID', type: 'text' },
      { name: 'partner_secret', label: 'Partner Secret', type: 'password' }
    ]
  }
];

/**
 * Get available brokers (only Dhan)
 */
export const getAvailableBrokers = async (): Promise<Broker[]> => {
  try {
    const response = await axios.get('/api/v1/brokers/available');
    const dhanBroker = response.data.data.find((broker: Broker) => broker.id === 'dhan');
    return dhanBroker ? [dhanBroker] : DEFAULT_BROKERS;
  } catch (error) {
    console.error('Error fetching available brokers:', error);
    return DEFAULT_BROKERS;
  }
};

/**
 * Get saved broker information (only Dhan)
 */
export const getSavedBrokers = async (): Promise<SavedBroker[]> => {
  try {
    const supabase = createClientComponentClient();
    // Use let instead of const for token-related variables to support refreshing
    let { data, error } = await supabase
      .from('broker_credentials')
      .select('*')
      .eq('broker_id', 'dhan');
    
    if (error) {
      throw error;
    }
    
    return (data || []).map((item) => ({
      id: item.id,
      brokerId: item.broker_id,
      name: item.name,
      isActive: item.is_active,
      credentials: item.credentials,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error fetching saved brokers:', error);
    return [];
  }
};

/**
 * Toggle broker status (only used for Dhan)
 */
export const toggleBrokerStatus = async (id: string, isActive: boolean): Promise<void> => {
  try {
    const supabase = createClientComponentClient();
    // Use let instead of const for token-related variables to support refreshing
    let { error } = await supabase
      .from('broker_credentials')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error toggling broker status:', error);
    throw error;
  }
};

/**
 * Delete broker credentials (only used for Dhan)
 */
export const deleteBrokerCredentials = async (id: string): Promise<void> => {
  try {
    const supabase = createClientComponentClient();
    // Use let instead of const for token-related variables to support refreshing
    let { error } = await supabase
      .from('broker_credentials')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting broker credentials:', error);
    throw error;
  }
};