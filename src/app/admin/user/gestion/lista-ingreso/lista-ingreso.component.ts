import { Component } from '@angular/core';
import { CompraResponse } from '../../../models/compra-request';
import { RegistroCompraService } from '../../../services/registro-compra.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-ingreso',
  standalone: true,
  imports: [ CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './lista-ingreso.component.html',
  styles: ``
})
export class ListaIngresoComponent {

  Compras: CompraResponse[]=[];
  constructor(private ventaService: RegistroCompraService){
    ventaService.Listar().subscribe(
      (data: CompraResponse[]) =>{
        this.Compras = data;
        console.log(data);
      }
    )
  }
}
