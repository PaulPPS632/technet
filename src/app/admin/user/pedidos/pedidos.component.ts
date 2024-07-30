import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { PedidoResponse } from '../../models/pedido';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DetallepedidoComponent } from "./detallepedido/detallepedido.component";
import { ProductItemCart } from '../../models/product.interface';
interface pedido {
  id:"",
  fecha: "",
  productos: any,
  datospago: any,
  estado: ""
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, CommonModule, DetallepedidoComponent],
  templateUrl: './pedidos.component.html',
  styles: ``
})
export class PedidosComponent implements OnInit {

  constructor(private pedidosService: PedidoService)
  {}
  DetalleOpen = false;
  pedidos: pedido[] = [];
  pedidoSelected: any;
  ngOnInit(): void {
    this.pedidosService.listar().subscribe(
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
