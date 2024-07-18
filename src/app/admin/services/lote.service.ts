import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  constructor() { }

  apiUrl: string = "http://localhost:8080/inventory/lote";
}
