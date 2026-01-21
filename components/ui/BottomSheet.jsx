"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./BottomSheet.module.css";

const ANIMATION_MS = 240;
const UNMOUNT_DELAY_MS = ANIMATION_MS + 30;

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  maxHeightOffset = 24,
}) {
  const [mounted, setMounted] = useState(open);
  const [active, setActive] = useState(false);
  const titleId = useId();
  const closeBtnRef = useRef(null);

  useEffect(() => {
    let frame1 = 0;
    let frame2 = 0;
    let timer;

    if (open) {
      // Mount first (closed), then flip to active next frame so CSS transition runs.
      frame1 = requestAnimationFrame(() => {
        setMounted(true);
        setActive(false);
        frame2 = requestAnimationFrame(() => setActive(true));
      });
    } else {
      // Start exit animation, then unmount after transition.
      frame1 = requestAnimationFrame(() => setActive(false));
      timer = setTimeout(() => setMounted(false), UNMOUNT_DELAY_MS);
    }

    return () => {
      if (frame1) cancelAnimationFrame(frame1);
      if (frame2) cancelAnimationFrame(frame2);
      if (timer) clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    if (open) closeBtnRef.current?.focus?.();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, onClose, open]);

  if (!mounted) return null;

  const sheet = (
    <div
      className={styles.root}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        className={`${styles.backdrop} ${active ? styles.backdropOpen : styles.backdropClosed}`}
        onClick={onClose}
      />

      <div
        className={`${styles.sheetWrap} ${active ? styles.sheetOpen : styles.sheetClosed}`}
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
