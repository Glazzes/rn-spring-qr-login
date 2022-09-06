import {proxy} from 'valtio';
import {User} from '../utils/types';

type State = {
  accessToken: string;
  user: User;
};

export const authState = proxy<State>({
  accessToken: '',
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
  authState.accessToken = token;
};
