const API_BASE_URL = 'http://localhost:8000';

interface ApiResponse {
  text: string;
  videos?: Array<{
    title: string;
    video_id: string;
    channel: string;
  }>;
}

export const sendMessage = async (message: string, model: string = 'gpt-3.5-turbo'): Promise<ApiResponse> => {
  try {
    console.log('Sending request to:', `${API_BASE_URL}/query`);
    console.log('Request body:', { query: message, model });

    // First check if the server is available
    try {
      const healthCheck = await fetch(API_BASE_URL);
      console.log('Server health check status:', healthCheck.status);
    } catch (error) {
      console.error('Server health check failed:', error);
      throw new Error('Cannot connect to the server. Please make sure the backend is running.');
    }

    // Send the actual query
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query: message, model }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Server response data:', data);

    if (!data.text) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from server');
    }

    return data;
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
}; 