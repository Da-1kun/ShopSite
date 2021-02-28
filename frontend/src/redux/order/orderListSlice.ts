import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import django from '../../django';
import { AppThunk } from '../store';
import { CommonState, getErrorMessage } from '../common';
import { OrderInfo } from './orderCreateSlice';

interface OrderListState extends CommonState {
  orders: OrderInfo[];
}

const initialState: OrderListState = {
  isLoading: false,
  orders: [],
  errorMessage: null,
};

const orderListSlice = createSlice({
  name: 'orderList',
  initialState,
  reducers: {
    orderListRequst(state) {
      state.isLoading = true;
    },
    orderListSuccess(state, action: PayloadAction<OrderInfo[]>) {
      state.isLoading = false;
      state.orders = action.payload;
    },
    orderListFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  orderListRequst,
  orderListSuccess,
  orderListFail,
} = orderListSlice.actions;

export default orderListSlice.reducer;

export const listOrders = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(orderListRequst());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    const { data } = await django.get(`/api/orders/`, config);

    dispatch(orderListSuccess(data));
  } catch (error) {
    dispatch(orderListFail(getErrorMessage(error)));
  }
};
