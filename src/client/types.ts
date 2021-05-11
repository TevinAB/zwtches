export type EventTypes =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'ITEM_QTY_CHANGE'
  | 'GET_PRODUCTS';

//All components must implement this interface
export interface View {
  shouldComponentUpdate?: boolean;

  /**
   * To be called for the initial rendering of a component.
   */
  render(): HTMLElement;

  /**
   * To be called after the render method - used to set event listeners.
   */
  afterRender(): void;

  /**
   * Used to remove all its child components from the dom and clean up their listeners.
   */
  clearChildren(): void;

  /**
   * Used to remove the component from the dom. Clear should be called inside of this method.
   */
  removeSelf(): void;
}

export interface CartItem {
  name: string;
  quantity: number;
  id: string;
  //price for a single item
  pricePerUnit: number;
  image: string;
  permaLink?: string;
}

//The global state must implement this interface
export interface State {
  shoppingCart: Array<CartItem>;
  //current page for the product catalog list
  currentPage: number;

  //products won't have any real type checking so be aware when using
  products: Array<{ [key: string]: any }>;
}
