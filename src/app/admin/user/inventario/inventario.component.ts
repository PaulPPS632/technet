import { Component } from '@angular/core';
import { CrearProductoComponent } from "../acciones/crear-producto/crear-producto.component";
import { ProductoResponse } from '../../models/producto-response';
import { PedidoRequest } from '../../models/pedido';
import { ProductoService } from '../../services/producto.service';
import { PedidoService } from '../../services/pedido.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CrearProductoComponent, FormsModule, CommonModule ],
  templateUrl: './inventario.component.html',
  styles: ``
})

export class InventarioComponent {
  url = environment.API_URL;
  closeResult = '';
  productos: ProductoResponse[] = [];

  productoEliminar: ProductoResponse[] = [];

  ProductoNombrePedidoSelect: string = '';
  ProductoIdPedidoSelect: string = '';
  ProductoCantidadPedidoSelect: number = 0;
  ProductoNotaPedidoSelect: string = '';

  Pedido: PedidoRequest | null =null;
  accionActual: 'crear' | 'actualizar' = 'crear';

  constructor(
    private productoService: ProductoService, 
    private modalService: NgbModal,
    private pedidoService: PedidoService) { }

  ngOnInit() {
    this.cargarProductosActualizado();
  }

  cargarProductosActualizado() {
    this.productoService.getListaProductos().subscribe(response => {
      this.productos = response;
      this.filtroProducto = response;
    }, error => {
      console.error('Error al obtener los productos:', error);
    });
  }

  filtroProducto: ProductoResponse[] = [];

  buscarProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toLowerCase();

    if (searchText) {
      this.filtroProducto = this.productos.filter(pro =>
        //cambiar la categoria (id/nombre/marca) para buscar
        pro.nombre.toLowerCase().includes(searchText)
      );
    } else {
      this.filtroProducto = this.productos;
    }
  }

  eliminarProducto(id: string): void {
    /*
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto(id).subscribe(() => {
          this.productoEliminar = this.productoEliminar.filter(p => p.id !== id);
          Swal.fire(
            'Eliminado',
            'El producto ha sido eliminado.',
            'success'
          );
          this.cargarProductosActualizado();

        }, error => {
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el producto.',
            'error'
          );
        });
      }
    });*/
  }

  RegistrarPedido(){
    this.Pedido = {
      id: '',
      id_producto: this.ProductoIdPedidoSelect,
      fecha: new Date().toISOString(),
      id_usuario: '',
      cantidad: this.ProductoCantidadPedidoSelect,
      estado: 'pendiente',
      nota: this.ProductoNotaPedidoSelect,
      tenantId:''
    }
    this.pedidoService.registrar(this.Pedido).subscribe({
      next: () => {
        console.log("El pedido ha sido registrado.");
      },
      error:(error)  => {
        console.log("El pedido no registrado");
      }
    });
  }

  editNombre: string= '';
  editPn: string= '';
  editDescripcion: string= '';
  editStock: number= 0;
  editPrecio: number= 0;
  editCategoriaMarca: string= '';
  editSubCategoria: string= '';
  editGarantiaCliente: number= 0;
  editGarantiaTotal: number= 0;
  editArchivo: string[] = [];

  editarProducto(content: any, id: string) {
    this.productoService.getProductoById(id).subscribe(producto => {
      this.editNombre = producto.nombre;
      this.editPn = producto.pn;
      this.editDescripcion = producto.descripcion;
      this.editStock = producto.stock;
      this.editPrecio = producto.precio;
      this.editCategoriaMarca = producto.categoriamarca;
      this.editSubCategoria = producto.subcategoria;
      this.editGarantiaCliente = producto.garantia_cliente;
      this.editGarantiaTotal  =producto.garantia_total;
      //this.editArchivo = producto.imageurl;

      this.abrirModal(content);
    }, error => {
      console.error('Error al obtener el producto:', error);
    });
  }

  abrirModalPedido(content: any, id: string, nombre: string){
    this.ProductoIdPedidoSelect = id;
    this.ProductoNombrePedidoSelect = nombre;
    this.abrirModal(content);
  }

  getCurrentDateTime(): string {
    return new Date().toISOString();
  }

  onFileChange(event: any) {
    const files = event.target.files;
    this.editArchivo = [];
    for (let i = 0; i < files.length; i++) {
      this.editArchivo.push(files[i]);
    }
  }

  guardarCambios() {
    console.log("servicio para actualizar información")
  }
  
  abrirModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-header modal-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
