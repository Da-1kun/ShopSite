import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { AppThunk } from '../store';
import { CommonState, getErrorMessage } from '../common';

interface OrderPayState extends CommonState {}

const initialState: OrderPayState = {
  isLoading: false,
  success: false,
  errorMessage: null,
};

const orderPaySlice = createSlice({
  name: 'orderPay',
  initialState,
  reducers: {
    orderPayRequst(state) {
      state.isLoading = true;
    },
    orderPaySuccess(state) {
      state.isLoading = false;
      state.success = true;
    },
    orderPayFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    orderPayReset(state) {
      state.isLoading = false;
      state.success = false;
      state.errorMessage = null;
    },
  },
});

export const {
  orderPayRequst,
  orderPaySuccess,
  orderPayFail,
  orderPayReset,
} = orderPaySlice.actions;

export default orderPaySlice.reducer;

export const payOrder = (id: string, paymentResult: any): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(orderPayRequst());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    await axios.put(`/api/orders/${id}/pay/`, paymentResult, config);

    dispatch(orderPaySuccess());
  } catch (error) {
    dispatch(orderPayFail(getErrorMessage(error)));
  }
};
