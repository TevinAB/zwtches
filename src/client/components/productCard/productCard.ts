import { CartItem } from '@/types';

export default function productCard({
  name,
  image,
  pricePerUnit,
  id,
  permaLink,
}: CartItem): string {
  return `
  <div class="product-card">
    <img
      class="product-card__img"
      src="${image}"
      alt=""
    />
    <div class="product-card__title">
      <a href="/products/${permaLink}" data-link>${name}</a>
    </div>
    <div class="product-card__footer">
      <span class="font-lg font-bold">
        <span class="visually-hidden">Price.</span>$${pricePerUnit}
      </span>
      <button type="button" class="btn-add-to-cart" data-prod-id="${id}">Add to cart</button>
      <span class="hidden">In cart.</span>
    </div>
  </div>
  `;
}
