import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../../../../services/commonServices'

@Component({
standalone: false,
  selector: 'app-imprimir-componente-global',
  templateUrl: './imprimir-com-elect.component.html',
  styleUrls: ['./imprimir-com-elect.component.scss']
})
export class ImprimirComponentGlobal implements OnInit {

  constructor(private commSrv:CommonService) { }

  @Input() dataUser: any;
  @Input() data: any;

  razonSocialEmpresa: any = "";
  obligado_contabilidad: any = "";
  direccionEmpresa: any = "";
  empresaEmail: any = "";
  num_doc: any = "";
  razonSocial2: any = "";
  num_documento: any = "";
  direccion2: any = "";
  fecha: any = "";
  subtotal: any = "";
  iva_valor: any = "";
  total: any = "";
  lstDetalles: any = [];

  ngOnInit(): void {
  }

  redondeoInteger(num) {
    /* return Math.round(num); */
    return parseFloat(num).toFixed(2);
  }

}
