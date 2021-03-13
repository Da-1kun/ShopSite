import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';

interface ProductDeleteState extends CommonState {}

const initialState: ProductDeleteState = {
  isLoading: false,
  success: false,
  errorMessage: null,
};

const productDeleteSlice = createSlice({
  name: 'productDelete',
  initialState,
  reducers: {
    productDeleteRequest(state) {
      state.isLoading = true;
    },
    productDeleteSuccess(state) {
      state.isLoading = false;
      state.success = true;
    },
    productDeleteFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  productDeleteRequest,
  productDeleteSuccess,
  productDeleteFail,
} = productDeleteSlice.actions;

export default productDeleteSlice.reducer;

export const deleteProduct = (id: number): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(productDeleteRequest());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    await axios.delete(`/api/products/delete/${id}/`, config);

    dispatch(productDeleteSuccess());
  } catch (error) {
    dispatch(productDeleteFail(getErrorMessage(error)));
  }
};
