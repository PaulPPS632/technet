import { Component, input, OnInit } from '@angular/core';
import { UserInfo } from '../../../admin/models/user-info';
import { UserService } from '../../../admin/services/user.service';

@Component({
  selector: 'app-datos-cliente',
  standalone: true,
  imports: [],
  templateUrl: './datos-cliente.component.html',
  styleUrl: './datos-cliente.component.css'
})
export default class DatosClienteComponent implements OnInit {
  constructor(private userService: UserService)
  {}
  datos: any;
  ngOnInit(): void {
    this.userService.getUsuario().subscribe(res => {
      console.log(res);
      this.datos = res;});
  }
  

}
