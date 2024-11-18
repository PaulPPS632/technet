import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroVentaService } from '../../services/registro-venta.service';
import { RegistroCompraService } from '../../services/registro-compra.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comprobantes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './comprobantes.component.html',
})
export default class ComprobantesComponent implements OnInit {
  Documentos: any[] = [];
  tipo: string = 'venta';

  page: number = 1;
  pageSize: number = 15;
  totalPages: number = 0;

  constructor(
    private ventaService: RegistroVentaService,
    private compraService: RegistroCompraService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.consulta(this.tipo); // Llamada con valor directo 'compra'
  }

  consulta(tipo: string | Event) {
    if (typeof tipo === 'string') {
      // Si 'tipo' es una cadena (cuando llamas directamente desde ngOnInit)
      this.realizarConsulta(tipo);
    } else {
      // Si 'tipo' es un evento (cuando llamas desde el select)
      const selectElement = tipo.target as HTMLSelectElement;
      if (this.tipo != selectElement.value) this.page = 1;
      this.realizarConsulta(selectElement.value);
    }
  }

  realizarConsulta(tipo: string) {
    if (tipo === 'venta') {
      this.tipo = 'venta';
      this.ventaService
        .getpagedVenta(this.page, this.pageSize)
        .subscribe((res: any) => {
          //this.Documentos = data;
          this.Documentos = res.documentos;
          //this.totalCotizaciones = res.total;
          this.totalPages = res.totalPages;
        });
    } else if (tipo === 'compra') {
      this.tipo = 'compra';
      this.compraService
        .getpagedCompra(this.page, this.pageSize)
        .subscribe((res: any) => {
          //this.Documentos = data;
          this.Documentos = res.documentos;
          //this.totalCotizaciones = res.total;
          this.totalPages = res.totalPages;
        });
    }
  }

  redireccionar(index: number) {
    const id = this.Documentos[index].id;
    console.log(id);
    if (this.tipo === 'compra') {
      this.router.navigate(['/dashboard/ingreso', id]);
    } else if (this.tipo === 'venta') {
      this.router.navigate(['/dashboard/salida', id]);
    }
  }
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.consulta(this.tipo);
  }
}
