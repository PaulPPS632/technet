import { Component, input, OnInit, output } from '@angular/core';
import { ProductItemCart } from '../../../interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { NavigationEnd, Router } from '@angular/router';
import { initFlowbite } from 'flowbite'

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-item.component.html',
})
export class CartItemComponent implements OnInit {

  constructor(private router : Router){}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        initFlowbite();
      }
    });
  }

  url= environment.API_URL;

  productCartItem = input.required<ProductItemCart>();

  onRemove = output<string>();

  onIncrease = output<ProductItemCart>();

  onDecrease = output<ProductItemCart>();
}
