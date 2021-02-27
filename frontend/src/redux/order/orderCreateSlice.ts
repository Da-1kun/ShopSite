import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import django from '../../django';
import { AppThunk } from '../store';
import { CommonState, getErrorMessage } from '../common';
import { ShippingAddress, cartClearItems } from '../cartSlice';
import { User } from '../user/userDetailsSlice';

interface Order {
  user: User;
  paymentMethod: string;
  taxPrice: string;
  shippingPrice: string;
  totalPrice: string;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string | null;
  createdAt: string;
  _id: number;
}

export interface OrderItem {
  product: number;
  order?: number;
  name: string;
  qty: number;
  price: string;
  image: string;
  _id?: number;
}

export interface OrderInfo extends Order {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
}

interface OrderCreateState extends CommonState {
  success: boolean;
  orderInfo: Partial<OrderInfo>;
}

const initialState: OrderCreateState = {
  isLoading: false,
  success: false,
  orderInfo: {},
  errorMessage: null,
};

const orderCreateSlice = createSlice({
  name: 'orderCreate',
  initialState,
  reducers: {
    orderCreateRequst(state) {
      state.isLoading = true;
    },
    orderCreateSuccess(state, action: PayloadAction<OrderInfo>) {
      state.isLoading = false;
      state.success = true;
      state.orderInfo = action.payload;
    },
    orderCreateFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    orderCreateReset(state) {
      state.isLoading = false;
      state.success = false;
      state.orderInfo = {};
      state.errorMessage = null;
    },
  },
});

export const {
  orderCreateRequst,
  orderCreateSuccess,
  orderCreateFail,
  orderCreateReset,
} = orderCreateSlice.actions;

export default orderCreateSlice.reducer;

interface CreateOrderInfo {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string | null;
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
}

export const createOrder = (order: CreateOrderInfo): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(orderCreateRequst());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await django.post(`/api/orders/add/`, order, config);

    dispatch(orderCreateSuccess(data));

    dispatch(cartClearItems());

    localStorage.removeItem('cartItems');
  } catch (error) {
    dispatch(orderCreateFail(getErrorMessage(error)));
  }
};
