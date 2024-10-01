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

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private pedidoService: PedidoService,
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

    this.cargarProductosActualizado();
  }

  cargarProductosActualizado() {
    this.productoService.getListaProductos().subscribe(
      (response) => {
        this.productos = response;
        console.log(response);
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
      this.cargarProductosActualizado();
    }
  }

  eliminarProducto(id: string): void {
    this.productoService.deleteProducto(id).subscribe(
      () => {
        this.productoEliminar = this.productoEliminar.filter(
          (p) => p.id !== id,
        );
        console.log('producto eliminado.');
        this.cargarProductosActualizado();
      },
      (_error) => {
        console.log('producto no eliminado.');
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
        console.log('El pedido no registrado');
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

  abrirModalPedido(content: any, id: string, nombre: string) {
    this.ProductoIdPedidoSelect = id;
    this.ProductoNombrePedidoSelect = nombre;
  }

  getCurrentDateTime(): string {
    return new Date().toISOString();
  }
}
