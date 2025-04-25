import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";

@Injectable({
  providedIn: "root",
})
export class ConceptoService {
  constructor(private apiService: ApiServices) {}

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getTarifa(data) {
    return this.apiService.apiCall("rentas/get-tarifa-concepto", "POST", data);
  }

  saveConcepto(data) {
    return this.apiService.apiCall("concepto/save-concepto", "POST", data);
  }

  getConceptos() {
    return this.apiService.apiCall("concepto/get-conceptos", "POST", {});
  }

  getDetalle(data) {
    return this.apiService.apiCall("concepto/get-detalle", "POST", data);
  }

  deleteConcepto(data) {
    return this.apiService.apiCall("concepto/delete-concepto", "POST", data);
  }

  updateConcepto(data) {
    return this.apiService.apiCall("concepto/update-concepto", "POST", data);
  }

}
