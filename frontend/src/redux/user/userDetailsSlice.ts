import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import django from '../../django';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';

export interface User {
  id: string;
  _id: string;
  username: string;
  email: string;
  name: string;
  isAdmin: string;
}

interface UserDetailsState extends CommonState {
  user: User | null;
}

const initialState: UserDetailsState = {
  isLoading: false,
  user: null,
  errorMessage: null,
};

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    userDetailsRequest(state) {
      state.isLoading = true;
    },
    userDetailsSuccess(state, action: PayloadAction<User>) {
      state.isLoading = false;
      state.user = action.payload;
    },
    userDetailsFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    userDetailsReset(state) {
      state.isLoading = false;
      state.user = null;
      state.errorMessage = null;
    },
  },
});

export const {
  userDetailsRequest,
  userDetailsSuccess,
  userDetailsFail,
  userDetailsReset,
} = userDetailsSlice.actions;

export default userDetailsSlice.reducer;

export const getUserDetails = (id: string): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(userDetailsRequest());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    const { data } = await django.get(`/api/users/${id}/`, config);

    dispatch(userDetailsSuccess(data));
  } catch (error) {
    dispatch(userDetailsFail(getErrorMessage(error)));
  }
};
