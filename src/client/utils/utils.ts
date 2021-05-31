import StoreController from '@/storeController/controller';
import { CartItem, State } from '@/types';
/**
 * @param path
 * @param routerMap
 * @returns The constuctor for the matching view. Or undefined if no match was found
 */
export function getViewFromUrl(
  path: string,
  routerMap: { [key: string]: any }
) {
  const keys = Object.keys(routerMap);
  let matchingKey = undefined;

  for (let key of keys) {
    const regex = new RegExp(key);
    if (regex.test(path)) {
      matchingKey = key;
      break;
    }
  }

  if (matchingKey) return routerMap[matchingKey];

  return matchingKey;
}

export function getRouterEventName() {
  return 'reloadrouter';
}

export function createProductPath(permalink: string) {
  return `/product/${permalink}`;
}

export function getInitialState(): State {
  let cart: Array<CartItem> = [];

  if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart') as '');
  }

  return {
    shoppingCart: cart instanceof Array ? cart : [],
    products: { items: [], lastPage: 1 },
    featuredItems: {},
    selectedProduct: null,
  };
}

export function storeCart(cart: Array<CartItem>) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function setAddToCartListeners(
  scope: HTMLElement,
  controller: StoreController
) {
  const addToCartBtns = scope.querySelectorAll('.btn--add-to-cart');

  addToCartBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-prod-id') || '';

      controller.addItem({ productId: prodId });

      btn.classList.toggle('hidden');
      btn.nextElementSibling?.classList.toggle('hidden');
    });
  });
}
