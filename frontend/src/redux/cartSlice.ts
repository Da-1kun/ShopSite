import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import django from '../django';
import { AppThunk } from './store';

export interface CartItem {
  _id?: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
  product?: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PriceInfo {
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
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
    cartRemoveItem(state, action: PayloadAction<string | undefined>) {
      state.cartItems = state.cartItems.filter(
        cartItem => cartItem._id !== action.payload
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

export const addToCart = (
  id: string | undefined,
  qty: number
): AppThunk => async (dispatch, getState) => {
  const { data } = await django.get(`/api/products/${id}`);

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
