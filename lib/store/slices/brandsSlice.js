import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { brandsApi } from '@/lib/api';

// Асинхронные действия
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const data = await brandsApi.getAll();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchBrands = createAsyncThunk(
  'brands/searchBrands',
  async ({ query, limit = 20, offset = 0 }, { rejectWithValue }) => {
    try {
      const data = await brandsApi.search(query, limit, offset);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBrandById = createAsyncThunk(
  'brands/fetchById',
  async (brandId, { rejectWithValue }) => {
    try {
      const data = await brandsApi.getById(brandId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  searchResults: [],
  currentBrand: null,
  loading: false,
  error: null,
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearCurrentBrand: (state) => {
      state.currentBrand = null;
    },
  },
  extraReducers: (builder) => {
    // fetchBrands
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // searchBrands
    builder
      .addCase(searchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchBrandById
    builder
      .addCase(fetchBrandById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBrand = action.payload;
      })
      .addCase(fetchBrandById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults, clearCurrentBrand } = brandsSlice.actions;
export default brandsSlice.reducer;

