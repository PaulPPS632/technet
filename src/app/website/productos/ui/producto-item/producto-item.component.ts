import { AfterViewInit, Component, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductoResponse } from '../../../../admin/models/producto-response';
import { environment } from '../../../../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-item',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './producto-item.component.html',
  styles: ``
})
export  default  class ProductoItemComponent implements AfterViewInit{

  url = environment.API_URL;
  
  product = input.required<ProductoResponse>();
  
  addToCart = output<ProductoResponse>();

  constructor(private router: Router){

  }
  ngAfterViewInit(): void {
    console.log("product item: ", this.product());
    console.log("product item id:", this.product().id);
  }

  add(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.product());
  }
}
