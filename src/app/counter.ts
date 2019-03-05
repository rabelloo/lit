import { html } from 'lit-html';
import { store } from '../core/store';

const state = store.slice('count');
const decrement = state.case('[Counter]: decrease count').reduce(c => c - 1);
const increment = state.case('[Counter]: increase count').reduce(c => c + 1);

export const Counter = (count = 0) =>
  html`
    <div>${count ? `Count: ${count}` : `No count`}</div>
    <button @click=${increment}>Increase</button>
    <button @click=${decrement}>Decrease</button>
  `;
