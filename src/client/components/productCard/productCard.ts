import { CartItem } from '@/types';
import { createProductPath } from '@/utils/utils';

export default function productCard(
  { name, image, pricePerUnit, id, permaLink }: CartItem,
  isInCart: boolean = false
): string {
  return `
  <div class="product-card">
    <a href=${createProductPath(permaLink)} data-link aria-label="${name}">
      <div class="product-card__img-container">
        <img
            class="product-card__img"
            src="${image}"
            alt=""
            role="presentation"
          />
      </div>
    </a>
    <div class="product-card__title">
      <a href=${createProductPath(permaLink)} data-link>${name}</a>
    </div>
    <div class="product-card__footer">
      <span class="font-med">
        <span class="visually-hidden">.Price.</span>$${pricePerUnit}
      </span>
      <button type="button" class="btn btn--add-to-cart ${
        isInCart ? 'hidden' : ''
      }" data-prod-id="${id}">Add to cart</button>
      <span class="${
        isInCart ? '' : 'hidden'
      } font-bold" aria-label=".. In cart.">In cart.</span>
    </div>
  </div>
  `;
}
