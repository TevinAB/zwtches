export default function quantityBox(
  quantity: number,
  id: string,
  pricePerUnit: number
): string {
  return `
  <div class="cart-item__label-combo cart-item__quantity-box">
    <span aria-hidden="true" class="font-med">Qty:</span>
    <select aria-label="Quantity" data-prod-quantity data-prod-id="${id}"
    >${buildSelectOptions(10, quantity)}
    </select>
  </div>
  
  <div class="cart-item__label-combo">
    <span class="font-sm visually-hidden">Total price for this item.</span>
    <span class="font-lg" id=${
      'total-' + id
    } data-single-price="${pricePerUnit}"
    >$${(quantity * pricePerUnit).toFixed(2)}</span>
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
