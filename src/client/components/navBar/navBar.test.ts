import { screen } from '@testing-library/dom';
import navBar from './navBar';

describe('NavBar component', () => {
  let headerContainer: HTMLElement | null;

  beforeEach(() => {
    headerContainer = document.getElementById('header');

    if (headerContainer) {
      headerContainer.innerHTML = '';
    } else {
      headerContainer = document.createElement('div');
      headerContainer.setAttribute('id', 'header');
      document.body.insertBefore(headerContainer, document.body.firstChild);
    }
  });

  it('should render a skip to main content link that is visually hidden', () => {
    if (headerContainer) headerContainer.innerHTML = navBar();

    const skipLink = screen.getByText('Skip to main content.');

    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute('href')).toBe('#app');
    expect(skipLink.classList).toContain('visually-hidden');
    expect(skipLink.classList).toContain('skip-to-main');
  });

  it('should render a logo element', () => {
    if (headerContainer) headerContainer.innerHTML = navBar();

    const logo = document.querySelector('.nav__logo');

    expect(logo).not.toBeNull();
    expect(logo?.tagName).toBe('A');
    expect(logo?.getAttribute('aria-labelledby')).toBe('home-link');
  });

  it('should render a visually hidden element that is used to label the logo', () => {
    if (headerContainer) headerContainer.innerHTML = navBar();

    const hidden = document.getElementById('home-link');

    expect(hidden).not.toBeNull();
    expect(hidden?.classList).toContain('visually-hidden');
    expect(hidden?.innerHTML).not.toBe('');
  });

  it('should render a cart element that links to /cart', () => {
    if (headerContainer) headerContainer.innerHTML = navBar();

    const cartElement = document.querySelector('a[href="/cart"]');
    const cartIcon = document.querySelector('.nav__cart-icon');

    expect(cartElement).not.toBeNull();
    expect(cartElement?.getAttribute('aria-label')).toBe('View your cart.');

    expect(cartIcon?.classList).not.toBeNull();
  });

  it('should render text that displays the number of items in the cart.', () => {
    if (headerContainer) headerContainer.innerHTML = navBar();

    const quantityText = document.querySelector('.nav__cart-quantity');

    expect(quantityText).not.toBeNull();
  });

  it('should render a visually hidden element with the aria-label set to "Number of items in your cart."', () => {
    if (headerContainer) headerContainer.innerHTML = navBar();

    const hiddenElement = document.querySelector(
      'span[aria-label="Number of items in your cart."]'
    );

    expect(hiddenElement).not.toBeNull();
    expect(hiddenElement?.classList).toContain('visually-hidden');
  });
});
