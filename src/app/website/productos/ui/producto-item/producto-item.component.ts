import {
  AfterViewInit,
  Component,
  inject,
  Input,
  input,
  OnInit,
  output,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductoResponse } from '../../../../admin/models/producto-response';
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
export default class ProductoItemComponent {
  url = environment.API_URL;

  @Input() product: any;
  CartStateService = inject(CartStateService);
  constructor(private router: Router) {
    console.log(this.product);
  }
  Agregar() {
    this.CartStateService.state.add({
      product: this.product,
      quantity: 1,
    });
    /*
    if (agregado) {
      Swal.fire({
        icon: 'success',
        title: 'Agregado al carrito',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Seguir Comprando',
        denyButtonText: `Ir a Pagar`,
      }).then((result) => {
        if (result.isDenied) {
          this.router.navigate(['/carrito']);
        }
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Este curso ya está en el carrito',
        showCancelButton: true,
        confirmButtonText: 'OK',
      });
    }*/
  }
}
