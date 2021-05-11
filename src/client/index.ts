import './styles/main.scss';
import Store from '@/store/store';
import { State } from '@/types';

import navBar from '@/components/navBar/navBar';
import pagination from '@/components/pagination/pagination';

(function (window: Window) {
  const initialState: State = {
    shoppingCart: [],
    products: [],
    currentPage: 1,
  };
  const STORE = new Store(initialState);
  (window as any).STORE = STORE;

  let header = document.getElementById('header');
  if (header) header.innerHTML = navBar();

  let main = document.getElementById('app');
})(window);
