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
    script.src = 'https://sandbox-checkout.izipay.pe/payments/v1/js/index.js';
    script.async = true;
    this.renderer.appendChild(document.body, script);
  }
  pagar(){
    const iziConfig = {
      config: {
        transactionId: '{TRANSACTION_ID}',
        action: 'pay',
        merchantCode: '{MERCHANT_CODE}',
        order: {
          orderNumber: '{ORDER_NUMBER}',
          currency: 'PEN',
          amount: '1.50',
          processType: 'AT',
          merchantBuyerId: '{MERCHANT_CODE}',
          dateTimeTransaction: '1670258741603000',
        },
        billing: {
          firstName: 'Juan',
          lastName: 'Wick Quispe',
          email: 'jwickq@izi.com',
          phoneNumber: '958745896',
          street: 'Av. Jorge Chávez 275',
          city: 'Lima',
          state: 'Lima',
          country: 'PE',
          postalCode: '15038',
          documentType: 'DNI',
          document: '21458796',
        }
      },
    };

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

