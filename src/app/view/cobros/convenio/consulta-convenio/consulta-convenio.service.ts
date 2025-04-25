import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaConvenioService {

  constructor(
    private api: ApiServices
  ) { }

  getRecDocumentos(data) {
    return this.api.apiCall("liquidacion/get-rec-documento", "POST", data);
  }
}
