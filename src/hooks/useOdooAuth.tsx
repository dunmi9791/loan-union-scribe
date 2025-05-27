import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import odooService from "../lib/odooService";

// Define the shape of the user session
interface OdooSession {
  uid: number;
  name: string;
  session_id: string;
  // Add more fields as needed from the Odoo session result
}

// Define the shape of the auth context
interface OdooAuthContextType {
  user: OdooSession | null;
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Create the auth context with a default value
const OdooAuthContext = createContext<OdooAuthContextType | undefined>(undefined);

// Provider component that wraps the app and makes auth available to all components
export function OdooAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<OdooSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user_session");
    if (stored) {
      try {
        // Parse the stored session data
        const sessionData = JSON.parse(stored);

        // Check if the session data has expired
        if (sessionData.expiresAt && new Date(sessionData.expiresAt) > new Date()) {
          // Session is still valid
          setUser(sessionData.user);
        } else {
          // Session has expired, clean up
          console.log("Session expired, logging out");
          localStorage.removeItem("user_session");
        }
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("user_session");
      }
    }
    setLoading(false);
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
      setLoading(true);
      setError(null);

      const result = await odooService.login(username, password);

      if (result && result.uid) {
        setUser(result);

        // Create session with expiration (24 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        // Store session data with expiration
        localStorage.setItem("user_session", JSON.stringify({
          user: result,
          expiresAt: expiresAt.toISOString()
        }));

        return { success: true };
      } else {
        setError("Login failed: Invalid credentials");
        return { success: false, message: "Login failed: Invalid credentials" };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error?.message || "Authentication failed: Server error";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
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
      setError(null);
      localStorage.removeItem("user_session");
    }
  };

  // Context value
  const value = {
    user,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
  };

  return (
    <OdooAuthContext.Provider value={value}>
      {children}
    </OdooAuthContext.Provider>
  );
}

// Hook to use the auth context
export function useOdooAuth() {
  const context = useContext(OdooAuthContext);

  if (context === undefined) {
    throw new Error("useOdooAuth must be used within an OdooAuthProvider");
  }

  return context;
}
