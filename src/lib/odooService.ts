import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ODOO_URL;

interface LoginParams {
  db: string;
  login: string;
  password: string;
}

interface LoginResponse {
  uid: number;
  session_id: string;
  company_id: [number, string];
  user_context: Record<string, any>;
  name: string;
  username: string;
  is_system: boolean;
  is_admin: boolean;
  user_id: number;
}

export async function loginToOdoo({ db, login, password }: LoginParams): Promise<LoginResponse> {
  if (!BASE_URL) {
    throw new Error('VITE_ODOO_URL is not defined in your environment variables.');
  }

  const url = `${BASE_URL}/web/session/authenticate`;

  const payload = {
    jsonrpc: '2.0',
    method: 'call',
    params: { db, login, password }
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    if (response.data.error) {
      throw new Error(response.data.error.data.message || 'Authentication failed.');
    }

    return response.data.result;
  } catch (error: any) {
    console.error('Login to Odoo failed:', error);
    throw new Error('Authentication failed: ' + (error.message || 'Unknown error'));
  }
}
