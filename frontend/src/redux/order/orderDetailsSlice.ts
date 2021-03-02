import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { AppThunk } from '../store';
import { CommonState, getErrorMessage } from '../common';
import { OrderInfo } from './orderCreateSlice';

interface OrderDetailsState extends CommonState {
  orderInfo: OrderInfo | null;
}

const initialState: OrderDetailsState = {
  isLoading: false,
  orderInfo: null,
  errorMessage: null,
};

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    orderDetailsRequst(state) {
      state.isLoading = true;
    },
    orderDetailsSuccess(state, action: PayloadAction<OrderInfo>) {
      state.isLoading = false;
      state.orderInfo = action.payload;
    },
    orderDetailsFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  orderDetailsRequst,
  orderDetailsSuccess,
  orderDetailsFail,
} = orderDetailsSlice.actions;

export default orderDetailsSlice.reducer;

export const getOrderDetails = (id: string): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(orderDetailsRequst());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/${id}/`, config);

    dispatch(orderDetailsSuccess(data));
  } catch (error) {
    dispatch(orderDetailsFail(getErrorMessage(error)));
  }
};
