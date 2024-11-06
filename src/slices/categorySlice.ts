import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../configs/axios';

interface Category {
  Id: number;
  Name: string;
  Slug: string;
}

interface CategoryState {
  Category: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  Category: [],
  loading: false,
  error: null,
};

export const fetchCategory = createAsyncThunk('Category/fetchCategory', async () => {
  const response = await axiosInstance.get('category');
  return response.data;
});

const CategorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.Category = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Category';
      });
  },
});

export default CategorySlice.reducer;
