"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: {
    id: string;
    name: string;
  };
}

export function useUserAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      // Fetch current user
      fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Not authenticated");
        })
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem("user_token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    localStorage.removeItem("user_token");
    setUser(null);
    window.location.href = "/login";
  };

  return { user, loading, logout, isAuthenticated: !!user };
}

