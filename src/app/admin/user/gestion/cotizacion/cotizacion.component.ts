import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DetalleVentaRequest } from '../../../models/venta-request';
import { ProductoResponse } from '../../../models/producto-response';
import { Entidad } from '../../../models/entidad-response';
import { ProductoService } from '../../../services/producto.service';
import { EntidadService } from '../../../services/entidad.service';
import { CotizacionService } from '../../../services/cotizacion.service';
import { SelectSearchComponent } from '../../../../components/select-search/select-search.component';
@Component({
  selector: 'app-cotizacion',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, CommonModule, SelectSearchComponent],
  templateUrl: './cotizacion.component.html',
  styleUrl: './cotizacion.component.css',
})
export class CotizacionComponent implements OnInit {
  @ViewChild('busqueda', { static: true }) inputBusqueda!: ElementRef;
  flagbusqueda: boolean;
  fechaEmision?: string;
  fechaVencimiento?: string;
  EditOpen = false;
  detalleVenta: DetalleVentaRequest[] = [];

  entidades: Entidad[] = [];
  listaProductos: ProductoResponse[] = [];

  ventaData: any = {
    cliente: {
      id: '',
      documento: '',
      nombre: '',
      direccion: '',
    },
    usuario_id: '',
    fecha_emision: new Date().toISOString(),
    fecha_vencimiento: new Date().toISOString(),
    nota: '',
    gravada: this.totalGravada,
    impuesto: this.igv,
    total: this.totalPagar,
    detalles: this.detalleVenta,
  };

  constructor(
    private productoService: ProductoService,
    private entidadService: EntidadService,
    private cotizacionService: CotizacionService,
  ) {
    this.flagbusqueda = false;
  }
  ngOnInit(): void {
    this.setFechaEmision();
    this.cargarProductos();
    this.cargarClientes();
  }
  guardarProductos() {
    this.ventaData.gravada = this.totalGravada;
    this.ventaData.impuesto = this.igv;
    this.ventaData.total = this.totalPagar;
    console.log(this.ventaData);
    this.cotizacionService.registrar(this.ventaData).subscribe((res) => {
      console.log(res);
      window.open(res.ruta, '_blank');
    });
  }
  cargarProductos() {
    this.productoService.getListaProductos().subscribe(
      (response: ProductoResponse[]) => {
        console.log(response);
        this.listaProductos = response;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      },
    );
  }
  cargarClientes() {
    this.entidadService.getEntidades().subscribe((data) => {
      this.entidades = data;
    });
  }

  clienteSearch(searchText: string) {
    this.entidadService.search(searchText).subscribe((data) => {
      this.entidades = data;
    });
  }
  clienteSelect(id: string) {
    const entidad = this.entidades.find((e) => e.id == id);
    this.ventaData.cliente.id = entidad?.id;
    this.ventaData.cliente.documento = entidad?.documento;
    this.ventaData.cliente.nombre = entidad?.nombre;
    this.ventaData.cliente.direccion = entidad?.direccion;
  }

  productSearch(searchText: string) {
    this.productoService.getProductoSearch(searchText).subscribe(
      (response: ProductoResponse[]) => {
        this.listaProductos = response;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      },
    );
  }
  seleccionar(id: string) {
    let detalleProducto = this.ventaData.detalles.find(
      (detalle: DetalleVentaRequest) => detalle.id_producto === id,
    );
    if (!detalleProducto) {
      const producto = this.listaProductos.find(
        (p: ProductoResponse) => p.id === id,
      );
      detalleProducto = {
        id_producto: producto?.id,
        nombre: producto?.nombre,
        cantidad: 1, // Puedes ajustar según tus necesidades
        series: [],
        precio_unitario: producto?.precio, // Puedes ajustar según tus necesidades
        precio_total: producto?.precio,
      };
      this.ventaData.detalles.push(detalleProducto);
    }
  }
  setFechaEmision(): void {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    // Formatear las fechas en 'yyyy-mm-dd'
    this.fechaEmision = `${year}-${month}-${day}`;
    this.fechaVencimiento = `${year}-${month}-${day}`;
  }
  recalcularPrecio(index: number): void {
    const producto = this.ventaData.detalles[index];
    if (producto.cantidad && producto.precio_unitario) {
      producto.precio_total = producto.cantidad * producto.precio_unitario;
    } else {
      producto.precio_total = 0;
    }
  }
  get totalGravada(): number {
    return this.totalPagar / 1.18;
  }

  get igv(): number {
    return this.totalGravada * 0.18;
  }

  get totalPagar(): number {
    return this.detalleVenta.reduce(
      (total, producto) => total + producto.precio_total,
      0,
    );
  }
  ToggleEModal() {
    this.EditOpen = !this.EditOpen;
  }
}
