import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductsSateService } from '../../data-access/productos-state.service';
import { ArchivosService } from '../../../../admin/services/archivos.service';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { ProductoService } from '../../../../admin/services/producto.service';
import { CarruselImgComponent } from '../carrusel-img/carrusel-img.component';
import CarruselCartproductComponent from '../carrusel-cartproduct/carrusel-cartproduct.component';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
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
  }

  ObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
