import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import Product from '../../components/Product';
import django from '../../django';
import { AppThunk } from '../store';

interface ProductListState {
  loading: boolean;
  products: Product[];
  error: string | null;
}

let initialState: ProductListState = {
  loading: true,
  products: [],
  error: null,
};

const productListSlice = createSlice({
  name: 'productList',
  initialState,
  reducers: {
    productListRequest(state) {
      state.loading = true;
      state.products = [];
    },
    productListSuccess(state, action: PayloadAction<Product[]>) {
      state.loading = false;
      state.products = action.payload;
    },
    productListFail(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
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
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(productListFail(message));
  }
};
