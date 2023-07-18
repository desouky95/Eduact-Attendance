import {Action, PayloadAction, createSlice} from '@reduxjs/toolkit';

type AuthState = {user: User; token: string; isLogged: boolean};

const initialState = {} as AuthState;

const authSlice = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    addUser: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLogged = true;
    },
    logout: state => {
      state.user = null as any;
      state.token = null as any;
      state.isLogged = false;
    },
  },
});

export default authSlice.reducer;

export const {logout, addUser} = authSlice.actions;
