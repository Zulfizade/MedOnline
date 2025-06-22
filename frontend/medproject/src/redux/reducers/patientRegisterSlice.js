import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

export const patientRegister = createAsyncThunk(
  'patientRegister/register',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/auth/register/patient', formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Register error');
    }
  }
);

const patientRegisterSlice = createSlice({
  name: 'patientRegister',
  initialState: { status: 'idle', error: null, success: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(patientRegister.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(patientRegister.fulfilled, (state) => {
        state.status = 'succeeded';
        state.success = true;
        state.error = null;
      })
      .addCase(patientRegister.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
        state.success = false;
      });
  },
});

export default patientRegisterSlice.reducer;