import './styles/main.scss';
import Store from '@/store/store';
import StoreController from '@/store/controller';
import { State } from '@/types';
import router from '@/pages/router';
import navBar, { handleCartQtyChange } from '@/components/navBar/navBar';
import CatalogPage from '@/pages/catalog/catalog';
import { getRouterEventName, getInitialState } from './utils/utils';

//keys are converted to regex to match pathname
const routeMap = {
  '/catalog[?]page=[0-9]+$': CatalogPage,
};

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
    storeController.subscribeToStore('ADD_ITEM', handleCartQtyChange);
    storeController.subscribeToStore('REMOVE_ITEM', handleCartQtyChange);
  }

  //remove soon
  history.pushState({}, 'catalog', '/catalog?page=1');

  router(storeController, 'app', routeMap);

  //handles the need for router reload
  window.addEventListener(getRouterEventName(), () => {
    router(storeController, 'app', routeMap);
  });

  window.addEventListener('popstate', () => {
    router(storeController, 'app', routeMap);
  });
})(window);
