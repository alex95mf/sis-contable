import { Component, OnInit, EventEmitter, ViewChild, TemplateRef, OnDestroy} from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as myVarGlobals from '../../../global';
import { CommonService } from '../../../../app/services/commonServices';
import { CommonVarService } from '../../../../app/services/common-var.services';
import { contableConfService } from '../../panel-control/parametro/contable/contable.service';
import { DataTableDirective } from 'angular-datatables'; import { Subject } from 'rxjs';
import { CierreMesService } from '../../contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { DiarioService } from '../../contabilidad/comprobantes/diario/diario.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ComprasService } from './compras.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiferedBuyProvComponent } from './difered-buy-prov/difered-buy-prov.component';
 import { CcSpinerProcesarComponent } from '../../../config/custom/cc-spiner-procesar.component';
import { CcModalTablaComprasComponent } from 'src/app/config/custom/cc-modal-tabla-compras/cc-modal-tabla-compras.component';
import { CcModalTablaProveedoresComponent } from 'src/app/config/custom/cc-modal-tabla-proveedores/cc-modal-tabla-proveedores.component';
import { CcModalTablaProductosComponent } from 'src/app/config/custom/cc-modal-tabla-productos/cc-modal-tabla-productos.component';
import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';
import { CcModalCargaxmlComprasComponent } from 'src/app/config/custom/cc-modal-cargaxml-compras/cc-modal-cargaxml-compras.component';
import { ModalComprasComponent } from './modal-compras/modal-compras.component';

import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { MenuItem } from 'primeng/api';

 import { DatePipe } from '@angular/common';
 import { environment } from 'src/environments/environment';

 import * as $ from 'jquery';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ModalCargaxmlComponent } from './modal-cargaxml/modal-cargaxml.component';

import { ExcelService } from 'src/app/services/excel.service';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { ModalCuentasPorPagarComponent } from './modal-cuentas-por-pagar/modal-cuentas-por-pagar.component';
import { ModalCuentaRetFuenteComponent } from './modal-cuenta-ret-fuente/modal-cuenta-ret-fuente.component';
import { ModalCuentaRetIvaComponent } from './modal-cuenta-ret-iva/modal-cuenta-ret-iva.component';
import Botonera from 'src/app/models/IBotonera';
import * as xml2js from 'xml2js';

