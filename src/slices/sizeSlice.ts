import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../configs/axios';

interface Size {
  id: number;
  name: string;
}

interface SizeState {
  sizes: Size[];
  loading: boolean;
  error: string | null;
}

const initialState: SizeState = {
  sizes: [],
  loading: false,
  error: null,
};

export const fetchSizes = createAsyncThunk(
  'size/fetchSizes',
  async () => {
    const response = await axiosInstance.get("size");
    return response.data;
  }
);

const sizeSlice = createSlice({
  name: 'size',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSizes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSizes.fulfilled, (state, action) => {
        state.loading = false;
        state.sizes = action.payload;
      })
      .addCase(fetchSizes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sizes';
      });
  },
});

export default sizeSlice.reducer;
