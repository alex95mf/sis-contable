import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChequesPostService {

  constructor(private apiService: ApiServices) { }

  getChequesPostFechados(data){
    return this.apiService.apiCall('cheques/cheques-post-fechados', 'POST', data);
  }

  updatedChangeChequesPostFechados(data){
    return this.apiService.apiCall('cheques/updated-change-post-fechados', 'POST', data);
  }

}
