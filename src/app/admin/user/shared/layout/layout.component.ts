import { Component } from '@angular/core';
import DashboardComponent from "../dashboard/dashboard.component";
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,DashboardComponent, SidebarComponent, RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
})
export default class LayoutComponent {

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

}
