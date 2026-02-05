import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://loyaltymarket.ru:7890';

/**
 * API route для создания товара с FormData
 * Используется для загрузки товаров с фото через админ-панель
 */
export async function POST(req) {
  try {
    // Получаем FormData из запроса
    const formData = await req.formData();
    
    // Получаем токен из cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("tg_session")?.value;
    
    if (!token) {
      console.warn('Product creation: No auth token found in cookie');
      return NextResponse.json(
        { 
          error: 'No authentication token found. Please login first.',
          message: 'Для создания товаров необходимо войти через Telegram. Пожалуйста, авторизуйтесь и попробуйте снова.'
        },
        { status: 401 }
      );
    }
    
    // Создаем новый FormData для отправки на бекенд
    const backendFormData = new FormData();
    
    // Копируем все поля из исходного FormData
    for (const [key, value] of formData.entries()) {
      if (value instanceof File || value instanceof Blob) {
        // Для файлов используем напрямую
        backendFormData.append(key, value);
      } else {
        backendFormData.append(key, value);
      }
    }
    
    // Отправляем запрос на бекенд
    const response = await fetch(`${API_BASE_URL}/api/v1/products/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Не устанавливаем Content-Type для FormData - браузер сделает это сам
      },
      body: backendFormData,
    });
    
    const responseData = await response.text();
    let jsonData = null;
    
    try {
      jsonData = responseData ? JSON.parse(responseData) : null;
    } catch {
      // Не JSON ответ
    }
    
    if (!response.ok) {
      console.error('Backend error:', {
        status: response.status,
        statusText: response.statusText,
        response: responseData
      });
      
      return NextResponse.json(
        jsonData || { error: `Request failed: ${response.status}`, data: responseData },
        { status: response.status }
      );
    }
    
    return NextResponse.json(jsonData || { data: responseData }, {
      status: response.status,
    });
  } catch (error) {
    console.error('Product creation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

