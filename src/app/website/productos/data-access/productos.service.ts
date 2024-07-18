import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../data-access/base-http.service';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { ProductoResponse } from '../../../admin/models/producto-response';

const LIMIT = 5;

@Injectable({ providedIn: 'root' })
export class ProductsService extends BaseHttpService {

  /*
  getProducts(page: number): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/producto`, {
      params: {
        limit: page * LIMIT,
      },
    });
  }
  */

  getProducts(page: number, size: number, sort: string, marcas: string, categorias: string, subcategoria: string): Observable<ProductoResponse[]> {
    //return this.http.get<any[]>(`${this.apiUrl}/inventory/producto`);
    return this.http.get<any[]>(`${this.apiUrl}/inventory/producto/paged`, {
      params: {
        page: page,
        size: size,
        marca: marcas,
        categoria: categorias,
        subcategoria: subcategoria,
        sort: sort
      },
    });
  }

  getProduct(id: string): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/inventory/producto/${id}`);
  }
}
