import {combineReducers, EmptyObject} from '@reduxjs/toolkit';
import authReducer from '../authReducer/authReducer';
import databaseSetupReducer from '../databaseSetupReducer/databaseSetupReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  db : databaseSetupReducer
});

export type RootReducer = ReturnType<typeof rootReducer>;
