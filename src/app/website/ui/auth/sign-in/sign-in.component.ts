import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../admin/services/auth.service';
import { CommonModule } from '@angular/common';

declare const initFlowbite: any;

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule,RouterLink, FormsModule],
  templateUrl: './sign-in.component.html',
  styles: ``
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
    const registerRequest = {
      username: this.username_r,
      email: this.username_r,
      password: this.password_r,
      rol: 'cliente'
    };

    this.authService.register(registerRequest).subscribe(response => {
      console.log('Registro satisfactorio:', response);
      this.CreateOpen = false;
    }, error => {
      console.error('Registro fallido:', error);
    });
  }

  login(){
    this.authService.Logged(this.email, this.password).subscribe(
      response => {

        if(response.rol == "cliente"){
          this.router.navigate(['/panel']);
        }else{
          this.router.navigate(['/dashboard']);
        }
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }


}
