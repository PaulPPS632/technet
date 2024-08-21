import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ProductItemCart } from '../../../../admin/models/product.interface';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite'

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-item.component.html',
})
export class CartItemComponent implements OnInit {

  constructor(private router : Router){}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //Flowbite se inicia después de que se haya cargado la pagina
        setTimeout(() => initFlowbite(), 0);
      }
    });
  }

  url= environment.API_URL;

  @Input() productCartItem!: ProductItemCart;

  @Output() Remove = new EventEmitter<string>();

  @Output() Increase = new EventEmitter<ProductItemCart>();

  @Output() Decrease = new EventEmitter<ProductItemCart>();

  handleDecrease() {
    if (this.productCartItem.quantity > 0) {
      this.Decrease.emit(this.productCartItem);
    }
  }

  handleIncrease() {
    this.Increase.emit(this.productCartItem);
  }

  handleRemove() {
    this.Remove.emit(this.productCartItem.product.id);
  }
}
