import { html } from 'lit-html';
import { store } from '../core/store';

const state = store.slice('name');
const dispatch = state
  .case('[Name]: change name')
  .reduce<string>((_, name) => name!);

export const Name = (name: string) =>
  html`
    <div>
      ${name
        ? `Your name is: ${name}`
        : 'You currently have no name. Start typing below'}
    </div>
    <input .value=${name} @input=${changeName} />
  `;

function changeName(ev: any) {
  dispatch(ev.target.value);
}
