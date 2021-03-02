import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { AppThunk } from '../store';
import { CommonState, getErrorMessage } from '../common';
import { OrderInfo } from './orderCreateSlice';

interface OrderDeliverState extends CommonState {}

const initialState: OrderDeliverState = {
  isLoading: false,
  success: false,
  errorMessage: null,
};

const orderDeliverSlice = createSlice({
  name: 'orderDeliver',
  initialState,
  reducers: {
    orderDeliverRequst(state) {
      state.isLoading = true;
    },
    orderDeliverSuccess(state) {
      state.isLoading = false;
      state.success = true;
    },
    orderDeliverFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    orderDeliverReset(state) {
      state.isLoading = false;
      state.success = false;
      state.errorMessage = null;
    },
  },
});

export const {
  orderDeliverRequst,
  orderDeliverSuccess,
  orderDeliverFail,
  orderDeliverReset,
} = orderDeliverSlice.actions;

export default orderDeliverSlice.reducer;

export const deliverOrder = (order: OrderInfo): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(orderDeliverRequst());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    await axios.put(`/api/orders/${order._id}/deliver/`, {}, config);

    dispatch(orderDeliverSuccess());
  } catch (error) {
    dispatch(orderDeliverFail(getErrorMessage(error)));
  }
};
