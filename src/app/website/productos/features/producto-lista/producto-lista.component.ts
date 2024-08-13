import { Component, inject, OnInit  } from '@angular/core';
import { ProductsSateService } from '../../data-access/productos-state.service';
import { ArchivosService } from '../../../../admin/services/archivos.service';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { ProductoService } from '../../../../admin/services/producto.service';
import { CarruselImgComponent } from "../carrusel-img/carrusel-img.component";
import CarruselCartproductComponent from '../carrusel-cartproduct/carrusel-cartproduct.component';


@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule, CarruselImgComponent, CarruselCartproductComponent],
  templateUrl: './producto-lista.component.html',
  providers: [ProductsSateService],
})

export default class ProductoListaComponent implements OnInit{

  imagenespublicitarias: { [key: string]: string[] } = {};
  productoService = inject(ProductoService);
  Categoria_Producto : any;
  constructor(
    private router: Router,
    private archivosService: ArchivosService
  ) {}

  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {  initFlowbite();})
      }
    });

    this.archivosService.getImagenesPublicitarias().subscribe((data) => {
      this.imagenespublicitarias = data;
      console.log(data);
    });

    this.productoService.getListadoCategoriaProducto(8).subscribe(res => {
      this.Categoria_Producto = res;
      console.log(this.ObjectKeys(res));
    })
  }


  ObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
