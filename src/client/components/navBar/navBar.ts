export default function navBar(): string {
  return `
  <header class="nav">
    <a href="#app" class="skip-to-main visually-hidden">Skip to main content.</a>
    <a class="nav__logo" href="#" data-link aria-labelledby="home-link">Zwtches</a>
    <span id="home-link" class="visually-hidden" hidden>Link to home page.</span>

    <div class="nav__right-content">
      <a href="/cart" data-link aria-label="View your cart.">
        <i class="fas fa-shopping-cart nav__cart-icon"></i>
      </a>
      <span class="visually-hidden" aria-label="Number of items in your cart."></span>
      <span class="nav__cart-quantity">7</span>
    </div>
  </header>
  `;
}
