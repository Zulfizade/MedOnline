import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/auth/me');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "User fetch error");
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { info: null, status: 'idle', error: null },
  reducers: {
    clearUser(state) {
      state.info = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.info = action.payload || null;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
        state.info = null;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;