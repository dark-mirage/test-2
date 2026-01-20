"use client";

import { useEffect, useRef } from "react";

type LastState = { title: string; pathname: string };

export function useTelegramHeaderTitle(title: string): void {
  const lastRef = useRef<LastState | null>(null);

  useEffect(() => {
    const pathname = window.location.pathname;

    // Avoid redundant calls, but still re-run on every route change.
    const last = lastRef.current;
    if (last && last.title === title && last.pathname === pathname) return;
    lastRef.current = { title, pathname };

    // In a normal browser `window.Telegram` may be missing — guard to prevent crashes.
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    try {
      tg.ready?.();
      tg.setHeaderTitle?.(title);
    } catch {
      // Telegram object can behave differently across environments; ignore safely.
    }
  });
}
