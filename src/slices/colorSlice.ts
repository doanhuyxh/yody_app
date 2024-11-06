import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../configs/axios';

interface Color {
  id: number;
  name: string;
  hex_code:string
}

interface ColorState {
  Colors: Color[];
  loading: boolean;
  error: string | null;
}

const initialState: ColorState = {
  Colors: [],
  loading: false,
  error: null,
};

export const fetchColors = createAsyncThunk(
  'Color/fetchColors',
  async () => {
    const response = await axiosInstance.get("color");
    return response.data;
  }
);

const ColorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchColors.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.loading = false;
        state.Colors = action.payload;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Colors';
      });
  },
});

export default ColorSlice.reducer;
