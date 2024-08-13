import { Component} from '@angular/core';
import PedidosClienteComponent from './pedidos-cliente/pedidos-cliente.component';
import DatosClienteComponent from './datos-cliente/datos-cliente.component';


@Component({
  selector: 'app-panel-cliente',
  standalone: true,
  imports: [PedidosClienteComponent, DatosClienteComponent],
  templateUrl: './panel-cliente.component.html'
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
