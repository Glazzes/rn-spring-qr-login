import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type Authentication = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
};

export type AuthState = {
  tokens: Authentication;
  user: User;
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
};

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
  },
});

export const {setAuthenticationTokens, setCurrentUser: setUser} =
  authSlice.actions;

export default authSlice.reducer;
