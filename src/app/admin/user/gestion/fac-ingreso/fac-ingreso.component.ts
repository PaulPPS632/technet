import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EntidadService } from '../../../services/entidad.service';
import { ProductoService } from '../../../services/producto.service';
import { RegistroCompraService } from '../../../services/registro-compra.service';
import { TipadoService } from '../../../services/tipado.service';
import { ProductoSerieResponse } from '../../../models/producto-serie-response';
import { ProductoResponse } from '../../../models/producto-response';
import { ProductoSerieRequest } from '../../../models/producto-serie-request';
import { TipadoDocumentos, TipoComprobante, TipoCondicion, TipoPago, TipoMoneda } from '../../../models/tipado-documentos';
import { RegistrarCompraRequest } from '../../../models/compra-request';
import { Entidad } from '../../../models/entidad-response';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fac-ingreso',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, CommonModule],
  templateUrl: './fac-ingreso.component.html',
  styles: ``
})
export class FacIngresoComponent implements OnInit {

  fechaEmision?: string;
  fechaVencimiento?: string;
  fechaPago?: string;

  producto: ProductoSerieResponse[] = [];

  //nuevos datos PAUL
  filtrolistaProductos: ProductoResponse[] =[];
  listaProductos: ProductoResponse[] =[];
  SeriesProducto: string[] = [];
  idproductoSeleccionado: string = '';
  nombreproductoSeleccionado: string ='';
  preciounitproductoSeleccionado: number = 0;
  modalRef: NgbModalRef | null = null;

  //fin nuevos paul
  tipadoDocumentos: TipadoDocumentos | undefined;
  tipoComprobante: TipoComprobante[] = [];
  tipoCondicion: TipoCondicion[] = [];
  tipoPago: TipoPago[] = [];
  tipoMoneda: TipoMoneda[] = [];

  tipoMonedaSelec:number = 0;

  productosSeleccionados: ProductoSerieRequest[] = [];

  nota: string = '';
  formaPago: string = '1';
  RegistroVentaService: any;

  documento: string ='F001-0000';
  tpSeleccionado: string = '' ;
  nSeleccionado: number = 1;

  serie: string = '';
  entidad: string = '';
  productoselect: ProductoResponse | null = null;
  selectedProducto: string = '';
  selectedEntidad: string = '';

  tipoCondSelec: number = 0;
  tipoPagoSelec: number = 0;

  productoSerie: ProductoResponse [] = [];

  constructor(
    private productoService: ProductoService,
    private tipadoService: TipadoService,
    private entidadService: EntidadService,
    private registroCompraService: RegistroCompraService)
  { }

  ventaData : RegistrarCompraRequest = {
    documento: this.documento,
    documento_cliente: this.entidad,
    usuario_id: '',
    id_tipocondicion: this.tipoCondSelec,
    id_tipopago: this.tipoPagoSelec,
    id_tipomoneda: this.tipoMonedaSelec,
    tipo_cambio: 0,
    fecha_emision: '2024-06-01T15:30:00.000',
    fecha_vencimiento: '2024-06-01T15:30:00.000',
    nota: this.nota,
    gravada: this.totalGravada,
    impuesto: this.igv,
    total: this.totalPagar,

    fechapago: '2024-06-01T15:30:00.000',
    formapago: this.formaPago,

    detalles: []

  };

  guardarProductos() {

    this.registroCompraService.registrar(this.ventaData).subscribe({
      next: () => {
        this.ventaData.detalles = [];
      },
      error: (error) => {

        console.log("Error al realizar el registro.");
        console.error('Error al realizar la venta:', error);
      }
    });

  }

  //arreglar
  removerProducto(producto: ProductoResponse): void {
    const index = this.productoSerie.findIndex(p => p.id === producto.id);

    if (index !== -1) {
      if (this.productoSerie[index].cantidad > 1) {
        this.productoSerie[index].cantidad--;
      } else {
        this.productoSerie.splice(index, 1);
      }

      // Eliminar la entrada correspondiente en detalleVenta
      this.ventaData.detalles = this.ventaData?.detalles.filter(detalle => detalle.id_producto !== producto.id);
    }
  }

  cargarProductos() {
    this.productoService.getListaProductos().subscribe((response: ProductoResponse[] )=> {
      this.listaProductos = response;
    }, error => {
      console.error('Error al obtener los productos:', error);
    });
  }

