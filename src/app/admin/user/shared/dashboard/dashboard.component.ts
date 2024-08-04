import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export default class DashboardComponent implements OnInit{

  constructor(private router : Router){}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        initFlowbite();
      }
    });
  }

}

