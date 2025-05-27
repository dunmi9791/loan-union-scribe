import axios from 'axios';

interface OdooConfig {
  baseUrl: string;
  db: string;
}

interface OdooSession {
  uid: number;
  username: string;
  sessionId: string;
  context: any;
}

class OdooService {
  private config: OdooConfig;
  private session: OdooSession | null = null;

  constructor(config: OdooConfig) {
    this.config = config;
  }

  async login(username: string, password: string): Promise<OdooSession> {
    try {
      console.log('Attempting to login with:', { 
        url: `${this.config.baseUrl}/web/session/authenticate`,
        db: this.config.db, 
        username 
      });

      const response = await axios.post(`${this.config.baseUrl}/web/session/authenticate`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: this.config.db,
          login: username,
          password: password,
        },
        id: Math.floor(Math.random() * 1000000000),
      });

      // Log the complete response to see what we're getting
      console.log('Raw Authentication Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: JSON.stringify(response.data, null, 2)
      });

      // Check if we have a valid JSON-RPC response
      if (typeof response.data !== 'object') {
        console.error('Authentication response is not a valid JSON object:', response.data);
        throw new Error('Authentication failed: Server returned an invalid response format');
      }

      // Check if the response contains an error
      if (response.data.error) {
        console.error('Odoo returned an error:', response.data.error);
        // Safely access error message with optional chaining
        const errorMessage = response.data.error.data?.message || 
                            response.data.error.message || 
                            'Authentication failed';
        throw new Error(errorMessage);
      }

      // Check if result exists before trying to access its properties
      if (!response.data.result) {
        console.error('Authentication response missing result. Full response:', response.data);

        // If we have a response but no result and no error, try to handle common cases
        if (response.data.id && typeof response.data.id === 'number') {
          // We have a valid jsonrpc response but no result - this could mean authentication failed silently
          throw new Error('Authentication failed: Server accepted request but returned no user data');
        }

        // Check if the response might be a login page or other HTML content
        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
          throw new Error('Authentication failed: Server returned HTML instead of JSON. Check your server URL and credentials.');
        }

        throw new Error('Authentication failed: Invalid response format. Check server configuration and credentials.');
      }

      if (!response.data.result.uid) {
        console.error('Authentication response missing uid. Result object:', response.data.result);
        throw new Error('Authentication failed: User ID not found');
      }

      // Log successful authentication details
      console.log('Authentication successful:', {
        uid: response.data.result.uid,
        hasContext: !!response.data.result.user_context,
        hasCookie: !!response.headers['set-cookie']
      });

      this.session = {
        uid: response.data.result.uid,
        username: username,
        sessionId: response.headers['set-cookie']?.[0]?.split(';')[0] || '',
        context: response.data.result.user_context || {},
      };

      return this.session;
    } catch (error) {
      // If it's a network error or server error, provide more helpful message
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          console.error('Network error during authentication:', error.message);
          throw new Error(`Authentication failed: Network error - ${error.message}`);
        } else if (error.response.status >= 400) {
          console.error('HTTP error during authentication:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          });
          throw new Error(`Authentication failed: Server returned ${error.response.status} ${error.response.statusText}`);
        }
      }

      console.error('Odoo login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (!this.session) return;

    try {
      await axios.post(`${this.config.baseUrl}/web/session/destroy`, {
        jsonrpc: '2.0',
        method: 'call',
      }, {
        headers: {
          'Cookie': this.session.sessionId,
        }
      });
      this.session = null;
    } catch (error) {
      console.error('Odoo logout error:', error);
      throw error;
    }
  }

  async callKw(model: string, method: string, args: any[] = [], kwargs: any = {}): Promise<any> {
    if (!this.session) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.post(`${this.config.baseUrl}/web/dataset/call_kw`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: model,
          method: method,
          args: args,
          kwargs: kwargs,
        },
        id: Math.floor(Math.random() * 1000000000),
      }, {
        headers: {
          'Cookie': this.session.sessionId,
        }
      });

      // Check if we have a valid JSON-RPC response
      if (typeof response.data !== 'object') {
        console.error('API response is not a valid JSON object:', response.data);
        throw new Error('API call failed: Server returned an invalid response format');
      }

      if (response.data.error) {
        // Safely access error message with optional chaining
        const errorMessage = response.data.error.data?.message || 
                            response.data.error.message || 
                            'API call failed';
        throw new Error(errorMessage);
      }

      // Check if result exists before trying to access it
      if (!response.data.result) {
        console.error('API response missing result. Full response:', response.data);
        throw new Error('API call failed: Server returned no result');
      }

      return response.data.result;
    } catch (error) {
      console.error('Odoo API call error:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return this.session !== null;
  }

  getSession(): OdooSession | null {
    return this.session;
  }
}

// Get environment variables from window.ENV if available, otherwise use import.meta.env
const getEnv = (key: string, defaultValue: string): string => {
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  return import.meta.env[key] || defaultValue;
};

// Create and export a singleton instance
export const odooService = new OdooService({
  baseUrl: getEnv('VITE_ODOO_URL', 'https://your-odoo-instance.com'),
  db: getEnv('VITE_ODOO_DB', 'your-database-name'),
});

export default OdooService;
