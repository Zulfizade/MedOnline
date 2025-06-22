import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

export const doctorRegister = createAsyncThunk(
  'doctorRegister/register',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/auth/register/doctor', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Register error");
    }
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
        state.error = action.payload || action.error.message;
        state.success = false;
      });
  },
});

export default doctorRegisterSlice.reducer;