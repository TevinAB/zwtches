import StoreController from '@/storeController/controller';
import { State, View } from '@/types';
import cartItem from '@/components/cartItem/cartItem';
import { getRouterEventName } from '@/utils/utils';

class Cart implements View {
  controller: StoreController;
  unsubscribe: Array<() => void> = [];
  cart: HTMLElement;

  constructor(controller: StoreController) {
    this.cart = document.createElement('div');
    this.cart.classList.add('cart');

    this.controller = controller;

    this.unsubscribe.push(
      this.controller.subscribeToStore(
        'ITEM_QTY_CHANGE',
        this.handleQuantityChange.bind(this)
      )
    );

    this.unsubscribe.push(
      this.controller.subscribeToStore(
        'REMOVE_ITEM',
        this.handleRemoveItem.bind(this)
      )
    );
  }

  render() {
    const cart = this.controller.viewCart();
    this.cart.innerHTML = '';

    this.cart.innerHTML += `
    <h1>Inside your cart: ${cart.length} items</h1>
    <div class="cart__inner-container">
      <div class="cart__item-container">
        ${cart.map((item) => cartItem(item)).join('')}
      </div>
      <div class="cart__summary">
        <h2>Summary</h2>
        <div class="cart__summary__price-info">
          <h3>Subtotal:</h3>
          <h3 id="subtotal">$${this.controller.getSubtotal()}</h3>
        </div>
        <button class="btn btn--checkout">Checkout</button>
      </div>
    </div>
    `;
    return this.cart;
  }

  afterRender() {
    this.setSelectListeners();
    this.setRemoveButtonListeners();
    this.setCheckoutListener();
  }

  unmount() {
    this.unsubscribe.forEach((unsubFunc) => unsubFunc());
  }

  private setSelectListeners() {
    const quantitySelect: NodeListOf<HTMLSelectElement> = this.cart.querySelectorAll(
      '[data-prod-quantity]'
    );

    quantitySelect.forEach((select) =>
      select.addEventListener('change', (event) => {
        const value = Number(select.options[select.selectedIndex].value);
        const productId = select.getAttribute('data-prod-id') || '';

        //the scope is the parent container for both the select element and its associated price text.
        const scope = select.parentElement?.parentElement;

        //find totalPrice by id using the prod id that was on the select element
        const totalPrice = scope?.querySelector(`[id="total-${productId}"]`);
        const pricePerItem = Number(
          totalPrice?.getAttribute('data-single-price')
        );

        if (totalPrice) {
          const newTotal = (pricePerItem * value).toFixed(2);
          totalPrice.innerHTML = `$${newTotal}`;
        }

        //dispatch action to update store
        this.controller.changeItemQuantity({ productId, newQuantity: value });
      })
    );
  }

  private setRemoveButtonListeners() {
    const removeBtns: NodeListOf<HTMLButtonElement> = this.cart.querySelectorAll(
      '.btn--remove'
    );

    removeBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.getAttribute('data-prod-id') || '';

        this.controller.removeItem({ productId });
      });
    });
  }

  private setCheckoutListener() {
    const checkout = this.cart.querySelector(
      '.btn--checkout'
    ) as HTMLButtonElement;

    checkout.addEventListener('click', () => {
      history.pushState({}, '', '/checkout');
      window.dispatchEvent(new Event(getRouterEventName()));
    });
  }

  private handleQuantityChange(state: State) {
    const subTotal = this.cart.querySelector('[id="subtotal"]');
    if (subTotal) subTotal.innerHTML = `$${this.controller.getSubtotal()}`;
  }

  private handleRemoveItem(state: State) {
    //rerender view
    window.dispatchEvent(new Event(getRouterEventName()));
  }
}

export default Cart;
