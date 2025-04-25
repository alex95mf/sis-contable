import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {

  constructor(private apiService: ApiServices) { }

  getConceptos()
  {
    return this.apiService.apiCall('concepto/get-conceptos', 'POST', {});
  }

  getDetallesConcepto(data)
  {
    return this.apiService.apiCall('concepto/get-detalle', 'POST', data);
  }

  getTarifas(data: any = {})
  {
    return this.apiService.apiCall('rentas/get-tarifas-concepto', 'POST', data);
  }

  getTarifasFiltro(data)
  {
    return this.apiService.apiCall('rentas/get-tarifas-concepto-filtro', 'POST', data);
  }

  getTarifa(data)
  {
    return this.apiService.apiCall(`rentas/get-tarifa-detalles/${data}`, 'POST',  {});
  }

  getTarifaConceptoDetalle(data)
  {
    return this.apiService.apiCall(`rentas/tarifa-concepto-detalle/${data}`, 'POST',  {});
  }

  setTarifa(data)
  {
    return this.apiService.apiCall('rentas/set-tarifa', 'POST', data);
  }

  updateTarifa(data)
  {
    return this.apiService.apiCall(`rentas/update-tarifa/${data.tarifa.id}`, 'POST', data);
  }
}