@Component({
standalone: false,
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class ComprasComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject<void>();

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  anticipoNoValido:boolean = true
  detalleImpuesto: any = [];
  detalleIceSri: any = [];
  detalleImpuestoTemp: any = [];
  files: any[] = [];
  fieldsDaily: Array<any> = [];
  ListaAnticipos: any[] = [];
  ListaMultas: any[] = [];
  ListaCondiciones: any = [];
  ListaCuentasPagarAnticipos: any = [];
  ListaCuentasPagarMultas: any = [];
  total_anticipos:any;
  msgs2: any[];
  isPouchesShared: boolean = false;
  busqueda: boolean = false;
  asientoAnticiposId:any;
  asientoMultasId:any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  fecha: Date = new Date();
  codigos_partidas_idp:any

  asientoAnticiposname: any;
  asientoMultasname: any;
  asientoCabname: any;

  fecha_compra = new Date();
  fecha_limite = new Date();
  viewDate: Date = new Date();

  catalogo_presupuesto: any;

  //fecha_compra: any;
  processing: any;
  numAccountPorPagar: any;
  nameAccountPorPagar: any;
  tip_doc: any;
  dataUser: any;
  permisions: any;
  id_compra: any;
  estados = [
    {value: "1",label: "Activo"},
    {value: "0",label: "Anular"},
  ]//num_aut:'1236547890',num_doc: '001002000000009',
  buyProv: any = { CodacountMulta: '', acountMulta: '', motivo_multa: '', multa: (0.00).toFixed(2), num_contrato: '', tipo_documento: '7', sustento: '01', proveedor_name: '', anio: 2022, mes: 9, identificacion_proveedor: '', tipo_identificacion: '01', fk_id_proveedor: 0, subtotal: (0.00).toFixed(2), subcero: (0.00).toFixed(2), objeto: (0.00).toFixed(2), exento: (0.00).toFixed(2), descuento: (0.00).toFixed(2), propina: (0.00).toFixed(2), otro_impuesto: (0.00).toFixed(2),ice:(0.00).toFixed(2),  servicio: (0.00).toFixed(2), valor_iva: (0.00).toFixed(2), total: (0.00).toFixed(2), tipo_pago: 0, forma_pago: 0, fk_usuario_receive: 0, isActive: this.estados[0],metodo_pago: 0 , saldo: 0.00, condicion: 0, total_retencion: (0.00).toFixed(2),total_anticipo: (0.00).toFixed(2),total_multa: (0.00).toFixed(2),idp:'',egreso_corriente:""};



  dataProducto: any = [{ cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false,LoadOpcionIceSri: false, LoadOpcionCentro: false, subtotal_noobjeto: (0.00).toFixed(2), subtotal_excento: (0.00).toFixed(2), subtotal_cero: (0.00).toFixed(2), subtotal_iva: (0.00).toFixed(2), InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2),ice_detalle: (0.00).toFixed(2), fk_producto: 0, impuesto: 2, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 }];
  dataCuenta: any[] = [{ cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_anexo_fte: "",cod_ice: "", porce_ice: 0, cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false,LoadOpcionIceSri: false, LoadOpcionCentro: false, subtotal_noobjeto: (0.00).toFixed(2), subtotal_excento: (0.00).toFixed(2), subtotal_cero: (0.00).toFixed(2), subtotal_iva: (0.00).toFixed(2), InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2),ice_detalle: (0.00).toFixed(2), cuenta_detalle: 0, impuesto: 2,ice_sri: 0, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1, cod_cuenta_por_pagar: '', cuenta_por_pagar: '', codigo_partida: '', valor_anticipo: 0.00,cod_cuenta_anticipo: '',cuenta_anticipo:'', valor_multa: 0.00, cod_cuenta_multa: '',cuenta_multa:'',proporcional: 0 }];

  actions: any = { btnSave: false, btnmod: false, btnfac: false, btncancel: false };

  dataCargaXML: any = [{ cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false,LoadOpcionIceSri: false, LoadOpcionCentro: false, subtotal_noobjeto: (0.00).toFixed(2), subtotal_excento: (0.00).toFixed(2), subtotal_cero: (0.00).toFixed(2), subtotal_iva: (0.00).toFixed(2), InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2), ice_detalle: (0.00).toFixed(2), fk_producto: 0, impuesto: 2, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 }];


  proveedor: any
  tip_documeto: any;

  arrayProductos: any;
  infoUsers: any;
  infoContrato:any;

  tipo_pago: any;
  forma_pago: any;
  impuestos: any;
  sustento_array: any;
  rete_fuente: any;
  rete_fuente_acount: any;
  rte_iva: any;
  centros: any;
  iceSri: any;
  ice: any;
  egreso_corriente_array: any;

  flagBtnDired: any = false;
  dataDifered: any = null;
  last_doc: any;
  ivaAux: any;
  arrayProveedor: any;
  vmButtons: Botonera[] = [];
  id_solicitud: any;

  peopleTypeahead = new EventEmitter<string>();
  serverSideFilterItems: any;
  selectedPeople;

  LoadOpcion: any = false;
  LoadOpcionTipoPago: any = false;
  LoadOpcionUsuario: any = false;
  LoadOpcionContratos: any = false;
  LoadOpcionTipoDoc: any = false;
  LoadOpcionProductos: any = false;
  LoadOpcionSustento: any = false;
  isAsignaMulta:boolean = false;
  ExistenAnticipos:boolean = true;
  ExistenMultas:boolean = true;
  ExistenItems:boolean = true;
  ExistenCondiciones:boolean = true;
  isAsignaMetodo:boolean = false;
  isAsignaOrden:boolean = false;
  isAsignaFecha:boolean = false;
  LoadOpcionEgreCorriente: any = false;
  LoadOpcionCondiciones: any = false;
  LoadOpcionCuentaPagarAnt: any = false;
  LoadOpcionCuentaPagarMulta: any = false;

  retencionIsActive: any = false;
  id_retencion: any



  file: any;
  permiso_ver: any = "0";

  pipe = new DatePipe('en-US');

  tabmenu: MenuItem[];

  checked = false;
  indeterminate = false;
  orden: any = 'N' ;
  tiene_metodo_pago: any =  'N' ;
  disabled = false;
  metodo_pago: any = [];
  mostrarMetodos: boolean = true;
  mostrarFechaLimite: boolean = true;
  tiene_fecha_limite: any =  'N' ;
  contratos:any = []
  infoContratoCatalogo:any = [];
  arrayAnticipos:any = [];
  arrayMultas:any = [];
  ListaItems:any = [];
  tipEgreCorriente:any = [];

  totalRetencion = 0;
  totalPagar = 0;
  totalAnticipos = 0;
  totalMultas = 0;
  num_retencion: any = undefined
  mostrarCuentas:any;
  validaciones = new ValidacionesFactory();
  cmb_ingreso: any[] = []
  ingresoSelected: number
  asientoCabId: number
  numIngresoSelected: string
  tbl_partidas: any[] = []
  totalPartidas: number = 0
  activeIndex: number = 1
  dataAnticipos: any = []
  dataMultas: any = []

  ExisteHistorial: boolean = false
  dataHistorial: any[] = []
  totalMovimientos: number = 0
  cuentaIdx: number = 0
  lastRecord: number|null = null
  totalRecords: number = 0

  reglasCuentas: any = []

  constructor(
    private diarioSrv: DiarioService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private commonVarSrv: CommonVarService,
    private contableService: contableConfService,
    private comSrv: ComprasService,
    private modalService: NgbModal,
    private cierremesService: CierreMesService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private excelService: ExcelService,
    private xlsService: XlsExportService,
  ) {
    this.comSrv.cxpSelected$.subscribe(
      (res) => {
        console.log(res)
        this.CargarCuentasPorPagar({data: res}, this.cuentaIdx)
      }
    )

    this.comSrv.retfteSelected$.subscribe(
      (res: any) => {
        console.log(res)
        this.dataCuenta[this.cuentaIdx].cod_cuenta_impuesto_rtefte = res.codigo
        this.dataCuenta[this.cuentaIdx].cuenta_impuesto_rtefte = res.nombre
        this.generaPreviewAsientoContable();
      }
    )

    this.comSrv.retivaSelected$.subscribe(
      (res: any) => {
        console.log(res)
        this.dataCuenta[this.cuentaIdx].cod_cuenta_impuesto_iva = res.codigo
        this.dataCuenta[this.cuentaIdx].nombre_cuenta_impuesto_iva = res.nombre
        this.generaPreviewAsientoContable();
      }
    )

    this.comSrv.facturaXml$.subscribe(
      async (res: any) => {
        console.log(res)

        this.proveedor = res.proveedor

        this.buyProv.proveedor_name = res.proveedor.razon_social
        this.buyProv.identificacion_proveedor = res.proveedor.num_documento
        this.fecha_compra = new Date(res.factura.fecha_emision)
        // this.buyProv.forma_pago = res.factura.forma_pago
        this.buyProv.num_doc = res.factura.num_factura
        this.buyProv.num_aut = res.factura.autorizacion
        this.buyProv.total = res.factura.total
      }
    )

    this.comSrv.listaCompras$.subscribe(
      async (res: any) => {
        this.lcargando.ctlSpinner(true);
        (this as any).mensajeSpinner = 'Cargando Datos'
         console.log(res)

        // let retFuente = res.ret_fuente;
        // let sigList = await this.contableService.getRetencionIvaComprasAsync()
        // let retIva = res.ret_iva;
        // let otraLista = await this.contableService.getRetencionIvaComprasAsync()

        this.busqueda= true

        this.isAsignaOrden=false
        this.buyProv = res;
        this.lastRecord = res.id
        this.id_compra= res.id;
        this.vmButtons[6].habilitar = false;
        this.vmButtons[8].habilitar = res.estado == 'X';

        this.buyProv.proveedor_name = res.proveedor?.razon_social
        this.buyProv.identificacion_proveedor = res.ruc

        let fecha_compra =  new Date(res.fecha_compra)
        this.fecha_compra=  new Date(fecha_compra.getFullYear(),fecha_compra.getMonth(),fecha_compra.getDate() + 1);

        // console.log(this.fecha_compra)
        let tipo_proceso
        if(res.contratacion?.tipo_proceso=='Infimas'){
          tipo_proceso= 'INF';
        }else if(res.contratacion?.tipo_proceso=='Contratacion'){
          tipo_proceso= 'CON';
        }else if(res.contratacion?.tipo_proceso=='Catalogo Electronico'){
          tipo_proceso= 'CAT';
        }else{
          tipo_proceso= res.contratacion?.tipo_proceso;
        }
        if(tipo_proceso!=undefined){
          this.buyProv.num_contrato = tipo_proceso +'-'+res.contratacion?.num_solicitud
        }else {
         this.buyProv.num_contrato = ''
        }

        this.buyProv.idp = res.contratacion?.idp
        this.buyProv.tipo_documento = res.tipo_documento_sustento

        // Carga de Listas de Cabecera
        this.buyProv.condicion = res.fk_condicion_contrato
        this.CargarTipoDocumento();
        this.cargaInfoSustento();
        this.buyProv.sustento = res.sustento_tirbutario
        this.getEgreCorrientes();
        this.buyProv.egreso_corriente = res.egreso_corriente
        this.CargarComboUsuario()
        this.CargarCondicionesProveedor(res.fk_solicitud_contrato)
        //this.fecha_compra= res.fecha_compra
       // this.BuscarRetencionCompra(res.id)

       if(res.retencion?.isactive == 1){
          this.retencionIsActive = true
          this.num_retencion = res.retencion?.num_retencion
          this.id_retencion = res.retencion?.id_retencion
          this.vmButtons[7].habilitar=true
       }else{
          this.vmButtons[7].habilitar=false
          this.num_retencion = undefined
          this.id_retencion = undefined
          this.retencionIsActive = false
       }

        this.buyProv.isActive = res.isactive
        this.buyProv.fk_usuario_receive = res.usuario?.id_usuario
        this.orden = res.tiene_orden_pago
        if(res.tiene_orden_pago === "S"){
          this.isAsignaOrden=true
        }else{
          this.isAsignaOrden=false
        }
        if(res.tiene_fecha_limite === "S"){
          this.isAsignaFecha=true
          this.mostrarFechaLimite = false;
          this.tiene_fecha_limite= 'S';
        }else{
          this.isAsignaFecha=false
          this.mostrarFechaLimite = true;
          this.tiene_fecha_limite= 'N';
        }

        if(res.tiene_metodo_pago === "S"){
          this.isAsignaMetodo=true
          this.mostrarMetodos = false;
          this.tiene_metodo_pago= 'S';
        }else{
          this.isAsignaMetodo=false
          this.mostrarMetodos = true;
          this.tiene_metodo_pago= 'N';
        }

        if (res.dec_valor_multa > 0 ){
          this.isAsignaMulta = true
          this.isPouchesShared = true
          this.buyProv.multa = res.dec_valor_multa
          this.buyProv.CodacountMulta= res.var_cod_cuenta_multa
        }else {
          this.isAsignaMulta = false
          this.isPouchesShared = false
        }

        if (res.fk_ingreso_bodega) {
          // this.ingresoSelected = res.fk_ingreso_bodega

          const ingresoCab = await this.comSrv.getIngreso({ingreso: {id: res.fk_ingreso_bodega}})
          console.log(ingresoCab)
          this.numIngresoSelected = ingresoCab.data.numero_ingreso_bodega

          const detalles = await this.comSrv.getIngresoDetalles({ingreso: {id: res.fk_ingreso_bodega}})
          console.log(detalles)
          if (detalles.data.length > 0) {
            detalles.data.forEach((element: any) => {
              this.ListaItems.push({
                numero_ingreso_bodega:element.ingreso_bodega.numero_ingreso_bodega,
                description: element.description,
                cantidad:  element.cantidad,
                precio_unitario:  element.precio_unitario,
                total:  element.total,
                codigo_bienes:  element.codigo_bienes,
                codigo_grupo_producto: element.codigo_grupo_producto,
                codigo_cuenta_contable:  element.codigo_cuenta_contable,
                codigo_presupuesto:  element.codigo_presupuesto,
              })
            })
            console.log("this.ListaItems",this.ListaItems);
          }
        }

        if (res.detalle_cuentas.length > 0) {

          this.dataCuenta = [];
          this.tbl_partidas = [];

          // this.contableService.getRetencionFuenteCompras().subscribe(res => {
          //   this.rete_fuente = res['data'];
          // })

          //this.ChangeFuente(this.rete_fuente,this.dataCuenta,index)
          // this.contableService.getRetencionFuenteCompras().subscribe(res => {
          //   this.lcargando.ctlSpinner(false);
          //   console.log(res)
          //   this.rete_fuente = res['data'];
          // })



          // Listas de las lineas
          this.rete_fuente = await this.contableService.getRetencionFuenteComprasAsync();
          console.log(this.rete_fuente)
          this.rte_iva = await this.contableService.getRetencionIvaComprasAsync();
          console.log(this.rte_iva)
          this.centros = await this.contableService.getListaCentroCostosAsync();
          this.iceSri = await this.contableService.getIceSriAsync();

          // Carga tabla Cuentas
          res.detalle_cuentas.forEach((element,index) => {

            // let tipo=''
            let obj = {
              cuenta_detalle: '(' + element.codigo_cuenta + ') ' + element.nombre_cuenta,
              cod_anexo_iva: element.cod_riva_anexo,
              cod_iva: element.cod_riva,
              porce_iva: element.porcentaje_riva,
              cod_anexo_fte: element.cod_rft_anexo,
              codigo_partida_icp: element.codigopartida,
              cod_fte: element.cod_rft_anexo,
              porce_fte: element.porcentaje_rft,
              porce_ice: element.porcentaje_ice,
              subtotal_noobjeto: element.subtotal_noobjeto,
              subtotal_excento: element.subtotal_excento,
              subtotal_cero: element.subtotal_cero,
              subtotal_iva: element.subtotal_iva,
              iva_detalle: element.iva_detalle_item,
              // ice_detalle: element.ice_detalle_item,
              ice_sri:  this.iceSri.find((c)=> c.id ==element.fk_ice)?.id,
              fk_producto: element.fk_producto,
              impuesto: element.codigo_impuesto_iva.toString(),
              rte_fuente: element.codigo_retencion_fuente,
              rte_iva: element.codigo_retencion_iva,
              centro:element.centro_costo,
              centro_nombre: this.centros.find((c)=> c.id ==element.centro_costo)?.nombre,
              nombre: element.nombre_cuenta,
              codigo: element.codigo_cuenta,
              observacion: element.observacion,
              cantidad: element.cantidad,
              precio: element.precio,
              desc: element.descuento,
              subtotalItems: parseFloat(element.subtotalitems),
              totalItems: parseFloat(element.totalitems),
              paga_iva: element.paga_iva,
              cuenta_por_pagar:element.var_nombre_cxp,
              cod_cuenta_por_pagar: element.var_cod_codigo_cxp,
              cuenta_anticipo:element.nom_cuenta_anticipo,
              cod_cuenta_anticipo: element.cod_cuenta_anticipo,
              valor_anticipo: parseFloat(element.valor_anticipo),
              cuenta_multa:element.nom_cuenta_multa,
              cod_cuenta_multa: element.cod_cuenta_multa,
              valor_multa: parseFloat(element.valor_multa),
              codigo_presupuesto:  element.codigo_partida,
              retencion: element.total_rft,
              retencion_iva: element.total_riva,
              ice_detalle: element.total_ice

            }

            const item = this.tbl_partidas.find((p: any) => p.codigo == element.codigo_partida)
            if (!item) {
              this.tbl_partidas.push({
                codigo: element.codigo_partida,
                descripcion: element.catalogo_presupuesto?.descripcion_general ?? "",
                valor: 0
              })
            }
            this.tbl_partidas.find((p: any) => p.codigo == element.codigo_partida).valor += parseFloat(element.subtotalitems)

            /// Buscas en otro array
            this.rete_fuente.forEach(f => {
              // console.log(element.codigo_retencion_fuente , f.id_reten_fuente)
              if(f.cuenta != "" && element.codigo_retencion_fuente == f.id_reten_fuente){
                const cuenta_rte_fuente='INVERSIÓN'
                Object.assign(obj, {cuenta_rte_fuente ,cod_cuenta_impuesto_rtefte:f.cuenta,cuenta_impuesto_rtefte:f.descripcion })
              }else if(f.cuenta_contable_corriente != "" && element.codigo_retencion_fuente == f.id_reten_fuente){
                const cuenta_rte_fuente='CORRIENTE'
                Object.assign(obj, {cuenta_rte_fuente ,cod_cuenta_impuesto_rtefte:f.cuenta_contable_corriente,cuenta_impuesto_rtefte:f.descripcion})
              }else if(f.cuenta_contable_produccion != "" && element.codigo_retencion_fuente == f.id_reten_fuente){
                const cuenta_rte_fuente='PRODUCCIÓN'
                Object.assign(obj, {cuenta_rte_fuente ,cod_cuenta_impuesto_rtefte:f.cuenta_contable_produccion, cuenta_impuesto_rtefte:f.descripcion})
              }
              //this.ChangeFuenteCuenta($event,dataCuenta,i)
             })

            this.rte_iva.forEach(f => {
              console.log(element.codigo_retencion_iva , f.id)
              if(f.cuenta != "" && element.codigo_retencion_iva == f.id){
                Object.assign(obj, {cod_cuenta_impuesto_iva:f.codigo,nombre_cuenta_impuesto_iva:f.cuenta_nombre })
              }
              //this.ChangeFuenteCuenta($event,dataCuenta,i)
            })



            //  console.log(elem)

            // Object.assign(obj, {})
              //this.getCentroDetalle(index);  // Lista ya esta cargada
              this.dataCuenta.push(obj)
            //  this.getRetencionIva(index,this.dataCuenta); // TODO: Llama a sumaTotales que limpia Anticipos y Multas
              // this.ChangeImpuestoIva(this.rte_iva,this.dataCuenta,index)  // Llena los valores de Retencion IVA
            });

            // this.calculaIceSri();  // TODO: Llama a sumaTotales que limpia Anticipos y Multas
          //this.calculaImpuestoIva(); //04-10-2023

          // Caraga tabla resumen de impuestos
          this.detalleImpuesto=[];
          res.detalle_impuestos.forEach((element,index) => {

            let obj = {
              base: element.base,
              porcentaje: element.porcentaje_retencion,
              total: element.valor_retencion,
              tipo: element.codigo_impuesto,
              rte_fuente: element.valor_retencion,
              codigo: element.codigo_sri,
              codigo_anexo: element.cod_anexo_sri
            }
            this.detalleImpuesto.push(obj)
          }
          );

          // this.generaPreviewAsientoContable();


          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", res);/*
this.asientoAnticiposId = res.asiento_cabrelacionados?.id type Factura Proveedor - cruce de asiento */
          const asientoAnticipo = res.asiento_cabrelacionados?.find((asiento: any) => asiento.type === "Factura Proveedor - cruce de asiento");

          if (asientoAnticipo) {
            this.asientoAnticiposId = asientoAnticipo.id;
            this.asientoAnticiposname = asientoAnticipo.asiento;
          } else {
            this.asientoAnticiposId = null;
            this.asientoAnticiposname =null;
          }


          const asientoMultas = res.asiento_cabrelacionados?.find((asiento: any) => asiento.type === "Factura Proveedor - cruce de multa");
          if (asientoMultas) {
            this.asientoMultasId = asientoMultas.id;//asientoMultasId
            this.asientoMultasname = asientoMultas.asiento;
          } else {
            this.asientoMultasId = null;
            this.asientoMultasname =null;
          }



          this.asientoCabId = res.asiento_cab?.id
          console.log("res.asiento_cab?.asiento",res.asiento_cab?.asiento)
          this.asientoCabname = res.asiento_cab?.asiento
        }





        // Llena Asientos /
        this.fieldsDaily=[];
         // antiormente jalaba del campo detalles en lugar del campo detallestot
        res.asiento_cab?.detallestot.forEach((element: any) => {
          // let tipo=''
          let obj = {
          LoadOpcionCatalogoPresupuesto: false,
          nombrepresupuesto: element?.presupuesto?.nombre,
          presupuesto: element?.partida_presupuestaria,
          codpresupuesto: element?.codigo_partida,
          valor_presupuesto: element?.valor_partida ? element?.valor_partida : 0.00,
          account: element?.cuenta,
          name: element?.cuentas?.nombre,
          detail:element.detalle,
          credit: parseFloat(element.valor_cre).toFixed(2), //parseFloat(element.valor_cre).toFixed(2)
          debit:parseFloat(element.valor_deb).toFixed(2) ,//parseFloat(element.valor_deb).toFixed(2)
          centro: element?.centro_costo?.id, //this.centros.find((c)=> c.id ==element?.centro_costo?.id)?.nombre
          tipo: 'A',
          tipo_detalle: element.tipo_detalle,
          codpartidaidp: element.codigopartida,
          tipo_presupuesto: "GASTOS",
          tipo_afectacion: "DEVENGADO",
          devengado: parseFloat(element.valor_deb).toFixed(2) ,
          cobrado_pagado: 0,
          fk_linea: element?.fk_linea
          }
          this.fieldsDaily.push(obj)
        })
        this.TotalizarAsientoCompra()

        // Muestra valores totales
        this.buyProv.subtotal = res.subtotal;
        this.buyProv.total_impuesto = res.subtotal;
        this.buyProv.valor_iva = res.valor_iva
        this.buyProv.subcero = res.total_cero;
        this.buyProv.objeto = res.total_noobjeto;
        this.buyProv.exento = res.total_exento;
        this.buyProv.descuento = res.total_descuento;
        this.buyProv.propina = res.propina;
        this.buyProv.otro_impuesto = res.otro_impuesto;
        this.buyProv.servicio = res.servicios;
        this.buyProv.total = res.total;
        this.totalPagar = res.total_pagar

        // Carga Anticipos y Multas
        this.ListaAnticipos=[];
        this.ListaMultas=[];
        if(res.anticipos.length > 0){

          this.ExistenAnticipos = false;
          res.anticipos.forEach(e => {
            if(e.tipo_cruce=='MU'){
              this.ExistenMultas = false;
              let data = {
                disabled: true,
                id_documento: e.id_compra_anticipo,
                documento: e.documento[0].documento,
                tipo_documento:e.tipo_cruce,
                fecha:e.documento.fecha,
                total:e.total,
                saldo:e.disponible,
                valor_aplicado:e.valor_aplicado,
                cod_cuenta_multa:e.cod_cuenta_multa,
                nom_cuenta_multa:e.nom_cuenta_multa,
                cod_cuenta_por_pagar_multa:e.cod_cuenta_por_pagar_multa,
                nom_cuenta_por_pagar_multa:e.nom_cuenta_por_pagar_multa,

              }
              this.ListaMultas.push(data);
            }else{
              let data = {
                disabled: true,
                id_documento: e.id_compra_anticipo,
                documento: e.documento[0].documento,
                tipo_documento:e.tipo_cruce,
                fecha:e.documento.fecha,
                total:e.total,
                saldo:e.disponible,
                valor_aplicado:e.valor_aplicado,
                cod_cuenta_anticipo:e.cod_cuenta_anticipo,
                nom_cuenta_anticipo:e.nom_cuenta_anticipo,
                cod_cuenta_por_pagar_anticipo:e.cod_cuenta_por_pagar_anticipo,
                nom_cuenta_por_pagar_anticipo:e.nom_cuenta_por_pagar_anticipo,

              }
              this.ListaAnticipos.push(data);
            }

          })
        }

        this.totalMovimientos = 0
        if (res.movimientos.length > 0) {
          this.ExisteHistorial = true
          this.dataHistorial = res.movimientos
          this.dataHistorial.forEach((element: any) => {
            if (element.tipo == 'Compras') {
              this.totalMovimientos += +(element.valor ?? 0)
            } else {
              this.totalMovimientos -= +(element.valor ?? 0)
            }
          })
        }

        //this.CargarComprasRegistradas(res)
        this.totalPartidas = this.tbl_partidas.reduce((acc: number, curr: any) => acc + curr.valor, 0)
        this.lcargando.ctlSpinner(false)
        this.vmButtons[0].habilitar = true;
        //this.vmButtons[7].habilitar = false;

      }
    )

    this.vmButtons = [
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "ORDENES" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "FACTURAS" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-file-pdf-0", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GENERAR RETENCION" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-times", texto: "ANULAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true },

    ];
  }

  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.mostrarCuentas = true;
    new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })

    this.msgs2 = [
      { severity: 'info', summary: '', detail: 'Para realizar el registro de compra se requiere asignar la codigo contable de la cuenta por pagar.' }
    ];

    this.serverSideSearch();

    this.tabmenu = [
      { label: 'ITEMS', icon: 'pi pi-fw pi-home' },
      { label: 'CUENTAS', icon: 'pi pi-fw pi-calendar' }
    ];

    //this.fecha_compra = moment(this.fecha).format('YYYY-MM-DD');

    //this.fecha_compra =  new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);

    setTimeout(() => {
      this.cargaInfoFormaPago();
      this.cargaInfoSustento();
      this.getPermisions();
    }, 10);


    /*incializamos los combos con select default */
    this.tip_doc =
      [
        {
          nombre: 'Factura',
          id: '7'
        }
      ]

    this.forma_pago =
      [
        {
          valor: '01-EFECTIVO'
        }
      ]

    this.tipo_pago =
      [
        {
          valor: 'Contado'
        }
      ]

    this.sustento_array =
      [
        {
          id_sustento_tributario: '01',
          descripcion: 'CREDITO TRIBUTARIO PARA DECLARACION DE IVA'
        }
      ]

    this.impuestos =
      [
        {
          valor: '2',
          descripcion: 'IVA 15%'
        }
      ]

    this.tip_documeto =
    [
      {
        nombre: 'Físico',
        id: 3
      },
      {
        nombre: 'Electrónico',
        id: 21
      }
    ]
      // [
      //   {
      //     nombre: 'Factura de compra',
      //     id: 3
      //   },
      //   {
      //     nombre: 'Liquidación',
      //     id: 20
      //   }
      // ]

    //this.buyProv.fk_doc = '3'
    this.buyProv.tipo_documento = '7'
    this.buyProv.forma_pago = '01-EFECTIVO'
    this.buyProv.tipo_pago = 'Contado'
    this.buyProv.sustento = '01'
    this.dataProducto[0].impuesto = '2'
    this.dataCuenta[0].impuesto = '2'
    this.buyProv.fk_doc = 3

    this.buyProv.anio = moment(this.fecha_compra).format('YYYY');
    this.buyProv.mes = Number(moment(this.fecha_compra).format('MM'));
    /*fin */


  }
  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }

    this.onDestroy$.next(null)
    this.onDestroy$.complete();
  }
   convertirNumeroALetras(numero) {
    var unidades = ['', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'];
    var especiales = ['Diez', 'Once', 'Doce', 'Trece', 'Catorce', 'Quince', 'Dieciséis', 'Diecisiete', 'Dieciocho', 'Diecinueve'];
    var decenas = ['Veinte', 'Treinta', 'Cuarenta', 'Cincuenta', 'Sesenta', 'Setenta', 'Ochenta', 'Noventa'];
    var centenas = ['Cien', 'Doscientos', 'Trescientos', 'Cuatrocientos', 'Quinientos', 'Seiscientos', 'Setecientos', 'Ochocientos', 'Novecientos'];
    var miles = ['', 'Mil', 'Millón', 'Mil Millones', 'Billón', 'Mil Billones', 'Trillón', 'Mil Trillones', 'Cuatrillón', 'Mil Cuatrillones'];

    if (numero === 0) {
        return 'Cero';
    }

    var enteroParte = Math.floor(numero);
    var decimalParte = Math.round((numero - enteroParte) * 100);

    var enteroEnLetras = '';
    var decimalEnLetras = '';

    // Convertir la parte entera
    if (enteroParte > 0) {
        var millar = 0;
        while (enteroParte > 0) {
            var grupo = enteroParte % 1000;
            if (grupo > 0) {
                var grupoEnLetras = this.convertirGrupoALetras(grupo);
                if (millar > 0) {
                    grupoEnLetras += ' ' + miles[millar];
                }
                enteroEnLetras = grupoEnLetras + ' ' + enteroEnLetras;
            }
            enteroParte = Math.floor(enteroParte / 1000);
            millar++;
        }
    }

    // Convertir la parte decimal
    if (decimalParte > 0) {
        decimalEnLetras = this.convertirGrupoALetras(decimalParte) + ' centavos';
    }

    return enteroEnLetras.trim() + (decimalEnLetras !== '' ? ' con ' + decimalEnLetras : '');
}

 convertirGrupoALetras(numero) {
    var unidades = ['', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'];
    var especiales = ['Diez', 'Once', 'Doce', 'Trece', 'Catorce', 'Quince', 'Dieciséis', 'Diecisiete', 'Dieciocho', 'Diecinueve'];
    var decenas = ['Veinte', 'Treinta', 'Cuarenta', 'Cincuenta', 'Sesenta', 'Setenta', 'Ochenta', 'Noventa'];
    var centenas = ['Cien', 'Doscientos', 'Trescientos', 'Cuatrocientos', 'Quinientos', 'Seiscientos', 'Setecientos', 'Ochocientos', 'Novecientos'];

    var resultado = '';

    if (numero >= 100) {
        var centena = Math.floor(numero / 100);
        resultado += centenas[centena - 1] + ' ';
        numero %= 100;
    }

    if (numero >= 20) {
        var decena = Math.floor(numero / 10);
        resultado += decenas[decena - 2] + ' ';
        numero %= 10;
    }

    if (numero > 0) {
        if (numero < 10) {
            resultado += unidades[numero] + ' ';
        } else {
            resultado += especiales[numero - 10] + ' ';
        }
    }

    return resultado.trim();
}


  imprimirAsiento() {
    window.open(environment.ReportingUrl + "rpt_asiento_contable.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.asientoCabId, '_blank')
  }
  imprimirAsientoCUR() {
    var numero = parseFloat(this.buyProv.total); // Convertir la cadena a número
    var numeroRedondeado = Math.round(numero * 100) / 100; // Redondear a dos decimales
    var numeroComoTexto = numeroRedondeado.toString(); // Convertir el número a cadena nuevamente
    var partes = numeroComoTexto.split('.');
    var parteEntera = parseInt(partes[0]);
    var parteDecimal = parseInt(partes[1]);
    var textoParteEntera = this.convertirNumeroALetras(parteEntera);
    var textoParteDecimal = this.convertirNumeroALetras(parteDecimal);

    var textoTotal = textoParteEntera;
    if (parteDecimal !== 0) {
        textoTotal += ' dólares con ' + textoParteDecimal + ' centavos';
    } else {
        textoTotal += ' dólares';
    }
    /* var texto =this.convertirNumeroALetras(this.buyProv.total); */
    window.open(environment.ReportingUrl + "rpt_asiento_contable_cur.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_compra=" + this.id_compra + "&id_documento=" + this.asientoCabId + "&letras=" + textoTotal, '_blank')
  }
  imprimirAsientoAnticipos() {
    window.open(environment.ReportingUrl + "rpt_asiento_contable.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.asientoAnticiposId, '_blank')
  }

  imprimirAsientoMultas() {
    window.open(environment.ReportingUrl + "rpt_asiento_contable.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.asientoMultasId, '_blank')
  }

  async cargarListas() {
    // this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Cargando Listas'
    await this.getImpuestosDetalle()
    await this.getIceSri()
    await this.getRetencionFuente()
    await this.getRetencionIva()
    await this.getCentroDetalle()
    this.lcargando.ctlSpinner(false)
  }

  getPermisions() {

    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Cargando Permisos'

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    let id_rol = this.dataUser.id_rol;

    let data = {
      codigo: myVarGlobals.fProveeduriaCompras,
      id_rol: id_rol
    }

    this.commonServices.getPermisionsGlobas(data).subscribe(res => {

      this.permisions = res['data'][0];
      this.permiso_ver = this.permisions.ver;


      if (this.permisions.ver == "0") {

        this.toastr.info("Usuario no tiene Permiso para ver el formulario de compras de proveeduria");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);

      } else {

        // this.getimpuestos();
        this.getCatalogos();
        // this.lcargando.ctlSpinner(false);

      }

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  seleccionado(event){
    console.log(event);

    //if (event.checked.length > 0) {
    if (event) {

      this.orden= 'S';
    } else {

      this.orden= 'N';
    }
    console.log(this.orden)
  }

  selectedMetodoPago(event){
    console.log()
    //if (event.checked.length > 0) {
    if (event) {
      this.mostrarMetodos = false;
      this.tiene_metodo_pago= 'S';
    } else {
      this.mostrarMetodos = true;
      this.tiene_metodo_pago= 'N';
    }
    console.log(this.tiene_metodo_pago)
  }

  selectedFechaLimite(event){
    //if (event.checked.length > 0) {
      if (event) {
      this.mostrarFechaLimite = false;
      this.tiene_fecha_limite= 'S';
    } else {
      this.mostrarFechaLimite = true;
      this.tiene_fecha_limite= 'N';
    }
    console.log(this.tiene_fecha_limite)
  }




  onClickConsultaCuentas(i) {


      if (this.buyProv.fk_id_proveedor > 0) {

        if ((this.buyProv.num_doc !== "") && (typeof (this.buyProv.num_doc) !== 'undefined')) {

          if ((this.buyProv.num_aut !== "") && (typeof (this.buyProv.num_aut) !== 'undefined')) {

            let busqueda = '';

            localStorage.setItem("busqueda_cuetas", busqueda)
            localStorage.setItem("detalle_consulta", "true");

            this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
              header: 'Cuentas',
              width: '70%',
              contentStyle: { "max-height": "500px", "overflow": "auto" },
              baseZIndex: 10000
            });

            this.ref.onClose.subscribe((cuentas: any) => {
              console.log("aqui esta tayerndo la cuenta", cuentas);
              if (cuentas) {
                this.CargarCuentas(cuentas, i);
                this.CuentasReglas(cuentas, i)

                this.recalculateAfectacion();
              }

            });

          } else {
            this.toastr.info("Debe agregar un numero de autorizacion comprobante valido.");
          }
        } else {
          this.toastr.info("Debe agregar el numero de comprobante de proveedor a registrar, por favor verificar.");
        }

      } else {
        this.toastr.info("No ha ingresado la información del proveedor, por favor verificar");
      }

  }



  onClickConsultaCuentasPorPagar(i) {

      if (this.buyProv.fk_id_proveedor > 0) {

        if ((this.buyProv.num_doc !== "") && (typeof (this.buyProv.num_doc) !== 'undefined')) {

          if ((this.buyProv.num_aut !== "") && (typeof (this.buyProv.num_aut) !== 'undefined')) {

            let busqueda = '';

            localStorage.setItem("busqueda_cuetas", busqueda)
            localStorage.setItem("detalle_consulta", "true");

            this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
              header: 'Cuentas',
              width: '70%',
              contentStyle: { "max-height": "500px", "overflow": "auto" },
              baseZIndex: 10000
            });

            this.ref.onClose.subscribe((cuentas: any) => {

              console.log(cuentas)
              if (cuentas) {
                this.CargarCuentasPorPagar(cuentas, i);
              }

            });

          } else {
            this.toastr.info("Debe agregar un numero de autorizacion comprobante valido.");
          }
        } else {
          this.toastr.info("Debe agregar el numero de comprobante de proveedor a registrar, por favor verificar.");
        }

      } else {
        this.toastr.info("No ha ingresado la información del proveedor, por favor verificar");
      }



  }

  async aplicarCxpDesde(idx: number) {
    const { cod_cuenta_por_pagar, cuenta_por_pagar } = this.dataCuenta[idx]

    // Validar que se haya escogido una CxP
    if (cod_cuenta_por_pagar == undefined || cod_cuenta_por_pagar == "" ||
    cuenta_por_pagar == undefined || cuenta_por_pagar == "") {
      this.toastr.warning('No ha seleccionado una CxP para aplicar')
      return
    }

    // Validar que no es la ultima Cuenta
    if (idx == this.dataCuenta.length - 1) {
      this.toastr.warning('No hay mas cuentas para aplicar')
      return
    }

    const result = await Swal.fire({
      titleText: 'Aplicar CxP',
      text: 'Esta seguro/a de aplicar la Cuenta por Pagar seleccionada a las Cuentas a continuacion?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aplicar'
    })

    if (result.isConfirmed) {
      for (let i = idx + 1; i < this.dataCuenta.length; i++) {
        Object.assign(this.dataCuenta[i], { cod_cuenta_por_pagar, cuenta_por_pagar })
      }
      this.generaPreviewAsientoContable()
    }


  }


  onClicConsultaPlanCuentas(content) {

    let busqueda = (typeof this.numAccountPorPagar === 'undefined') ? "" : this.numAccountPorPagar;

    let consulta = {
      busqueda: this.numAccountPorPagar
    }

    localStorage.setItem("busqueda_cuetas", busqueda)
    localStorage.setItem("detalle_consulta", "false");

    this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
      header: 'Cuentas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((cuentas: any) => {

      if (cuentas) {
        this.AgregarDetalleAsientoCxP(cuentas["data"]);
      }

    });
  }


  onClicConsultaPlanCuentasContraPartida(content) {

    let busqueda = (typeof this.numAccountPorPagar === 'undefined') ? "" : this.numAccountPorPagar;

    let consulta = {
      busqueda: this.numAccountPorPagar
    }

    localStorage.setItem("busqueda_cuetas", busqueda)
    localStorage.setItem("detalle_consulta", "false");

    this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
      header: 'Cuentas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((cuentas: any) => {

      if (cuentas) {
        this.AgregarDetalleAsientoMultContra(cuentas["data"]);
      }

    });
  }

  // BuscarRetencionCompra(fk_compra_cab){

  //   let data={
  //     fk_compra_cab: fk_compra_cab
  //   }
  //   this.comSrv.BuscarRetencionesCompraProv(data).subscribe(res => {
  // console.log(res)
  //     if(res['data'].length == 0){
  //       this.vmButtons[7].habilitar = false
  //     }
  //   })
  // }
  AsignarMulta(event) {

    //if (event.checked.length > 0) {
    if (event) {
      this.isPouchesShared = true;
    } else {
      this.isPouchesShared = false;
    }

    /// isPouchesShared

  }
  CambioMetodoPago() {
    console.log(this.buyProv.metodo_pago)
  }

  AgregarDetalleAsientoCxP(cuenta: any) {

    this.buyProv.CodacountMulta = cuenta.codigo;
    this.buyProv.acountMulta = cuenta.nombre;
    this.generaPreviewAsientoContable();

  }


  AgregarDetalleAsientoMultContra(cuenta: any) {

    this.buyProv.CodacountMultaContrapartida = cuenta.codigo;
    this.buyProv.acountMultaContrapartida = cuenta.nombre;
    this.generaPreviewAsientoContable();

  }


  ChangeCodigoPresupuesto(event: any, dataelement, index) {

    dataelement[index].presupuesto = event.nombre;

  }

  onClickConsultaProveedores() {

    // let busqueda = (typeof this.buyProv.proveedor_name === 'undefined') ? "" : this.buyProv.proveedor_name;

    // localStorage.setItem("busqueda_proveedores", busqueda)

    this.ref = this.dialogService.open(CcModalTablaProveedoresComponent, {
      header: 'Proveedores',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((product: any) => {
      console.log(product);

      if (product) {
        this.CargarProveedor(product['data']);
      }

    });

  }

  onClickConsultaComprasRegistradas() {

    this.ref = this.dialogService.open(CcModalTablaComprasComponent, {
      header: 'Lista de Compras',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((compras: any) => {

      if (compras) {
        this.CargarComprasRegistradas(compras['data']);
      }

    });
  }

  onClickConsultaOrdenesRegistradas() {


    this.ref = this.dialogService.open(CcModalTablaComprasComponent, {
      header: 'Lista Ordenes Compra',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((compras: any) => {

      if (compras) {
        this.CargarComprasRegistradas(compras['data']);
      }

    });
  }

  onClickConsultaProductos(i) {

    if (this.buyProv.fk_id_proveedor > 0) {

      if (this.buyProv.fk_doc === 3) {

        if ((this.buyProv.num_doc !== "") && (typeof (this.buyProv.num_doc) !== 'undefined')) {

          if ((this.buyProv.num_aut !== "") && (typeof (this.buyProv.num_aut) !== 'undefined')) {

            this.ref = this.dialogService.open(CcModalTablaProductosComponent, {
              header: 'Lista Productos',
              width: '70%',
              contentStyle: { "max-height": "500px", "overflow": "auto" },
              baseZIndex: 10000
            });

            this.ref.onClose.subscribe((productos: any) => {

              if (productos) {
                this.getDataProduct(productos, i);
              }

            });

          } else {
            this.toastr.info("Debe agregar un numero de autorizacion comprobante valido.");
          }

        } else {
          this.toastr.info("Debe agregar el numero de comprobante de proveedor a registrar, por favor verificar.");
        }

      } else {


        this.ref = this.dialogService.open(CcModalTablaProductosComponent, {
          header: 'Lista Productos',
          width: '70%',
          contentStyle: { "max-height": "500px", "overflow": "auto" },
          baseZIndex: 10000
        });

        this.ref.onClose.subscribe((productos: any) => {

          if (productos) {
            this.getDataProduct(productos, i);
          }

        });


      }


    } else {
      this.toastr.info("No ha ingresado la información del proveedor, por favor verificar");
    }

  }


  generaPreviewAsientoContablehhhh() {

    //console.log(this.dataCuenta);


    this.fieldsDaily = [];
    let DetailCount = 0;
    let TamñoRecorrido = this.dataCuenta.length;

    this.dataCuenta.forEach(element => {

      this.comSrv.ListaCentroCostos().subscribe(
        (resCentro) => {

          this.centros = resCentro["data"];
          this.dataCuenta[DetailCount - 1].LoadOpcionCentro = false;

          this.comSrv.ListaCatalogoPresupuesto().subscribe(res => {
            this.catalogo_presupuesto = res['data'];

            if (this.fieldsDaily.length > 0) {

              let valRegister = false;
              let valRegisterPorPagar = false;
              let coddetail = 0;
              let coddetailPorPagar = 0;

              this.dataCuenta.forEach(elementDetail => {
                if (elementDetail.account === element.codigo) {
                  valRegister = true;
                  coddetail++;
                }
              });



              if (valRegister) {

                let totalDetail = 0.00;
                totalDetail = parseFloat(this.dataCuenta[coddetail - 1]) + parseFloat(element.totalItems);
                this.fieldsDaily[coddetail - 1].debit = totalDetail.toFixed(2);
                this.fieldsDaily[coddetail - 1] = element.centro;
                this.fieldsDaily[coddetail - 1] = parseFloat(element.totalItems).toFixed(2);

              } else {


                if (element.cuenta_por_pagar != '') {

                  /* verificamos si algun detalle tiene la misma cuenta por pagar y se agrupa */

                  let TotalPorPagar = 0;

                  this.fieldsDaily.forEach(elementDetailDos => {
                    if (elementDetailDos.account === element.cod_cuenta_por_pagar) {
                      valRegisterPorPagar = true;
                      TotalPorPagar = TotalPorPagar + parseFloat(elementDetailDos.credit);
                      coddetailPorPagar++;
                    }
                  });

                  if (valRegisterPorPagar) {

                    let totalDetailPorPagar = 0.00;
                    totalDetailPorPagar = TotalPorPagar + ((parseFloat(element.totalItems) + parseFloat(element.iva_detalle)) - parseFloat(this.buyProv.multa));
                    this.fieldsDaily[coddetailPorPagar].credit = totalDetailPorPagar.toFixed(2);


                  } else {

                    this.fieldsDaily.push({
                      LoadOpcionCatalogoPresupuesto: false,
                      presupuesto: '',
                      codpresupuesto: '',
                      valor_presupuesto: 0.00,
                      account: element.cod_cuenta_por_pagar,
                      name: element.cuenta_por_pagar,
                      detail: "",
                      credit: ((parseFloat(element.totalItems) + parseFloat(element.iva_detalle)) - parseFloat(this.buyProv.multa)).toFixed(2),
                      debit: parseFloat('0.00').toFixed(2),
                      centro: 0,
                      cxp: 'S',
                      tipo_presupuesto: "",
                      tipo_afectacion: "",
                      devengado: 0,
                      cobrado_pagado: 0,
                    });

                  }

                }




                this.fieldsDaily.push({
                  LoadOpcionCatalogoPresupuesto: false,
                  presupuesto: element.nombre_catalogo_presupuesto,
                  nombrepresupuesto: element.nombrepresupuesto,
                  codpresupuesto: element.codigo_presupuesto,
                  valor_presupuesto: parseFloat(element.totalItems).toFixed(2),
                  account: element.codigo,
                  name: element.nombre,
                  detail: "",
                  credit: parseFloat('0.00').toFixed(2),
                  debit: parseFloat(element.totalItems).toFixed(2),
                  centro: element.centro,
                  tipo_presupuesto: "GASTOS",
        tipo_afectacion: "DEVENGADO",
        devengado: parseFloat(element.totalItems).toFixed(2),
        cobrado_pagado: 0,

                });

              }

            } else {


              /* asignamos la cuenta por pagar */
              if (element.cuenta_por_pagar != '') {
                this.fieldsDaily.push({
                  LoadOpcionCatalogoPresupuesto: false,
                  presupuesto: '',
                  codpresupuesto: '',
                  valor_presupuesto: 0.00,
                  account: element.cod_cuenta_por_pagar,
                  name: element.cuenta_por_pagar,
                  detail: "",
                  credit: ((parseFloat(element.totalItems) + parseFloat(element.iva_detalle)) - parseFloat(this.buyProv.multa)).toFixed(2),
                  debit: parseFloat('0.00').toFixed(2),
                  centro: 0,
                  cxp: 'S',
                  tipo_presupuesto: "",
        tipo_afectacion: "",
        devengado: 0,
        cobrado_pagado: 0,

                });
              }

              this.fieldsDaily.push({
                LoadOpcionCatalogoPresupuesto: false,
                presupuesto: element.nombre_catalogo_presupuesto,
                nombrepresupuesto: element.nombrepresupuesto,
                codpresupuesto: element.codigo_presupuesto,
                valor_presupuesto: parseFloat(element.totalItems).toFixed(2),
                account: element.codigo,
                name: element.nombre,
                detail: "",
                credit: parseFloat('0.00').toFixed(2),
                debit: parseFloat(element.totalItems).toFixed(2),
                centro: element.centro,
                tipo_presupuesto: "GASTOS",
        tipo_afectacion: "DEVENGADO",
        devengado: parseFloat(element.totalItems).toFixed(2) ,
        cobrado_pagado: 0,

              });

            }


            if (TamñoRecorrido === DetailCount) {
              console.log(TamñoRecorrido);
              console.log(DetailCount);
            }




          }, error => {
            this.lcargando.ctlSpinner(false);
            //this.fieldsDaily[index].LoadOpcionCatalogoPresupuesto = false;
            this.toastr.info(error.error.mesagge);
          })

        },
        (error) => {
          this.dataProducto[DetailCount - 1].LoadOpcionCentro = false;
        }

      );

      DetailCount++





    });


    /* Validamo si el iva es mayor a 0 */

    if (this.buyProv.valor_iva > 0) {

      this.comSrv.obtenerListaConfContable('FAC').subscribe((resConfig) => {

        let CuentaIva = resConfig[0].codigo_cuenta;
        let CuentaIvaNoombreCuenta = resConfig[0].nombre_cuenta;

        this.fieldsDaily.push({
          LoadOpcionCatalogoPresupuesto: false,
          presupuesto: '',
          codpresupuesto: '',
          valor_presupuesto: 0.00,
          account: CuentaIva,
          name: CuentaIvaNoombreCuenta,
          detail: "",
          credit: parseFloat('0.00').toFixed(2),
          debit: parseFloat(this.buyProv.valor_iva).toFixed(2),
          centro: 0,
          tipo_presupuesto: "",
        tipo_afectacion: "",
        devengado: 0,
        cobrado_pagado: 0,

        });

      });

    }


  }



  // generaPreviewAsientoContable = async () => {
  //   //debugger
  //   try {

  //     this.fieldsDaily = [];
  //     let DetailCount = 0;
  //     let TamñoRecorrido = this.dataCuenta.length;


  //     /* verificamos si existe algun despuento por multa */

  //     if (parseFloat(this.buyProv.multa) > 0) {

  //       this.fieldsDaily.unshift({
  //         LoadOpcionCatalogoPresupuesto: false,
  //         presupuesto: '',//cuenta.nombre_catalogo_presupuesto,
  //         codpresupuesto: '',// cuenta.codigo_presupuesto,
  //         valor_presupuesto: 0.00,// parseFloat(this.buyProv.multa).toFixed(2),
  //         account: this.buyProv.CodacountMulta,
  //         name: this.buyProv.acountMulta,
  //         detail: "",
  //         credit: parseFloat(this.buyProv.multa).toFixed(2),
  //         debit: parseFloat('0.00').toFixed(2),
  //         centro: 0,
  //         tipo: 'M'
  //       });


  //     }

  //     await Promise.all(this.dataCuenta.map(async (element) => {

  //       this.Centros();
  //       this.CentrosPresupuesto();



  //       if (this.fieldsDaily.length > 0) {


  //         let valRegister = false;
  //         let valRegisterPorPagar = false;
  //         let coddetail = 0;
  //         let coddetailPorPagar = 0;

  //         this.dataCuenta.forEach(elementDetail => {
  //           if (elementDetail.account === element.codigo) {
  //             valRegister = true;
  //             coddetail++;
  //           }
  //         });

  //         if (valRegister) {

  //           let totalDetail = 0.00;
  //           totalDetail = parseFloat(this.dataCuenta[coddetail - 1]) + parseFloat(element.totalItems);
  //           this.fieldsDaily[coddetail - 1].debit = totalDetail.toFixed(2);
  //           this.fieldsDaily[coddetail - 1] = element.centro;
  //           this.fieldsDaily[coddetail - 1] = parseFloat(element.totalItems).toFixed(2);

  //         } else {

  //           if (element.cuenta_por_pagar != '') {

  //             /* verificamos si algun detalle tiene la misma cuenta por pagar y se agrupa */

  //             let TotalPorPagar = 0;

  //             this.fieldsDaily.forEach(elementDetailDos => {
  //               if (elementDetailDos.account === element.cod_cuenta_por_pagar) {
  //                 valRegisterPorPagar = true;
  //                 TotalPorPagar = TotalPorPagar + parseFloat(elementDetailDos.credit);
  //                 coddetailPorPagar++;
  //               }
  //             });

  //             if (valRegisterPorPagar) {

  //               let totalDetailPorPagar = 0.00;
  //               totalDetailPorPagar = TotalPorPagar + ((parseFloat(element.totalItems) + parseFloat(element.iva_detalle)));
  //               this.fieldsDaily[coddetailPorPagar - 1].credit = (totalDetailPorPagar /*- parseFloat(this.buyProv.multa)*/).toFixed(2);


  //             } else {

  //               this.fieldsDaily.unshift({
  //                 LoadOpcionCatalogoPresupuesto: false,
  //                 presupuesto: '',
  //                 codpresupuesto: '',
  //                 valor_presupuesto: 0.00,
  //                 account: element.cod_cuenta_por_pagar,
  //                 name: element.cuenta_por_pagar,
  //                 detail: "",
  //                 credit: ((parseFloat(element.totalItems) + parseFloat(element.iva_detalle)) /*- parseFloat(this.buyProv.multa)*/).toFixed(2),
  //                 debit: parseFloat('0.00').toFixed(2),
  //                 centro: 0,
  //                 tipo: 'P'
  //               });

  //             }

  //           }

  //           this.fieldsDaily.push({
  //             LoadOpcionCatalogoPresupuesto: false,
  //             presupuesto: element.nombre_catalogo_presupuesto,
  //             codpresupuesto: element.codigo_presupuesto,
  //             valor_presupuesto: (element.nombre_catalogo_presupuesto !== '' && element.nombre_catalogo_presupuesto !== null) ? parseFloat(element.totalItems).toFixed(2) : 0.00,
  //             account: element.codigo,
  //             name: element.nombre,
  //             detail: "",
  //             credit: parseFloat('0.00').toFixed(2),
  //             debit: parseFloat(element.totalItems).toFixed(2),
  //             centro: element.centro,
  //             tipo: 'A'
  //           });

  //         }


  //       } else {

  //         /* asignamos la cuenta por pagar */
  //         if (element.cuenta_por_pagar != '') {
  //           this.fieldsDaily.unshift({
  //             LoadOpcionCatalogoPresupuesto: false,
  //             presupuesto: '',
  //             codpresupuesto: '',
  //             valor_presupuesto: 0.00,
  //             account: element.cod_cuenta_por_pagar,
  //             name: element.cuenta_por_pagar,
  //             detail: "",
  //             credit: ((parseFloat(element.totalItems) + parseFloat(element.iva_detalle)) /*- parseFloat(this.buyProv.multa)*/).toFixed(2),
  //             debit: parseFloat('0.00').toFixed(2),
  //             centro: 0,
  //             tipo: 'P'
  //           });
  //         }

  //         this.fieldsDaily.push({
  //           LoadOpcionCatalogoPresupuesto: false,
  //           presupuesto: element.nombre_catalogo_presupuesto,
  //           codpresupuesto: element.codigo_presupuesto,
  //           valor_presupuesto: (element.nombre_catalogo_presupuesto !== '' && element.nombre_catalogo_presupuesto !== null) ? parseFloat(element.totalItems).toFixed(2) : 0.00,
  //           account: element.codigo,
  //           name: element.nombre,
  //           detail: "",
  //           credit: parseFloat('0.00').toFixed(2),
  //           debit: parseFloat(element.totalItems).toFixed(2),
  //           centro: element.centro,
  //           tipo: 'A'
  //         });

  //       }

  //       DetailCount++

  //     }));
  //     console.log(this.fieldsDaily)

  //     /*insertamos un ultimo registro para los totalizados */

  //     if (this.buyProv.valor_iva > 0) {
  //       await this.RegistrarDetaAsienIva();
  //     }


  //   } catch (err) {
  //    // alert('Something went wrong, try again later!')
  //     //this.router.navigate(['/login']);
  //   }
  // }
  /* generaPreviewAsientoContable = async () => {
    try {

      this.fieldsDaily = [];
      let DetailCount = 0;
      let TamñoRecorrido = this.dataCuenta.length;


      // verificamos si existe algun despuento por multa

      // if (parseFloat(this.buyProv.multa) > 0) {

      //   this.fieldsDaily.unshift({
      //     LoadOpcionCatalogoPresupuesto: false,
      //     presupuesto: '',//cuenta.nombre_catalogo_presupuesto,
      //     codpresupuesto: '',// cuenta.codigo_presupuesto,
      //     valor_presupuesto: 0.00,// parseFloat(this.buyProv.multa).toFixed(2),
      //     account: this.buyProv.CodacountMulta,
      //     name: this.buyProv.acountMulta,
      //     detail: "",
      //     credit: parseFloat(this.buyProv.multa).toFixed(2),
      //     debit: parseFloat('0.00').toFixed(2),
      //     centro: 0,
      //     tipo: 'M',
      //     tipo_detalle: ''
      //   });


      // }

console.log(this.dataCuenta)


      await Promise.all(this.dataCuenta.map(async (element) => {

        await this.Centros();  // Centros
        await this.CentrosPresupuesto();



        if (this.fieldsDaily.length > 0) {


          let valRegister = false;
          let valRegisterPorPagar = false;
          let coddetail = 0;
          let coddetailPorPagar = 0;

          this.dataCuenta.forEach(elementDetail => {
            if (elementDetail.account === element.codigo) {
              valRegister = true;
              coddetail++;
            }
          });

          if (valRegister) {

            let totalDetail = 0.00;
            totalDetail = parseFloat(this.dataCuenta[coddetail - 1]) + parseFloat(element.totalItems);
            this.fieldsDaily[coddetail - 1].debit = totalDetail;
            this.fieldsDaily[coddetail - 1].centro = element.centro;
            this.fieldsDaily[coddetail - 1].totalTemp = parseFloat(element.totalItems).toFixed(2);

          } else {

            if (element.cuenta_por_pagar != '') {

              // verificamos si algun detalle tiene la misma cuenta por pagar y se agrupa

              let TotalPorPagar = 0;

              this.fieldsDaily.forEach(elementDetailDos => {
                if (elementDetailDos.account === element.cod_cuenta_por_pagar) {
                  valRegisterPorPagar = true;
                  TotalPorPagar = TotalPorPagar + parseFloat(elementDetailDos.credit);
                  coddetailPorPagar++;
                }
              });

              if (valRegisterPorPagar) {

                let totalDetailPorPagar = 0.00;
                totalDetailPorPagar = TotalPorPagar + ((parseFloat(element.totalItems) ));
                //totalDetailPorPagar = TotalPorPagar + ((parseFloat(element.totalItems) + parseFloat(element.iva_detalle)));

                this.fieldsDaily[coddetailPorPagar - 1].credit = totalDetailPorPagar //- parseFloat(this.buyProv.multa);


              } else {

                this.fieldsDaily.unshift({
                  LoadOpcionCatalogoPresupuesto: false,
                  presupuesto: '',
                  codpresupuesto: '',
                  valor_presupuesto: 0.00,
                  account: element.cod_cuenta_por_pagar,
                  name: element.cuenta_por_pagar,
                  detail: "",
                  credit: ((parseFloat(element.iva_detalle)) //- parseFloat(this.buyProv.multa)),
                  debit: 0,
                  centro: 0,
                  tipo: 'P',
                  tipo_detalle: 'IVACXP'
                });

                this.fieldsDaily.unshift({
                  LoadOpcionCatalogoPresupuesto: false,
                  presupuesto: '',
                  codpresupuesto: '',
                  valor_presupuesto: 0.00,
                  account: element.cod_cuenta_por_pagar,
                  name: element.cuenta_por_pagar,
                  detail: "",
                  credit: ((parseFloat(element.totalItems) )// - parseFloat(this.buyProv.multa)),
                  debit: 0,
                  centro: 0,
                  tipo: 'P',
                  tipo_detalle: 'CXP'
                });



              }

            }



              this.fieldsDaily.push({
                LoadOpcionCatalogoPresupuesto: false,
                presupuesto: element.nombre_catalogo_presupuesto,
                codpresupuesto: element.codigo_presupuesto,
                valor_presupuesto: (element.nombre_catalogo_presupuesto !== '' && element.nombre_catalogo_presupuesto !== null) ? parseFloat(element.totalItems).toFixed(2) : 0.00,
                account: element.codigo,
                name: element.nombre,
                detail: "",
                credit: 0,
                debit: parseFloat(element.totalItems),
                centro: element.centro,
                tipo: 'A',
                tipo_detalle: 'GTO'
              });

          }


        } else {

          // asignamos la cuenta por pagar
          if (element.cuenta_por_pagar != '') {

            this.fieldsDaily.unshift({
              LoadOpcionCatalogoPresupuesto: false,
              presupuesto: '',
              codpresupuesto: '',
              valor_presupuesto: 0.00,
              account: element.cod_cuenta_por_pagar,
              name: element.cuenta_por_pagar,
              detail: "",
              credit: ((parseFloat(element.iva_detalle)) //- parseFloat(this.buyProv.multa)),
              debit: 0,
              centro: 0,
              tipo: 'P',
              tipo_detalle: 'IVACXP'
            });

            this.fieldsDaily.unshift({
              LoadOpcionCatalogoPresupuesto: false,
              presupuesto: '',
              codpresupuesto: '',
              valor_presupuesto: 0.00,
              account: element.cod_cuenta_por_pagar,
              name: element.cuenta_por_pagar,
              detail: "",
              credit: ((parseFloat(element.totalItems) ) //- parseFloat(this.buyProv.multa)),
              debit: 0,
              centro: 0,
              tipo: 'P',
              tipo_detalle: 'CXP'
            });

          }

          this.fieldsDaily.push({
            LoadOpcionCatalogoPresupuesto: false,
            presupuesto: element.nombre_catalogo_presupuesto,
            codpresupuesto: element.codigo_presupuesto,
            valor_presupuesto: (element.nombre_catalogo_presupuesto !== '' && element.nombre_catalogo_presupuesto !== null) ? parseFloat(element.totalItems).toFixed(2) : 0.00,
            account: element.codigo,
            name: element.nombre,
            detail: "",
            credit: 0,
            debit: parseFloat(element.totalItems),
            centro: element.centro,
            tipo: 'A',
            tipo_detalle: 'GTO'
          });


        }
        if(element.cod_cuenta_impuesto_rtefte != ''){
          this.fieldsDaily.push({
              LoadOpcionCatalogoPresupuesto: false,
              presupuesto: '',
              codpresupuesto: '',
              valor_presupuesto: 0.00,
              account: element.cod_cuenta_impuesto_rtefte,
              name: element.cuenta_impuesto_rtefte,
              detail: "",
              credit:parseFloat(element.retencion),
              debit: 0,
              centro: 0,
              tipo: 'P',
              tipo_detalle: 'RTF'
          });
          this.fieldsDaily.push({
            LoadOpcionCatalogoPresupuesto: false,
            presupuesto: '',
            codpresupuesto: '',
            valor_presupuesto: 0.00,
            account: element.cod_cuenta_por_pagar,
            name: element.cuenta_por_pagar,
            detail: "",
            credit:0,
            debit: parseFloat(element.retencion),
            centro: 0,
            tipo: 'P',
            tipo_detalle: 'RTFCXP'
        });
        }

        if(element.cod_cuenta_impuesto_iva != ''){
          this.fieldsDaily.push({
              LoadOpcionCatalogoPresupuesto: false,
              presupuesto: '',
              codpresupuesto: '',
              valor_presupuesto: 0.00,
              account: element.cod_cuenta_impuesto_iva,
              name: element.nombre_cuenta_impuesto_iva,
              detail: "",
              credit:parseFloat(element.retencion_iva),
              debit: 0,
              centro: 0,
              tipo: 'P',
              tipo_detalle: 'RTI'
          });
          this.fieldsDaily.push({
            LoadOpcionCatalogoPresupuesto: false,
            presupuesto: '',
            codpresupuesto: '',
            valor_presupuesto: 0.00,
            account: element.cod_cuenta_por_pagar,
            name: element.cuenta_por_pagar,
            detail: "",
            credit:0,
            debit: parseFloat(element.retencion_iva),
            centro: 0,
            tipo: 'P',
            tipo_detalle: 'RTICXP'
        });
        }


        DetailCount++

      }));
      let codigo_cuentas=[];
      this.fieldsDaily.forEach(d => {
        codigo_cuentas.push(d.account);
      });
      console.log(codigo_cuentas)
      console.log(this.fieldsDaily)

      // insertamos un ultimo registro para los totalizados

      // if (this.buyProv.valor_iva > 0) {
        await this.RegistrarDetaAsienIva();
      // }

      console.log(this.dataCuenta);


    } catch (err) {
      console.log(err)
      alert('Something went wrong, try again later!')
      // this.router.navigate(['/login']);
    }
  } */

  async generaPreviewAsientoContable() {
    console.log('Generando asientos')

    this.lcargando.ctlSpinner(true);
    this.fieldsDaily = [];
    // console.log(this.dataAnticipos)
    // console.log(this.dataMultas)
    if(this.dataAnticipos.length > 0){
      for (let i = 0; i < this.dataAnticipos.length; i++) {
        const anticipos = this.dataAnticipos[i];
        let elementoEncontrado_ant = this.dataCuenta.find(registro => registro.cod_cuenta_por_pagar === anticipos.cod_cuenta_por_pagar_ant);

      this.fieldsDaily.push({
           LoadOpcionCatalogoPresupuesto: false,
           presupuesto: '',
           codpresupuesto: '',
           codpartidaidp:'',
           proyecto:'',
           orientacion:'',
           geografico:'',
           actividad:'',
           funcion:'',
           fk_programa:'',
           valor_presupuesto: 0.00,
           account: anticipos.codigo,//this.dataAnticipos[0].codigo,
           name: anticipos.nombre,//this.dataAnticipos[0].nombre,
           detail: "",
           credit: parseFloat(anticipos.valor_aplicado), //this.buyProv.total_anticipo- parseFloat(this.buyProv.multa)),
           debit: 0,
           centro: 0,
           tipo: 'P',
           tipo_detalle: 'ANTICIPO',
           dataCuenta: "",
           tipo_presupuesto: "",
           tipo_afectacion: "",
           devengado: 0,
           cobrado_pagado: 0,
         });
         const resultadosFiltrados = this.codigos_partidas_idp.filter(item => item.codigopartida === elementoEncontrado_ant?.codigo_partida_icp);
        this.fieldsDaily.push({
          LoadOpcionCatalogoPresupuesto: false,
          presupuesto: elementoEncontrado_ant?.nombrepresupuesto,//'',//x
          codpresupuesto: elementoEncontrado_ant?.codigo_presupuesto,//'',
          codpartidaidp:elementoEncontrado_ant?.codigo_partida_icp,
          proyecto: resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] : '',
          orientacion:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
          geografico:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
          actividad:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
          funcion:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
          fk_programa:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.fk_programa)[0] :'',
          valor_presupuesto:  parseFloat(anticipos.valor_aplicado),//elementoEncontrado_ant?.cantidad,
          valor_partida:  parseFloat(anticipos.valor_aplicado),//elementoEncontrado_ant?.cantidad,//0.00,
          account: anticipos.cod_cuenta_por_pagar_ant,//this.dataAnticipos[0].cod_cuenta_por_pagar_ant,
          name:  anticipos.nombre_cuenta_por_pagar_ant,//this.dataAnticipos[0].nombre_cuenta_por_pagar_ant,
          detail: "",
          credit: 0, //- parseFloat(this.buyProv.multa)),
          debit: parseFloat(anticipos.valor_aplicado),//this.buyProv.total_anticipo
          centro: 0,
          tipo: 'P',
          tipo_detalle: 'ANTCXP',
          dataCuenta: "",
          tipo_presupuesto: "GASTOS",
          tipo_afectacion: "PAGADO",
          devengado: parseFloat(anticipos.valor_aplicado),
          cobrado_pagado: 0,
        });
      }
    }

    if(this.dataMultas.length > 0){
      for (let i = 0; i < this.dataMultas.length; i++) {
        const multas = this.dataMultas[i];
        let elementoEncontrado = this.dataCuenta.find(registro => registro.cod_cuenta_por_pagar === multas.cod_cuenta_por_pagar_multa);

        this.fieldsDaily.push({
        LoadOpcionCatalogoPresupuesto: false,
        presupuesto: '',
        codpresupuesto: '',
        codpartidaidp:'',
        proyecto:'',
        orientacion:'',
        geografico:'',
        actividad:'',
        funcion:'',
        fk_programa:'',
        valor_presupuesto: 0.00,
        account: multas.codigo,//this.dataMultas[0].codigo,
        name:  multas.nombre,//this.dataMultas[0].nombre,
        detail: "",
        credit: parseFloat(multas.valor_aplicado), // this.buyProv.total_multa- parseFloat(this.buyProv.multa)),
        debit: 0,
        centro: 0,
        tipo: 'P',
        tipo_detalle: 'MULTA',
        dataCuenta: "",
        tipo_presupuesto: "",
        tipo_afectacion: "",
        devengado: 0,
        cobrado_pagado: 0,

      });
      const resultadosFiltrados = this.codigos_partidas_idp.filter(item => item.codigopartida === elementoEncontrado?.codigo_partida_icp);

      this.fieldsDaily.push({
        LoadOpcionCatalogoPresupuesto: false,
        presupuesto: elementoEncontrado?.nombrepresupuesto,//'',
        codpresupuesto: elementoEncontrado?.codigo_presupuesto,
        codpartidaidp:elementoEncontrado?.codigo_partida_icp,
        proyecto: resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] : '',
        orientacion:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
        geografico:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
        actividad:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
        funcion:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
        fk_programa:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.fk_programa)[0] :'',

        valor_presupuesto: parseFloat(multas.valor_aplicado),//,elementoEncontrado?.cantidad,
        valor_partida: parseFloat(multas.valor_aplicado),//elementoEncontrado?.cantidad,//,0.00,
        account: multas.cod_cuenta_por_pagar_multa,//this.dataMultas[0].cod_cuenta_por_pagar_multa,
        name:  multas.nombre_cuenta_por_pagar_multa,//this.dataMultas[0].nombre_cuenta_por_pagar_multa,
        detail: "",
        credit: 0, //- parseFloat(this.buyProv.multa)),
        debit: parseFloat(multas.valor_aplicado),//this.buyProv.total_multa
        centro: 0,
        tipo: 'P',
        tipo_detalle: 'MUCXP',
        dataCuenta: "",
        tipo_presupuesto: "GASTOS",
        tipo_afectacion: "PAGADO",
        devengado: parseFloat(multas.valor_aplicado),
        cobrado_pagado: 0,
      });

    }
    }

    // IVA
    const response = await this.comSrv.obtenerListaConfContable('FAC') as any
    console.log(response)
    let CuentaIva='';
    let CuentaIvaNoombreCuenta='';

    //this.ctaIva = resConfig['data'].filter(a => a.descripcion_evento == "IVA EN COMPRAS")
    response['data'].forEach((iva: any) =>{
      if(iva.descripcion_evento == "IVA EN COMPRAS"){
        CuentaIva = iva.codigo_cuenta;
        CuentaIvaNoombreCuenta = iva.nombre_cuenta;
      }
    });
//nombre_catalogo_presupuesto nombre_catalogo_presupuesto
console.log("prueba de agregar datos de idp");
console.log(this.dataCuenta);
    this.dataCuenta.forEach((element: any, idx: number) => {
      const resultadosFiltrados = this.codigos_partidas_idp.filter(item => item.codigopartida === element?.codigo_partida_icp);
      this.fieldsDaily.push({
        LoadOpcionCatalogoPresupuesto: false,
        presupuesto: element.nombre_catalogo_presupuesto,
        nombrepresupuesto: element.nombrepresupuesto,
        codpresupuesto: element.codigo_presupuesto,
        codpartidaidp:element?.codigo_partida_icp,

        proyecto: resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] : '',
        orientacion:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
        geografico:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
        actividad:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
        funcion:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.proyecto)[0] :'',
        fk_programa:resultadosFiltrados.length > 0 ? resultadosFiltrados.map(item => item.fk_programa)[0] :'',
        valor_presupuesto: (element.nombrepresupuesto !== '' && element.nombrepresupuesto !== null && element.nombrepresupuesto !== undefined) ? parseFloat(element.totalItems).toFixed(2) : 0.00,
        account: element.codigo,
        name: element.nombre,
        detail: "",
        credit: 0,
        debit: parseFloat(element.totalItems),
        centro: element.centro,
        tipo: 'A',
        tipo_detalle: 'GTO',
        dataCuenta: idx,
        tipo_presupuesto: "GASTOS",
        tipo_afectacion: "DEVENGADO",
        devengado: parseFloat(element.totalItems),
        cobrado_pagado: 0,
        fk_linea: idx + 1
      });

      // Si tiene Cuenta por Pagar
      if (element.cuenta_por_pagar != '') {
        // this.fieldsDaily.push({
        //   LoadOpcionCatalogoPresupuesto: false,
        //   presupuesto: '',
        //   codpresupuesto: '',
        //   valor_presupuesto: 0.00,
        //   account: element.cod_cuenta_por_pagar,
        //   name: element.cuenta_por_pagar,
        //   detail: "",
        //   credit: parseFloat(element.iva_detalle), //- parseFloat(this.buyProv.multa)),
        //   debit: 0,
        //   centro: 0,
        //   tipo: 'P',
        //   tipo_detalle: 'IVACXP',
        //   dataCuenta: idx,
        //   tipo_presupuesto: "",
        // tipo_afectacion: "",
        // devengado: 0,
        // cobrado_pagado: 0,
        // fk_linea: idx + 1
        // });

        this.fieldsDaily.push({
          LoadOpcionCatalogoPresupuesto: false,
          presupuesto: '',
          codpresupuesto: '',
          codpartidaidp:'',
          proyecto:'',
          orientacion:'',
          geografico:'',
          actividad:'',
          funcion:'',
          fk_programa:'',
          valor_presupuesto: 0.00,
          account: element.cod_cuenta_por_pagar,
          name: element.cuenta_por_pagar,
          detail: "",
          credit: parseFloat(element.totalItems)- parseFloat(element.retencion ?? 0), //- parseFloat(this.buyProv.multa)), - parseFloat(element.retencion_iva)
          debit: 0,
          centro: 0,
          tipo: 'P',
          tipo_detalle: 'CXP',
          dataCuenta: idx,
          tipo_presupuesto: "",
          tipo_afectacion: "",
          devengado: 0,
          cobrado_pagado: 0,
          fk_linea: idx + 1
        });
      }


      // Retencion en Fuente
      if(element.cod_cuenta_impuesto_rtefte /* && element.cod_cuenta_impuesto_rtefte != '' */){
        this.fieldsDaily.push({
          LoadOpcionCatalogoPresupuesto: false,
          presupuesto: '',
          codpresupuesto: '',
          codpartidaidp:'',
          proyecto:'',
          orientacion:'',
          geografico:'',
          actividad:'',
          funcion:'',
          fk_programa:'',
          valor_presupuesto: 0.00,
          account: element.cod_cuenta_impuesto_rtefte,
          name: element.cuenta_impuesto_rtefte,
          detail: "",
          credit:parseFloat(element.retencion),
          debit: 0,
          centro: 0,
          tipo: 'P',
          tipo_detalle: 'RTF',
          dataCuenta: idx,
          tipo_presupuesto: "",
          tipo_afectacion: "",
          devengado: 0,
          cobrado_pagado: 0,
          fk_linea: idx + 1
        });

        // this.fieldsDaily.push({
        //   LoadOpcionCatalogoPresupuesto: false,
        //   presupuesto: '',
        //   codpresupuesto: '',
        //   valor_presupuesto: 0.00,
        //   account: element.cod_cuenta_por_pagar,
        //   name: element.cuenta_por_pagar,
        //   detail: "",
        //   credit:0,
        //   debit: parseFloat(element.retencion ?? 0),
        //   centro: 0,
        //   tipo: 'P',
        //   tipo_detalle: 'RTFCXP',
        //   dataCuenta: idx,
        //   tipo_presupuesto: "",
        //   tipo_afectacion: "",
        //   devengado: 0,
        //   cobrado_pagado: 0,
        //   fk_linea: idx + 1
        // });
      }

      // Retencion Fuente IVA
      if(element.cod_cuenta_impuesto_iva /* && element.cod_cuenta_impuesto_iva != '' */){
        this.fieldsDaily.push({
          LoadOpcionCatalogoPresupuesto: false,
          presupuesto: '',
          codpresupuesto: '',
          codpartidaidp: '',
          proyecto:'',
          orientacion:'',
          geografico:'',
          actividad:'',
          funcion:'',
          fk_programa:'',
          valor_presupuesto: 0.00,
          account: element.cod_cuenta_impuesto_iva,
          name: element.nombre_cuenta_impuesto_iva,
          detail: "",
          credit:parseFloat(element.retencion_iva),
          debit: 0,
          centro: 0,
          tipo: 'P',
          tipo_detalle: 'RTI',
          dataCuenta: idx,
          tipo_presupuesto: "",
          tipo_afectacion: "",
          devengado: 0,
          cobrado_pagado: 0,
          fk_linea: idx + 1
        });

        // this.fieldsDaily.push({
        //   LoadOpcionCatalogoPresupuesto: false,
        //   presupuesto: '',
        //   codpresupuesto: '',
        //   valor_presupuesto: 0.00,
        //   account: element.cod_cuenta_por_pagar,
        //   name: element.cuenta_por_pagar,
        //   detail: "",
        //   credit:0,
        //   debit: parseFloat(element.retencion_iva),
        //   centro: 0,
        //   tipo: 'P',
        //   tipo_detalle: 'RTICXP',
        //   dataCuenta: idx,
        //   tipo_presupuesto: "",
        //   tipo_afectacion: "",
        //   devengado: 0,
        //   cobrado_pagado: 0,
        //   fk_linea: idx + 1
        // });
      }

      this.fieldsDaily.push({
        LoadOpcionCatalogoPresupuesto: false,
        presupuesto: '',
        codpresupuesto: '',
        codpartidaidp:'',
        proyecto:'',
        orientacion:'',
        geografico:'',
        actividad:'',
        funcion:'',
        fk_programa:'',
        valor_presupuesto: 0.00,
        account: CuentaIva,
        name: CuentaIvaNoombreCuenta,
        detail: "",
        credit: 0,
        debit: parseFloat(element.iva_detalle),
        centro: 0,
        tipo: 'I',
        tipo_detalle: 'IVA',
        dataCuenta: idx,
        tipo_presupuesto: "",
        tipo_afectacion: "",
        devengado: 0,
        cobrado_pagado: 0,
        fk_linea: idx + 1
      });

      if(this.buyProv.acountMultaContrapartida !== ''){
        this.fieldsDaily.push({
          LoadOpcionCatalogoPresupuesto: false,
          presupuesto: '',//cuenta.nombre_catalogo_presupuesto,
          codpresupuesto: '',// cuenta.codigo_presupuesto,
          codpartidaidp  : '',
          proyecto:'',
          orientacion:'',
          geografico:'',
          actividad:'',
          funcion:'',
          fk_programa:'',
          valor_presupuesto: 0.00,// parseFloat(this.buyProv.multa).toFixed(2),
          account: this.buyProv.CodacountMultaContrapartida,
          name: this.buyProv.acountMultaContrapartida,
          detail: "",
          credit: 0,
          debit: parseFloat(this.buyProv.multa),
          centro: 0,
          tipo: 'M',
          tipo_detalle: '',
          dataCuenta: idx,
          tipo_presupuesto: "",
          tipo_afectacion: "",
          devengado: 0,
          cobrado_pagado: 0,
          fk_linea: idx + 1
        });
      }

      if(element.cuenta_inversion_cobro_codigo != null || element.cuenta_inversion_cobro_codigo != ''){

          this.fieldsDaily.push({
            LoadOpcionCatalogoPresupuesto: false,
            presupuesto: '',//cuenta.nombre_catalogo_presupuesto,
            codpresupuesto: '',// cuenta.codigo_presupuesto,
            codpartidaidp  : '',
            proyecto:'',
            orientacion:'',
            geografico:'',
            actividad:'',
            funcion:'',
            fk_programa:'',
            valor_presupuesto: 0.00,// parseFloat(this.buyProv.multa).toFixed(2),
            account: element.cuenta_inversion_cobro_codigo,
            name: element.cuenta_inversion_cobro_nombre,
            detail: "",
            credit: 0,
            debit: parseFloat(element.totalItems),
            centro: 0,
            tipo: 'M',
            tipo_detalle: 'CTAINVERSION1',
            dataCuenta: idx,
            tipo_presupuesto: "",
            tipo_afectacion: "",
            devengado: 0,
            cobrado_pagado: 0,
            fk_linea: idx + 1
          });
      }
      if(element.cuenta_inversion_pago_codigo != null || element.cuenta_inversion_pago_codigo != ''){

        this.fieldsDaily.push({
          LoadOpcionCatalogoPresupuesto: false,
          presupuesto: '',//cuenta.nombre_catalogo_presupuesto,
          codpresupuesto: '',// cuenta.codigo_presupuesto,
          codpartidaidp  : '',
          proyecto:'',
          orientacion:'',
          geografico:'',
          actividad:'',
          funcion:'',
          fk_programa:'',
          valor_presupuesto: 0.00,// parseFloat(this.buyProv.multa).toFixed(2),
          account: element.cuenta_inversion_pago_codigo,
          name: element.cuenta_inversion_pago_nombre,
          detail: "",
          credit: parseFloat(element.totalItems),
          debit: 0,
          centro: 0,
          tipo: 'M',
          tipo_detalle: 'CTAINVERSION2',
          dataCuenta: idx,
          tipo_presupuesto: "",
          tipo_afectacion: "",
          devengado: 0,
          cobrado_pagado: 0,
          fk_linea: idx + 1
        });
    }


    })

    // Totalizar
      // Remover el T que se haya generado anteriormente
      this.fieldsDaily = this.fieldsDaily.filter((element: any) => element.tipo != 'T')
      console.log(this.fieldsDaily)

      let TotalDebito = 0;
      let TotalCredito = 0;
      let TotalPresupuesto = 0;




      TotalDebito = this.fieldsDaily.reduce((acc: number, curr) => {
      if (curr.tipo_detalle != 'ANTICIPO' && curr.tipo_detalle != 'ANTCXP' && curr.tipo_detalle != 'MULTA' && curr.tipo_detalle != 'MUCXP'){
        if (curr.account !== undefined) return acc + parseFloat(curr.debit)
        return acc} else{
          return acc
        }
      }, 0)
      TotalCredito = this.fieldsDaily.reduce((acc: number, curr) => {
        if (curr.tipo_detalle != 'ANTICIPO' && curr.tipo_detalle != 'ANTCXP' && curr.tipo_detalle != 'MULTA' && curr.tipo_detalle != 'MUCXP'){
        if (curr.account !== undefined) return acc + parseFloat(curr.credit)
        return acc} else{
          return acc
        }
      }, 0)
      TotalPresupuesto = this.fieldsDaily.reduce((acc: number, curr) => {
        if (curr.tipo_detalle != 'ANTICIPO' && curr.tipo_detalle != 'ANTCXP' && curr.tipo_detalle != 'MULTA' && curr.tipo_detalle != 'MUCXP'){
        if (curr.account !== undefined) return acc + parseFloat(curr.valor_presupuesto)
        return acc} else{
          return acc
        }
      }, 0)

      console.log(TotalDebito, TotalCredito, TotalPresupuesto)

      console.log('aqui se totaliza');
      this.fieldsDaily.push({
        LoadOpcionCatalogoPresupuesto: false,
        presupuesto: '',
        codpresupuesto: '',
        codpartidaidp: '',
        proyecto:'',
           orientacion:'',
           geografico:'',
           actividad:'',
           funcion:'',
           fk_programa:'',
        valor_presupuesto: TotalPresupuesto.toFixed(2),
        account: 'Total',
        name: '',
        detail: "",
        credit: TotalCredito,
        debit: TotalDebito,
        centro: 0,
        tipo: 'T',
        tipo_detalle: '',
        dataCuenta: null,
        tipoPresupuesto:null,
        tipoAfectacion:null,

      });

   this.calcularAntipipoMulta();
    this.lcargando.ctlSpinner(false);
    console.log('Fin generacion asientos')
  }

