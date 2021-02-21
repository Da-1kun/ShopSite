import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import Product from '../../components/Product';
import django from '../../django';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';

interface ProductListState extends CommonState {
  products: Product[];
}

const initialState: ProductListState = {
  isLoading: false,
  products: [],
  errorMessage: null,
};

const productListSlice = createSlice({
  name: 'productList',
  initialState,
  reducers: {
    productListRequest(state) {
      state.isLoading = true;
      state.products = [];
    },
    productListSuccess(state, action: PayloadAction<Product[]>) {
      state.isLoading = false;
      state.products = action.payload;
    },
    productListFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  productListRequest,
  productListSuccess,
  productListFail,
} = productListSlice.actions;

export default productListSlice.reducer;

export const fetchProductList = (): AppThunk => async dispatch => {
  try {
    dispatch(productListRequest());

    const { data } = await django.get('/api/products');

    dispatch(productListSuccess(data));
  } catch (error) {
    dispatch(productListFail(getErrorMessage(error)));
  }
};
