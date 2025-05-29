import axios from "axios";

// Get environment variables with fallbacks
const getEnv = (key: string, fallback: string): string => {
  // Try to get from window.ENV (for production builds)
  if (window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }

  // Try to get from import.meta.env (for development)
  // @ts-ignore - Vite specific
  if (import.meta.env && import.meta.env[key]) {
    // @ts-ignore - Vite specific
    return import.meta.env[key];
  }

  // Fallback value
  return fallback;
};

// Get Odoo configuration from environment variables
const ODOO_URL =  "/web";
const ODOO_DB = "ranchi";

/**
 * Logs in to Odoo using provided credentials.
 * @param username The Odoo login/username
 * @param password The Odoo password
 * @returns Odoo session result or throws error
 */
async function login(username: string, password: string) {
  const response = await axios.post(`${ODOO_URL}/session/authenticate`, {
    jsonrpc: "2.0",
    method: "call",
    params: {
      db: ODOO_DB,
      login: username,
      password,
    },
  });

  return response.data.result; // contains uid, name, session_id etc.
}

/**
 * Logs out from Odoo (optional based on frontend state)
 */
async function logout() {
  await axios.post(`${ODOO_URL}/web/session/destroy`, {
    jsonrpc: "2.0",
    method: "call",
    params: {},
  });
}

const odooService = {
  login,
  logout,
};

export default odooService;
