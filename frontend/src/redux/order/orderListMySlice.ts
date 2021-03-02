import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { AppThunk } from '../store';
import { CommonState, getErrorMessage } from '../common';
import { OrderInfo } from './orderCreateSlice';

interface OrderListMyState extends CommonState {
  orders: OrderInfo[];
}

const initialState: OrderListMyState = {
  isLoading: false,
  orders: [],
  errorMessage: null,
};

const orderListMySlice = createSlice({
  name: 'orderListMy',
  initialState,
  reducers: {
    orderListMyRequst(state) {
      state.isLoading = true;
    },
    orderListMySuccess(state, action: PayloadAction<OrderInfo[]>) {
      state.isLoading = false;
      state.orders = action.payload;
    },
    orderListMyFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    orderListMyReset(state) {
      state.isLoading = false;
      state.orders = [];
      state.errorMessage = null;
    },
  },
});

export const {
  orderListMyRequst,
  orderListMySuccess,
  orderListMyFail,
  orderListMyReset,
} = orderListMySlice.actions;

export default orderListMySlice.reducer;

export const listMyOrders = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(orderListMyRequst());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/myorders/`, config);

    dispatch(orderListMySuccess(data));
  } catch (error) {
    dispatch(orderListMyFail(getErrorMessage(error)));
  }
};
