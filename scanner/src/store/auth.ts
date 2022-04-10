import create from 'zustand';
import {User} from '../types/user';

type AuthStore = {
  user: User;
  refreshToken: string;
  accessToken: string;
  setUser: (user: User) => void;
  setRefreshToken: (refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
};

export default create<AuthStore>(set => ({
  user: {
    username: 'Glaze',
    profilePicture:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.redd.it%2F68r2y76oefe51.png&f=1&nofb=1',
  },
  refreshToken: '',
  accessToken: '',
  setUser: user => set(state => ({...state, user})),
  setRefreshToken: refreshToken => set(state => ({...state, refreshToken})),
  setAccessToken: accessToken => set(state => ({...state, accessToken})),
}));
