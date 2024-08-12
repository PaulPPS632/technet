import { Component , inject, OnInit} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartStateService } from '../../data-access/cart-state.service';
import { FormsModule } from '@angular/forms';
import { ProductsSateService } from '../../productos/data-access/productos-state.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styles: ``,
  providers:[ProductsSateService]
})
export class HeaderComponent implements OnInit {
  cartState = inject(CartStateService).state;
  buscado : string = '';
  productsState = inject(ProductsSateService);

  queryParams: any = {
    page: 0,
    size: 10,
    search: '',
    sort: '',
    marca: '', // Ajusta esto según tus necesidades
    categoria: '',
    subcategoria: ''
  };
  constructor(private route: ActivatedRoute,private router: Router){}


  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        initFlowbite();
      }
    });
  }

  buscar(event: Event){
    /*const queryParams: any = {
      page: 0,
      search: this.buscado,
      size: 10,
      sort: this.productsState.state().sort,
      marca: this.productsState.state().marca, // Puedes ajustar esto según tus necesidades
      categoria: this.productsState.state().categoria,
      subcategoria: this.productsState.state().subcategoria
    };*/
    const inputElement = event.target as HTMLInputElement;
    this.queryParams.search = inputElement.value;
    this.router.navigate(['catalogo'], {
      //relativeTo: this.route,
      queryParams: this.queryParams,
      queryParamsHandling: 'merge' // O 'preserve' si quieres mantener los parámetros existentes
    });
  }

}
