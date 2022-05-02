import create from 'zustand';

type AuthStore = {
  user: string;
  mutate: (newStr: string) => void;
};

export default create<AuthStore>(set => ({
  user: 'Glaze',
  mutate: (newUser: string) => set(state => ({...state, user: newUser})),
}));
