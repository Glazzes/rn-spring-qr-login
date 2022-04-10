import {navigationStore} from '../store';

const useAddComponentId = (name: string, id: string) => {
  const addComponentId = navigationStore(state => state.addComponentId);
  addComponentId(name, id);
};

export default useAddComponentId;
