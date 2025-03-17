"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/lib/axios';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@nextui-org/react';
import { Laptop, Smartphone, Globe, Clock, LogOut, AlertTriangle } from 'lucide-react';

interface Session {
  sessionId: string;
  device: string;
  ipAddress: string;
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
  isCurrent: boolean;
}

export function SessionManager() {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [terminatingSession, setTerminatingSession] = useState('');
  const [terminatingAllSessions, setTerminatingAllSessions] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError('');
      
      // If sessionId is not available, fetch without it or show a message
      if (!user?.sessionId) {
        console.warn('Session ID not available. User may need to log in again.');
        setError('Session information not available. Please log out and log in again.');
        setLoading(false);
        return;
      }
      
      const response = await axiosInstance.get('/users/sessions', {
        params: { currentSessionId: user.sessionId }
      });
      
      if (response.status === 200 && response.data.data) {
        setSessions(response.data.data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = async (session: Session) => {
    try {
      setTerminatingSession(session.sessionId);
      
      // Don't allow terminating the current session through this method
      if (!user?.sessionId || session.isCurrent) {
        toast.error("You cannot terminate your current session this way. Please use the logout button instead.");
        return;
      }
      
      const response = await axiosInstance.delete(`/users/sessions/${session.sessionId}`, {
        params: { currentSessionId: user.sessionId }
      });
      
      if (response.status === 200) {
        toast.success("Session terminated successfully");
        fetchSessions();
      }
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error("Failed to terminate session. Please try again.");
    } finally {
      setTerminatingSession('');
      setShowTerminateModal(false);
    }
  };

  const handleTerminateAllOtherSessions = async () => {
    try {
      setTerminatingAllSessions(true);
      
      if (!user?.sessionId) {
        toast.error("Session information not available. Please log out and log in again.");
        return;
      }
      
      const response = await axiosInstance.delete('/users/sessions', {
        params: { currentSessionId: user.sessionId }
      });
      
      if (response.status === 200) {
        toast.success("All other sessions terminated successfully");
        fetchSessions();
      }
    } catch (error) {
      console.error('Error terminating all sessions:', error);
      toast.error("Failed to terminate sessions. Please try again.");
    } finally {
      setTerminatingAllSessions(false);
    }
  };

  const openTerminateModal = (session: Session) => {
    setSelectedSession(session);
    onOpen();
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Helper function to get device icon
  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('android') || device.toLowerCase().includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    } else if (device.toLowerCase().includes('windows') || device.toLowerCase().includes('mac') || device.toLowerCase().includes('linux')) {
      return <Laptop className="h-4 w-4" />;
    } else {
      return <Globe className="h-4 w-4" />;
    }
  };

  // Calculate time since last activity
  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between">
        <h3 className="text-lg font-semibold">Active Sessions</h3>
        <Button 
          color="danger" 
          variant="flat" 
          size="sm"
          onClick={handleTerminateAllOtherSessions}
          isDisabled={loading || sessions.filter(s => !s.isCurrent && s.isActive).length === 0}
        >
          Sign Out All Other Sessions
        </Button>
      </CardHeader>
      
      <CardBody>
        {error && (
          <div className="bg-danger-50 text-danger p-3 rounded-md mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        
        <Table aria-label="Active sessions">
          <TableHeader>
            <TableColumn>DEVICE</TableColumn>
            <TableColumn>IP ADDRESS</TableColumn>
            <TableColumn>LAST ACTIVITY</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody 
            isLoading={loading}
            loadingContent="Loading sessions..."
            emptyContent="No active sessions found"
          >
            {sessions.map((session) => (
              <TableRow key={session.sessionId}>
                <TableCell>
                  <div className="flex items-center">
                    {getDeviceIcon(session.device)}
                    <span className="ml-2">{session.device.split(' ').slice(0, 3).join(' ')}</span>
                    {session.isCurrent && (
                      <Chip size="sm" color="primary" variant="flat" className="ml-2">
                        Current
                      </Chip>
                    )}
                  </div>
                </TableCell>
                <TableCell>{session.ipAddress}</TableCell>
                <TableCell>
                  <Tooltip content={formatDate(session.lastActivity)}>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getTimeSince(session.lastActivity)}
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip 
                    size="sm" 
                    color={session.isActive ? "success" : "default"}
                    variant="flat"
                  >
                    {session.isActive ? "Active" : "Inactive"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="light"
                    isDisabled={!session.isActive}
                    onClick={() => openTerminateModal(session)}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
      
      <CardFooter>
        <p className="text-sm text-gray-500">
          Sessions are automatically terminated after 30 minutes of inactivity.
        </p>
      </CardFooter>
      
      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Confirm Sign Out</ModalHeader>
          <ModalBody>
            {selectedSession?.isCurrent ? (
              <p>Are you sure you want to sign out from your current session? You will be redirected to the login page.</p>
            ) : (
              <p>Are you sure you want to sign out this session from {selectedSession?.device}?</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button 
              color="danger" 
              onPress={() => selectedSession && handleTerminateSession(selectedSession)}
              isLoading={terminatingSession === selectedSession?.sessionId}
            >
              Sign Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
} 