import { Component, OnInit } from '@angular/core';
import { ProductoSerieResponse } from '../../../models/producto-serie-response';
import { ProductoResponse } from '../../../models/producto-response';
import { TipadoDocumentos } from '../../../models/tipado-documentos';
import { Entidad } from '../../../models/entidad-response';
import { RegistrarVentaRequest } from '../../../models/venta-request';
import { CorrelativoService } from '../../../services/correlativo.service';
import { EntidadService } from '../../../services/entidad.service';
import { ProductoSerieService } from '../../../services/producto-serie.service';
import { ProductoService } from '../../../services/producto.service';
import { RegistroVentaService } from '../../../services/registro-venta.service';
import { TipadoService } from '../../../services/tipado.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectSearchComponent } from '../../../../components/select-search/select-search.component';

@Component({
  selector: 'app-fac-salida',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, CommonModule, SelectSearchComponent],
  templateUrl: './fac-salida.component.html',
})
export default class UsuarioVentaComponent implements OnInit {
  listaProductos: ProductoResponse[] = [];
  listaEntidades: Entidad[] = [];
  tipadoDocumentos: TipadoDocumentos | undefined;

  SeriesProducto: string[] = [];

  productoselected: ProductoResponse | undefined;
  clienteselected: Entidad | undefined;

  flagEDICION: boolean = true;

  // fechaEmision?: string;
  // fechaVencimiento?: string;
  // fechaPago?: string;

  // producto: ProductoSerieResponse[] = [];
  // //nuevos datos PAUL

  // idproductoSeleccionado: string = '';
  // nombreproductoSeleccionado: string = '';
  // preciounitproductoSeleccionado: number = 0;

  // //fin nuevos paul
  //
  // tipoComprobante: TipoComprobante[] = [];
  // tipoCondicion: TipoCondicion[] = [];
  // tipoPago: TipoPago[] = [];
  // tipoMoneda: TipoMoneda[] = [];

  // tipoMonedaSelec: number = 0;

  // productosSeleccionados: ProductoSerieRequest[] = [];

  // detalleVenta: DetalleVentaRequest[] = [];

  // nota: string = '';
  // tipoCambio: number = 3;
  // formaPago: string = '1';
  // RegistroVentaService: any;

  // prefijo: string = '';
  // numeracion: number = 0;
  // correlativo: number = 0;

  // tpSeleccionado: string = '';
  // nSeleccionado: number = 1;

  // serie: string = '';
  // entidad: string = '';
  // selectedProducto: string = '';
  // selectedEntidad: string = '';

  // tipoCondSelec: number = 0;
  // tipoPagoSelec: number = 0;

  // productoSerie: ProductoResponse[] = [];

