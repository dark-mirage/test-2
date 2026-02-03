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

function isCompactViewport(maxWidth = 448) {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
}

function getTelegramWebApp() {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

function applyThemeColors(tg) {
  const telegramBg = tg?.themeParams?.bg_color ?? "#ffffff";

  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--tg-theme-bg", telegramBg);
  }

  const appBg =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--app-background")
          .trim() || "#f6f5f3"
      : "#f6f5f3";

  const minColorSupport = "6.1";
  const canSetColors =
    typeof tg?.version === "string" &&
    compareSemver(tg.version, minColorSupport) >= 0;

  if (!canSetColors) return;

  try {
    tg.setBackgroundColor(appBg);
    tg.setHeaderColor(appBg);
  } catch {}
}

function requestFullscreenBestEffort(tg) {
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

export default function TelegramInit() {
  useEffect(() => {
    let isCancelled = false;
    let fullscreenRequested = false;

    const attach = (tg) => {
      if (isCancelled) return;

      try {
        tg.ready();
        tg.expand();

        if (isCompactViewport(448) && !fullscreenRequested) {
          requestFullscreenBestEffort(tg);
          fullscreenRequested = true;
        }

        tg.disableVerticalSwipes?.();
      } catch {}

      applyThemeColors(tg);

      const onTheme = () => {
        applyThemeColors(tg);
      };

      tg.onEvent("themeChanged", onTheme);

      const t = window.setTimeout(() => {
        try {
          tg.expand();

          if (isCompactViewport(448) && !fullscreenRequested) {
            requestFullscreenBestEffort(tg);
            fullscreenRequested = true;
          }

          tg.disableVerticalSwipes?.();
        } catch {
          // ignore
        }
      }, 50);

      return () => {
        window.clearTimeout(t);
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
