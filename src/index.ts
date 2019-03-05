import { render } from 'lit-html';
import { App } from './app/app';
import { store } from './core/store';
import './index.scss';

store.subscribe(state => render(App(state), document.body));
