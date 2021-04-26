//Objects subscribing to the store must implement this interface.
export interface Subscriber {
  /**
   * To be called after the Store's state was updated.
   * @param state - the new state.
   */
  update(state: object): void;
}

//All components must implement this interface
export interface Component {
  shouldComponentUpdate: boolean;

  /**
   * To be called for the initial rendering of a component.
   */
  render(selector: string): void;

  /**
   * Used to remove all its child components from the dom and their     clean up their listeners.
   */
  clear(): void;

  /**
   * Used to remove the component from the dom. Clear should be called inside of this method.
   */
  remove(): void;
}

export interface CartItem {
  name: string;
  quantity: number;
  id: string;
  //price for a single item
  pricePerUnit: number;
  image: string;
}

//The global state must implement this interface
export interface State {
  shoppingCart: Array<CartItem>;
}
