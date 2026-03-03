// Simple Node.js test to verify category fetching logic
import axios from 'axios';

const API_CONFIG = {
  PRODUCTION: 'https://passo-backend.onrender.com',
};

const BASE_URL = API_CONFIG.PRODUCTION;
const API_URL = `${BASE_URL}/api`;

const ENDPOINTS = {
  CATEGORIES: '/categories',
};

const testCategoryFetch = async () => {
  try {
    console.log('🔍 Testing category fetch from app perspective...\n');
    console.log(`📡 Base URL: ${BASE_URL}`);
    console.log(`📡 API URL: ${API_URL}`);
    console.log(`📡 Full URL: ${API_URL}${ENDPOINTS.CATEGORIES}\n`);

    const response = await axios.get(`${API_URL}${ENDPOINTS.CATEGORIES}`, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Response received!');
    console.log(`📊 Success: ${response.data.success}`);
    console.log(`📊 Total categories: ${response.data.data?.length || 0}\n`);

    if (response.data.data && response.data.data.length > 0) {
      console.log('📋 Sample categories:');
      response.data.data.slice(0, 5).forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name}`);
        console.log(`      - ID: ${cat._id}`);
        console.log(`      - Active: ${cat.active}`);
        console.log(`      - Worker Types: ${cat.workerTypes.join(', ')}`);
      });
      
      console.log('\n✅ Categories are working properly!');
      console.log('   The app should be able to fetch and display them.');
    } else {
      console.log('⚠️  No categories in response!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('   No response received from server');
    }
  }
};

testCategoryFetch();
