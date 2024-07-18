import { Component } from '@angular/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { ListaIngresoComponent } from '../gestion/lista-ingreso/lista-ingreso.component';
import { ListaSalidaComponent } from '../gestion/lista-salida/lista-salida.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comprobantes',
  standalone: true,
  imports: [SidebarComponent, ListaIngresoComponent, ListaSalidaComponent, FormsModule, CommonModule],
  templateUrl: './comprobantes.component.html',
})
export default class ComprobantesComponent {

  ListaSeleccionada : string = 'salidas';
  get flag(): boolean{
    return this.ListaSeleccionada=='salidas';
  }

}
