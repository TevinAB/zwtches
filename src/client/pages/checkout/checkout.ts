import { View } from '@/types';

class Checkout implements View {
  checkout: HTMLElement;

  constructor() {
    this.checkout = document.createElement('div');
    this.checkout.classList.add('checkout');
  }

  render() {
    return this.checkout;
  }

  afterRender() {
    //
  }

  unmount() {
    //
  }
}

export default Checkout;
