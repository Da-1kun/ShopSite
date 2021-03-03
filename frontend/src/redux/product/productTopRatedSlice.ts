import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import Product from '../../components/Product';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';

interface ProductTopRatedState extends CommonState {
  products: Product[];
}

const initialState: ProductTopRatedState = {
  isLoading: false,
  products: [],
  errorMessage: null,
};

const productTopRatedSlice = createSlice({
  name: 'productTopRated',
  initialState,
  reducers: {
    productTopRatedRequest(state) {
      state.isLoading = true;
    },
    productTopRatedSuccess(state, action: PayloadAction<Product[]>) {
      state.isLoading = false;
      state.products = action.payload;
    },
    productTopRatedFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  productTopRatedRequest,
  productTopRatedSuccess,
  productTopRatedFail,
} = productTopRatedSlice.actions;

export default productTopRatedSlice.reducer;

export const listTopProducts = (): AppThunk => async dispatch => {
  try {
    dispatch(productTopRatedRequest());

    const { data } = await axios.get(`/api/products/top/`);

    dispatch(productTopRatedSuccess(data));
  } catch (error) {
    dispatch(productTopRatedFail(getErrorMessage(error)));
  }
};
