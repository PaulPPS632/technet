import { Component, inject, OnInit } from '@angular/core';
import { EntidadService } from '../../../services/entidad.service';
import { ProductoService } from '../../../services/producto.service';
import { RegistroCompraService } from '../../../services/registro-compra.service';
import { TipadoService } from '../../../services/tipado.service';
import { ProductoResponse } from '../../../models/producto-response';
import { TipadoDocumentos } from '../../../models/tipado-documentos';
import { RegistrarCompraRequest } from '../../../models/compra-request';
import { Entidad } from '../../../models/entidad-response';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SelectSearchComponent } from '../../../../components/select-search/select-search.component';

@Component({
  selector: 'app-fac-ingreso',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, CommonModule, SelectSearchComponent],
  templateUrl: './fac-ingreso.component.html',
  styles: ``,
})
export class FacIngresoComponent implements OnInit {
  //DATOS IMPORTADOS DE SERVICIOS
  listaProductos: ProductoResponse[] = [];
  listaEntidades: Entidad[] = [];
  tipadoDocumentos: TipadoDocumentos | undefined;

  //DATOS REACTIVOS DE APOYO
  SeriesProducto: string[] = [];

  productoselected: ProductoResponse | undefined;
  clienteselected: Entidad | undefined;
  //
  flagEDICION: boolean = true;
  constructor(
    private productoService: ProductoService,
    private tipadoService: TipadoService,
    private entidadService: EntidadService,
    private registroCompraService: RegistroCompraService,
    private route: ActivatedRoute,
  ) {}

