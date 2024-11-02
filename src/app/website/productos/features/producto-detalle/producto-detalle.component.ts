import { Component, inject, input, OnInit } from '@angular/core';
import { ProductDetailSateService } from '../../data-access/productos-detalle-state.service';
import { CartStateService } from '../../../data-access/cart-state.service';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../../admin/services/producto.service';
import { MonedaService } from '../../../../admin/services/moneda.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './producto-detalle.component.html',
  providers: [ProductDetailSateService],
  styleUrls: ['./producto-detalle.component.css'],
})
export default class ProductoDetalleComponent implements OnInit {
  url = environment.API_URL;
  productService = inject(ProductoService);
  cartState = inject(CartStateService).state;
  producto: any | null = null;
  imagenprincipal: string | undefined = '';
  id = input.required<string>();

  cambio: number = 1; // Valor inicial por defecto (soles a soles)
  precioEnDolares: number = 0;
  precios = {
    precioOrigSol: 0,
    precioOrigDolar: 0,
    precio5Sol: 0,
    precio5Dol: 0,
  };
  constructor(
    private route: ActivatedRoute,
    private mond: MonedaService,
  ) {}

  ngOnInit() {
    initFlowbite();
    // Obtener el producto primero
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.productService.getProductoById(id).subscribe((res) => {
        this.producto = res;
        this.imagenprincipal = this.producto.imagen_principal;

        // Luego obtener la tasa de cambio y hacer la conversión solo si el producto está disponible
        this.mond.getCambio().subscribe((data) => {
          this.cambio = data.rates.USD; // Asumiendo que recibes la tasa de cambio en USD
          this.convertirADolares(); // Convertir después de tener la tasa de cambio y el producto
        });
      });
    });
  }

  convertirADolares() {
    if (this.producto && this.producto.precio) {
      this.precios.precioOrigSol = this.producto.precio;
      this.precios.precioOrigDolar = this.producto.precio * this.cambio;

      this.precios.precio5Sol = this.producto.precio * 1.05;
      this.precios.precio5Dol = this.precios.precio5Sol * this.cambio;
    }
  }

  addToCart() {
    this.cartState.add({
      product: this.producto,
      quantity: 1,
    });
  }
  mostrarimg(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    this.imagenprincipal = imgElement.src;
  }
}
