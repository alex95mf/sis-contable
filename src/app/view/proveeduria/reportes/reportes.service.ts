import { Injectable } from '@angular/core';
import { ApiServices } from '../../../services/api.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private apiService: ApiServices, private http: HttpClient) { }

  tablaReport() {
    return this.apiService.apiCall('proveduria/kardex-search-show', 'POST', {});
  }

 getProductPro() {
    return this.apiService.apiCall('proveduria/kardex-show-product', 'POST', {});
  }

  getProGrupo() {
    return this.apiService.apiCall('proveduria/kardex-show-proGrupo', 'POST', {});
  }

  tablaReportdos(data) {
    return this.apiService.apiCall('proveduria/kardex-search-showDos', 'POST', data);
  } 


}
