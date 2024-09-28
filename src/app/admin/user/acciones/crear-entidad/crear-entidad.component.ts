import { Component, OnInit } from '@angular/core';
import { Entidad } from '../../../models/entidad-response';
import { EntidadService } from '../../../services/entidad.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-entidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-entidad.component.html',
  styles: ``,
})
export class CrearEntidadComponent implements OnInit {
  nuevoCliente: any = {
    nombre: '',
    apellido: '',
    documento: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    id_tipoEntidad: 1,
    RolId: 2,
  };

  entidades: Entidad[] = [];

  constructor(private entidadService: EntidadService) {}

  ngOnInit(): void {
    this.cargarEntidades();
  }

  CreateOpen = false;

  openCModal() {
    this.CreateOpen = true;
  }

  cargarEntidades() {
    this.entidadService.getEntidades().subscribe(
      (response) => {
        this.entidades = response;
      },
      (error) => {
        console.error('Error al obtener entidades:', error);
      },
    );
  }

  crearEntidad() {
    this.entidadService.postEntidad(this.nuevoCliente).subscribe(
      (response) => {
        //actualizar lista clientes
        Swal.fire({
          icon: 'success',
          title: 'Venta Registrada',
          text: response.message,
        });
        this.cargarEntidades();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error en Compra',
          text: error.error.message,
        });
      },
    );
  }
}
