import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, computed, signal } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';
import { UserInfo } from '../../models/user-info';
import { AsignarRolComponent } from '../acciones/asignar-rol/asignar-rol.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
export interface Privilege {
  id: number;
  name: string;
  description: string;
  completed: boolean; // Mantenemos la propiedad completed
}

export interface Role {
  id: number;
  name: string;
  description: string;
  completed: boolean; // Mantenemos la propiedad completed
  privileges?: Privilege[];
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [AsignarRolComponent, FormsModule, CommonModule],
  templateUrl: './admin-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush 
})


export class AdminUsersComponent implements OnInit {
  
  constructor(private usuarioService: UserService,
    private cdr: ChangeDetectorRef,
    private cookiesService: CookieService )
  { }

  readonly roles = signal<Role[]>([
    {
      id: 1,
      name: 'Administrator',
      description: 'Acceso total a funciones del tenant',
      completed: false,
      privileges: [
        { id: 1, name: 'facturas', description: 'Acceso total a funciones de facturacion', completed: false },
        { id: 2, name: 'boletas', description: 'Acceso total a funciones de boletas', completed: false },
        { id: 3, name: 'usuarios', description: 'Acceso total a funciones de administracion de usuarios', completed: false }
      ],
    },
    {
      id: 2,
      name: 'Vendedor',
      description: 'Acceso total a funciones del facturacion',
      completed: false,
      privileges: [
        { id: 1, name: 'facturas', description: 'Acceso total a funciones de facturacion', completed: false },
        { id: 2, name: 'boletas', description: 'Acceso total a funciones de boletas', completed: false },
      ],
    },
  ]);
  UsuarioDueno: UserInfo | null = null;
  usuarioSelect : UserInfo | null = null;
  usuarios : UserInfo[]=[];
  closeResult = '';
  ngOnInit(): void {
    this.usuarioService.getUsuariosTenant().subscribe(
      (data: UserInfo[])=>{
        this.usuarios = data;
        this.cdr.detectChanges();
      }
    )
    const userString = this.cookiesService.get('user');
    if (userString) {
      try {
        this.UsuarioDueno = JSON.parse(userString);
        
      } catch (e) {
        console.error('Error parsing user cookie:', e);
      }
    }
  }

  eliminar(user: UserInfo){
    this.usuarioSelect = user;
    this.usuarioService.deleteUser(this.usuarioSelect).subscribe(
      response => {
        console.log("eliminado");
      },
      error => {
        console.log("error");
      }
    )
  }


  readonly partiallyComplete = computed(() => {
    const roles = this.roles();
    return roles.some(role => {
      if (!role.privileges) {
        return false;
      }
      return role.privileges.some(p => p.completed) && !role.privileges.every(p => p.completed);
    });
  });

  updateRole(role: Role, completed: boolean, index?: number) {
    this.roles.update(roles => {
      const updatedRoles = roles.map(r => {
        if (r.id === role.id) {
          if (index === undefined) {
            r.completed = completed;
            r.privileges?.forEach(p => (p.completed = completed));
          } else {
            r.privileges![index].completed = completed;
            r.completed = r.privileges?.every(p => p.completed) ?? true;
          }
        }
        return {...r};
      });
      return updatedRoles;
    });
  }

  updatePrivilege(role: Role, privilege: Privilege, completed: boolean) {
    this.roles.update(roles => {
      const updatedRoles = roles.map(r => {
        if (r.id === role.id) {
          r.privileges?.forEach(p => {
            if (p.id === privilege.id) {
              p.completed = completed;
            }
          });
          r.completed = r.privileges?.every(p => p.completed) ?? true;
        }
        return {...r};
      });
      return updatedRoles;
    });
  }
}
