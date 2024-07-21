import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  constructor() { }

  apiUrl: string = environment.API_URL+"/inventory/lote";
}
