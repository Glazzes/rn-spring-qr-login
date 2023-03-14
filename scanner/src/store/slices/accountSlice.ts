import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AccountCreationFields} from '../../utils/types';

export type AccountDetails = {
  username: string;
  email: string;
  password: string;
  confirmation: string;
};

type FieldUpdate = {
  name: AccountCreationFields;
  value: string;
};

const initialState: AccountDetails = {
  username: '',
  email: '',
  password: '',
  confirmation: '',
};

const accountSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<FieldUpdate>) => {
      state[action.payload.name] = action.payload.value;
    },
    reset: state => {
      state.email = '';
      state.password = '';
      state.username = '';
      state.confirmation = '';
    },
  },
});

export const {updateField, reset} = accountSlice.actions;
export default accountSlice.reducer;
