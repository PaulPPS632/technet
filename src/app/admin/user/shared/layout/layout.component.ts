import { Component, OnInit } from '@angular/core';
import DashboardComponent from "../dashboard/dashboard.component";
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,DashboardComponent, RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
})
export default class LayoutComponent implements OnInit{

  isSidebarOpen = true;

  constructor(private router : Router){}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        initFlowbite();
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  Logout(){
    localStorage.removeItem("username");
    localStorage.removeItem("authToken");
    localStorage.removeItem("rol");
  }
}
