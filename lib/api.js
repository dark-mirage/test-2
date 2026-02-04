/**
 * API клиент для работы с бекендом
 * Базовый URL: https://loyaltymarket.ru:7890
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://loyaltymarket.ru:7890';

/**
 * Получить токен авторизации (асинхронно)
 * Cookie httpOnly недоступен в JavaScript, поэтому используем API route
 */
async function getAuthTokenAsync() {
  if (typeof window === 'undefined') return null;
  
  try {
    const response = await fetch('/api/auth/token');
    if (response.ok) {
      const data = await response.json();
      return data.token || null;
    }
  } catch (err) {
    console.warn('Failed to get auth token:', err);
  }
  
  return null;
}

/**
 * Базовый fetch с обработкой ошибок
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Добавляем токен авторизации, если нужно
  // Для запросов, требующих авторизации, используем прокси через API route
  const requiresAuth = options.requiresAuth !== false; // по умолчанию true
  
  // Для публичных эндпоинтов не добавляем авторизацию
  if (requiresAuth && typeof window !== 'undefined') {
    try {
      const token = await getAuthTokenAsync();
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      } else {
        // Если токена нет, но требуется авторизация - используем прокси
        // Прокси проверит наличие токена на сервере (может быть httpOnly cookie)
        console.log('No token in client, using proxy for:', endpoint);
        return await apiRequestViaProxy(endpoint, options);
      }
    } catch (err) {
      console.warn('Failed to get auth token, trying proxy:', err);
      // Пробуем через прокси как fallback
      try {
        return await apiRequestViaProxy(endpoint, options);
      } catch (proxyErr) {
        // Если прокси тоже не помог, выбрасываем ошибку
        throw proxyErr;
      }
    }
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Удаляем requiresAuth из options, чтобы не отправлять его в fetch
  delete config.requiresAuth;

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Для 403 ошибки - возможно, нужна авторизация
      if (response.status === 403 && requiresAuth) {
        console.warn('403 Forbidden - пытаемся через прокси для:', endpoint);
        // Пробуем через прокси API route, если это клиентский запрос
        if (typeof window !== 'undefined') {
          try {
            return await apiRequestViaProxy(endpoint, options);
          } catch (proxyErr) {
            console.error('Proxy request also failed:', proxyErr);
            // Если прокси тоже не помог, выбрасываем оригинальную ошибку
            throw new Error(proxyErr.message || `Access forbidden: ${endpoint}`);
          }
        }
      }
      
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      
      const errorMessage = errorData.detail?.[0]?.msg || errorData.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    // Для пустых ответов (204 No Content)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', {
      endpoint,
      error: error.message,
      url
    });
    throw error;
  }
}

/**
 * Запрос через API route прокси (для запросов с авторизацией)
 */
