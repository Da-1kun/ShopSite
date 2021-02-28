import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import Product from '../../components/Product';
import django from '../../django';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';

interface ProductDetailsState extends CommonState {
  product: Product | null;
}

const initialState: ProductDetailsState = {
  isLoading: false,
  product: null,
  errorMessage: null,
};

const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState,
  reducers: {
    productDetailsRequest(state) {
      state.isLoading = true;
    },
    productDetailsSuccess(state, action: PayloadAction<Product>) {
      state.isLoading = false;
      state.product = action.payload;
    },
    productDetailsFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  productDetailsRequest,
  productDetailsSuccess,
  productDetailsFail,
} = productDetailsSlice.actions;

export default productDetailsSlice.reducer;

export const fetchProductDetails = (id: number): AppThunk => async dispatch => {
  try {
    dispatch(productDetailsRequest());

    const { data } = await django.get(`/api/products/${id}`);

    dispatch(productDetailsSuccess(data));
  } catch (error) {
    dispatch(productDetailsFail(getErrorMessage(error)));
  }
};
