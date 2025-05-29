import { Component, OnInit } from '@angular/core';
import { ValidacionesFactory } from '../../../../../config/custom/utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-imprimir',
  templateUrl: './imprimir.component.html',
  styleUrls: ['./imprimir.component.scss']
})
export class ImprimirComponent implements OnInit {

  constructor() {}
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  ngOnInit(): void {}

  dataUser: any = [];
  dataSucursal: any = [];
  lstPlusImprimir:any = [];
  nombreBeneficiario:any="";
  setearValores(lstImprimir: any, dataUser: any, dataSucursal: any, nombreBeneficiario:any) {
    this.lstPlusImprimir = lstImprimir;
    this.dataSucursal = dataSucursal;
    this.dataUser = dataUser;
    this.nombreBeneficiario = nombreBeneficiario;
    
  }
}
