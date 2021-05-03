import { CartItem } from '@/types';
import cartItem from './cartItem';

describe('Cart item component', () => {
  let appElement: HTMLElement | null;
  const product: CartItem = {
    name: 'Breguet Double',
    quantity: 2,
    id: '92-123',
    pricePerUnit: 327,
    permaLink: 'awSjix',
    image:
      'https://images-na.ssl-images-amazon.com/images/I/81tL%2BP0Qj4L._AC_UY879_.jpg',
  };
  let cartComponent = cartItem.bind(null, product);

  beforeEach(() => {
    appElement = document.getElementById('root');
    //clear the element
    if (appElement) {
      appElement.innerHTML = '';
    } else {
      appElement = document.createElement('div');
      appElement.setAttribute('id', 'root');
      document.body.appendChild(appElement);
    }
  });

  it('should render an image element', () => {
    if (appElement) appElement.innerHTML = cartComponent();

    const imgType = document.querySelector('.cart-item__img')?.tagName;

    expect(imgType);
    expect(imgType).toBe('IMG');
  });

  it('should render the quantity select element', () => {
    if (appElement) appElement.innerHTML = cartComponent();

    const quantitySelect = document.querySelector('select[data-prod-quantity]');
    expect(quantitySelect);
    expect(quantitySelect?.getAttribute('data-prod-id')).toBe(product.id);
  });

  it("should render an anchor element with the text set to the product's name", () => {
    if (appElement) appElement.innerHTML = cartComponent();

    const anchor = document.querySelector('a[data-link]');
    expect(anchor);
    expect(anchor?.innerHTML).toBe(product.name);
    expect(anchor?.getAttribute('href')).toBe(`/product/${product.permaLink}`);
  });

  it('should display the price for one unit of the item', () => {
    if (appElement) appElement.innerHTML = cartComponent();

    const pricePerUnit = document.querySelector('.cart-item__single-price');

    expect(pricePerUnit).not.toBe(null);
  });

  it('should have a button to remove this cart item from the cart', () => {
    if (appElement) appElement.innerHTML = cartComponent();

    const removeBtn = document.querySelector('.cart-item__remove-item');

    expect(removeBtn).not.toBe(null);
    expect(removeBtn?.getAttribute('data-prod-id')).toBe(product.id);
  });

  it('should render text to display the total price of the item', () => {
    if (appElement) appElement.innerHTML = cartComponent();

    const totalPrice = document.querySelector(`#total-${product.id}`);

    expect(totalPrice?.innerHTML).toBe(
      `$${product.quantity * product.pricePerUnit}`
    );
  });
});
