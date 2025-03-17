// Test script to check API connectivity
// Run with: node src/test-api.js

const fetch = require('node-fetch');

async function testApiEndpoints() {
  const baseUrl = 'http://localhost:3000';
  const endpoints = [
    '/api/v1/health',
    '/api/v1/auth/test',
    '/health'
  ];

  console.log('Testing API endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\nTesting ${baseUrl}${endpoint}...`);
      const response = await fetch(`${baseUrl}${endpoint}`);
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
      } else {
        console.log('Error response');
      }
    } catch (error) {
      console.error(`Error testing ${endpoint}:`, error.message);
    }
  }

  // Test direct backend connection
  try {
    console.log('\nTesting direct backend connection...');
    const response = await fetch('https://algoz-backend-68rt.onrender.com/health');
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('Error response');
    }
  } catch (error) {
    console.error('Error testing direct backend:', error.message);
  }
}

testApiEndpoints().catch(console.error); 