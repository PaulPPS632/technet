import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../admin/services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

declare const initFlowbite: any;

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export default class SignInComponent implements OnInit {
  //register
  email_r: string = '';
  password_r: string = '';
  username_r: string = '';

  email: string = '';
  password: string = '';
  authService = inject(AuthService);
  router = inject(Router);

  CreateOpen = false;
  UserNew = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    documento: '',
    direccion: '',
    telefono: '',
    TipoEntidadId: 1,
  };
  openCModal() {
    this.CreateOpen = true;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //Flowbite se inicia después de que se haya cargado la pagina
        setTimeout(() => initFlowbite(), 0);
      }
    });
  }

  register() {
    this.authService.register(this.UserNew).subscribe(
      (response) => {
        this.CreateOpen = false;
        Swal.fire({
          icon: 'success',
          title: 'Entidad Registrada',
          text: response.message,
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: error.error.message,
        });
      },
    );
  }

  login() {
    this.authService.Logged(this.email, this.password).subscribe(
      (response) => {
        if (response.usuario.Rol.nombre == 'cliente') {
          this.router.navigate(['/panel']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: error.error.message,
        });
      },
    );
  }
}
