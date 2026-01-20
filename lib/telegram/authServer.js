import "server-only";

import crypto from "node:crypto";

function base64UrlEncode(buf) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlEncodeJson(value) {
  return base64UrlEncode(Buffer.from(JSON.stringify(value), "utf8"));
}

export function signHs256Jwt(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncodeJson(header);
  const encodedPayload = base64UrlEncodeJson(payload);
  const data = `${encodedHeader}.${encodedPayload}`;
  const sig = crypto.createHmac("sha256", secret).update(data).digest();
  return `${data}.${base64UrlEncode(sig)}`;
}

export function parseTelegramInitData(initData) {
  const params = Object.fromEntries(new URLSearchParams(initData).entries());
  const userRaw = params.user;
  let user = null;
  if (typeof userRaw === "string") {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  const authDateRaw = params.auth_date;
  const authDate = typeof authDateRaw === "string" ? Number(authDateRaw) : null;

  return {
    params,
    user,
    authDate:
      typeof authDate === "number" && Number.isFinite(authDate)
        ? authDate
        : null,
  };
}

export function validateTelegramInitDataOrThrow({
  initData,
  botToken,
  maxAgeSeconds = 300,
}) {
  if (!initData || typeof initData !== "string") {
    throw new Error("Missing initData");
  }
  if (!botToken) {
    throw new Error("Missing bot token");
  }

  const parsed = parseTelegramInitData(initData);
  const hash = parsed.params.hash;

  if (!hash) {
    throw new Error("Missing initData hash");
  }

  if (parsed.authDate) {
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parsed.authDate) > maxAgeSeconds) {
      throw new Error("initData is too old");
    }
  }

  const checkPairs = [];
  for (const [k, v] of Object.entries(parsed.params)) {
    if (k === "hash") continue;
    checkPairs.push(`${k}=${v}`);
  }
  checkPairs.sort((a, b) => a.localeCompare(b));
  const dataCheckString = checkPairs.join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const expectedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const a = Buffer.from(expectedHash, "utf8");
  const b = Buffer.from(hash, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error("Invalid initData signature");
  }

  return parsed;
}

export function randomHandoffCode() {
  return base64UrlEncode(crypto.randomBytes(32));
}
