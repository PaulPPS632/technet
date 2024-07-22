import { Component, OnInit } from '@angular/core';
import { EntidadRequest } from '../../../models/entidad-request';
import { Entidad } from '../../../models/entidad-response';
import { EntidadService } from '../../../services/entidad.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-entidad',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './crear-entidad.component.html',
  styles: ``
})
export class CrearEntidadComponent implements OnInit {

  nuevoCliente: EntidadRequest = {
    nombre: '',
    documento: '',
    direccion: '',
    telefono: '',
    email: '',
    tipoEntidad: 0
  }

  entidades : Entidad[] = [];

  constructor(
    private entidadService: EntidadService) 
  {}

  ngOnInit(): void {
    this.cargarEntidades();
  }

  cargarEntidades() {
    this.entidadService.getEntidades().subscribe(response => {
      this.entidades = response;
    }, error => {
      console.error('Error al obtener entidades:', error);
    });
  }

  crearEntidad(){
    this.entidadService.postEntidad(this.nuevoCliente).subscribe({
      next: () => { 
        //actualizar lista clientes
        this.cargarEntidades();
        console.log('Nuevo cliente cargado.');
      }, error: (error) => {
      console.error('Error al crear nueva entidad:', error);
      }
    });
  }

}
