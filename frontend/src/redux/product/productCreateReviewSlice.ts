import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';

interface ProductCreateReviewState extends CommonState {}

const initialState: ProductCreateReviewState = {
  isLoading: false,
  success: false,
  errorMessage: null,
};

const productCreateReviewSlice = createSlice({
  name: 'productCreateReview',
  initialState,
  reducers: {
    productCreateReviewRequest(state) {
      state.isLoading = true;
    },
    productCreateReviewSuccess(state) {
      state.isLoading = false;
      state.success = true;
    },
    productCreateReviewFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    productCreateReviewReset(state) {
      state.isLoading = false;
      state.success = false;
      state.errorMessage = null;
    },
  },
});

export const {
  productCreateReviewRequest,
  productCreateReviewSuccess,
  productCreateReviewFail,
  productCreateReviewReset,
} = productCreateReviewSlice.actions;

export default productCreateReviewSlice.reducer;

export interface Review {
  product: number;
  rating: number;
  comment: string;
  name?: string;
  createdAt?: string;
  _id?: number;
}

export const createProductReview = (review: Review): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(productCreateReviewRequest());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    await axios.post(
      `/api/products/${review.product}/reviews/`,
      review,
      config
    );

    dispatch(productCreateReviewSuccess());
  } catch (error) {
    dispatch(productCreateReviewFail(getErrorMessage(error)));
  }
};
