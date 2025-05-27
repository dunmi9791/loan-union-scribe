import { useEffect, useState } from "react";
import odooService from "../lib/odooService";

// Define the shape of the user session
interface OdooSession {
  uid: number;
  name: string;
  session_id: string;
  // Add more fields as needed from the Odoo session result
}

export function useOdooAuth() {
  const [user, setUser] = useState<OdooSession | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Login handler
  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const result = await odooService.login(username, password);
      if (result && result.uid) {
        setUser(result);
        localStorage.setItem("user", JSON.stringify(result));
        return { success: true };
      } else {
        return { success: false, message: "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Error occurred" };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await odooService.logout();
    } catch (e) {
      console.warn("Remote logout failed, clearing local session");
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return {
    user,
    login,
    logout,
  };
}
