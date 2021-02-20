import { combineReducers } from '@reduxjs/toolkit';

import productListReducer from './product/productListSlice';
import productDetailReducer from './product/productDetailSlice';
import cartReducer from './cartSlice';

const rootReducer = combineReducers({
  productList: productListReducer,
  productDetail: productDetailReducer,
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
