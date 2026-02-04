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
        const errorMsg = err.message || 'Unknown error';
        console.error("Failed to load user:", errorMsg);
        // Если ошибка авторизации - это нормально, пользователь просто не авторизован
        if (errorMsg.includes('401') || errorMsg.includes('403') || 
            errorMsg.includes('Authentication') || errorMsg.includes('Access forbidden')) {
          console.log('User not authenticated');
          setError(null); // Не показываем ошибку
        } else {
          setError(errorMsg);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  return { user, loading, error, userId: user?.id || null };
}

