import "./globals.css";
import Script from "next/script";

import WebViewErrorAlert from "@/components/blocks/telegram/WebViewErrorAlert";
import TelegramInit from "@/components/blocks/telegram/TelegramInit";

export default function RootLayout({ children }) {
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
        {children}
        <WebViewErrorAlert />
      </body>
    </html>
  );
}
