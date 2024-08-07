import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { UserInfo } from '../../../models/user-info';
import { RolResponse } from '../../../models/rol-response';

@Component({
  selector: 'app-asignar-rol',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './asignar-rol.component.html',
  styles: ``
})
export class AsignarRolComponent implements OnInit {

  constructor (
    private usuarioService: UserService
  ){
  }

  @Input() usuario: any;
  selectedRole: string | null=null;
  ngOnInit(): void {
    this.selectedRole = this.usuario.rol.nombre;
  }

  asignarRol(){
    if (this.usuario != null && this.selectedRole != null) {

      this.usuario.rol = this.selectedRole;

      this.usuarioService.putUsuario(this.usuario).subscribe(
        _response => {
          console.log("rol asignado");
        },
        _error => {
          console.log("rol no asignado");
        }
      );
    }

  }
}
