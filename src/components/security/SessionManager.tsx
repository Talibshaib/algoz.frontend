"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardBody,
  Button,
  Chip,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip
} from '@nextui-org/react';
import { 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tablet, 
  LogOut, 
  RefreshCw,
  Clock,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

type Session = {
  sessionId: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
  isCurrent: boolean;
  deviceType?: string;
  deviceName?: string;
  location?: string;
};

export default function SessionManager() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTerminating, setIsTerminating] = useState<string | null>(null);
  const [isTerminatingAll, setIsTerminatingAll] = useState(false);
  
  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);
  
  // Function to fetch sessions
  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/users/sessions');
      
      if (response.status === 200) {
        // Process sessions to add device info
        const processedSessions = response.data.data.map((session: any) => {
          // Determine if this is the current session
          const isCurrent = session.sessionId === user?.sessionId;
          
          // Parse user agent to determine device type
          const deviceInfo = parseUserAgent(session.userAgent);
          
          // Format location if available
          let location = 'Unknown';
          if (session.networkInfo?.geo) {
            const geo = session.networkInfo.geo;
            location = `${geo.city || ''}, ${geo.country || ''}`.trim();
            if (!location) location = geo.country || 'Unknown';
          }
          
          return {
            ...session,
            isCurrent,
            deviceType: deviceInfo.type,
            deviceName: deviceInfo.name,
            location
          };
        });
        
        setSessions(processedSessions);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      toast.error('Failed to load active sessions');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to parse user agent
  const parseUserAgent = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    let type = 'desktop';
    let name = 'Unknown Device';
    
    if (ua.includes('iphone') || ua.includes('android') && ua.includes('mobile')) {
      type = 'mobile';
      name = ua.includes('iphone') ? 'iPhone' : 'Android Phone';
    } else if (ua.includes('ipad') || ua.includes('android') && !ua.includes('mobile')) {
      type = 'tablet';
      name = ua.includes('ipad') ? 'iPad' : 'Android Tablet';
    } else if (ua.includes('macintosh') || ua.includes('mac os')) {
      name = 'Mac';
    } else if (ua.includes('windows')) {
      name = 'Windows PC';
    } else if (ua.includes('linux')) {
      name = 'Linux';
    }
    
    // Add browser info
    if (ua.includes('chrome')) {
      name += ' • Chrome';
    } else if (ua.includes('firefox')) {
      name += ' • Firefox';
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
      name += ' • Safari';
    } else if (ua.includes('edge')) {
      name += ' • Edge';
    }
    
    return { type, name };
  };
  
  // Function to get device icon
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone size={16} />;
      case 'tablet':
        return <Tablet size={16} />;
      default:
        return <Laptop size={16} />;
    }
  };
  
  // Function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Function to calculate time ago
  const timeAgo = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };
  
  // Function to terminate a session
  const terminateSession = async (sessionId: string) => {
    try {
      setIsTerminating(sessionId);
      
      const response = await axiosInstance.post('/users/terminate-session', {
        sessionId,
        currentSessionId: user?.sessionId
      });
      
      if (response.status === 200) {
        toast.success('Session terminated successfully');
        
        // Update sessions list
        setSessions(prevSessions => 
          prevSessions.map(session => 
            session.sessionId === sessionId 
              ? { ...session, isActive: false } 
              : session
          )
        );
      }
    } catch (error) {
      console.error('Failed to terminate session:', error);
      toast.error('Failed to terminate session');
    } finally {
      setIsTerminating(null);
    }
  };
  
  // Function to terminate all other sessions
  const terminateAllSessions = async () => {
    try {
      setIsTerminatingAll(true);
      
      const response = await axiosInstance.post('/users/terminate-all-sessions', {}, {
        params: { currentSessionId: user?.sessionId }
      });
      
      if (response.status === 200) {
        toast.success('All other sessions terminated successfully');
        
        // Update sessions list
        setSessions(prevSessions => 
          prevSessions.map(session => 
            session.isCurrent 
              ? session 
              : { ...session, isActive: false }
          )
        );
      }
    } catch (error) {
      console.error('Failed to terminate all sessions:', error);
      toast.error('Failed to terminate all sessions');
    } finally {
      setIsTerminatingAll(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner color="primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Active Sessions</h3>
        <div className="flex gap-2">
          <Button 
            color="primary" 
            variant="light" 
            startContent={<RefreshCw size={16} />}
            onClick={fetchSessions}
          >
            Refresh
          </Button>
          <Button 
            color="danger" 
            variant="flat" 
            startContent={<LogOut size={16} />}
            isLoading={isTerminatingAll}
            onClick={terminateAllSessions}
            isDisabled={sessions.filter(s => s.isActive && !s.isCurrent).length === 0}
          >
            Sign Out All Other Devices
          </Button>
        </div>
      </div>
      
      {sessions.length === 0 ? (
        <div className="flex justify-center items-center py-8 text-gray-500">
          <AlertTriangle className="mr-2" size={16} />
          <span>No session data available</span>
        </div>
      ) : (
        <Table aria-label="Active sessions">
          <TableHeader>
            <TableColumn>DEVICE</TableColumn>
            <TableColumn>LOCATION</TableColumn>
            <TableColumn>LAST ACTIVITY</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {sessions
              .sort((a, b) => {
                // Current session first
                if (a.isCurrent) return -1;
                if (b.isCurrent) return 1;
                
                // Then active sessions
                if (a.isActive && !b.isActive) return -1;
                if (!a.isActive && b.isActive) return 1;
                
                // Then by last activity
                return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
              })
              .map(session => (
                <TableRow key={session.sessionId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(session.deviceType || 'desktop')}
                      <div>
                        <p className="font-medium">{session.deviceName}</p>
                        <p className="text-xs text-gray-500">
                          {session.isCurrent ? 'Current session' : `Started ${timeAgo(session.createdAt)}`}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-500" />
                      <span>{session.location}</span>
                    </div>
                    <p className="text-xs text-gray-500">{session.ipAddress}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-500" />
                      <span>{timeAgo(session.lastActivity)}</span>
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(session.lastActivity)}</p>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      color={session.isActive ? "success" : "default"} 
                      size="sm"
                      variant="flat"
                    >
                      {session.isActive ? "Active" : "Inactive"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {session.isActive && (
                      <Tooltip content={session.isCurrent ? "Current session" : "Sign out from this device"}>
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          size="sm"
                          isLoading={isTerminating === session.sessionId}
                          isDisabled={session.isCurrent}
                          onClick={() => terminateSession(session.sessionId)}
                        >
                          <LogOut size={16} />
                        </Button>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
} 