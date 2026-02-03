"use client";

import { useEffect } from "react";

/* ================= Utils ================= */

function compareSemver(a, b) {
  const pa = String(a).split(".").map(Number);
  const pb = String(b).split(".").map(Number);
  const len = Math.max(pa.length, pb.length);

  for (let i = 0; i < len; i++) {
    const ai = pa[i] ?? 0;
    const bi = pb[i] ?? 0;
    if (ai !== bi) return ai - bi;
  }
  return 0;
}

function getTelegramWebApp() {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

function isMobileTelegram(tg) {
  return tg?.platform === "ios" || tg?.platform === "android";
}

/* ================= Theme ================= */

function applyThemeColors(tg) {
  const appBg =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--app-background")
      .trim() || "#f6f5f3";

  if (
    typeof tg?.version === "string" &&
    compareSemver(tg.version, "6.1") >= 0
  ) {
    try {
      tg.setBackgroundColor(appBg);
      tg.setHeaderColor(appBg);
    } catch {}
  }
}

/* ================= Fullscreen ================= */

function requestFullscreenBestEffort(tg) {
  if (
    typeof tg?.version === "string" &&
    compareSemver(tg.version, "7.0") >= 0
  ) {
    const fn = tg.requestFullscreen ?? tg.requestFullScreen;
    fn?.call(tg);
  }
}

/* ================= Component ================= */

export default function TelegramInit() {
  useEffect(() => {
    let cancelled = false;
    let fullscreenDone = false;

    const init = (tg) => {
      if (cancelled) return;

      const isMobile = isMobileTelegram(tg);

      /* 🔥 CSS UCHUN GLOBAL FLAG */
      document.documentElement.style.setProperty(
        "--tg-is-mobile",
        isMobile ? "1" : "0",
      );

      tg.ready();

      // 📱 FAQAT MOBILE’DA
      if (isMobile) {
        tg.expand();

        if (!fullscreenDone) {
          requestFullscreenBestEffort(tg);
          fullscreenDone = true;
        }

        tg.disableVerticalSwipes?.();
      }

      applyThemeColors(tg);
    };

    const start = Date.now();
    const tick = () => {
      if (cancelled) return;
      const tg = getTelegramWebApp();
      if (tg) init(tg);
      else if (Date.now() - start < 2000) requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelled = true;
      document.documentElement.style.removeProperty("--tg-is-mobile");
    };
  }, []);

  return null;
}
