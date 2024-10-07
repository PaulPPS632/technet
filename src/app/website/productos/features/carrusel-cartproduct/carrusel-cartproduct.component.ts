import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { CartStateService } from '../../../data-access/cart-state.service';
import ProductoItemComponent from '../../ui/producto-item/producto-item.component';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { ProductoResponse } from '../../../../admin/models/producto-response';
import { CommonModule } from '@angular/common';

register();
@Component({
  selector: 'app-carrusel-cartproduct',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ProductoItemComponent, CommonModule],
  templateUrl: './carrusel-cartproduct.component.html',
})
export default class CarruselCartproductComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() title: string = '';
  @Input() id: string = 'swiper-' + Math.random().toString(36).substring(2, 15); // Generar un id único para cada carrusel

  swiperElement = signal<SwiperContainer | null>(null);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    console.log('CAROUSEL ITEMS: ', this.items);
    // swiper parameters
    console.log(this.title, this.items.length);
    this.cdr.detectChanges();
    const swiperEl = document.querySelector(`.${this.id}`);
    const maxSlidesPerView = 5;
    const swiperOption: SwiperOptions = {
      autoplay: {
        delay: 5000,
      },
      //scrollbar: true,
      loop: this.items.length > maxSlidesPerView,
      navigation: {
        enabled: true,
        nextEl: '.swiper-button-next-' + this.id,
        prevEl: '.swiper-button-prev-' + this.id,
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        825: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 5,
        },
      },
    };
    Object.assign(swiperEl!, swiperOption);
    this.swiperElement.set(swiperEl as SwiperContainer);

    this.swiperElement()?.initialize();
  }
}
