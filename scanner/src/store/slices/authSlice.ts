import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {mmkv} from '../../utils/mmkv';
import {User} from '../../utils/types';

export type Authentication = {
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  tokens: Authentication;
  user: User;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  user: {
    id: '',
    username: '',
    email: '',
    profilePicture: '',
  },
  isAuthenticated: false,
};

const tokens = mmkv.getString('tokens');
if (tokens) {
  const parsedTokens: Authentication = JSON.parse(tokens);
  initialState.tokens.accessToken = parsedTokens.accessToken;
  initialState.tokens.refreshToken = parsedTokens.refreshToken;
  initialState.isAuthenticated = true;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticationTokens: (state, action: PayloadAction<Authentication>) => {
      state.tokens.accessToken = action.payload.accessToken;
      state.tokens.refreshToken = action.payload.refreshToken;
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const {setAuthenticationTokens, setCurrentUser, setIsAuthenticated} =
  authSlice.actions;
export default authSlice.reducer;
