import { Injectable, inject } from '@angular/core';
import { signalSlice } from 'ngxtension/signal-slice';
import { ProductsService } from './productos.service';
import { Subject, catchError, map, of, switchMap } from 'rxjs';
import { ProductoResponse } from '../../../admin/models/producto-response';

interface State {
  products: ProductoResponse[];
  status: 'loading' | 'success' | 'error';
  page: number;
  search: string;
  marca: string;
  categoria: string;
  subcategoria: string;
  sort:string;
}

@Injectable()
export class ProductsSateService {
  private productoService = inject(ProductsService);

  private initialState: State = {
    products: [],
    status: 'loading' as const,
    page: 0,
    search: '',
    marca: '',
    categoria: '',
    subcategoria: '',
    sort: ''
  };

  changePage$ = new Subject<{
    page: number;
    search: string;
    size: number;
    sort: string;
    marca: string;
    categoria: string;
    subcategoria: string;
  }>();
  // Otros Subjects para filtros adicionales

  // Modificar loadProducts$ para usar el observable combinado de filtros
  loadProducts$ = this.changePage$.pipe(
    switchMap(params => this.productoService.getProducts(params.page, params.search ,params.size, params.sort, params.marca, params.categoria, params.subcategoria)),
    map(products => ({ products, status: 'success' as const })),
    catchError(() => {
      return of({
        products: [],
        status: 'error' as const,
      });
    }),
  );

  state = signalSlice({
    initialState: this.initialState,
    sources: [
      this.changePage$.pipe(
        map(params => ({
          page: params.page,
          search: params.search,
          size: params.size,
          sort: params.sort,
          marca: params.marca,
          categoria: params.categoria,
          subcategoria: params.subcategoria,
          status: 'loading' as const
        })),
      ),
      this.loadProducts$,
    ],
  });
  loadProducts(page: number, search: string,size: number, sort: string, marca: string, categoria: string, subcategoria: string): void {
    this.changePage$.next({ page, search, size, sort, marca, categoria, subcategoria });
  }
}
