import { Component, OnInit } from '@angular/core';
import { ValidacionesFactory } from '../../../../../config/custom/utils/ValidacionesFactory';

@Component({
  selector: 'app-prestamo-imprimir',
  templateUrl: './imprimir.component.html',
  styleUrls: ['./imprimir.component.scss']
})
export class ImprimirPrestamoComponent implements OnInit {

  constructor() {}
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  ngOnInit(): void {}

  dataUser: any = [];
  dataSucursal: any = [];
  lImprimir:any = [];
  nombreBeneficiario:any="";
  setearValores(lImprimir: any, dataUser: any, dataSucursal: any, itemSeleccionado) {
    console.log("lImprimir: ", lImprimir)
    console.log("dataUser: ", dataUser)
    console.log("dataSucursal: ", dataSucursal)
    this.lImprimir = lImprimir;
    this.dataSucursal = dataSucursal;
    this.dataUser = dataUser;
    this.nombreBeneficiario = itemSeleccionado.apellidos + " " + itemSeleccionado.nombres;
  }

  validaValor(valor){
    if(Number(valor) == 0){
      return false;
    }else{
      return true;
    }    
  }
}
