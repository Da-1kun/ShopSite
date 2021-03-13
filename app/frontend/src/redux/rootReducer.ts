import { combineReducers } from '@reduxjs/toolkit';

import productListReducer from './product/productListSlice';
import productDetailsReducer from './product/productDetailsSlice';
import productCreateReducer from './product/productCreateSlice';
import productUpdateReducer from './product/productUpdateSlice';
import productDeleteReducer from './product/productDeleteSlice';
import productCreateReviewReducer from './product/productCreateReviewSlice';
import productTopRatedReducer from './product/productTopRatedSlice';
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
import orderDeliverReducer from './order/orderDeliverSlice';
import orderListReducer from './order/orderListSlice';

const rootReducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  productCreateReview: productCreateReviewReducer,
  productTopRated: productTopRatedReducer,
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
  orderDeliver: orderDeliverReducer,
  orderList: orderListReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
