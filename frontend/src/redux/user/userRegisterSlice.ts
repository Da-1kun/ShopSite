import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserInfo } from './userLoginSlice';
import django from '../../django';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';
import { userLoginSuccess } from './userLoginSlice';

interface UserRegisterState extends CommonState {
  userInfo: UserInfo | null;
}

const initialState: UserRegisterState = {
  isLoading: false,
  userInfo: null,
  errorMessage: null,
};

const userRegisterSlice = createSlice({
  name: 'userRegister',
  initialState,
  reducers: {
    userRegisterRequest(state) {
      state.isLoading = true;
    },
    userRegisterSuccess(state, action: PayloadAction<UserInfo>) {
      state.isLoading = false;
      state.userInfo = action.payload;
    },
    userRegisterFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFail,
} = userRegisterSlice.actions;

export default userRegisterSlice.reducer;

export const register = (
  name: string,
  email: string,
  password: string
): AppThunk => async dispatch => {
  try {
    dispatch(userRegisterRequest());

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const { data } = await django.post(
      '/api/users/register/',
      { name: name, email: email, password: password },
      config
    );

    dispatch(userRegisterSuccess(data));

    dispatch(userLoginSuccess(data));

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(userRegisterFail(getErrorMessage(error)));
  }
};
