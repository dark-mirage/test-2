import "./globals.css";
import Script from "next/script";
import type { ReactNode } from "react";

import WebViewErrorAlert from "@/components/blocks/telegram/WebViewErrorAlert";
import TelegramInit from "@/components/blocks/telegram/TelegramInit";

import TelegramHeaderManager from "./TelegramHeaderManager";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Telegram WebApp SDK - загружается до интерактивности для корректной инициализации */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body suppressHydrationWarning>
        <TelegramInit />
        <TelegramHeaderManager />
        {children}
        <WebViewErrorAlert />
      </body>
    </html>
  );
}
