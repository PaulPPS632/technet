import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../admin/services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-in.component.html',
  styles: ``
})
export default class SignInComponent {
  email: string = '';
  password: string = '';
  authService = inject(AuthService);
  router = inject(Router);
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
        // Puedes mostrar un mensaje de error al usuario si el login falla
      }
    );
  }
}
