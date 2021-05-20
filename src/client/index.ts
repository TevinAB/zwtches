import './styles/main.scss';
import Store from '@/store/store';
import StoreController from '@/store/controller';
import { State } from '@/types';
import router from '@/pages/router';
import navBar, {
  handleCartQtyChange,
  navAfterRender,
} from '@/components/navBar/navBar';
import footer from '@/components/footer/footer';
import CatalogPage from '@/pages/catalog/catalog';
import { getRouterEventName, getInitialState } from './utils/utils';

//keys are converted to regex to match pathname
const routeMap = {
  '/catalog[?]page=[0-9]+&cat=[a-zA-Z]+$': CatalogPage,
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
    navAfterRender(header);

    storeController.subscribeToStore('ADD_ITEM', handleCartQtyChange);
    storeController.subscribeToStore('REMOVE_ITEM', handleCartQtyChange);
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