  ventaData: RegistrarCompraRequest = {
    documento: 'F001-0000',
    documento_cliente: '',
    usuario_id: '',
    id_tipocondicion: 1,
    id_tipopago: 1,
    id_tipomoneda: 1,
    tipo_cambio: 3,
    fecha_emision: '2024-06-01T15:30:00.000',
    fecha_vencimiento: '2024-06-01T15:30:00.000',
    nota: '',

    gravada: this.totalGravada,
    impuesto: this.igv,
    total: this.totalPagar,

    fechapago: '2024-06-01T15:30:00.000',
    formapago: '',

    detalles: [],
  };
  ngOnInit(): void {
    this.setFechaEmision();
    this.cargarProductos();
    this.cargarTipado();
    this.cargarClientes();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.flagEDICION = false;
      this.cargarIngreso(id); // Función que carga datos del backend
    }
  }
  cargarIngreso(id: string) {
    this.registroCompraService
      .getCompra(id)
      .subscribe((data: RegistrarCompraRequest) => {
        this.ventaData = data;
        this.clienteselected = this.listaEntidades.find(
          (entidad: Entidad) => entidad.id === this.ventaData.documento_cliente,
        );
      });
  }
  verModalSeries(index: number) {
    this.SeriesProducto = this.ventaData.detalles[index].series;
    this.toggleInsertModal();
  }
  guardarProductos() {
    if (!this.flagEDICION) {
      Swal.fire({
        icon: 'info',
        title: 'NO SE PUEDE REGISTRAR',
        text: 'no se puede modificar una compra ya registrada',
      });
      return;
    }
    this.ventaData.gravada = this.totalGravada;
    this.ventaData.impuesto = this.igv;
    this.ventaData.total = this.totalPagar;
    if (!this.ventaData.fecha_emision?.includes('T00:00:00.00')) {
      this.ventaData.fecha_emision = `${this.ventaData.fecha_emision}T00:00:00.00`;
    }
    if (!this.ventaData.fecha_vencimiento?.includes('T00:00:00.00')) {
      this.ventaData.fecha_vencimiento = `${this.ventaData.fecha_vencimiento}T00:00:00.00`;
    }
    if (!this.ventaData.fechapago?.includes('T00:00:00.00')) {
      this.ventaData.fechapago = `${this.ventaData.fechapago}T00:00:00.00`;
    }

    this.registroCompraService.registrar(this.ventaData).subscribe(
      (response) => {
        this.ventaData.detalles = [];
        Swal.fire({
          icon: 'success',
          title: 'Compra Registrada',
          text: response.message,
          timer: 1000,
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error en Compra',
          text: error.error.message,
        });
      },
    );
  }

  cargarProductos() {
    this.productoService.getListaProductosFact().subscribe(
      (response: any[]) => {
        this.listaProductos = response;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      },
    );
  }

  cargarTipado() {
    this.tipadoService.getTipadoDocumentos().subscribe(
      (data: TipadoDocumentos) => {
        this.tipadoDocumentos = data;
        this.ventaData.id_tipocondicion = data.tipocondiciones[0].id;
        this.ventaData.id_tipopago = data.tipopagos[0].id;
        this.ventaData.id_tipomoneda = data.tipomonedas[0].id;
      },
      (error) => {
        console.error('Error al obtener los tipos de documentos:', error);
      },
    );
  }

  cargarClientes() {
    this.entidadService.getEntidades().subscribe((data) => {
      this.listaEntidades = data;
    });
  }

  agregarProductoDetalle(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const serie = inputElement.value.trim();
    inputElement.value = '';
    const index = this.ventaData.detalles.findIndex(
      (p) => p.id_producto === this.productoselected?.id,
    );
    if (serie === '') return;
    if (index !== -1) {
      if (!this.ventaData.detalles[index].series.includes(serie)) {
        this.ventaData.detalles[index].series.push(serie);
        const cant = this.ventaData.detalles[index].cantidad + 1;
        this.ventaData.detalles[index].cantidad = cant;
        this.ventaData.detalles[index].precio_total =
          this.ventaData.detalles[index].precio_unitario * cant;
        this.SeriesProducto = this.ventaData.detalles[index].series;
      }
    } else {
      const producto = {
        id_producto: this.productoselected!.id,
        nombre: this.productoselected!.nombre,
        cantidad: 1, //1 porque asi empieza
        series: [serie],
        precio_unitario: this.productoselected!.precio,
        precio_total: this.productoselected!.precio,
      };

      this.ventaData.detalles.push(producto);
      this.SeriesProducto = [serie];
    }
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

  seleccionarProducto(id: string) {
    if (id) {
      const detalle = this.ventaData.detalles.find(
        (detalle) => detalle.id_producto == id,
      );

      if (detalle) {
        this.SeriesProducto = detalle.series;
      } else {
        this.SeriesProducto = [];
      }

      this.productoselected = this.listaProductos.find(
        (producto) => producto.id == id,
      );
      this.toggleInsertModal();
    }
  }
  deleteProducto(id: string) {
    this.ventaData.detalles = this.ventaData.detalles.filter(
      (detalle) => detalle.id_producto != id,
    );
  }

  clienteSearch(searchText: string) {
    this.entidadService.search(searchText).subscribe((data) => {
      this.listaEntidades = data;
    });
  }
  clienteSelect(id: string) {
    if (id) {
      this.ventaData.documento_cliente = id;
    }
  }

  setFechaEmision(): void {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    // Formatear las fechas en 'yyyy-mm-dd'
    this.ventaData.fecha_emision = `${year}-${month}-${day}`;
    this.ventaData.fecha_vencimiento = `${year}-${month}-${day}`;
    this.ventaData.fechapago = `${year}-${month}-${day}`;
  }

  SeleccionarSeriesProducto(sn: string) {
    const detalleProducto = this.ventaData.detalles.find(
      (detalle) => detalle.id_producto === this.productoselected?.id,
    );

    if (detalleProducto) {
      if (detalleProducto.cantidad == 1) {
        this.ventaData.detalles = this.ventaData.detalles.filter(
          (detalle) => detalle != detalleProducto,
        );
        this.SeriesProducto = [];
      } else {
        detalleProducto.series = detalleProducto.series.filter(
          (serie) => serie != sn,
        );
        const cant = detalleProducto.cantidad - 1;
        detalleProducto.cantidad = cant;
        detalleProducto.precio_total = detalleProducto.precio_unitario * cant;
        this.SeriesProducto = detalleProducto.series;
      }
    }
  }

  //total dinero
  get totalGravada(): number {
    return this.totalPagar / 1.18;
  }

  get igv(): number {
    return this.totalGravada * 0.18;
  }

  get totalPagar(): number {
    return this.ventaData?.detalles.reduce(
      (total, producto) => total + producto.precio_total,
      0,
    );
  }

  EditOpen = false;
  InsertOpen = false;

  openEModal() {
    this.EditOpen = true;
  }

  toggleInsertModal() {
    this.InsertOpen = !this.InsertOpen;
  }
  router = inject(Router);

  CrearNuevaEntidad() {
    this.router.navigate(['/dashboard/entidades']);
  }
}
