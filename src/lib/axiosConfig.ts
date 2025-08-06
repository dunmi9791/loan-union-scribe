import axios from 'axios';

// Create an axios instance with default configuration
const axiosInstance = axios.create();

// Add a request interceptor to include session ID in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get the session data from localStorage
    const storedSession = localStorage.getItem("user_session");
    
    if (storedSession) {
      try {
        // Parse the stored session data
        const sessionData = JSON.parse(storedSession);
        
        // Check if the session is still valid
        if (sessionData.expiresAt && new Date(sessionData.expiresAt) > new Date()) {
          // Get the session ID from the user data
          const sessionId = sessionData.user?.session_id;
          
          if (sessionId) {
            // Add the session ID to the request headers
            config.headers = config.headers || {};
            config.headers['X-Session-ID'] = sessionId;
            
            // Also set it as a cookie for backends that expect it there
            config.headers['Cookie'] = `session_id=${sessionId}`;
          }
        }
      } catch (error) {
        console.error("Failed to parse stored session data:", error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle API errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if the response body contains an error object
    // This handles cases where the API returns a 200 OK status
    // but the response body contains an error
    if (response.data && response.data.code) {
      // Check for permission error (code 403)
      if (response.data.code === 403) {
        // Create an error object with the error details
        const error = new Error(response.data.msg || 'Permission error');
        error.name = 'PermissionError';
        // Add the response data to the error object
        (error as any).response = response;
        (error as any).data = response.data;
        // Throw the error to be caught by the calling code
        throw error;
      }
      
      // Check for other error codes
      if (response.data.code >= 400) {
        // Create an error object with the error details
        const error = new Error(response.data.msg || 'API error');
        // Add the response data to the error object
        (error as any).response = response;
        (error as any).data = response.data;
        // Throw the error to be caught by the calling code
        throw error;
      }
    }
    
    // If no error, return the response as is
    return response;
  },
  (error) => {
    // Handle network errors or HTTP errors
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default axiosInstance;