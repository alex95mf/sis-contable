import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TopSenMailService {

  constructor(private apiService: ApiServices) { }

  sendMailUser(data) {
    return this.apiService.apiCall('mail/sendmail-top', 'POST', data);
  }

}
