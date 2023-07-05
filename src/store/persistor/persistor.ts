import AsyncStorage from '@react-native-async-storage/async-storage';
import {PersistConfig, persistReducer} from 'redux-persist';
import {RootReducer, rootReducer} from '../rootReducer/rootReducer';
import storage from "redux-persist/lib/storage";
import { AnyAction } from '@reduxjs/toolkit';

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage: AsyncStorage,
  // whitelist: ['auth'],
};

export const persistedReducer = persistReducer<RootReducer>(persistConfig, rootReducer);
