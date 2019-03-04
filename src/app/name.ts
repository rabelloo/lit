import { html } from 'lit-html';
import { register } from '../core/store';

const { dispatch } = register({
  key: 'name',
  reducer: (_, name) => name,
  type: '[Name]: change name',
});

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
