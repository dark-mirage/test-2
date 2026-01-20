import "./globals.css";
import Script from "next/script";
import type { ReactNode } from "react";

import TelegramInit from "@/components/blocks/telegram/TelegramInit";
import WebViewErrorAlert from "@/components/blocks/telegram/WebViewErrorAlert";

import TelegramViewportManager from "./TelegramViewportManager";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Telegram WebApp SDK: loaded early for correct initialization */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body suppressHydrationWarning>
        <TelegramInit />
        <TelegramViewportManager />
        {children}
        <WebViewErrorAlert />
      </body>
    </html>
  );
}
