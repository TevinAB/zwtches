import './styles/main.scss';
import Store from '@/store/store';
import { State } from '@/types';

import navBar from '@/components/navBar/navBar';

(function (window: Window) {
  const initialState: State = {
    shoppingCart: [],
    currentPage: 1,
  };
  const STORE = new Store(initialState);
  (window as any).STORE = STORE;

  let header = document.getElementById('header');
  if (header) header.innerHTML = navBar();

  let main = document.getElementById('root');
})(window);
