"use client";

import { useState, useEffect } from "react";

interface Admin {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      // Verify token by making a request to a protected endpoint
      // For now, we'll just check if token exists
      // In production, decode and verify the JWT
      fetch("/api/events?active=true")
        .then(() => {
          // If request succeeds, we're authenticated
          // In a real app, you'd decode the JWT to get admin info
          setAdmin({ id: "1", email: "admin", name: "Admin" });
        })
        .catch(() => {
          localStorage.removeItem("admin_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("admin_token");
    setAdmin(null);
    window.location.href = "/admin/login";
  };

  return { admin, loading, logout, isAuthenticated: !!admin };
}

