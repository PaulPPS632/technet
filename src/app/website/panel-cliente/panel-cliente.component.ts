import { Component, inject, OnInit } from '@angular/core';
import PedidosClienteComponent from './pedidos-cliente/pedidos-cliente.component';
import DatosClienteComponent from './datos-cliente/datos-cliente.component';
import { UserService } from '../../admin/services/user.service';
import { PedidoService } from '../../admin/services/pedido.service';
import { Pedido } from '../../admin/models/pedido-fomart';

@Component({
  selector: 'app-panel-cliente',
  standalone: true,
  imports: [PedidosClienteComponent, DatosClienteComponent],
  templateUrl: './panel-cliente.component.html',
  styleUrl: './panel-cliente.component.css'
})
export default class PanelClienteComponent{
  panel: string = "DATOS"
  Pedidos(){
    this.panel = "PEDIDOS";
  }
  Datos(){
    this.panel = "DATOS";
  }

}
