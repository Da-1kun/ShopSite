import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import django from '../../django';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';
import { User } from './userDetailsSlice';

interface UserListState extends CommonState {
  users: User[];
}

const initialState: UserListState = {
  isLoading: false,
  users: [],
  errorMessage: null,
};

const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    userListRequest(state) {
      state.isLoading = true;
    },
    userListSuccess(state, action: PayloadAction<User[]>) {
      state.isLoading = false;
      state.users = action.payload;
    },
    userListFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    userListReset(state) {
      state.isLoading = false;
      state.users = [];
      state.errorMessage = null;
    },
  },
});

export const {
  userListRequest,
  userListSuccess,
  userListFail,
  userListReset,
} = userListSlice.actions;

export default userListSlice.reducer;

export const listUsers = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(userListRequest());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    const { data } = await django.get(`/api/users/`, config);

    dispatch(userListSuccess(data));
  } catch (error) {
    dispatch(userListFail(getErrorMessage(error)));
  }
};
