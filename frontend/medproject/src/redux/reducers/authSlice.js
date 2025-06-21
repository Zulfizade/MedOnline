import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const res = await axios.post('/api/auth/login', credentials, { withCredentials: true });
    return res.data;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = 'loading'; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      });
  },
});

export default authSlice.reducer;