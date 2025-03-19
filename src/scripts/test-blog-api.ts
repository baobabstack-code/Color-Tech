import axios from 'axios';

async function testBlogApi() {
  try {
    console.log('Testing blog API...');
    
    // Test GET /api/blog-posts
    const response = await axios.get('http://localhost:3000/api/blog-posts');
    console.log('GET /api/blog-posts response:', response.status);
    console.log('Blog posts:', response.data);
    
    console.log('Blog API test completed successfully!');
  } catch (error) {
    console.error('Error testing blog API:', error);
  }
}

testBlogApi(); 