import { State, View } from '@/types';
import StoreController from '@/storeController/controller';
import loadError from '@/components/loadError/loadError';
import { setAddToCartListeners } from '@/utils/utils';

class ProductPage implements View {
  private productPage: HTMLElement;

  private controller: StoreController;
  private productPermalink: string;

  private unsubscribe: Array<() => void> = [];

  constructor(controller: StoreController, location: Location) {
    this.productPage = document.createElement('div');
    this.productPage.classList.add('product-page');

    //permalink is at the the end of the url
    this.productPermalink = location.pathname.split('/').pop() || '';

    this.controller = controller;

    this.unsubscribe.push(
      this.controller.subscribeToStore(
        'GET_SELECTED_PRODUCT',
        this.handleGetProduct.bind(this)
      )
    );

    this.unsubscribe.push(
      this.controller.subscribeToStore(
        'GET_SELECTED_PRODUCT_ERROR',
        this.handleGetProductFailure.bind(this)
      )
    );
  }

  async render() {
    await this.controller.getSelectedProduct({
      permalink: this.productPermalink,
    });

    return this.productPage;
  }

  afterRender() {
    setAddToCartListeners(this.productPage, this.controller);
  }

  private handleGetProduct(state: State) {
    this.productPage.innerHTML = '';
    const product = state.selectedProduct;

    const id = product ? product.id : '';
    const price = product ? product.price.raw.toFixed(2) : 0;
    const description = product ? product.description : '';
    const isInCart = state.shoppingCart.find((item) => item.id === id);

    this.productPage.innerHTML = `
    <div class="product-page__img-container">
      <img src="${product?.media.source}"/>
    </div>
    <div class="product-page__details-container">
      <h2 class="product-page__product-name">${product?.name}</h2>
      <div class="product-page__price-box">
        <h3>$${price}</h3>
        <div>
          <button type="button" class="btn btn--add-to-cart ${
            isInCart ? 'hidden' : ''
          }" data-prod-id="${id}">Add to cart</button>
          <span class="${
            isInCart ? '' : 'hidden'
          } font-bold" aria-label=".. In cart.">In cart.</span>
        </div>
      </div>
      <div class="product-page__descr-box">
        ${description}
      </div>
    </div>
    `;
  }

  private handleGetProductFailure(state: State) {
    this.productPage.innerHTML = '';

    const error = loadError();

    this.productPage.appendChild(error);
  }

  unmount() {
    this.unsubscribe.forEach((unsubFunc) => unsubFunc());
  }
}

export default ProductPage;
