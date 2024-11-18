import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { CartStateService } from '../../../data-access/cart-state.service';

@Component({
  selector: 'app-producto-item',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './producto-item.component.html',
  styles: ``,
})
export default class ProductoItemComponent implements OnInit {
  url = environment.API_URL;
  imagen = '';
  @Input() product: any;
  CartStateService = inject(CartStateService);
  constructor(private router: Router) {}
  ngOnInit(): void {
    if (this.product) {
      this.imagen = this.product.imagen_principal;
    }
  }
  Agregar() {
    this.CartStateService.state.add({
      product: this.product,
      quantity: 1,
    });
    Swal.fire({
      icon: 'success',
      title: 'Agregado al carrito',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Seguir Comprando',
      denyButtonText: `Ir a Pagar`,
      denyButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isDenied) {
        this.router.navigate(['/carrito']);
      }
    });
  }
  changeImage() {
    this.imagen = this.product.imageurl[0];
  }
  revertImage() {
    this.imagen = this.product.imagen_principal;
  }
}
