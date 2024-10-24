import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datos-cliente',
  standalone: true,
  imports: [],
  templateUrl: './datos-cliente.component.html',
})
export default class DatosClienteComponent implements OnInit {
  datos: any;
  ngOnInit(): void {
    this.datos = JSON.parse(localStorage.getItem('User')!);
  }
}
