import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./panel-cliente.component'),
  },
] as Routes;
