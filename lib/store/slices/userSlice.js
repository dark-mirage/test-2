import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '@/lib/api';

// Асинхронные действия
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const data = await usersApi.getCurrent();
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

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await usersApi.update(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
      state.error = null;
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchCurrentUser
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        const errorMsg = action.payload || '';
        if (!errorMsg.includes('401') && !errorMsg.includes('403') && 
            !errorMsg.includes('Authentication') && !errorMsg.includes('Access forbidden')) {
          state.error = action.payload;
        }
        state.currentUser = null;
      });

    // updateUser
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUser, setUser } = userSlice.actions;
export default userSlice.reducer;

