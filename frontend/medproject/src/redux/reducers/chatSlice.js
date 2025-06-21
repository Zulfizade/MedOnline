import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChat = createAsyncThunk(
  'chat/fetchChat',
  async (withUserId) => {
    const res = await axios.get(`/api/chat/messages/${withUserId}`, { withCredentials: true });
    return res.data;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ receiverId, message }) => {
    const res = await axios.post('/api/chat/send', { receiver: receiverId, message }, { withCredentials: true });
    return res.data;
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
        state.messages = action.payload;
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;