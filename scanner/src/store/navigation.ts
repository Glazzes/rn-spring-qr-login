import create from 'zustand';

type NavigationStore = {
  components: {[name: string]: string};
  addComponentId: (name: string, id: string) => void;
};

export default create<NavigationStore>(set => ({
  components: {},
  addComponentId: (name: string, id: string) =>
    set(state => ({components: {...state.components, [name]: id}})),
}));
