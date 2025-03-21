"use client"

import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertCircle, ArrowRight, Bell, Clock, FileText, Link, RefreshCw, Settings, Zap, ChevronRight, BarChart3 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { DashboardCard, DashboardCardGroup, DashboardSection } from "@/features/dashboard";
import { Separator } from "@/components/ui/separator";

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
    <>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Trader'}</h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            <span>Settings</span>
          </Button>
          <Button variant="default" size="sm" onClick={() => router.push('/dashboard/broker-management')}>
            <Link className="h-4 w-4 mr-2" />
            <span>Connect Broker</span>
          </Button>
        </div>
      </div>
      
      {/* Status overview */}
      <DashboardSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard 
            title={
              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                <span>API Status</span>
              </div>
            }
          >
            <div className="mt-2">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-gray-200 animate-pulse"></div>
                  <span className="text-muted-foreground">Checking status...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${healthStatus.api === "operational" ? "bg-green-500" : healthStatus.api === "degraded" ? "bg-amber-500" : "bg-red-500"}`}></div>
                  <span className={getStatusColor(healthStatus.api)}>
                    {healthStatus.api === "operational" ? "All systems operational" : 
                    healthStatus.api === "degraded" ? "Some services degraded" : "System offline"}
                  </span>
                </div>
              )}
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title={
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-primary" />
                <span>Webhook Status</span>
              </div>
            }
          >
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-green-500">Ready to receive signals</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3 text-xs w-full justify-between items-center"
                onClick={() => router.push('/dashboard/webhook')}
              >
                <span>Configure Webhook</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title={
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                <span>Trading Activity</span>
              </div>
            }
          >
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <span className="text-amber-500">No broker connected</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3 text-xs w-full justify-between items-center"
                onClick={() => router.push('/dashboard/broker-management')}
              >
                <span>Connect Your Broker</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </DashboardCard>
        </div>
      </DashboardSection>
      
      <Separator className="my-8" />

      {/* Main dashboard content */}
      <DashboardSection title="Your Dashboard" description="Manage your activity and access key features">
        <DashboardCardGroup>
          <DashboardCard
            title="Quick Actions"
            description="Access common tasks and features"
          >
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard/webhook')}>
                <Link className="h-4 w-4 mr-3" />
                <span>Configure Webhook URL</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard/broker-management')}>
                <FileText className="h-4 w-4 mr-3" />
                <span>Manage API Credentials</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard/broker-management')}>
                <ArrowRight className="h-4 w-4 mr-3" />
                <span>Broker Management</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard/settings')}>
                <Settings className="h-4 w-4 mr-3" />
                <span>Account Settings</span>
              </Button>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">
                <span>View All Features</span>
              </Button>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Recent Activity"
            description="Your latest trading signals and events"
          >
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4 py-1 relative">
                <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-[14px]"></div>
                <p className="font-medium">Webhook URL Generated</p>
                <p className="text-sm text-muted-foreground">{formatDate(new Date())}</p>
              </div>
              <div className="border-l-2 border-green-500 pl-4 py-1 relative">
                <div className="absolute w-2 h-2 bg-green-500 rounded-full -left-[5px] top-[14px]"></div>
                <p className="font-medium">Account Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(new Date(Date.now() - 86400000))}</p>
              </div>
              <div className="border-l-2 border-border pl-4 py-1 relative">
                <div className="absolute w-2 h-2 bg-border rounded-full -left-[5px] top-[14px]"></div>
                <p className="text-sm text-muted-foreground italic">Connect a broker to see trading signals</p>
              </div>
            </div>
            
            <div className="mt-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>View Activity History</span>
              </Button>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Getting Started"
            description="Setup your account for trading"
          >
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">1</div>
                <div>
                  <h4 className="font-medium">Connect Your Broker</h4>
                  <p className="text-sm text-muted-foreground">Link your trading account to automate signals</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium">2</div>
                <div>
                  <h4 className="font-medium">Configure Webhook</h4>
                  <p className="text-sm text-muted-foreground">Set up your TradingView webhook URL</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium">3</div>
                <div>
                  <h4 className="font-medium">Deploy Your Strategy</h4>
                  <p className="text-sm text-muted-foreground">Configure and start your trading bot</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button variant="default" size="sm" className="w-full">
                <span>Start Trading</span>
              </Button>
            </div>
          </DashboardCard>
        </DashboardCardGroup>
      </DashboardSection>
    </>
  );
}
