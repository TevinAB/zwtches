import { CartItem } from '@/types';
import quantityBox from '@/components/quantityBox/quantityBox'

export default function CartItem({
  name,
  image,
  pricePerUnit,
  id,
  permaLink,
  quantity,
}: CartItem): string {
  return `
  <div class="cart-item">
    <img class="cart-item__img" src="${image}" alt=""/>
    <div class="cart-item__right-content">
      <div class="cart-item__title">
        <a class="font-bold" href="/product/${permaLink}" data-link>${name}</a>
        <span class="cart-item__single-price"><span class="visually-hidden">Price for one item.</span>$${pricePerUnit.toFixed(
          2
        )}</span>
      </div>

      <div class="cart-item__mid-section">
        <div class="cart-item__mid-section__inner-left">
          ${quantityBox(quantity,id,pricePerUnit)}
        </div>

        <button aria-describedby="rmv-action" class="cart-item__remove-item btn btn--remove" 
        data-prod-id="${id}" aria-label="Remove ${name} from your cart.">Remove</button>
      </div>
    </div>
  </div>
  `;
}
