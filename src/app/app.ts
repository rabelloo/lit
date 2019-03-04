import { html } from 'lit-html';
import { State } from '../core/state';
import { Counter } from './counter';
import { Name } from './name';

export const App = (state: State) => html`
  <h1>Hello world!</h1>
  ${Counter(state.count)}
  ${Name(state.name)}
`;
