import { Component, OnInit } from '@angular/core';
import { ProductoResponse } from '../../../models/producto-response';
import { ProductoService } from '../../../services/producto.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MarcaService } from '../../../services/marca.service';
import { CategoriaService } from '../../../services/categoria.service';
import { SubCategoriaResponse } from '../../../models/subcategoria-response';
import { CategoriaResponse } from '../../../models/categoria-response';
import { CategoriaMarcaResponse } from '../../../models/categoriamarca-response';
import { MarcaResponse } from '../../../models/marca-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-producto.component.html',
  styles: ``,
})
export class CrearProductoComponent implements OnInit {
  /* parte 1 */
  MarcaSelect: number = 0;
  Marcas: MarcaResponse[] = [];
  CategoriaMarca: CategoriaMarcaResponse[] = [];

  /* parte 2 */
  CategoriaSelect: number = 0;
  Categorias: CategoriaResponse[] = [];
  Subcategoria: SubCategoriaResponse[] = [];
  selectedFiles: File[] = [];
  selectedFilePrincipal: File | null = null;
  imagencargadaPrincipal: string = '';
  imagencarga: string[] = [];
  nuevoProducto: any = {
    id: '',
    nombre: '',
    pn: '',
    descripcion: '',
    stock: 0,
    precio: 0,
    CategoriaMarcaId: 1,
    SubCategoriaId: 1,
    garantia_cliente: 6,
    garantia_total: 12,
    imagen_principal: '',
    imageurl: [],
  };

  productos: ProductoResponse[] = [];

  constructor(
    private productoService: ProductoService,
    private marcaService: MarcaService,
    private categoriaService: CategoriaService,
  ) {}

  ngOnInit(): void {
    this.cargarSelect();
  }

  buscarSubM() {
    this.marcaService.getSubs(this.MarcaSelect).subscribe(
      (data: CategoriaMarcaResponse[]) => {
        this.CategoriaMarca = data;
        this.nuevoProducto.id_categoriamarca = this.CategoriaMarca[0].id; //predeterminado index 1
      },
      (error) => {
        console.error('Error: ', error);
      },
    );
  }

  buscarSubC() {
    this.categoriaService.getSubs(this.CategoriaSelect).subscribe(
      (data: SubCategoriaResponse[]) => {
        this.Subcategoria = data;
        this.nuevoProducto.id_subcategoria = this.Subcategoria[0].id; //predeterminado index 1
      },
      (error) => {
        console.error('Error: ', error);
      },
    );
  }

  cargarSelect() {
    this.marcaService.getAll().subscribe((data) => {
      this.Marcas = data;
    });

    this.categoriaService.getAll().subscribe((data) => {
      this.Categorias = data;
    });
  }

  cargarProductos() {
    this.productoService.getListaProductos().subscribe(
      (response) => {
        this.productos = response;
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      },
    );
  }

  guardarProductos() {
    const formData = new FormData();
    formData.append('producto', JSON.stringify(this.nuevoProducto));

    if (this.selectedFilePrincipal) {
      formData.append('fileprincipal', this.selectedFilePrincipal);
    } else {
      Swal.fire('Error', 'Seleccione al menos una imagen principal', 'error');
      return;
    }

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
    } else {
      Swal.fire('Error', 'Seleccione al menos una imagen secundaria', 'error');
      return;
    }
    this.productoService.postNuevoProducto(formData).subscribe({
      next: () => {
        //actualizar productos
        this.cargarProductos();
        Swal.fire({
          icon: 'success',
          title: 'Producto agregado',
          text: 'El producto ha sido agregado al inventario.',
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Producto no agregado',
          text: error,
        });
      },
    });
  }

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

  eliminarImagen(index: number) {
    this.nuevoProducto.imageurl.splice(index, 1);
  }
  onFileChangePrincipal(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFilePrincipal = event.target.files[0];
      //cargar imagencarga []
      if (this.selectedFilePrincipal) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagencarga.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFilePrincipal);
      }
    }
  }
}
