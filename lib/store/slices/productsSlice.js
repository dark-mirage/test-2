import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '@/lib/api';

// Асинхронные действия
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await productsApi.getAll(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLatestProducts = createAsyncThunk(
  'products/fetchLatest',
  async (limit = 12, { rejectWithValue }) => {
    try {
      const data = await productsApi.getLatest(limit);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await productsApi.getById(productId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Фото и размеры приходят вместе с товаром в getById, отдельные методы не нужны

const initialState = {
  items: [],
  latest: [],
  currentProduct: null,
  currentPhotos: [],
  currentSizes: [],
  loading: false,
  error: null,
  filters: {
    category_id: null,
    type_id: null,
    brand_id: null,
    price_min: null,
    price_max: null,
    skip: 0,
    limit: 20,
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.currentPhotos = [];
      state.currentSizes = [];
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchLatestProducts
    builder
      .addCase(fetchLatestProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.latest = action.payload;
      })
      .addCase(fetchLatestProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        // Фото и размеры приходят вместе с товаром
        state.currentPhotos = action.payload?.photos || [];
        state.currentSizes = action.payload?.sizes || [];
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;

