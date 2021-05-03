import { screen } from '@testing-library/dom';
import { CartItem } from '@/types';
import productCard from './productCard';

describe('Product Card component', () => {
  let appElement: HTMLElement | null;
  let product: CartItem = {
    name: 'Breguet Double',
    quantity: 2,
    id: '92-123',
    pricePerUnit: 327,
    permaLink: 'awSjix',
    image:
      'https://images-na.ssl-images-amazon.com/images/I/81tL%2BP0Qj4L._AC_UY879_.jpg',
  };
  let cardComponent = productCard.bind(null, product);

  beforeEach(() => {
    appElement = document.getElementById('root');

    if (appElement) {
      appElement.innerHTML = '';
    } else {
      appElement = document.createElement('div');
      appElement.setAttribute('id', 'root');
      document.body.appendChild(appElement);
    }
  });

  it('should render an image element', () => {
    if (appElement) appElement.innerHTML = cardComponent();

    const img = document.querySelector('.product-card__img');
    expect(img).not.toBe(null);
    expect(img?.getAttribute('src')).toBe(product.image);
  });

  it("should render an anchor as a title using the product's name", () => {
    if (appElement) appElement.innerHTML = cardComponent();

    const title = document.querySelector('a[data-link]');

    expect(title).not.toBe(null);
    expect(title?.innerHTML).toBe(product.name);
    expect(title?.getAttribute('href')).toBe(`/products/${product.permaLink}`);
  });

  it('should show the price for the product item', () => {
    if (appElement) appElement.innerHTML = cardComponent();

    const price = screen.getByText(`$${product.pricePerUnit}`);
    expect(price).not.toBe(null);
  });

  it('should have an add to cart button', () => {
    if (appElement) appElement.innerHTML = cardComponent();

    const addToCart = document.querySelector('.btn-add-to-cart');
    expect(addToCart).not.toBe(null);
  });

  it('should have a span that says "In cart.", and it should be hidden by default', () => {
    if (appElement) appElement.innerHTML = cardComponent();

    const inCart = screen.getByText('In cart.');
    expect(inCart).not.toBe(null);
    expect(inCart.classList).toContain('hidden');
  });
});