functemp(x){
  if (x.index==2 && this.lastRecord == null){
this.generaPreviewAsientoContable();
  }

}
calcularAntipipoMulta(){
  let TotalDebit_anticipo=0;
  let TotalCre_anticipo=0;
  let TotalPre_anticipo=0;

let TotalDebit_multa=0;
let TotalCre_multa=0;
let TotalPre_multa=0;

TotalDebit_anticipo= this.fieldsDaily.reduce((acc: number, curr) => {
if (curr.tipo_detalle == 'ANTICIPO' || curr.tipo_detalle == 'ANTCXP'){
if (curr.account !== undefined) return acc + parseFloat(curr.debit)
return acc} else{
  return acc
}
}, 0)
TotalCre_anticipo= this.fieldsDaily.reduce((acc: number, curr) => {
if (curr.tipo_detalle == 'ANTICIPO' || curr.tipo_detalle == 'ANTCXP'){
if (curr.account !== undefined) return acc + parseFloat(curr.credit)
return acc} else{
return acc
}
}, 0)
TotalPre_anticipo = this.fieldsDaily.reduce((acc: number, curr) => {
if (curr.tipo_detalle == 'ANTICIPO' || curr.tipo_detalle == 'ANTCXP'){
if (curr.account !== undefined) return acc + parseFloat(curr.valor_presupuesto)
return acc} else{
return acc
}
}, 0)


TotalDebit_multa= this.fieldsDaily.reduce((acc: number, curr) => {
if (curr.tipo_detalle == 'MULTA' || curr.tipo_detalle == 'MUCXP'){
if (curr.account !== undefined) return acc + parseFloat(curr.debit)
return acc} else{
  return acc
}
}, 0)
TotalCre_multa= this.fieldsDaily.reduce((acc: number, curr) => {
if (curr.tipo_detalle == 'MULTA' || curr.tipo_detalle == 'MUCXP'){
if (curr.account !== undefined) return acc + parseFloat(curr.credit)
return acc} else{
return acc
}
}, 0)
TotalPre_multa= this.fieldsDaily.reduce((acc: number, curr) => {
if (curr.tipo_detalle == 'MULTA' || curr.tipo_detalle == 'MUCXP'){
if (curr.account !== undefined) return acc + parseFloat(curr.valor_presupuesto)
return acc} else{
return acc
}
}, 0)

  this.total_anticipos = {
    TotalDebit_anticipo: TotalDebit_anticipo,
    TotalCre_anticipo: TotalCre_anticipo,
    TotalPre_anticipo: TotalPre_anticipo,
    TotalDebit_multa: TotalDebit_multa,
    TotalCre_multa: TotalCre_multa,
    TotalPre_multa: TotalPre_multa
  }
}


  RegistrarDetaAsienIva() {

    this.comSrv.obtenerListaConfContable('FAC').subscribe((resConfig) => {
      console.log(resConfig)
      let CuentaIva='';
      let CuentaIvaNoombreCuenta='';

      //this.ctaIva = resConfig['data'].filter(a => a.descripcion_evento == "IVA EN COMPRAS")
      resConfig['data'].map(iva =>{
        if(iva.descripcion_evento == "IVA EN COMPRAS"){
          CuentaIva = iva.codigo_cuenta;
          CuentaIvaNoombreCuenta = iva.nombre_cuenta;
        }
      });

      this.fieldsDaily.push({
        LoadOpcionCatalogoPresupuesto: false,
        presupuesto: '',
        codpresupuesto: '',
        codpartidaidp: '',
        proyecto:'',
        orientacion:'',
        geografico:'',
        actividad:'',
        funcion:'',
        fk_programa:'',
        valor_presupuesto: 0.00,
        account: CuentaIva,
        name: CuentaIvaNoombreCuenta,
        detail: "",
        credit: 0,
        debit: parseFloat(this.buyProv.valor_iva),
        centro: 0,
        tipo: 'I',
        tipo_detalle: 'IVA',
        tipo_presupuesto: "",
        tipo_afectacion: "",
        devengado: 0,
        cobrado_pagado: 0,
      });




      if(this.buyProv.acountMultaContrapartida !== ''){

        this.fieldsDaily.push({
          LoadOpcionCatalogoPresupuesto: false,
          presupuesto: '',//cuenta.nombre_catalogo_presupuesto,
          codpresupuesto: '',// cuenta.codigo_presupuesto,
          codpartidaidp: '',
          proyecto:'',
          orientacion:'',
          geografico:'',
          actividad:'',
          funcion:'',
          fk_programa:'',
          valor_presupuesto: 0.00,// parseFloat(this.buyProv.multa).toFixed(2),
          account: this.buyProv.CodacountMultaContrapartida,
          name: this.buyProv.acountMultaContrapartida,
          detail: "",
          credit: 0,
          debit: parseFloat(this.buyProv.multa),
          centro: 0,
          tipo: 'M',
          tipo_detalle: '',
          tipo_presupuesto: "",
          tipo_afectacion: "",
          devengado: 0,
          cobrado_pagado: 0,
        });

      }

      this.TotalizarAsientoCompra();

    })

  }


  TotalizarAsientoCompra() {
console.log("inicio del calculo")
    console.log(this.fieldsDaily)
    let TotalDebito = 0;
    let TotalCredito = 0;
    let TotalPresupuesto = 0;

    // await Promise.all();
    TotalDebito = this.fieldsDaily.reduce((acc: number, curr) => {
      if (curr.account !== undefined) return acc + parseFloat(curr.debit)
      return acc
    }, 0)
    TotalCredito = this.fieldsDaily.reduce((acc: number, curr) => {
      if (curr.account !== undefined) return acc + parseFloat(curr.credit)
      return acc
    }, 0)
    TotalPresupuesto = this.fieldsDaily.reduce((acc: number, curr) => {
      if (curr.account !== undefined) return acc + parseFloat(curr.valor_presupuesto)
      return acc
    }, 0)
console.log('aqui se totaliza');
    console.log(TotalDebito, TotalCredito, TotalPresupuesto)

    // this.fieldsDaily.forEach((elementAsiento) => {

    //   TotalDebito = TotalDebito + parseFloat(elementAsiento.debit);
    //   TotalCredito = TotalCredito + parseFloat(elementAsiento.credit);
    //   TotalPresupuesto = TotalPresupuesto + parseFloat(elementAsiento.valor_presupuesto);

    // })
    //commonServices.formatNumber(

    this.fieldsDaily.push({
      LoadOpcionCatalogoPresupuesto: false,
      presupuesto: '',
      codpresupuesto: '',
      codpartidaidp: '',
      proyecto:'',
      orientacion:'',
      geografico:'',
      actividad:'',
      funcion:'',
      fk_programa:'',
      valor_presupuesto: TotalPresupuesto.toFixed(2),
      account: 'Total',
      name: '',
      detail: "",
      credit: TotalCredito,
      debit: TotalDebito,
      centro: 0,
      tipo: 'T',
      tipo_detalle: '',

    });



    this.calcularAntipipoMulta();


  }

  async CentrosPresupuesto() {
    const reponse = await this.comSrv.ListaCatalogoPresupuesto() as any
    this.catalogo_presupuesto = reponse.data
    /* await this.comSrv.ListaCatalogoPresupuesto().subscribe((result) => {
      this.catalogo_presupuesto = result['data']
    }) */
  }

  async Centros() {
    const reponse = await this.comSrv.ListaCentroCostos() as any
    this.centros = reponse.data
    /* await this.comSrv.ListaCentroCostos().subscribe((resCentro) => {
      this.centros = resCentro["data"]
    }) */
  }


  getCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos'
    let data = {
      params: "'TIPO PAGO','FORMA PAGO','REC_METODO_PAGO'"
     // params: "REC_METODO_PAGO"
    }
    this.comSrv.getCatalogos(data).subscribe(res => {


      this.tipo_pago = res['data']['TIPO PAGO'];
      this.forma_pago = res['data']['FORMA PAGO'];
      this.metodo_pago = res["data"]['REC_METODO_PAGO'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }


  getimpuestos() {

    (this as any).mensajeSpinner = 'Cargando Impuestos'
    this.comSrv.getImpuestosIva().subscribe(res => {
      console.log(res['data'])
      console.log(res['data'][0])
      this.buyProv.iva = res['data'][0];
      this.buyProv.iva = this.buyProv.iva.valor;
      this.buyProv.iva = (this.buyProv.iva / 100) * 100;
      this.ivaAux = this.buyProv.iva;

      this.cargarListas();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })

  }

  changeDisabledBtn() {
    if (this.buyProv.tipo_pago == 'Crédito') {
      this.flagBtnDired = true;
    } else {
      this.flagBtnDired = false;
    }
  }

  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  fileChanged(event: any) {

    this.toastr.error("El archivo no cumple con la estrucutra indicado");

  }

  deleteItems(index) {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.buyProv.subtotal = 0.00;
      this.buyProv.valor_iva = 0.00;
      this.buyProv.total = 0.00;
      this.dataProducto.splice(index, 1);

      this.dataProducto.forEach(element => {
        this.buyProv.subtotal += element.totalItems;
      });
      this.buyProv.valor_iva = this.buyProv.subtotal * (this.buyProv.iva / 100);
      this.buyProv.total = parseFloat(this.buyProv.subtotal + this.buyProv.valor_iva).toFixed(2);
      this.buyProv.valor_iva = parseFloat(this.buyProv.valor_iva).toFixed(2);
      this.buyProv.subtotal = parseFloat(this.buyProv.subtotal).toFixed(2);
    }
  }


  deleteItemCuenta(index) {

    if (this.permisions.eliminar == "0") {

      this.toastr.info("Usuario no tiene permiso para eliminar");

    } else {

      //this.buyProv.subtotal = 0.00;
      //this.buyProv.valor_iva = 0.00;
      //this.buyProv.total = 0.00;

      this.dataCuenta.splice(index, 1);

      console.log("el calculo");
      this.calculaImpuestoIva();/*
    this.generaPreviewAsientoContable(); */

    this.calculaImpuesto()
    this.generaPreviewAsientoContable();
      this.recalculateAfectacion();

      //this.dataCuenta.forEach(element => {
      //  this.buyProv.subtotal += element.totalItems;
      // });

      //this.buyProv.valor_iva = this.buyProv.subtotal * (this.buyProv.iva / 100);
      //this.buyProv.total = parseFloat(this.buyProv.subtotal + this.buyProv.valor_iva).toFixed(2);
      // this.buyProv.valor_iva = parseFloat(this.buyProv.valor_iva).toFixed(2);
      //this.buyProv.subtotal = parseFloat(this.buyProv.subtotal).toFixed(2);

    }

  }

  sumRegistroDetalle(index) {


    if ((((this.dataProducto[index].cantidad) * this.dataProducto[index].precio)) < parseFloat(this.dataProducto[index].desc)) {
      this.toastr.info("El descuento no puede ser mayor al total del detalle, por favor verificar");
      this.dataProducto[index].desc = 0;
      this.sumRegistroDetalle(index);
      return false;
    }

    this.buyProv.subtotal = 0.00;
    this.buyProv.valor_iva = 0.00;
    this.buyProv.total = 0.00;

    this.dataProducto[index].subtotalItems = (((this.dataProducto[index].cantidad) * this.dataProducto[index].precio));
    this.dataProducto[index].totalItems = (((this.dataProducto[index].cantidad) * this.dataProducto[index].precio) - this.dataProducto[index].desc);


    switch (this.dataProducto[index].impuesto) {

      case "2":
        this.dataProducto[index].iva_detalle = ((this.dataProducto[index].totalItems) * (this.buyProv.iva / 100)).toFixed(2);
        this.dataProducto[index].subtotal_iva = this.dataProducto[index].totalItems;
        break;
      case "0":
        this.dataProducto[index].iva_detalle = (0.00).toFixed(2);
        this.dataProducto[index].subtotal_cero = this.dataProducto[index].totalItems;
        this.dataProducto[index].subtotal_iva = (0.00).toFixed(2);
        this.dataProducto[index].subtotal_noobjeto = (0.00).toFixed(2);
        this.dataProducto[index].subtotal_excento = (0.00).toFixed(2);
        break;
      case "6":
        this.dataProducto[index].iva_detalle = (0.00).toFixed(2);
        this.dataProducto[index].subtotal_noobjeto = this.dataProducto[index].totalItems;
        this.dataProducto[index].subtotal_cero = (0.00).toFixed(2);
        this.dataProducto[index].subtotal_iva = (0.00).toFixed(2);
        this.dataProducto[index].subtotal_excento = (0.00).toFixed(2);
        break;
      case "7":
        this.dataProducto[index].iva_detalle = (0.00).toFixed(2);
        this.dataProducto[index].subtotal_excento = this.dataProducto[index].totalItems;
        this.dataProducto[index].subtotal_cero = (0.00).toFixed(2);
        this.dataProducto[index].subtotal_iva = (0.00).toFixed(2);
        this.dataProducto[index].subtotal_noobjeto = (0.00).toFixed(2);
        break;
      case "8":
        this.dataProducto[index].iva_detalle = (this.dataProducto[index].totalItems * (8 / 100)).toFixed(2);
        break;

    }

    if ((typeof (this.dataProducto[index].porce_fte) !== 'undefined') &&
      (this.dataProducto[index].porce_fte > 0)) {
      this.calculaImpuestoIva();
    }

    this.sumTotalizados();


  }


  async sumRegistroDetalleCuenta(index) {


    this.buyProv.subtotal = 0.00;
    this.buyProv.valor_iva = 0.00;
    this.buyProv.total = 0.00;

    //this.dataCuenta[index].subtotalItems = (((this.dataCuenta[index].cantidad) * this.dataCuenta[index].precio));
    this.dataCuenta[index].subtotalItems = parseFloat(((this.dataCuenta[index].cantidad) * this.dataCuenta[index].precio).toFixed(2));

    if ((((this.dataCuenta[index].cantidad) * this.dataCuenta[index].precio)) < parseFloat(this.dataCuenta[index].desc)) {
      this.toastr.info("El descuento no puede ser mayor al total del detalle, por favor verificar");
      this.dataCuenta[index].desc = 0;
      this.sumRegistroDetalleCuenta(index);
      return false;
    }

    this.dataCuenta[index].totalItems = (((this.dataCuenta[index].cantidad) * this.dataCuenta[index].precio) - this.dataCuenta[index].desc);


    switch (this.dataCuenta[index].impuesto) {

      case "2":
        this.dataCuenta[index].iva_detalle = ((this.dataCuenta[index].totalItems) * (this.buyProv.iva / 100)).toFixed(2);
        this.dataCuenta[index].subtotal_iva = this.dataCuenta[index].totalItems;
        break;
      case "0":
        this.dataCuenta[index].iva_detalle = (0.00).toFixed(2);
        this.dataCuenta[index].subtotal_cero = this.dataCuenta[index].totalItems;
        this.dataCuenta[index].subtotal_iva = (0.00).toFixed(2);
        this.dataCuenta[index].subtotal_noobjeto = (0.00).toFixed(2);
        this.dataCuenta[index].subtotal_excento = (0.00).toFixed(2);
        break;
      case "6":
        this.dataCuenta[index].iva_detalle = (0.00).toFixed(2);
        this.dataCuenta[index].subtotal_noobjeto = this.dataCuenta[index].totalItems;
        this.dataCuenta[index].subtotal_cero = (0.00).toFixed(2);
        this.dataCuenta[index].subtotal_iva = (0.00).toFixed(2);
        this.dataCuenta[index].subtotal_excento = (0.00).toFixed(2);
        break;
      case "7":
        this.dataCuenta[index].iva_detalle = (0.00).toFixed(2);
        this.dataCuenta[index].subtotal_excento = this.dataCuenta[index].totalItems;
        this.dataCuenta[index].subtotal_cero = (0.00).toFixed(2);
        this.dataCuenta[index].subtotal_iva = (0.00).toFixed(2);
        this.dataCuenta[index].subtotal_noobjeto = (0.00).toFixed(2);
        break;
      case "8":
        this.dataCuenta[index].iva_detalle = (this.dataCuenta[index].totalItems * (8 / 100)).toFixed(2);
        break;

    }
// console.log(this.dataCuenta[index].porce_ice)


    if (this.dataCuenta[index].porce_fte &&
      (this.dataCuenta[index].porce_fte > 0)) {
        console.log('Calculando IVA')
      await this.calculaImpuestoIva();
    }
    if (this.dataCuenta[index].porce_ice &&
      (this.dataCuenta[index].porce_ice > 0)) {
        console.log('Calculando ICE')
      await this.calculaIceSri();
    }

    console.log('Llamando a sumTotalizados')
    this.sumTotalizados();  // Totalizacion de Valores mostrados en la parte baja
    console.log('Genera asientos')
    this.generaPreviewAsientoContable();
    this.recalculateAfectacion();

  }

  sumTotalizados() {

    let subtotal = 0;
    let subcero = 0;
    let exento = 0;
    let objeto = 0;
    let valor_iva = 0;
    let descuento = 0;


    /* this.dataProducto.forEach(element => {


      switch (element.impuesto) {

        case "2":
        case "8":
          subtotal += parseFloat(element.totalItems);
          valor_iva += parseFloat(element.iva_detalle);
          break;
        case "0":
          subcero += parseFloat(element.totalItems);
          valor_iva += parseFloat(element.iva_detalle);
          break;
        case "6":
          objeto += parseFloat(element.totalItems);
          valor_iva += parseFloat(element.iva_detalle);
          break;
        case "7":
          exento += parseFloat(element.totalItems);
          valor_iva += parseFloat(element.iva_detalle);
          break;
        case "8":
          //subtotalNoObjeto += element.totalItems
          break;

      }

      descuento += parseFloat((element.desc) === null ? 0 : element.desc);

    }); */


console.log('sumTotalizados: Iterando dataCuenta, calculando los impuestos')
    this.dataCuenta.forEach(element => {


      switch (element.impuesto) {

        case "2":
        case "8":
          subtotal += parseFloat(element.totalItems);
          valor_iva += parseFloat(element.iva_detalle);
          break;
        case "0":
          subcero += parseFloat(element.totalItems);
          valor_iva += parseFloat(element.iva_detalle);
          break;
        case "6":
          objeto += parseFloat(element.totalItems);
          valor_iva += parseFloat(element.iva_detalle);
          break;
        case "7":
          exento += parseFloat(element.totalItems);
          valor_iva += parseFloat(element.iva_detalle);
          break;
        case "8":
          objeto += parseFloat(element.totalItems)
          break;

      }

      descuento += parseFloat((element.desc) === null ? 0 : element.desc);

    });

    // Iterar dataCuenta y asignar propercional
    console.log('sumTotalizados: Iterando dataCuenta, calculando proporcional')
    // Volver a cero los proporcionales
    this.dataCuenta.forEach((element: any) => Object.assign(element, {proporcional: undefined}))
    const lastIndex = this.dataCuenta.length - 1;
    this.dataCuenta.forEach((element: any, index: number) => {
      let proporcional = parseFloat(element.subtotalItems) / subtotal
      if (index == lastIndex) {
        const sumProporcional: number = this.dataCuenta.reduce((acc:number, curr: any) => {
          console.log(curr.proporcional)
          if (curr.proporcional !== undefined) return acc + parseFloat(curr.proporcional)
          return acc
        }, 0);
        console.log(sumProporcional)
        proporcional = 1 - sumProporcional;
      }
      console.log(element, proporcional)
      Object.assign(element, { proporcional })
    })

    // for (let i = 0; i < this.dataCuenta.length - 1; i++){
    //   const proporcional = parseFloat(this.dataCuenta[i].subtotalItems) / subtotal
    //   Object.assign(this.dataCuenta[i], { proporcional })

    // }
    // const sumSubtotalesItems: number = this.dataCuenta.reduce((acc:number, curr: any) => {
    //   if (curr.proporcional !== undefined) return acc + parseFloat(curr.proporcional)
    //   return acc
    // }, 0);
    // Object.assign(this.dataCuenta[this.dataCuenta.length - 1], { proporcional: 1 - sumSubtotalesItems })


    // this.dataCuenta.forEach(e => {
    //   let proporcionalLinea = 0
    //   proporcionalLinea = parseFloat(e.subtotalItems) / subtotal
    //   Object.assign(e, { proporcional: proporcionalLinea.toFixed(4)  })
    // })

    Object.assign(this.buyProv, { subtotal, valor_iva, subcero, exento, objeto, descuento })

    // this.buyProv.subtotal = subtotal;
    // this.buyProv.valor_iva = totalIva;
    // this.buyProv.subcero = subtotalcero;
    // this.buyProv.exento = subtotalExcento;
    // this.buyProv.objeto = subtotalNoObjeto;
    // this.buyProv.descuento = parseFloat(descuento.toFixed(2));


    this.buyProv.total =
      parseFloat
        (
          this.buyProv.subtotal +
          this.buyProv.subcero +
          this.buyProv.exento +
          this.buyProv.valor_iva +
          parseFloat(this.buyProv.propina) +
          parseFloat(this.buyProv.otro_impuesto)
        ).toFixed(2);

        console.log('Llamando sumaTotales desde sumTotalizados')
        this.sumaTotales(undefined,undefined,undefined);

  }

  calculaImpuesto() {
    // Dejamos los IVA, si es que existen
    this.detalleImpuesto = this.detalleImpuesto.filter((element: any) => element.tipo == 'IVA');

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
            console.log(element.totalItems)
            let base = element.totalItems;
            let retencion = parseFloat(base) * (parseFloat(element.porce_fte) / 100);

            element.retencion = retencion

            this.detalleImpuesto.push({
              base: parseFloat(parseFloat(base).toFixed(2)),
              porcentaje: element.porce_fte,
              total: parseFloat(retencion.toFixed(2)),
              tipo: 'FUENTE',
              rte_fuente: element.rte_fuente,
              codigo: element.cod_fte,
              codigo_anexo: element.cod_anexo_fte
            });
            console.log(this.detalleImpuesto)
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
              element.retencion = element.totalItems * (parseFloat(element.porce_fte) / 100);

              this.detalleImpuesto[contador - 1].total = parseFloat(retencion.toFixed(2));
              this.detalleImpuesto[contador - 1].base = parseFloat(base_update.toFixed(2));


            } else {

              let base = element.totalItems;
              let retencion = parseFloat(base) * (parseFloat(element.porce_fte) / 100);

              element.retencion = retencion

              this.detalleImpuesto.push({
                base: parseFloat(parseFloat(base).toFixed(2)),
                porcentaje: element.porce_fte,
                total: parseFloat(retencion.toFixed(2)),
                tipo: 'FUENTE',
                rte_fuente: element.rte_fuente,
                codigo: element.cod_fte,
                codigo_anexo: element.cod_anexo_fte
              });
            }
          }
        }
      });
      console.log('Llamando sumaTotales desde calculaImpuestos')
      this.sumaTotales(undefined,undefined,undefined);
  }
  calculaIceSriImp() {
    return new Promise((resolve, reject) => {

      this.detalleIceSri = [];

      this.dataCuenta.forEach(element => {

        if (element.codigo !== null) {

          if (this.detalleIceSri.length === 0) {
            console.log(element.totalItems)
            let base = element.totalItems;
            let iceSri = parseFloat(base) * (parseFloat(element.porce_ice) / 100);

            this.detalleIceSri.push({
              base: parseFloat(parseFloat(base).toFixed(2)),
              porcentaje: element.porce_ice,
              total: parseFloat(iceSri.toFixed(2)),
              tipo: 'ICE',
              codigo: element.cod_ice,
            });
            console.log(this.detalleIceSri)
          } else {

            //verificamos si existe registrado el codigo fuente
            let valida_ice = false;
            let contador = 0;

            this.detalleIceSri.forEach(impues => {

              if ((impues.cod_ice === element.cod_ice) && (impues.tipo === 'ICE')) {
                valida_ice = true;
              }

              contador++;

            })


            if (valida_ice) {

              let base = this.detalleIceSri[contador - 1].base;
              let base_update = base + element.totalItems;

              let iceSri = parseFloat(base_update) * (parseFloat(element.porce_ice) / 100);

              this.detalleIceSri[contador - 1].total = parseFloat(iceSri.toFixed(2));
              this.detalleIceSri[contador - 1].base = parseFloat(base_update.toFixed(2));


            } else {

              let base = element.totalItems;
              let iceSri = parseFloat(base) * (parseFloat(element.porce_ice) / 100);

              this.detalleIceSri.push({
                base: parseFloat(parseFloat(base).toFixed(2)),
                porcentaje: element.porce_ice,
                total: parseFloat(iceSri.toFixed(2)),
                tipo: 'ICE',
                codigo: element.cod_fte,
              });



            }

          }



        }
      });

      resolve(true);

    });
  }
  /*
  calculaImpuesto(dato_impu:any){

    this.detalleImpuesto = [];


    this.dataProducto.forEach(element => {

      if (element.fk_producto !== 0) {

        if (this.detalleImpuesto.length === 0) {

          let base = element.totalItems;
          let retencion = parseFloat(base) * (parseFloat(element.porce_fte) / 100);

          this.detalleImpuesto.push({
            base: base, porcentaje: element.porce_fte, total: parseFloat(retencion.toFixed(2)), tipo: 'FUENTE', rte_fuente: element.rte_fuente, codigo: element.cod_fte, codigo_anexo: element.cod_anexo_fte
          });

        } else {

          //verificamos si existe registrado el codigo fuente
          let valida_impuesto = false;
          let contador = 0;

          this.detalleImpuesto.forEach(impues => {
            console.log(impues);

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
              base: base, porcentaje: element.porce_fte, total: parseFloat(retencion.toFixed(2)), tipo: 'FUENTE', rte_fuente: element.rte_fuente, codigo: element.cod_fte, codigo_anexo: element.cod_anexo_fte
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
            base: base, porcentaje: element.porce_fte, total: parseFloat(retencion.toFixed(2)), tipo: 'FUENTE', rte_fuente: element.rte_fuente, codigo: element.cod_fte, codigo_anexo: element.cod_anexo_fte
          });

        } else {

          //verificamos si existe registrado el codigo fuente
          let valida_impuesto = false;
          let contador = 0;

          this.detalleImpuesto.forEach(impues => {

            if ((impues.rte_fuente === element.rte_fuente)  && (impues.tipo === 'FUENTE')) {
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
              base: base, porcentaje: element.porce_fte, total: parseFloat(retencion.toFixed(2)), tipo: 'FUENTE', rte_fuente: element.rte_fuente, codigo: element.cod_fte, codigo_anexo: element.cod_anexo_fte
            });

          }

        }

      }
    });
  }
  */

  async calculaImpuestoIva() {
  console.log(this.dataCuenta)
    this.detalleImpuesto = this.detalleImpuesto.filter((element: any) => element.tipo == 'FUENTE');

    // await this.calculaImpuesto().then(rsp => {

      /*Recorremos kos detalles para calcular la tabla de impuestos*/
      this.dataProducto.forEach(element => {

        if (element.fk_producto !== 0) {

          if (this.detalleImpuesto.length === 0) {

            if (parseFloat(element.porce_iva) > 0) {

              let base = element.iva_detalle;
              let retencion = parseFloat(base) * (parseFloat(element.porce_iva) / 100);

              this.detalleImpuesto.push({
                base: base,
                porcentaje: element.porce_iva,
                total: parseFloat(retencion.toFixed(2)),
                tipo: 'IVA',
                rte_fuente: element.rte_iva,
                codigo: element.cod_iva,
                codigo_anexo: element.cod_anexo_iva
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
                  base: base,
                  porcentaje: element.porce_iva,
                  total: parseFloat(retencion.toFixed(2)),
                  tipo: 'IVA',
                  rte_fuente: element.rte_iva,
                  codigo: element.cod_iva,
                  codigo_anexo: element.cod_anexo_iva
                });
              }

            }


          }
        }

      });


      /* recorremos los detalles de cuenta */
      this.dataCuenta.forEach(element => {
        console.log(element)

        if (element.codigo !== null) {

          if (this.detalleImpuesto.length === 0) {

            if (parseFloat(element.porce_iva) > 0) {

              let base = element.iva_detalle;
              let retencion = parseFloat(base) * (parseFloat(element.porce_iva) / 100);

              element.retencion_iva = retencion

              this.detalleImpuesto.push({
                base: base,
                porcentaje: element.porce_iva,
                total: parseFloat(retencion.toFixed(2)),
                tipo: 'IVA',
                rte_fuente: element.rte_iva,
                codigo: element.cod_iva,
                codigo_anexo: element.cod_anexo_iva
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
                element.retencion_iva = parseFloat(element.iva_detalle) * (parseFloat(element.porce_iva) / 100);

                this.detalleImpuesto[contador - 1].total = parseFloat(retencion.toFixed(2));
                this.detalleImpuesto[contador - 1].base = parseFloat(base_update.toFixed(2));
              }

            } else {

              if (parseFloat(element.porce_iva) > 0) {

                let base = element.iva_detalle;
                let retencion = parseFloat(base) * (parseFloat(element.porce_iva) / 100);

                element.retencion_iva = retencion

                this.detalleImpuesto.push({
                  base: base, porcentaje:
                  element.porce_iva,
                  total: parseFloat(retencion.toFixed(2)),
                  tipo: 'IVA',
                  rte_fuente: element.rte_iva,
                  codigo: element.cod_iva,
                  codigo_anexo: element.cod_anexo_iva
                });
              }

            }

          }

        }
      });
      console.log('Llamando sumaTotales desde calculaImpuestoIVA')
      this.sumaTotales(undefined,undefined,undefined);



    // });

  }
  async calculaIceSri() {
    console.log(this.dataCuenta)
      this.detalleIceSri = [];

      await this.calculaIceSriImp().then(rsp => {


        /* recorremos los detalles de cuenta */
        this.dataCuenta.forEach(element => {
          console.log(element)

          if (element.codigo !== null) {

            if (this.detalleIceSri.length === 0) {

              if (parseFloat(element.porce_ice) > 0) {

                let base = element.ice_detalle;
                let iceSri = parseFloat(base) * (parseFloat(element.porce_ice) / 100);

                this.detalleIceSri.push({
                  base: base, porcentaje: element.porce_ice, total: parseFloat(iceSri.toFixed(2)), tipo: 'ICE', codigo: element.cod_ice
                });
              }

            } else {

              //verificamos si existe registrado el codigo fuente
              let valida_ice = false;
              let contador = 0;

              this.detalleIceSri.forEach(impues => {

                if ((impues.cod_ice === element.cod_ice) && (impues.tipo === 'ICE')) {
                  valida_ice = true;
                }

                contador++;

              })


              if (valida_ice) {

                if (parseFloat(element.porce_ice) > 0) {

                  let base = this.detalleIceSri[contador - 1].base;
                  let base_update = parseFloat(base) + parseFloat(element.ice_detalle);

                  let iceSri = base_update * (parseFloat(element.porce_ice) / 100);

                  this.detalleIceSri[contador - 1].total = parseFloat(iceSri.toFixed(2));
                  this.detalleIceSri[contador - 1].base = parseFloat(base_update.toFixed(2));
                }

              } else {

                if (parseFloat(element.porce_ice) > 0) {

                  let base = element.ice_detalle;
                  let iceSri = parseFloat(base) * (parseFloat(element.porce_iva) / 100);

                  this.detalleIceSri.push({
                    base: base, porcentaje: element.porce_ice, total: parseFloat(iceSri.toFixed(2)), tipo: 'ICE', codigo: element.cod_ice
                  });
                }

              }

            }

          }
        });
        console.log('Llamando sumaTotales desde calculaIceSri')
          this.sumaTotales(undefined,undefined,undefined)




      });

    }

  sumaTotales(event: any,tipo,index){
    console.log(event);
    let pagoTotalRet = 0;
    let pagoTotalAnt = 0;
    let pagoTotalMul = 0;


    this.detalleImpuesto.forEach(e => {
      pagoTotalRet += +e.total;
    });

    this.ListaAnticipos.forEach((value, index2) => {
      if(event != undefined || event != null  && tipo != undefined  && index != undefined){
        if(tipo=='ANT' && index==index2){
          if(parseFloat(event) > parseFloat(value.saldo)){
            this.toastr.info('El valor aplicado no puede ser mayor al saldo del anticipo ')
          }
        }
      }

      pagoTotalAnt += +value.valor_aplicado;
    });
    this.ListaMultas.forEach((value, index2) => {
      if(event != undefined || event != null  && tipo != undefined  && index != undefined){
        if(tipo=='MUL' && index==index2){
          if(parseFloat(event) > parseFloat(value.saldo) ){
            this.toastr.info('El valor aplicado no puede ser mayor al saldo de la multa ')
          }
        }
      }
      pagoTotalMul += +value.valor_aplicado;
    });

    this.buyProv.total_retencion = pagoTotalRet;
    this.buyProv.total_anticipo = pagoTotalAnt;
    this.buyProv.total_multa = pagoTotalMul;
    this.totalPagar = this.buyProv.total - this.buyProv.total_retencion - this.buyProv.total_anticipo - this.buyProv.total_multa
    this.buyProv.saldo = this.totalPagar;

    if(this.ListaAnticipos.length > 0 && this.buyProv.total_anticipo > 0){

          //Iterar dataCuenta y asignar propercional
      /* let i = 0;
      for (i; i < this.dataCuenta.length - 1; i++){
        const valor_ant = this.dataCuenta[i].proporcional * parseFloat(this.buyProv.total_anticipo)
        Object.assign(this.dataCuenta[i], { valor_anticipo: valor_ant })

      }

      const sumAnticipos: number = this.dataCuenta.reduce((acc:number, curr: any) => {
      if (curr.valor_anticipo !== undefined || curr.valor_anticipo !== null) return acc + parseFloat(curr.valor_anticipo)
        return acc
      }, 0);
      const valor_ant = parseFloat(this.buyProv.total_anticipo) - sumAnticipos
      Object.assign(this.dataCuenta[i], { valor_anticipo: valor_ant }) */

      console.log(this.dataAnticipos)
      const l = this.dataCuenta.length - 1;
      this.dataCuenta.forEach((element: any) => Object.assign(element, {valor_ant: undefined}))
      this.dataCuenta.forEach((e: any, index: number) => {
        let proporcional = 0
        let valor_ant = 0
        let cod_cuenta_ant = ''
        let cuenta_ant = ''


        if(this.buyProv.subtotal > 0 && e.subtotalItems > 0){
          proporcional = parseFloat(e.subtotalItems) / parseFloat(this.buyProv.subtotal)
          valor_ant = proporcional * parseFloat(this.buyProv.total_anticipo)
        }
        if(this.dataAnticipos.length > 0){
          cod_cuenta_ant = this.dataAnticipos[0].codigo
          cuenta_ant = this.dataAnticipos[0].nombre
        }

        if (index == l) {
          const sumAnticipos: number = this.dataCuenta.reduce((acc:number, curr: any) => {
            console.log(curr.valor_anticipo)
            if (curr.valor_anticipo !== undefined) return acc + parseFloat(curr.valor_anticipo)
            return acc
          }, 0);
          console.log( parseFloat(this.buyProv.total_anticipo), sumAnticipos, parseFloat(this.buyProv.total_anticipo) - sumAnticipos)
          // valor_ant = parseFloat(this.buyProv.total_anticipo) - sumAnticipos
          // Object.assign(e , {cod_cuenta_anticipo: cod_cuenta_ant, cuenta_anticipo: cuenta_ant,valor_anticipo: valor_ant,proporcional: proporcional})
        }

        Object.assign(e , {cod_cuenta_anticipo: cod_cuenta_ant, cuenta_anticipo: cuenta_ant,valor_anticipo: valor_ant})

      })
    }


    if(this.ListaMultas.length > 0 && this.buyProv.total_multa > 0){
      console.log(this.dataMultas)
      const l = this.dataCuenta.length - 1;
      this.dataCuenta.forEach((element: any) => Object.assign(element, {valor_mu: undefined}))
      this.dataCuenta.forEach((e: any, index: number) => {
        let proporcional = 0
        let valor_mu = 0
        let cod_cuenta_mu = ''
        let cuenta_mu = ''
        // if(e.subtotalItems > 0){
        //   proporcional = parseFloat(e.subtotalItems) / parseFloat(this.buyProv.subtotal)
        //   valor_mu = proporcional * parseFloat(this.buyProv.total_multa)
        // }

        if(this.buyProv.subtotal > 0 && e.subtotalItems > 0){
          proporcional = parseFloat(e.subtotalItems) / parseFloat(this.buyProv.subtotal)
          valor_mu = proporcional * parseFloat(this.buyProv.total_multa)
      }
        if(this.dataMultas.length > 0){
          cod_cuenta_mu = this.dataMultas[0].codigo
          cuenta_mu = this.dataMultas[0].nombre
        }
        console.log(index , l)
        if (index == l) {
          const sumMultas: number = this.dataCuenta.reduce((acc:number, curr: any) => {
            console.log(curr.valor_multa)
            if (curr.valor_multa !== undefined) return acc + parseFloat(curr.valor_multa)
            return acc
          }, 0);
          console.log( parseFloat(this.buyProv.total_multa), sumMultas, parseFloat(this.buyProv.total_multa) - sumMultas)
          //valor_mu = parseFloat(this.buyProv.total_multa) - sumMultas
          //valor_mu = parseFloat(this.buyProv.total_anticipo) - sumMultas

          // Object.assign(e , {cod_cuenta_anticipo: cod_cuenta_ant, cuenta_anticipo: cuenta_ant,valor_anticipo: valor_ant,proporcional: proporcional})
        }

        Object.assign(e , {cod_cuenta_multa: cod_cuenta_mu, cuenta_multa: cuenta_mu,valor_multa: valor_mu})

      })
    }

  }


  async ChangeFuente(event: any, dataelement, index) {

    console.log(event, dataelement, index);

    let ComboCuentaRteFeunte = [];

    if (typeof event.cuenta != 'undefined' && event.cuenta) {

      ComboCuentaRteFeunte.push(
        {
          tipo:'INVERSIÓN',
          cuenta: event.cuenta,
          descripcion:event.descripcion_cuenta
        }
      );

    }


    if (typeof event.cuenta_contable_corriente != 'undefined' && event.cuenta_contable_corriente) {

      ComboCuentaRteFeunte.push(
        {
          tipo:'CORRIENTE',
          cuenta: event.cuenta_contable_corriente,
          descripcion:event.cuenta_contable_corriente_desc
        }
      );

    }


    if (typeof event.cuenta_contable_produccion != 'undefined' && event.cuenta_contable_produccion) {

      ComboCuentaRteFeunte.push(
        {
          tipo:'PRODUCCIÓN',
          cuenta: event.cuenta_contable_produccion,
          descripcion:event.cuenta_contable_produccion_desc
        }
      );

    }

    if (this.rete_fuente_acount == undefined) this.rete_fuente_acount  = ComboCuentaRteFeunte;
    dataelement[index].porce_fte = event.porcentaje_fte;
    dataelement[index].cod_fte = event.codigo_fte_sri;
    dataelement[index].cod_anexo_fte = event.codigo_anexo_sri;
    // await this.calculaImpuestoIva();
    this.calculaImpuesto()
    this.generaPreviewAsientoContable();

  }


  ChangeFuenteCuenta(datosCuenta:any, infoDetails:any, index){
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Calculando'
    console.log(datosCuenta);
    infoDetails[index]['cod_cuenta_impuesto_rtefte'] = datosCuenta.cuenta;
    infoDetails[index]['cuenta_impuesto_rtefte'] = datosCuenta.descripcion;
    this.calculaImpuesto()
    this.lcargando.ctlSpinner(false)
    this.generaPreviewAsientoContable();

  }

  async ChangeImpuestoIva(event: any, dataelement, index) {
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Calculando'
    console.log(event);
    dataelement[index].porce_iva = event.porcentaje_rte_iva;
    dataelement[index].cod_iva = event.codigo_sri_iva;
    dataelement[index].cod_anexo_iva = event.codigo_sri_iva;
    dataelement[index].cod_cuenta_impuesto_iva = event.codigo;
    dataelement[index].nombre_cuenta_impuesto_iva = event.cuenta_nombre;
    this.calculaImpuestoIva();
    this.lcargando.ctlSpinner(false)
    this.generaPreviewAsientoContable();


  }
  ChangeIceSri(event: any, dataelement, index) {
   console.log(event);
   console.log(dataelement[index].precio)
   console.log(event.porcentaje)
   console.log(event.precio * event.porcentaje)
    dataelement[index].porce_ice = event.porcentaje;
    dataelement[index].cod_ice = event.codigo;
    dataelement[index].ice_detalle = dataelement[index].subtotalItems * event.porcentaje.toFixed(2) / 100

    this.calculaTotalIceSri();
    this.sumTotalizados();
    this.generaPreviewAsientoContable();

  }
  calculaTotalIceSri(){
    let totalIce=0
    this.dataCuenta.forEach(e =>{
      if(e.ice_detalle > 0){
        totalIce += +e.ice_detalle
      }
    })
    this.buyProv.otro_impuesto = totalIce

  }


  CambioImpuesto(i) {

    if (this.dataProducto[i].impuesto === "2") {

      this.rte_iva = [];
      this.dataProducto[i].rte_iva = 0;
      this.dataProducto[i].isRetencionIva = false;

    } else {

      this.rte_iva = [{
        codigo: "",
        codigo_sri_iva: 20,
        descripcion_tipo_servicio: "SIN RETENCION DE IVA",
        porcentaje_rte_iva: "0"
      }];

      this.dataProducto[i].rte_iva = 20;
      this.dataProducto[i].isRetencionIva = true;

    }

    this.sumRegistroDetalle(i)

  }

  CambioImpuestoCuenta(i) {

    if (this.dataCuenta[i].impuesto === "2") {

      this.rte_iva = [];
      this.dataCuenta[i].rte_iva = 0;
      this.dataCuenta[i].isRetencionIva = false;

    } else {

      this.rte_iva = [{
        codigo: "",
        codigo_sri_iva: 20,
        descripcion_tipo_servicio: "SIN RETENCION DE IVA",
        porcentaje_rte_iva: "0"
      }];

      this.dataCuenta[i].rte_iva = 20;
      this.dataCuenta[i].isRetencionIva = true;

    }

    this.sumRegistroDetalleCuenta(i)
    //this.generaPreviewAsientoContable();

  }
  CambioIceSriCuenta(i) {
  console.log( this.dataCuenta[i].porce_ice)
  }

  getDataProduct(producto: any, index) {


    let filt = producto["data"];


    let validt = false;
    this.dataProducto.forEach(element => {
      if (element.codigo == filt.codigo) { validt = true; }
    });

    if (validt) {
      Swal.fire(
        'Atención!',
        'Este producto ya se encuenta en la lista ingresada!',
        'error'
      )
      this.dataProducto[index]['fk_producto'] = 0;
    } else {

      //debugger;
      this.dataProducto[index].codigo = filt.codigo;
      this.dataProducto[index].nombre = filt.nombre;
      this.dataProducto[index].InputDisabledCantidad = false;

      this.dataProducto[index].fk_producto = filt.id;// filt.nombre + "(" + filt.codigo + ")";

      $('#cantidad_' + index).focus();

    }

  }

  addItems() {

    let validaAddDetalle = true;
    let mensaje = '';

    if (this.permisions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {

      /*Verificamos si algun detalle anterior no se encuentra vacio */

      this.dataProducto.forEach(element => {

        if (element.codigo == null || element.codigo == '' || element.codigo == 0) {
          validaAddDetalle = false;
          mensaje = 'El detalle actual no tiene asignado un codigo de producto';
          return false;
        }

        if (element.cantidad == null || element.cantidad == '' || element.cantidad == 0) {
          validaAddDetalle = false;
          mensaje = 'El cantidad del detalle actual no puede ser 0';
          return false;
        }

        if (element.rte_fuente == null || element.rte_fuente == '' || element.rte_fuente == 0) {
          validaAddDetalle = false;
          mensaje = 'Es necesario asignar un codigo retención fuente al detalle actual.';
          return false;
        }

      });

      if (validaAddDetalle) {
        let items = { cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false,LoadOpcionIceSri: false, LoadOpcionCentro: false, subtotal_noobjeto: 0.00, subtotal_excento: 0.00, subtotal_cero: 0.00, subtotal_iva: 0.00, InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2),ice_detalle: (0.00).toFixed(2), fk_producto: 0, impuesto: "2", rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 };
        this.dataProducto.push(items);
      } else {
        this.toastr.info(mensaje);
      }


    }
  }

  addCuentas() {

    let validaAddDetalle = true;
    let mensaje = '';

    if (this.permisions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {

      /*Verificamos si algun detalle anterior no se encuentra vacio */

      this.dataCuenta.forEach(element => {

        if (element.codigo == null || element.codigo == '' || element.codigo == 0) {
          validaAddDetalle = false;
          mensaje = 'El detalle actual no tiene asignado un codigo de producto';
          return false;
        }

        if (element.cantidad == null || element.cantidad == '' || element.cantidad == 0) {
          validaAddDetalle = false;
          mensaje = 'El cantidad del detalle actual no puede ser 0';
          return false;
        }

        if (element.rte_fuente == null || element.rte_fuente == '' || element.rte_fuente == 0) {
          validaAddDetalle = false;
          mensaje = 'Es necesario asignar un codigo retención fuente al detalle actual.';
          return false;
        }

      });

      if (validaAddDetalle) {
        let cuentas = { cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false,LoadOpcionIceSri: false, LoadOpcionCentro: false, subtotal_noobjeto: 0.00, subtotal_excento: 0.00, subtotal_cero: 0.00, subtotal_iva: 0.00, InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2),ice_detalle:(0.00).toFixed(2),  fk_producto: 0, impuesto: "2", rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 };
        this.dataCuenta.push(cuentas);

      } else {
        this.toastr.info(mensaje);
      }


   }
  }

  cancel() {


this.lastRecord = null
    this.busqueda= false
    this.flagBtnDired = false;
    this.buyProv = { CodacountMulta: '', acountMulta: '', motivo_multa: '', multa: (0.00).toFixed(2),  num_contrato: '', tipo_documento: '7', sustento: '01', proveedor_name: '', anio: 2022, mes: 9, identificacion_proveedor: '', tipo_identificacion: '01', fk_id_proveedor: 0, subtotal: (0.00).toFixed(2), subcero: (0.00).toFixed(2), objeto: (0.00).toFixed(2), exento: (0.00).toFixed(2), descuento: (0.00).toFixed(2), propina: (0.00).toFixed(2), otro_impuesto: (0.00).toFixed(2), servicio: (0.00).toFixed(2), valor_iva: (0.00).toFixed(2), total: (0.00).toFixed(2), tipo_pago: 0, forma_pago: 0, fk_usuario_receive: 0, isActive: this.estados[0],metodo_pago:0 ,  total_retencion: (0.00).toFixed(2),total_anticipo: (0.00).toFixed(2),total_multa: (0.00).toFixed(2), idp:''}

    this.buyProv.anio = moment().format('YYYY');
    this.buyProv.mes = Number(moment().format('MM'));

    this.dataCuenta = [{ cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_ice: "", porce_ice: 0,cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false,LoadOpcionIceSri: false, LoadOpcionCentro: false, subtotal_noobjeto: (0.00).toFixed(2), subtotal_excento: (0.00).toFixed(2), subtotal_cero: (0.00).toFixed(2), subtotal_iva: (0.00).toFixed(2), InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2),ice_detalle: (0.00).toFixed(2), cuenta_detalle: 0, impuesto: 2, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1, cod_cuenta_por_pagar: '', cuenta_por_pagar: '', codigo_partida: '', valor_anticipo: 0.00,cod_cuenta_anticipo: '',cuenta_anticipo:'', valor_multa: 0.00, cod_cuenta_multa: '',cuenta_multa:'',proporcional:0}];
    this.dataProducto = [{ cod_anexo_iva: "", cod_iva: "", porce_iva: 0,cod_ice: "", porce_ice: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false,LoadOpcionIceSri: false, LoadOpcionCentro: false, subtotal_noobjeto: 0.00, subtotal_excento: 0.00, subtotal_cero: 0.00, subtotal_iva: 0.00, InputDisabledCantidad: true, iva_detalle: 0, ice_detalle: 0, fk_producto: 0, impuesto: 2, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: null, subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 }];


    this.fieldsDaily = [];
    this.ListaAnticipos = [];
    this.ListaMultas = [];
    this.ListaItems = [];
    this.tbl_partidas = [];
    this.totalPartidas = 0

    this.arrayAnticipos = [];
    this.arrayMultas= [];
    this.fieldsDaily.push({ LoadOpcionCatalogoPresupuesto: false, presupuesto: '', codpresupuesto: '', valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2) }, { LoadOpcionCatalogoPresupuesto: false, presupuesto: '', codpresupuesto: '', valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2) });

    this.dataHistorial = [];
    this.ExisteHistorial = false

    this.isAsignaMulta = false;
    this.isPouchesShared = false;
    this.isAsignaOrden = false;
    this.isAsignaMetodo = false;
    this.isAsignaFecha = false;

    this.buyProv.fk_doc = 3;

    this.detalleImpuesto = [];
    this.detalleIceSri = [];

    this.buyProv.iva = this.ivaAux;
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[6].habilitar = true;
    this.vmButtons[8].habilitar = true;

    this.buyProv.tipo_documento = '7'
    this.buyProv.forma_pago = '01-EFECTIVO'
    this.buyProv.tipo_pago = 'Contado'
    this.buyProv.sustento = '01'
    this.dataProducto[0].impuesto = '2'
    this.dataCuenta[0].impuesto = '2'
    this.orden = 'N'
    this.tiene_metodo_pago = 'N'
    this.tiene_fecha_limite = 'N'
    this.fecha_limite = undefined
    this.mostrarFechaLimite = true
    this.mostrarMetodos = true
    this.totalRetencion = 0;
    this.totalPagar = 0;
    this.ExistenItems = true;
    this.ExistenAnticipos = true;

    this.num_retencion = undefined
    this.id_retencion = undefined
    this.retencionIsActive = false

    this.ingresoSelected = null
  }
  asignarValores(event, i) {
    const opcionSeleccionada = event;
  const opcion = this.codigos_partidas_idp.find(op => op.codigopartida === opcionSeleccionada);
  if (opcion) {
    this.dataCuenta[i].proyecto = opcion.proyecto;
    this.dataCuenta[i].orientacion = opcion.orientacion;
    this.dataCuenta[i].geografico = opcion.geografico;
    this.dataCuenta[i].actividad = opcion.actividad;
    this.dataCuenta[i].funcion = opcion.funcion;
    this.dataCuenta[i].fk_programa = opcion.fk_programa;
  }

  }
  setNumCuotas() {


    if (parseFloat(this.buyProv.total.toString()) > 0) {

      this.ref = this.dialogService.open(DiferedBuyProvComponent, {
        data: {
          ammount: parseFloat(this.buyProv.total.toString()),
          diferedEdit: this.dataDifered,
          edit: this.vmButtons[1].habilitar
        },
        header: 'Diferir Cuotas',
        width: '40%',
        contentStyle: { "max-height": "500px", "overflow": "auto" },
        baseZIndex: 10000
      });

      this.ref.onClose.subscribe((cuotas: any) => {

        if (cuotas) {
          this.dataDifered = cuotas;
        }


      });

    } else {
      this.toastr.info('Debe registrar valores de compra mayores a 0.00 para poder aplicar registro de cuotas')
    }


    /*const modalInvoice = this.modalService.open(DiferedBuyProvComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.diferedEdit = this.dataDifered;
    modalInvoice.componentInstance.ammount = parseFloat(this.buyProv.total.toString());
    modalInvoice.componentInstance.edit = this.vmButtons[1].habilitar;*/
  }

  async validateSaveBuyProv() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
      return
    } // else {

    // Variable para almacenar el resultado
    let resultado = {};

    // Recorrer tbl_partidas
    this.tbl_partidas.forEach(partida => {
        // Inicializar la suma para este código
        resultado[partida.codigo] = 0;

        // Filtrar fieldsDaily por código y tipo_detalle diferente a "ANTICIPO", "MULTA", "ANTCXP" o "MUCXP"
        let filteredFields = this.fieldsDaily.filter(field => field.codpresupuesto === partida.codigo && !["ANTICIPO", "MULTA", "ANTCXP", "MUCXP"].includes(field.tipo_detalle));

        // Sumar valor_presupuesto de los elementos filtrados y añadir al resultado
        filteredFields.forEach(field => {
            resultado[partida.codigo] += parseFloat(field.valor_presupuesto);
        });
    });

    // Verificar si los totales calculados son iguales a los valores de tbl_partidas

    let coinciden = true;
    this.tbl_partidas.forEach(partida => {


        if (resultado[partida.codigo] !== partida.valor) {
            coinciden = false;
            return;
        }
    });

  // console.log(coinciden);
  // if (!coinciden){
  // this.toastr.info("Valores no coinciden por favor de click en generar asientos");
  // return;
  // }

  console.log(coinciden);
  if (!coinciden){
      this.validateDataGlobal().then(async () => {
        const totalizado = this.fieldsDaily.find((element: any) => element.tipo == 'T')
        if (Math.floor(totalizado['credit'] * 100)!= Math.floor(totalizado['debit'] * 100)) {
          const result = await Swal.fire({
            titleText: 'Atención!',
            text: 'Los asientos no cuadran. Esta seguro/a de continuar?',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Continuar'
          })

          if (result.isConfirmed) {
            //this.saveButProv()
            this.confirmSave("Seguro desea guardar la compra de proveeduria?", "SAVE_PROVEEDURIA");
            //return
          }
        }

      }).catch((err) => {
        console.log(err);
        this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
      });
  }else{
    this.validateDataGlobal().then(async () => {
      this.confirmSave("Seguro desea guardar la compra de proveeduria?", "SAVE_PROVEEDURIA");
    }).catch((err) => {
      console.log(err);
      this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
    });
  }


    // this.validateDataGlobal().then(async () => {
    //     const totalizado = this.fieldsDaily.find((element: any) => element.tipo == 'T')
    //     if (Math.floor(totalizado['credit'] * 100)!= Math.floor(totalizado['debit'] * 100)) {
    //       const result = await Swal.fire({
    //         titleText: 'Atención!',
    //         text: 'Los asientos no cuadran. Esta seguro/a de continuar?',
    //         showCancelButton: true,
    //         cancelButtonText: 'Cancelar',
    //         confirmButtonText: 'Continuar'
    //       })

    //       if (result.isConfirmed) {
    //         this.saveButProv()
    //         return
    //       }
    //     }

    //     this.confirmSave("Seguro desea guardar la compra de proveeduria?", "SAVE_PROVEEDURIA");

    // }).catch((err) => {
    //   console.log(err);
    //   this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
    // });

 // this.toastr.info("Valores no coinciden por favor de click en generar asientos");
 /* this.saveButProv() }*/




    // }
  }

  async confirmSave(message, action) {
    // Swal.fire({
    //   title: "Atención!!",
    //   text: message,
    //   //icon: "warning",
    //   showCancelButton: true,
    //   cancelButtonColor: '#DC3545',
    //   confirmButtonColor: '#13A1EA',
    //   confirmButtonText: "Aceptar"
    // }).then((result) => {
    //   if (result.value) {
    //     if (action == "SAVE_PROVEEDURIA") {
    //       this.saveButProv();
    //     } else if (action == "UPDATED_PROV") {
    //       this.updatedProv();
    //     }
    //   }
    // })
    Swal.fire({
      title: "Atención!!",
      text: message,
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      this.processing = false;
      if (result.value) {
        if (action == "SAVE_PROVEEDURIA") {
          this.saveButProv();
        } else if (action == "UPDATED_PROV") {
          this.updatedProv();
        }
      }
    })
  }

  updatedProv() {

    this.lcargando.ctlSpinner(true);
    let info;
    if (this.buyProv.tipo_pago == "Contado") {
      let objCoutas = {};
      objCoutas['Num_cuota'] = 1;
      objCoutas['monto_cuota'] = this.buyProv.total;
      objCoutas['fecha_vencimiento'] = this.fecha_compra;
      let arrCoutas = [];
      arrCoutas.push(objCoutas);
      info = {
        amount: this.buyProv.saldo,
        cuotas: 1,
        difered: arrCoutas
      }
    }
    if (this.buyProv.isactive == 0) { this.buyProv['fecha_anulacion'] = moment(this.fecha).format('YYYY-MM-DD') }
    this.buyProv['detalle'] = this.dataProducto;
    this.buyProv['fk_usuario_trans'] = this.dataUser.id_usuario;
    this.buyProv['fecha_compra'] = this.fecha_compra;
    this.buyProv['type_difered'] = (this.buyProv.tipo_pago == "Contado") ? info : this.dataDifered;
    this.buyProv['ip'] = this.commonServices.getIpAddress();
    this.buyProv['id_controlador'] = myVarGlobals.fProveeduriaCompras
    this.buyProv['accion'] = `Actualización de proveeduria con número de documento ${this.buyProv['num_doc']} ${this.buyProv['observacion']}`;
    this.buyProv['ruc'] = this.proveedor != undefined ? this.proveedor.num_documento : null;

    this.comSrv.updatedBuyProv(this.buyProv).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  saveButProv() {

    (this as any).mensajeSpinner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);
    let data = {
      "anio": Number(moment(this.fecha_compra).format('YYYY')),
      "mes": Number(moment(this.fecha_compra).format('MM'))
    }
      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

      /* Validamos si el periodo se encuentra aperturado */
      if (res["data"][0].estado !== 'C') {

        (this as any).mensajeSpinner = "Cargando..";
        this.lcargando.ctlSpinner(true);

        let info;

        if (this.buyProv.tipo_pago == "Contado") {
          let objCoutas = {};
          objCoutas['Num_cuota'] = 1;
          objCoutas['monto_cuota'] = this.buyProv.saldo;
          objCoutas['fecha_vencimiento'] = this.pipe.transform(this.fecha_compra, 'yyyy-MM-dd');
          let arrCoutas = [];
          arrCoutas.push(objCoutas);
          info = {
            amount: this.buyProv.saldo,
            cuotas: 1,
            difered: arrCoutas
          }
        }
        if (this.buyProv.isactive == 0) {
          this.buyProv['fecha_anulacion'] = moment(this.fecha).format('YYYY-MM-DD');
        }


        /*obtenemos detalle de asiento */

        let dataDocument = { company_id: this.dataUser.id_empresa, doc_type: "COM" };
        this.diarioSrv.getCompanyInformation(dataDocument).subscribe(resDocument => {

          const detailAsiento = this.fieldsDaily.filter(asiento => asiento.tipo !== "T");
          const dataAsientoSave = {
            ip: this.commonServices.getIpAddress(),
            accion: `Registro de comprobante No. ${resDocument["data"].secuencia}`,
            id_controlador: myVarGlobals.fComDiario,
            id_company: this.dataUser.id_empresa,
            date: this.pipe.transform(this.fecha_compra, 'yyyy-MM-dd'),
            doc_id: resDocument["data"].id,
            doc_num: resDocument["data"].secuencia,
            doc_type: resDocument["data"].codigo,
            concept: 'Registro de asiento de compra # ' + this.buyProv.num_doc,
            note: 'Registro de asiento de compra # ' + this.buyProv.num_doc,
            details: detailAsiento,
            total: this.buyProv.total,
            total_pagar: this.totalPagar,
            tipo_registro: "Factura Proveedor"
          }
          this.arrayAnticipos= [];// en caso de que el nom_doc se repita
          this.arrayMultas= [];// en caso de que el nom_doc se repita
          if(this.ListaAnticipos.length > 0){
            this.ListaAnticipos.forEach(e => {
              if(e.valor_aplicado > 0){
                let anticipos = {
                  id_documento: e.id_documento,
                  documento: e.documento,
                  tipo_documento:e.tipo_documento,
                  fecha:e.fecha,
                  total:e.total,
                  saldo:e.saldo,
                  valor_aplicado:e.valor_aplicado,
                  cod_cuenta_anticipo:e.orden_pago?.detalles[0].cuentas?.codigo,
                  nom_cuenta_anticipo:e.orden_pago?.detalles[0].cuentas?.nombre,
                  cod_cuenta_por_pagar_anticipo:e.cuenta_por_pagar.codigo,
                  nom_cuenta_por_pagar_anticipo:e.cuenta_por_pagar.nombre,

                }
                this.arrayAnticipos.push(anticipos);
              }
            })
          }else{
            this.buyProv['anticipos'] = [];
          }
          if(this.ListaMultas.length > 0){
            this.ListaMultas.forEach(e => {
              if(e.valor_aplicado > 0){
                let multas = {
                  id_documento: e.id_documento,
                  documento: e.documento,
                  tipo_documento:e.tipo_documento,
                  fecha:e.fecha,
                  total:e.total,
                  saldo:e.saldo,
                  valor_aplicado:parseFloat(e.valor_aplicado),
                  cod_cuenta_multa:e.cuenta_contable?.codigo,
                  nom_cuenta_multa:e.cuenta_contable?.nombre,
                  cod_cuenta_por_pagar_multa:e.cuenta_por_pagar.codigo,
                  nom_cuenta_por_pagar_multa:e.cuenta_por_pagar.nombre,
                }
                this.arrayMultas.push(multas);
              }
            })
          }else{
            this.buyProv['multas'] = [];
          }

          this.buyProv['detalle'] = this.dataProducto;
          this.buyProv['detalle_cuenta'] = this.dataCuenta;
          this.buyProv['impuestos'] = this.detalleImpuesto;
          this.buyProv['anticipos'] = this.arrayAnticipos;
          this.buyProv['multas'] = this.arrayMultas;
          this.buyProv['fk_usuario_trans'] = this.dataUser.id_usuario;
          this.buyProv['fecha_compra'] = this.pipe.transform(this.fecha_compra, 'yyyy-MM-dd');
          this.buyProv['type_difered'] = (this.buyProv.tipo_pago == "Contado") ? info : this.dataDifered;
          this.buyProv['ip'] = this.commonServices.getIpAddress();
          this.buyProv['id_controlador'] = myVarGlobals.fProveeduriaCompras;
          this.buyProv['accion'] = `Compra de proveeduria con número de documento ${this.buyProv['num_doc']}`;
          this.buyProv['ruc'] = this.proveedor != undefined ? this.proveedor.num_documento : null;
          this.buyProv['asiento'] = dataAsientoSave;
          this.buyProv['orden'] = this.orden;
          this.buyProv['tiene_metodo_pago'] = this.tiene_metodo_pago;
          this.buyProv['tiene_fecha_limite'] = this.tiene_fecha_limite;
          this.buyProv.total_pagar = this.totalPagar

          this.buyProv['fecha_limite'] = this.tiene_fecha_limite=='S' ? this.fecha_limite : null;
          /* if(this.tiene_fecha_limite=='S'){
            this.buyProv['fecha_limite'] = this.fecha_limite;
          }else{
            this.buyProv['fecha_limite'] = null;
          } */

          this.buyProv['fk_ingreso_bodega'] = (!this.ExistenItems && (this.ingresoSelected != undefined || this.ingresoSelected != null)) ? this.ingresoSelected : null


          // let data = {
          //   "anio": this.buyProv.anio,
          //   "mes": this.buyProv.mes
          // }

          // this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

            console.log(res)
            // if (res["data"][0].estado !== 'C') {

              /* Validamos si el periodo se encuentra aperturado */

              this.comSrv.saveBuyProv(this.buyProv).subscribe(res => {
                if (res["status"] == 1) {
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "success",
                    title: "Compra generada",
                    text: `Factura: ${res['data']['num_doc']} Registro: ${res['data']['id']}`,
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  })
                  //this.toastr.success(res['message']);
                  this.id_compra = res["data"].id;
                  this.consultaRegGuardado(res["data"].id);
                  this.vmButtons[0].habilitar = true
                  this.vmButtons[6].habilitar = false;
                  this.vmButtons[7].habilitar = false;
                  this.vmButtons[8].habilitar = false;
                  window.open(environment.ReportingUrl + "rpt_compras.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_compra=" + res["data"].id, '_blank')
                  //this.cancel();
                }
                else {
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "error",
                    title: "Error al generar el orden de pago",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  });
                }



              }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.message);
              })

            // } else {
            //   this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
            //   this.lcargando.ctlSpinner(false);
            // }

          // }, error => {
          //   this.lcargando.ctlSpinner(false);
          //   this.toastr.info(error.error.mesagge);
          // })

        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        })
      } else {
        this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
        this.lcargando.ctlSpinner(false);
      }

      }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
      })












  }

  async validateUpdateProv() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar");
    } else {
      /* await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar la información?", "UPDATED_PROV");
        }
      }).catch((err) => {
        console.log(err)
        this.toastr.warning(err, 'Errores de Validacion', { enableHtml: true})
      }) */
      try {
        await this.validateDataGlobal()
        this.confirmSave("Seguro desea actualizar la información?", "UPDATED_PROV");
      } catch (mensajes) {
        console.log(mensajes)
        this.toastr.warning(mensajes, 'Errores de Validacion', { enableHtml: true})
      }
    }
  }

  validateDataGlobal() {
    console.log(this.buyProv.fk_doc)
    console.log(this.buyProv.num_doc)
    //console.log(this.buyProv.num_doc.length)
    let flag = false;
    let c = 0;
    let mensajes: string = '';
    return new Promise<void>((resolve, reject) => {

     // if (this.buyProv.fk_doc === 3) {

        if (this.dataDifered != null && (this.buyProv.total != this.dataDifered.amount)
          && this.buyProv.tipo_pago == 'Crédito') {
          // this.toastr.info("El valor diferido no es igual al valor total de la factura, favor revise ambos valores");
          mensajes += "El valor diferido no es igual al valor total de la factura, favor revise ambos valores<br>"
          // document.getElementById("idbtndifered").focus(); return;
        } else if (this.buyProv.tipo_pago == 'Crédito' && this.dataDifered == null) {
          //this.toastr.info("Debe diferir el total de la factura cuando el tipo de pago es a Crédito");
          mensajes += "Debe diferir el total de la factura cuando el tipo de pago es a Crédito<br>"
          // document.getElementById("idbtndifered").focus(); return;
        } else if (this.buyProv.tipo_pago == 0) {
          //this.toastr.info("Seleccione un tipo de pago");
          mensajes += "Seleccione un tipo de pago<br>"
          // document.getElementById("idTipoPagoSelect").focus(); return;
        } else if (this.buyProv.forma_pago == 0) {
          //this.toastr.info("Seleccione una forma de pago");
          mensajes += "Seleccione una forma de pago<br>"
          // document.getElementById("idFormaPago").focus(); return;
        } else if (this.buyProv.num_doc == "" || this.buyProv.num_doc == undefined) {
          //this.toastr.info("debe ingresar un número de documento");
          mensajes += "debe ingresar un número de documento<br>"
          // document.getElementById("idmudoc").focus(); return;
        } else if (this.buyProv.num_doc != undefined && this.buyProv.num_doc.length != 15) {
          /*validamos si el numero de documento de proveedor tiene la caracteristica correcta */
          //this.toastr.info("El numero de comprobantes de proveedor debe tener 15 digitos");
          mensajes += "El campo No. de documento debe tener 15 digitos<br>"
          // document.getElementById("idmudoc").focus();
        } else if (this.buyProv.num_aut == "" || this.buyProv.num_aut == undefined) {
          //this.toastr.info("debe ingresar un número de autorización");
          mensajes += "debe ingresar un número de autorización<br>"
          // document.getElementById("idNumAut").focus(); return;
        }
        else if ((this.buyProv.num_aut).length != 10 && (this.buyProv.num_aut).length != 49) {
          /*validamos que el numero de autorizacion contenga 10 o 49 digitos */
          //this.toastr.info("El numero de autorización debe contener 10 o 49 digitos");
          mensajes += "El numero de autorización debe contener 10 o 49 digitos<br>"
          // document.getElementById("idNumAut").focus(); return;
        } else if (this.buyProv.fk_id_proveedor == 0) {
          //this.toastr.info("debe seleccionar un proveedor");
          mensajes += "debe seleccionar un proveedor<br>"
        } else if (this.dataProducto.length == 0) {
          //this.toastr.info("debe ingresar al menos un producto");
          mensajes += "debe ingresar al menos un producto<br>"
        } else if

          ((this.dataProducto.length == 1 && this.dataProducto[0].fk_producto == 0) &&
          (this.dataCuenta.length == 1 && this.dataCuenta[0].codigo === null)) {

          //this.toastr.info("Debe agregar por lo menos un detalle por producto o por cuenta contable");
          mensajes += "Debe agregar por lo menos un detalle por producto o por cuenta contable<br>"

        } else if (this.buyProv.isActive == 0 && (this.buyProv.observacion == "" || this.buyProv.observacion == null || this.buyProv.observacion == undefined)) {
          //this.toastr.info("Ingrese una observación por la cual el estado es Inactivo");
          mensajes += "Ingrese una observación por la cual el estado es Inactivo<br>"
          // document.getElementById('idtxta').focus(); return;
        } else {
          if(this.ListaAnticipos.length != 0 ) {

            for (let index = 0; index < this.ListaAnticipos.length; index++) {
              if (this.ListaAnticipos[index].valor_aplicado > this.ListaAnticipos[index].saldo ) {
                //this.toastr.info("Revise la pestaña de Anticipos. El valor aplicado no puede ser mayor a el saldo del anticipo "+ this.ListaAnticipos[index].documento);
                //flag = true; break;
                mensajes += "Revise la pestaña de Anticipos. El valor aplicado no puede ser mayor a el saldo del anticipo "+this.ListaAnticipos[index].documento +"<br>"
              }
            }

          }

          if(this.ListaMultas.length != 0 ) {

            for (let index = 0; index < this.ListaMultas.length; index++) {
              if (this.ListaMultas[index].valor_aplicado > this.ListaMultas[index].saldo ) {
                // this.toastr.info("Revise la pestaña de Multas. El valor aplicado no puede ser mayor a el saldo de la multa "+ this.ListaMultas[index].documento);
                // flag = true; break;
                mensajes += "Revise la pestaña de Multas. El valor aplicado no puede ser mayor a el saldo de la multa "+this.ListaMultas[index].documento +"<br>"
              }
            }

          }

          if (this.dataProducto.length > 0 && this.dataProducto[0].fk_producto != 0) {

            c = 0;
            this.dataProducto.forEach(element => {
              if (element['precio'] <= 0 || element['precio'] == "" || element['precio'] == null ||
                element['cantidad'] <= 0 || element['cantidad'] == "" || element['cantidad'] == null) {
                c += 1;
                if (c == 1) {
                 // this.toastr.info("Revise la información en los items, el precio o la cantidad no pueden ser 0")
                  mensajes += "Revise la información en los items, el precio o la cantidad no pueden ser 0<br>"
                }
                //flag = true; return;
              }
            });



          }

          if (this.dataCuenta.length > 0 && this.dataCuenta[0].codigo !== null) {
            c = 0;
            this.dataCuenta.forEach(element => {
              if (element['precio'] <= 0 || element['precio'] == "" || element['precio'] == null ||
                element['cantidad'] <= 0 || element['cantidad'] == "" || element['cantidad'] == null) {
                c += 1;
                if (c == 1) {
                 // this.toastr.info("Revise la información en el detalle de cuenta, el precio o la cantidad no pueden ser 0")
                  mensajes += "Revise la información en el detalle de cuenta, el precio o la cantidad no pueden ser 0.<br>"

                }
                //flag = true; return;
              }

              if(element['cod_cuenta_por_pagar'] == null || element['cod_cuenta_por_pagar']==''){
                c += 1;
                if (c == 1) {
                 // this.toastr.info("Revise la información en el detalle de cuenta, el precio o la cantidad no pueden ser 0")
                  mensajes += "Debe seleccionar la cuenta por pagar.<br>"

                }
              }

              // Validar la existencia de Ret Fte y Ret IVA
              if (element.rte_fuente == undefined || element.rte_fuente == null || element.rte_fuente == 0) {
                mensajes += 'Debe seleccionar la Retencion en Fuente.<br>'
              }

              if (element.rte_iva == undefined || element.rte_iva == null || element.rte_iva == 0) {
                mensajes += 'Debe seleccionar la retencion de IVA.<br>'
              }

              if (element.codigo_partida_icp == undefined || element.codigo_partida_icp == null ) {
                mensajes += 'Debe seleccionar la codigo de partida Idp.<br>'
              }

            });

          }

          // const totalizado = this.fieldsDaily.find((element: any) => element.tipo == 'T')
          // if (Math.floor(totalizado['credit'] * 100)!= Math.floor(totalizado['debit'] * 100)) {
          //   mensajes += "Revise la información en el asiento, el total del credito debe ser igual a la del débito.<br>"
          // }
          /* if (this.fieldsDaily.length > 0 ) {
            c = 0;
            this.fieldsDaily.forEach(element => {
              if (element['tipo'] == 'T' && Math.floor(element['credit'] * 100)!= Math.floor(element['debit'] * 100) ) {
                c += 1;
                if (c == 1) {
                 // this.toastr.info("Revise la información en el detalle de cuenta, el precio o la cantidad no pueden ser 0")
                  mensajes += "Revise la información en el asiento , el total del credito debe ser igual a la del débito <br>"

                }
                //flag = true; return;
              }
            });

          } */

        }

        return (!mensajes.length) ? resolve() : reject(mensajes);

      //}
      //  else {

      //   if (this.dataDifered != null && (this.buyProv.total != this.dataDifered.amount)
      //     && this.buyProv.tipo_pago == 'Crédito') {
      //     //this.toastr.info("El valor diferido no es igual al valor total de la factura, favor revise ambos valores");
      //     mensajes +="El valor diferido no es igual al valor total de la factura, favor revise ambos valores";
      //     //document.getElementById("idbtndifered").focus(); return;
      //   } else if (this.buyProv.tipo_pago == 'Crédito' && this.dataDifered == null) {
      //     //this.toastr.info("Debe diferir el total de la factura cuando el tipo de pago es a Crédito");
      //     mensajes +="Debe diferir el total de la factura cuando el tipo de pago es a Crédito";
      //     //document.getElementById("idbtndifered").focus(); return;
      //   } else if (this.buyProv.tipo_pago == 0) {
      //     //this.toastr.info("Seleccione un tipo de pago");
      //     mensajes +="Seleccione un tipo de pago";
      //     //document.getElementById("idTipoPagoSelect").focus(); return;
      //   } else if (this.buyProv.forma_pago == 0) {
      //     //this.toastr.info("Seleccione una forma de pago");
      //     mensajes +="Seleccione una forma de pago";
      //     //document.getElementById("idFormaPago").focus(); return;
      //   } else if (this.buyProv.fk_id_proveedor == 0) {
      //     //this.toastr.info("debe seleccionar un proveedor");
      //     mensajes +="debe seleccionar un proveedor";
      //   }
      //   else if (this.dataProducto.length == 0) {
      //     //this.toastr.info("debe ingresar al menos un detalle para el registro de la liquidacion");
      //     mensajes +="debe ingresar al menos un detalle para el registro de la liquidacion";
      //   } else if

      //     ((this.dataProducto.length == 1 && this.dataProducto[0].fk_producto == 0)) {

      //     //this.toastr.info("Debe agregar por lo menos un detalle para el registro de liquidacion");
      //     mensajes +="Debe agregar por lo menos un detalle para el registro de liquidacion";

      //   } else if (this.buyProv.isActive == 0 && (this.buyProv.observacion == "" || this.buyProv.observacion == null || this.buyProv.observacion == undefined)) {
      //     //this.toastr.info("Ingrese una observación por la cual el estado es Inactivo");
      //     mensajes +="Ingrese una observación por la cual el estado es Inactivo";
      //     //document.getElementById('idtxta').focus(); return;
      //   } else {

      //     if (this.dataProducto.length > 0 && this.dataProducto[0].fk_producto != 0) {

      //       c = 0;
      //       this.dataProducto.forEach(element => {
      //         if (element['precio'] <= 0 || element['precio'] == "" || element['precio'] == null ||
      //           element['cantidad'] <= 0 || element['cantidad'] == "" || element['cantidad'] == null) {
      //           c += 1;
      //           if (c == 1) {
      //             //this.toastr.info("Revise la información en los items, el valor o la cantidad no pueden ser 0")
      //             mensajes +="Revise la información en los items, el valor o la cantidad no pueden ser 0";
      //           }
      //          // flag = true; return;
      //         }
      //       });

      //      // (!flag) ? resolve(true) : resolve(false);
      //      return (!mensajes.length) ? resolve(true) : reject(mensajes);

      //     }
      //     if (this.dataCuenta.length > 0 && this.dataCuenta[0].codigo !== null) {
      //       c = 0;
      //       this.dataCuenta.forEach(element => {
      //         if (element['precio'] <= 0 || element['precio'] == "" || element['precio'] == null ||
      //           element['cantidad'] <= 0 || element['cantidad'] == "" || element['cantidad'] == null) {
      //           c += 1;
      //           if (c == 1) {
      //            // this.toastr.info("Revise la información en el detalle de cuenta, el precio o la cantidad no pueden ser 0")
      //             mensajes += "Revise la información en el detalle de cuenta, el precio o la cantidad no pueden ser 0<br>"

      //           }
      //           //flag = true; return;
      //         }else if(element['cod_cuenta_por_pagar'] == null || element['cod_cuenta_por_pagar']==''){
      //           c += 1;
      //           if (c == 1) {
      //            // this.toastr.info("Revise la información en el detalle de cuenta, el precio o la cantidad no pueden ser 0")
      //             mensajes += "Debe seleccionar la cuenta por pagar<br>"

      //           }
      //         }
      //       });

      //     }

      //     if (this.fieldsDaily.length > 0 ) {
      //       c = 0;
      //       this.fieldsDaily.forEach(element => {
      //         if (element['tipo'] == 'T' && element['credit']!= element['debit'] ) {
      //           c += 1;
      //           if (c == 1) {
      //            // this.toastr.info("Revise la información en el detalle de cuenta, el precio o la cantidad no pueden ser 0")
      //             mensajes += "Revise la información en el asiento , el total del credito debe ser igual a la del débito <br>"

      //           }
      //           //flag = true; return;
      //         }
      //       });

      //     }


      //   }


      // }
      // if (this.orden == undefined) {
      //   this.toastr.info("En generar orden debe escoger Si o No");
      // }
      if (this.fecha_compra == undefined) {
        this.toastr.info("En tiene metodo de pago debe escoger Si o No");
      }




    });
  }

  /*
  showFacturas() {
    const modalInvoice = this.modalService.open(ShowInvoicesComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
  }
  */


  CargarCuentas(cuenta: any, index) {

    let filt = cuenta["data"];
    console.log(cuenta["data"])
    // let validt = false;
    // this.dataCuenta.forEach(element => {
    //   if (element.codigo == filt.codigo) { validt = true; }
    // });

    /* if (false) {
      Swal.fire(
        'Atención!',
        'Este cuenta ya se encuenta en la lista ingresada!',
        'error'
      )
      this.dataCuenta[index].codigo = '';
    } else { */

      console.log(cuenta);
      console.log(this.dataCuenta);

      //debugger;
      this.dataCuenta[index].cuenta_detalle = "(" + filt.codigo + ") " + filt.nombre
      this.dataCuenta[index].codigo = filt.codigo;
      this.dataCuenta[index].nombre = filt.nombre;
      this.dataCuenta[index].InputDisabledCantidad = false;
      this.dataCuenta[index].codigo_presupuesto = filt.codigo_presupuesto;
      this.dataCuenta[index].nombre_catalogo_presupuesto = filt.nombre_catalogo_presupuesto;
      this.dataCuenta[index].nombrepresupuesto= filt.nombre_catalogo_presupuesto;
      if (filt.nombre_catalogo_presupuesto == "" || filt.nombre_catalogo_presupuesto == null) {
        this.dataCuenta[index].nombrepresupuesto =  filt.presupuesto?.nombre
      }


      this.dataCuenta[index].codigo_cuenta_contable = filt.codigo;
      console.log(filt.codigo_presupuesto);
      console.log(this.dataCuenta);
      console.log('Generando asientos desde CargarCuentas')
      this.generaPreviewAsientoContable();
      $('#cantidad_cuenta_' + index).focus();

    // }


    this.modalService.dismissAll();

  }

  CuentasReglas(cuenta: any, index){
    let filt = cuenta["data"];
    this.lcargando.ctlSpinner(true);
    this.comSrv.getCuentasConReglas({codigo:filt.codigo}).subscribe(
      res => {
        console.log(res)
        //this.reglasCuentas = res
        this.dataCuenta[index].cuenta_inversion_cobro_codigo = res['data'][0]?.cuenta_cobro?.codigo
        this.dataCuenta[index].cuenta_inversion_cobro_nombre = res['data'][0]?.cuenta_cobro?.nombre
        this.dataCuenta[index].cuenta_inversion_pago_codigo = res['data'][0]?.cuenta_pago?.codigo
        this.dataCuenta[index].cuenta_inversion_pago_nombre = res['data'][0]?.cuenta_pago?.nombre
        console.log(this.dataCuenta)
        this.lcargando.ctlSpinner(false);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message)
      })

  }


  /**
   * CargarCuentasPorPagar
   * @param cuenta Cuenta seleccionada del modal
   * @param index Indice del item en dataCuenta
   */
  CargarCuentasPorPagar(cuenta: any, index) {

    let filt = cuenta["data"];

    /* let validt = false;
    this.dataCuenta.forEach(element => {
      if (element.codigo == filt.codigo) { validt = true; }
    });

    if (validt) {

      // Ya existe una cuenta asignada se agrupa

    } else { */


      this.dataCuenta[index].cod_cuenta_por_pagar = filt.codigo;
      this.dataCuenta[index].cuenta_por_pagar = filt.nombre;
      // console.log(this.dataCuenta);
      // console.log('Generando asientos desde CargarCuentasPorPagar')
      this.generaPreviewAsientoContable();


      $('#cantidad_cuenta_' + index).focus();

    // }


    // this.modalService.dismissAll();

  }


  CargarProveedor(event: any) {


    this.buyProv.fk_id_proveedor = event.id_proveedor;
    this.buyProv.proveedor_name = event.razon_social;
    this.buyProv.tipo_identificacion = (event.tipo_documento === 'Ruc') ? '01' : '02';
    this.buyProv.identificacion_proveedor = event.num_documento;

    this.proveedor = event;
    this.ListaAnticipos = [];
    this.ListaMultas = [];
    this.CargarAnticipoProveedor(event.id_proveedor);
    this.CargarMultasProveedor(event.id_proveedor);


    this.modalService.dismissAll();

  }

  CargarComprasRegistradas(event: any) {

    this.lcargando.ctlSpinner(true);

    this.buyProv.fk_id_proveedor = event.proveedor.id_proveedor;
    this.buyProv.proveedor_name = event.proveedor.razon_social;
    this.buyProv.tipo_identificacion = (event.tipo_documento === 'Ruc') ? '01' : '02';
    this.buyProv.identificacion_proveedor = event.ruc;
    this.buyProv.num_doc = event.num_doc
    this.buyProv.sustento = event.sustento_tirbutario
    this.buyProv.subtotal = event.subtotal;
    this.buyProv.total_impuesto = event.subtotal;
    this.buyProv.valor_iva = event.valor_iva
    this.buyProv.subcero = event.total_cero;
    this.buyProv.objeto = event.total_noobjeto;
    this.buyProv.exento = event.total_exento;
    this.buyProv.descuento = event.total_descuento;
    this.buyProv.propina = event.propina;
    this.buyProv.otro_impuesto = event.otro_impuesto;
    this.buyProv.servicio = event.servicios;
    this.buyProv.total = event.total;
    //tipo_pago: 0,
    //forma_pago: 0,
    //fk_usuario_receive: 0,
    this.buyProv.isActive = event.isactive;
    this.buyProv.num_aut = event.num_aut;
    this.buyProv.observacion = event.observacion;
    this.buyProv.iva = event.iva;


    let date: Date = new Date(event.fecha_compra);


    let formattedDate = (moment(date)).format('dd/MM/yyyy');


    this.fecha_compra = date;
    this.buyProv.fk_doc = event.fk_doc;
    this.buyProv.sustento = event.tipo_documento_sustento;

    this.buyProv.anio = moment(event.fecha_compra).format('YYYY');
    this.buyProv.mes = Number(moment(event.fecha_compra).format('MM'));

    this.contableService.getRetencionFuenteCompras().subscribe(res => {
      console.log(res)
      this.rete_fuente = res['data'];

      this.contableService.getRetencionIvaCompras().subscribe(res => {
        this.rte_iva = res;

        let data = { fields: ["IMPUESTOS"] };
        this.contableService.ObtenerCatalogoGeneral(data).subscribe(res => {

          let catalogo = res['data']['catalogs'];
          this.impuestos = catalogo['IMPUESTOS'];

          this.contableService.getRetencionFuenteCompras().subscribe(res => {

            this.rete_fuente = res['data'];
            this.dataProducto = [];

            if (event.detalle.length > 0) {
              event.detalle.forEach(element => {

                this.dataProducto.push({
                  cod_anexo_iva: element.cod_riva_anexo,
                  cod_iva: element.cod_riva,
                  porce_iva: element.porcentaje_riva,
                  cod_anexo_fte: element.cod_rft_anexo,
                  codigo_partida_icp: element.codigopartida,
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

            if (event.detalle_cuentas.length > 0) {

              this.dataCuenta = [];


              event.detalle_cuentas.forEach(element => {


                this.dataCuenta.push({
                  cuenta_detalle: '(' + element.codigo_cuenta + ') ' + element.nombre_cuenta,
                  cod_anexo_iva: element.cod_riva_anexo,
                  cod_iva: element.cod_riva,
                  porce_iva: element.porcentaje_riva,
                  cod_anexo_fte: element.cod_rft_anexo,
                  codigo_partida_icp: element.codigopartida,
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


          }, error => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          })

          this.calculaImpuestoIva();
          this.lcargando.ctlSpinner(false);

        }, error => {
          this.toastr.info(error.error.message);
          this.lcargando.ctlSpinner(false);
        })
      }, error => {
        this.toastr.info(error.error.message);
        this.lcargando.ctlSpinner(false);
      })
    }, error => {
      this.toastr.info(error.error.message);
      this.lcargando.ctlSpinner(false);
    })



  }

  /*Seccion carga de combos*/

  cargaInfoFormaPago() {

    if (typeof (this.forma_pago) === 'undefined') {

      this.LoadOpcion = true;

      let data = {
        params: "'FORMA PAGO'"
      }

      this.comSrv.getCatalogos(data).subscribe(res => {
        this.forma_pago = res['data']['FORMA PAGO'];
        this.LoadOpcion = false;

      }, error => {

        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message)

      })

    }
  }

  cargaInfoTipoPago() {

    //if (typeof (this.tipo_pago) === 'undefined') {

    this.LoadOpcionTipoPago = true;

    let data = {
      params: "'TIPO PAGO'"
    }

    this.comSrv.getCatalogos(data).subscribe(res => {
      this.tipo_pago = res['data']['TIPO PAGO'];
      this.LoadOpcionTipoPago = false;

    }, error => {

      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)

    })

    // }
  }

  async handleSelectProceso(id_proceso: number) {
    if (id_proceso !== null) {
      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Cargando Condiciones'
        this.id_solicitud = id_proceso
        console.log(this.contratos.filter(e => e.id_solicitud == this.id_solicitud))

        if(this.contratos?.length > 0){
          let filter_contrato = this.contratos.filter(e => e.id_solicitud == this.id_solicitud)
          if(filter_contrato[0]?.tipo_proceso=='Contratacion'){
            const condicionesResponse = await this.comSrv.CondicionesProveedores(id_proceso) as any
            this.ListaCondiciones = condicionesResponse.data;
          }else{
            this.ListaCondiciones = [];
          }
          console.log("filter_contrato",filter_contrato);
          this.buyProv.idp = filter_contrato[0]?.idp;
          this.codigos_partidas_idp = filter_contrato[0]?.codigos_partidas_idp?.detalles;
          console.log(this.codigos_partidas_idp);
          // agregar nueva funcionalidad para traer los selects
         // const detalles = await this.comSrv.getIngresoDetalles({idp: this.buyProv.idp})
         // Suponiendo que this.codigos_partidas_idp es tu arreglo de objetos
         if(this.codigos_partidas_idp){
          this.codigos_partidas_idp = this.codigos_partidas_idp.reduce((unique, item) => {
            // Verificar si el objeto ya está en unique usando la propiedad "codigopartida"
            const exist = unique.some(u => u.codigopartida === item.codigopartida);
            // Si no está presente, agregarlo al arreglo único
            if (!exist) {
                unique.push(item);
            }
            return unique;
          }, []);
         }else{
          this.toastr.info("No existen códigos compuestos de patida, por favor revise.")
         }
        /*
        this.codigos_partidas_idp = Array.from(new Set(this.codigos_partidas_idp));*/  // = list(map(str, set(this.codigos_partidas_idp)));
        }

        this.ExistenItems= false;

        (this as any).mensajeSpinner = 'Cargando Ingresos de Bodega asociados'
        this.cmb_ingreso = [];
        const ingresoResponse = await this.comSrv.cargarIngresoBodega(id_proceso) as any
        console.log(ingresoResponse)
        ingresoResponse.data.forEach((element: any) => {
          const { id, numero_ingreso_bodega } = element
          this.cmb_ingreso = [...this.cmb_ingreso, {id, numero_ingreso_bodega}]
        })

        //
        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error cargando datos del Proceso')
      }
    }
  }

  async handleSelectIngreso({id}) {
    // Limpiar arrays
    this.ListaItems = [];
    this.dataCuenta=[];
    this.tbl_partidas = [];
    this.ingresoSelected = id

    this.lcargando.ctlSpinner(true);
    // Obtener detalles
    const detalles = await this.comSrv.getIngresoDetalles({ingreso: {id}})
    console.log(detalles)
    if (detalles.data.length > 0) {
      detalles.data.forEach((element: any) => {
        this.ListaItems.push({
          numero_ingreso_bodega:element.ingreso_bodega.numero_ingreso_bodega,
          description: element.description,
          cantidad:  element.cantidad,
          precio_unitario:  element.precio_unitario,
          total:  element.total,
          codigo_bienes:  element.codigo_bienes,
          codigo_grupo_producto: element.codigo_grupo_producto,
          codigo_cuenta_contable:  element.codigo_cuenta_contable,
          codigo_presupuesto:  element.codigo_presupuesto,

          nombrepresupuesto:  element.catalogo_presupuesto?.nombre,
        })
        console.log("this.ListaItems",this.ListaItems);
        this.dataCuenta.push({
          cod_anexo_iva: "",
          cod_iva: "",
          porce_iva: 0,
          cod_anexo_fte: "",
          cod_fte: "",
          porce_fte: 0,
          isRetencionIva: false,
          LoadOpcionImpuesto: false,
          LoadOpcionReteFuente: false,
          LoadOpcionRteIva: false,
          LoadOpcionIceSri: false,
          LoadOpcionCentro: false,
          subtotal_noobjeto: 0.00,
          subtotal_excento: 0.00,
          subtotal_cero: 0.00,
          subtotal_iva: 0.00,
          InputDisabledCantidad: false,
          iva_detalle: (0.00).toFixed(2),
          ice_detalle: (0.00).toFixed(2),
          fk_producto: 0,
          impuesto: "2",
          rte_fuente: 0,
          rte_iva: 0,
          centro: 0,
          nombre: element.cuenta_contable?.nombre,
          codigo: element.cuenta_contable?.codigo,
          nombrepresupuesto:  element.catalogo_presupuesto?.nombre,
          observacion: null,
          cantidad: element.cantidad,
          precio: element.precio_unitario,
          desc: (0.00).toFixed(2),
          subtotalItems: element.total, //element.cantidad * element.precio_unitario
          totalItems: element.cantidad * element.precio_unitario,
          paga_iva: 1,
          codigo_presupuesto: element.codigo_presupuesto ,
          codigo_cuenta_contable:  element.codigo_cuenta_contable,
          cuenta_detalle: "("+ element.cuenta_contable?.codigo + ")"+ element.cuenta_contable?.nombre,

        })

        const item = this.tbl_partidas.find((p: any) => p.codigo == element.codigo_presupuesto)
        if (!item) {
          this.tbl_partidas.push({
            codigo: element.codigo_presupuesto,
            descripcion: element.catalogo_presupuesto?.nombre,
            valor: 0
          })//''
        }
        this.tbl_partidas.find((p: any) => p.codigo == element.codigo_presupuesto).valor += (element.total) //cantidad * element.precio_unitario

        this.calculaImpuestoIva();
        //this.sumRegistroDetalleCuenta(index)
        this.sumaTotales(undefined,undefined,undefined);
        this.sumTotalizados();
        this.generaPreviewAsientoContable();
      })

      this.totalPartidas = this.tbl_partidas.reduce((acc: number, curr: any) => acc + curr.valor, 0)

      this.sumRegistroTodo()
      //this.generaPreviewAsientoContable();
      this.detalleImpuesto = [];
    }
    this.lcargando.ctlSpinner(false)
  }

  CargarCondicionesProveedor(event: any) {
    // console.log(event);

    if (typeof event !== undefined && event !== '' && event !== null) {


      this.id_solicitud= event;
      this.lcargando.ctlSpinner(true);
      this.comSrv.CondicionesProveedores(event).subscribe(res => {
       console.log(res)
        if(this.infoContrato?.length > 0){
          let filter_contrato = this.infoContrato?.filter(e => e.id_solicitud == this.id_solicitud)
          this.buyProv.idp = filter_contrato[0]?.idp;
        }
        //console.log(filter_contrato)
        this.ListaCondiciones = res['data'];
        this.ExistenItems= false;
        // this.lcargando.ctlSpinner(false);

      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })

    }
  }

  cargarIngresoBodega(){

      this.lcargando.ctlSpinner(true);
      this.comSrv.cargarIngresoBodega(this.id_solicitud).subscribe(res => {
        console.log(res)
        this.dataCuenta=[];
        this.ListaItems=[];
       // let codigo_cuentas=[];
        if(res['data'].length > 0){
          res['data'].forEach(element => {
            if(element.detalles.length > 0){
              element.detalles.forEach((d,index) => {
                let data ={
                  numero_ingreso_bodega:element.numero_ingreso_bodega,
                  description: d.description,
                  cantidad:  d.cantidad,
                  precio_unitario:  d.precio_unitario,
                  total:  d.total,
                  codigo_bienes:  d?.codigo_bienes,
                  codigo_grupo_producto:d.codigo_grupo_producto,
                  codigo_cuenta_contable:  d.codigo_cuenta_contable,
                  codigo_presupuesto:  d.codigo_presupuesto,

                }
                this.ListaItems.push(data);

                console.log("this.ListaItems",this.ListaItems);
                //codigo_cuentas.push(d.codigo_cuenta_contable == null ? '0' : d.codigo_cuenta_contable);

                //Object.assign(this.dataCuenta,{cantidad:d.cantidad,precio:d.precio_unitario});
                let cuentas = {
                   cod_anexo_iva: "",
                    cod_iva: "",
                     porce_iva: 0,
                     cod_anexo_fte: "",
                      cod_fte: "",
                      porce_fte: 0,
                      isRetencionIva: false,
                      LoadOpcionImpuesto: false,
                      LoadOpcionReteFuente: false,
                      LoadOpcionRteIva: false,
                      LoadOpcionIceSri: false,
                      LoadOpcionCentro: false,
                      subtotal_noobjeto: 0.00,
                      subtotal_excento: 0.00,
                      subtotal_cero: 0.00,
                      subtotal_iva: 0.00,
                      InputDisabledCantidad: false,
                      iva_detalle: (0.00).toFixed(2),
                      ice_detalle: (0.00).toFixed(2),
                      fk_producto: 0,
                      impuesto: "2",
                      rte_fuente: 0,
                      rte_iva: 0,
                      centro: 0,
                      nombre: d.cuenta_contable?.nombre,
                      codigo: d.cuenta_contable?.codigo,
                      observacion: null,
                      cantidad: d.cantidad,
                      precio: d.precio_unitario,
                      desc: (0.00).toFixed(2),
                      subtotalItems:d.cantidad * d.precio_unitario,
                      totalItems: d.cantidad * d.precio_unitario,
                      paga_iva: 1,
                      codigo_presupuesto: d.codigo_presupuesto ,
                      codigo_cuenta_contable:  d.codigo_cuenta_contable,
                      cuenta_detalle: "("+ d.cuenta_contable?.codigo + ")"+ d.cuenta_contable?.nombre
                    };

               // Object.assign(element,{cuenta_detalle:"("+codigo[0].codigo+")"+codigo[0].nombre,codigo:codigo[0].codigo});

                this.dataCuenta.push(cuentas);
                this.calculaImpuestoIva();
                //this.sumRegistroDetalleCuenta(index)
                this.sumaTotales(undefined,undefined,undefined);
                this.sumTotalizados();


              });
            }
          });
          this.sumRegistroTodo()
          //this.generaPreviewAsientoContable();
          this.detalleImpuesto = [];
          console.log(this.dataCuenta)
          // let cod ={
          //   codigos:codigo_cuentas
          // }
          // console.log(cod)
          // this.comSrv.getAccountsByNumber(cod).subscribe(res => {
            // console.log(res['data'])
            // this.dataCuenta.forEach((element,index) => {
            //   if(element.codigo_cuenta_contable!=undefined){
            //     let codigo = res['data'].filter(e => e.codigo_oficial == element.codigo_cuenta_contable);
            //     console.log(codigo[0].codigo)
            //      Object.assign(element,{cuenta_detalle:"("+codigo[0].codigo+")"+codigo[0].nombre,codigo:codigo[0].codigo});
            //   }
            //   this.sumRegistroDetalleCuenta(index)
            //   this.sumaTotales(undefined,undefined,undefined);

            // });

          //  this.sumTotalizados();
          //  this.generaPreviewAsientoContable();

         // });
        }else{
          this.ListaItems=[];
        }
        this.lcargando.ctlSpinner(false);

      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
  }
sumRegistroTodo(){
  this.dataCuenta.forEach(element => {
    let subTotal = 0
    let iva = 0
    let total = 0

    //element.subtotalItems = element.cantidad * element.precio
    element.subtotalItems = element.subtotalItems = parseFloat((element.cantidad * element.precio).toFixed(2));
//    parseFloat(element.cantidad) * parseFloat(element.precio) ;//(.toFixed(2));
    if(element.subtotalItems < parseFloat(element.desc)){
      this.toastr.warning('El descuento no puede ser mayor al total del detalle')
      element.desc = 0
    }
    element.totalItems = element.subtotalItems - element.desc

    switch (element.impuesto) {
      case "2":
        element.iva_detalle = (element.totalItems * (this.buyProv.iva / 100)).toFixed(2)
        element.subtotal_iva = element.totalItems
        break;
      case "0":
        element.iva_detalle = (0).toFixed(2)
        element.subtotal_cero = element.totalItems
        element.subtotal_iva = (0).toFixed(2)
        element.subtotal_noobjeto = (0).toFixed(2)
        element.subtotal_excento = (0).toFixed(2)
        break;
      case "6":
        element.iva_detalle = (0).toFixed(2)
        element.subtotal_cero = (0).toFixed(2)
        element.subtotal_iva = (0).toFixed(2)
        element.subtotal_noobjeto = element.totalItems
        element.subtotal_excento = (0).toFixed(2)
        break;
      case "7":
        element.iva_detalle = (0).toFixed(2)
        element.subtotal_cero = (0).toFixed(2)
        element.subtotal_iva = (0).toFixed(2)
        element.subtotal_noobjeto = (0).toFixed(2)
        element.subtotal_excento = element.totalItems
        break;
      case "8":
        element.iva_detalle = (element.totalItems * (8 / 100)).toFixed(2)
        break;

      default:
        break;
    }

    if (typeof element.porce_fte !== undefined && element.porce_fte > 0) this.calculaImpuestoIva()
    if (typeof element.porce_ice !== undefined && element.porce_ice > 0) this.calculaIceSri()


  });
  this.generaPreviewAsientoContable();
}



  CargarAnticipoProveedor(event: any) {

    if (typeof event !== undefined && event !== '' && event !== null) {

      this.lcargando.ctlSpinner(true);
      this.comSrv.AnticipoProveedores(event).subscribe(res => {
        console.log(res)
        if(res['data'].length > 0){
          res['data'].forEach(e => {
            Object.assign(e,{deshabilitar: true,aplica: false,disabled:false,valor_aplicado: 0.00, fecha:moment(e.fecha).format('YYYY-MM-DD')})
          })
          this.ListaAnticipos = res['data'];
          this.ExistenAnticipos = false;
        }else{
          this.ExistenAnticipos = true;
        }
        this.lcargando.ctlSpinner(false);

      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })

    }
  }
  CargarMultasProveedor(event: any){
    if (typeof event !== undefined && event !== '' && event !== null) {

      this.lcargando.ctlSpinner(true);
      this.comSrv.MultasProveedores(event).subscribe(res => {
        console.log(res)
        if(res['data'].length > 0){
          res['data'].forEach(e => {
            Object.assign(e,{deshabilitar: true,aplica: false,disabled:false,valor_aplicado: 0.00, fecha:moment(e.fecha).format('YYYY-MM-DD')})
          })
          this.ListaMultas = res['data'];
          this.ExistenMultas = false;
        }else{
          this.ExistenMultas = true;
        }
        this.lcargando.ctlSpinner(false);

      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })

    }
  }


  async CargarContratosProveedor() {

    let id_proveedor = this.buyProv.fk_id_proveedor;
    let o = {}
    let tipo_proceso=''
    let e = {}
    let tipo_procesoCat=''
    this.contratos = [];
    if (typeof id_proveedor !== undefined && id_proveedor !== '' && id_proveedor !== 0) {

      this.LoadOpcionContratos = true;
      const contratosResponse = await this.comSrv.ListarContratos(id_proveedor) as any
      console.log(contratosResponse)
      const catelecResponse = await this.comSrv.ListarContratosCatElec(id_proveedor) as any
      if (contratosResponse) {
        contratosResponse.forEach((element: any) => {
          if (element.tipo_proceso == 'Infimas') tipo_proceso = 'INF'
          else if (element.tipo_proceso == 'Contratacion') tipo_proceso = 'CON'
          else if (element.tipo_proceso == 'Catalogo Electronico') tipo_proceso = 'CAT'
          else tipo_proceso = element.tipo_proceso

          this.contratos.push({
            id_solicitud: element.id_solicitud,
            num_solicitud: tipo_proceso + '-' + element.num_solicitud,
            idp: element.idp,
            codigos_partidas_idp : element.recdocidp,
            tipo_proceso: element.tipo_proceso
          })


        })
      }
      console.log(catelecResponse)
      catelecResponse.data.forEach((element: any) => {
        if (element.solicitud.tipo_proceso == 'Catalogo Electronico') tipo_proceso = 'CAT'
        else tipo_proceso = element.solicitud.tipo_proceso

        this.contratos.push({
          id_solicitud: element.solicitud.id_solicitud,
          num_solicitud: tipo_proceso + '-' + element.solicitud.num_solicitud + ' [O/C: ' + element.num_orden + ']',
          idp: element.solicitud.idp,
          codigos_partidas_idp : element.solicitud?.recdocidp,
          tipo_proceso: element.solicitud?.tipo_proceso
        })
      })

      console.log(this.contratos)
      this.LoadOpcionContratos = false

      /* console.log(id_proveedor)
      this.comSrv.ListarContratos(id_proveedor).subscribe(res => {
        console.log(res);
        if(res){
          this.infoContrato = res;
          this.infoContrato.forEach(c => {
            if(c.tipo_proceso=='Infimas'){
              tipo_proceso= 'INF';
            }else if(c.tipo_proceso=='Contratacion'){
              tipo_proceso= 'CON';
            }else if(c.tipo_proceso=='Catalogo Electronico'){
              tipo_proceso= 'CAT';
            }else{
              tipo_proceso= c.tipo_proceso;
            }
             o = {
              id_solicitud: c.id_solicitud,
              num_solicitud: tipo_proceso +' - '+c.num_solicitud
            }
            this.contratos.push(o)
          })

        }

        this.LoadOpcionContratos = false;
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.LoadOpcionContratos = false;
        this.toastr.info(error.error.message);
      })

      this.LoadOpcionContratos = true;
      this.comSrv.ListarContratosCatElec(id_proveedor).subscribe(res2 => {
        console.log(res2);
        this.infoContratoCatalogo = res2['data'];

        this.infoContratoCatalogo.forEach(c => {
          if(c.solicitud.tipo_proceso=='Catalogo Electronico'){
            tipo_proceso= 'CAT';
          }else{
            tipo_proceso= c.solicitud.tipo_proceso;
          }
           e = {
            id_solicitud: c.solicitud.id_solicitud,
            num_solicitud: tipo_proceso +' - '+c.solicitud.num_solicitud + ' [O/C: ' + c.num_orden + ']'
          }
          this.contratos.push(e)
        })
      },error => {
        this.lcargando.ctlSpinner(false);
        this.LoadOpcionContratos = false;
        this.toastr.info(error.error.message);
      }) */

      if(this.contratos.length > 0){
        this.ExistenItems = false;
      }

      console.log(this.contratos)
    }
  }

  CargarComboUsuario() {

    if (typeof (this.infoUsers) === 'undefined') {
      this.LoadOpcionUsuario = true;
      this.comSrv.getUsuario().subscribe(res => {
        this.infoUsers = res['data'];
        this.LoadOpcionUsuario = false;
      }, error => {
        // this.lcargando.ctlSpinner(false);
        this.LoadOpcionUsuario = false;
        this.toastr.info(error.error.message);
      })
    }
  }

  CargarTipoDocumento() {

    //if (typeof(this.tip_doc) === 'undefined') {

    let data = {
      params: "'V'"
    }

    this.LoadOpcionTipoDoc = true;

    this.comSrv.getTypeDocument(data).subscribe(res => {

      this.tip_doc = res['data']['V'];
      this.LoadOpcionTipoDoc = false;

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.LoadOpcionTipoDoc = false;
      this.toastr.info(error.error.message)
    })

    //}
  }


  getEgreCorrientes() {

    //if (typeof(this.tip_doc) === 'undefined') {

    let data = {
      params: "'PAG_TIPO_EGRESO_CORRIENTE'"
    }

    this.LoadOpcionEgreCorriente = true;

    this.comSrv.getEgreCorrientes(data).subscribe(res => {

      this.egreso_corriente_array = res['data']['PAG_TIPO_EGRESO_CORRIENTE'];
      this.LoadOpcionEgreCorriente = false;

    }, error => {
      // this.lcargando.ctlSpinner(false);
      this.LoadOpcionEgreCorriente = false;
      this.toastr.info(error.error.message)
    })

    //}
  }


  serverSideSearch() {

    this.peopleTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      switchMap(term => this.comSrv.getProductProveeduria())
    ).subscribe(x => {
      this.serverSideFilterItems = x["data"];
    }, (err) => {
      console.log(err);
      this.serverSideFilterItems = [];
    });

  }

  getProductProveeduria() {
    if (typeof (this.arrayProductos) === 'undefined') {

      this.LoadOpcionProductos = true;

      this.comSrv.getProductProveeduria().subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.arrayProductos = res['data'];
        this.LoadOpcionProductos = false;
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
        this.LoadOpcionProductos = false;
      })

    }
  }

  /*

  CargarTipoImpuestos() {
    if (typeof(this.impuestos) === 'undefined') {

      this.LoadOpcionImpuesto = true;

      this.impuestos =
      [
        {
          id:2,
          nombre:'2- IVA 12%'
        },{
          id:0,
          nombre:'0- IVA 0%'
        },{
          id:6,
          nombre:'6- EXENTO'
        },{
          id:7,
          nombre:'7- NO OBJETO'
        }
      ]

      this.LoadOpcionImpuesto = false;


    }
  }
*/
  cargaInfoSustento() {
     //if (typeof(this.sustento_array) === 'undefined') {

    this.LoadOpcionSustento = true;


    this.contableService.getSustentoTributarioCompras().subscribe(res => {
      console.log(res)
      // this.lcargando.ctlSpinner(false);
      this.sustento_array = res['data'];
      this.LoadOpcionSustento = false;
    }, error => {
      // this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
      this.LoadOpcionSustento = false;
    })


    //}
  }

   getCuentaPagar() {
    console.log('aqui')

      this.LoadOpcionCuentaPagarAnt = true;
      this.ListaCuentasPagarAnticipos = [];
      let cuentas = []
       this.fieldsDaily.forEach(e => {
         if(e.tipo_detalle == 'CXP' && e.account != undefined){
           let data ={
             codigo: e.account,
             nombre: e.name,
             tipo: e.tipo,
             tipo_detalle: e.tipo_detalle,
             label: '('+e.account+')'+ e.name
           }
           cuentas.push(data)
         }
       })
       const dataArr = new Set(cuentas);

      let result = [...dataArr];
       this.ListaCuentasPagarAnticipos = result

       this.LoadOpcionCuentaPagarAnt = false
       console.log(this.ListaCuentasPagarAnticipos )




  }
  selectAnticipo(imp,i) {

    console.log(imp)
   //let aplica = false

    if ( imp.orden_pago?.detalles.length == 0) {
      this.toastr.warning('Debe seleccionar una cuenta por pagar')
    // event['aplica'] =false
     imp['deshabilitar'] =true
     this.sumaTotales(imp.valor_aplicado,'ANT',i)
      return
    }else if (imp.cuenta_por_pagar.codigo == undefined ) {
      //this.toastr.warning('Debe tener cuentas asociadas al anticipo')
     // event['aplica'] =false
      imp['deshabilitar'] =true
      this.sumaTotales(imp.valor_aplicado,'ANT',i)
      return
    }else if ( imp.valor_aplicado == 0) {
     // this.toastr.warning('El valor aplicado no puede ser 0')
     // event['aplica'] =false
      imp['deshabilitar'] =true
      this.sumaTotales(imp.valor_aplicado,'ANT',i)
      return
    }
    else{
     // aplica = true
     // event['aplica']= true
      imp['deshabilitar'] =false
      this.sumaTotales(imp.valor_aplicado,'ANT',i)
      return

    }


    // console.log(aplica)
    // if (aplica) {
    //   this. cargaAnticipo(event,imp)
    // }

  }


  cargaAnticipo(event,imp,i) {
    console.log(event);
    console.log(imp)
    console.log('i',i);
    if(imp.aplica == false){
      console.log('debe poner en 0');
      imp.valor_aplicado = 0;
      imp['deshabilitar'] =true
    }
   // let aplica = event.aplica;
   this.dataAnticipos = [];
    if (event) {
     this.ListaAnticipos.forEach(e => {
      if(e.aplica){
        let data = {
          codigo: e.orden_pago?.detalles[0].cuentas?.codigo,
          nombre: e.orden_pago?.detalles[0].cuentas?.nombre,
          cod_cuenta_por_pagar_ant : e.cuenta_por_pagar.codigo,
          nombre_cuenta_por_pagar_ant : e.cuenta_por_pagar.nombre,
          valor_aplicado:e.valor_aplicado,
        }
        this.dataAnticipos.push(data)
      }
     });

     this.sumaTotales(imp.valor_aplicado,'ANT',i)
     this.generaPreviewAsientoContable()

    }

    console.log( this.dataAnticipos)
  }

  getCuentaPagarMulta() {
    console.log('aqui')

      this.LoadOpcionCuentaPagarMulta = true;
      this.ListaCuentasPagarMultas = [];
      let cuentas = []
       this.fieldsDaily.forEach(e => {
         if(e.tipo_detalle == 'CXP' && e.account != undefined){
           let data ={
             codigo: e.account,
             nombre: e.name,
             tipo: e.tipo,
             tipo_detalle: e.tipo_detalle,
             label: '('+e.account+')'+ e.name
           }
           cuentas.push(data)
         }
       })
       const dataArr = new Set(cuentas);

      let result = [...dataArr];
       this.ListaCuentasPagarMultas = result

       this.LoadOpcionCuentaPagarMulta = false
       console.log(this.ListaCuentasPagarMultas )
  }

  selectMulta(imp,i) {
    //console.log(event);
    console.log(imp)
   let aplica = false

    if ( imp.cuenta_contable?.codigo == undefined) {

     imp['deshabilitar'] =true
     this.sumaTotales(imp.valor_aplicado,'MU',i)
      return
    }else if (imp.cuenta_por_pagar.codigo == undefined ) {

      imp['deshabilitar'] =true
      this.sumaTotales(imp.valor_aplicado,'MU',i)
      return
    }else if ( imp.valor_aplicado == 0) {

      imp['deshabilitar'] =true
      this.sumaTotales(imp.valor_aplicado,'MU',i)
      return
    }
    else{

      imp['deshabilitar'] =false
      this.sumaTotales(imp.valor_aplicado,'MU',i)
      return
    }

  }

  cargaMulta(event,imp,i) {
    console.log(event);

   // let aplica = event.aplica;
   this.dataMultas = [];
    if (event) {
     this.ListaMultas.forEach(e => {
      if(e.aplica){
        let data = {
          codigo: e.cuenta_contable?.codigo,
          nombre: e.cuenta_contable?.nombre,
          cod_cuenta_por_pagar_multa : e.cuenta_por_pagar?.codigo,
          nombre_cuenta_por_pagar_multa : e.cuenta_por_pagar?.nombre,
          valor_aplicado: e.valor_aplicado,
        }
        this.dataMultas.push(data)
      }
     });
     this.sumaTotales(imp.valor_aplicado,'MU',i)

     this.generaPreviewAsientoContable()

    }

    console.log( this.dataMultas)
  }

  async getImpuestosDetalle(i?, data_combo?) {

    // if ((typeof (this.impuestos) === 'undefined') || (this.impuestos.length === 1)) {

    if (this.impuestos == undefined || this.impuestos.length === 1) {
      try {
        const response = await this.contableService.ObtenerCatalogoGeneral({ fields: ["IMPUESTOS"] }) as any
        console.log(response)
        this.impuestos = response.data.catalogs['IMPUESTOS']
      } catch (err) {
        console.log(err)
        this.toastr.warning(err.error?.message, 'Carga de Listado de Impuestos');
      }

      /* data_combo[i].LoadOpcionImpuesto = true;
      let data = { fields: ["IMPUESTOS"] };

      this.contableService.ObtenerCatalogoGeneral(data).subscribe(res => {

        let catalogo = res['data']['catalogs'];
        this.impuestos = catalogo['IMPUESTOS'];
        data_combo[i].LoadOpcionImpuesto = false;

      }, error => {

        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
        data_combo[i].LoadOpcionImpuesto = false;

      }) */

    }

    // }
  }

  async getIceSri(i?, data_combo?) {

    // if ((typeof (this.iceSri) === 'undefined') || (this.iceSri.length === 1)) {

    if (this.iceSri == undefined) {
      try {
        const response = await this.comSrv.getIceSri() as any
        console.log(response)
        this.iceSri = response.data
      } catch (err) {
        console.log(err)
        this.toastr.warning(err.error?.message, 'Carga de Listado de ICE');
      }

      /* data_combo[i].LoadOpcionIceSri = true;
      this.comSrv.getIceSri().subscribe(res => {

       console.log(res)
       this.iceSri = res['data'];
        data_combo[i].LoadOpcionIceSri = false;

      }, error => {

        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
        data_combo[i].LoadOpcionIceSri = false;

      }) */
    }

    // }
  }

  async getRetencionFuente(i?) {


    if (this.rete_fuente == undefined) {
      try {
        const response = await this.contableService.getRetencionFuenteCompras() as any
        console.log(response)
        this.rete_fuente = response.data
      } catch (err) {
        console.log(err)
        this.toastr.warning(err.error?.message, 'Carga de Listado de Retencion Fuente');
      }

      /* this.dataCuenta[i].LoadOpcionReteFuente = true;
      this.contableService.getRetencionFuenteCompras().subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.rete_fuente = res['data'];
        this.dataCuenta[i].LoadOpcionReteFuente = false;
      }, error => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error?.message);
        this.dataCuenta[i].LoadOpcionReteFuente = false;
      }) */
    }
    this.sumaTotales(undefined,undefined,undefined);

  }




  async getRetencionIva(i?, datos?) {


    if (this.rte_iva == undefined) {
      try {
        const response = await this.contableService.getRetencionIvaCompras() as any
        console.log(response)
        this.rte_iva = response.data
      } catch (err) {
        console.log(err)
        this.toastr.warning(err.error?.message, 'Carga de Listado de Retencion IVA');
      }

      /* datos[i].LoadOpcionRteIva = true;
      this.contableService.getRetencionIvaCompras().subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.rte_iva = res['data'];
        datos[i].LoadOpcionRteIva = false;
      }, error => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error?.message);
        datos[i].LoadOpcionRteIva = false;
      }) */
    }
    this.sumaTotales(undefined,undefined,undefined);
  }

  async getCentroDetalle(i?) {

    if (this.centros == undefined) {
      try {
        const response = await this.comSrv.ListaCentroCostos() as any
        console.log(response)
        this.centros = response.data
      } catch (err) {
        console.log(err)
        this.toastr.warning(err.error?.message, 'Carga de Listado de Retencion IVA');
      }
    /* //this.dataProducto[i].LoadOpcionCentro = true;
    this.dataCuenta[i].LoadOpcionCentro = true;

    // this.contableService.getRetencionIvaCompras().subscribe(res => {
    //   console.log(res);
    //   this.lcargando.ctlSpinner(false);
    //   this.centros = res;
    //   this.dataProducto[i].LoadOpcionCentro = false;
    // }, error => {
    //   this.lcargando.ctlSpinner(false);
    //   this.toastr.info(error.error.message);
    //   this.dataProducto[i].LoadOpcionCentro = false;
    // })

    this.comSrv.ListaCentroCostos().subscribe(
      (resTotal) => {

        this.centros = resTotal["data"];
        //this.dataProducto[i].LoadOpcionCentro = false;
        this.dataCuenta[i].LoadOpcionCentro = false;

      },
      (error) => {
        //this.dataProducto[i].LoadOpcionCentro = false;
        this.dataCuenta[i].LoadOpcionCentro = false;
      }

    ); */

    }

  }

  /* fin seccion carga de combos */


  /*Eventos generales */

  ChangeFechaCompras(event: any) {

    this.buyProv.anio = moment(event.value).format('YYYY');
    this.buyProv.mes = Number(moment(event.value).format('MM'));

  }

  /*Fin eventos generales */

  CambioTipoComprobante() {

    if (this.buyProv.fk_doc === 3) {
      this.vmButtons[2].habilitar = false;
      this.vmButtons[3].habilitar = false;
    } else {
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = true;
    }

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSaveBuyProv();
        break;
      case "MODIFICAR":
        this.validateUpdateProv();
        break;
      case "BUSCAR":
        this.showModalCompras();
       //this.onClickConsultaComprasRegistradas()
        break;
      case "FACTURAS":
        this.onClickConsultaComprasRegistradas();
        break;
      case "ORDENES":
        this.onClickConsultaOrdenesRegistradas();
        break;
      case "CANCELAR":
        this.cancel();
        break;
      case "GENERAR RETENCION":
        this.generarRetencion();
        break;
      case "PDF":
        this.descargarPdf();
        break;
      case "ANULAR":
        this.anularCompra()
        break;

    }
  }

  showModalCompras(){
    let modal = this.modalService.open(ModalComprasComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true
  }




  LoadListaCatalogoPresupuesto(index) {


    this.fieldsDaily[index].LoadOpcionCatalogoPresupuest = true;

    this.comSrv.ListaCatalogoPresupuesto().subscribe(res => {

      this.catalogo_presupuesto = res['data'];
      this.fieldsDaily[index].LoadOpcionCatalogoPresupuesto = false;

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.fieldsDaily[index].LoadOpcionCatalogoPresupuesto = false;
      this.toastr.info(error.error.mesagge);
    })

  }

  /*
    myThrowingFunction = async () => {
      const myString = func();
      const myResolvedPromiseString = await asyncFunc();

      myString.length;
      myResolvedPromiseString.length;
    };


    asyncFunctionCatching = async () => {
      const myReturnValue = "Hello world";
      try {
        await this myThrowingFunction();
      } catch (error) {
        console.error("myThrowingFunction failed", error);
      }
      return myReturnValue;
    };
    */




  /**
 * on file drop handler
 */
  onFileDropped($event) {

    this.prepareFilesList($event);


  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    if (this.buyProv.fk_doc === 3) {
      this.prepareFilesList(files);
    } else {
      this.toastr.info("Solo se permite la carga para registro de facturas proveedor");
    }

  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number, detalle) {

    let serv = this.dialogService;
    let referen = this.ref;
    let carga = this.lcargando;
    let toas = this.toastr;

    let detproduc = this.dataProducto

    let procesa = this.ProcesaCargaXml;

    //debugger

    this.lcargando.ctlSpinner(true);

    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {

            const reader = new FileReader();
            reader.onload = (e) => {

              const text = reader.result.toString().trim();

            }
            reader.readAsText(this.files[index]);

            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1, this.dataProducto);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    this.files = [];

    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }

    const reader = new FileReader();

    const filetext = new Promise(resolve => {
      reader.onload = () => resolve(reader.result);
      reader.readAsText(this.files[0]);
    });


    filetext.then(async (value: any) => {
      // console.log(value)
      const jsonValue = await this.xmlToJson(value);
      this.ProcesaCargaXml(jsonValue);
      // this.xmlToJson(value).then(response => this.ProcesaCargaXml(response));
    });





    /*
        const reader = new FileReader();
        reader.onload = (e) => {

          const text = reader.result.toString().trim();
          parseString(text, function (err, result) {

            console.log(this.dataCuenta);


          });
        }
        reader.readAsText(this.files[0]);*/

    //this.uploadFilesSimulator(0, this.dataProducto);
  }

  expandCargaXml(comprobante: string) {
    const modal = this.modalService.open(ModalCargaxmlComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.comprobante = comprobante
  }


  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  async ProcesaCargaXml(result: any) {

    console.log(result)
    if ('autorizacion' in result) {

      let autorizacion = result.autorizacion;
      let estado = autorizacion.estado;
      if (estado[0] === "AUTORIZADO") {

        let numAuto = autorizacion.numeroAutorizacion[0];
        let comprobante = autorizacion.comprobante[0];


        if (typeof comprobante === 'string') {
          this.xmlToJson(comprobante).then(response => this.ProcesaCargaXmlFormatoObjeto(response, autorizacion, estado[0], numAuto));
        } else {
          console.log(comprobante)
          if (comprobante.hasOwnProperty('factura')) {

            //this.xmlToJson(value).then(response => this.ProcesaCargaXml(response));


            let factura = comprobante.factura[0];
            let ruccliente = comprobante.factura[0].infoFactura[0].identificacionComprador[0];


            let fechaemision = comprobante.factura[0].infoFactura[0].fechaEmision[0];
            let rucproveedor = comprobante.factura[0].infoTributaria[0].ruc[0];
            let nombreproveedor = comprobante.factura[0].infoTributaria[0].razonSocial[0];
            //let nombreComercial = comprobante.factura[0].infoTributaria[0].nombreComercial[0];
            let direcProveedor = comprobante.factura[0].infoTributaria[0].dirMatriz[0];
            let numDocumento = comprobante.factura[0].infoTributaria[0].estab[0] + comprobante.factura[0].infoTributaria[0].ptoEmi[0] + comprobante.factura[0].infoTributaria[0].secuencial[0];

            let detalles = comprobante.factura[0].detalles[0];
            this.lcargando.ctlSpinner(false);

            this.ref = this.dialogService.open(CcModalCargaxmlComprasComponent, {
              data: {
                fechaemision: fechaemision,
                ruccliente: ruccliente,
                rucproveedor: rucproveedor,
                nombreproveedor: nombreproveedor,
                direcProveedor: direcProveedor,
                numAuto: numAuto,
                numDocumento: numDocumento,
                detalles: detalles
              },
              header: 'Carga Factura XML',
              width: '70%',
              contentStyle: { "max-height": "500px", "overflow": "auto" },
              baseZIndex: 100
            });

            this.ref.onClose.subscribe((DetailXML: any) => {

              if (DetailXML !== undefined) {


                this.lcargando.ctlSpinner(true);


                //console.log(DetailXML);
                this.buyProv.fk_id_proveedor = DetailXML.fk_id_proveedor;
                this.buyProv.proveedor_name = DetailXML.proveedor_name;
                this.buyProv.identificacion_proveedor = DetailXML.identificacion_proveedor;


                let fech_format = new Date(DetailXML.fecha.split('/')[2] + '-' + DetailXML.fecha.split('/')[1] + '-' + DetailXML.fecha.split('/')[0]);
                fech_format.setDate(fech_format.getDate() + 1);

                this.fecha_compra = fech_format;
                this.buyProv.num_doc = DetailXML.numero;
                this.buyProv.num_aut = DetailXML.autorizacion;

                this.contableService.getRetencionFuenteCompras().subscribe(res => {
                  this.rete_fuente = res['data'];

                  this.contableService.getRetencionIvaCompras().subscribe(res => {
                    this.rte_iva = res;

                    let data = { fields: ["IMPUESTOS"] };
                    this.contableService.ObtenerCatalogoGeneral(data).subscribe(res => {

                      let catalogo = res['data']['catalogs'];
                      this.impuestos = catalogo['IMPUESTOS'];

                      this.dataProducto = [];

                      DetailXML.detalle.forEach(element => {

                        this.dataProducto.push({
                          cod_anexo_iva: element.cod_anexo_iva,
                          cod_iva: element.cod_iva,
                          porce_iva: element.porce_iva,
                          cod_anexo_fte: element.cod_anexo_fte,
                          cod_fte: element.cod_fte,
                          porce_fte: element.porce_fte,
                          subtotal_noobjeto: parseFloat(element.subtotal_noobjeto),
                          subtotal_excento: parseFloat(element.subtotal_excento),
                          subtotal_cero: parseFloat(element.subtotal_cero),
                          subtotal_iva: parseFloat(element.subtotal_iva),
                          iva_detalle: parseFloat(element.iva_detalle),
                          fk_producto: element.fk_producto,
                          impuesto: element.impuesto.toString(),
                          rte_fuente: element.rte_fuente,
                          rte_iva: element.rte_iva,
                          centro: element.centro,
                          nombre: element.nombre,
                          codigo: element.codigo,
                          observacion: element.observacion,
                          cantidad: parseFloat(element.cantidad),
                          precio: parseFloat(element.precio),
                          desc: parseFloat(element.desc),
                          subtotalItems: parseFloat(element.subtotalItems),
                          totalItems: parseFloat(element.totalItems),
                          paga_iva: element.paga_iva
                        })
                      });


                      this.calculaImpuestoIva();
                      this.sumTotalizados();
                      this.lcargando.ctlSpinner(false);


                    }, error => {
                      this.toastr.info(error.error.message);
                      this.lcargando.ctlSpinner(false);
                    })
                  }, error => {
                    this.toastr.info(error.error.message);
                    this.lcargando.ctlSpinner(false);
                  })
                }, error => {
                  this.toastr.info(error.error.message);
                  this.lcargando.ctlSpinner(false);
                })

              }
            });

          } else {
            this.toastr.info('El xml no pertenece a una factura');
            this.lcargando.ctlSpinner(false);
          }

        }



      } else {
        this.toastr.info('El comprobantes no se encuentra autorizado');
        this.lcargando.ctlSpinner(false);
      }

    } else {
      this.toastr.info('El formato del archivo no es valido, por favor verificar que se encuentre autorizado.');
      this.lcargando.ctlSpinner(false);
    }

  }


  async ProcesaCargaXmlFormatoObjeto(result, autorizacion, estado, numAuto) {

    if (estado === "AUTORIZADO") {

      let comprobante = result;

      console.log(comprobante)

      if ('factura' in comprobante) {

        //this.xmlToJson(value).then(response => this.ProcesaCargaXml(response));


        let factura = comprobante.factura;
        let ruccliente = comprobante.factura.infoFactura[0].identificacionComprador[0];


        let fechaemision = comprobante.factura.infoFactura[0].fechaEmision[0];
        let rucproveedor = comprobante.factura.infoTributaria[0].ruc[0];
        let nombreproveedor = comprobante.factura.infoTributaria[0].razonSocial[0];

        //let nombreComercial = comprobante.factura.infoTributaria[0].nombreComercial[0];

        let direcProveedor = comprobante.factura.infoTributaria[0].dirMatriz[0];
        let numDocumento = comprobante.factura.infoTributaria[0].estab[0] + comprobante.factura.infoTributaria[0].ptoEmi[0] + comprobante.factura.infoTributaria[0].secuencial[0];

        let detalles = comprobante.factura.detalles[0];
        this.lcargando.ctlSpinner(false);

        this.expandCargaXml(comprobante)

        /* this.ref = this.dialogService.open(CcModalCargaxmlComprasComponent, {
          data: {
            fechaemision: fechaemision,
            ruccliente: ruccliente,
            rucproveedor: rucproveedor,
            nombreproveedor: nombreproveedor,
            direcProveedor: direcProveedor,
            numAuto: numAuto,
            numDocumento: numDocumento,
            detalles: detalles
          },
          header: 'Carga Factura XML',
          width: '70%',
          contentStyle: { "max-height": "500px", "overflow": "auto" },
          baseZIndex: 100
        }); */

        /* this.ref.onClose.subscribe((DetailXML: any) => {

          if (DetailXML !== undefined) {


            this.lcargando.ctlSpinner(true);


            this.buyProv.fk_id_proveedor = DetailXML.fk_id_proveedor;
            this.buyProv.proveedor_name = DetailXML.proveedor_name;
            this.buyProv.identificacion_proveedor = DetailXML.identificacion_proveedor;

            let fech_format = new Date(DetailXML.fecha.split('/')[2] + '-' + DetailXML.fecha.split('/')[1] + '-' + DetailXML.fecha.split('/')[0]);
            fech_format.setDate(fech_format.getDate() + 1);


            this.fecha_compra = fech_format;
            this.buyProv.num_doc = DetailXML.numero;
            this.buyProv.num_aut = DetailXML.autorizacion;

            this.contableService.getRetencionFuenteCompras().subscribe(res => {
              this.rete_fuente = res['data'];

              this.contableService.getRetencionIvaCompras().subscribe(res => {
                this.rte_iva = res;

                let data = { fields: ["IMPUESTOS"] };
                this.contableService.ObtenerCatalogoGeneral(data).subscribe(res => {

                  let catalogo = res['data']['catalogs'];
                  this.impuestos = catalogo['IMPUESTOS'];

                  this.dataProducto = [];

                  DetailXML.detalle.forEach(element => {

                    this.dataProducto.push({
                      cod_anexo_iva: element.cod_anexo_iva,
                      cod_iva: element.cod_iva,
                      porce_iva: element.porce_iva,
                      cod_anexo_fte: element.cod_anexo_fte,
                      cod_fte: element.cod_fte,
                      porce_fte: element.porce_fte,
                      subtotal_noobjeto: parseFloat(element.subtotal_noobjeto),
                      subtotal_excento: parseFloat(element.subtotal_excento),
                      subtotal_cero: parseFloat(element.subtotal_cero),
                      subtotal_iva: parseFloat(element.subtotal_iva),
                      iva_detalle: parseFloat(element.iva_detalle),
                      fk_producto: element.fk_producto,
                      impuesto: element.impuesto.toString(),
                      rte_fuente: element.rte_fuente,
                      rte_iva: element.rte_iva,
                      centro: element.centro,
                      nombre: element.nombre,
                      codigo: element.codigo,
                      observacion: element.observacion,
                      cantidad: parseFloat(element.cantidad),
                      precio: parseFloat(element.precio),
                      desc: parseFloat(element.desc),
                      subtotalItems: parseFloat(element.subtotalItems),
                      totalItems: parseFloat(element.totalItems),
                      paga_iva: element.paga_iva
                    })
                  });


                  this.calculaImpuestoIva();
                  this.sumTotalizados();
                  this.lcargando.ctlSpinner(false);


                }, error => {
                  this.toastr.info(error.error.message);
                  this.lcargando.ctlSpinner(false);
                })
              }, error => {
                this.toastr.info(error.error.message);
                this.lcargando.ctlSpinner(false);
              })
            }, error => {
              this.toastr.info(error.error.message);
              this.lcargando.ctlSpinner(false);
            })

          }
        }); */

      } else {
        this.toastr.info('El xml no pertenece a una factura');
        this.lcargando.ctlSpinner(false);
      }





    } else {
      this.toastr.info('El comprobantes no se encuentra autorizado');
      this.lcargando.ctlSpinner(false);
    }


  }



  async xmlToJson(string: string) {
    try {
      const json = await xml2js.parseStringPromise(string);
      return json;
    } catch (e) {
      return null;
    }
  }

  descargarPdf(){

    window.open(environment.ReportingUrl + "rpt_compras.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_compra=" + this.id_compra, '_blank')

  }

  verReporteRetencion(){
    window.open(environment.ReportingUrl + "rpt_retencion_comprobante.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_retencion=" + this.id_retencion, '_blank')

  }

  exportExcelCuentas(){
    if(this.dataCuenta.length > 0){
      (this as any).mensajeSpinner = "Generando Archivo Excel...";
      this.lcargando.ctlSpinner(true);
      let data = {
        title: 'Cuentas',
        rows:  this.dataCuenta
      }
      console.log(data);
      this.xlsService.exportExcelCuentasCompras(data, 'Cuentas')
      // let tipo = 'Cuentas'
      // this.exportAsXLSX(this.dataCuenta,tipo);
      this.lcargando.ctlSpinner(false);
    }else {
      this.toastr.info("No hay datos para exportar")
    }


  }

  exportExcelAsiento(){
    if(this.fieldsDaily.length > 0){

      (this as any).mensajeSpinner = "Generando Archivo Excel...";
      this.lcargando.ctlSpinner(true);
      let data = {
        title: 'Asiento',
        rows:  this.fieldsDaily
      }
      console.log(data);
    this.xlsService.exportExcelAsientoCompras(data, 'Asiento')
      // let tipo = 'Asiento'
      // this.exportAsXLSX(this.fieldsDaily,tipo);
      this.lcargando.ctlSpinner(false);
    }else{
      this.toastr.info("No hay datos para exportar")
    }
  }
  exportExcelAsientoAnticipos(){


//this.fieldsDaily
    if(this.fieldsDaily.length > 0){
      const filteredRows = this.fieldsDaily.filter(f => f.tipo_detalle === 'ANTICIPO' || f.tipo_detalle === 'ANTCXP');
      (this as any).mensajeSpinner = "Generando Archivo Excel...";
      this.lcargando.ctlSpinner(true);
      let data = {
        title: 'Asiento Anticipos',
        rows:  filteredRows
      }
      console.log(data);
    this.xlsService.exportExcelAsientoCompras(data, 'Asiento Anticipos')

      this.lcargando.ctlSpinner(false);
    }else{
      this.toastr.info("No hay datos para exportar")
    }
  }

  exportExcelAsientoMultas(){


    //this.fieldsDaily
        if(this.fieldsDaily.length > 0){
          const filteredRows = this.fieldsDaily.filter(f => f.tipo_detalle === 'MULTA' || f.tipo_detalle === 'MUCXP');
          (this as any).mensajeSpinner = "Generando Archivo Excel...";
          this.lcargando.ctlSpinner(true);
          let data = {
            title: 'Asiento Multas',
            rows:  filteredRows
          }
          console.log(data);
        this.xlsService.exportExcelAsientoCompras(data, 'Asiento Multas')

          this.lcargando.ctlSpinner(false);
        }else{
          this.toastr.info("No hay datos para exportar")
        }
      }

  exportAsXLSX(excelData,titpo) {
    this.excelService.exportAsExcelFile(excelData, titpo);
  }

   quitarGuion(str){
    console.log(str)
    let strFormat =str.replace(/-/g, "");
    console.log(strFormat)
    return this.buyProv.num_doc= strFormat

    }
    generarRetencion(){


      Swal.fire({
        title: "Atención!!",
        text: "¿Seguro desea generar la retención de esta compra?",
        //icon: "warning",
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          (this as any).mensajeSpinner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let data = {
            "anio": Number(moment(this.fecha_compra).format('YYYY')),
            "mes": Number(moment(this.fecha_compra).format('MM'))
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {

              (this as any).mensajeSpinner = "Generando retención...";
              this.lcargando.ctlSpinner(true);
              let datosRetencion = {

                'fk_usuario_trans': this.dataUser.id_usuario,
                'id_compra': this.id_compra,
                'doc_proveedor': this.buyProv.fk_id_proveedor,
                'fecha_emision': this.pipe.transform(this.fecha_compra, 'yyyy-MM-dd'),
                'ip': this.commonServices.getIpAddress(),
                'id_controlador': myVarGlobals.fProveeduriaCompras

              };

              this.comSrv.GeneraRetencionesCompraProv(datosRetencion).subscribe(
                res => {
                  if (res["status"] == 1) {
                    this.lcargando.ctlSpinner(false);

                    Swal.fire({
                      icon: "success",
                      title: "Retención generada con éxito!",
                      text: res["message"],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                    })
                    if(res['data'].isactive == 1){
                      this.retencionIsActive = true
                      this.id_retencion = res['data'].id_retencion
                      this.num_retencion = res['data'].num_retencion
                      this.vmButtons[7].habilitar= true
                    }else{
                      this.num_retencion = undefined
                      this.id_retencion = undefined
                      this.retencionIsActive = false
                    }
                  }

              }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.message);

              })

            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

            }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.mesagge);
            })

        }
      });



    }

