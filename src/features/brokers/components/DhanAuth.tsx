"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { X, ExternalLink, ToggleLeft, ToggleRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authenticateDhan, generateDhanConsentUrl, completeDhanAuth } from '../services/brokerAuthService';

interface DhanAuthProps {
  brokerId: string;
  isActive?: boolean;
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onSuccess: () => void;
}

interface BrokerField {
  name: string;
  label: string;
  type: string;
}

const DHAN_FIELDS: BrokerField[] = [
  { name: 'partner_id', label: 'Partner ID', type: 'text' },
  { name: 'partner_secret', label: 'Partner Secret', type: 'password' }
];

export const DhanAuthButton: React.FC<Omit<DhanAuthProps, 'isModalOpen' | 'onOpenModal' | 'onCloseModal'>> = ({
  brokerId,
  isActive = false,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAuth = async () => {
    setIsLoading(true);
    try {
      // Generate consent URL
      const consentUrl = await generateDhanConsentUrl(brokerId);
      // Open the URL in a new window
      window.open(consentUrl, '_blank');
      toast.success('Dhan authentication initiated. Please complete the process in the opened window.');
      onSuccess();
    } catch (error: any) {
      console.error('Failed to authenticate with Dhan:', error);
      toast.error('Failed to authenticate with Dhan: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={() => handleAuth()}
      className="text-primary hover:text-primary/80 transition-colors"
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      ) : isActive ? (
        <ToggleRight className="h-6 w-6 text-green-500" />
      ) : (
        <ToggleLeft className="h-6 w-6 text-gray-400" />
      )}
    </button>
  );
};

export const DhanAuthModal: React.FC<Omit<DhanAuthProps, 'isActive'>> = ({
  brokerId,
  isModalOpen,
  onOpenModal,
  onCloseModal,
  onSuccess
}) => {
  const [authStep, setAuthStep] = useState<'credentials' | 'consent' | 'callback'>('credentials');
  const [consentUrl, setConsentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({
    partner_id: '',
    partner_secret: ''
  });
  
  // Check if the URL contains a code parameter (for when user is redirected back)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');
      
      if (authCode) {
        setCode(authCode);
        setAuthStep('callback');
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);
  
  // Process the authorization code when available
  useEffect(() => {
    const processAuthCode = async () => {
      if (code && authStep === 'callback') {
        setIsLoading(true);
        
        try {
          const success = await completeDhanAuth(brokerId, code);
          
          if (success) {
            toast.success('Dhan connected successfully');
            onSuccess();
            onCloseModal();
          } else {
            toast.error('Failed to connect to Dhan. Please try again.');
            setAuthStep('credentials');
          }
        } catch (error: any) {
          console.error('Error completing Dhan authentication:', error);
          toast.error('Failed to complete Dhan authentication: ' + (error.response?.data?.message || error.message || 'Unknown error'));
          setAuthStep('credentials');
        } finally {
          setIsLoading(false);
          setCode(null);
        }
      }
    };
    
    processAuthCode();
  }, [code, authStep, brokerId, onSuccess, onCloseModal]);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleInitiateAuth();
  };
  
  const handleInitiateAuth = async () => {
    setIsLoading(true);
    
    try {
      // Start the authentication process
      const result = await authenticateDhan(brokerId);
      
      // Store the consent URL and move to the consent step
      setConsentUrl(result.redirectUrl);
      setAuthStep('consent');
      
      // Optional: open the URL in a new tab
      // window.open(result.redirectUrl, '_blank');
    } catch (error: any) {
      console.error('Error initiating Dhan authentication:', error);
      toast.error('Failed to initiate Dhan authentication: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenConsentPage = () => {
    if (consentUrl) {
      window.open(consentUrl, '_blank');
    }
  };
  
  // If the modal is not open, don't render anything
  if (!isModalOpen) return null;
  
  // Render the appropriate content based on the authentication step
  const renderContent = () => {
    switch (authStep) {
      case 'credentials':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Connect to Dhan</h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={onCloseModal}
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Enter your Dhan Partner ID and Partner Secret to connect your account.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {DHAN_FIELDS.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))}
                
                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCloseModal}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                    ) : null}
                    Connect
                  </Button>
                </div>
              </form>
            </div>
          </div>
        );
      
      case 'consent':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Connect to Dhan</h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={onCloseModal}
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Please click the button below to authorize access to your Dhan account. You will be redirected to Dhan's website to complete the authentication process.
              </p>
              
              <div className="flex flex-col space-y-4">
                <Button
                  onClick={handleOpenConsentPage}
                  className="w-full"
                  disabled={isLoading || !consentUrl}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Dhan Authorization Page
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setAuthStep('credentials')}
                  className="w-full"
                  disabled={isLoading}
                >
                  Back to Credentials
                </Button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return renderContent();
};