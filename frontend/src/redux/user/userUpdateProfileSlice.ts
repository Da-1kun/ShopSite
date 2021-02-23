import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserInfo } from './userLoginSlice';
import django from '../../django';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';
import { userLoginSuccess } from './userLoginSlice';

interface UserUpdateProfileState extends CommonState {
  userInfo: Partial<UserInfo>;
  success: boolean;
}

const initialState: UserUpdateProfileState = {
  isLoading: false,
  userInfo: {},
  success: false,
  errorMessage: null,
};

const userUpdateProfileSlice = createSlice({
  name: 'userUpdateProfile',
  initialState,
  reducers: {
    userUpdateProfileRequest(state) {
      state.isLoading = true;
    },
    userUpdateProfileSuccess(state, action: PayloadAction<UserInfo>) {
      state.isLoading = false;
      state.userInfo = action.payload;
      state.success = true;
    },
    userUpdateProfileFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    userUpdateProfileReset(state) {
      state.isLoading = false;
      state.userInfo = {};
      state.errorMessage = null;
      state.success = false;
    },
  },
});

export const {
  userUpdateProfileRequest,
  userUpdateProfileSuccess,
  userUpdateProfileFail,
  userUpdateProfileReset,
} = userUpdateProfileSlice.actions;

export default userUpdateProfileSlice.reducer;

interface updateParams {
  id: string;
  email: string;
  name: string;
  password: string;
}

export const updateUserProfile = (user: updateParams): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(userUpdateProfileRequest());

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
      `/api/users/profile/update/`,
      user,
      config
    );

    dispatch(userUpdateProfileSuccess(data));

    dispatch(userLoginSuccess(data));

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(userUpdateProfileFail(getErrorMessage(error)));
  }
};
