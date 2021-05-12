import { EventTypes, CartItem } from '@/types';
import Store from '@/store/store';
import axios from 'axios';

class StoreController {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  subscribeToStore(eventType: EventTypes, callback: () => void) {
    //return the unsubscribe function
    return this.store.subscribe(eventType, callback);
  }

  addItem(payload: { productId: string }) {
    const oldState = this.store.getState();
    const product = oldState.products.find(
      (prod) => prod.id === payload.productId
    );

    if (!product) return;

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      pricePerUnit: product.price.raw,
      image: product.media.source,
    };
    const newState = Object.assign({}, oldState, {
      shoppingCart: oldState.shoppingCart.push(cartItem),
    });

    this.store.setState('ADD_ITEM', newState);
  }

  removeItem(payload: { productId: string }) {
    const oldState = this.store.getState();

    const newState = Object.assign({}, oldState, {
      shoppingCart: oldState.shoppingCart.filter(
        (item) => item.id !== payload.productId
      ),
    });

    this.store.setState('REMOVE_ITEM', newState);
  }

  changeItemQuantity(payload: { productId: string; newQuantity: number }) {
    const oldState = this.store.getState();

    const newState = Object.assign({}, oldState, {
      shoppingCart: oldState.shoppingCart.map((cartItem) => {
        if (cartItem.id !== payload.productId) return cartItem;

        return (cartItem.quantity = payload.newQuantity);
      }),
    });

    this.store.setState('ITEM_QTY_CHANGE', newState);
  }

  async getProducts(payload: { pageNumber: string | number }) {
    const { pageNumber } = payload;
    const products = await axios.get(`/api/products?page=${pageNumber}`);
    const oldState = this.store.getState();

    const newState = Object.assign({}, oldState, { products });

    this.store.setState('GET_PRODUCTS', newState);
  }
}

export default StoreController;