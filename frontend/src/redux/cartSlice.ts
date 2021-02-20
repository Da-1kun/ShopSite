import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import django from '../django';
import { AppThunk } from './store';

interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

interface CartState {
  cartItems: CartItem[];
}

const cartItemsFromStorage: CartItem[] = JSON.parse(
  localStorage.getItem('cartItems') || '[]'
);

let initialState: CartState = {
  cartItems: cartItemsFromStorage,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    cartAddItem(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existItem = state.cartItems.find(
        cartItem => cartItem._id === item._id
      );
      if (existItem) {
        state.cartItems = state.cartItems.map(cartItem =>
          cartItem._id === item._id ? item : cartItem
        );
      } else {
        state.cartItems.push(item);
      }
    },
    cartRemoveItem: {
      reducer: (state, action: PayloadAction<string>) => {
        state.cartItems = state.cartItems.filter(
          cartItem => cartItem._id !== action.payload
        );

        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      },
      prepare: (id: string) => {
        return { payload: id };
      },
    },
  },
});

export const { cartAddItem, cartRemoveItem } = cartSlice.actions;

export default cartSlice.reducer;

export const addToCart = (id: string, qty: number): AppThunk => async (
  dispatch,
  getState
) => {
  const { data } = await django.get(`/api/products/${id}`);

  dispatch(
    cartAddItem({
      _id: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    })
  );

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};
