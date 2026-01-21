"use client";

import { useCallback, useMemo, useState } from "react";
import { Check } from "lucide-react";

import styles from "./page.module.css";

export default function InviteLinkActions({ url }) {
  const [copied, setCopied] = useState(false);

  const shareText = useMemo(() => `Присоединяйся к LOYALTY: ${url}`, [url]);

  const doCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Ignore – clipboard may be blocked in some environments.
    }
  }, [url]);

  const onShare = useCallback(async () => {
    // Prefer native share where available; fallback to copy.
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ text: shareText, url });
        return;
      }
    } catch {
      // ignore
    }

    // Telegram WebApp may provide its own APIs; we still keep this safe in browsers.
    const tg = window.Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      try {
        tg.openTelegramLink(url);
        return;
      } catch {
        // ignore
      }
    }

    await doCopy();
  }, [doCopy, shareText, url]);

  return (
    <div className={styles.actions}>
      <div className={styles.linkRow}>
        <input
          type="text"
          aria-label="Ссылка для приглашения"
          value={url}
          readOnly
          className={styles.linkInput}
        />

        <button
          type="button"
          className={`${styles.copyButton} ${copied ? styles.copyButtonCopied : ""}`}
          aria-label={copied ? "Скопировано" : "Скопировать ссылку"}
          onClick={doCopy}
          disabled={copied}
        >
          {copied ? (
            <Check className={styles.copyIcon} aria-hidden="true" />
          ) : (
            <img
              src="/icons/invite-friends/copy.svg"
              alt=""
              className={styles.copyIcon}
            />
          )}
        </button>
      </div>

      <button
        type="button"
        className={styles.shareButton}
        aria-label="Поделиться ссылкой"
        onClick={onShare}
      >
        Поделиться
      </button>

      <div className={styles.hint} aria-live="polite">
        {copied ? "Ссылка скопирована" : ""}
      </div>
    </div>
  );
}
