import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import Product from '../../components/Product';
import django from '../../django';
import { AppThunk } from '../store';

interface ProductDetailState {
  isLoading: boolean;
  product: Product | null;
  errorMessage: string | null;
}

let initialState: ProductDetailState = {
  isLoading: true,
  product: null,
  errorMessage: null,
};

const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState,
  reducers: {
    productDetailRequest(state) {
      state.isLoading = true;
    },
    productDetailSuccess(state, action: PayloadAction<Product>) {
      state.isLoading = false;
      state.product = action.payload;
    },
    productDetailFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  productDetailRequest,
  productDetailSuccess,
  productDetailFail,
} = productDetailSlice.actions;

export default productDetailSlice.reducer;

export const fetchProductDetail = (id: string): AppThunk => async dispatch => {
  try {
    dispatch(productDetailRequest());

    const { data } = await django.get(`/api/products/${id}`);

    dispatch(productDetailSuccess(data));
  } catch (error) {
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(productDetailFail(errorMessage));
  }
};