filterWithAccount(list: any[]) {
  return list.filter((item: any) => item.account)
}

  expandCuentasPorPagar(idx: number,c:any) {
    console.log(c.codigo_presupuesto);
    if (this.buyProv.fk_id_proveedor > 0) {

      if ((this.buyProv.num_doc !== "") && (typeof (this.buyProv.num_doc) !== 'undefined')) {

        if ((this.buyProv.num_aut !== "") && (typeof (this.buyProv.num_aut) !== 'undefined')) {
          //this.modalService.open(ModalCuentasPorPagarComponent, {size: 'xl', backdrop: 'static'})
          const modalInvoice = this.modalService.open(ModalCuentasPorPagarComponent, {
            size: "xl",
            backdrop: "static",
            windowClass: "viewer-content-general",
          });
          modalInvoice.componentInstance.partida = c.codigo_presupuesto;//'840104';
          this.cuentaIdx = idx
        } else {
          this.toastr.info("Debe agregar un numero de autorizacion comprobante valido.");
        }
      } else {
        this.toastr.info("Debe agregar el numero de comprobante de proveedor a registrar, por favor verificar.");
      }

    } else {
      this.toastr.info("No ha ingresado la información del proveedor, por favor verificar");
    }
  }








  expandCuentasRteFte(idx: number) {
    if (this.buyProv.fk_id_proveedor > 0) {

      if ((this.buyProv.num_doc !== "") && (typeof (this.buyProv.num_doc) !== 'undefined')) {

        if ((this.buyProv.num_aut !== "") && (typeof (this.buyProv.num_aut) !== 'undefined')) {
          this.modalService.open(ModalCuentaRetFuenteComponent, {size: 'xl', backdrop: 'static'})
          this.cuentaIdx = idx
        } else {
          this.toastr.info("Debe agregar un numero de autorizacion comprobante valido.");
        }
      } else {
        this.toastr.info("Debe agregar el numero de comprobante de proveedor a registrar, por favor verificar.");
      }

    } else {
      this.toastr.info("No ha ingresado la información del proveedor, por favor verificar");
    }

  }

  expandCuentasRteIva(idx: number) {
    if (this.buyProv.fk_id_proveedor > 0) {

      if ((this.buyProv.num_doc !== "") && (typeof (this.buyProv.num_doc) !== 'undefined')) {

        if ((this.buyProv.num_aut !== "") && (typeof (this.buyProv.num_aut) !== 'undefined')) {
          this.modalService.open(ModalCuentaRetIvaComponent, {size: 'xl', backdrop: 'static'})
          this.cuentaIdx = idx
        } else {
          this.toastr.info("Debe agregar un numero de autorizacion comprobante valido.");
        }
      } else {
        this.toastr.info("Debe agregar el numero de comprobante de proveedor a registrar, por favor verificar.");
      }

    } else {
      this.toastr.info("No ha ingresado la información del proveedor, por favor verificar");
    }
  }

  async getLatest() {
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Cargando Registro'
    try {
      const response = await this.comSrv.getUltimaCompra()
      console.log(response)
      if (response.data) {
        // this.totalRecords = response.data.total
        this.lastRecord = response.data.id
        this.comSrv.listaCompras$.emit(response.data)
        // this.lcargando.ctlSpinner(false)
      } else {
        this.cancel()
        this.lcargando.ctlSpinner(false)
        Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
      }
      //
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Registro')
    }
  }

