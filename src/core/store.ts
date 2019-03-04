import { createStore } from '../store';
import { State } from './state';

const initialData: State = {
  count: 0,
  name: '',
};

const store = createStore(initialData, { enableLog: true });

export const { register, subscribe } = store;
