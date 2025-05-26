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

      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Authentication failed');
      }

      if (!response.data.result.uid) {
        throw new Error('Authentication failed');
      }

      this.session = {
        uid: response.data.result.uid,
        username: username,
        sessionId: response.headers['set-cookie']?.[0]?.split(';')[0] || '',
        context: response.data.result.user_context || {},
      };

      return this.session;
    } catch (error) {
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

      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'API call failed');
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
