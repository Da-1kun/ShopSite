import { combineReducers } from '@reduxjs/toolkit';

import productListReducer from './product/productListSlice';
import productDetailReducer from './product/productDetailSlice';

const rootReducer = combineReducers({
  productList: productListReducer,
  productDetail: productDetailReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
