import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TitulosService {

  constructor(private api: ApiServices) { }

  aprobarLiquidacion(id) {
    return this.api.apiCall(`aranceles/cobrarRegPropiedad/${id}`, 'POST', {});
  }

  

}
