"use client";

import { useEffect, useState } from "react";

import styles from "./WebViewErrorAlert.module.css";

export default function WebViewErrorAlert() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      setShouldShow(!window.Telegram?.WebApp);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!shouldShow) return null;

  return (
    <div role="alert" className={styles.alert}>
      Telegram WebApp topilmadi. Ilovani Telegram ichida oching.
    </div>
  );
}
