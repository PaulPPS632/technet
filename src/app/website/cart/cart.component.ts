import { Component, inject, OnInit, Renderer2 } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { CartItemComponent } from './ui/cart-item/cart-item.component';
import { CartStateService } from '../data-access/cart-state.service';
import { ProductItemCart } from '../interfaces/product.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent, CurrencyPipe],
  templateUrl: './cart.component.html',
  styles: ``,
})
export default class CartComponent implements OnInit{
  
  state = inject(CartStateService).state;
  private renderer: Renderer2;

  constructor(renderer: Renderer2) {
    this.renderer = renderer;
  }
  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'https://js.culqi.com/checkout-js';
    script.async = true;
    this.renderer.appendChild(document.body, script);
  }
  onRemove(id: string) {
    this.state.remove(id);
  }

  onIncrease(product: ProductItemCart) {
    this.state.udpate({
      product: product.product,
      quantity: product.quantity + 1,
    });
  }

  onDecrease(product: ProductItemCart) {
    this.state.udpate({
      ...product,
      quantity: product.quantity - 1,
    });
  }
}

