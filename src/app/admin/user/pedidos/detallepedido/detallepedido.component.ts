import { Component, inject, Input, OnChanges, output, SimpleChanges} from '@angular/core';
import { Pedido } from '../../../models/pedido-fomart';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'app-detallepedido',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './detallepedido.component.html',
  styleUrl: './detallepedido.component.css'
})
export class DetallepedidoComponent implements OnChanges{
  @Input() pedidoselect?: Pedido;
  pedidoService = inject(PedidoService);
  cambiorealizado = false;
  onRemoveModal = output<boolean>();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pedidoselect'] && this.pedidoselect) {
      // Aquí puedes realizar cualquier acción adicional cuando pedidoselect cambia
      this.cambiorealizado = true;
    }
  }
  
  Cambios(){
    if(this.pedidoselect){
      const pedidoenviar ={
        id: this.pedidoselect.id,
        fecha: this.pedidoselect.fecha,
        productos: JSON.stringify(this.pedidoselect.productos),
        datospago: JSON.stringify(this.pedidoselect.datospago),
        estado: this.pedidoselect.estado,
        username: this.pedidoselect.username
      }
      this.pedidoService.aplicarcambio(pedidoenviar).subscribe(res => this.onRemoveModal.emit(false));
    }
  }
  
}
