import { Component, inject, OnInit  } from '@angular/core';
import { ProductsSateService } from '../../data-access/productos-state.service';
import ProductoItemComponent from '../../ui/producto-item/producto-item.component';
import { CartStateService } from '../../../data-access/cart-state.service';
import { ProductoResponse } from '../../../../admin/models/producto-response';
import { CategoriaService } from '../../../../admin/services/categoria.service';
import { CategoriaResponse } from '../../../../admin/models/categoria-response';
import { MarcaService } from '../../../../admin/services/marca.service';
import { MarcaResponse } from '../../../../admin/models/marca-response';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductoItemComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
  providers:[ProductsSateService]
})
export default class CatalogoComponent {


  productsState = inject(ProductsSateService);

  cartState = inject(CartStateService).state;
  categoriaservice = inject(CategoriaService);
  marcaservice = inject(MarcaService);

  categorias: CategoriaResponse[] = []; // Lista de categorías
  marcas: MarcaResponse[]=[]; // Lista de marcas

  search: string ='';
  sort: string = '';
  selectedCategorias: string[] = [];
  selectedSubcategorias: string[] = [];
  selectedMarcas: string[] = [];

  collapsedCategorias: string[] = [];
  

  constructor(private route: ActivatedRoute,private router: Router){
    
  }

  ngOnInit() {
    this.categoriaservice.getAll().subscribe((categorias) => {
      this.categorias = categorias;
    });
    this.marcaservice.getAll().subscribe(
      (marcas) =>{
        this.marcas = marcas;
      }
    )
    this.route.queryParams.subscribe(params => {
      const page = params['page'] || 0;
      const search = params['search'] || '';
      const size = params['size'] || 10;
      const sort = params['sort'] || '';
      const marca = params['marca'] || '';
      const categoria = params['categoria'] || '';
      const subcategoria = params['subcategoria'] || '';

      this.productsState.loadProducts(page, search, size, sort, marca, categoria, subcategoria);
    });
  }
  changePage() {
    const page = this.productsState.state().page + 1;
    this.productsState.changePage$.next({
      page: page,
      search: this.search,
      size: 10,
      sort: this.sort,
      marca: this.selectedMarcas.join(','), // Puedes ajustar esto según tus necesidades
      categoria: this.selectedCategorias.join(','),
      subcategoria: this.selectedSubcategorias.join(',')
    });
  }
  private updateProducts(): void {
    const queryParams: any = {
      page: 0
    };
    queryParams.search = this.search ?? '';
    queryParams.sort = this.sort ?? '';
    queryParams.marca = this.selectedMarcas.join(',') ?? '';
    queryParams.categoria = this.selectedCategorias.join(',') ?? '';
    queryParams.subcategoria = this.selectedSubcategorias.join(',') ?? '';
    queryParams.marca = this.selectedMarcas.join(',') ?? '';
    /**
     * if(this.selectedMarcas.length > 0){
      queryParams.marca = this.selectedMarcas.join(',');
    }else{
      queryParams.marca = '';
    }

    // Agregar marca si tiene contenido
    if (this.selectedCategorias.length > 0) {
      queryParams.categoria = this.selectedCategorias.join(',');
    }else{
      queryParams.categoria = '';
    }
  
    // Agregar subcategoria si tiene contenido
    if (this.selectedSubcategorias.length > 0) {
      queryParams.subcategoria = this.selectedSubcategorias.join(',');
    }else{
      queryParams.subcategoria = '';
    }
     */
    
    // Actualiza la URL con los nuevos parámetros
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge' // O 'preserve' si quieres mantener los parámetros existentes
    });
    this.productsState.loadProducts(
      queryParams.page,
      queryParams.search,
      queryParams.size,
      queryParams.sort,
      queryParams.marca,
      queryParams.categoria,
      queryParams.subcategoria
    );
  }
  addToCart(product: ProductoResponse) {
    this.cartState.add({
      product,
      quantity: 1,
    });
  }

  onCategoriaChange(event: Event, categoria: CategoriaResponse) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedCategorias.push(checkbox.value);
      // Add all subcategories of the selected category
      categoria.subcategorias.forEach(subcategoria => {
        if (!this.selectedSubcategorias.includes(subcategoria.nombre)) {
          this.selectedSubcategorias.push(subcategoria.nombre);
        }
      });
    } else {
      this.selectedCategorias = this.selectedCategorias.filter(c => c !== checkbox.value);
      // Remove all subcategories of the deselected category
      categoria.subcategorias.forEach(subcategoria => {
        this.selectedSubcategorias = this.selectedSubcategorias.filter(s => s !== subcategoria.nombre);
      });
    }
    console.log(this.selectedSubcategorias);
    this.updateProducts();
    this.toggleCollapse(categoria.nombre)
  }
  onSubcategoriaChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedSubcategorias.push(checkbox.value);
    } else {
      this.selectedSubcategorias = this.selectedSubcategorias.filter(s => s !== checkbox.value);
    }
    this.updateProducts();
  }
  onMarcaChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedMarcas.push(checkbox.value);
    } else {
      this.selectedMarcas = this.selectedMarcas.filter(m => m !== checkbox.value);
    }
    this.updateProducts();
  }
  orderminmax(){
    this.sort = 'precio,asc';
    this.updateProducts();
  }
  ordermaxmin(){
    this.sort = 'precio,desc';
    this.updateProducts();
  }
  toggleCollapse(categoria: string) {
    if (this.collapsedCategorias.includes(categoria)) {
      this.collapsedCategorias = this.collapsedCategorias.filter(c => c !== categoria);
    } else {
      this.collapsedCategorias.push(categoria);
    }
  }
  trackByFn(index: number, item: ProductoResponse) {
    return item.id; // Asume que cada producto tiene un id único
  }
}