async function apiRequestViaProxy(endpoint, options = {}) {
  if (typeof window === 'undefined') {
    throw new Error('Proxy requests only work on client side');
  }
  
  try {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint,
        method: options.method || 'GET',
        body: options.body,
        headers: options.headers,
      }),
    });
    
    const responseData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      // Если 401 - нет авторизации, это нормально для некоторых случаев
      if (response.status === 401) {
        console.warn('Proxy: No authentication. User may need to login.');
        throw new Error('Authentication required. Please login first.');
      }
      
      // Если 403 - нет доступа
      if (response.status === 403) {
        console.warn('Proxy: Access forbidden. Token may be invalid or expired.');
        throw new Error('Access forbidden. Token may be invalid or expired.');
      }
      
      throw new Error(responseData.error || responseData.message || `Proxy request failed: ${response.status}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('Proxy request error:', {
      endpoint,
      error: error.message
    });
    throw error;
  }
}

/**
 * GET запрос
 */
export async function apiGet(endpoint, requiresAuth = true) {
  return apiRequest(endpoint, { method: 'GET', requiresAuth });
}

/**
 * POST запрос
 */
export async function apiPost(endpoint, data, requiresAuth = true) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    requiresAuth,
  });
}

/**
 * PUT запрос
 */
export async function apiPut(endpoint, data, requiresAuth = true) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    requiresAuth,
  });
}

/**
 * PATCH запрос
 */
export async function apiPatch(endpoint, data, requiresAuth = true) {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
    requiresAuth,
  });
}

/**
 * DELETE запрос
 */
export async function apiDelete(endpoint, requiresAuth = true) {
  return apiRequest(endpoint, { method: 'DELETE', requiresAuth });
}

// ==================== USERS ====================

export const usersApi = {
  init: (initData) => apiPost('/api/v1/users/init/', { init_data: initData }),
  getCurrent: () => apiGet('/api/v1/users'),
};

// ==================== CATEGORIES ====================

export const categoriesApi = {
  getAll: () => apiRequest('/api/v1/categories', { 
    method: 'GET',
    requiresAuth: false 
  }),
  create: (data) => apiPost('/api/v1/categories', data),
  delete: (categoryId) => apiDelete(`/api/v1/categories/${categoryId}`),
};

// ==================== TYPES ====================

export const typesApi = {
  getAll: () => apiRequest('/api/v1/types', { 
    method: 'GET',
    requiresAuth: false 
  }),
  getByCategory: (categoryId) => apiRequest(`/api/v1/types/${categoryId}`, { 
    method: 'GET',
    requiresAuth: false 
  }),
  create: (data) => apiPost('/api/v1/types', data),
  update: (typeId, data) => apiPut(`/api/v1/types/${typeId}`, data),
  delete: (typeId) => apiDelete(`/api/v1/types/${typeId}`),
};

// ==================== BRANDS ====================

export const brandsApi = {
  getAll: () => apiRequest('/api/v1/brands', { 
    method: 'GET',
    requiresAuth: false 
  }),
  search: (query, limit = 20, offset = 0) => {
    const params = new URLSearchParams({ q: query, limit: limit.toString(), offset: offset.toString() });
    return apiRequest(`/api/v1/brands/search?${params}`, { 
      method: 'GET',
      requiresAuth: false 
    });
  },
  getById: (brandId) => apiRequest(`/api/v1/brands/${brandId}`, { 
    method: 'GET',
    requiresAuth: false 
  }),
  create: (data) => {
    // Бренды создаются через multipart/form-data
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    
    return fetch(`${API_BASE_URL}/api/v1/brands`, {
      method: 'POST',
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.detail?.[0]?.msg || error.message || `HTTP ${res.status}`);
      }
      return res.json();
    });
  },
  delete: (brandId) => apiDelete(`/api/v1/brands/${brandId}`),
  getLogo: (fullPath) => `${API_BASE_URL}/api/v1/brands/logo/${fullPath}`,
};

// ==================== PRODUCTS ====================

export const productsApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append('skip', params.skip);
    if (params.limit !== undefined) queryParams.append('limit', params.limit);
    if (params.category_id !== undefined) queryParams.append('category_id', params.category_id);
    if (params.type_id !== undefined) queryParams.append('type_id', params.type_id);
    if (params.brand_id !== undefined) queryParams.append('brand_id', params.brand_id);
    if (params.price_min !== undefined) queryParams.append('price_min', params.price_min);
    if (params.price_max !== undefined) queryParams.append('price_max', params.price_max);
    
    const query = queryParams.toString();
    // Товары - публичный эндпоинт, не требует авторизации
    return apiRequest(`/api/v1/products/${query ? `?${query}` : ''}`, { 
      method: 'GET',
      requiresAuth: false 
    });
  },
  getLatest: (limit = 12) => apiRequest(`/api/v1/products/latest?limit=${limit}`, { 
    method: 'GET',
    requiresAuth: false 
  }),
  getById: (productId) => apiRequest(`/api/v1/products/${productId}`, { 
    method: 'GET',
    requiresAuth: false 
  }),
  create: async (data) => {
    // Товары создаются через multipart/form-data
    // Используем специальный API route для обработки FormData с авторизацией
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('category_id', data.category_id.toString());
    formData.append('type_id', data.type_id.toString());
    formData.append('brand_id', data.brand_id.toString());
    formData.append('delivery', data.delivery);
    
    if (data.parent_product_id) {
      formData.append('parent_product_id', data.parent_product_id.toString());
    }
    if (data.size_type) {
      formData.append('size_type', data.size_type);
    }
    if (data.sizes && Array.isArray(data.sizes)) {
      data.sizes.forEach(size => formData.append('sizes', size));
    }
    if (data.photos && Array.isArray(data.photos)) {
      data.photos.forEach(photo => {
        if (photo instanceof File) {
          formData.append('photos', photo);
        }
      });
    }
    if (data.size_chart instanceof File) {
      formData.append('size_chart', data.size_chart);
    }
    
    // Используем специальный API route для создания товара
    // Он обрабатывает FormData и добавляет авторизацию на сервере
    const response = await fetch('/api/products/create', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail?.[0]?.msg || error.message || error.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  },
  getPhoto: (fullPath) => `${API_BASE_URL}/api/v1/products/get_photo/${fullPath}`,
};

// ==================== FAVORITES ====================

export const favoritesApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.item_type) queryParams.append('item_type', params.item_type);
    if (params.brand_id !== undefined) queryParams.append('brand_id', params.brand_id);
    
    const query = queryParams.toString();
    return apiGet(`/api/v1/favorites${query ? `?${query}` : ''}`);
  },
  add: (data) => apiPost('/api/v1/favorites', data),
  remove: (favoriteId) => apiDelete(`/api/v1/favorites/${favoriteId}`),
};

// ==================== CART ====================

export const cartApi = {
  get: () => apiGet('/api/v1/cart'),
  clear: () => apiDelete('/api/v1/cart'),
  addItem: (data) => apiPost('/api/v1/cart/items', data),
  updateItem: (itemId, data) => apiPatch(`/api/v1/cart/items/${itemId}`, data),
  removeItem: (itemId) => apiDelete(`/api/v1/cart/items/${itemId}`),
};

// ==================== ORDERS ====================

export const ordersApi = {
  getAll: (userId) => apiGet(`/api/v1/orders/?user_id=${userId}`),
  getById: (orderId) => apiGet(`/api/v1/orders/${orderId}`),
  create: (data) => apiPost('/api/v1/orders/', data),
  updateStatus: (orderId, status) => apiPatch(`/api/v1/orders/${orderId}/status`, { status }),
  getStatus: (orderId) => apiGet(`/api/v1/orders/${orderId}/status`),
};

// ==================== PAYMENTS ====================

export const paymentsApi = {
  create: (data) => apiPost('/api/v1/payments', data),
  getById: (paymentId) => apiGet(`/api/v1/payments/${paymentId}`),
  getState: (paymentId) => apiGet(`/api/v1/payments/${paymentId}/state`),
  confirm: (paymentId, data) => apiPost(`/api/v1/payments/${paymentId}/confirm`, data),
  refund: (paymentId, data) => apiPost(`/api/v1/payments/${paymentId}/refund`, data),
  addCard: (data) => apiPost('/api/v1/payments/cards', data),
  getCards: () => apiGet('/api/v1/payments/cards'),
  removeCard: (cardId) => apiDelete(`/api/v1/payments/cards/${cardId}`),
};

// ==================== SHIPMENTS ====================

export const shipmentsApi = {
  create: (orderId, data) => apiPost(`/api/v1/shipments/?order_id=${orderId}`, data),
  getById: (shipmentId, orderId) => apiGet(`/api/v1/shipments/${shipmentId}?order_id=${orderId}`),
  delete: (shipmentId, orderId) => apiDelete(`/api/v1/shipments/${shipmentId}?order_id=${orderId}`),
  getStatus: (shipmentId, orderId) => apiGet(`/api/v1/shipments/${shipmentId}/status?order_id=${orderId}`),
  refreshStatus: (shipmentId, orderId) => apiPost(`/api/v1/shipments/${shipmentId}/status:refresh?order_id=${orderId}`),
  getLabel: (shipmentId, orderId) => `${API_BASE_URL}/api/v1/shipments/${shipmentId}/label.pdf?order_id=${orderId}`,
  getBarcode: (shipmentId, orderId) => `${API_BASE_URL}/api/v1/shipments/${shipmentId}/barcode.pdf?order_id=${orderId}`,
  quote: (orderId, data) => apiPost(`/api/v1/shipments/quote?order_id=${orderId}`, data),
};

// ==================== PVZ (Pickup Points) ====================

export const pvzApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.provider) queryParams.append('provider', params.provider);
    if (params.city) queryParams.append('city', params.city);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return apiGet(`/api/v1/pvz/${query ? `?${query}` : ''}`);
  },
  import: (providers) => {
    const queryParams = new URLSearchParams();
    if (providers) {
      providers.forEach(p => queryParams.append('providers', p));
    }
    return apiPost(`/api/v1/pvz/import?${queryParams.toString()}`);
  },
};

// ==================== REFERRALS ====================

export const referralsApi = {
  getLink: () => apiGet('/api/v1/referrals/link'),
  getInvited: () => apiGet('/api/v1/referrals/invited'),
  getDiscount: () => apiGet('/api/v1/referrals/discount'),
  getStats: () => apiGet('/api/v1/referrals/stats'),
};

// Экспорт базовых функций
export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
  getAuthToken: getAuthTokenAsync,
};

