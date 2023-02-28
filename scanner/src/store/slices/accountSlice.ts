import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type AccountDetails = {
  username: string;
  password: string;
};

const initialState: AccountDetails = {
  username: '',
  password: '',
};

const accountSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    updatePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const {updatePassword, updateUsername} = accountSlice.actions;
export default accountSlice.reducer;
