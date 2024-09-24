import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-rol',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './asignar-rol.component.html',
  styles: ``,
})
export class AsignarRolComponent implements OnInit {
  constructor(private usuarioService: UserService) {}

  @Input() usuario: any;
  selectedRole: string | null = null;
  ngOnInit(): void {
    this.selectedRole = this.usuario.Rol.id;
  }

  asignarRol() {
    if (this.usuario != null && this.selectedRole != null) {
      const req = {
        id: this.usuario.id,
        rolId: this.selectedRole ? this.selectedRole : 0,
      };
      this.usuarioService.putUsuario(req).subscribe(
        (_response) => {
          Swal.fire({
            icon: 'success',
            title: 'Rol Actualizado Correctamente',
            text: _response.message,
          });
        },
        (_error) => {
          Swal.fire({
            icon: 'error',
            title: _error.error.message,
          });
        },
      );
    }
  }
}
