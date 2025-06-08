import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService,MessageService, ToastMessageOptions  } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { MenuItem } from 'primeng/api';

import { CustonService } from '../app-custom.service';
import { contableConfService } from 'src/app/view/panel-control/parametro/contable/contable.service';

@Component(

  {
    standalone: false,
    template:  `
    <div *ngIf="LoadModalCargaEditImp ; else PermisoVerDenegado">

        <p-confirmPopup></p-confirmPopup>



        <div class="pt-3 pr-3 pl-3">
          <div class="row">
            <div class="col-sm-3">
              <button [disabled]="botonConfirmar"  class="ml-2 p-button-sm p-button-secondary" (click)="CofirmarEdicionImpuestos($event)"  pButton type="button" label="Actualizar" ></button>
            </div>

            <div class="col-sm-9">
              <p-messages [(value)]="msgs1" [enableService]="false"></p-messages>
            </div>

          </div>
        </div>


        <div class="p-3">
          <div class="row">
            <div class="col-sm-6">
              <div class="input-group input-group-sm mt-1">
                  <div class="input-group-prepend">
                      <span class="input-group-text size-span-campo" id="inputGroup-sizing-sm">Proveedor</span>
                  </div>
                  <input [(ngModel)]="compra.fk_id_proveedor" type="text"
                      class="form-control form-control-sm d-none" disabled>
                  <input [(ngModel)]="compra.proveedor_name" type="text" class="form-control form-control-sm"
                      placeholder="Busqueda proveedor" disabled>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="input-group input-group-sm mt-1">
                  <div class="input-group-prepend">
                      <span class="input-group-text size-span-campo" id="inputGroup-sizing-sm">Identificación</span>
                  </div>
                  <input [(ngModel)]="compra.identificacion_proveedor" type="text" class="form-control form-control-sm"
                      placeholder="identificacion" disabled>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="input-group input-group-sm mt-1">
                  <div class="input-group-prepend">
                      <span class="input-group-text size-span-campo" id="inputGroup-sizing-sm">N° Comprobante</span>
                  </div>
                  <input [(ngModel)]="compra.numero_comprobante" type="text" class="form-control form-control-sm"
                      placeholder="Busqueda proveedor" disabled>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="input-group input-group-sm mt-1">
                  <div class="input-group-prepend">
                      <span class="input-group-text size-span-campo" id="inputGroup-sizing-sm">autorización</span>
                  </div>
                  <input [(ngModel)]="compra.autorizacion" type="text" class="form-control form-control-sm"
                      placeholder="identificacion" disabled>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="input-group input-group-sm mt-1">
                  <div class="input-group-prepend">
                      <span class="input-group-text size-span-campo" id="inputGroup-sizing-sm">Fecha Emisión</span>
                  </div>
                  <input [(ngModel)]="compra.fecha_emision" type="text" class="form-control form-control-sm"
                      placeholder="" disabled>
              </div>
            </div>

          </div>
        </div>

        <div class="pr-3 pl-3">
          <div class="row">
            <div class="col-sm-12">
              <hr>
            </div>
          </div>
        </div>

        <div id="tabla_xml"  class="pr-3 pl-3 mb-5">
          <div class="row">
            <div class="col-sm-12">
                <p-tabView styleClass="tab_content_compras" class="overflow-hidden">
                  <p-tabPanel class="p-0" header="ITEMS">
                      <div class="col-12 filters p-0">

                          <div class="justify-content-center">
                              <div
                                  class="mb-2 content-tabla-general content-tabla_editable table_scroll_horizontal_over">

                                  <table class="table">
                                      <thead>
                                          <tr>
                                              <th
                                                  style="display: none; text-align: center;width: 0%;padding-left: 0px;">
                                                  Producto</th>
                                              <th style="width: 250px; ">Nombre</th>
                                              <th style="width: 0%; display: none;">Código</th>
                                              <th style="width: 23%; display: none;">Descripción</th>
                                              <th style="display: none;">Cant.</th>
                                              <th style="display: none;">P/U</th>
                                              <th style="display: none; width: 60px;">Subtotal</th>
                                              <th style="display: none; width: 60px;">Desc.</th>
                                              <th style="display: none; width: 150px;">Impue.</th>
                                              <th style="width: 100px;">Total</th>
                                              <th style="width: 300px;">Ret. Fuente</th>
                                              <th style="width: 250px;">Ret. IVA</th>
                                              <th style="display: none; width: 150px;">Centro</th>
                                              <th style="width: 60px">IVA</th>

                                          </tr>
                                      </thead>
                                      <tbody class="w-full">
                                          <tr *ngFor="let d of dataProducto; let i = index">
                                              <td style="display: none; text-align: center;">{{i+1}}</td>
                                              <td>
                                                  <input type="text" class="form-control form-control-sm pr-1"
                                                       [(ngModel)]="d.nombre"
                                                      [disabled]="true" id="product_{{i}}">
                                              </td>
                                              <td style="display: none; text-align: center;">
                                                  <input type="text" [(ngModel)]="d.codigo" [disabled]="true"
                                                      placeholder="Código">
                                              </td>
                                              <td style="display: none; text-align: center;">
                                                  <textarea class="form-control form-control-sm"
                                                      [(ngModel)]="d.observacion"
                                                      placeholder="Ingrese descripción" rows="1">
                                              </textarea>
                                              </td>
                                              <td style="display: none;">
                                                  <input type="text" class="form-control form-control-sm pr-1"
                                                      placeholder="0.00" style="width: 100px; text-align: right;"
                                                      [(ngModel)]="d.cantidad" (keyup)="sumRegistroDetalle(i)"
                                                      min="0" (keypress)="commonServices.FormatDecimalVal($event)"
                                                      [disabled]="d.InputDisabledCantidad" id="cantidad_{{i}}">
                                              </td>
                                              <td style="display: none;">
                                                  <input style="width: 60px" type="text"
                                                      class="form-control form-control-sm pr-1"
                                                      placeholder="$ 0.00"
                                                      style="width: 100px; text-align: right;"
                                                      [(ngModel)]="d.precio" (keyup)="sumRegistroDetalle(i)"
                                                      min="0" (keypress)="commonServices.FormatDecimalVal($event)"
                                                      [disabled]="d.fk_producto == undefined ">
                                              </td>
                                              <td
                                                  style="display: none; text-align: right; width: 100px; vertical-align: middle;">
                                                  <div style="width: 100px;">
                                                      $ {{d.subtotalItems.toFixed(2)}}
                                                  </div>
                                              </td>
                                              <td style="display: none;" >
                                                  <input type="text" class="form-control form-control-sm pr-1"
                                                      placeholder="$ 0.00"
                                                      style="width: 100px; text-align: right;"
                                                      [(ngModel)]="d.desc" (keyup)="sumRegistroDetalle(i)" min="0"
                                                      (keypress)="commonServices.FormatDecimalVal($event)"
                                                      [disabled]="d.fk_producto == undefined ">
                                              </td>
                                              <td style="display: none;" >
                                                  <div>
                                                      <ng-select style="width: 150px;" loadingText="Cargando.."
                                                          [clearable]=false [loading]="d.LoadOpcionImpuesto"
                                                          placeholder="-seleccionar impuesto-"
                                                          [(ngModel)]="d.impuesto"
                                                          (ngModelChange)="CambioImpuesto(i)"
                                                          class="form-control form-control-sm custom-select"
                                                          (open)="getImpuestosDetalle(i,dataProducto)"
                                                          [items]="impuestos" bindLabel="descripcion"
                                                          bindValue="valor" appendTo="body"
                                                          id="idTipImpuestoSelect"></ng-select>
                                                  </div>
                                              </td>
                                              <td
                                                  style="text-align: right; width: 100px; vertical-align: middle;">
                                                  <div style="width: 100px;">
                                                      $ {{d.totalItems.toFixed(2)}}
                                                  </div>
                                              </td>
                                              <td style="width: 300px;">
                                                  <div style="width: 300px;">
                                                      <ng-select   loadingText="Cargando.." [clearable]=false
                                                          [loading]="d.LoadOpcionReteFuente"
                                                          placeholder="-seleccionar rte. fuente-"
                                                          [(ngModel)]="d.rte_fuente"
                                                          class="form-control form-control-sm custom-select"
                                                          (open)="getRetencionFuente(i)" [items]="rete_fuente"
                                                          bindLabel="combo" bindValue="id_reten_fuente"
                                                          (change)="ChangeFuente($event,dataProducto,i)"
                                                          id="idReteFuente" appendTo="#tabla_xml" style="width: 300px;">
                                                          <ng-template ng-option-tmp let-item="item">
                                                              <strong>{{item.combo}}</strong>
                                                          </ng-template>
                                                      </ng-select>
                                                  </div>
                                              </td>
                                              <td style="width: 250px;">
                                                  <div style="width: 250px;">
                                                      <ng-select style="width: 250px;" loadingText="Cargando.."
                                                          [clearable]=false [loading]="d.LoadOpcionRteIva"
                                                          placeholder="-seleccionar rte. IVA-"
                                                          [(ngModel)]="d.rte_iva"
                                                          class="form-control form-control-sm custom-select"
                                                          (open)="getRetencionIva(i,dataProducto)"
                                                          [items]="rte_iva"
                                                          (change)="ChangeImpuestoIva($event,dataProducto,i)"
                                                          [disabled]="d.isRetencionIva"
                                                          bindLabel="descripcion_tipo_servicio"
                                                          bindValue="codigo_sri_iva" id="idRteIva"
                                                          appendTo="#tabla_xml"></ng-select>
                                                  </div>
                                              </td>
                                              <td style="display: none;">
                                                  <div>
                                                      <ng-select style="width: 150px;" loadingText="Cargando.."
                                                          [clearable]=false [loading]="d.LoadOpcionCentro"
                                                          placeholder="-seleccionar centro-"
                                                          [(ngModel)]="d.centro"
                                                          class="form-control form-control-sm custom-select"
                                                          (open)="getCentroDetalle(i)" [items]="centros"
                                                          bindLabel="nombre" bindValue="id"
                                                          appendTo="body" id="idCentroCosto"></ng-select>
                                                  </div>
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control form-control-sm pr-1"
                                                      placeholder="$ 0.00" style="width: 60px; text-align: right;"
                                                      [(ngModel)]="d.iva_detalle" min="0" [disabled]="true">
                                              </td>

                                          </tr>
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      </div>
                  </p-tabPanel>
                  <p-tabPanel class="p-0" header="CUENTAS">
                      <div class="col-12 filters p-0">

                          <div class="justify-content-center">
                              <div
                                  class="mb-2 content-tabla-general content-tabla_editable table_scroll_horizontal_over">
                                  <table class="table">
                                      <thead>
                                          <tr>
                                              <th
                                                  style="display: none; text-align: center;width: 0%;padding-left: 0px;">
                                                  cuenta
                                              </th>
                                              <th style="width: 250px; ">Cuenta</th>
                                              <th style="width: 0%; display: none;">Código</th>
                                              <th style="width: 23%; display: none;">Descripción</th>
                                              <th style="display: none;">Cant.</th>
                                              <th style="display: none;">P/U</th>
                                              <th style="display: none; width: 60px;">Subtotal</th>
                                              <th style="display: none; width: 60px;">Desc.</th>
                                              <th style="display: none; width: 150px;">Impue.</th>
                                              <th style="width: 100px;">Total</th>
                                              <th style="width: 300px;">Ret. Fuente</th>
                                              <th style="width: 150px;">Ret. IVA</th>
                                              <th style="display: none; width: 250px;">Centro</th>
                                              <th style="width: 60px">IVA</th>
                                          </tr>
                                      </thead>
                                      <tbody class="w-full">
                                          <tr *ngFor="let c of dataCuenta; let i = index">
                                              <td style="display: none; text-align: center;">{{i+1}}</td>
                                              <td>
                                                  <input type="text" class="form-control form-control-sm pr-1"
                                                      [(ngModel)]="c.cuenta_detalle"
                                                      [disabled]="true" id="product_{{i}}">
                                              </td>
                                              <td style="display: none; text-align: center;">
                                                  <input type="text" [(ngModel)]="c.codigo" [disabled]="true"
                                                      placeholder="Código">
                                              </td>
                                              <td style="display: none; text-align: center;">
                                                  <textarea class="form-control form-control-sm"
                                                      [(ngModel)]="c.observacion"
                                                      placeholder="Ingrese descripción" rows="1">
                                              </textarea>
                                              </td>
                                              <td style="display: none;" >
                                                  <input type="text" class="form-control form-control-sm pr-1"
                                                      placeholder="0.00" style="width: 100px; text-align: right;"
                                                      [(ngModel)]="c.cantidad"
                                                      (keyup)="sumRegistroDetalleCuenta(i)" min="0"
                                                      (keypress)="commonServices.FormatDecimalVal($event)"
                                                      [disabled]="c.InputDisabledCantidad"
                                                      id="cantidad_cuenta_{{i}}">
                                              </td>
                                              <td style="display: none;">
                                                  <input style="width: 60px" type="text"
                                                      class="form-control form-control-sm pr-1"
                                                      placeholder="$ 0.00"
                                                      style="width: 100px; text-align: right;"
                                                      [(ngModel)]="c.precio" (keyup)="sumRegistroDetalleCuenta(i)"
                                                      min="0" (keypress)="commonServices.FormatDecimalVal($event)"
                                                      [disabled]="c.cuenta_detalle == undefined ">
                                              </td>
                                              <td
                                                  style="display: none; text-align: right; width: 100px; vertical-align: middle;">
                                                  <div style="width: 100px;">
                                                      $ {{c.subtotalItems.toFixed(2)}}
                                                  </div>
                                              </td>
                                              <td style="display: none;">
                                                  <input type="text" class="form-control form-control-sm pr-1"
                                                      placeholder="$ 0.00"
                                                      style="width: 100px; text-align: right;"
                                                      [(ngModel)]="c.desc" (keyup)="sumRegistroDetalleCuenta(i)"
                                                      min="0" (keypress)="commonServices.FormatDecimalVal($event)"
                                                      [disabled]="c.cuenta_detalle == undefined ">
                                              </td>
                                              <td style="display: none;">
                                                  <div>
                                                      <ng-select style="width: 150px;" loadingText="Cargando.."
                                                          [clearable]=false [loading]="c.LoadOpcionImpuesto"
                                                          placeholder="-seleccionar impuesto-"
                                                          [(ngModel)]="c.impuesto"
                                                          (ngModelChange)="CambioImpuestoCuenta(i)"
                                                          class="form-control form-control-sm custom-select"
                                                          (open)="getImpuestosDetalle(i,dataCuenta)"
                                                          [items]="impuestos" bindLabel="descripcion"
                                                          bindValue="valor" appendTo="body"
                                                          id="idTipImpuestoSelect"></ng-select>
                                                  </div>
                                              </td>
                                              <td
                                                  style="text-align: right; width: 100px; vertical-align: middle;">
                                                  <div style="width: 100px;">
                                                      $ {{c.totalItems.toFixed(2)}}
                                                  </div>
                                              </td>
                                              <td style="width: 300px;">
                                                  <div style="width: 300px;">
                                                      <ng-select loadingText="Cargando.." [clearable]=false
                                                          [loading]="c.LoadOpcionReteFuente"
                                                          placeholder="-seleccionar rte. fuente-"
                                                          [(ngModel)]="c.rte_fuente"
                                                          class="form-control form-control-sm custom-select"
                                                          (change)="ChangeFuente($event,dataCuenta,i)"
                                                          (open)="getRetencionFuente(i)" [items]="rete_fuente"
                                                          bindLabel="combo" bindValue="id_reten_fuente"
                                                          id="idReteFuente" appendTo="body" >
                                                          <ng-template ng-option-tmp let-item="item">
                                                              {{item.combo}}
                                                          </ng-template>
                                                      </ng-select>
                                                  </div>
                                              </td>
                                              <td style="width: 250px;">
                                                  <div style="width: 250px;">
                                                      <ng-select style="width: 250px;" loadingText="Cargando.."
                                                          [clearable]=false [loading]="c.LoadOpcionRteIva"
                                                          placeholder="-seleccionar rte. IVA-"
                                                          [(ngModel)]="c.rte_iva"
                                                          class="form-control form-control-sm custom-select"
                                                          (change)="ChangeImpuestoIva($event,dataCuenta,i)"
                                                          [disabled]="c.isRetencionIva"
                                                          (open)="getRetencionIva(i,dataCuenta)" [items]="rte_iva"
                                                          bindLabel="descripcion_tipo_servicio"
                                                          bindValue="codigo_sri_iva" id="idRteIva"
                                                          appendTo="#tabla_xml"></ng-select>
                                                  </div>
                                              </td>
                                              <td style="display: none;">
                                                  <div>
                                                      <ng-select style="width: 150px;" loadingText="Cargando.."
                                                          [clearable]=false [loading]="c.LoadOpcionCentro"
                                                          placeholder="-seleccionar centro-"
                                                          [(ngModel)]="c.centro"
                                                          class="form-control form-control-sm custom-select"
                                                          (open)="getCentroDetalle(i)" [items]="centros"
                                                          bindLabel="nombre" bindValue="id"
                                                          appendTo="#tabla_xml" id="idCentroCosto"></ng-select>
                                                  </div>
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control form-control-sm pr-1"
                                                      placeholder="$ 0.00" style="width: 60px; text-align: right;"
                                                      [(ngModel)]="c.iva_detalle" min="0" [disabled]="true">
                                              </td>

                                          </tr>
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      </div>
                  </p-tabPanel>
              </p-tabView>
            </div>
          </div>
        </div>

      </div>
      <ng-template #PermisoVerDenegado>


      <div id="contenedor_session_permiso_denegado">
          <div class="container-xxl container-p-y">
              <div class="misc-wrapper">
                  <br>
                  <br>
                  <p class="mb-4 mx-2">{{mensaje_load}}</p>
                  <div class="mt-2">
                    <p-progressSpinner [style]="{width: '50px', height: '50px'}" styleClass="custom-spinner" strokeWidth="8" fill="#EEEEEE" animationDuration=".5s"></p-progressSpinner>
                  </div>
                  <br>
                  <br>
              </div>
          </div>
      </div>

      </ng-template>

    `,
    providers: [DialogService, MessageService,ConfirmationService]
  }

)
export class CcModalEditarImpuestosComprasComponent  implements AfterViewChecked, OnInit {


