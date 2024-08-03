import { Component, inject, OnInit  } from '@angular/core';
import { ProductsSateService } from '../../data-access/productos-state.service';
import ProductoItemComponent from '../../ui/producto-item/producto-item.component';
import { CartStateService } from '../../../data-access/cart-state.service';
import { ProductoResponse } from '../../../../admin/models/producto-response';
import { ArchivosService } from '../../../../admin/services/archivos.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule ,ProductoItemComponent],
  templateUrl: './producto-lista.component.html',
  providers: [ProductsSateService],
})

export default class ProductoListaComponent implements OnInit{

  productsState = inject(ProductsSateService);

  cartState = inject(CartStateService).state;
  imagenespublicitarias: { [key: string]: string[] } = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private archivosService: ArchivosService
  ) {}

  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {  initFlowbite();})
      }
    });

    this.archivosService.getImagenesPublicitarias().subscribe((data) => {
      this.imagenespublicitarias = data;
      console.log(data);
    });

    this.productsState.loadProducts(0, '', 4, '', '', 'Laptops', '');

    /*
    const page = this.productsState.state().page + 1;

    this.productsState.changePage$.next({
      page: page,
      search: '',
      size: 4,
      sort: '',
      marca: '',
      categoria: 'PC',
      subcategoria: ''
    });
    */
  }

  changePage() {
    const page = this.productsState.state().page + 1;
    this.productsState.changePage$.next({
      page: page,
      search: '',
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

  ObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
