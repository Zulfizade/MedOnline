import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const doctorRegister = createAsyncThunk(
  'doctorRegister/register',
  async (formData) => {
    const res = await axios.post('/api/auth/register/doctor', formData, { withCredentials: true });
    return res.data;
  }
);

const doctorRegisterSlice = createSlice({
  name: 'doctorRegister',
  initialState: { status: 'idle', error: null, success: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(doctorRegister.pending, (state) => { state.status = 'loading'; })
      .addCase(doctorRegister.fulfilled, (state) => {
        state.status = 'succeeded';
        state.success = true;
        state.error = null;
      })
      .addCase(doctorRegister.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.success = false;
      });
  },
});

export default doctorRegisterSlice.reducer;