import { Component, inject, OnInit } from '@angular/core';
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
  providers: [ProductsSateService],
})
export default class CatalogoComponent implements OnInit {
  productsState = inject(ProductsSateService);

  cartState = inject(CartStateService).state;
  categoriaservice = inject(CategoriaService);
  marcaservice = inject(MarcaService);

  categorias: CategoriaResponse[] = []; // Lista de categorías
  marcas: MarcaResponse[] = []; // Lista de marcas

  search: string = '';
  sort: string = '';
  page: number = 0;
  selectedCategorias: string[] = [];
  selectedSubcategorias: string[] = [];
  selectedMarcas: string[] = [];

  collapsedCategorias: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.categoriaservice.getAll().subscribe((categorias) => {
      this.categorias = categorias;
      console.log(this.categorias);
    });

    this.marcaservice.getAll().subscribe((marcas) => {
      this.marcas = marcas;
    });

    this.route.queryParams.subscribe((params) => {
      this.page = params['page'] || 0;
      const search = params['search'] || '';
      const size = params['size'] || 10;
      const sort = params['sort'] || '';
      const marca = params['marca'] || '';
      const categoria = params['categoria'] || '';
      const subcategoria = params['subcategoria'] || '';
      this.search = this.productsState.state().search;
      this.productsState.loadProducts(
        this.page,
        search,
        size,
        sort,
        marca,
        categoria,
        subcategoria,
      );
    });
    console.log('ejecuta oninit');
  }

  changePage() {
    const page1 = ++this.productsState.state().page;
    this.page = page1;
    this.updateProducts();
  }
  changePreviusPage() {
    const page1 = --this.productsState.state().page;
    this.page = page1;
    this.updateProducts();
  }
  private updateProducts(): void {
    const queryParams: any = {};
    queryParams.page = this.productsState.state().page ?? 0;
    queryParams.search = this.productsState.state().search ?? '';
    queryParams.sort = this.sort ?? '';
    queryParams.marca = this.selectedMarcas.join(',') ?? '';
    queryParams.categoria = this.selectedCategorias.join(',') ?? '';
    /**
     * const subs = this.selectedCategorias.forEach(cat => {
      return this.selectedSubcategorias.filter(sub => this.categorias.find(cate => cate.nombre == cat)?.subcategorias.includes(sub))
    })
     */
    const filteredSubcategorias = this.selectedSubcategorias.filter((sub) => {
      // Encuentra la categoría que contiene esta subcategoría
      const parentCategory = this.categorias.find((categoria) =>
        categoria.subcategorias.some(
          (subCategoria) => subCategoria.nombre === sub,
        ),
      );
      // Verifica si la categoría padre no está en la lista de categorías seleccionadas
      return parentCategory
        ? !this.selectedCategorias.includes(parentCategory.nombre)
        : true;
    });
    queryParams.subcategoria = filteredSubcategorias.join(',');
    queryParams.marca = this.selectedMarcas.join(',') ?? '';
    // Actualiza la URL con los nuevos parámetros

    this.router.navigate(['catalogo'], {
      //relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge', // O 'preserve' si quieres mantener los parámetros existentes
    });

    this.productsState.changePage$.next({
      page: 0,
      search: this.search,
      size: 10,
      sort: this.sort,
      marca: this.selectedMarcas.join(','), // Puedes ajustar esto según tus necesidades
      categoria: this.selectedCategorias.join(','),
      subcategoria: filteredSubcategorias.join(','),
    });
    /*
    this.productsState.loadProducts(
      queryParams.page,
      queryParams.search,
      queryParams.size,
      queryParams.sort,
      queryParams.marca,
      queryParams.categoria,
      queryParams.subcategoria
    );
    */
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
      categoria.subcategorias.forEach((subcategoria) => {
        if (!this.selectedSubcategorias.includes(subcategoria.nombre)) {
          this.selectedSubcategorias.push(subcategoria.nombre);
        }
      });
    } else {
      this.selectedCategorias = this.selectedCategorias.filter(
        (c) => c !== checkbox.value,
      );
      // Remove all subcategories of the deselected category
      categoria.subcategorias.forEach((subcategoria) => {
        this.selectedSubcategorias = this.selectedSubcategorias.filter(
          (s) => s !== subcategoria.nombre,
        );
      });
    }
    this.updateProducts();
    this.toggleCollapse(categoria.nombre);
  }
  onSubcategoriaChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedSubcategorias.push(checkbox.value);
    } else {
      this.selectedSubcategorias = this.selectedSubcategorias.filter(
        (s) => s !== checkbox.value,
      );
    }
    this.updateProducts();
  }
  onMarcaChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedMarcas.push(checkbox.value);
    } else {
      this.selectedMarcas = this.selectedMarcas.filter(
        (m) => m !== checkbox.value,
      );
    }
    this.updateProducts();
  }
  orderminmax() {
    this.sort = 'ASC';
    this.updateProducts();
  }
  ordermaxmin() {
    this.sort = 'DESC';
    this.updateProducts();
  }
  toggleCollapse(categoria: string) {
    if (this.collapsedCategorias.includes(categoria)) {
      this.collapsedCategorias = this.collapsedCategorias.filter(
        (c) => c !== categoria,
      );
    } else {
      this.collapsedCategorias.push(categoria);
    }
  }
  trackByFn(index: number, item: ProductoResponse) {
    return item.id; // Asume que cada producto tiene un id único
  }
}
