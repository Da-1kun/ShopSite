import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { OrderItem } from './order/orderCreateSlice';
import { AppThunk } from './store';

interface CartItem extends OrderItem {
  countInStock: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CartState {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string | null;
}

const cartItemsFromStorage: CartItem[] = JSON.parse(
  localStorage.getItem('cartItems') || '[]'
);

const shippingAddressFromStorage: ShippingAddress = JSON.parse(
  localStorage.getItem('shippingAddress') || '{}'
);

const initialState: CartState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    cartAddItem(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existItem = state.cartItems.find(
        cartItem => cartItem.product === item.product
      );

      if (existItem) {
        state.cartItems = state.cartItems.map(cartItem =>
          cartItem.product === item.product ? item : cartItem
        );
      } else {
        state.cartItems.push(item);
      }
    },
    cartRemoveItem(state, action: PayloadAction<number>) {
      state.cartItems = state.cartItems.filter(
        cartItem => cartItem.product !== action.payload
      );

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    cartSaveShippingAddress(state, action: PayloadAction<ShippingAddress>) {
      state.shippingAddress = action.payload;
    },
    cartSavePaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethod = action.payload;
    },
    cartClearItems(state) {
      state.cartItems = [];
      state.paymentMethod = null;
    },
  },
});

export const {
  cartAddItem,
  cartRemoveItem,
  cartSaveShippingAddress,
  cartSavePaymentMethod,
  cartClearItems,
} = cartSlice.actions;

export default cartSlice.reducer;

export const addToCart = (id: number, qty: number): AppThunk => async (
  dispatch,
  getState
) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch(
    cartAddItem({
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    })
  );

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};
