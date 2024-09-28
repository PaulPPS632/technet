import { Component, inject, Input, OnInit } from '@angular/core';
import { CartStateService } from '../../../data-access/cart-state.service';
import ProductoItemComponent from '../../ui/producto-item/producto-item.component';
import { ProductoResponse } from '../../../../admin/models/producto-response';
export interface ICarouselProductItem {
  id: number;
  product: any;
  marginLeft?: number;
}
@Component({
  selector: 'app-carrusel-cartproduct',
  standalone: true,
  imports: [ProductoItemComponent],
  templateUrl: './carrusel-cartproduct.component.html',
})
export default class CarruselCartproductComponent implements OnInit {
  items: ICarouselProductItem[] = [];
  @Input() height = 200;
  @Input() productos: any[] = [];
  multiplePercentaje: number = 50;
  cartState = inject(CartStateService).state;
  public finalHeight: string | number = 0;
  public currentPosition = 0;
  constructor() {
    this.finalHeight = `${this.height}px`;
  }
  ngOnInit(): void {
    this.generateProductItems();
  }
  generateProductItems(): void {
    this.items = this.productos.map((product, index) => ({
      id: index,
      product: product,
      marginLeft: 0,
    }));
  }
  setNext() {
    let finalPercentage = 0;
    let nextPosition = this.currentPosition + 1;
    if (nextPosition <= this.items.length - 1) {
      finalPercentage = -this.multiplePercentaje * nextPosition;
    } else {
      nextPosition = 0;
    }
    const item = this.items.find((i) => i.id === 0);
    if (item) {
      item.marginLeft = finalPercentage;
    }
    this.currentPosition = nextPosition;
  }
  setBack() {
    let finalPercentage = 0;
    let backPosition = this.currentPosition - 1;
    if (backPosition >= 0) {
      finalPercentage = -this.multiplePercentaje * backPosition;
    } else {
      backPosition = this.items.length - 1;
      finalPercentage = -this.multiplePercentaje * backPosition;
    }
    const item = this.items.find((i) => i.id === 0);
    if (item) {
      item.marginLeft = finalPercentage;
    }
    this.currentPosition = backPosition;
  }
  addToCart(product: ProductoResponse) {
    this.cartState.add({
      product,
      quantity: 1,
    });
  }
}
