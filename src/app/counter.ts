import { html } from 'lit-html';
import { register } from '../core/store';

const { dispatch: decrement } = register({
  key: 'count',
  reducer: c => c - 1,
  type: '[Counter]: decrease count',
});
const { dispatch: increment } = register({
  key: 'count',
  reducer: c => c + 1,
  type: '[Counter]: increase count',
});

export const Counter = (count = 0) =>
  html`
    <div>${count ? `Count: ${count}` : `No count`}</div>
    <button @click=${() => increment()}>Increase</button>
    <button @click=${() => decrement()}>Decrease</button>
  `;
