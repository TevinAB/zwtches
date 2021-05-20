import { getRouterEventName } from '@/utils/utils';
import { View, State } from '@/types';
import StoreController from '@/store/controller';
import productCard from '@/components/productCard/productCard';
import pagination from '@/components/pagination/pagination';

class Catalog implements View {
  private controller: StoreController;
  private catalogPage: HTMLElement;
  private pageNumber: number;
  private category: string;

  //collection of all unsubscribe function for each subscription made
  private unsubscribe: Array<() => void> = [];

  constructor(controller: StoreController, params: URLSearchParams) {
    this.catalogPage = document.createElement('div');
    this.catalogPage.classList.add('catalog');

    this.pageNumber = Number(params.get('page'));
    this.category = params.get('cat') || '';

    this.controller = controller;

    this.unsubscribe.push(
      controller.subscribeToStore(
        'GET_PRODUCTS',
        this.handleGetProducts.bind(this)
      )
    );

    this.unsubscribe.push(
      controller.subscribeToStore(
        'GET_PRODUCTS_ERROR',
        this.handleGetProductsFailure.bind(this)
      )
    );
  }

  async render() {
    //get the products for the current page. Store will call our handleGetProducts
    await this.controller.getProducts({
      pageNumber: this.pageNumber,
      category: this.category,
    });

    return this.catalogPage;
  }

  handleGetProducts(state: State) {
    this.catalogPage.innerHTML = `
      <ul class="catalog__list">
        ${state.products.items
          .map(
            ({
              name,
              id,
              media: { source: image },
              price: { formatted: pricePerUnit },
              permalink,
            }) =>
              `
            <li>
              ${productCard(
                {
                  name,
                  id,
                  image,
                  pricePerUnit,
                  permaLink: permalink,
                  quantity: 0,
                },
                Boolean(state.shoppingCart.find((item) => item.id === id))
              )}
            </li>
          `
          )
          .join('')}
      </ul>
      ${pagination(
        this.pageNumber,
        state.products.lastPage,
        `?page&cat=${this.category}`,
        'page'
      )}
    `;
  }

  handleGetProductsFailure(state: State) {
    this.catalogPage.innerHTML = '';

    const errorMsg = document.createElement('h3');
    errorMsg.appendChild(
      document.createTextNode('Oops, an error has occurred!')
    );

    const reloadBtn = document.createElement('button');
    reloadBtn.classList.add('btn-reload');
    reloadBtn.innerHTML = '<i class="fas fa-redo"></i> Reload';
    reloadBtn.addEventListener('click', () => {
      window.dispatchEvent(new Event(getRouterEventName()));
    });

    this.catalogPage.appendChild(errorMsg);
    this.catalogPage.appendChild(reloadBtn);
  }

  afterRender() {
    //listeners on btns
    const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');
    addToCartBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const prodId = btn.getAttribute('data-prod-id') || '';

        this.controller.addItem({ productId: prodId });

        btn.classList.toggle('hidden');
        btn.nextElementSibling?.classList.toggle('hidden');
      });
    });
  }

  unmount() {
    //unsubscribe from store
    this.unsubscribe.forEach((func) => func());
  }
}

export default Catalog;
