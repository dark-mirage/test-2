import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API route для получения токена авторизации
 * Используется на клиенте, так как httpOnly cookie недоступен в JavaScript
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("tg_session")?.value;
    
    if (!token) {
      return NextResponse.json({ token: null }, { status: 200 });
    }
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Failed to get token:", error);
    return NextResponse.json({ token: null }, { status: 200 });
  }
}

