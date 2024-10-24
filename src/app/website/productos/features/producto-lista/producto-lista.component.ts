import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProductsSateService } from '../../data-access/productos-state.service';
import { ArchivosService } from '../../../../admin/services/archivos.service';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { ProductoService } from '../../../../admin/services/producto.service';
import { CarruselImgComponent } from '../carrusel-img/carrusel-img.component';
import CarruselCartproductComponent from '../carrusel-cartproduct/carrusel-cartproduct.component';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';

register();
@Component({
  selector: 'app-producto-lista',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, CarruselImgComponent, CarruselCartproductComponent],
  templateUrl: './producto-lista.component.html',
  styleUrl: './producto-lista.component.css',
  providers: [ProductsSateService],
})
export default class ProductoListaComponent implements OnInit {
  imagenespublicitarias: { [key: string]: string[] } = {};
  productoService = inject(ProductoService);
  Categoria_Producto: any;
  nuevos: any[] = [];

  swiperElement = signal<SwiperContainer | null>(null);
  cdr = inject(ChangeDetectorRef);

  constructor(
    private router: Router,
    private archivosService: ArchivosService,
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          initFlowbite();
        });
      }
    });

    this.archivosService.getImagenesPublicitarias().subscribe((data) => {
      this.imagenespublicitarias = data;
    });

    this.productoService.getListadoCategoriaProducto(8).subscribe((res) => {
      this.Categoria_Producto = res.productosPorCategoria;
      this.nuevos = res.nuevos;
    });
    this.cdr.detectChanges();
    this.initSwiperCategorias();
  }
  initSwiperCategorias(): void {
    const swiperEl = document.querySelector('.swiper_categorias');
    const swiperOption: SwiperOptions = {
      // autoplay: {
      //   delay: 5000,
      // },
      //scrollbar: true,
      loop: true,
      navigation: {
        enabled: true,
        nextEl: '.swiper-button-next-categoria',
        prevEl: '.swiper-button-prev-categoria',
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
  ObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
