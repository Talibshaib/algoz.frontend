"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getAllApiEndpoints, setApiUrl } from '@/constants/URI';

export default function DirectAdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [endpoints, setEndpoints] = useState<string[]>([]);
  const [endpointStatus, setEndpointStatus] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    // Get all available endpoints
    const allEndpoints = getAllApiEndpoints();
    setEndpoints(allEndpoints);
    
    // Initialize status for each endpoint
    const initialStatus: Record<string, string> = {};
    allEndpoints.forEach(endpoint => {
      initialStatus[endpoint] = 'Not tested';
    });
    setEndpointStatus(initialStatus);
    
    // Test each endpoint
    testAllEndpoints(allEndpoints);
  }, []);

  const testAllEndpoints = async (endpoints: string[]) => {
    const newStatus: Record<string, string> = {};
    
    for (const endpoint of endpoints) {
      newStatus[endpoint] = 'Testing...';
      setEndpointStatus({...endpointStatus, ...newStatus});
      
      try {
        const startTime = Date.now();
        const response = await axios.get(`${endpoint}/health`, { timeout: 5000 });
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (response.status === 200) {
          newStatus[endpoint] = `Available (${responseTime}ms)`;
        } else {
          newStatus[endpoint] = `Error: ${response.status}`;
        }
      } catch (error) {
        newStatus[endpoint] = 'Failed';
      }
      
      setEndpointStatus({...endpointStatus, ...newStatus});
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Attempting admin login on all available endpoints...');
    
    // Determine if input is email or username
    const isEmail = username.includes('@');
    
    // Prepare login payload
    const loginData = {
      email: isEmail ? username : undefined,
      username: !isEmail ? username : undefined,
      password
    };
    
    // Try each endpoint
    for (const endpoint of endpoints) {
      try {
        setMessage(`Trying ${endpoint}...`);
        
        // Create a fresh axios instance for this attempt
        const instance = axios.create({
          baseURL: endpoint,
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 10000,
        });
        
        const response = await instance.post('/admin/login', loginData);
        
        if (response.status === 200 && response.data.data) {
          // Save the working endpoint
          setApiUrl(endpoint);
          
          // Extract admin data and token
          const { admin, accessToken } = response.data.data;
          
          // Create admin object with token
          const adminData = {
            ...admin,
            accessToken
          };
          
          // Store in localStorage
          localStorage.setItem('adminUser', JSON.stringify(adminData));
          
          setMessage(`Admin login successful via ${endpoint}! Redirecting...`);
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push('/admin');
          }, 1000);
          
          return;
        }
      } catch (error: any) {
        console.error(`Admin login failed on ${endpoint}:`, error);
        // Continue to next endpoint
      }
    }
    
    // If we get here, all endpoints failed
    setMessage('Admin login failed on all endpoints. Please check your credentials and try again.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Direct Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          This page will try all available endpoints to log you in as an admin
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Admin Username or Email
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                {loading ? 'Logging in...' : 'Admin Login'}
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded">
              {message}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">Endpoint Status:</h3>
            <div className="mt-2 space-y-2 text-xs">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded flex justify-between">
                  <span className="font-mono truncate">{endpoint}</span>
                  <span className={`ml-2 ${endpointStatus[endpoint]?.includes('Available') ? 'text-green-600' : 'text-red-600'}`}>
                    {endpointStatus[endpoint]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 