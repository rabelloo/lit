import { render } from 'lit-html';
import { App } from './app/app';
import { subscribe } from './core/store';
import './index.scss';

subscribe(state => render(App(state), document.body));
