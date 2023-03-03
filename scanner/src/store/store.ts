import {configureStore} from '@reduxjs/toolkit';
import accountSlice from './slices/accountSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    account: accountSlice,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
