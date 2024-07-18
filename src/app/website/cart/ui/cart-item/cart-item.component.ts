import { Component, input, output } from '@angular/core';
import { ProductItemCart } from '../../../interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-item.component.html',
})
export class CartItemComponent {

  url= environment.API_URL;
  
  productCartItem = input.required<ProductItemCart>();

  onRemove = output<string>();

  onIncrease = output<ProductItemCart>();

  onDecrease = output<ProductItemCart>();
}