import { Injectable , EventEmitter} from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConsultaProveedoresService {


  constructor(private apiService: ApiServices, private http: HttpClient) { }

  getProveedores(data:any = {}) {
    return this.apiService.apiCall('proveedores/get-proveedores-todos', 'POST', data);
  }
}
