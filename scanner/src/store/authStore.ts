import {proxy} from 'valtio';
import {User} from '../utils/types';

type State = {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: User;
};

export const authState = proxy<State>({
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  user: {
    id: '',
    username: '',
    profilePicture: '',
  },
});

export const setUser = (user: User) => {
  authState.user = user;
};

export const setAccessToken = (token: string) => {
  authState.tokens.accessToken = token;
};