  compra: any = {fecha_emision:'',identificacion_proveedor: '',direccion_proveedor: '', numero_comprobante: '', autorizacion: '',  tipo_identificacion: '01', fk_id_proveedor: 0,  proveedor_name:''};

  LoadOpcion: any = false;
  LoadOpcionTipoPago: any = false;
  LoadOpcionUsuario: any = false;
  LoadOpcionTipoDoc: any = false;
  LoadOpcionProductos: any = false;
  LoadOpcionSustento: any = false;
  LoadModalCargaEditImp: any = false;


  impuestos: any;
  sustento_array: any;
  rete_fuente: any;
  rte_iva: any;
  centros: any;

  dataProducto: any = [{ editado:"N", cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false, LoadOpcionCentro: false, subtotal_noobjeto: (0.00).toFixed(2), subtotal_excento: (0.00).toFixed(2), subtotal_cero: (0.00).toFixed(2), subtotal_iva: (0.00).toFixed(2), InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2), fk_producto: 0, impuesto: 2, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 }];
  dataCuenta: any = [{ editado:"N", cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false, LoadOpcionCentro: false, subtotal_noobjeto: (0.00).toFixed(2), subtotal_excento: (0.00).toFixed(2), subtotal_cero: (0.00).toFixed(2), subtotal_iva: (0.00).toFixed(2), InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2), cuenta_detalle: 0, impuesto: 2, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 }];

  detalleImpuesto: any = [];
  detalleImpuestoTemp: any = [];

  tabmenu: MenuItem[];
  msgs1: ToastMessageOptions[];

  constructor
  (

    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNG,
    private messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private cdRef:ChangeDetectorRef,
    private commonService: CustonService,
    private contableService: contableConfService,
    ) { }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
    //console.log('dafadfdsfsdfsdfsdf')
  }

  ngOnInit(): void {


    (this.msgs1 as any) = [
      {severity:'info', detail:'Al seleccionar un nuevo codigo de impuesto se vera afectuado solo cuando se de clic en actualizar.', closable:false}
    ];


    let configu = this.config.data;


    let consulta = {
      id_compra: configu.id_compra
    }

    this.commonService.obtenerComprasPorCodigo(consulta).subscribe(res => {
      console.log(res)
      let comprobante = res["data"][0];
      this.compra.proveedor_name = comprobante.proveedor.razon_social;
      this.compra.identificacion_proveedor = comprobante.ruc;
      this.compra.autorizacion = comprobante.num_aut;
      this.compra.numero_comprobante = comprobante.num_doc;
      this.compra.fecha_emision = comprobante.fecha_compra




      this.contableService.getRetencionFuenteCompras().subscribe(res => {
        this.rete_fuente = res;

        this.contableService.getRetencionIvaCompras().subscribe(res => {
          this.rte_iva = res;

          let data = { fields: ["IMPUESTOS"] };
          this.contableService.ObtenerCatalogoGeneral(data).subscribe(res => {

            let catalogo = res['data']['catalogs'];
            this.impuestos = catalogo['IMPUESTOS'];

            this.contableService.getRetencionFuenteCompras().subscribe(res => {

              this.rete_fuente = res;
              this.dataProducto = [];

              if (comprobante.detalle.length > 0) {
                comprobante.detalle.forEach(element => {

                  this.dataProducto.push({
                    cod_anexo_iva: element.cod_riva_anexo,
                    cod_iva: element.cod_riva,
                    porce_iva: element.porcentaje_riva,
                    cod_anexo_fte: element.cod_rft_anexo,
                    cod_fte: element.cod_rft_anexo,
                    porce_fte: element.porcentaje_rft,
                    subtotal_noobjeto: element.subtotal_noobjeto,
                    subtotal_excento: element.subtotal_excento,
                    subtotal_cero: element.subtotal_cero,
                    subtotal_iva: element.subtotal_iva,
                    iva_detalle: element.iva_detalle_item,
                    fk_producto: element.fk_producto,
                    impuesto: element.codigo_impuesto_iva.toString(),
                    rte_fuente: element.codigo_retencion_fuente,
                    rte_iva: element.codigo_retencion_iva,
                    centro: element.centro_costo,
                    nombre: element.nombre,
                    codigo: element.codigo,
                    observacion: element.observacion,
                    cantidad: element.cantidad,
                    precio: element.precio,
                    desc: element.descuento,
                    subtotalItems: parseFloat(element.subtotalitems),
                    totalItems: parseFloat(element.totalitems),
                    paga_iva: element.paga_iva
                  })
                });
              }

              if (comprobante.detalle_cuentas.length > 0) {

                this.dataCuenta = [];


                comprobante.detalle_cuentas.forEach(element => {


                  this.dataCuenta.push({
                    cuenta_detalle: '(' + element.codigo_cuenta + ') ' + element.nombre_cuenta,
                    cod_anexo_iva: element.cod_riva_anexo,
                    cod_iva: element.cod_riva,
                    porce_iva: element.porcentaje_riva,
                    cod_anexo_fte: element.cod_rft_anexo,
                    cod_fte: element.cod_rft_anexo,
                    porce_fte: element.porcentaje_rft,
                    subtotal_noobjeto: element.subtotal_noobjeto,
                    subtotal_excento: element.subtotal_excento,
                    subtotal_cero: element.subtotal_cero,
                    subtotal_iva: element.subtotal_iva,
                    iva_detalle: element.iva_detalle_item,
                    fk_producto: element.fk_producto,
                    impuesto: element.codigo_impuesto_iva.toString(),
                    rte_fuente: element.codigo_retencion_fuente,
                    rte_iva: element.codigo_retencion_iva,
                    centro: element.centro_costo,
                    nombre: element.nombre_cuenta,
                    codigo: element.codigo_cuenta,
                    observacion: element.observacion,
                    cantidad: element.cantidad,
                    precio: element.precio,
                    desc: element.descuento,
                    subtotalItems: parseFloat(element.subtotalitems),
                    totalItems: parseFloat(element.totalitems),
                    paga_iva: element.paga_iva
                  })
                });
              }

              this.LoadModalCargaEditImp = true;
              //this.calculaImpuesto();
              this.calculaImpuestoIva();


            }, error => {
              //this.lcargando.ctlSpinner(false);
              //this.toastr.info(error.error.message);
            })

            //this.calculaImpuestoIva();
            //this.lcargando.ctlSpinner(false);

          }, error => {
            //this.toastr.info(error.error.message);
            //this.lcargando.ctlSpinner(false);
          })
        }, error => {
          //this.toastr.info(error.error.message);
          //this.lcargando.ctlSpinner(false);
        })
      }, error => {
        //this.toastr.info(error.error.message);
        //this.lcargando.ctlSpinner(false);
      })



    }, error => {
      //this.lcargando.ctlSpinner(false);
      //this.toastr.info(error.error.message);
    })

  }


  referencia = this.ref;

  calculaImpuesto() {
    return new Promise((resolve, reject) => {

      this.detalleImpuesto = [];

      this.dataProducto.forEach(element => {

        if (element.fk_producto !== 0) {

          if (this.detalleImpuesto.length === 0) {

            let base = element.totalItems;
            let retencion = parseFloat(base) * (parseFloat(element.porce_fte) / 100);

            this.detalleImpuesto.push({
              base: parseFloat(parseFloat(base).toFixed(2)), porcentaje: element.porce_fte, total: parseFloat(retencion.toFixed(2)), tipo: 'FUENTE', rte_fuente: element.rte_fuente, codigo: element.cod_fte, codigo_anexo: element.cod_anexo_fte
            });

          } else {

            //verificamos si existe registrado el codigo fuente
            let valida_impuesto = false;
            let contador = 0;

            this.detalleImpuesto.forEach(impues => {

              if ((impues.rte_fuente === element.rte_fuente) && (impues.tipo === 'FUENTE')) {
                valida_impuesto = true;
              }

              contador++;

            })


            if (valida_impuesto) {

              let base = this.detalleImpuesto[contador - 1].base;
              let base_update = base + element.totalItems;

              let retencion = parseFloat(base_update) * (parseFloat(element.porce_fte) / 100);

              this.detalleImpuesto[contador - 1].total = parseFloat(retencion.toFixed(2));
              this.detalleImpuesto[contador - 1].base = parseFloat(base_update.toFixed(2));

            } else {

              let base = element.totalItems;
              let retencion = parseFloat(base) * (parseFloat(element.porce_fte) / 100);

              this.detalleImpuesto.push({
                base: parseFloat(parseFloat(base).toFixed(2)), porcentaje: element.porce_fte, total: parseFloat(retencion.toFixed(2)), tipo: 'FUENTE', rte_fuente: element.rte_fuente, codigo: element.cod_fte, codigo_anexo: element.cod_anexo_fte
              });

            }


          }
        }

      });


      this.dataCuenta.forEach(element => {

        if (element.codigo !== null) {

          if (this.detalleImpuesto.length === 0) {

            let base = element.totalItems;
            let retencion = parseFloat(base) * (parseFloat(element.porce_fte) / 100);

            this.detalleImpuesto.push({
              base: parseFloat(parseFloat(base).toFixed(2)), porcentaje: element.porce_fte, total: parseFloat(retencion.toFixed(2)), tipo: 'FUENTE', rte_fuente: element.rte_fuente, codigo: element.cod_fte, codigo_anexo: element.cod_anexo_fte
            });

          } else {

            //verificamos si existe registrado el codigo fuente
            let valida_impuesto = false;
            let contador = 0;

            this.detalleImpuesto.forEach(impues => {

              if ((impues.rte_fuente === element.rte_fuente) && (impues.tipo === 'FUENTE')) {
                valida_impuesto = true;
              }

              contador++;

            })


            if (valida_impuesto) {

              let base = this.detalleImpuesto[contador - 1].base;
              let base_update = base + element.totalItems;

              let retencion = parseFloat(base_update) * (parseFloat(element.porce_fte) / 100);

              this.detalleImpuesto[contador - 1].total = parseFloat(retencion.toFixed(2));
              this.detalleImpuesto[contador - 1].base = parseFloat(base_update.toFixed(2));

            } else {

              let base = element.totalItems;
              let retencion = parseFloat(base) * (parseFloat(element.porce_fte) / 100);

              this.detalleImpuesto.push({
                base: parseFloat(parseFloat(base).toFixed(2)), porcentaje: element.porce_fte, total: parseFloat(retencion.toFixed(2)), tipo: 'FUENTE', rte_fuente: element.rte_fuente, codigo: element.cod_fte, codigo_anexo: element.cod_anexo_fte
              });

            }

          }

        }
      });




      resolve(true);

    });
  }

  async calculaImpuestoIva() {

    this.detalleImpuesto = [];

    await this.calculaImpuesto().then(rsp => {

      /*Recorremos kos detalles para calcular la tabla de impuestos*/
      this.dataProducto.forEach(element => {

        if (element.fk_producto !== 0) {

          if (this.detalleImpuesto.length === 0) {

            if (parseFloat(element.porce_iva) > 0) {

              let base = element.iva_detalle;
              let retencion = parseFloat(base) * (parseFloat(element.porce_iva) / 100);

              this.detalleImpuesto.push({
                base: base, porcentaje: element.porce_iva, total: parseFloat(retencion.toFixed(2)), tipo: 'IVA', rte_fuente: element.rte_iva, codigo: element.cod_iva, codigo_anexo: element.cod_anexo_iva
              });
            }

          } else {

            //verificamos si existe registrado el codigo fuente
            let valida_impuesto = false;
            let contador = 0;

            this.detalleImpuesto.forEach(impues => {

              if ((impues.rte_fuente === element.rte_iva) && (impues.tipo === 'IVA')) {
                valida_impuesto = true;
              }

              contador++;

            })


            if (valida_impuesto) {

              if (parseFloat(element.porce_iva) > 0) {

                let base = this.detalleImpuesto[contador - 1].base;
                let base_update = parseFloat(base) + parseFloat(element.iva_detalle);

                let retencion = base_update * (parseFloat(element.porce_iva) / 100);

                this.detalleImpuesto[contador - 1].total = parseFloat(retencion.toFixed(2));
                this.detalleImpuesto[contador - 1].base = parseFloat(base_update.toFixed(2));
              }

            } else {

              if (parseFloat(element.porce_iva) > 0) {

                let base = element.iva_detalle;
                let retencion = parseFloat(base) * (parseFloat(element.porce_iva) / 100);

                this.detalleImpuesto.push({
                  base: base, porcentaje: element.porce_iva, total: parseFloat(retencion.toFixed(2)), tipo: 'IVA', rte_fuente: element.rte_iva, codigo: element.cod_iva, codigo_anexo: element.cod_anexo_iva
                });
              }

            }


          }
        }

      });


      /* recorremos los detalles de cuenta */
      this.dataCuenta.forEach(element => {

        if (element.codigo !== null) {

          if (this.detalleImpuesto.length === 0) {

            if (parseFloat(element.porce_iva) > 0) {

              let base = element.iva_detalle;
              let retencion = parseFloat(base) * (parseFloat(element.porce_iva) / 100);

              this.detalleImpuesto.push({
                base: base, porcentaje: element.porce_iva, total: parseFloat(retencion.toFixed(2)), tipo: 'IVA', rte_fuente: element.rte_iva, codigo: element.cod_iva, codigo_anexo: element.cod_anexo_iva
              });
            }

          } else {

            //verificamos si existe registrado el codigo fuente
            let valida_impuesto = false;
            let contador = 0;

            this.detalleImpuesto.forEach(impues => {

              if ((impues.rte_fuente === element.rte_iva) && (impues.tipo === 'IVA')) {
                valida_impuesto = true;
              }

              contador++;

            })


            if (valida_impuesto) {

              if (parseFloat(element.porce_iva) > 0) {

                let base = this.detalleImpuesto[contador - 1].base;
                let base_update = parseFloat(base) + parseFloat(element.iva_detalle);

                let retencion = base_update * (parseFloat(element.porce_iva) / 100);

                this.detalleImpuesto[contador - 1].total = parseFloat(retencion.toFixed(2));
                this.detalleImpuesto[contador - 1].base = parseFloat(base_update.toFixed(2));
              }

            } else {

              if (parseFloat(element.porce_iva) > 0) {

                let base = element.iva_detalle;
                let retencion = parseFloat(base) * (parseFloat(element.porce_iva) / 100);

                this.detalleImpuesto.push({
                  base: base, porcentaje: element.porce_iva, total: parseFloat(retencion.toFixed(2)), tipo: 'IVA', rte_fuente: element.rte_iva, codigo: element.cod_iva, codigo_anexo: element.cod_anexo_iva
                });
              }

            }

          }

        }
      });


      console.log(this.detalleImpuesto);

    });

  }


  CofirmarEdicionImpuestos(event){

    /*Validamos si existe modificaciones */

    let validaDetaChange= false;

    this.dataProducto.forEach(element => {
      console.log(element);
      if(element.editado === "S")
        validaDetaChange = true;
    });

    this.dataCuenta.forEach(element => {
      console.log(element);
      if(element.editado === "S")
        validaDetaChange = true;
    });

    if(validaDetaChange){
      this.confirmationService.confirm({
        target: event.target,
        message: "¿Confirmar actualización de impuestos compra?",
        icon: "pi pi-question-circle",
        acceptLabel:"Confirmar",
        rejectLabel:"Cancelar",
        accept: () => {
          //this.setProveedor(this.supplier);
          console.log(this.detalleImpuesto);
        },
        reject: () => {

        }
      });
    }else{
      (this.msgs1 as any) = [
        {severity:'error', detail:'No se a realizado cambio alguno, se debe aplicar algun cambio en los codigos de retención para continuar con la actualización', closable:false}
      ];
    }


  }

  ChangeFuente(event: any, dataelement, index) {

    (this.msgs1 as any) = [
      {severity:'info', detail:'Al seleccionar un nuevo codigo de impuesto se vera afectuado solo cuando se de clic en actualizar.', closable:false}
    ];

    dataelement[index].porce_fte = event.porcentaje_fte;
    dataelement[index].cod_fte = event.codigo_fte_sri;
    dataelement[index].cod_anexo_fte = event.codigo_anexo_sri;
    dataelement[index].editado = "S"
    this.calculaImpuestoIva();

  }

  ChangeImpuestoIva(event: any, dataelement, index) {

    (this.msgs1 as any) = [
      {severity:'info', detail:'Al seleccionar un nuevo codigo de impuesto se vera afectuado solo cuando se de clic en actualizar.', closable:false}
    ];

    dataelement[index].porce_iva = event.porcentaje_rte_iva;
    dataelement[index].cod_iva = event.codigo_sri_iva;
    dataelement[index].cod_anexo_iva = event.codigo_sri_iva;
    dataelement[index].editado = "S"
    this.calculaImpuestoIva();

  }

}
