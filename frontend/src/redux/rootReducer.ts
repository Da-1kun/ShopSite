import { combineReducers } from '@reduxjs/toolkit';

import productListReducer from './product/productListSlice';
import productDetailsReducer from './product/productDetailsSlice';
import userLoginReducer from './user/userLoginSlice';
import userDetailsReducer from './user/userDetailsSlice';
import userRegisterReducer from './user/userRegisterSlice';
import userUpdateProfileReducer from './user/userUpdateProfileSlice';
import cartReducer from './cartSlice';

const rootReducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  userLogin: userLoginReducer,
  userDetails: userDetailsReducer,
  userRegister: userRegisterReducer,
  userUpdateProfile: userUpdateProfileReducer,
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
