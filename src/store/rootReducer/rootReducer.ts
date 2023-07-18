import {combineReducers, EmptyObject} from '@reduxjs/toolkit';
import authReducer from '../authReducer/authReducer';
import databaseSetupReducer from '../databaseSetupReducer/databaseSetupReducer';
import courseReducer from '../courseReducer/courseReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  db: databaseSetupReducer,
  course: courseReducer,
});

export type RootReducer = ReturnType<typeof rootReducer>;
