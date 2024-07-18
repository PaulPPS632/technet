import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('../producto-lista/producto-lista.component'),
  },
  {
    path: 'catalogo',
    loadComponent: () => import('../catalogo/catalogo.component'),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('../producto-detalle/producto-detalle.component'),
  },
] as Routes;