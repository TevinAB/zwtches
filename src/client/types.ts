export type EventTypes =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'ITEM_QTY_CHANGE'
  | 'GET_PRODUCTS'
  | 'GET_PRODUCTS_ERROR'
  | 'GET_FEATURED_ITEMS'
  | 'GET_FEATURED_ITEMS_ERROR';

//All pages must implement this interface
export interface View {
  /**
   * To be called for the initial rendering of a component.
   */
  render(): HTMLElement | Promise<HTMLElement>;

  /**
   * To be called after the render method - used to set event listeners.
   */
  afterRender(): void;

  /**
   * Called before this view removed from the dom
   */
  unmount?(): void;
}

export interface CartItem {
  name: string;
  quantity: number;
  id: string;
  //price for a single item
  pricePerUnit: number;
  image: string;
  permaLink: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: { raw: number; formatted: number };
  media: { source: string };
  permalink: string;
}

export interface SectionData {
  title: string;
  items: Array<ProductItem>;
  category: string;
}

//The global state must implement this interface
export interface State {
  shoppingCart: Array<CartItem>;

  products: {
    items: Array<ProductItem>;
    lastPage: number;
  };

  featuredItems: {
    [key: string]: SectionData;
  };
}
