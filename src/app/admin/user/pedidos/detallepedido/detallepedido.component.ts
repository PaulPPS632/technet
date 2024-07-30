import { Component, Input} from '@angular/core';
import { Pedido } from '../../../models/pedido-fomart';

@Component({
  selector: 'app-detallepedido',
  standalone: true,
  imports: [],
  templateUrl: './detallepedido.component.html',
  styleUrl: './detallepedido.component.css'
})
export class DetallepedidoComponent {
  @Input() pedidoselect: Pedido | undefined;

  
}
