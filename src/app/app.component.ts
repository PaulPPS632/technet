import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from './website/ui/header/header.component';
import { FooterComponent } from "./website/ui/footer/footer.component";
import { RouteService } from './admin/services/router.service';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule,HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'technet';

  showHeaderFooter: boolean = true;
  showCarousel: boolean = true;
  private routeSubscription!: Subscription; 
  
  constructor(private router: Router) {}

  ngOnInit() {
    initFlowbite();
    
    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const headerFooterExcludedRoutes = ['/dashboard'];
      const carouselExcludedRoutes = [ '/dashboard', '/sesion', '/carrito', '/product', '/catalogo'];
      const currentRoute = event.urlAfterRedirects;

      this.showHeaderFooter = !headerFooterExcludedRoutes.some(route => currentRoute.startsWith(route));
      this.showCarousel = !carouselExcludedRoutes.some(route => currentRoute.startsWith(route));
    });


  }
  
}
