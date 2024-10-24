import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DetalleVentaRequest } from '../../../models/venta-request';
import { ProductoResponse } from '../../../models/producto-response';
import { Entidad } from '../../../models/entidad-response';
import { ProductoService } from '../../../services/producto.service';
import { EntidadService } from '../../../services/entidad.service';
import { CotizacionService } from '../../../services/cotizacion.service';
@Component({
  selector: 'app-cotizacion',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, CommonModule],
  templateUrl: './cotizacion.component.html',
  styleUrl: './cotizacion.component.css',
})
export class CotizacionComponent implements OnInit {
  fechaEmision?: string;
  fechaVencimiento?: string;
  EditOpen = false;
  detalleVenta: DetalleVentaRequest[] = [];
  selectedProducto: string = '';
  selectedEntidad: string = '';
  entidad: string = '';
  entidades: Entidad[] = [];
  filtroEntidad: Entidad[] = [];
  idproductoSeleccionado: string = '';
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
  listaProductos: ProductoResponse[] = [];
  constructor(
    private productoService: ProductoService,
    private entidadService: EntidadService,
    private cotizacionService: CotizacionService,
  ) {}
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
      this.filtroEntidad = data;
    });
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
  ElegirSeries(idProducto: string | null) {
    if (idProducto) {
      let detalleProducto = this.ventaData.detalles.find(
        (detalle: DetalleVentaRequest) => detalle.id_producto == idProducto,
      );
      console.log(detalleProducto);
      if (!detalleProducto) {
        const producto = this.listaProductos.find((p) => p.id == idProducto);
        detalleProducto = {
          id_producto: idProducto,
          nombre: producto?.nombre,
          cantidad: 1, // Puedes ajustar según tus necesidades
          series: [],
          precio_unitario: producto?.precio, // Puedes ajustar según tus necesidades
          precio_total: producto?.precio,
        };
        this.ventaData.detalles.push(detalleProducto);
        //this.ventaData.precio_unitario = this.ventaData.precio_unitario + producto?.precio;
        //this.ventaData.total = this.ventaData.total ;
      }
    }
  }
  buscarCliente(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toLowerCase();

    if (searchText) {
      this.filtroEntidad = this.filtroEntidad.filter(
        (pro) =>
          //cambiar busqueda (id/nombre/marca) para buscar
          pro.documento.toLowerCase().includes(searchText) ||
          pro.nombre.toLowerCase().includes(searchText.toLowerCase()),
      );
    } else {
      this.filtroEntidad = this.entidades;
    }
  }
  ElegirEntidad() {
    const encontrada = this.entidades.find(
      (e) => e.id == this.ventaData.cliente.id,
    );
    this.entidad = encontrada?.nombre || '';
    this.ventaData.cliente.documento = encontrada?.documento;
    this.ventaData.cliente.nombre = encontrada?.nombre;
    this.ventaData.cliente.direccion = encontrada?.direccion;
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
