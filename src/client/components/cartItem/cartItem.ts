import { CartItem } from '@/types';

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
        <span class="cart-item__single-price"><span class="visually-hidden">Price for one item</span>$${pricePerUnit}</span>
      </div>

      <div class="cart-item__mid-section">
        <div class="cart-item__mid-section__inner-left">
          <div class="cart-item__label-combo cart-item__quantity-box">
            <span aria-hidden="true" class="font-med">Qty:</span>
            <select aria-label="Quantity" data-prod-quantity data-prod-id="${id}">
              ${buildSelectOptions(10, quantity)}
            </select>
          </div>
          
          <div class="cart-item__label-combo">
            <span class="font-sm visually-hidden">Total price for this item:</span>
            <span class="font-lg" id=${'total-' + id}>$${
    quantity * pricePerUnit
  }</span>
          </div>

        </div>

        <button aria-describedby="rmv-action" class="cart-item__remove-item btn-remove" data-prod-id="${id}">Remove</button>
        <span role="presentation" id="rmv-action" class="visually-hidden">Remove this item from your cart</span>
      </div>

      
    </div>
  </div>
  `;
}

function buildSelectOptions(total: number, currentValue: number): string {
  let options: string[] = [];

  for (let i = 1; i <= total; i++) {
    options.push(
      i === currentValue
        ? `<option selected value="${i}">${i}</option>`
        : `<option value="${i}">${i}</option>`
    );
  }

  return options.join('');
}
