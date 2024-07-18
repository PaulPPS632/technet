import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
export class AsignarRolComponent {

  constructor (
    private usuarioService: UserService
  ){
  }
  
  @Input() usuario: UserInfo | null = null;
  roles: RolResponse[]=[];
  RolSelect: string = '';
  ngOnInit(): void {
    this.usuarioService.getRoles().subscribe(
      (data: RolResponse[]) => {
        this.roles = data;
      }
    )
  }

  asignarRol(){
    const selectedRole = this.roles.find(role => role.id == this.RolSelect);
    if (this.usuario != null && selectedRole !=null) {

      this.usuario.rol = selectedRole;

      this.usuarioService.putUsuario(this.usuario).subscribe(
        response => {
          console.log("rol asignado");
        },
        error => {
          console.log("rol no asignado");
        }
      );
    }
    
  }
}
