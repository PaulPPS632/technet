import { Component } from '@angular/core';
import { ListaIngresoComponent } from '../gestion/lista-ingreso/lista-ingreso.component';
import { ListaSalidaComponent } from '../gestion/lista-salida/lista-salida.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comprobantes',
  standalone: true,
  imports: [ListaIngresoComponent, ListaSalidaComponent, FormsModule, CommonModule],
  templateUrl: './comprobantes.component.html',
})
export default class ComprobantesComponent {

  ListaSeleccionada = 'salidas';

  get flag(): boolean{
    return this.ListaSeleccionada=='salidas';
  }

}
