/**
 * API клиент для работы с бекендом
 * Базовый URL: https://loyaltymarket.ru:7890
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://loyaltymarket.ru:7890';

/**
 * Получить токен авторизации из cookie
 */
function getAuthToken() {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'tg_session') {
      return value;
    }
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

  // Добавляем токен авторизации, если есть
  const token = getAuthToken();
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      throw new Error(errorData.detail?.[0]?.msg || errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Для пустых ответов (204 No Content)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * GET запрос
 */
export async function apiGet(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

/**
 * POST запрос
 */
export async function apiPost(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT запрос
 */
export async function apiPut(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH запрос
 */
export async function apiPatch(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE запрос
 */
export async function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

// ==================== USERS ====================

export const usersApi = {
  init: (initData) => apiPost('/api/v1/users/init/', { init_data: initData }),
  getCurrent: () => apiGet('/api/v1/users'),
};

// ==================== CATEGORIES ====================

export const categoriesApi = {
  getAll: () => apiGet('/api/v1/categories'),
  create: (data) => apiPost('/api/v1/categories', data),
  delete: (categoryId) => apiDelete(`/api/v1/categories/${categoryId}`),
};

// ==================== TYPES ====================

export const typesApi = {
  getAll: () => apiGet('/api/v1/types'),
  getByCategory: (categoryId) => apiGet(`/api/v1/types/${categoryId}`),
  create: (data) => apiPost('/api/v1/types', data),
  update: (typeId, data) => apiPut(`/api/v1/types/${typeId}`, data),
  delete: (typeId) => apiDelete(`/api/v1/types/${typeId}`),
};

// ==================== BRANDS ====================

export const brandsApi = {
  getAll: () => apiGet('/api/v1/brands'),
  search: (query, limit = 20, offset = 0) => {
    const params = new URLSearchParams({ q: query, limit: limit.toString(), offset: offset.toString() });
    return apiGet(`/api/v1/brands/search?${params}`);
  },
  getById: (brandId) => apiGet(`/api/v1/brands/${brandId}`),
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
    return apiGet(`/api/v1/products/${query ? `?${query}` : ''}`);
  },
  getLatest: (limit = 12) => apiGet(`/api/v1/products/latest?limit=${limit}`),
  getById: (productId) => apiGet(`/api/v1/products/${productId}`),
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
  getAuthToken,
};

