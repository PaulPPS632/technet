import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ICarouselItem } from './Icarrousel-item.metadata';

@Component({
  selector: 'app-carrusel-img',
  standalone: true,
  imports: [],
  templateUrl: './carrusel-img.component.html',
})

export class CarruselImgComponent implements OnInit, OnDestroy {

  @Input() height = 500;
  @Input() isFullScreen = false;
  @Input() imagenes: string[] = [];
  public items: ICarouselItem[] = [];
  public finalHeight: string | number = 0;
  public currentPosition = 0;
  private intervalId: any;

  constructor() { this.finalHeight = this.isFullScreen ? '100vh' : `${this.height}px`; }

  ngOnInit(): void {
    this.finalHeight = this.isFullScreen ? '100vh' : `${this.height}px`;
    this.generateItems();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  generateItems(): void {
    this.items = this.imagenes.map((image, index) => ({
      id: index,
      image: image,
      marginLeft: 0
    }));
  }

  setCurrentPosition(position: number): void {
    this.currentPosition = position;
    this.updateMarginLeft();
  }

  setNext(): void {
    this.currentPosition = (this.currentPosition + 1) % this.items.length;
    this.updateMarginLeft();
  }

  setBack(): void {
    this.currentPosition = (this.currentPosition - 1 + this.items.length) % this.items.length;
    this.updateMarginLeft();
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.setNext();
    }, 3000); // Cambia la imagen cada 3 segundos
  }

  private updateMarginLeft(): void {
    const item = this.items[0];
    if (item) {
      item.marginLeft = -100 * this.currentPosition;
    }
  }
}
