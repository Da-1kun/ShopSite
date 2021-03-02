import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';
import Product from '../../components/Product';
import { productDetailsSuccess } from './productDetailsSlice';

interface ProductUpdateState extends CommonState {
  product: Product | null;
}

const initialState: ProductUpdateState = {
  isLoading: false,
  success: false,
  product: null,
  errorMessage: null,
};

const productUpdateSlice = createSlice({
  name: 'productUpdate',
  initialState,
  reducers: {
    productUpdateRequest(state) {
      state.isLoading = true;
    },
    productUpdateSuccess(state, action: PayloadAction<Product>) {
      state.isLoading = false;
      state.success = true;
      state.product = action.payload;
    },
    productUpdateFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    productUpdateReset(state) {
      state.isLoading = false;
      state.success = false;
      state.product = null;
      state.errorMessage = null;
    },
  },
});

export const {
  productUpdateRequest,
  productUpdateSuccess,
  productUpdateFail,
  productUpdateReset,
} = productUpdateSlice.actions;

export default productUpdateSlice.reducer;

export const updateProduct = (product: Product): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(productUpdateRequest());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/products/update/${product._id}/`,
      product,
      config
    );

    dispatch(productUpdateSuccess(data));

    dispatch(productDetailsSuccess(data));
  } catch (error) {
    dispatch(productUpdateFail(getErrorMessage(error)));
  }
};
