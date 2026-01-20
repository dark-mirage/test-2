"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { useTelegramHeaderTitle } from "@/hooks/useTelegramHeaderTitle";

const STATIC_TITLES: Record<string, string> = {
  "/": "Главная",
  "/catalog": "Каталог",
  "/favorites": "Избранное",
  "/cart": "Корзина",
  "/profile": "Профиль",
  "/search": "Поиск",
};

function normalizePathname(pathname: string): string {
  if (!pathname) return "/";
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

function mapPathnameToTitle(pathname: string): string {
  const path = normalizePathname(pathname);

  const staticTitle = STATIC_TITLES[path];
  if (staticTitle) return staticTitle;

  if (path.startsWith("/product/")) return "Товар";
  if (path.startsWith("/brand/")) return "Бренд";

  return "LOYALTY";
}

export default function TelegramHeaderManager(): null {
  const pathname = usePathname() ?? "/";

  const title = useMemo(() => mapPathnameToTitle(pathname), [pathname]);

  useTelegramHeaderTitle(title);

  return null;
}
