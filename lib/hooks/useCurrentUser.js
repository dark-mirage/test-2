"use client";

import { useState, useEffect } from "react";
import { usersApi } from "@/lib/api";

/**
 * Хук для получения текущего пользователя
 */
export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError(null);
        const data = await usersApi.getCurrent();
        setUser(data);
      } catch (err) {
        console.error("Failed to load user:", err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  return { user, loading, error, userId: user?.id || null };
}

