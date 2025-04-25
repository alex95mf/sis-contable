import { Injectable } from '@angular/core';
import { ApiServices } from '../../../app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DefaultServices {
  constructor(private apiService: ApiServices) { }

  getMenu(data) {
    return this.apiService.apiCall('menu/get-menu', 'POST', data);
  }

  getIpAddress() {
    return this.apiService.getIPAddress();
  }

  logout(data) {
    return this.apiService.apiCall('users/sign-out', 'POST', data);
  }

  getNotifications(data) {
    return this.apiService.apiCall('notification/history', 'POST', data);
  }

  patchNotification(data) {
    return this.apiService.apiCall('notification/reading', 'POST', data);
  }

  getUser(data) {
    return this.apiService.apiCall('seguridad/get-users', 'POST', data);
  }

  editPassword(data) {
    return this.apiService.apiCall('passUpdate/edit-passUser', 'POST', data);
  }

  updateUser(data) {
    return this.apiService.apiCall('seguridad/get-users', 'POST', data);
  }
  
}
