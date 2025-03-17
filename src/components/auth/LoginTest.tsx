"use client"

import { useState } from 'react';
import axios from 'axios';

export default function LoginTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testDirectLogin = async () => {
    setLoading(true);
    setResult('Testing direct login to Render backend...');
    
    try {
      const response = await axios.post(
        'https://algoz-backend-68rt.onrender.com/api/v1/auth/login',
        {
          username: 'testuser',
          password: 'password123'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setResult(`Direct login response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`Direct login error: ${error.message}\n${JSON.stringify(error.response?.data || {}, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testProxiedLogin = async () => {
    setLoading(true);
    setResult('Testing proxied login through Next.js...');
    
    try {
      const response = await axios.post(
        '/api/v1/auth/login',
        {
          username: 'testuser',
          password: 'password123'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setResult(`Proxied login response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`Proxied login error: ${error.message}\n${JSON.stringify(error.response?.data || {}, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testHealthEndpoint = async () => {
    setLoading(true);
    setResult('Testing health endpoint...');
    
    try {
      const response = await axios.get('/api/v1/health');
      setResult(`Health endpoint response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`Health endpoint error: ${error.message}\n${JSON.stringify(error.response?.data || {}, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Login API Test</h1>
      
      <div className="flex gap-2 mb-4">
        <button 
          onClick={testDirectLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Direct Login
        </button>
        
        <button 
          onClick={testProxiedLogin}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Test Proxied Login
        </button>
        
        <button 
          onClick={testHealthEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Test Health Endpoint
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-96">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
} 