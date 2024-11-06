import {configureStore} from '@reduxjs/toolkit';
import shoppingCardSlice from '../slices/shoppingCardSlice';
import sizeSlice from '../slices/sizeSlice';
import colorSlice from '../slices/colorSlice';
import CategorySlice from '../slices/categorySlice';

const store = configureStore({
  reducer: {
    shoppingCard: shoppingCardSlice,
    size: sizeSlice,
    color: colorSlice,
    category: CategorySlice,
  },
});

export default store;
