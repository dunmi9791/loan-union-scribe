import axios from "axios";

// ✅ Hardcoded Odoo configuration
const ODOO_URL = "https://ranchi.secteurnetworks.com";
const ODOO_DB = "ranchi";

/**
 * Logs in to Odoo using provided credentials.
 * @param username The Odoo login/username
 * @param password The Odoo password
 * @returns Odoo session result or throws error
 */
async function login(username: string, password: string) {
  const response = await axios.post(`${ODOO_URL}/web/session/authenticate`, {
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
