import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface CartItem {
  id: number;
  product_id: number;
  product_variant_id: number;
  color_id: number;
  size_id: number;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const ShoppingCardSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.product_variant_id === action.payload.product_variant_id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalQuantity += action.payload.quantity;
      state.totalPrice += action.payload.price * action.payload.quantity;
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const existingItem = state.items.find(item => item.product_variant_id === action.payload);
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(item => item.product_variant_id !== action.payload);
      }
    },
    updateItem: (state, action: PayloadAction<{ product_variant_id: number; quantity: number }>) => {
      const { product_variant_id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product_variant_id === product_variant_id);
      if (existingItem) {
        state.totalQuantity += quantity - existingItem.quantity;
        state.totalPrice += (quantity - existingItem.quantity) * existingItem.price;
        existingItem.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});


export const { addItem, removeItem, updateItem, clearCart } = ShoppingCardSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectTotalQuantity = (state: { cart: CartState }) => state.cart.totalQuantity;
export const selectTotalPrice = (state: { cart: CartState }) => state.cart.totalPrice;

export default ShoppingCardSlice.reducer;
