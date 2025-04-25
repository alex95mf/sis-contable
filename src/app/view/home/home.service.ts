import { Injectable } from '@angular/core';
import { ApiServices } from '../../../app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class HomeServices {


  constructor(private apiService: ApiServices) { }

  public getLogin(data) {
    return this.apiService.apiCallPublic('users/sign-in', 'POST', data);
  }

  public setToken(token) {
    return this.apiService.setToken(token);
  }

  public getCorreo(data) {
    return this.apiService.apiCallPublic('users/recover-password', 'POST', data);
  }

  public getIpAddress() {
    return this.apiService.getIPAddress();
  }
  
}