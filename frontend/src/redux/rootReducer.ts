import { combineReducers } from '@reduxjs/toolkit';

import productListReducer from './product/productListSlice';

const rootReducer = combineReducers({
  productList: productListReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
