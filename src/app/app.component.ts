import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from './website/ui/header/header.component';
import { FooterComponent } from "./website/ui/footer/footer.component";
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { ArchivosService } from './admin/services/archivos.service';


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
  imagenespublicitarias: { [key: string]: string[] } = {};
  private routeSubscription!: Subscription;

  constructor(private router: Router,private archivosService: ArchivosService) {}

  ngOnInit() {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        initFlowbite();
      }
    });

    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const headerFooterExcludedRoutes = ['/dashboard'];
      const currentRoute = event.urlAfterRedirects;

      this.showHeaderFooter = !headerFooterExcludedRoutes.some(route => currentRoute.startsWith(route));
    });

    this.archivosService.getImagenesPublicitarias().subscribe(
      data =>{
        this.imagenespublicitarias =data;
        console.log(data);
      }
    )

  }

  ObjectKeys(obj: any): string[] {
    //retorna un formato iterable
    return Object.keys(obj);
  }
}
