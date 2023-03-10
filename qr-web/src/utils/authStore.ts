import {proxy} from 'valtio';
import {User} from './types';

type State = {
  accessToken: string;
  user: User;
  isAuthenticated: boolean
};

export const authState = proxy<State>({
  accessToken: '',
  user: {id: '', username: '', profilePicture: ''},
  isAuthenticated: false
});

export const setUser = (user: User) => {
  authState.user = user;
}

export const setAccessToken = (token: string) => {
  authState.accessToken = token;
}

export const setIsAuthenticated = (value: boolean) => {
  authState.isAuthenticated = value;
}
