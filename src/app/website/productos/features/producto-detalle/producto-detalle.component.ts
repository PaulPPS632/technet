import { Component, effect, inject, input, OnInit  } from '@angular/core';
import { ProductDetailSateService } from '../../data-access/productos-detalle-state.service';
import { CartStateService } from '../../../data-access/cart-state.service';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../../admin/services/producto.service';
import { ProductoRequest } from '../../../../admin/models/producto-request';
import { ProductoResponse } from '../../../../admin/models/producto-response';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './producto-detalle.component.html',
  providers: [ProductDetailSateService],
})
export default class ProductoDetalleComponent implements OnInit{

  url = environment.API_URL;
  productService = inject(ProductoService);
  cartState = inject(CartStateService).state;
  producto: any | null =null;
  imagenprincipal: string | undefined = '';
  id = input.required<string>();

  constructor(private route: ActivatedRoute) {

  }
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') ?? '';
      this.productService.getProductoById(id).subscribe(res =>{
        this.producto = res;
        this.imagenprincipal = this.producto.imagen_principal;
        console.log(this.producto);
      })
    });
  }
  addToCart() {
    this.cartState.add({
      product: this.producto,
      quantity: 1,
    });
  }
  mostrarimg(event: Event){
    const imgElement = event.target as HTMLImageElement;
    this.imagenprincipal = imgElement.src;
  }
  
}
