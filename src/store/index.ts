import {
  ThunkDispatch,
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import authReducer from './authReducer/authReducer';
import {persistStore} from 'redux-persist';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {persistedReducer} from './persistor/persistor';
import courseReducer from './courseReducer/courseReducer';
import { Action } from 'rxjs/internal/scheduler/Action';

const middlewares = getDefaultMiddleware({
  serializableCheck: false,
});

// if (__DEV__) {
//   const createDebugger = require('redux-flipper').default;
//   middlewares.push(createDebugger());
// }

export const store = configureStore({
  reducer: persistedReducer,
  middleware: middlewares,
});

export type Store = typeof store;

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;

export const useAppThunkDispatch = () => useDispatch<ThunkAppDispatch>();