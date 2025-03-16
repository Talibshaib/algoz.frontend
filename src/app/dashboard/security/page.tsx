"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Divider,
  Button,
  Tabs,
  Tab,
  Chip
} from '@nextui-org/react';
import { 
  Shield, 
  Key, 
  Globe, 
  Clock, 
  AlertTriangle,
  Smartphone,
  LogOut,
  RefreshCw
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import SessionManager from '@/components/security/SessionManager';

export default function SecurityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('sessions');
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch network information
    const fetchNetworkInfo = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/health/detailed');
        if (response.status === 200) {
          setNetworkInfo(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch network information:', error);
        toast.error('Failed to load network information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNetworkInfo();
  }, []);
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Security Settings" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="text-primary" size={24} />
          <h1 className="text-2xl font-bold">Security Center</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Security Overview */}
          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="flex gap-3">
                <Key size={20} />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Account Security</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Two-Factor Authentication</span>
                    <Chip color={user?.mfaEnabled ? "success" : "danger"} size="sm">
                      {user?.mfaEnabled ? "Enabled" : "Disabled"}
                    </Chip>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Password Last Changed</span>
                    <span className="text-sm text-gray-500">
                      {user?.passwordLastChanged 
                        ? formatDate(user.passwordLastChanged) 
                        : 'Never'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Network Monitoring</span>
                    <Chip color="success" size="sm">Active</Chip>
                  </div>
                </div>
              </CardBody>
              <Divider />
              <CardFooter>
                <Button 
                  color="primary" 
                  variant="flat" 
                  startContent={<Shield size={16} />}
                  className="w-full"
                  onClick={() => setActiveTab('security')}
                >
                  Manage Security Settings
                </Button>
              </CardFooter>
            </Card>
            
            {/* Network Information Card */}
            <Card className="shadow-sm">
              <CardHeader className="flex gap-3">
                <Globe size={20} />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Network Information</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <RefreshCw className="animate-spin" />
                  </div>
                ) : networkInfo ? (
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold">Your IP Address:</p>
                      <p>{networkInfo.client?.ip || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <p className="font-semibold">Location:</p>
                      <p>
                        {networkInfo.client?.geo 
                          ? `${networkInfo.client.geo.city || ''}, ${networkInfo.client.geo.country || ''}`
                          : 'Unknown'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-semibold">Browser:</p>
                      <p>{networkInfo.client?.browser?.name || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <p className="font-semibold">Device:</p>
                      <p>{networkInfo.client?.device?.type || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <p className="font-semibold">Server:</p>
                      <p>{networkInfo.server?.hostname || 'Unknown'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center py-4 text-gray-500">
                    <AlertTriangle className="mr-2" size={16} />
                    <span>Failed to load network information</span>
                  </div>
                )}
              </CardBody>
              <Divider />
              <CardFooter>
                <Button 
                  color="primary" 
                  variant="flat" 
                  startContent={<RefreshCw size={16} />}
                  className="w-full"
                  isLoading={isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const response = await axiosInstance.get('/health/detailed');
                      if (response.status === 200) {
                        setNetworkInfo(response.data.data);
                        toast.success('Network information updated');
                      }
                    } catch (error) {
                      console.error('Failed to refresh network information:', error);
                      toast.error('Failed to update network information');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  Refresh Network Info
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right column - Tabs for different security features */}
          <div className="md:col-span-2">
            <Card className="shadow-sm">
              <CardBody className="p-0">
                <Tabs 
                  aria-label="Security Options" 
                  selectedKey={activeTab}
                  onSelectionChange={(key) => setActiveTab(key as string)}
                  className="w-full"
                >
                  <Tab 
                    key="sessions" 
                    title={
                      <div className="flex items-center gap-2">
                        <Smartphone size={16} />
                        <span>Active Sessions</span>
                      </div>
                    }
                  >
                    <div className="p-4">
                      <SessionManager />
                    </div>
                  </Tab>
                  
                  <Tab 
                    key="security" 
                    title={
                      <div className="flex items-center gap-2">
                        <Shield size={16} />
                        <span>Security Settings</span>
                      </div>
                    }
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                      
                      <div className="space-y-6">
                        {/* Two-Factor Authentication */}
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <Key size={20} className="text-primary" />
                              <h4 className="font-semibold">Two-Factor Authentication</h4>
                            </div>
                            <Chip color={user?.mfaEnabled ? "success" : "danger"} size="sm">
                              {user?.mfaEnabled ? "Enabled" : "Disabled"}
                            </Chip>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Add an extra layer of security to your account by requiring a verification code in addition to your password.
                          </p>
                          <Button 
                            color={user?.mfaEnabled ? "danger" : "primary"}
                            variant={user?.mfaEnabled ? "flat" : "solid"}
                            onClick={() => router.push('/dashboard/security/mfa')}
                          >
                            {user?.mfaEnabled ? "Disable 2FA" : "Enable 2FA"}
                          </Button>
                        </div>
                        
                        {/* Password Security */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Key size={20} className="text-primary" />
                            <h4 className="font-semibold">Password Security</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            It's recommended to change your password regularly to keep your account secure.
                          </p>
                          <div className="flex items-center gap-2 mb-4">
                            <Clock size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-500">
                              Last changed: {user?.passwordLastChanged 
                                ? formatDate(user.passwordLastChanged) 
                                : 'Never'}
                            </span>
                          </div>
                          <Button 
                            color="primary"
                            variant="flat"
                            onClick={() => router.push('/dashboard/security/change-password')}
                          >
                            Change Password
                          </Button>
                        </div>
                        
                        {/* Network Security */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe size={20} className="text-primary" />
                            <h4 className="font-semibold">Network Security</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            We monitor your login locations and alert you when we detect unusual activity.
                          </p>
                          <Button 
                            color="primary"
                            variant="flat"
                            onClick={() => setActiveTab('sessions')}
                          >
                            View Active Sessions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 