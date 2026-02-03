import "./globals.css";
import Script from "next/script";
import type { ReactNode } from "react";
import type { Viewport } from "next";

import TelegramInit from "@/components/blocks/telegram/TelegramInit";
import TelegramNavButtons from "@/components/blocks/telegram/TelegramNavButtons";
import WebViewErrorAlert from "@/components/blocks/telegram/WebViewErrorAlert";
import TelegramViewportManager from "./TelegramViewportManager";
import InputFocusFix from "@/components/ios/InputFocusFix";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body suppressHydrationWarning>
        <TelegramInit />
        <TelegramNavButtons />
        <TelegramViewportManager />
        <InputFocusFix />
        {children}
        <WebViewErrorAlert />
      </body>
    </html>
  );
}
