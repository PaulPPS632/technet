import { Routes } from '@angular/router';

import ProductoItemComponent from './website/productos/ui/producto-item/producto-item.component';
import { panelGuard } from './panel.guard';
import { authGuard } from './auth.guard';
export const routes: Routes = [

    { path: '', loadChildren: () => import('./website/productos/features/producto-shell/producto.routes'), },
    { path: 'carrito', loadChildren: () => import('./website/cart/cart.routes') },
    { path: 'sesion', loadChildren: () => import('./website/ui/auth/auth.routes') },
    { path: 'panel', canActivate: [panelGuard], loadChildren: () => import('./website/panel-cliente/panelcliente.routes') },
    { path: 'item', component: ProductoItemComponent},
    { path: 'dashboard', canActivate: [authGuard], loadChildren: () => import('./admin/user/shared/dashboard.routes') },

    { path: '**', redirectTo: '', },
];
