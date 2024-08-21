import { Component, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductoResponse } from '../../../../admin/models/producto-response';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-producto-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './producto-item.component.html',
  styles: ``
})
export  default  class ProductoItemComponent {

  url = environment.API_URL;
  
  product = input.required<ProductoResponse>();

  addToCart = output<ProductoResponse>();

  constructor(private router: Router){

  }

  add(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.product());
  }
}
