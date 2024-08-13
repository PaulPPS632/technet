import { Component, Input } from '@angular/core';
import { Pedido } from '../../../admin/models/pedido-fomart';

@Component({
  selector: 'app-detalle-pedido-cliente',
  standalone: true,
  imports: [],
  templateUrl: './detalle-pedido-cliente.component.html'
})
export class DetallePedidoClienteComponent {
  @Input() pedidoselect: Pedido | undefined;
}
