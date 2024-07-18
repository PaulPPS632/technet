import { Component , inject} from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartStateService } from '../../data-access/cart-state.service';
import { FormsModule } from '@angular/forms';
import { ProductsSateService } from '../../productos/data-access/productos-state.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
  cartState = inject(CartStateService).state;
  buscado : string = '';

  queryParams: any = {
    page: 0,
    size: 10,
    sort: '',
    marca: '', // Ajusta esto según tus necesidades
    categoria: '',
    subcategoria: ''
  };
  constructor(private route: ActivatedRoute,private router: Router){}

  buscar(){
    console.log(this.buscado)

    const queryParams: any = {
      page: 0,
      size: 10,
      sort: '',
      marca: '', // Puedes ajustar esto según tus necesidades
      categoria: '',
      subcategoria: ''
    };
    
    this.router.navigate(['catalogo'], {
      //relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge' // O 'preserve' si quieres mantener los parámetros existentes
    });
  }

}
