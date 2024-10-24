import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroVentaService } from '../../services/registro-venta.service';
import { RegistroCompraService } from '../../services/registro-compra.service';

@Component({
  selector: 'app-comprobantes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './comprobantes.component.html',
})
export default class ComprobantesComponent implements OnInit {
  Documentos: any[] = [];
  constructor(
    private ventaService: RegistroVentaService,
    private compraService: RegistroCompraService,
  ) {}
  ngOnInit(): void {
    this.consulta('venta'); // Llamada con valor directo 'compra'
  }

  consulta(tipo: string | Event) {
    if (typeof tipo === 'string') {
      // Si 'tipo' es una cadena (cuando llamas directamente desde ngOnInit)
      this.realizarConsulta(tipo);
    } else {
      // Si 'tipo' es un evento (cuando llamas desde el select)
      const selectElement = tipo.target as HTMLSelectElement;
      this.realizarConsulta(selectElement.value);
    }
  }

  realizarConsulta(tipo: string) {
    if (tipo === 'venta') {
      this.ventaService.Listar().subscribe((data: any[]) => {
        this.Documentos = data;
      });
    } else if (tipo === 'compra') {
      this.compraService.Listar().subscribe((data: any[]) => {
        this.Documentos = data;
      });
    }
  }
}