recalculateAfectacion(){

this.tbl_partidas = [];
  this.dataCuenta.forEach((element,index) => {

    // let tipo=''
    let obj = {
      cuenta_detalle: '(' + element.codigo_cuenta + ') ' + element.nombre_cuenta,
      cod_anexo_iva: element.cod_riva_anexo,
      cod_iva: element.cod_riva,
      porce_iva: element.porcentaje_riva,
      cod_anexo_fte: element.cod_rft_anexo,
      codigo_partida_icp: element.codigopartida,
      cod_fte: element.cod_rft_anexo,
      porce_fte: element.porcentaje_rft,
      porce_ice: element.porcentaje_ice,
      subtotal_noobjeto: element.subtotal_noobjeto,
      subtotal_excento: element.subtotal_excento,
      subtotal_cero: element.subtotal_cero,
      subtotal_iva: element.subtotal_iva,
      iva_detalle: element.iva_detalle_item,
      // ice_detalle: element.ice_detalle_item,
      ice_sri:  this.iceSri.find((c)=> c.id ==element.fk_ice)?.id,
      fk_producto: element.fk_producto,
      impuesto: element.codigo_impuesto_iva?.toString(),
      rte_fuente: element.codigo_retencion_fuente,
      rte_iva: element.codigo_retencion_iva,
      centro:element.centro_costo,
      centro_nombre: this.centros.find((c)=> c.id ==element.centro_costo)?.nombre,
      nombre: element.nombre_cuenta,
      codigo: element.codigo_cuenta,
      observacion: element.observacion,
      cantidad: element.cantidad,
      precio: element.precio,
      desc: element.descuento,
      subtotalItems: parseFloat(element.subtotalitems),
      totalItems: parseFloat(element.totalitems),
      paga_iva: element.paga_iva,
      cuenta_por_pagar:element.var_nombre_cxp,
      cod_cuenta_por_pagar: element.var_cod_codigo_cxp,
      cuenta_anticipo:element.nom_cuenta_anticipo,
      cod_cuenta_anticipo: element.cod_cuenta_anticipo,
      valor_anticipo: parseFloat(element.valor_anticipo),
      cuenta_multa:element.nom_cuenta_multa,
      cod_cuenta_multa: element.cod_cuenta_multa,
      valor_multa: parseFloat(element.valor_multa),
      codigo_presupuesto:  element.codigo_partida,
      retencion: element.total_rft,
      retencion_iva: element.total_riva,
      ice_detalle: element.total_ice

    }

    const item = this.tbl_partidas.find((p: any) => p.codigo == element.codigo_presupuesto)
    if (!item && element.codigo_presupuesto != null) {
      this.tbl_partidas.push({
        codigo: element.codigo_presupuesto,
        descripcion: element.nombrepresupuesto ?? element.presupuesto?.nombre ?? "",
        valor: 0
      })
    }
    this.tbl_partidas.find((p: any) => p.codigo == element.codigo_presupuesto).valor += parseFloat(element.subtotalItems) //subtotalitems









  });


  this.buyProv.subtotal = 0.00;
  this.buyProv.valor_iva = 0.00;
  this.buyProv.total = 0.00;/*
  this.dataProducto.splice(index, 1); */
/*dataProducto*/
  this.dataCuenta.forEach(element => {
    this.buyProv.subtotal += element.totalItems;
  });
  this.buyProv.valor_iva = this.buyProv.subtotal * (this.buyProv.iva / 100);
  this.buyProv.total = parseFloat(this.buyProv.subtotal + this.buyProv.valor_iva+parseInt(this.buyProv.propina)).toFixed(2);
  this.buyProv.valor_iva = parseFloat(this.buyProv.valor_iva).toFixed(2);
  this.buyProv.subtotal = parseFloat(this.buyProv.subtotal).toFixed(2);


  /** */
  this.totalPagar = this.buyProv.total - this.buyProv.total_retencion - this.buyProv.total_anticipo - this.buyProv.total_multa
  this.buyProv.saldo = this.totalPagar;
  /** */
  this.totalPartidas = 0;
  this.totalPartidas = this.tbl_partidas.reduce((acc: number, curr: any) => acc + curr.valor, 0)

}


  async handleEnter({key}) {
    if (key === 'Enter') {
      if (this.lastRecord == null) {
        await this.getLatest()
        return
      }

      this.lcargando.ctlSpinner(true);
      (this as any).mensajeSpinner = 'Cargando Registro'
      try {
        const response = await this.comSrv.getComprasGeneradas({params: {filter: {id: this.lastRecord}, paginate: {page: 1, perPage: 1}}}) as any
        console.log(response)
        if (response.data.data.length > 0) {
          this.totalRecords = response.data.total
          this.comSrv.listaCompras$.emit(response.data.data[0])
          // this.lcargando.ctlSpinner(false)
        } else {
          this.cancel()
          this.lcargando.ctlSpinner(false)
          Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
        }
        //
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error cargando Registro')
      }
    }
  }


  async consultaRegGuardado(id_compra) {

      this.lcargando.ctlSpinner(true);
      (this as any).mensajeSpinner = 'Cargando Registro'
      try {
        const response = await this.comSrv.getComprasGeneradas({params: {filter: {id: id_compra}, paginate: {page: 1, perPage: 1}}}) as any
        console.log(response)
        if (response.data.data.length > 0) {
          this.totalRecords = response.data.total
          this.comSrv.listaCompras$.emit(response.data.data[0])
          // this.lcargando.ctlSpinner(false)
        } else {
          this.cancel()
          this.lcargando.ctlSpinner(false)
          Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
        }
        //
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error cargando Registro')
      }

  }
  tabSelected(tab){
    console.log(tab);
    if(tab == "cuentas"){
    this.mostrarCuentas = true;}else
    {
      this.mostrarCuentas = false;
    }
  }

  async getPrevRecord() {
    this.lastRecord -= 1
    await this.handleEnter({key: 'Enter'})
  }

  async getNextRecord() {
    this.lastRecord += 1
    await this.handleEnter({key: 'Enter'})
  }

  async anularCompra() {
    const result = await Swal.fire({
      titleText: 'Anulacion de Compra',
      input: 'text',
      inputValidator: (value) => {
        if (!value) {
          return "Debe ingresar un motivo.";
        }
      },
      text: 'Esta seguro/a desea anular esta compra? Ingrese un motivo.',
      showCancelButton: true,
      confirmButtonText: 'Anular',
      cancelButtonText: 'Cancelar'
    })

    // console.log(result.value)
    // return;

    if (result.isConfirmed) {
      (this as any).mensajeSpinner = "Verificando período contable";
      this.lcargando.ctlSpinner(true);
      let data = {
        "anio": Number(moment(this.fecha_compra).format('YYYY')),
        "mes": Number(moment(this.fecha_compra).format('MM'))
      }
      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
        try {
        if (res["data"][0].estado !=='C') {
          this.lcargando.ctlSpinner(true);
          (this as any).mensajeSpinner = 'Anulando Compra'
          try {
            const response = await this.comSrv.anularCompra({compra: this.id_compra, motivo: result.value})
            console.log(response)
            //
            this.vmButtons[8].habilitar = true
            this.lcargando.ctlSpinner(false)
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error anulando Compra')
          }
        } else {

            this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
            this.lcargando.ctlSpinner(false);
        }
        } catch (error) {
            console.error("Error occurred:", error);
            this.lcargando.ctlSpinner(false);
        }
    });







    }
  }

}
