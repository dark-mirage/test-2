import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '@/lib/api';

// Асинхронные действия
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartApi.get();
      return data;
    } catch (error) {
      // Если ошибка авторизации - возвращаем null (пользователь не авторизован)
      const errorMsg = error.message || '';
      if (errorMsg.includes('401') || errorMsg.includes('403') || 
          errorMsg.includes('Authentication') || errorMsg.includes('Access forbidden')) {
        return null;
      }
      return rejectWithValue(error.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async ({ product_id, size, quantity = 1 }, { rejectWithValue, dispatch }) => {
    try {
      const data = await cartApi.addItem({ product_id, size, quantity });
      // Обновляем корзину после добавления
      dispatch(fetchCart());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ item_id, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const data = await cartApi.updateItem(item_id, { quantity });
      // Обновляем корзину после обновления
      dispatch(fetchCart());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (item_id, { rejectWithValue, dispatch }) => {
    try {
      await cartApi.removeItem(item_id);
      // Обновляем корзину после удаления
      dispatch(fetchCart());
      return item_id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await cartApi.clear();
      // Обновляем корзину после очистки
      dispatch(fetchCart());
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  ready: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.ready = true;
        if (action.payload) {
          state.items = action.payload.items || [];
          state.total = action.payload.total || 0;
        } else {
          // Пользователь не авторизован
          state.items = [];
          state.total = 0;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.ready = true;
        // Если ошибка авторизации - не показываем ошибку
        const errorMsg = action.payload || '';
        if (!errorMsg.includes('401') && !errorMsg.includes('403') && 
            !errorMsg.includes('Authentication') && !errorMsg.includes('Access forbidden')) {
          state.error = action.payload;
        }
        state.items = [];
        state.total = 0;
      });

    // addItemToCart
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateCartItem
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // removeCartItem
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // clearCart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;

