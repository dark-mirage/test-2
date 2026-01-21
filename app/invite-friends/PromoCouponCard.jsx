"use client";

import { useCallback, useState } from "react";

import styles from "./page.module.css";

export default function PromoCouponCard({ percent, until, description, copyValue }) {
  const [copied, setCopied] = useState(false);

  const doCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Ignore – clipboard may be blocked in some environments.
    }
  }, [copyValue]);

  return (
    <section className={styles.promoCard} aria-label="Промокод">
      <div className={styles.promoHeader}>
        <div className={styles.promoPercent}>{percent}%</div>
        <div className={styles.promoUntil}>{until}</div>
      </div>

      <p className={styles.promoDescription}>{description}</p>

      <button
        type="button"
        className={styles.promoCopyButton}
        onClick={doCopy}
        aria-label="Скопировать промокод"
      >
        {copied ? "Скопировано" : "Скопировать"}
      </button>
    </section>
  );
}
