import { EventTypes, CartItem, State, ProductItem } from '@/types';
import Store from '@/store/store';
import axios from 'axios';

class StoreController {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  subscribeToStore(eventType: EventTypes, callback: (newState: State) => void) {
    //return the unsubscribe function
    return this.store.subscribe(eventType, callback);
  }

  addItem(payload: { productId: string }) {
    const oldState = this.store.getState();

    const pool: Array<ProductItem> = this.createItemPool(oldState);

    //Search pool for product to be added to cart
    const product = pool.find((prod) => prod.id === payload.productId);

    //no such product
    if (!product) return;

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      pricePerUnit: product.price.raw,
      image: product.media.source,
      permaLink: product.permalink,
    };

    const possibleDuplicate = oldState.shoppingCart.find(
      (item) => item.id === cartItem.id
    );
    if (possibleDuplicate) cartItem.quantity += possibleDuplicate.quantity;

    //filter to prevent item duplication
    oldState.shoppingCart = oldState.shoppingCart.filter(
      (item) => item.id !== cartItem.id
    );

    const newState = Object.assign({}, oldState, {
      shoppingCart: [...oldState.shoppingCart, cartItem],
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

        cartItem.quantity = payload.newQuantity;
        return cartItem;
      }),
    });

    this.store.setState('ITEM_QTY_CHANGE', newState);
  }

  async getProducts(payload: {
    pageNumber: string | number;
    category: string;
  }) {
    const { pageNumber, category } = payload;
    const oldState = this.store.getState();
    try {
      const response = await axios.get(
        `/api/products?page=${pageNumber}&cat=${category}`
      );
      const products = response.data.result.items;
      //last page for this product catalog
      const lastPage = response.data.result.meta.lastPage;

      const newState = Object.assign({}, oldState, {
        products: { items: products, lastPage },
      });

      this.store.setState('GET_PRODUCTS', newState);
    } catch (error) {
      this.store.setState('GET_PRODUCTS_ERROR', oldState);
    }
  }

  async getFeaturedSections(payload: { itemsPerSection: number }) {
    const oldState = this.store.getState();
    try {
      const { itemsPerSection } = payload;
      const response = await axios.get(
        `/api/products/featured/items?ips=${itemsPerSection}`
      );

      const result = response.data;

      const newState = Object.assign({}, oldState, { featuredItems: result });

      this.store.setState('GET_FEATURED_ITEMS', newState);
    } catch (error) {
      this.store.setState('GET_FEATURED_ITEMS_ERROR', oldState);
    }
  }

  async getSelectedProduct(payload: { permalink: string }) {
    const oldState = this.store.getState();

    const pool = this.createItemPool(oldState);

    const matchingProduct = pool.find(
      (item) => item.permalink === payload.permalink
    );

    //if we found it in our local state
    if (matchingProduct) {
      this.store.setState('GET_SELECTED_PRODUCT', {
        ...oldState,
        selectedProduct: matchingProduct,
      });

      return;
    }

    //check server
    try {
      const response = await axios.get(`/api/products/${payload.permalink}`);

      const product = response.data;

      this.store.setState('GET_SELECTED_PRODUCT', {
        ...oldState,
        selectedProduct: product,
      });
    } catch (error) {
      this.store.setState('GET_SELECTED_PRODUCT_ERROR', oldState);
    }
  }

  viewCart() {
    return this.store.getState().shoppingCart.slice();
  }

  getSubtotal() {
    const cart = this.store.getState().shoppingCart;
    return cart
      .reduce((total, item) => (total += item.quantity * item.pricePerUnit), 0)
      .toFixed(2);
  }

  private createItemPool(state: State): Array<ProductItem> {
    //create item pool from all the different possible sections.
    //An item might exist in the featured items section but not necessarily
    //be in the products list etc. which contains items from a specific category
    const pool: Array<ProductItem> = [];

    //add items from all sections to the pool
    const sections = Object.keys(state.featuredItems);
    sections.forEach((section) => {
      pool.push(...state.featuredItems[section].items);
    });

    //add items from the products object
    pool.push(...state.products.items);

    return pool;
  }
}

export default StoreController;
