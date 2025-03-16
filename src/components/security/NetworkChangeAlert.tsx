"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Button,
  Chip
} from '@nextui-org/react';
import { AlertTriangle, Shield, CheckCircle, X, Lock } from 'lucide-react';
import axiosInstance from '@/lib/axios';

export default function NetworkChangeAlert() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  
  useEffect(() => {
    // Check if we should show the alert
    const shouldShow = searchParams.get('network_change') === 'true' || 
                      (user?.networkChange?.detected === true);
    
    setIsVisible(shouldShow);
  }, [searchParams, user]);
  
  // If no network change or user is not logged in, don't render anything
  if (!isVisible || !user || !user.networkChange) {
    return null;
  }
  
  const { details } = user.networkChange;
  if (!details) return null;
  
  // Get risk level color
  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };
  
  // Handle verification
  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      
      // For high-risk changes, redirect to MFA verification
      if (details.riskLevel === 'high' || (details.riskLevel === 'medium' && user.mfaEnabled)) {
        router.push('/auth/network-verification');
        return;
      }
      
      // For low-risk changes, just call the verify-network endpoint
      const response = await axiosInstance.post('/users/verify-network', {
        userId: user._id,
        sessionId: user.sessionId
      });
      
      if (response.status === 200) {
        setVerificationSuccess(true);
        
        // Remove network change from user object
        const updatedUser = { ...user };
        delete updatedUser.networkChange;
        
        // Update sessionStorage
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Hide the alert after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
          
          // Remove the query parameter
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to verify network change:', error);
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    
    // Remove the query parameter
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className={`shadow-lg border-1 ${
        details.riskLevel === 'high' ? 'border-danger' : 
        details.riskLevel === 'medium' ? 'border-warning' : 'border-success'
      }`}>
        <CardHeader className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`${
              details.riskLevel === 'high' ? 'text-danger' : 
              details.riskLevel === 'medium' ? 'text-warning' : 'text-success'
            }`} />
            <h3 className="text-lg font-semibold">Network Change Detected</h3>
          </div>
          <Button isIconOnly size="sm" variant="light" onClick={handleDismiss}>
            <X size={18} />
          </Button>
        </CardHeader>
        
        <CardBody className="py-2">
          <div className="space-y-3">
            <p>
              We've detected that you're logging in from a different network than usual.
            </p>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold">Risk Level:</span>
              <Chip color={getRiskLevelColor(details.riskLevel)} size="sm">
                {details.riskLevel.toUpperCase()}
              </Chip>
            </div>
            
            {details.changes && details.changes.length > 0 && (
              <div>
                <span className="font-semibold">Changes detected:</span>
                <ul className="list-disc list-inside mt-1">
                  {details.changes.map((change, index) => (
                    <li key={index} className="text-sm">{change}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-semibold">Previous Location:</p>
                <p>{details.previousNetwork.location || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{details.previousNetwork.ip}</p>
              </div>
              <div>
                <p className="font-semibold">Current Location:</p>
                <p>{details.currentNetwork.location || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{details.currentNetwork.ip}</p>
              </div>
            </div>
          </div>
        </CardBody>
        
        <CardFooter className="flex justify-between">
          {verificationSuccess ? (
            <div className="flex items-center gap-2 text-success w-full justify-center">
              <CheckCircle size={18} />
              <span>Verified successfully!</span>
            </div>
          ) : (
            <>
              <Button 
                color="danger" 
                variant="light"
                onClick={() => router.push('/dashboard/security')}
              >
                View Security Settings
              </Button>
              <Button 
                color="primary" 
                startContent={details.riskLevel === 'high' ? <Lock size={18} /> : <Shield size={18} />}
                isLoading={isVerifying}
                onClick={handleVerify}
              >
                {details.riskLevel === 'high' || (details.riskLevel === 'medium' && user.mfaEnabled) 
                  ? 'Verify with MFA' 
                  : 'Verify It\'s Me'}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 