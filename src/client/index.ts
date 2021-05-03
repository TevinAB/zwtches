import './styles/main.scss';
import Store from '@/store/store';
import { State } from '@/types';

import productCard from '@/components/productCard/productCard';

(function (window: Window) {
  const initialState: State = {
    shoppingCart: [],
    currentPage: 1,
  };
  const STORE = new Store(initialState);
  (window as any).STORE = STORE;

  let main = document.getElementById('app');
})(window);
