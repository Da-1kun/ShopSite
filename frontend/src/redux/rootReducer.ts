import { combineReducers } from '@reduxjs/toolkit';

import productListReducer from './product/productListSlice';
import productDetailsReducer from './product/productDetailsSlice';
import userLoginReducer from './user/userLoginSlice';
import userDetailsReducer from './user/userDetailsSlice';
import userRegisterReducer from './user/userRegisterSlice';
import userUpdateProfileReducer from './user/userUpdateProfileSlice';
import userListReducer from './user/userListSlice';
import userDeleteReducer from './user/userDeleteSlice';
import userUpdateReducer from './user/userUpdateSlice';
import cartReducer from './cartSlice';
import orderCreateReducer from './order/orderCreateSlice';
import orderDetailsReducer from './order/orderDetailsSlice';
import orderPayReducer from './order/orderPaySlice';
import orderListMyReducer from './order/orderListMySlice';

const rootReducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  userLogin: userLoginReducer,
  userDetails: userDetailsReducer,
  userRegister: userRegisterReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  cart: cartReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderListMy: orderListMyReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
