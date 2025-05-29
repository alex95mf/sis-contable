import { Component, Input, OnInit } from '@angular/core';

@Component({
standalone: false,
  selector: 'app-imprimir-com-elect',
  templateUrl: './imprimir-com-elect.component.html',
  styleUrls: ['./imprimir-com-elect.component.scss']
})
export class ImprimirComElectComponent implements OnInit {

  constructor() { }

  @Input() dataUser: any;
  @Input() data: any;

  razonSocialEmpresa:any = "";
  obligado_contabilidad:any = "";
  direccionEmpresa:any = "";
  empresaEmail:any = "";
  num_doc:any = "";
  razonSocial2:any = "";
  num_documento:any = "";
  direccion2:any = "";
  fecha:any = "";
  subtotal:any = "";
  iva_valor:any = "";
  total:any = "";
  lstDetalles:any = [];
  lUsuario:any = "";
  lEmailUsuario:any = "";

  ngOnInit(): void {
    if(this.data.item.fk_tipo_documento == 1){
      this.razonSocialEmpresa = this.data.item._venta._empresa.razon_social + " - " + this.data.item._venta._empresa.razon_social;
      this.obligado_contabilidad = this.data.item._venta._empresa.obligado_contabilidad;
      this.direccionEmpresa = this.data.item._venta._empresa.direccion;
      this.empresaEmail = this.data.item._venta._empresa.email;
      this.num_doc = this.data.item._venta.num_doc;
      this.razonSocial2 = this.data.item._venta.client.razon_social;
      this.num_documento = this.data.item._venta.client.num_documento;
      this.direccion2 = this.data.item._venta.client.direccion;
      this.fecha = this.data.item._venta.fecha;
      this.subtotal = this.data.item._venta.subtotal;
      this.iva_valor = this.data.item._venta.iva_valor;
      this.total = this.data.item._venta.total;
      this.lstDetalles = this.data.item._venta.quotesdetails;
      this.lUsuario =  this.data.item._venta.creator.nombre;
      this.lEmailUsuario = this.data.item._venta.creator.email;


    }else if(this.data.item.fk_tipo_documento == 2){
      this.razonSocialEmpresa = this.data.item._compras.company.razon_social + " - " + this.data.item._compras.company.razon_social;
      this.obligado_contabilidad = this.data.item._compras.company.obligado_contabilidad;
      this.direccionEmpresa = this.data.item._compras.company.direccion;
      this.empresaEmail = this.data.item._compras.company.email;
      this.num_doc = this.data.item._compras.num_documento;
      this.razonSocial2 = this.data.item._compras.proveedor.razon_social;
      this.num_documento = this.data.item._compras.proveedor.num_documento;
      this.direccion2 = this.data.item._compras.proveedor.direccion;
      this.fecha = this.data.item._compras.fecha;
      this.subtotal = this.data.item._compras.subtotal;
      this.iva_valor = this.data.item._compras.iva_valor;
      this.total = this.data.item._compras.total;
      this.lstDetalles = this.data.item._compras.details;
      this.lUsuario =  this.data.item._compras.usuario.nombre;
      this.lEmailUsuario = this.data.item._compras.usuario.email;


    }else if(this.data.item.fk_tipo_documento == 3){
      this.razonSocialEmpresa = this.data.item._notas_cab._venta._empresa.razon_social + " - " + this.data.item._notas_cab._venta._empresa.razon_social;
      this.obligado_contabilidad = this.data.item._notas_cab._venta._empresa.obligado_contabilidad;
      this.direccionEmpresa = this.data.item._notas_cab._venta._empresa.direccion;
      this.empresaEmail = this.data.item._notas_cab._venta._empresa.email;
      this.num_doc = this.data.item._notas_cab._venta.num_doc;
      this.razonSocial2 = this.data.item._notas_cab._venta.client.razon_social;
      this.num_documento = this.data.item._notas_cab._venta.client.num_documento;
      this.direccion2 = this.data.item._notas_cab._venta.client.direccion;
      this.fecha = this.data.item._notas_cab._venta.fecha;
      this.subtotal = this.data.item._notas_cab._venta.subtotal;
      this.iva_valor = this.data.item._notas_cab._venta.iva_valor;
      this.total = this.data.item._notas_cab._venta.total;
      this.lstDetalles = this.data.item._notas_cab._venta.quotesdetails;
      this.lUsuario =  this.data.item._notas_cab._venta.creator.nombre;
      this.lEmailUsuario = this.data.item._notas_cab._venta.creator.email;


    }else if(this.data.item.fk_tipo_documento == 6){
      this.razonSocialEmpresa = this.data.item._retencion_cab._compras.company.razon_social + " - " + this.data.item._retencion_cab._compras.company.razon_social;
      this.obligado_contabilidad = this.data.item._retencion_cab._compras.company.obligado_contabilidad;
      this.direccionEmpresa = this.data.item._retencion_cab._compras.company.direccion;
      this.empresaEmail = this.data.item._retencion_cab._compras.company.email;
      this.num_doc = this.data.item._retencion_cab.numero;
      this.razonSocial2 = this.data.item._retencion_cab._compras.proveedor.razon_social;
      this.num_documento = this.data.item._retencion_cab._compras.proveedor.num_documento;
      this.direccion2 = this.data.item._retencion_cab._compras.proveedor.direccion;
      this.fecha = this.data.item._retencion_cab._compras.fecha;
      this.subtotal = this.data.item._retencion_cab._compras.subtotal;
      this.iva_valor = this.data.item._retencion_cab._compras.iva_valor;
      this.total = this.data.item._retencion_cab._compras.total;
      this.lstDetalles = this.data.item._retencion_cab._compras.details;
      this.lUsuario =  this.data.item._retencion_cab._compras.usuario.nombre;
      this.lEmailUsuario = this.data.item._retencion_cab._compras.usuario.email;


    }
    
  }

}
