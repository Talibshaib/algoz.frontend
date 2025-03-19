"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import supabase from '@/lib/supabase';
import { Loader2, Shield, Key } from 'lucide-react';
import { LOGIN_ROUTE } from '@/constants/routes';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const router = useRouter();
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    twoFactorAuth: false
  });

  // Load user when component mounts
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setUser(data.session.user);
          
          // Set preferences from user metadata if available
          if (data.session.user.user_metadata?.preferences) {
            setPreferences(data.session.user.user_metadata.preferences);
          }
        } else {
          router.replace(LOGIN_ROUTE);
        }
      } catch (err) {
        console.error("Error loading user:", err);
        toast.error("Error loading user data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.replace(LOGIN_ROUTE);
      } else if (session) {
        setUser(session.user);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePreferenceChange = (name: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [name]: value }));
  };
  
  const refreshUserData = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Error refreshing user data:", error);
        return false;
      }
      
      if (data.session) {
        setUser(data.session.user);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error("Error refreshing user data:", err);
      return false;
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handlePreferenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSavingPreferences(true);
    
    try {
      // Save preferences to Supabase user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          preferences: preferences
        }
      });
      
      if (error) throw error;
      
      // Refresh user data
      await refreshUserData();
      
      toast.success('Preferences saved successfully');
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast.error(error.message || 'Failed to save preferences');
    } finally {
      setIsSavingPreferences(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace(LOGIN_ROUTE);
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    try {
      // This is a placeholder - Supabase doesn't have a direct user deletion method from the client
      // In a real app, you would call an API endpoint that uses the service role key to delete the user
      toast.error('Account deletion requires contacting support', { duration: 5000 });
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="mb-2">Session expired. Please log in again.</p>
          <Button onClick={() => router.replace(LOGIN_ROUTE)}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <Shield className="mr-2 h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePreferenceSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about account activity
                  </p>
                </div>
                <Switch 
                  checked={preferences.emailNotifications} 
                  onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch 
                  checked={preferences.twoFactorAuth} 
                  onCheckedChange={(checked) => handlePreferenceChange('twoFactorAuth', checked)}
                  disabled
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isSavingPreferences}
              >
                {isSavingPreferences ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Preferences'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button variant="outline" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
            <div>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This action cannot be undone.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
