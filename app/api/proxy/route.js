import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://loyaltymarket.ru:7890';

/**
 * Прокси для API запросов с авторизацией
 * Используется когда нужно отправить запрос с httpOnly cookie
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { endpoint, method = 'GET', body: requestBody, headers: customHeaders } = body;
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'endpoint is required' },
        { status: 400 }
      );
    }
    
    // Получаем токен из cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("tg_session")?.value;
    
    if (!token) {
      console.warn('Proxy: No auth token found in cookie');
      return NextResponse.json(
        { error: 'No authentication token found. Please login first.' },
        { status: 401 }
      );
    }
    
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    
    // Удаляем Content-Type из customHeaders если он там есть, чтобы не дублировать
    if (customHeaders?.['Content-Type']) {
      delete requestHeaders['Content-Type'];
      requestHeaders['Content-Type'] = customHeaders['Content-Type'];
    }
    
    requestHeaders['Authorization'] = `Bearer ${token}`;
    
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      method,
      headers: requestHeaders,
    };
    
    if (requestBody && method !== 'GET' && method !== 'HEAD') {
      config.body = typeof requestBody === 'string' 
        ? requestBody 
        : JSON.stringify(requestBody);
    }
    
    console.log('Proxy request:', { endpoint, method, hasToken: !!token });
    
    const response = await fetch(url, config);
    
    // Если получили 403, логируем детали
    if (response.status === 403) {
      console.error('Proxy 403 error:', {
        endpoint,
        method,
        url,
        hasToken: !!token,
        tokenLength: token?.length
      });
    }
    
    // Передаем статус и заголовки
    const responseData = await response.text();
    let jsonData = null;
    
    try {
      jsonData = responseData ? JSON.parse(responseData) : null;
    } catch {
      // Не JSON ответ
    }
    
    // Если ошибка, возвращаем её с правильным статусом
    if (!response.ok) {
      return NextResponse.json(
        jsonData || { error: `Request failed: ${response.status}`, data: responseData },
        { status: response.status }
      );
    }
    
    return NextResponse.json(jsonData || { data: responseData }, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy request failed:', error);
    return NextResponse.json(
      { error: error.message || 'Proxy request failed' },
      { status: 500 }
    );
  }
}

