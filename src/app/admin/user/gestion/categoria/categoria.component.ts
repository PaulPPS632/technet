import { Component, OnInit } from '@angular/core';
import { CategoriaResponse } from '../../../models/categoria-response';
import Swal from 'sweetalert2';
import { CategoriaRequest } from '../../../models/categoria-request';
import { SubCategoriaRequest } from '../../../models/subcategoria-request';
import { SubCategoriaResponse } from '../../../models/subcategoria-response';
import { CategoriaService } from '../../../services/categoria.service';
import { SubcategoriaService } from '../../../services/subcategoria.service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './categoria.component.html',
  styles: ``,
})
export class CategoriaComponent implements OnInit {
  CategoriaSelect: number = 0;
  Categoria: CategoriaResponse[] = [];
  Subcategoria: SubCategoriaResponse[] = [];

  nuevaCategoria: CategoriaRequest = {
    nombre: '',
    descripcion: '',
  };

  nuevaSubcategoria: SubCategoriaRequest = {
    nombre: '',
    descripcion: '',
    id_categoria: 0,
  };

  constructor(
    private categoriaService: CategoriaService,
    private subcategoriaService: SubcategoriaService,
  ) {}

  ngOnInit() {
    this.cargarCategoria();
  }

  cargarCategoria() {
    this.categoriaService.getAll().subscribe(
      (response) => {
        this.Categoria = response;
        this.seleccionarCategoria(response[0].id);
      },
      (error) => {
        console.error('Error al obtener las categorias:', error);
      },
    );
  }

  guardarCategoria() {
    console.log(this.nuevaCategoria);
    this.categoriaService.postCategoria(this.nuevaCategoria).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Categoria agregada',
          text: 'La categoria ha sido agregado al inventario.',
        });
        //actualizar categoria
        this.cargarCategoria();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Categoria no agregada',
          text: error,
        });
      },
    });
  }

  guardarSubCategoria() {
    this.nuevaSubcategoria.id_categoria = this.CategoriaSelect;

    this.categoriaService.postSubCategoria(this.nuevaSubcategoria).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Subcategoría agregada',
          text: 'La subcategoría ha sido agregada correctamente.',
        });
        //actualizar subcategoria
        this.cargarSubcategorias();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar subcategoría',
          text: error,
        });
      },
    });

    this.nuevaSubcategoria = {
      nombre: '',
      descripcion: '',
      id_categoria: this.CategoriaSelect,
    };
  }

  cargarSubcategorias() {
    this.categoriaService.getSubs(this.CategoriaSelect).subscribe(
      (data: SubCategoriaResponse[]) => {
        this.Subcategoria = data;
        console.log('Subcategoria cargada.');
      },
      (error) => {
        console.error('Error al obtener subcategorías: ', error);
      },
    );
  }

  seleccionarCategoria(id: number) {
    this.CategoriaSelect = id;

    this.categoriaService.getSubs(this.CategoriaSelect).subscribe(
      (data: SubCategoriaResponse[]) => {
        this.Subcategoria = data;
      },
      (error) => {
        console.error('Error: ', error);
      },
    );
  }

  eliminarSubCategoria(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.subcategoriaService.deleteSubCategoria(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'La subcategoría ha sido eliminada.',
              'success',
            );
            this.cargarSubcategorias();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar subcategoría',
              text: error,
            });
          },
        });
      }
    });
  }

  CCOpen = false;
  SCOpen = false;

  name_modal = 'CREAR';
  openCCModal() {
    this.name_modal = 'CREAR';
    this.CCOpen = true;
  }

  openSCModal() {
    //this.CreateOpen = true;
    this.name_modal = 'CREAR';
    this.SCOpen = true;
  }
}
