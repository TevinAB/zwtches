export type StoreEvents =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'ITEM_QTY_CHANGE'
  | 'GET_PRODUCTS';

//Objects subscribing to the store must implement this interface.
export interface Subscriber {
  /**
   * To be called after the Store's state was updated.
   * @param state - the new state.
   */
  update(state: State): void;
}

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
}
