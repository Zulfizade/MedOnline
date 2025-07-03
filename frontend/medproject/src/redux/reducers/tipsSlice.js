import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export const fetchTips = createAsyncThunk("tips/fetchTips", async () => {
  const res = await axios.get("/api/tips");
  return res.data;
});

export const addTip = createAsyncThunk("tips/addTip", async (form, { rejectWithValue }) => {
  try {
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    if (form.image) data.append("image", form.image);
    await axios.post("/api/tips", data);
    return true;
  } catch {
    return rejectWithValue();
  }
});

export const updateTip = createAsyncThunk("tips/updateTip", async ({ id, form }, { rejectWithValue }) => {
  try {
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    // Only append image if a new one is selected
    if (form.image) {
      data.append("image", form.image);
    } else if (form.keepOldImage && form.oldImage) {
      // Tell backend to keep old image
      data.append("oldImage", form.oldImage);
      data.append("keepOldImage", "true");
    }
    // Use PATCH to match backend
    const res = await axios.patch(`/api/tips/${id}`, data);
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return rejectWithValue({ notFound: true });
    }
    return rejectWithValue();
  }
});

export const deleteTip = createAsyncThunk("tips/deleteTip", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/tips/${id}`);
    return id;
  } catch {
    return rejectWithValue();
  }
});

const tipsSlice = createSlice({
  name: "tips",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTips.pending, state => { state.loading = true; })
      .addCase(fetchTips.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTips.rejected, state => { state.loading = false; state.error = true; })
      .addCase(addTip.pending, state => { state.loading = true; })
      .addCase(addTip.fulfilled, state => { state.loading = false; })
      .addCase(addTip.rejected, state => { state.loading = false; state.error = true; })
      .addCase(updateTip.pending, state => { state.loading = true; })
      .addCase(updateTip.fulfilled, state => { state.loading = false; })
      .addCase(updateTip.rejected, state => { state.loading = false; state.error = true; })
      .addCase(deleteTip.pending, state => { state.loading = true; })
      .addCase(deleteTip.fulfilled, (state, action) => {
        state.items = state.items.filter(tip => tip._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTip.rejected, state => { state.loading = false; state.error = true; });
  }
});

export default tipsSlice.reducer;
