import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import django from '../../django';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';
import { User } from './userDetailsSlice';

export interface UserInfo extends User {
  token: string;
}

interface UserLoginState extends CommonState {
  userInfo: Partial<UserInfo>;
}

const userInfoFromStorage: UserInfo = JSON.parse(
  localStorage.getItem('userInfo') || 'null'
);

const initialState: UserLoginState = {
  isLoading: false,
  userInfo: userInfoFromStorage,
  errorMessage: null,
};

const userLoginSlice = createSlice({
  name: 'userLogin',
  initialState,
  reducers: {
    userLoginRequest(state) {
      state.isLoading = true;
    },
    userLoginSuccess(state, action: PayloadAction<UserInfo>) {
      state.isLoading = false;
      state.userInfo = action.payload;
    },
    userLoginFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    userLogout(state) {
      state.isLoading = false;
      state.userInfo = {};
      state.errorMessage = null;
    },
  },
});

export const {
  userLoginRequest,
  userLoginSuccess,
  userLoginFail,
  userLogout,
} = userLoginSlice.actions;

export default userLoginSlice.reducer;

export const login = (
  email: string,
  password: string
): AppThunk => async dispatch => {
  try {
    dispatch(userLoginRequest());

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const { data } = await django.post(
      '/api/users/login/',
      { username: email, password: password },
      config
    );

    dispatch(userLoginSuccess(data));

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(userLoginFail(getErrorMessage(error)));
  }
};
