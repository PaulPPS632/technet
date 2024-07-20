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
import { ProductoRequest } from '../../models/producto-request';

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
    }, error => {
      console.error('Error al obtener los productos:', error);
    });
  }

  buscarProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toUpperCase();

    if (searchText) {
      this.productos = this.productos.filter(pro =>
        //cambiar la categoria (id/nombre/marca) para buscar
        pro.nombre.toUpperCase().includes(searchText)
      );
    } else {
      this.cargarProductosActualizado();
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

  nuevoActua: ProductoRequest = { 
    id: '',
    nombre: '' ,
    pn :'',
    descripcion:'',
    stock: 1,
    precio: 1,
    id_categoriamarca: 1,
    id_subcategoria: 1,
    garantia_cliente: 0,
    garantia_total: 0,
    imagen_principal: '',
    imageurl: []
  };

  imagencargadaPrincipal: string = '';
  imagencarga: string[] = [];

  editarProducto(content: any, id: string) {
    this.productoService.getProductoById(id).subscribe(producto => {
      this.nuevoActua = producto;
      this.imagencarga = producto.imageurl;
      this.abrirModal(content);
    }, error => {
      console.error('Error al obtener el producto:', error);
    });
    this.imagencarga = [];
    this.imagencargadaPrincipal ='';
  }

  guardarCambios(content: any) {

    const formData = new FormData();
    formData.append('producto', new Blob([JSON.stringify(this.nuevoActua)], { type: 'application/json' }));
    this.selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    if(this.selectedFilePrincipal){
      formData.append('fileprincipal', this.selectedFilePrincipal);
    }
    this.productoService.putProducto(formData).subscribe({
      next: () => {
        //actualizar productos
        this.cargarProductosActualizado();
        this.imagencargadaPrincipal = '';
        this.imagencarga =[];
        this.selectedFilePrincipal = null;
        this.selectedFiles =[];
    content.dismiss('cancel')
        console.log("producto agregado");
      },
      error:(error)  => {
        console.log("producto no agregado");
      }
    });
    
  }

  selectedFiles: File[] = [];
  selectedFilePrincipal: File | null = null;
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);

      //cargar imagencarga []
      this.selectedFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagencarga.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });

    }
  }
  onFileChangePrincipal(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFilePrincipal =  event.target.files[0];
      //cargar imagencarga []
      if(this.selectedFilePrincipal){
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagencarga.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFilePrincipal);
      }
    }
  }
  eliminarImagen(index: number) {
    this.nuevoActua.imageurl.splice(index, 1);
    console.log('Lista imagenes: ',this.nuevoActua.imageurl);
  }

  abrirModalPedido(content: any, id: string, nombre: string){
    this.ProductoIdPedidoSelect = id;
    this.ProductoNombrePedidoSelect = nombre;
    this.abrirModal(content);
  }

  getCurrentDateTime(): string {
    return new Date().toISOString();
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