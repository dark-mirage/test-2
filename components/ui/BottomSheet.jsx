"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./BottomSheet.module.css";

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  maxHeightOffset = 24,
}) {
  const [visible, setVisible] = useState(open);
  const titleId = useId();
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const timer = setTimeout(() => setVisible(false), 250);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    closeBtnRef.current?.focus?.();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!visible) return null;

  const sheet = (
    <div
      className={styles.root}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : styles.backdropClosed}`}
        onClick={onClose}
      />

      <div
        className={`${styles.sheetWrap} ${open ? styles.sheetOpen : styles.sheetClosed}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.sheet}
          style={{
            maxHeight: `calc(var(--tg-viewport-stable-height, 100vh) - ${maxHeightOffset}px)`,
          }}
        >
          <div className={styles.grabber} aria-hidden="true" />

          <header className={styles.header}>
            {title ? (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            ) : (
              <div />
            )}

            <button
              ref={closeBtnRef}
              type="button"
              aria-label="Закрыть"
              onClick={onClose}
              className={styles.closeBtn}
            >
              <span className={styles.closeIcon} aria-hidden="true">
                ×
              </span>
            </button>
          </header>

          <div className={styles.body}>{children}</div>

          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </div>
      </div>
    </div>
  );

  return createPortal(sheet, document.body);
}
