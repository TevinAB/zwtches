import './styles/main.scss';
import Store from '@/store/store';
import StoreController from '@/store/controller';
import { State } from '@/types';

import navBar from '@/components/navBar/navBar';

(function (window: Window) {
  const initialState: State = {
    shoppingCart: [],
    products: { items: [], lastPage: 1 },
  };
  const STORE = new Store(initialState);
  (window as any).STORE = STORE;

  const controller = new StoreController(STORE);

  let header = document.getElementById('header');
  if (header) header.innerHTML = navBar();

  let main = document.getElementById('app');
})(window);
