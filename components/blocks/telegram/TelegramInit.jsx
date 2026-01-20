"use client";

import { useEffect } from "react";

function compareSemver(a, b) {
  const pa = String(a)
    .split(".")
    .map((x) => Number.parseInt(x, 10));
  const pb = String(b)
    .split(".")
    .map((x) => Number.parseInt(x, 10));

  const len = Math.max(pa.length, pb.length);

  for (let i = 0; i < len; i++) {
    const ai = Number.isFinite(pa[i]) ? pa[i] : 0;
    const bi = Number.isFinite(pb[i]) ? pb[i] : 0;
    if (ai !== bi) return ai - bi;
  }

  return 0;
}

function applyThemeColors(tg) {
  // Set CSS variable from Telegram theme params (safe, always ok)
  const telegramBg = tg?.themeParams?.bg_color ?? "#ffffff";

  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--tg-theme-bg", telegramBg);
  }

  // Read app background from CSS variable (fallback to beige)
  const appBg =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--app-background")
          .trim() || "#f6f5f3"
      : "#f6f5f3";

  // ✅ IMPORTANT:
  // Telegram WebApp v6.0 prints warnings if you call setHeaderColor/setBackgroundColor
  // even though the functions exist.
  // So we call them only on versions >= 6.1
  const minColorSupport = "6.1";
  const canSetColors =
    typeof tg?.version === "string" &&
    compareSemver(tg.version, minColorSupport) >= 0;

  if (!canSetColors) return;

  try {
    tg.setBackgroundColor(appBg);
  } catch {
    // ignore
  }

  try {
    tg.setHeaderColor(appBg);
  } catch {
    // ignore
  }
}

function requestFullscreenBestEffort(tg) {
  // Fullscreen is supported only in newer versions
  const minSupported = "7.0";

  if (
    typeof tg?.version === "string" &&
    compareSemver(tg.version, minSupported) < 0
  ) {
    return;
  }

  const request = tg?.requestFullscreen ?? tg?.requestFullScreen;
  if (typeof request !== "function") return;

  try {
    request.call(tg);
  } catch {
    // ignore
  }
}

function getTelegramWebApp() {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export default function TelegramInit() {
  useEffect(() => {
    let isCancelled = false;

    const attach = (tg) => {
      if (isCancelled) return;

      try {
        tg.ready();
        tg.expand();
        requestFullscreenBestEffort(tg);
      } catch {
        // ignore
      }

      applyThemeColors(tg);

      const onTheme = () => {
        applyThemeColors(tg);
      };

      // Viewport CSS vars are handled in a separate component (TelegramViewportManager)
      // to avoid unstable `100vh` layout issues in Telegram.
      tg.onEvent("themeChanged", onTheme);

      window.setTimeout(() => {
        try {
          tg.expand();
          requestFullscreenBestEffort(tg);
        } catch {
          // ignore
        }
      }, 50);

      return () => {
        tg.offEvent("themeChanged", onTheme);
      };
    };

    let cleanup;
    const startedAt = Date.now();

    const tryInit = () => {
      if (isCancelled) return;

      const tg = getTelegramWebApp();
      if (tg) {
        cleanup = attach(tg);
        return;
      }

      // wait up to 2 seconds for Telegram object
      if (Date.now() - startedAt < 2000) {
        requestAnimationFrame(tryInit);
      }
    };

    tryInit();

    return () => {
      isCancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
