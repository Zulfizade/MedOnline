import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

export const fetchChat = createAsyncThunk(
  'chat/fetchChat',
  async (withUserId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/chat/messages/${withUserId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Chat fetch error");
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ receiverId, message }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/chat/send', { receiver: receiverId, message });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Send message error");
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [], status: 'idle', error: null },
  reducers: {
    clearChat(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChat.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload || [];
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;