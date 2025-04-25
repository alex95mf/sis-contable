import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AnexoListService {

  constructor(
    private apiService: ApiServices, private http: HttpClient
  ) { }

  getAnexos(data: any = {}) {
    return this.apiService.apiCall('general/search-files', 'POST', data)
  }

  deleteAnexo(data: any = {}) {
    return this.apiService.apiCall('general/delete-files', 'POST', data)
  }

  downloadAnexo(data: any = {}) {
    return this.apiService.getTipoBlob('/general/download-files', data)
  }


}
