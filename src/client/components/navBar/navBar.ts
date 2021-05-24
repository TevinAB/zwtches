import { getRouterEventName } from '@/utils/utils';
import { State } from '@/types';
export default function navBar(cartQuantity: number = 0): string {
  return `
  <div class="nav">
    <div class="nav__container">
      <a href="#app" class="skip-to-main visually-hidden">Skip to main content.</a>
      <a class="nav__logo" href="/" data-link aria-labelledby="home-link">Zwtches</a>
      <span id="home-link" class="visually-hidden" hidden>Link to home page.</span>

      <nav>
        <ul class="nav__list">
          <li class="hide-on-md"><a href="/catalog?page=1&cat=men" data-link
          aria-label="Category, Men.">Men</a></li>
          <li class="hide-on-md"><a href="/catalog?page=1&cat=women" data-link
          aria-label="Category, Women.">Women</a></li>
          <li>
            <div class="nav__cart">
              <a href="/cart" data-link aria-label="View your cart.">
                <i class="fas fa-shopping-cart nav__cart-icon"></i>
              </a>
              <span class="visually-hidden" aria-label="Number of items in your cart."></span>
              <span class="nav__cart-quantity">${cartQuantity}</span>
            </div>
          </li>
          <li id="mobile-menu" class="hide-on-large"><i class="fas fa-bars"></i></li>
        </ul>
      </nav>
      <div class="nav__mobile hide-on-large">
        <ul>
          <li><a href="/catalog?page=1&cat=men" data-link>Men</a></li>
          <li><a href="/catalog?page=1&cat=women" data-link>Women</a></li>
        </ul>
      </div>
      
    </div>
  </div>
  `;
}

export function navAfterRender(scope: HTMLElement) {
  const body = document.querySelector('body');
  const menuBtn = document.getElementById('mobile-menu');
  const menu = scope.querySelector('.nav__mobile');

  menuBtn?.addEventListener('click', () => {
    menu?.classList.toggle('slide-in-left');
    body?.classList.toggle('stop-overflow');
  });

  //override links in nav
  const linksInNav = scope.querySelectorAll('[data-link]');
  linksInNav.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      history.pushState({}, '', link.getAttribute('href'));

      window.dispatchEvent(new Event(getRouterEventName()));
    });
  });
}

export function handleCartQtyChange(state: State) {
  const quantityText = document.querySelector('.nav__cart-quantity');
  if (quantityText) {
    quantityText.innerHTML = '' + state.shoppingCart.length;
  }
}
