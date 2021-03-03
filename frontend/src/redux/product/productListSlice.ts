import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import Product from '../../components/Product';
import axios from 'axios';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';

interface ProductListResponse {
  products: Product[];
  page?: number;
  pages?: number;
}

interface ProductListState extends ProductListResponse, CommonState {}

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
    productListSuccess(state, action: PayloadAction<ProductListResponse>) {
      state.isLoading = false;
      state.products = action.payload.products;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
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

export const fetchProductList = (keyword = ''): AppThunk => async dispatch => {
  try {
    dispatch(productListRequest());

    const { data } = await axios.get(`/api/products${keyword}`);

    dispatch(productListSuccess(data));
  } catch (error) {
    dispatch(productListFail(getErrorMessage(error)));
  }
};
