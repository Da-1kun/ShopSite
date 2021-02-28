import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import django from '../../django';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';
import { User, userDetailsSuccess } from './userDetailsSlice';

interface UserUpdateState extends CommonState {}

const initialState: UserUpdateState = {
  isLoading: false,
  success: false,
  errorMessage: null,
};

const userUpdateSlice = createSlice({
  name: 'userUpdate',
  initialState,
  reducers: {
    userUpdateRequest(state) {
      state.isLoading = true;
    },
    userUpdateSuccess(state) {
      state.isLoading = false;
      state.success = true;
    },
    userUpdateFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    userUpdateReset(state) {
      state.isLoading = false;
      state.success = false;
      state.errorMessage = null;
    },
  },
});

export const {
  userUpdateRequest,
  userUpdateSuccess,
  userUpdateFail,
  userUpdateReset,
} = userUpdateSlice.actions;

export default userUpdateSlice.reducer;

export const updateUser = (user: User): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(userUpdateRequest());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    const { data } = await django.put(
      `/api/users/update/${user._id}/`,
      user,
      config
    );

    dispatch(userUpdateSuccess());

    dispatch(userDetailsSuccess(data));
  } catch (error) {
    dispatch(userUpdateFail(getErrorMessage(error)));
  }
};
