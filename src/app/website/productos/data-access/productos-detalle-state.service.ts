import { Injectable, inject } from '@angular/core';
import { signalSlice } from 'ngxtension/signal-slice';
import { ProductsService } from './productos.service';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { ProductoResponse } from '../../../admin/models/producto-response';

interface State {
  product: ProductoResponse | null;
  status: 'loading' | 'success' | 'error';
}

@Injectable()
export class ProductDetailSateService {
  private productsService = inject(ProductsService);

  private initialState: State = {
    product: null,
    status: 'loading' as const,
  };
  private stateSubject = new BehaviorSubject<State>(this.initialState);
  state$ = this.stateSubject.asObservable();
  state = signalSlice({
    initialState: this.initialState,
    actionSources: {
      getById: (_state, $: Observable<string>) =>
        $.pipe(
          switchMap((id) => this.productsService.getProduct(id)),
          map((data) => ({ product: data, status: 'success' as const })),
        ),
    },
  });
}
