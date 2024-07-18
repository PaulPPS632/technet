import { Component, inject, OnInit  } from '@angular/core';
import { ProductsSateService } from '../../data-access/productos-state.service';
import ProductoItemComponent from '../../ui/producto-item/producto-item.component';
import { CartStateService } from '../../../data-access/cart-state.service';
import { Product } from '../../../interfaces/product.interface';
import { ProductoResponse } from '../../../../admin/models/producto-response';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [ProductoItemComponent],
  templateUrl: './producto-lista.component.html',
  providers: [ProductsSateService],
})
export default class ProductoListaComponent implements OnInit{
 

  productsState = inject(ProductsSateService);
  cartState = inject(CartStateService).state;


  ngOnInit(): void {
    this.productsState.loadProducts(0, 5, '', '', '', '');
  }
  changePage() {
    const page = this.productsState.state().page + 1;
    this.productsState.changePage$.next({
      page: page,
      size: 10,
      sort: '',
      marca: '', // Puedes ajustar esto según tus necesidades
      categoria: '',
      subcategoria: ''
    });
  }

  addToCart(product: ProductoResponse) {
    this.cartState.add({
      product,
      quantity: 1,
    });
  }
}
