import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

// Async thunk: İstifadəçini gətir
export const fetchUser = createAsyncThunk('user/fetchUser', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get('/api/auth/me');
    return data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "İstifadəçi tapılmadı");
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      Object.assign(state, { info: action.payload, error: null, loading: false });
    },
    clearUser: (state) => {
      Object.assign(state, { info: null, error: null, loading: false });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.info = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.info = null;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
