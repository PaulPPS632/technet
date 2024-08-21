import { Component, inject, OnInit } from '@angular/core';
import { CrearProductoComponent } from "../acciones/crear-producto/crear-producto.component";
import { ProductoResponse } from '../../models/producto-response';
import { PedidoRequest } from '../../models/pedido';
import { ProductoService } from '../../services/producto.service';
import { PedidoService } from '../../services/pedido.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ProductoRequest } from '../../models/producto-request';
import { NavigationEnd, Router } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { MarcaService } from '../../services/marca.service';
import { CategoriaResponse } from '../../models/categoria-response';
import { MarcaResponse } from '../../models/marca-response';

declare const initFlowbite: any;

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [ CommonModule, FormsModule,CrearProductoComponent],
  templateUrl: './inventario.component.html',
  styles: ``
})

export class InventarioComponent implements OnInit {

  url = environment.API_URL;
  productos: ProductoResponse[] = [];
  categorias: CategoriaResponse[] = []; // Lista de categorías
  marcas: MarcaResponse[]=[]; // Lista de marcas
  productoEliminar: ProductoResponse[] = [];
  categoriaservice = inject(CategoriaService);
  marcaservice = inject(MarcaService);
  ProductoNombrePedidoSelect: string = '';
  ProductoIdPedidoSelect: string = '';
  ProductoCantidadPedidoSelect: number = 0;
  ProductoNotaPedidoSelect: string = '';

  Pedido: PedidoRequest | null =null;
  accionActual: 'crear' | 'actualizar' = 'crear';

  constructor(
    private router: Router,
    private productoService: ProductoService,
    private modalService: NgbModal,
    private pedidoService: PedidoService)
  { }


  EditOpen = false;
  CreateOpen = false;

  openEModal() {
    this.EditOpen = true;
  }

  openCModal() {
    this.CreateOpen = true;
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
  ListaCategoriaMarcaSeleccionada: any;
  ListasSubcategoriaSeleccionada: any;
  buscarSubM(marca: string){
    this.ListaCategoriaMarcaSeleccionada = this.marcas.find(m => m.nombre == marca)?.categorias;
  }
  buscarSubC(categoria: string){
    this.ListasSubcategoriaSeleccionada = this.categorias.find(c => c.nombre == categoria)?.subcategorias;
  }
  cargarProductosActualizado() {
    this.productoService.getListaProductos().subscribe(response => {
      this.productos = response;
      console.log(response);
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

    this.productoService.deleteProducto(id).subscribe(() => {
      this.productoEliminar = this.productoEliminar.filter(p => p.id !== id);
      console.log("producto eliminado.");
      this.cargarProductosActualizado();

    }, _error => {
      console.log("producto no eliminado.");
    });

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
          console.log("producto eliminado.");
          this.cargarProductosActualizado();

        }, _error => {
          console.log("producto no eliminado.");
        });
      }
    });
    */
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
      error:(_error)  => {
        console.log("El pedido no registrado");
      }
    });
  }

  nuevoActua: ProductoResponse = {
    id: '',
    nombre: '' ,
    pn :'',
    descripcion:'',
    stock: 1,
    precio: 1,
    marca:'',
    categoriamarca: '',
    categoria: '',
    subcategoria:'',
    garantia_cliente: 0,
    garantia_total: 0,
    cantidad: 0,
    imagen_principal: '',
    imageurl: []
  };

  imagencargadaPrincipal: string = '';
  imagencarga: string[] = [];
  marca_edit_select:any;
  categoriamarca_edit_select:any;
  categoria_edit_select:any;
  subcategoria_edit_select:any;
  categoriasdemarcaseleccionada(){
    return this.marcas.find(m => m.id === this.marca_edit_select)?.categorias
  }
  editarProducto(id: string) {

    //abrir modal
    

    this.productoService.getProductoById(id).subscribe(producto => {
      this.nuevoActua = producto;
      this.imagencarga = producto.imageurl;
      
      if(this.categorias.length == 0){
        this.categoriaservice.getAll().subscribe((categorias) => {
          this.categorias = categorias;
        });
      }
      
      if(this.marcas.length == 0){
        this.marcaservice.getAll().subscribe(
          (marcas) =>{
            this.marcas = marcas;
        });
      }
      this.buscarSubC(producto.categoria);
      this.buscarSubM(producto.marca);
      this.openEModal();
    }, error => {
      console.error('Error al obtener el producto:', error);
    });
    this.imagencarga = [];
    this.imagencargadaPrincipal ='';
  }

  guardarCambios() {
    const formData = new FormData();
    const id_catmarca = this.marcas.find(m => m.nombre == this.nuevoActua.marca)?.categorias.find(c => c.nombre == this.nuevoActua.categoriamarca)?.id;
    const id_subcat= this.categorias.find(c => c.nombre == this.nuevoActua.categoria)?.subcategorias.find(s => s.nombre == this.nuevoActua.subcategoria)?.id;
    var Productoactualizado: ProductoRequest;
    if(id_catmarca && id_subcat){
      Productoactualizado = {
        id: this.nuevoActua.id,
        nombre: this.nuevoActua.nombre,
        pn :this.nuevoActua.pn,
        descripcion:this.nuevoActua.descripcion,
        stock: this.nuevoActua.stock,
        precio: this.nuevoActua.precio,
        id_categoriamarca: id_catmarca,
        id_subcategoria: id_subcat,
        garantia_cliente: this.nuevoActua.garantia_cliente,
        garantia_total: this.nuevoActua.garantia_total,
        imagen_principal: this.nuevoActua.imagen_principal,
        imageurl: this.nuevoActua.imageurl
        }
      formData.append('producto', new Blob([JSON.stringify(Productoactualizado)], { type: 'application/json' }));
    }
    
    
    
    if(this.selectedFiles.length > 0){
      this.selectedFiles.forEach((file) => {
          formData.append('files', file);
      });
  } else {
      formData.append('files', new Blob(),'');
  }

  if(this.selectedFilePrincipal) {
      formData.append('fileprincipal', this.selectedFilePrincipal);
  } else {
      formData.append('fileprincipal', new Blob(),'');
  }
    this.productoService.putProducto(formData).subscribe({
      next: () => {
        //actualizar productos
        this.cargarProductosActualizado();
        this.imagencargadaPrincipal = '';
        this.imagencarga =[];
        this.selectedFilePrincipal = null;
        this.selectedFiles =[];
        this.EditOpen = false;
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
    //this.abrirModal(content);
  }

  getCurrentDateTime(): string {
    return new Date().toISOString();
  }

}