  // entidades: Entidad[] = [];
  // filtroEntidad: Entidad[] = [];
  constructor(
    private productoService: ProductoService,
    private productoSerieService: ProductoSerieService,
    private tipadoService: TipadoService,
    private entidadService: EntidadService,
    private correlativoService: CorrelativoService,
    private registroVentaService: RegistroVentaService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  toggleDatePicker(fieldId: string) {
    const dateInput = document.getElementById(fieldId) as HTMLInputElement;
    dateInput.focus();
    dateInput.click();
  }

  ventaData: RegistrarVentaRequest = {
    prefijo: '',
    numeracion: 0,
    documento_cliente: '',
    usuario_id: '',
    id_tipocondicion: 1,
    id_tipopago: 1,
    id_tipomoneda: 1,
    tipo_cambio: 1,
    fecha_emision: new Date().toISOString(),
    fecha_vencimiento: new Date().toISOString(),
    nota: '',
    gravada: this.totalGravada,
    impuesto: this.igv,
    total: this.totalPagar,
    fechapago: new Date().toISOString(),
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
    this.registroVentaService
      .getVenta(id)
      .subscribe((data: RegistrarVentaRequest) => {
        this.ventaData = data;
        this.clienteselected = this.listaEntidades.find(
          (entidad: Entidad) => entidad.id === this.ventaData.documento_cliente,
        );
      });
  }

  guardarProductos() {
    if (!this.flagEDICION) {
      Swal.fire({
        icon: 'info',
        title: 'NO SE PUEDE REGISTRAR',
        text: 'no se puede modificar una venta ya registrada',
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
    this.registroVentaService.registrar(this.ventaData).subscribe(
      (response) => {
        this.ventaData.detalles = [];
        this.setFechaEmision();
        Swal.fire({
          icon: 'success',
          title: 'Venta Registrada',
          text: response.message,
          timer: 1000,
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error en Venta',
          text: error.error.message,
        });
      },
    );
  }

  //arreglar
  // removerProducto(producto: ProductoResponse): void {
  //   const index = this.productoSerie.findIndex((p) => p.id === producto.id);

  //   if (index !== -1) {
  //     if (this.productoSerie[index].cantidad > 1) {
  //       this.productoSerie[index].cantidad--;
  //     } else {
  //       this.productoSerie.splice(index, 1);
  //     }

  //     // Eliminar la entrada correspondiente en detalleVenta
  //     this.detalleVenta = this.detalleVenta.filter(
  //       (detalle) => detalle.id_producto !== producto.id,
  //     );
  //   }
  // }

  cargarProductos() {
    this.productoService.getListaProductos().subscribe(
      (response: ProductoResponse[]) => {
        this.listaProductos = response;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      },
    );
  }

  cargarTipado() {
    this.tipadoService.getTipadoDocumentos().subscribe(
      (data) => {
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
  // ElegirSeries(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const idProducto = inputElement.value.toLowerCase();
  //   if (idProducto) {
  //     this.productoSerieService.getSeriesByProductoId(idProducto).subscribe(
  //       (res: ProductoSerieResponse[]) => {
  //         this.SeriesProducto = res;
  //         this.idproductoSeleccionado = idProducto;
  //         const productoSeleccionado = this.listaProductos.find(
  //           (item) => item.id === idProducto,
  //         );
  //         if (productoSeleccionado) {
  //           this.nombreproductoSeleccionado = productoSeleccionado.nombre;
  //           this.preciounitproductoSeleccionado = productoSeleccionado.precio;
  //         }

  //         this.openIModal();
  //       },
  //       (error) => {
  //         console.error('Error al obtener las series del producto:', error);
  //         // Manejo de errores según sea necesario
  //       },
  //     );
  //   }
  // }
  seleccionarProducto(id: string) {
    if (id) {
      this.productoSerieService.getSeriesByProductoId(id).subscribe(
        (res: ProductoSerieResponse[]) => {
          this.SeriesProducto = res.map((series) => series.sn);
          this.productoselected = this.listaProductos.find(
            (item) => item.id === id,
          );
          this.openIModal();
        },
        (error) => {
          console.error('Error al obtener las series del producto:', error);
          // Manejo de errores según sea necesario
        },
      );
    }
  }

  //buscar producto: serie pertenece
  buscarProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const serie = inputElement.value.trim();
    inputElement.value = '';
    this.productoSerieService.getProductoSerie(serie).subscribe(
      (data) => {
        if (data == null) return;
        this.productoselected = data;

        let detalleProducto = this.ventaData.detalles.find(
          (detalle) => detalle.id_producto == this.productoselected?.id,
        );

        if (!detalleProducto) {
          detalleProducto = {
            id_producto: this.productoselected.id,
            nombre: this.productoselected.nombre,
            cantidad: 0, // Puedes ajustar según tus necesidades
            series: [],
            precio_unitario: this.productoselected.precio, // Puedes ajustar según tus necesidades
            precio_total: 0,
          };
          this.ventaData.detalles.push(detalleProducto);
        }

        const serieIndex = detalleProducto.series.includes(serie);

        if (!serieIndex) {
          // Si la serie no está en el array, agrégala
          detalleProducto.series.push(serie);
          detalleProducto.cantidad += 1;
          detalleProducto.precio_total =
            detalleProducto.cantidad * detalleProducto.precio_unitario;
        }
        //this.ventaData.total = this.totalPagar;
      },
      (error) => {
        console.error('Producto no encontrado', error);
      },
    );
  }

  // buscarCliente(event: Event): void {
  //   const inputElement = event.target as HTMLInputElement;
  //   const searchText = inputElement.value.toLowerCase();

  //   if (searchText) {
  //     this.filtroEntidad = this.filtroEntidad.filter(
  //       (pro) =>
  //         //cambiar busqueda (id/nombre/marca) para buscar
  //         pro.documento.toLowerCase().includes(searchText) ||
  //         pro.nombre.toLowerCase().includes(searchText.toLowerCase()),
  //     );
  //   } else {
  //     this.filtroEntidad = this.entidades;
  //   }
  // }
  deleteProducto(index: number) {
    this.ventaData.detalles.splice(index, 1);
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

  SeleccionarSeriesProducto(sn: string) {
    if (!this.productoselected) return;

    let detalleProducto = this.ventaData.detalles.find(
      (detalle) => detalle.id_producto === this.productoselected?.id,
    );

    if (!detalleProducto) {
      detalleProducto = {
        id_producto: this.productoselected?.id,
        nombre: this.productoselected?.nombre,
        cantidad: 0, // Puedes ajustar según tus necesidades
        series: [],
        precio_unitario: this.productoselected?.precio, // Puedes ajustar según tus necesidades
        precio_total: 0,
      };
      this.ventaData.detalles.push(detalleProducto);
    }

    const serieIndex = detalleProducto.series.indexOf(sn);

    if (serieIndex > -1) {
      // Si la serie ya está en el array, elimínala
      detalleProducto.series.splice(serieIndex, 1);
      detalleProducto.cantidad -= 1;
      detalleProducto.precio_total =
        detalleProducto.cantidad * detalleProducto.precio_unitario;
      if (detalleProducto.cantidad === 0) {
        this.ventaData.detalles = this.ventaData.detalles.filter(
          (detalle) => detalle !== detalleProducto,
        );
      }
    } else {
      // Si la serie no está en el array, agrégala
      detalleProducto.series.push(sn);
      detalleProducto.cantidad += 1;
      detalleProducto.precio_total =
        detalleProducto.cantidad * detalleProducto.precio_unitario;
    }
    this.ventaData.total = this.totalPagar;
  }
  isSerieSeleccionada(sn: string): boolean {
    const detalleProducto = this.ventaData.detalles.find(
      (detalle) => detalle.id_producto === this.productoselected?.id,
    );
    return detalleProducto ? detalleProducto.series.includes(sn) : false;
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
  //clientes
  // ElegirEntidad() {
  //   this.entidad = this.selectedEntidad;
  // }
  // ElegirProducto() {
  //   this.entidad = this.selectedEntidad;
  // }

  // obtenerCorrelativo(): void {
  //   if (this.tpSeleccionado !== null && this.nSeleccionado !== null) {
  //     this.prefijo = this.tpSeleccionado;
  //     this.numeracion = this.nSeleccionado;

  //     this.correlativoService
  //       .getCorrelativoSiguiente(this.prefijo, this.numeracion)
  //       .subscribe(
  //         (data) => {
  //           this.correlativo = data;
  //         },
  //         (error) => {
  //           console.error('Error al obtener el correlativo:', error); // Agrega este log para depuración
  //         },
  //       );
  //   }
  // }

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
  verModalSeries(id: string | undefined) {
    if (id) {
      this.seleccionarProducto(id);
      this.openIModal();
    }
  }
  EditOpen = false;
  InsertOpen = false;
  openEModal() {
    this.EditOpen = true;
  }

  openIModal() {
    this.InsertOpen = true;
  }

  CrearNuevaEntidad() {
    this.router.navigate(['/dashboard/entidades']);
  }
}