  //Llamar información documento
  cargarTipado(){
    this.tipadoService.getTipadoDocumentos().subscribe(
      data => {
        this.tipadoDocumentos = data;
        this.tipoComprobante = data.tipocomprobantes;
        this.tipoCondicion = data.tipocondiciones;
        this.tipoPago = data.tipopagos;
        this.tipoMoneda = data.tipomonedas;

        if (this.tipoComprobante.length > 0) {
          this.tpSeleccionado = this.tipoComprobante[0].prefijo;
        }
        if (this.tipoCondicion.length > 0) {
          this.tipoCondSelec = this.tipoCondicion[0].id;
        }
        if (this.tipoPago.length > 0) {
          this.tipoPagoSelec = this.tipoPago[0].id;
        }
        if (this.tipoMoneda.length > 0) {
          this.tipoMonedaSelec = this.tipoMoneda[0].id;
        }

      },
      error => {
        console.error('Error al obtener los tipos de documentos:', error);
      }
    );
  }

  //Lamar información cliente
  cargarClientes(){
    this.entidadService.getEntidades().subscribe(data => {
      this.entidades = data;
      this.filtroEntidad = data;
    });
  }

  agregarProductoDetalle(): void {

    const index = this.ventaData.detalles.findIndex(p => p.id_producto == this.idproductoSeleccionado);

    console.log('Index:', index);

    if (index !== -1) {
      this.ventaData.detalles[index].series.push(this.serie);
      const cant = this.ventaData.detalles[index].cantidad + 1;
      this.ventaData.detalles[index].cantidad = cant;
      this.ventaData.detalles[index].precio_total = this.ventaData.detalles[index].precio_unitario * cant;
      this.SeriesProducto = this.ventaData.detalles[index].series;
    } else {

      const producto = {
        id_producto: this.selectedProducto,
        nombre: this.nombreproductoSeleccionado,
        cantidad: 1, //1 porque asi empieza
        series: [this.serie],
        precio_unitario: this.preciounitproductoSeleccionado,
        precio_total: this.preciounitproductoSeleccionado * 1
      };
      this.ventaData.detalles.push(producto);
      this.SeriesProducto = [this.serie];
    }

    console.log('Detalle de venta:', this.ventaData.detalles);
  }

  //buscar producto: serie pertenece
  buscarProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toLowerCase();
    this.filtrolistaProductos = this.listaProductos;
    if (searchText) {
      this.listaProductos = this.listaProductos.filter(pro =>
        //cambiar busqueda (id/nombre/marca) para buscar
        pro.nombre.toLowerCase().includes(searchText)|| pro.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      this.listaProductos = this.filtrolistaProductos;
    }
  }

  entidades: Entidad [] = [];
  filtroEntidad: Entidad[] = [];

  ngOnInit(): void {
    this.setFechaEmision();
    this.cargarProductos();
    
    this.cargarTipado();
    this.cargarClientes();
  }

  buscarCliente(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toLowerCase();

    if (searchText) {
      this.filtroEntidad = this.filtroEntidad.filter(pro =>
        //cambiar busqueda (id/nombre/marca) para buscar
        pro.documento.toLowerCase().includes(searchText)|| pro.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      this.filtroEntidad = this.entidades;
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
    this.fechaPago = `${year}-${month}-${day}`;
  }

  ElegirSeries(idProducto: string | null) {
    if (idProducto) {
      this.idproductoSeleccionado = idProducto;

      const detalle = this.ventaData.detalles.find(detalle => detalle.id_producto === idProducto);
      if (detalle) {
        this.SeriesProducto = detalle.series;
      } else {
        this.SeriesProducto = [];
      }

      const producto = this.listaProductos.find(producto => producto.id === idProducto);
      if (producto) {
        this.nombreproductoSeleccionado = producto.nombre;
        this.preciounitproductoSeleccionado = producto.precio;
        this.openIModal();
      }
    }
  }


  SeleccionarSeriesProducto(sn: string) {
    const detalleProducto = this.ventaData.detalles.find(detalle => detalle.id_producto == this.idproductoSeleccionado);

    if (detalleProducto) {
      if (detalleProducto.cantidad == 1) {
        this.ventaData.detalles = this.ventaData.detalles.filter(detalle => detalle != detalleProducto);
        this.SeriesProducto = [];
      } else {
        detalleProducto.series = detalleProducto.series.filter(serie => serie != sn);
        const cant = detalleProducto.cantidad - 1;
        detalleProducto.cantidad = cant;
        detalleProducto.precio_total = detalleProducto.precio_unitario * cant;
        this.SeriesProducto = detalleProducto.series;
      }
    }
  }


  //clientes
  ElegirEntidad(){
    this.entidad = this.selectedEntidad;
    this.filtroEntidad = this.entidades;
  }
  ElegirProducto(){
    this.entidad = this.selectedEntidad;

  }

  //total dinero
  get totalGravada(): number {
    return this.totalPagar / 1.18;
  }

  get igv(): number {
    return this.totalGravada * 0.18;
  }

  get totalPagar(): number {
    return this.ventaData?.detalles.reduce((total, producto) => total + (producto.precio_total), 0);
  }

  EditOpen = false;
  InsertOpen = false

  openEModal() {
    this.EditOpen = true;
  }

  openIModal() {
    this.InsertOpen = true;
  }

}
