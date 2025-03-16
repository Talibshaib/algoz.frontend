"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Divider
} from '@nextui-org/react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

export default function NetworkMfaVerification() {
  const { user } = useAuth();
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // If no user or no network change, redirect to dashboard
  useEffect(() => {
    if (!user || !user.networkChange) {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  if (!user || !user.networkChange) {
    return null;
  }
  
  const { details } = user.networkChange;
  
  // Handle verification
  const handleVerify = async () => {
    try {
      // Validate input
      if (!verificationCode || verificationCode.length !== 6) {
        setError('Please enter a valid 6-digit verification code');
        return;
      }
      
      setIsVerifying(true);
      setError('');
      
      // Call the verify-network-mfa endpoint
      const response = await axiosInstance.post('/users/verify-network-mfa', {
        userId: user._id,
        sessionId: user.sessionId,
        token: verificationCode
      });
      
      if (response.status === 200) {
        setVerificationSuccess(true);
        toast.success('Network verification successful');
        
        // Update user data in session storage
        if (response.data.data.user) {
          const updatedUser = {
            ...response.data.data.user,
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken,
            loginTimestamp: Date.now(),
            tokenExpiry: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            lastActivity: Date.now()
          };
          
          // Remove network change flag
          delete updatedUser.networkChange;
          
          // Update session storage
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex gap-3 bg-primary-50">
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={24} />
            <div>
              <p className="text-xl font-semibold">Security Verification</p>
              <p className="text-small text-default-500">
                Verify your identity to continue
              </p>
            </div>
          </div>
        </CardHeader>
        
        <Divider />
        
        <CardBody className="py-5 space-y-4">
          {verificationSuccess ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle className="text-success" size={48} />
              <p className="text-center text-success font-semibold text-lg">
                Verification Successful
              </p>
              <p className="text-center text-gray-500">
                Redirecting you to the dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3 bg-warning-50 p-3 rounded-lg">
                <AlertTriangle className="text-warning mt-1" size={20} />
                <div>
                  <p className="font-semibold text-warning-600">
                    Network Change Detected
                  </p>
                  <p className="text-sm text-gray-600">
                    We've detected that you're logging in from a different network.
                    For your security, please verify your identity.
                  </p>
                </div>
              </div>
              
              {details && (
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Changes detected:</p>
                  <ul className="list-disc list-inside">
                    {details.changes.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                      <p className="font-semibold">Previous Location:</p>
                      <p>{details.previousNetwork.location || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Current Location:</p>
                      <p>{details.currentNetwork.location || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="font-semibold">Enter Verification Code</p>
                <p className="text-sm text-gray-600">
                  Please enter the 6-digit code from your authenticator app.
                </p>
                <Input
                  type="text"
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  isInvalid={!!error}
                  errorMessage={error}
                  autoFocus
                />
              </div>
            </>
          )}
        </CardBody>
        
        {!verificationSuccess && (
          <>
            <Divider />
            <CardFooter className="flex justify-between">
              <Button
                color="danger"
                variant="light"
                onClick={() => router.push('/login')}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={isVerifying}
                onClick={handleVerify}
                isDisabled={verificationCode.length !== 6}
              >
                Verify Identity
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
} 