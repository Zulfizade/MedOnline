import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const res = await axios.get('/api/chat/notifications/all', { withCredentials: true });
    return res.data;
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    clearNotifications(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;