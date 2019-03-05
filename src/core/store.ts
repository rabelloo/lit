import { createStore, logger } from '../store';
import { State } from './state';

const initialData: State = {
  count: 0,
  name: '',
};

export const store = createStore(initialData, logger());
