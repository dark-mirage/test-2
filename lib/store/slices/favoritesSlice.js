import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesApi } from '@/lib/api';

// Асинхронные действия
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const data = await favoritesApi.getAll();
      return data;
    } catch (error) {
      // Если ошибка авторизации - возвращаем пустой массив
      const errorMsg = error.message || '';
      if (errorMsg.includes('401') || errorMsg.includes('403') || 
          errorMsg.includes('Authentication') || errorMsg.includes('Access forbidden')) {
        return { brands: [], products: [] };
      }
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFavoriteBrands = createAsyncThunk(
  'favorites/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const data = await favoritesApi.getBrands();
      return data;
    } catch (error) {
      const errorMsg = error.message || '';
      if (errorMsg.includes('401') || errorMsg.includes('403') || 
          errorMsg.includes('Authentication') || errorMsg.includes('Access forbidden')) {
        return [];
      }
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFavoriteProducts = createAsyncThunk(
  'favorites/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await favoritesApi.getProducts();
      return data;
    } catch (error) {
      const errorMsg = error.message || '';
      if (errorMsg.includes('401') || errorMsg.includes('403') || 
          errorMsg.includes('Authentication') || errorMsg.includes('Access forbidden')) {
        return [];
      }
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFavoriteProduct = createAsyncThunk(
  'favorites/toggleProduct',
  async (productId, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const isFavorite = state.favorites.products.some(p => p.product_id === productId);
      
      if (isFavorite) {
        await favoritesApi.removeProduct(productId);
      } else {
        await favoritesApi.addProduct(productId);
      }
      
      // Обновляем список избранного
      dispatch(fetchFavoriteProducts());
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFavoriteBrand = createAsyncThunk(
  'favorites/toggleBrand',
  async (brandId, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const isFavorite = state.favorites.brands.some(b => b.brand_id === brandId);
      
      if (isFavorite) {
        await favoritesApi.removeBrand(brandId);
      } else {
        await favoritesApi.addBrand(brandId);
      }
      
      // Обновляем список избранного
      dispatch(fetchFavoriteBrands());
      return brandId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  brands: [],
  products: [],
  favoriteProductIds: [], // Массив вместо Set для сериализации
  favoriteBrandIds: [], // Массив вместо Set для сериализации
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavoriteProductIds: (state, action) => {
      state.favoriteProductIds = Array.isArray(action.payload) 
        ? action.payload 
        : Array.from(action.payload || []);
    },
    setFavoriteBrandIds: (state, action) => {
      state.favoriteBrandIds = Array.isArray(action.payload) 
        ? action.payload 
        : Array.from(action.payload || []);
    },
  },
  extraReducers: (builder) => {
    // fetchFavorites
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands || [];
        state.products = action.payload.products || [];
        state.favoriteProductIds = (action.payload.products || [])
          .map(p => p.product_id)
          .filter(Boolean);
        state.favoriteBrandIds = (action.payload.brands || [])
          .map(b => b.brand_id)
          .filter(Boolean);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        const errorMsg = action.payload || '';
        if (!errorMsg.includes('401') && !errorMsg.includes('403') && 
            !errorMsg.includes('Authentication') && !errorMsg.includes('Access forbidden')) {
          state.error = action.payload;
        }
        state.brands = [];
        state.products = [];
        state.favoriteProductIds = [];
        state.favoriteBrandIds = [];
      });

    // fetchFavoriteBrands
    builder
      .addCase(fetchFavoriteBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
        state.favoriteBrandIds = action.payload
          .map(b => b.brand_id)
          .filter(Boolean);
      });

    // fetchFavoriteProducts
    builder
      .addCase(fetchFavoriteProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.favoriteProductIds = action.payload
          .map(p => p.product_id)
          .filter(Boolean);
      });

    // toggleFavoriteProduct
    builder
      .addCase(toggleFavoriteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavoriteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleFavoriteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // toggleFavoriteBrand
    builder
      .addCase(toggleFavoriteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavoriteBrand.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleFavoriteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFavoriteProductIds, setFavoriteBrandIds } = favoritesSlice.actions;
export default favoritesSlice.reducer;

