import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import django from '../../django';
import { AppThunk } from '../store';
import { CommonState, getErrorMessage } from '../common';
import {
  CartItem,
  ShippingAddress,
  PriceInfo,
  cartClearItems,
} from '../cartSlice';
import { User } from '../user/userDetailsSlice';

interface Order {
  paymentMethod: string;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string | null;
  createdAt: string;
  _id: string;
}

interface OrderInfo extends Order {
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  user: User;
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

interface CreateOrderInfo extends PriceInfo {
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string | null;
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
        Authorization: `Bearer ${userInfo?.token}`,
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
