import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async () => {
    const res = await axios.get('/api/auth/me', { withCredentials: true });
    return res.data;
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
        state.info = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;