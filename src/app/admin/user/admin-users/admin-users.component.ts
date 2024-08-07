import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { AsignarRolComponent } from '../acciones/asignar-rol/asignar-rol.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [AsignarRolComponent, FormsModule, CommonModule],
  templateUrl: './admin-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class AdminUsersComponent implements OnInit {

  constructor(private usuarioService: UserService)
  { }
  DetalleOpen= false;
  Usuarios: any[] = [];
  UsuarioSelect: any;
  UsuarioPrincipal: any;
  ngOnInit(): void {
    this.usuarioService.getUsuariosDeshboard().subscribe(res => {
      this.Usuarios = res;
      this.UsuarioPrincipal = this.Usuarios.find((user) => user.username == localStorage.getItem("username")
      );
    });
  }
  EditarRol(id: string){
    this.UsuarioSelect = this.Usuarios.find((user) => user.id == id)
    if(this.UsuarioSelect){
      this.DetalleOpen = true;
    }
  }

}
