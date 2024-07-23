import { Routes } from '@angular/router';

import LayoutComponent from './admin/user/shared/layout/layout.component';
import ComprobantesComponent from './admin/user/comprobantes/comprobantes.component';
import DashboardComponent from './admin/user/shared/dashboard/dashboard.component';
import ProductoItemComponent from './website/productos/ui/producto-item/producto-item.component';
import { AdminUsersComponent } from './admin/user/admin-users/admin-users.component';
import { PedidosComponent } from './admin/user/pedidos/pedidos.component';
import { InventarioComponent } from './admin/user/inventario/inventario.component';
import { FacIngresoComponent } from './admin/user/gestion/fac-ingreso/fac-ingreso.component';
import FacSalidaComponent from './admin/user/gestion/fac-salida/fac-salida.component';
import { CrearEntidadComponent } from './admin/user/acciones/crear-entidad/crear-entidad.component';
export const routes: Routes = [

    { path: '', loadChildren: () => import('./website/productos/features/producto-shell/producto.routes'),},

    //{ path: '', component: ProductoListaComponent },

    { path: 'carrito', loadChildren: () => import('./website/cart/cart.routes') },

    { path: 'sesion', loadChildren: () => import('./website/ui/auth/auth.routes') },
    
    { path: 'item', component: ProductoItemComponent},

    { path: 'dashboard', component: LayoutComponent, 
        children: [
            { path:'', component: DashboardComponent },
            { path: 'comprobantes', component: ComprobantesComponent},
            { path: 'admin-user', component: AdminUsersComponent},
            { path: 'pedidos', component: PedidosComponent},
            { path: 'inventario', component: InventarioComponent},
            { path: 'ingreso', component: FacIngresoComponent},
            { path: 'salida', component: FacSalidaComponent},
            { path: 'entidad', component: CrearEntidadComponent}

        ]
     },
    { path: '**', redirectTo: '', },
];
