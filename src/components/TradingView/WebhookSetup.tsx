"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Divider
} from '@nextui-org/react';
import { Copy, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

export default function WebhookSetup() {
  const { user } = useAuth();
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'error'>('unknown');

  // Fetch webhook URL on component mount
  useEffect(() => {
    fetchWebhookUrl();
  }, []);

  // Function to fetch webhook URL
  const fetchWebhookUrl = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/webhook/url');
      
      if (response.status === 200 && response.data.data?.webhookUrl) {
        setWebhookUrl(response.data.data.webhookUrl);
        // Test the webhook connection
        testWebhookConnection(response.data.data.webhookUrl);
      }
    } catch (error) {
      console.error('Failed to fetch webhook URL:', error);
      toast.error('Failed to load webhook URL');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to test webhook connection
  const testWebhookConnection = async (url: string) => {
    try {
      // Simple test request to check if the webhook endpoint is accessible
      const response = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // If we get any response, consider it a success
      setConnectionStatus('success');
    } catch (error) {
      console.error('Webhook connection test failed:', error);
      setConnectionStatus('error');
    }
  };

  // Function to regenerate webhook URL
  const regenerateWebhookUrl = async () => {
    try {
      setIsRegenerating(true);
      const response = await axiosInstance.post('/webhook/regenerate');
      
      if (response.status === 200 && response.data.data?.webhookUrl) {
        setWebhookUrl(response.data.data.webhookUrl);
        toast.success('Webhook URL regenerated successfully');
        // Test the new webhook connection
        testWebhookConnection(response.data.data.webhookUrl);
      }
    } catch (error) {
      console.error('Failed to regenerate webhook URL:', error);
      toast.error('Failed to regenerate webhook URL');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Function to copy webhook URL to clipboard
  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
      .then(() => toast.success('Webhook URL copied to clipboard'))
      .catch(err => {
        console.error('Failed to copy webhook URL:', err);
        toast.error('Failed to copy webhook URL');
      });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex gap-3 bg-primary-50">
        <div className="flex flex-col">
          <p className="text-xl font-semibold">TradingView Webhook URL</p>
          <p className="text-small text-default-500">
            Use this URL in TradingView to send trading signals to our platform
          </p>
        </div>
      </CardHeader>
      
      <Divider />
      
      <CardBody className="py-5 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Your Webhook URL</p>
                {connectionStatus === 'success' ? (
                  <div className="flex items-center text-success text-sm">
                    <CheckCircle size={16} className="mr-1" />
                    Connected
                  </div>
                ) : connectionStatus === 'error' ? (
                  <div className="flex items-center text-danger text-sm">
                    <AlertTriangle size={16} className="mr-1" />
                    Connection issue
                  </div>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={webhookUrl}
                  readOnly
                  className="flex-grow"
                />
                <Button
                  isIconOnly
                  color="primary"
                  onClick={copyWebhookUrl}
                  aria-label="Copy webhook URL"
                >
                  <Copy size={18} />
                </Button>
              </div>
              {connectionStatus === 'error' && (
                <div className="text-danger text-sm mt-2">
                  <p>Failed to connect to server. Please check your internet connection.</p>
                  <p>The webhook will still work when the server is available.</p>
                </div>
              )}
            </div>
            
            <Divider />
            
            <div className="space-y-3">
              <p className="font-semibold">How to Use</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Copy the webhook URL above</li>
                <li>In TradingView, go to Pine Script strategy settings</li>
                <li>Enable "Alerts" in your strategy properties</li>
                <li>Create a new alert and select "Webhook URL" as the notification method</li>
                <li>Paste your webhook URL</li>
                <li>Configure the alert message format (JSON recommended)</li>
                <li>Save the alert</li>
              </ol>
            </div>
          </>
        )}
      </CardBody>
      
      <Divider />
      
      <CardFooter>
        <Button
          color="primary"
          variant="flat"
          startContent={<RefreshCw size={18} />}
          onClick={regenerateWebhookUrl}
          isLoading={isRegenerating}
        >
          Regenerate Webhook URL
        </Button>
        <p className="text-xs text-gray-500 ml-2">
          Note: Regenerating will invalidate your previous webhook URL
        </p>
      </CardFooter>
    </Card>
  );
} 