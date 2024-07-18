import { Component } from '@angular/core';
import { VentaResponse } from '../../../models/venta-request';
import { RegistroVentaService } from '../../../services/registro-venta.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-salida',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, CommonModule],
  templateUrl: './lista-salida.component.html',
  styles: ``
})
export class ListaSalidaComponent {

  Ventas: VentaResponse[]=[];
  constructor(private ventaService: RegistroVentaService){
    ventaService.Listar().subscribe(
      (data: VentaResponse[]) =>{
        this.Ventas = data;
        console.log(data);
      }
    )
  }

}
