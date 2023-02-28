import {configureStore} from '@reduxjs/toolkit';
import loginReducer from './slices/accountSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
