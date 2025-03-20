"use client"

import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertCircle, ArrowRight, Bell, Clock, FileText, Link, RefreshCw, Settings } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState({ 
    api: "loading", 
    webhook: "loading", 
    trading: "loading" 
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user data when component mounts
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    loadUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        // Call health check endpoint to verify system status
        const response = await axiosInstance.get('/api/v1/health/status');
        setHealthStatus({
          api: response.data?.services?.api || "operational",
          webhook: "operational",
          trading: response.data?.services?.trading || "operational"
        });
      } catch (error) {
        console.error("Error fetching system status:", error);
        setHealthStatus({
          api: "degraded",
          webhook: "operational",
          trading: "degraded"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemStatus();
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "operational":
        return "text-green-500";
      case "degraded":
        return "text-amber-500";
      case "offline":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.name || user?.email || 'Trader'}</h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            <span>Settings</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/broker-management')}>
            <Link className="h-4 w-4 mr-2" />
            <span>Connect Broker</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access common tasks and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard/webhook')}>
                <Link className="h-4 w-4 mr-2" />
                <span>Configure Webhook URL</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard/api-credentials')}>
                <FileText className="h-4 w-4 mr-2" />
                <span>Manage API Credentials</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard/broker-management')}>
                <ArrowRight className="h-4 w-4 mr-2" />
                <span>Broker Management</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                <span>Account Settings</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              <span>View All Features</span>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest trading signals and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4 py-1 relative">
                <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[5px] top-[14px]"></div>
                <p className="font-medium">Webhook URL Generated</p>
                <p className="text-sm text-muted-foreground">{formatDate(new Date())}</p>
              </div>
              <div className="border-l-2 border-green-500 pl-4 py-1 relative">
                <div className="absolute w-2 h-2 bg-green-500 rounded-full -left-[5px] top-[14px]"></div>
                <p className="font-medium">Account Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(new Date(Date.now() - 86400000))}</p>
              </div>
              <div className="border-l-2 border-gray-200 pl-4 py-1 relative">
                <div className="absolute w-2 h-2 bg-gray-200 rounded-full -left-[5px] top-[14px]"></div>
                <p className="text-sm text-muted-foreground italic">Connect a broker to see trading signals</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>View Activity History</span>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Platform performance and uptime
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  API Status
                </span>
                {isLoading ? (
                  <div className="animate-pulse">
                    <Badge variant="outline" className="px-3">Loading</Badge>
                  </div>
                ) : (
                  <span className={getStatusColor(healthStatus.api)}>
                    {healthStatus.api === "operational" ? "Operational" : 
                     healthStatus.api === "degraded" ? "Degraded" : "Offline"}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Link className="h-4 w-4 mr-2" />
                  Webhook Service
                </span>
                {isLoading ? (
                  <div className="animate-pulse">
                    <Badge variant="outline" className="px-3">Loading</Badge>
                  </div>
                ) : (
                  <span className={getStatusColor(healthStatus.webhook)}>
                    {healthStatus.webhook === "operational" ? "Operational" : 
                     healthStatus.webhook === "degraded" ? "Degraded" : "Offline"}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Trading Engine
                </span>
                {isLoading ? (
                  <div className="animate-pulse">
                    <Badge variant="outline" className="px-3">Loading</Badge>
                  </div>
                ) : (
                  <span className={getStatusColor(healthStatus.trading)}>
                    {healthStatus.trading === "operational" ? "Operational" : 
                     healthStatus.trading === "degraded" ? "Degraded" : "Offline"}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => router.push('/dashboard/status')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Refresh Status</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Usage Statistics */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Usage</h2>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Current Plan</p>
              <h3 className="text-3xl font-bold">
                {user?.user_metadata?.plan || 'Free'}
              </h3>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => router.push('/dashboard/pricing')}>
                <span>Upgrade</span>
              </Button>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm">API Requests</p>
              <h3 className="text-3xl font-bold">0 / 100</h3>
              <p className="text-xs text-muted-foreground mt-1">Daily Limit</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Connected Brokers</p>
              <h3 className="text-3xl font-bold">0 / 3</h3>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => router.push('/dashboard/broker-management')}>
                <span>Manage</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
