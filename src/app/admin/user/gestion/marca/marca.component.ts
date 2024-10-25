import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CategoriaMarcaRequest } from '../../../models/categoriamarca-request';
import { CategoriaMarcaResponse } from '../../../models/categoriamarca-response';
import { MarcaRequest } from '../../../models/marca-request';
import { MarcaResponse } from '../../../models/marca-response';
import { CategoriamarcaService } from '../../../services/categoriamarca.service';
import { MarcaService } from '../../../services/marca.service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marca',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './marca.component.html',
  styles: ``,
})
export class MarcaComponent implements OnInit {
  MarcaSelect: number = 0;
  Marca: MarcaResponse[] = [];
  CategoriaMarca: CategoriaMarcaResponse[] = [];

  nuevaMarca: MarcaRequest = {
    nombre: '',
  };

  nuevaCategoriaMarca: CategoriaMarcaRequest = {
    nombre: '',
    id_marca: 0,
  };

  constructor(
    private marcaService: MarcaService,
    private categoriMarcarService: CategoriamarcaService,
  ) {}

  ngOnInit() {
    this.cargarMarca();
  }

  cargarMarca() {
    this.marcaService.getAll().subscribe(
      (response) => {
        this.Marca = response;
        console.log(this.Marca);
      },
      (error) => {
        console.error('Error al obtener las marcas:', error);
      },
    );
  }

  guardarMarca() {
    this.marcaService.postMarca(this.nuevaMarca).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Marca agregada',
          text: 'La Marca ha sido agregado al inventario.',
          timer: 1000,
        });
        //actualizar marca
        this.cargarMarca();
        this.openMCModal();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Marca no agregada',
          text: error,
        });
      },
    });
  }

  guardarCategoriaMarca() {
    this.nuevaCategoriaMarca.id_marca = this.MarcaSelect;

    this.marcaService.postCategoriaMarca(this.nuevaCategoriaMarca).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Categoria Marca agregada',
          text: 'La categoria marca ha sido agregada correctamente.',
          timer: 1000,
        });
        //actualizar Categoria Marca
        this.cargarCategoriaMarca();
        this.openSCModal();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar categoria marca',
          text: error,
        });
      },
    });

    this.nuevaCategoriaMarca = {
      nombre: '',
      id_marca: this.MarcaSelect,
    };
  }

  cargarCategoriaMarca() {
    this.marcaService.getSubs(this.MarcaSelect).subscribe(
      (data: CategoriaMarcaResponse[]) => {
        this.CategoriaMarca = data;
        console.log('Categoria marca cargada.');
      },
      (error) => {
        console.error('Error al obtener categoria marca: ', error);
      },
    );
  }

  seleccionarMarca(id: number) {
    this.MarcaSelect = id;

    this.marcaService.getSubs(this.MarcaSelect).subscribe(
      (data: CategoriaMarcaResponse[]) => {
        this.CategoriaMarca = data;
      },
      (error) => {
        console.error('Error: ', error);
      },
    );
  }

  eliminarCategoriaMarca(id: number) {
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
        this.categoriMarcarService.deleteCategoriaMarca(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'La categoria marca ha sido eliminada.',
              'success',
            );
            this.cargarCategoriaMarca();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar categoria marca',
              text: error,
            });
          },
        });
      }
    });
  }

  editarCategoriaMarca(id: number) {
    console.log(id);
  }

  MCOpen = false;
  SCOpen = false;

  openMCModal() {
    this.MCOpen = !this.MCOpen;
  }

  openSCModal() {
    //this.CreateOpen = true;
    this.SCOpen = !this.SCOpen;
  }
}
