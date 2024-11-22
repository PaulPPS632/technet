import { Component, OnInit } from '@angular/core';
import { CrearProductoComponent } from '../../../acciones/crear-producto/crear-producto.component';
import { ProductoResponse } from '../../../../models/producto-response';
import { PedidoRequest } from '../../../../models/pedido';
import { ProductoService } from '../../../../services/producto.service';
import { PedidoService } from '../../../../services/pedido.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ReportesService } from '../../../../services/reportes.service';

declare const initFlowbite: any;

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, CrearProductoComponent, RouterLink],
  templateUrl: './inventario.component.html',
})
export class InventarioComponent implements OnInit {
  url = environment.API_URL;
  productos: any[] = [];

  productoEliminar: ProductoResponse[] = [];
  ProductoNombrePedidoSelect: string = '';
  ProductoIdPedidoSelect: string = '';
  ProductoCantidadPedidoSelect: number = 0;
  ProductoNotaPedidoSelect: string = '';
  Pedido: PedidoRequest | null = null;

  totalProductos: number = 0;
  page: number = 1;
  pageSize: number = 30;
  totalPages: number = 0;
  searchText: string = '';

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private pedidoService: PedidoService,
    private reportesService: ReportesService,
  ) {}

  CreateOpen = false;
  name_modal = 'CREAR';

  openCModal() {
    this.CreateOpen = true;
    this.name_modal = 'CREAR';
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //Flowbite se inicia después de que se haya cargado la pagina
        setTimeout(() => initFlowbite(), 0);
      }
    });

    this.cargarProductosActualizado(this.page, this.pageSize);
  }

  cargarProductosActualizado(page: number, pageSize: number): void {
    //console.log('auth en LISTA: ', localStorage.getItem('authToken'));
    this.productoService.getListaPaged(page, pageSize).subscribe(
      (res) => {
        this.productos = res.productos;
        this.totalProductos = res.total;
        this.totalPages = res.totalPages;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      },
    );
  }

  buscarProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toUpperCase();

    if (searchText) {
      this.productos = this.productos.filter((pro) =>
        //cambiar la categoria (id/nombre/marca) para buscar
        pro.nombre.toUpperCase().includes(searchText),
      );
    } else {
      this.cargarProductosActualizado(this.page, this.pageSize);
    }
  }
  searchProductoById(): void {
    if (this.searchText) {
      this.productoService.getProductoSearch(this.searchText).subscribe(
        (res: any) => {
          this.productos = res; // Mostrar solo la cotización encontrada
          this.totalPages = 1; // Solo una página de resultados
        },
        (error: any) => {
          // Manejo de error
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error?.message ||
              'Ocurrió un error al buscar la cotización.',
          });
        },
      );
    } else {
      // Si no hay búsqueda, cargar todas las cotizaciones con paginación
      this.cargarProductosActualizado(this.page, this.pageSize);
    }
  }
  eliminarProducto(id: string): void {
    this.productoService.deleteProducto(id).subscribe(
      () => {
        this.productoEliminar = this.productoEliminar.filter(
          (p) => p.id !== id,
        );
        this.cargarProductosActualizado(this.page, this.pageSize);
      },
      (_error) => {
        console.error('producto no eliminado.');
      },
    );
  }

  RegistrarPedido() {
    this.Pedido = {
      id: '',
      id_producto: this.ProductoIdPedidoSelect,
      fecha: new Date().toISOString(),
      id_usuario: '',
      cantidad: this.ProductoCantidadPedidoSelect,
      estado: 'pendiente',
      nota: this.ProductoNotaPedidoSelect,
      tenantId: '',
    };
    this.pedidoService.registrar(this.Pedido).subscribe({
      next: () => {
        console.log('El pedido ha sido registrado.');
      },
      error: (_error) => {
        console.error('El pedido no registrado');
      },
    });
  }

  nuevoActua: any = {
    id: '',
    nombre: '',
    pn: '',
    descripcion: '',
    stock: 1,
    precio: 1,
    MarcaId: 1,
    CategoriaMarcaId: 1,
    CategoriaId: 1,
    SubCategoriaId: 1,
    garantia_cliente: 0,
    garantia_total: 0,
    cantidad: 0,
    imagen_principal: '',
    imageurl: [],
  };

  imagencargadaPrincipal: string = '';
  imagencarga: string[] = [];
  refresh(): void {
    this.cargarProductosActualizado(this.page, this.pageSize);
  }
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.cargarProductosActualizado(this.page, this.pageSize);
  }
  abrirModalPedido(content: any, id: string, nombre: string) {
    this.ProductoIdPedidoSelect = id;
    this.ProductoNombrePedidoSelect = nombre;
  }

  getCurrentDateTime(): string {
    return new Date().toISOString();
  }
  Reporte() {
    this.reportesService.ProductosStock().subscribe(
      (response) => {
        // Crear un enlace para descargar el PDF
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'REPORTE-STOCK.pdf'; // Nombre del archivo
        a.click();
        window.URL.revokeObjectURL(url); // Liberar memoria
      },
      (error) => {
        console.error('Error al descargar el reporte:', error);
      },
    );
  }
}
