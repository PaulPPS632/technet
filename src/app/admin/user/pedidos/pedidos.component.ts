import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { PedidoResponse } from '../../models/pedido';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, CommonModule],
  templateUrl: './pedidos.component.html',
  styles: ``
})
export class PedidosComponent implements OnInit {

  constructor(private pedidosService: PedidoService)
  {}
  
  pedidos: PedidoResponse[] = [];

  ngOnInit(): void {
    this.pedidosService.listar().subscribe(
      (data: PedidoResponse[]) =>{
        this.pedidos = data;
      }
    )
  }
}
