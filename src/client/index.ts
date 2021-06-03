import 'babel-polyfill';
import './styles/main.scss';
import Store from '@/store/store';
import StoreController from '@/storeController/controller';
import { State } from '@/types';
import router from '@/pages/router';
import routeMap from '@/pages/routeMap';
import navBar, {
  handleCartQtyChange,
  navAfterRender,
} from '@/components/navBar/navBar';
import footer from '@/components/footer/footer';
import { getRouterEventName, getInitialState } from './utils/utils';

(function (window: Window) {
  const initialState: State = getInitialState();

  const STORE = new Store(initialState);
  const storeController = new StoreController(STORE);
  (window as any).STORE = STORE;

  //setup header
  let header = document.getElementById('header');
  if (header) {
    let cartQuantity = STORE.getState().shoppingCart.length;

    header.innerHTML = navBar(cartQuantity);
    navAfterRender(header);

    storeController.subscribeToStore('ADD_ITEM', handleCartQtyChange);
    storeController.subscribeToStore('REMOVE_ITEM', handleCartQtyChange);
    storeController.subscribeToStore('CHECKOUT', handleCartQtyChange);
  }

  //main section
  router(storeController, 'app', routeMap);

  //setup footer
  const footerContainer = document.getElementById('footer');
  if (footerContainer) {
    footerContainer.innerHTML = footer();
  }

  //handles the need for router reload
  window.addEventListener(getRouterEventName(), () => {
    router(storeController, 'app', routeMap);
  });

  window.addEventListener('popstate', () => {
    router(storeController, 'app', routeMap);
  });
})(window);
