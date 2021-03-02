import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';
import { CommonState, getErrorMessage } from '../common';
import { AppThunk } from '../store';

interface UserDeleteState extends CommonState {}

const initialState: UserDeleteState = {
  isLoading: false,
  success: false,
  errorMessage: null,
};

const userDeleteSlice = createSlice({
  name: 'userDelete',
  initialState,
  reducers: {
    userDeleteRequest(state) {
      state.isLoading = true;
    },
    userDeleteSuccess(state) {
      state.isLoading = false;
      state.success = true;
    },
    userDeleteFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  userDeleteRequest,
  userDeleteSuccess,
  userDeleteFail,
} = userDeleteSlice.actions;

export default userDeleteSlice.reducer;

export const deleteUser = (id: number): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    dispatch(userDeleteRequest());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
    };

    await axios.delete(`/api/users/delete/${id}/`, config);

    dispatch(userDeleteSuccess());
  } catch (error) {
    dispatch(userDeleteFail(getErrorMessage(error)));
  }
};
