import { EventEmitter, Injectable } from "@angular/core";
import { ApiServices } from "src/app/services/api.service"; 

@Injectable({
  providedIn: "root",
})
export class ConsultaLotesService {
  constructor(private apiService: ApiServices) {}

  getLotes(data) {
    return this.apiService.apiCall("lotes/get-lotes", "POST", data);
  }

}
