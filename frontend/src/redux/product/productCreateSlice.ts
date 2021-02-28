import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import django from '../../django';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';
import Product from '../../components/Product';

interface ProductCreateState extends CommonState {
  product: Product | null;
}

const initialState: ProductCreateState = {
  isLoading: false,
  success: false,
  product: null,
  errorMessage: null,
};

const productCreateSlice = createSlice({
  name: 'productCreate',
  initialState,
  reducers: {
    productCreateRequest(state) {
      state.isLoading = true;
    },
    productCreateSuccess(state, action: PayloadAction<Product>) {
      state.isLoading = false;
      state.success = true;
      state.product = action.payload;
    },
    productCreateFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    productCreateReset(state) {
      state.isLoading = false;
      state.success = false;
      state.product = null;
      state.errorMessage = null;
    },
  },
});

export const {
  productCreateRequest,
  productCreateSuccess,
  productCreateFail,
  productCreateReset,
} = productCreateSlice.actions;

export default productCreateSlice.reducer;

export const createProduct = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(productCreateRequest());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    const { data } = await django.post(`/api/products/create/`, {}, config);

    dispatch(productCreateSuccess(data));
  } catch (error) {
    dispatch(productCreateFail(getErrorMessage(error)));
  }
};
