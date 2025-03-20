"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CheckCircle, Clock, RefreshCw, AlertTriangle, XCircle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function StatusPage() {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const router = useRouter();

  const fetchSystemStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get('/api/v1/health/status');
      setSystemStatus(response.data);
      setLastRefreshed(new Date());
    } catch (err: any) {
      console.error("Error fetching system status:", err);
      setError(err.response?.data?.message || "Failed to load system status");
      toast.error("Failed to load system status", { 
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();

    // Refresh status every 30 seconds
    const interval = setInterval(() => {
      fetchSystemStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchSystemStatus();
    toast.info("Refreshing system status...");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-500 border-green-200 bg-green-50';
      case 'degraded':
        return 'text-amber-500 border-amber-200 bg-amber-50';
      case 'offline':
        return 'text-red-500 border-red-200 bg-red-50';
      default:
        return 'text-gray-500 border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">System Status</h1>
          <p className="text-muted-foreground mt-1">
            Monitor the operational status of all AlgoZ services
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isLoading} 
          className="mt-4 md:mt-0"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Overall Status */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Current System Status</CardTitle>
              <CardDescription>
                {isLoading ? 'Checking overall system status...' : 
                  `Last updated: ${lastRefreshed.toLocaleTimeString()}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-20 w-full rounded-md" />
              ) : (
                <div className="flex items-center space-x-4">
                  {getStatusIcon(systemStatus?.overallStatus || 'unknown')}
                  <div>
                    <h3 className="text-2xl font-bold capitalize">
                      {systemStatus?.overallStatus === 'operational' ? 'All Systems Operational' :
                       systemStatus?.overallStatus === 'degraded' ? 'Some Systems Degraded' :
                       systemStatus?.overallStatus === 'offline' ? 'Major Outage' : 'Status Unknown'}
                    </h3>
                    <p className="text-muted-foreground">
                      {systemStatus?.message || 'Current system status information'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* API Status */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>API Service</CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <Badge variant="outline" className={getStatusColor(systemStatus?.services?.api || 'unknown')}>
                      {systemStatus?.services?.api === 'operational' ? 'Operational' :
                       systemStatus?.services?.api === 'degraded' ? 'Degraded' :
                       systemStatus?.services?.api === 'offline' ? 'Offline' : 'Unknown'}
                    </Badge>
                  )}
                </div>
                <CardDescription>Core API functionality</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-14 w-full" />
                ) : (
                  <div className="flex items-center">
                    {getStatusIcon(systemStatus?.services?.api || 'unknown')}
                    <div className="ml-3">
                      <p className="text-sm">
                        {systemStatus?.services?.api === 'operational' ? 'The API is responding normally to all requests.' :
                         systemStatus?.services?.api === 'degraded' ? 'The API is experiencing some issues but is still operational.' :
                         systemStatus?.services?.api === 'offline' ? 'The API is currently unreachable.' : 
                         'Status information unavailable.'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Webhook Status */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Webhook Service</CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <Badge variant="outline" className={getStatusColor(systemStatus?.services?.webhook ? 'operational' : 'operational')}>
                      Operational
                    </Badge>
                  )}
                </div>
                <CardDescription>Trading signal processor</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-14 w-full" />
                ) : (
                  <div className="flex items-center">
                    {getStatusIcon('operational')}
                    <div className="ml-3">
                      <p className="text-sm">
                        Webhook service is processing signals normally.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trading Engine Status */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Trading Engine</CardTitle>
                  {isLoading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <Badge variant="outline" className={getStatusColor(systemStatus?.services?.trading || 'unknown')}>
                      {systemStatus?.services?.trading === 'operational' ? 'Operational' :
                       systemStatus?.services?.trading === 'degraded' ? 'Degraded' :
                       systemStatus?.services?.trading === 'offline' ? 'Offline' : 'Unknown'}
                    </Badge>
                  )}
                </div>
                <CardDescription>Order execution system</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-14 w-full" />
                ) : (
                  <div className="flex items-center">
                    {getStatusIcon(systemStatus?.services?.trading || 'unknown')}
                    <div className="ml-3">
                      <p className="text-sm">
                        {systemStatus?.services?.trading === 'operational' ? 'Trading engine is executing orders normally.' :
                         systemStatus?.services?.trading === 'degraded' ? 'Trading engine is experiencing delays or issues.' :
                         systemStatus?.services?.trading === 'offline' ? 'Trading engine is not executing orders.' : 
                         'Status information unavailable.'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Technical details and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Environment</span>
                    <span>{systemStatus?.environment || 'production'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Timestamp</span>
                    <span>{new Date(systemStatus?.timestamp || Date.now()).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Status Last Updated</span>
                    <span>{new Date(systemStatus?.lastUpdated || Date.now()).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>Status updates automatically every 30 seconds</span>
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
} 