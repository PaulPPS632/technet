import { Component } from '@angular/core';
import DashboardComponent from "../dashboard/dashboard.component";
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [DashboardComponent, SidebarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
})
export default class LayoutComponent {

}
