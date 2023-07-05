import {combineReducers, EmptyObject} from '@reduxjs/toolkit';
import authReducer from '../authReducer/authReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootReducer = ReturnType<typeof rootReducer>;
