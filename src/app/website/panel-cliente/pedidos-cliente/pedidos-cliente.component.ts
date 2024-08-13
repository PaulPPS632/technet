import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../admin/services/pedido.service';
import { DetallePedidoClienteComponent } from "../detalle-pedido-cliente/detalle-pedido-cliente.component";
interface pedido {
  id:"",
  fecha: "",
  productos: any,
  datospago: any,
  estado: ""
}
@Component({
  selector: 'app-pedidos-cliente',
  standalone: true,
  imports: [DetallePedidoClienteComponent],
  templateUrl: './pedidos-cliente.component.html'
})
export default class PedidosClienteComponent implements OnInit {
  constructor(private pedidosService: PedidoService)
  {}
  pedidos: pedido[] = [];
  pedidoSelected: any;
  DetalleOpen = false;
  ngOnInit(): void {
    this.pedidosService.getPedidosByUsername().subscribe(
      (data: pedido[]) =>{
        data.forEach(element => {
          this.pedidos.push(
            {
              id: element.id,
              fecha: element.fecha,
              productos: JSON.parse(element.productos),
              datospago: JSON.parse(element.datospago),
              estado: element.estado
            }
          )
        });
      }
    )
  }
  Detalles(id: string | any){
    this.pedidoSelected  = this.pedidos.find(p => p.id == id);
    if(this.pedidoSelected) this.DetalleOpen = true;
  }
}
