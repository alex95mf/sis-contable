import { Injectable , EventEmitter} from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  constructor(
    private apiServices: ApiServices,
  ) { }
  listaParametros$ = new EventEmitter<any>();

  setParametros(data) {
    return this.apiServices.apiCall('digitalizacion/set-parametros', 'POST', data);
  }
  updateParametros(data) {
    return this.apiServices.apiCall('digitalizacion/update-parametros', 'POST', data);
  }

  getConfigParametros(data){
    return this.apiServices.apiCall("digitalizacion/get-parametros", "POST", data);
  }
}
