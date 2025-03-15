// Simple script to test the review API endpoints
// For CommonJS, we need to use node-fetch v2
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let userId = '';
let serviceId = '';
let reviewId = '';

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    return { status: 500, data: { message: error.message } };
  }
}

// Test functions
async function login() {
  console.log('\n--- Testing Login ---');
  const result = await apiCall('/users/login', 'POST', {
    email: 'client@example.com',
    password: 'password123'
  });
  
  console.log(`Status: ${result.status}`);
  console.log('Response:', result.data);
  
  if (result.status === 200) {
    authToken = result.data.token;
    userId = result.data.user.id;
    console.log('✅ Login successful');
  } else {
    console.log('❌ Login failed');
  }
}

async function getServices() {
  console.log('\n--- Getting Services ---');
  const result = await apiCall('/services');
  
  console.log(`Status: ${result.status}`);
  console.log('Response (first service):', result.data[0]);
  
  if (result.status === 200 && result.data.length > 0) {
    serviceId = result.data[0].id;
    console.log('✅ Got services');
  } else {
    console.log('❌ Failed to get services');
  }
}

async function getMyReviews() {
  console.log('\n--- Getting My Reviews ---');
  const result = await apiCall('/reviews/my-reviews');
  
  console.log(`Status: ${result.status}`);
  console.log('Response:', result.data);
  
  if (result.status === 200) {
    if (result.data.length > 0) {
      reviewId = result.data[0].id;
      console.log('✅ Got reviews');
    } else {
      console.log('ℹ️ No reviews found');
    }
  } else {
    console.log('❌ Failed to get reviews');
  }
}

async function createReview() {
  if (!serviceId) {
    console.log('❌ Cannot create review without a service ID');
    return;
  }
  
  console.log('\n--- Creating Review ---');
  const result = await apiCall('/reviews', 'POST', {
    serviceId,
    rating: 5,
    comment: 'This is a test review created by the API test script.'
  });
  
  console.log(`Status: ${result.status}`);
  console.log('Response:', result.data);
  
  if (result.status === 201) {
    reviewId = result.data.id;
    console.log('✅ Review created');
  } else {
    console.log('❌ Failed to create review');
  }
}

async function updateReview() {
  if (!reviewId) {
    console.log('❌ Cannot update review without a review ID');
    return;
  }
  
  console.log('\n--- Updating Review ---');
  const result = await apiCall(`/reviews/${reviewId}`, 'PUT', {
    rating: 4,
    comment: 'This is an updated test review.'
  });
  
  console.log(`Status: ${result.status}`);
  console.log('Response:', result.data);
  
  if (result.status === 200) {
    console.log('✅ Review updated');
  } else {
    console.log('❌ Failed to update review');
  }
}

async function deleteReview() {
  if (!reviewId) {
    console.log('❌ Cannot delete review without a review ID');
    return;
  }
  
  console.log('\n--- Deleting Review ---');
  const result = await apiCall(`/reviews/${reviewId}`, 'DELETE');
  
  console.log(`Status: ${result.status}`);
  console.log('Response:', result.data);
  
  if (result.status === 200) {
    console.log('✅ Review deleted');
  } else {
    console.log('❌ Failed to delete review');
  }
}

// Run tests
async function runTests() {
  try {
    await login();
    await getServices();
    await getMyReviews();
    
    // If we don't have any reviews, create one
    if (!reviewId) {
      await createReview();
    }
    
    if (reviewId) {
      await updateReview();
      await deleteReview();
    }
    
    console.log('\n--- All tests completed ---');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

runTests(); 