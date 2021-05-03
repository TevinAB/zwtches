import './styles/main.scss';
import Store from '@/store/store';
import { State } from '@/types';

import cartItem from '@/components/cartItem/cartItem';

(function (window: Window) {
  const initialState: State = {
    shoppingCart: [],
    currentPage: 1,
  };
  const STORE = new Store(initialState);
  (window as any).STORE = STORE;

  let main = document.getElementById('app');
  if (main) {
    main.innerHTML = cartItem({
      name: 'Breguet Double Tourbillon Rose Gold Watch 5347BR/11/9ZU',
      quantity: 2,
      id: '92-123',
      pricePerUnit: 327,
      permaLink: 'awSjix',
      image:
        'https://images-na.ssl-images-amazon.com/images/I/81tL%2BP0Qj4L._AC_UY879_.jpg',
    });
  }
})(window);
