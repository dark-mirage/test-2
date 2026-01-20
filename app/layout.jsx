import "./globals.css";
import Script from "next/script";

import TelegramInit from "@/components/blocks/telegram/TelegramInit";
import WebViewErrorAlert from "@/components/blocks/telegram/WebViewErrorAlert";

export default function RootLayout({ children }) {
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
        {children}
        <WebViewErrorAlert />
      </body>
    </html>
  );
}
