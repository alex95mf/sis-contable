import { Component, OnInit, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as myVarGlobals from '../../../../global';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { contableConfService } from 'src/app/view/panel-control/parametro/contable/contable.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CierreMesService } from '../../ciclos-contables/cierre-de-mes/cierre-mes.service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
//import Swal from "sweetalert2";
//import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FacturasService } from './facturas.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiferedBuyProvComponent } from './difered-buy-prov/difered-buy-prov.component';
import { ShowInvoicesComponent } from './show-invoices/show-invoices.component';
import { CcModalTablaComprasComponent } from 'src/app/config/custom/cc-modal-tabla-compras/cc-modal-tabla-compras.component';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { CcModalTablaProveedoresComponent } from 'src/app/config/custom/cc-modal-tabla-proveedores/cc-modal-tabla-proveedores.component';
import { CcModalTablaProductosComponent } from 'src/app/config/custom/cc-modal-tabla-productos/cc-modal-tabla-productos.component';
import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';
import { CcModalCargaxmlComprasComponent } from 'src/app/config/custom/cc-modal-cargaxml-compras/cc-modal-cargaxml-compras.component';
import { ModalFacturasComponent } from './modal-facturas/modal-facturas.component';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { BusquedaEgresosComponent } from './busqueda-egresos/busqueda-egresos.component';
import { DiarioService } from '../diario/diario.service';

import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { MenuItem } from 'primeng/api';

import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Socket } from "src/app/services/socket.service";

import * as $ from 'jquery';
import { ModalBusquedaFacturaComponent } from './modal-busqueda-factura/modal-busqueda-factura.component';

@Component({
standalone: false,
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss'],
  providers: [DialogService, MessageService]
})
export class FacturasComponent implements OnInit {


  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  detalleImpuesto: any = [];
  detalleIceSri: any = [];
  detalleImpuestoTemp: any = [];
  files: any[] = [];
  fieldsDaily: Array<any> = [];
  ListaAnticipos: any[] = [];
  ListaMultas: any[] = [];
  ListaCondiciones: any = [];

  tipo_documento: any = [];
  punto_emision: any = [];

  motivos = [
    {value:'VB', label:'Venta de Bienes'}
  ];

  msgs2: MessageService[];
  isPouchesShared: boolean = false;
  busqueda: boolean = false;

  verifyRestore = false;
  iceSri: any;
  ice: any;


  permissions: any;
  selectContri:any


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  fecha: Date = new Date();




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
  ]
  buyProv: any = {
    CodacountMulta: '',
    acountMulta: '',
    motivo_multa: '',
    multa: (0.00).toFixed(2),
    num_contrato: '',
    tipo_documento: 0,
    sustento: '01',
    //proveedor_name: '',
    contribuyente_name: '',
    anio: 2022, mes: 9,
    //identificacion_proveedor: '',
    identificacion_contribuyente: '',
    tipo_identificacion: '01',
    //fk_id_proveedor: 0,
    fk_id_contribuyente: 0,
    subtotal: (0.00).toFixed(2),
    subcero: (0.00).toFixed(2),
    objeto: (0.00).toFixed(2),
    exento: (0.00).toFixed(2),
    descuento: (0.00).toFixed(2),
    propina: (0.00).toFixed(2),
    otro_impuesto: (0.00).toFixed(2),
    servicio: (0.00).toFixed(2),
    valor_iva: (0.00).toFixed(2),
    total: (0.00).toFixed(2),
    tipo_pago: 0, forma_pago: 0,
    fk_usuario_receive: 0,
    isActive: this.estados[0],
    metodo_pago: 0 ,
    saldo: 0.00,
    condicion: 0,
    total_retencion: (0.00).toFixed(2),
    total_anticipo: (0.00).toFixed(2),
    total_multa: (0.00).toFixed(2),
    estado:"P",
    pto_emision: 0,
    establecimiento: '',
    punto_emision : '',
    secuencia_numero : '',
    id_tipo_documento: 0,
    fk_egreso_bodega: 0,
  };



  dataProducto: any = [{ cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false, LoadOpcionCentro: false, subtotal_noobjeto: (0.00).toFixed(2), subtotal_excento: (0.00).toFixed(2), subtotal_cero: (0.00).toFixed(2), subtotal_iva: (0.00).toFixed(2), InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2), fk_producto: 0, impuesto: 2, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 }];
  dataCuenta: any = [{
    cod_anexo_iva: "",
    cod_iva: "",
    porce_iva: 0,
    cod_anexo_fte: "",
    cod_fte: "",
    porce_fte: 0,
    cod_ice: "",
    porce_ice: 0,
    isRetencionIva: false,
    LoadOpcionImpuesto: false,
    LoadOpcionIceSri: false,
    LoadOpcionReteFuente: false,
    LoadOpcionRteIva: false,
    LoadOpcionCentro: false,
    subtotal_noobjeto: (0.00).toFixed(2),
    subtotal_excento: (0.00).toFixed(2),
    subtotal_cero: (0.00).toFixed(2),
    subtotal_iva: (0.00).toFixed(2),
    InputDisabledCantidad: true,
    iva_detalle: (0.00).toFixed(2),
    cuenta_detalle: 0, impuesto: 2,
    rte_fuente: 0,
    rte_iva: 0,
    centro: 0,
    nombre: null,
    codigo: null,
    observacion: null,
    observacion_adicional: null,
    cantidad: null,
    precio: null,
    desc: (0.00).toFixed(2),
    subtotalItems: 0.00,
    totalItems: 0.00,
    paga_iva: 1,
    cod_cuenta_por_pagar: '',
    cuenta_por_pagar: '',
    codigo_partida: '' }];

  actions: any = { btnSave: false, btnmod: false, btnfac: false, btncancel: false };

  dataCargaXML: any = [{ cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false, LoadOpcionCentro: false, subtotal_noobjeto: (0.00).toFixed(2), subtotal_excento: (0.00).toFixed(2), subtotal_cero: (0.00).toFixed(2), subtotal_iva: (0.00).toFixed(2), InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2), fk_producto: 0, impuesto: 2, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 }];


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

  flagBtnDired: any = false;
  dataDifered: any = null;
  last_doc: any;
  ivaAux: any;
  arrayProveedor: any;
  vmButtons: any;
  id_solicitud: any;

  nombre_documento: any;
  motivo: any;

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
  egresosBodega:any = [];

  totalRetencion = 0;
  totalPagar = 0;
  totalAnticipos = 0;
  totalMultas = 0;

  contribuyenteActive: any = {
    razon_social: "",
    num_documento:"",
    tipo_documento:""
  };
  lastRecord: number|null = null
  totalRecords: number = 0
  constructor(
    private diarioSrv: DiarioService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private commonVarSrv: CommonVarService,
    private contableService: contableConfService,
    private comSrv: FacturasService,
    private modalService: NgbModal,
    private cierremesService: CierreMesService,
    public dialogService: DialogService,
    public messageService: MessageService,
    // aqui
    private socket: Socket
  ) {
    this.comSrv.facturaSelected$.subscribe(
      async (factura: any) => {
        console.log(factura)

        // this.busqueda= true
        this.ExistenItems= true;
        this.cargarEgresosBodega(true)
        this.isAsignaOrden=false
        // this.buyProv = factura;
        this.id_compra= factura.id_factura;
        this.vmButtons[6].habilitar = false;

        let fecha_compra =  new Date(factura.fecha_compra)
        Object.assign(this.buyProv, {
          fk_factura: factura.id_factura,
          fac_numero: factura.num_doc,
          fac_fechaemision: moment(new Date(fecha_compra.getFullYear(),fecha_compra.getMonth(),fecha_compra.getDate() + 1)).format('YYYY-MM-DD'),
          fac_valor: factura.total,
        })

        this.buyProv.contribuyente_name = factura.contribuyente?.razon_social
        this.contribuyenteActive.razon_social=  factura.contribuyente?.razon_social
        this.contribuyenteActive.tipo_documento=  factura.contribuyente?.tipo_documento
        this.contribuyenteActive.num_documento=  factura.contribuyente?.num_documento
        this.buyProv.identificacion_contribuyente = factura.ruc
        this.buyProv.fk_egreso_bodega = factura.fk_egreso_bodega

        // let fecha_compra =  new Date(factura.fecha_compra)
        // this.fecha_compra=  new Date(fecha_compra.getFullYear(),fecha_compra.getMonth(),fecha_compra.getDate() + 1);

        // this.buyProv.tipo_documento = factura.tipo_documento_sustento
        const ptoEmisionResponse = await this.comSrv.getPuntosEmision(factura.tipo_documento_sustento) as any
        console.log(ptoEmisionResponse)
        this.punto_emision = (ptoEmisionResponse.data?.length > 0) ? ptoEmisionResponse.data : []

        this.cargaInfoSustento();
        this.buyProv.sustento = factura.sustento_tirbutario
        this.CargarComboUsuario()

        this.buyProv.isActive = factura.isactive
        this.buyProv.fk_usuario_receive = factura.usuario?.id_usuario

        this.buyProv.pto_emision = factura.id_punto_emision


        this.buyProv.subtotal = factura.subtotal;
        this.buyProv.total_impuesto = factura.subtotal;
        this.buyProv.valor_iva = factura.valor_iva
        this.buyProv.subcero = factura.total_cero;
        this.buyProv.objeto = factura.total_noobjeto;
        this.buyProv.exento = factura.total_exento;
        this.buyProv.descuento = factura.total_descuento;
        this.buyProv.propina = factura.propina;
        this.buyProv.otro_impuesto = factura.otro_impuesto;
        this.buyProv.servicio = factura.servicios;
        this.buyProv.total = factura.total;
        this.motivo = factura.motivo;


        if (factura.detalle_cuentas.length > 0) {
          this.dataCuenta = [];
          this.centros = await this.contableService.getListaCentroCostosAsync();
          this.iceSri = await this.contableService.getIceSriAsync();

          this.CentrosPresupuesto()

          factura.detalle_cuentas.forEach((element,index) => {
            this.fieldsDaily=[]
            let obj = {
              cuenta_detalle: '(' + element.codigo_cuenta + ') ' + element.nombre_cuenta,
              cod_anexo_iva: element.cod_riva_anexo,
              cod_iva: element.cod_riva,
              porce_iva: element.porcentaje_riva,
              cod_anexo_fte: element.cod_rft_anexo,
              cod_fte: element.cod_rft_anexo,
              porce_fte: element.porcentaje_rft,
              porce_ice: element.porcentaje_ice,
              subtotal_noobjeto: element.subtotal_noobjeto,
              subtotal_excento: element.subtotal_excento,
              subtotal_cero: element.subtotal_cero,
              subtotal_iva: element.subtotal_iva,
              iva_detalle: element.iva_detalle_item,
              ice_detalle: element.ice_detalle_item,
              fk_producto: element.fk_producto,
              impuesto: element.codigo_impuesto_iva.toString(),
              ice_sri:  this.iceSri.find((c)=> c.id ==element.fk_ice)?.id,
              rte_fuente: element.codigo_retencion_fuente,
              rte_iva: element.codigo_retencion_iva,
              centro:element.centro_costo,
              centro_nombre: element.centro_costo != null ? this.centros?.find((c)=> c.id ==element.centro_costo)?.nombre : undefined,
              nombre: element.nombre_cuenta,
              codigo: element.codigo_cuenta,
              observacion: element.observacion,
              observacion_adicional: element.observacion_adicional,
              cantidad: element.cantidad,
              precio: element.precio,
              desc: element.descuento,
              subtotalItems: parseFloat(element.subtotalitems),
              totalItems: parseFloat(element.totalitems),
              paga_iva: element.paga_iva,
              codigo_presupuesto: element.codigo_partida != null ? element.codigo_partida : undefined,
              nombre_catalogo_presupuesto: element.codigo_partida != null ? this.catalogo_presupuesto?.find((c)=> c.codigo ==element.codigo_partida )?.nombre : undefined,
              cuenta_por_pagar:element.var_nombre_cxc,
              cod_cuenta_por_pagar: element.var_cod_codigo_cxc
            }
            this.dataCuenta.push(obj)
            this.getRetencionIva(index,this.dataCuenta);
          });
          this.generaPreviewAsientoContable();
        }
      }
    )

    this.comSrv.listaFacturas$.subscribe(
      async (res: any) => {
         console.log(res)

        // let retFuente = res.ret_fuente;
        // let sigList = await this.contableService.getRetencionIvaComprasAsync()
        // let retIva = res.ret_iva;
        // let otraLista = await this.contableService.getRetencionIvaComprasAsync()

        this.busqueda= true
        this.ExistenItems= true;
        this.cargarEgresosBodega(true)
        this.isAsignaOrden=false
        this.buyProv = res;
        this.id_compra= res.id_factura;
        this.vmButtons[6].habilitar = false;

        this.buyProv.contribuyente_name = res.contribuyente?.razon_social
        this.contribuyenteActive.razon_social=  res.contribuyente?.razon_social
        this.contribuyenteActive.tipo_documento=  res.contribuyente?.tipo_documento
        this.contribuyenteActive.num_documento=  res.contribuyente?.num_documento
        this.buyProv.identificacion_contribuyente = res.ruc
        this.buyProv.fk_egreso_bodega = res.fk_egreso_bodega

        if(res?.egreso_bodega?.detalles.length > 0){

          res?.egreso_bodega?.detalles.forEach(e => {
            let data= {
              nro_egreso: res.egreso_bodega?.num_doc,
              fecha: res.egreso_bodega?.fecha,
              descripcion:e?.producto?.nombre,
              codigo:e?.code_product,
              cantidad: e?.cantidad,
              precio_unitario:  e?.costo,
              total:  e?.costo_total,
              codigo_bienes:  e?.producto?.codigo_bienes,
            }
            this.egresosBodega.push(data)
           })
        }


        console.log( res.fecha_compra)
        let fecha_compra =  new Date(res.fecha_compra)
        this.fecha_compra=  new Date(fecha_compra.getFullYear(),fecha_compra.getMonth(),fecha_compra.getDate() + 1);

        //var f = res.fecha_compra;
        //this.fecha_compra=  new Date(res.fecha_compra.getDate() + "-"+ res.fecha_compra.getMonth()+ "-" +res.fecha_compra.getFullYear());
        console.log( this.fecha_compra)


        this.buyProv.tipo_documento = res.tipo_documento_sustento
        let data ={
          id: res.tipo_documento_sustento
        }
        this.CargarTipoDocumento();
        this.ChangeTipoDocumento(data)

        this.cargaInfoSustento();
        this.buyProv.sustento = res.sustento_tirbutario
        this.CargarComboUsuario()

        this.buyProv.isActive = res.isactive
        this.buyProv.fk_usuario_receive = res.usuario?.id_usuario

        this.buyProv.pto_emision = res.id_punto_emision


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
        this.motivo = res.motivo;


        if (res.detalle_cuentas.length > 0) {
          this.dataCuenta = [];
          this.centros = await this.contableService.getListaCentroCostosAsync();
          this.iceSri = await this.contableService.getIceSriAsync();

          console.log(this.centros)
          this.CentrosPresupuesto()

          console.log(this.catalogo_presupuesto)
          res.detalle_cuentas.forEach((element,index) => {
            this.fieldsDaily=[]
            let obj = {
              cuenta_detalle: '(' + element.codigo_cuenta + ') ' + element.nombre_cuenta,
              cod_anexo_iva: element.cod_riva_anexo,
              cod_iva: element.cod_riva,
              porce_iva: element.porcentaje_riva,
              cod_anexo_fte: element.cod_rft_anexo,
              cod_fte: element.cod_rft_anexo,
              porce_fte: element.porcentaje_rft,
              porce_ice: element.porcentaje_ice,
              subtotal_noobjeto: element.subtotal_noobjeto,
              subtotal_excento: element.subtotal_excento,
              subtotal_cero: element.subtotal_cero,
              subtotal_iva: element.subtotal_iva,
              iva_detalle: element.iva_detalle_item,
              ice_detalle: element.ice_detalle_item,
              fk_producto: element.fk_producto,
              impuesto: element.codigo_impuesto_iva.toString(),
              ice_sri:  this.iceSri.find((c)=> c.id ==element.fk_ice)?.id,
              rte_fuente: element.codigo_retencion_fuente,
              rte_iva: element.codigo_retencion_iva,
              centro:element.centro_costo,
              centro_nombre: element.centro_costo != null ? this.centros?.find((c)=> c.id ==element.centro_costo)?.nombre : undefined,
              nombre: element.nombre_cuenta,
              codigo: element.codigo_cuenta,
              observacion: element.observacion,
              observacion_adicional: element.observacion_adicional,
              cantidad: element.cantidad,
              precio: element.precio,
              desc: element.descuento,
              subtotalItems: parseFloat(element.subtotalitems),
              totalItems: parseFloat(element.totalitems),
              paga_iva: element.paga_iva,
              codigo_presupuesto: element.codigo_partida != null ? element.codigo_partida : undefined,
              nombre_catalogo_presupuesto: element.codigo_partida != null ? this.catalogo_presupuesto?.find((c)=> c.codigo ==element.codigo_partida )?.nombre : undefined,
              cuenta_por_pagar:element.var_nombre_cxc,
              cod_cuenta_por_pagar: element.var_cod_codigo_cxc
            }
            // Object.assign(obj, {})
              //this.getCentroDetalle(index);
              this.dataCuenta.push(obj)
              this.getRetencionIva(index,this.dataCuenta);
              //this.ChangeImpuestoIva(this.rte_iva,this.dataCuenta,index)
          });
         // this.calculaImpuestoIva();
          this.generaPreviewAsientoContable();

        }

        //this.CargarComprasRegistradas(res)
        this.vmButtons[0].habilitar = true;

      }
    )
    this.comSrv.listaEgresos$.subscribe(
      async (res: any) => {
         console.log(res)
         this.buyProv.fk_egreso_bodega = res?.id_egreso_bodega
        if(res.detalles.length > 0){
          res.detalles.forEach(e => {
            let data= {
              nro_egreso: res.num_doc,
              fecha: res.fecha,
              descripcion:e?.producto?.nombre,
              codigo:e?.code_product,
              cantidad: e?.cantidad,
              precio_unitario:  e?.costo,
              total:  e?.costo_total,
              codigo_bienes:  e?.producto?.codigo_bienes,
            }
            this.egresosBodega.push(data)
           })
        }

      }
    )


    this.commonVarSrv.selectContribuyenteCustom.asObservable().subscribe(
      (res) => {
        console.log(res);
        this.contribuyenteActive = res;
        this.buyProv.fk_id_contribuyente = res['id_cliente'];
        this.buyProv.proveedor_name = res['razon_social'];
        this.buyProv.tipo_identificacion = (res['tipo_documento'] === 'Ruc') ? '01' : '02';
        this.buyProv.identificacion_contribuyente = res['num_documento'];
      }
    );

    // this.commonVarSrv.listenSetBuyProv.asObservable().subscribe(res => {

    //         this.buyProv = res;
    //         this.dataProducto = res['detalle'];
    //         this.dataDifered = res['type_difered'];
    //         this.vmButtons[0].habilitar = true;
    //         this.vmButtons[1].habilitar = false;
    //         this.flagBtnDired = (res['tipo_pago'] == 'Crédito') ? true : false;
    //         this.buyProv['last_doc'] = res['num_doc'];

    // })
  }

  ref: DynamicDialogRef;

  ngOnInit(): void {

    //new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })

    this.msgs2 = [
      { severity: 'info', summary: '', detail: 'Para realizar el registro de venta se requiere asignar la codigo contable de la cuenta por cobrar.' }
    ];

    this.serverSideSearch();

    this.tabmenu = [
      { label: 'ITEMS', icon: 'pi pi-fw pi-home' },
      { label: 'CUENTAS', icon: 'pi pi-fw pi-calendar' }
    ];

    this.vmButtons = [
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "ORDENES" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "FACTURAS" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      { orig: "btnsComprasProv", paramAccion: "", boton: { icon: "fa fa-file-pdf-0", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true }
    ];

    //this.fecha_compra = moment(this.fecha).format('YYYY-MM-DD');

    //this.fecha_compra =  new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);

    setTimeout(() => {
      this.getPermisions();
      this.cargaInfoFormaPago();
      this.cargaInfoSustento();
      this.CargarTipoDocumento();
    }, 10);


    /*incializamos los combos con select default */
    // this.tip_doc =
    //   [
    //     {
    //       nombre: 'Factura',
    //       id: '7'
    //     },
    //     {
    //       nombre: 'Nota de Débito',
    //       id: '14'
    //     },
    //     {
    //       nombre: 'Nota de Crédito',
    //       id: '22'
    //     }
    //   ]

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
          descripcion: 'IVA 12%'
        }
      ]

    this.tip_documeto =
      [
        {
          nombre: 'Factura de compra',
          id: 3
        },
        {
          nombre: 'Liquidación',
          id: 20
        }
      ]

    //this.buyProv.fk_doc = '3'
    //this.buyProv.tipo_documento = '7'
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
  }

  getPermisions() {

    this.lcargando.ctlSpinner(true);

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

        this.getimpuestos();
        this.getCatalogos();
        this.lcargando.ctlSpinner(false);

      }

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
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
  ChangeTipoDocumento(event){
    console.log(event);
    if (typeof event !== undefined && event !== '' && event !== null) {
      this.buyProv.id_tipo_documento = event.id;
      this.buyProv.codigo_tipo_documento = event.codigo;
      this.nombre_documento = event.nombre;
      this.lcargando.ctlSpinner(true);
      this.comSrv.getPuntosEmision(event.id).subscribe(res => {
       console.log(res)
       if(res['data']?.length > 0){
        this.punto_emision = res['data'];
       }

        this.lcargando.ctlSpinner(false);

      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })

    }
  }
  ChangePuntoEmision(event){
    console.log(event);
    if (typeof event !== undefined && event !== '' && event !== null) {

      this.buyProv.establecimiento = event.num_establecimiento;
      this.buyProv.punto_emision = event.num_punto_emision;
      this.buyProv.secuencia_numero = event.num_fact_serial;
    }
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

    console.log(this.buyProv.fk_id_contribuyente)

    if (this.buyProv.fk_doc === 3) {


      if (this.buyProv.fk_id_contribuyente > 0) {

        //if ((this.buyProv.num_doc !== "") && (typeof (this.buyProv.num_doc) !== 'undefined')) {
/*
          if ((this.buyProv.num_aut !== "") && (typeof (this.buyProv.num_aut) !== 'undefined')) {
 */
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

              if (cuentas) {
                this.CargarCuentas(cuentas, i);
              }

            });

        /*   } else {
            this.toastr.info("Debe agregar un numero de autorizacion comprobante valido.");
          } */
       // }
        // else {
        //   this.toastr.info("Debe agregar el numero de comprobante del contribuyente a registrar, por favor verificar.");
        // }

      } else {
        this.toastr.info("No ha ingresado la información del contribuyente, por favor verificar");
      }

    } else {
      this.toastr.info("La liquidación de compra solo puede ser generada con productos");
    }

  }



  onClickConsultaCuentasPorPagar(i) {

    if (this.buyProv.fk_doc === 3) {


      if (this.buyProv.fk_id_contribuyente > 0) {

        //if ((this.buyProv.num_doc !== "") && (typeof (this.buyProv.num_doc) !== 'undefined')) {

        /*   if ((this.buyProv.num_aut !== "") && (typeof (this.buyProv.num_aut) !== 'undefined')) {
 */
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

              if (cuentas) {
                this.CargarCuentasPorPagar(cuentas, i);
              }

            });

        /*   } else {
            this.toastr.info("Debe agregar un numero de autorizacion comprobante valido.");
          } */
        // } else {
        //   this.toastr.info("Debe agregar el numero de comprobante de contribuyente a registrar, por favor verificar.");
        // }

      } else {
        this.toastr.info("No ha ingresado la información del contribuyente, por favor verificar");
      }

    } else {
      this.toastr.info("La liquidación de compra solo puede ser generada con productos");
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

    let busqueda = (typeof this.buyProv.proveedor_name === 'undefined') ? "" : this.buyProv.proveedor_name;

    localStorage.setItem("busqueda_proveedores", busqueda)

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

       // if ((this.buyProv.num_doc !== "") && (typeof (this.buyProv.num_doc) !== 'undefined')) {

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

        // } else {
        //   this.toastr.info("Debe agregar el numero de comprobante de contribuyente a registrar, por favor verificar.");
        // }

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
      this.toastr.info("No ha ingresado la información del contribuyente, por favor verificar");
    }

  }

  generaPreviewAsientoContable = async () => {
    try {

      this.fieldsDaily = [];
      let DetailCount = 0;
      let TamñoRecorrido = this.dataCuenta.length;
      console.log(this.dataCuenta)

      await Promise.all(this.dataCuenta.map(async (element) => {

        this.Centros();
        this.CentrosPresupuesto();

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
                totalDetailPorPagar = TotalPorPagar + ((parseFloat(element.totalItems) + parseFloat(element.iva_detalle)));
                this.fieldsDaily[coddetailPorPagar - 1].credit = (totalDetailPorPagar /*- parseFloat(this.buyProv.multa)*/).toFixed(2);


              } else {

                this.fieldsDaily.unshift({
                  LoadOpcionCatalogoPresupuesto: false,
                  presupuesto: '',
                  codpresupuesto: '',
                  valor_presupuesto: 0.00,
                  account: element.cod_cuenta_por_pagar,
                  name: element.cuenta_por_pagar,
                  detail: "",
                  credit: ((parseFloat(element.totalItems) + parseFloat(element.iva_detalle)) /*- parseFloat(this.buyProv.multa)*/).toFixed(2),
                  debit: parseFloat('0.00').toFixed(2),
                  centro: 0,
                  tipo: 'P',
                  tipo_detalle: 'CXC',
                  disabled: true
                });

              }

            }

            this.fieldsDaily.push({
              LoadOpcionCatalogoPresupuesto: false,
              presupuesto:   element.nombre_catalogo_presupuesto,
              codpresupuesto: element.codigo_presupuesto,
              valor_presupuesto: (element.nombre_catalogo_presupuesto !== '' && element.nombre_catalogo_presupuesto !== null) ? parseFloat(element.totalItems).toFixed(2) : 0.00,
              account: element.codigo,
              name: element.nombre,
              detail: "",
              credit: parseFloat('0.00').toFixed(2),
              debit: parseFloat(element.totalItems).toFixed(2),
              centro: element.centro,
              tipo: 'A',
              tipo_detalle: 'GTO',
              disabled: (element.nombre_catalogo_presupuesto !== '' && element.nombre_catalogo_presupuesto !== null)  ? false : true
            });

          }


        } else {

          /* asignamos la cuenta por pagar */
          if (element.cuenta_por_pagar != '') {
            this.fieldsDaily.unshift({
              LoadOpcionCatalogoPresupuesto: false,
              presupuesto: '',
              codpresupuesto: '',
              valor_presupuesto: 0.00,
              account: element.cod_cuenta_por_pagar,
              name: element.cuenta_por_pagar,
              detail: "",
              credit: ((parseFloat(element.totalItems) + parseFloat(element.iva_detalle)) /*- parseFloat(this.buyProv.multa)*/).toFixed(2),
              debit: parseFloat('0.00').toFixed(2),
              centro: 0,
              tipo: 'P',
              tipo_detalle: 'CXC',
              disabled: true
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
            credit: parseFloat('0.00').toFixed(2),
            debit: parseFloat(element.totalItems).toFixed(2),
            centro: element.centro,
            tipo: 'A',
            tipo_detalle: 'GTO',
            disabled: (element.nombre_catalogo_presupuesto !== '' && element.nombre_catalogo_presupuesto !== null)  ? false : true

          });

        }

        DetailCount++

      }));
      console.log(this.fieldsDaily)
      /*insertamos un ultimo registro para los totalizados */

      if (this.buyProv.valor_iva > 0) {
        await this.RegistrarDetaAsienIva();
      }

      console.log(this.dataCuenta);


    } catch (err) {
      console.log(err)
      alert('Something went wrong, try again later!')
     // this.router.navigate(['/login']);
    }
  }


  async RegistrarDetaAsienIva() {

    await this.comSrv.obtenerListaConfContable('FAV').subscribe((resConfig) => {
      console.log(resConfig)
      let CuentaIva='';
      let CuentaIvaNoombreCuenta='';

      //this.ctaIva = resConfig['data'].filter(a => a.descripcion_evento == "IVA EN COMPRAS")
      resConfig['data'].map(iva =>{
        if(iva.descripcion_evento == "IVA EN VENTAS"){
          CuentaIva = iva.codigo_cuenta;
          CuentaIvaNoombreCuenta = iva.nombre_cuenta;
        }
      });

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
        tipo: 'I',
        tipo_detalle: 'IVA',
        disabled: true
      });




      // if(this.buyProv.acountMultaContrapartida !== ''){

      //   this.fieldsDaily.push({
      //     LoadOpcionCatalogoPresupuesto: false,
      //     presupuesto: '',//cuenta.nombre_catalogo_presupuesto,
      //     codpresupuesto: '',// cuenta.codigo_presupuesto,
      //     valor_presupuesto: 0.00,// parseFloat(this.buyProv.multa).toFixed(2),
      //     account: this.buyProv.CodacountMultaContrapartida,
      //     name: this.buyProv.acountMultaContrapartida,
      //     detail: "",
      //     credit: parseFloat('0.00').toFixed(2),
      //     debit: parseFloat(this.buyProv.multa).toFixed(2),
      //     centro: 0,
      //     tipo: 'M',
      //     tipo_detalle: ''
      //   });

      // }

      this.TotalizarAsientoCompra();

    })

  }


  async TotalizarAsientoCompra() {


    let TotalDebito = 0;
    let TotalCredito = 0;
    let TotalPresupuesto = 0;

    await Promise.all(this.fieldsDaily.map(async (elementAsiento) => {

      TotalDebito = TotalDebito + parseFloat(elementAsiento.debit);
      TotalCredito = TotalCredito + parseFloat(elementAsiento.credit);
      TotalPresupuesto = TotalPresupuesto + parseFloat(elementAsiento.valor_presupuesto);

    }));
    //commonServices.formatNumber(

    this.fieldsDaily.push({
      LoadOpcionCatalogoPresupuesto: false,
      presupuesto: '',
      codpresupuesto: '',
      valor_presupuesto: TotalPresupuesto.toFixed(2),
      account: '',
      name: '',
      detail: "",
      credit: (TotalCredito).toFixed(2),
      debit: (TotalDebito).toFixed(2),
      centro: 0,
      tipo: 'T',
      tipo_detalle: ''
    });

    console.log(this.fieldsDaily)

  }

  async CentrosPresupuesto() {
    await this.comSrv.ListaCatalogoPresupuesto().subscribe((result) => {
      this.catalogo_presupuesto = result['data']
    })
  }

  async Centros() {
    await this.comSrv.ListaCentroCostos().subscribe((resCentro) => {
      this.centros = resCentro["data"]
    })
  }


  getCatalogos() {
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

    this.comSrv.getImpuestos().subscribe(res => {
      this.buyProv.iva = res['data'][0];
      this.buyProv.iva = this.buyProv.iva.valor;
      this.buyProv.iva = (this.buyProv.iva / 100) * 100;
      this.ivaAux = this.buyProv.iva;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })

  }
  getIceSri(i, data_combo) {

    if ((typeof (this.iceSri) === 'undefined') || (this.iceSri.length === 1)) {

      data_combo[i].LoadOpcionIceSri = true;
      this.comSrv.getIceSri().subscribe(res => {

       console.log(res)
       this.iceSri = res['data'];
        data_combo[i].LoadOpcionIceSri = false;

      }, error => {

        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
        data_combo[i].LoadOpcionIceSri = false;

      })

    }
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

  sumRegistroDetalleCuenta(index) {


    this.buyProv.subtotal = 0.00;
    this.buyProv.valor_iva = 0.00;
    this.buyProv.total = 0.00;

    this.dataCuenta[index].subtotalItems = (((this.dataCuenta[index].cantidad) * this.dataCuenta[index].precio));

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



    if ((typeof (this.dataCuenta[index].porce_fte) !== 'undefined') &&
      (this.dataCuenta[index].porce_fte > 0)) {
      this.calculaImpuestoIva();
    }

    this.sumTotalizados();
    this.generaPreviewAsientoContable();


  }

  sumTotalizados() {

    let subtotal = 0;
    let subtotalcero = 0;
    let subtotalExcento = 0;
    let subtotalNoObjeto = 0;
    let totalIva = 0;
    let descuento = 0;


    this.dataProducto.forEach(element => {


      switch (element.impuesto) {

        case "2":
        case "8":
          subtotal += parseFloat(element.totalItems);
          totalIva += parseFloat(element.iva_detalle);
          break;
        case "0":
          subtotalcero += parseFloat(element.totalItems);
          totalIva += parseFloat(element.iva_detalle);
          break;
        case "6":
          subtotalNoObjeto += parseFloat(element.totalItems);
          totalIva += parseFloat(element.iva_detalle);
          break;
        case "7":
          subtotalExcento += parseFloat(element.totalItems);
          totalIva += parseFloat(element.iva_detalle);
          break;
        case "8":
          //subtotalNoObjeto += element.totalItems
          break;

      }

      descuento += parseFloat((element.desc) === null ? 0 : element.desc);

    });



    this.dataCuenta.forEach(element => {


      switch (element.impuesto) {

        case "2":
        case "8":
          subtotal += parseFloat(element.totalItems);
          totalIva += parseFloat(element.iva_detalle);
          break;
        case "0":
          subtotalcero += parseFloat(element.totalItems);
          totalIva += parseFloat(element.iva_detalle);
          break;
        case "6":
          subtotalNoObjeto += parseFloat(element.totalItems);
          totalIva += parseFloat(element.iva_detalle);
          break;
        case "7":
          subtotalExcento += parseFloat(element.totalItems);
          totalIva += parseFloat(element.iva_detalle);
          break;
        case "8":
          //subtotalNoObjeto += element.totalItems
          break;

      }

      descuento += parseFloat((element.desc) === null ? 0 : element.desc);

    });

    this.buyProv.subtotal = subtotal;
    this.buyProv.valor_iva = totalIva;
    this.buyProv.subcero = subtotalcero;
    this.buyProv.exento = subtotalExcento;
    this.buyProv.objeto = subtotalNoObjeto;
    this.buyProv.descuento = parseFloat(descuento.toFixed(2));


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



  }

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
            console.log(element.totalItems)
            let base = element.totalItems;
            let retencion = parseFloat(base) * (parseFloat(element.porce_fte) / 100);

            this.detalleImpuesto.push({
              base: parseFloat(parseFloat(base).toFixed(2)), porcentaje: element.porce_fte, total: parseFloat(retencion.toFixed(2)), tipo: 'FUENTE', rte_fuente: element.rte_fuente, codigo: element.cod_fte, codigo_anexo: element.cod_anexo_fte
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


  async calculaImpuestoIva() {
  console.log('aqui')
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

      this.sumaTotales(undefined,undefined,undefined);



    });

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

        this.sumaTotales(undefined,undefined,undefined);



      });

    }

  sumaTotales(event: any,tipo,index){
    console.log(event);
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
  }


  ChangeFuente(event: any, dataelement, index) {

    console.log(event);

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

    this.rete_fuente_acount  = ComboCuentaRteFeunte;
    dataelement[index].porce_fte = event.porcentaje_fte;
    dataelement[index].cod_fte = event.codigo_fte_sri;
    dataelement[index].cod_anexo_fte = event.codigo_anexo_sri;
    this.calculaImpuestoIva();
    this.generaPreviewAsientoContable();

  }


  ChangeFuenteCuenta(datosCuenta:any, infoDetails:any, index){

    console.log(datosCuenta);
    infoDetails[index]['cod_cuenta_impuesto_rtefte'] = datosCuenta.cuenta;
    infoDetails[index]['cuenta_impuesto_rtefte'] = datosCuenta.descripcion;

  }

  ChangeImpuestoIva(event: any, dataelement, index) {

    dataelement[index].porce_iva = event.porcentaje_rte_iva;
    dataelement[index].cod_iva = event.codigo_sri_iva;
    dataelement[index].cod_anexo_iva = event.codigo_sri_iva;
    this.calculaImpuestoIva();
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
  expandEgresosBodega() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(BusquedaEgresosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
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
        let items = { cod_anexo_iva: "", cod_iva: "", porce_iva: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false, LoadOpcionCentro: false, subtotal_noobjeto: 0.00, subtotal_excento: 0.00, subtotal_cero: 0.00, subtotal_iva: 0.00, InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2), fk_producto: 0, impuesto: "2", rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 };
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

        // if (element.rte_fuente == null || element.rte_fuente == '' || element.rte_fuente == 0) {
        //   validaAddDetalle = false;
        //   mensaje = 'Es necesario asignar un codigo retención fuente al detalle actual.';
        //   return false;
        // }

      });

      if (validaAddDetalle) {
        let cuentas = { cod_anexo_iva: "", cod_iva: "", porce_iva: 0,cod_ice: "", porce_ice: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false,LoadOpcionIceSri: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false, LoadOpcionCentro: false, subtotal_noobjeto: 0.00, subtotal_excento: 0.00, subtotal_cero: 0.00, subtotal_iva: 0.00, InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2), fk_producto: 0, impuesto: "2", rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 };
        this.dataCuenta.push(cuentas);
      } else {
        this.toastr.info(mensaje);
      }


   }
  }

  cancel() {



    this.busqueda= false
    this.flagBtnDired = false;
    this.buyProv = {
      CodacountMulta: '',
      acountMulta: '',
      motivo_multa: '',
      multa: (0.00).toFixed(2),
      num_contrato: '',
      tipo_documento: 0,
      sustento: '01',
      //proveedor_name: '',
      contribuyente_name: '',
      anio: 2022, mes: 9,
      //identificacion_proveedor: '',
      identificacion_contribuyente: '',
      tipo_identificacion: '01',
      //fk_id_proveedor: 0,
      fk_id_contribuyente: 0,
      subtotal: (0.00).toFixed(2),
      subcero: (0.00).toFixed(2),
      objeto: (0.00).toFixed(2),
      exento: (0.00).toFixed(2),
      descuento: (0.00).toFixed(2),
      propina: (0.00).toFixed(2),
      otro_impuesto: (0.00).toFixed(2),
      servicio: (0.00).toFixed(2),
      valor_iva: (0.00).toFixed(2),
      total: (0.00).toFixed(2),
      tipo_pago: 0, forma_pago: 0,
      fk_usuario_receive: 0,
      isActive: this.estados[0],
      metodo_pago: 0 ,
      saldo: 0.00,
      condicion: 0,
      total_retencion: (0.00).toFixed(2),
      total_anticipo: (0.00).toFixed(2),
      total_multa: (0.00).toFixed(2),
      estado:"P",
      pto_emision: 0,
      establecimiento: '',
      punto_emision : '',
      secuencia_numero : '',
      id_tipo_documento: 0,
    }

    this.buyProv.anio = moment().format('YYYY');
    this.buyProv.mes = Number(moment().format('MM'));
    this.fecha_compra = new Date()

    this.dataCuenta = [{ cod_anexo_iva: "", cod_iva: "", porce_iva: 0,cod_ice: "", porce_ice: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false,LoadOpcionIceSri: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false, LoadOpcionCentro: false, subtotal_noobjeto: (0.00).toFixed(2), subtotal_excento: (0.00).toFixed(2), subtotal_cero: (0.00).toFixed(2), subtotal_iva: (0.00).toFixed(2), InputDisabledCantidad: true, iva_detalle: (0.00).toFixed(2), cuenta_detalle: 0, impuesto: 2, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: (0.00).toFixed(2), subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1, cod_cuenta_por_pagar: '', cuenta_por_pagar: '', codigo_partida: '' }];
    this.dataProducto = [{ cod_anexo_iva: "", cod_iva: "", porce_iva: 0,cod_ice: "", porce_ice: 0, cod_anexo_fte: "", cod_fte: "", porce_fte: 0, isRetencionIva: false, LoadOpcionImpuesto: false, LoadOpcionReteFuente: false, LoadOpcionRteIva: false, LoadOpcionCentro: false, subtotal_noobjeto: 0.00, subtotal_excento: 0.00, subtotal_cero: 0.00, subtotal_iva: 0.00, InputDisabledCantidad: true, iva_detalle: 0, fk_producto: 0, impuesto: 2, rte_fuente: 0, rte_iva: 0, centro: 0, nombre: null, codigo: null, observacion: null, cantidad: null, precio: null, desc: null, subtotalItems: 0.00, totalItems: 0.00, paga_iva: 1 }];


    this.fieldsDaily = [];
    this.ListaAnticipos = [];
    this.ListaMultas = [];
    this.contribuyenteActive = {
      razon_social: "",
      num_documento:"",
      tipo_documento:""
    };


    this.arrayAnticipos = [];
    this.arrayMultas= [];
    this.fieldsDaily.push({ LoadOpcionCatalogoPresupuesto: false, presupuesto: '', codpresupuesto: '', valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2) }, { LoadOpcionCatalogoPresupuesto: false, presupuesto: '', codpresupuesto: '', valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2),disabled: false });

    this.isAsignaMulta = false;
    this.isPouchesShared = false;
    this.isAsignaOrden = false;
    this.isAsignaMetodo = false;
    this.isAsignaFecha = false;

    this.buyProv.fk_doc = 3;

    this.detalleImpuesto = [];

    this.buyProv.iva = this.ivaAux;
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[6].habilitar = true;

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
      return;
    }
      this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar la "+this.nombre_documento+"?", "SAVE_FACTURA");
        }
      }).catch((err) => {
        console.log(err);
        this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
      });

  }

  async confirmSave(message, action) {

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
        if (action == "SAVE_FACTURA") {
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
    this.buyProv['ruc'] = this.contribuyenteActive != undefined ? this.contribuyenteActive.num_documento : null;
    //this.buyProv['ruc'] = this.proveedor != undefined ? this.proveedor.num_documento : null;

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

    let dataDocument = { company_id: this.dataUser.id_empresa, doc_type: "FAV" };
    this.diarioSrv.getCompanyInformation(dataDocument).subscribe(resDocument => {

      let detailAsiento = this.fieldsDaily.filter(asiento => asiento.tipo !== "T");
      let dataAsientoSave = {
        ip: this.commonServices.getIpAddress(),
        accion: `Registro de comprobante de venta No. ${resDocument["data"].secuencia}`,
        id_controlador: myVarGlobals.fComDiario,
        id_company: this.dataUser.id_empresa,
        date: this.pipe.transform(this.fecha_compra, 'yyyy-MM-dd'),
        doc_id: resDocument["data"].id,
        doc_num: resDocument["data"].secuencia,
        doc_type: resDocument["data"].codigo,
        concept: 'Registro de asiento de factura de venta # ' + this.buyProv.num_doc,
        note: 'Registro de asiento de factura de venta # ' + this.buyProv.num_doc,
        details: detailAsiento,
        total: this.buyProv.total,
        total_pagar: this.totalPagar,
        tipo_registro: "Factura de Venta"
      }



      this.buyProv['detalle'] = this.dataProducto;
      this.buyProv['detalle_cuenta'] = this.dataCuenta;
      this.buyProv['impuestos'] = this.detalleImpuesto;
      this.buyProv['fk_usuario_trans'] = this.dataUser.id_usuario;
      this.buyProv['fecha_compra'] = this.pipe.transform(this.fecha_compra, 'yyyy-MM-dd');
      this.buyProv['type_difered'] = (this.buyProv.tipo_pago == "Contado") ? info : this.dataDifered;
      this.buyProv['ip'] = this.commonServices.getIpAddress();
      this.buyProv['id_controlador'] = myVarGlobals.fProveeduriaCompras;
      this.buyProv['accion'] = `Factura de venta con número de documento ${this.buyProv['num_doc']}`;
      //this.buyProv['ruc'] = this.proveedor != undefined ? this.proveedor.num_documento : null;
      this.buyProv['ruc'] = this.contribuyenteActive != undefined ? this.contribuyenteActive.num_documento : null;
      this.buyProv['asiento'] = dataAsientoSave;
      this.buyProv['motivo'] = this.motivo;


      // let data = {
      //   "anio": this.buyProv.anio,
      //   "mes": this.buyProv.mes
      // }

      let data = {
        "anio": Number(moment(this.fecha_compra).format('YYYY')),
        "mes": Number(moment(this.fecha_compra).format('MM')),
      }


      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

        console.log(res)
        if (res["data"][0].estado !== 'C') {

          /* Validamos si el periodo se encuentra aperturado */

          this.comSrv.saveBuyProv(this.buyProv).subscribe(res => {
            if (res["status"] == 1) {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: this.nombre_documento +" generada con el número "+ res['data'].num_doc,
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              })
              //this.toastr.success(res['message']);
              this.busqueda = true;
              this.id_compra = res["data"].id_factura;
              this.buyProv.num_doc = res['data'].num_doc;
              this.buyProv.num_aut = res['data'].num_aut;
              this.vmButtons[6].habilitar = false;
              //window.open(environment.ReportingUrl + "rpt_compras.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_compra=" + res["data"].id, '_blank')
             // this.cancel();
            }
            else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error al generar la Factura de Venta",
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

        } else {
          this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
          this.lcargando.ctlSpinner(false);
        }

      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      })

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
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
    //let flag = false;
    let c = 0;
    let mensajes: string = '';
    return new Promise((resolve, reject) => {

      if (this.buyProv.fk_doc === 3) {
        if (this.buyProv.fk_id_contribuyente == 0) {
          mensajes += "Debe seleccionar un contribuyente<br>"
        }else if (this.dataDifered != null && (this.buyProv.total != this.dataDifered.amount)
          && this.buyProv.tipo_pago == 'Crédito') {
          mensajes += "El valor diferido no es igual al valor total de la factura, favor revise ambos valores<br>"
        } else if (this.buyProv.tipo_pago == 'Crédito' && this.dataDifered == null) {
          mensajes += "Debe diferir el total de la factura cuando el tipo de pago es a Crédito<br>"
        } else if (this.buyProv.tipo_pago == 0) {
          mensajes += "Seleccione un tipo de pago<br>"
        } else if (this.buyProv.forma_pago == 0) {
          mensajes += "Seleccione una forma de pago<br>"
        }
        else if (this.buyProv.tipo_documento == 0 || this.buyProv.tipo_documento == undefined || this.buyProv.tipo_documento == '') {
          mensajes += "Debe seleccionar un documento de contribuyente<br>"
        }
        else if (this.buyProv.pto_emision == 0 || this.buyProv.pto_emision == undefined || this.buyProv.pto_emision == '') {
          mensajes += "Debe seleccionar un punto de Emisión<br>"
        }
        //  else if ((this.buyProv.num_doc).length < 15) {
        //   mensajes += "El numero de comprobante del contribuyente debe tener 15 digitos<br>"
        //   return;
        // }
       /*  else if (this.buyProv.num_aut == "" || this.buyProv.num_aut == undefined) {
          mensajes += "debe ingresar un número de autorización<br>"
        }  else if ((this.buyProv.num_aut).length != 10 && (this.buyProv.num_aut).length != 49) {
          mensajes += "El numero de autorización debe contener 10 o 49 digitos<br>"
        }*/ else if (this.dataProducto.length == 0) {
          mensajes += "debe ingresar al menos un producto<br>"
        } else if

          ((this.dataProducto.length == 1 && this.dataProducto[0].fk_producto == 0) &&
          (this.dataCuenta.length == 1 && this.dataCuenta[0].codigo === null)) {

          mensajes += "Debe agregar por lo menos un detalle por cuenta contable<br>"

        } else if (this.buyProv.isActive == 0 && (this.buyProv.observacion == "" || this.buyProv.observacion == null || this.buyProv.observacion == undefined)) {
          mensajes += "Ingrese una observación por la cual el estado es Inactivo<br>"
        } else {

          if (this.dataProducto.length > 0 && this.dataProducto[0].fk_producto != 0) {

            c = 0;
            this.dataProducto.forEach(element => {
              if (element['precio'] <= 0 || element['precio'] == "" || element['precio'] == null ||
                element['cantidad'] <= 0 || element['cantidad'] == "" || element['cantidad'] == null) {
                c += 1;
                if (c == 1) {
                  mensajes += "Revise la información en los items, el precio o la cantidad no pueden ser 0<br>"
                }
              }
            });
          }

          if (this.dataCuenta.length > 0 && this.dataCuenta[0].codigo !== null) {
            c = 0;
            this.dataCuenta.forEach((element, index) => {

              if(element['cuenta_detalle'] == 0 || element['cuenta_detalle'] == "" || element['cuenta_detalle'] == null){
                c += 1;
                if (c == 1) {
                  mensajes += "En la línea "+ (index+1)+ " debe seleccionar una cuenta<br>"
                }
              }
              else if(element['cantidad'] <= 0 || element['cantidad'] == "" || element['cantidad'] == null){
                c += 1;
                if (c == 1) {
                  mensajes += "En la línea "+ (index+1)+ " la cantidad no puede ser 0<br>"
                }
              }
              else if (element['precio'] <= 0 || element['precio'] == "" || element['precio'] == null) {
                c += 1;
                if (c == 1) {
                  mensajes += "En la línea "+ (index+1)+ " el precio no puede ser 0<br>"
                }
              }
              else if(element['observacion'] <= 0 || element['observacion'] == "" || element['observacion'] == null){
                c += 1;
                if (c == 1) {
                  mensajes += "En la línea "+ (index+1)+ " debe ingresar una observación<br>"
                }
              }
              else if(element['observacion_adicional'] <= 0 || element['observacion_adicional'] == "" || element['observacion_adicional'] == null){
                c += 1;
                if (c == 1) {
                  mensajes += "En la línea "+ (index+1)+ " debe ingresar una observación adicional<br>"
                }
              }
              else if(element['cod_cuenta_por_pagar'] == 0 || element['cod_cuenta_por_pagar'] == "" || element['cod_cuenta_por_pagar'] == null){
                c += 1;
                if (c == 1) {
                  mensajes += "En la línea "+ (index+1)+ " debe seleccionar una cuenta por pagar<br>"
                }
              }

            });
          }

        }

        return (!mensajes.length) ? resolve(true) : reject(mensajes);

      } else {

        if (this.dataDifered != null && (this.buyProv.total != this.dataDifered.amount)
          && this.buyProv.tipo_pago == 'Crédito') {
          mensajes +="El valor diferido no es igual al valor total de la factura, favor revise ambos valores";
        } else if (this.buyProv.tipo_pago == 'Crédito' && this.dataDifered == null) {
          mensajes +="Debe diferir el total de la factura cuando el tipo de pago es a Crédito";
        } else if (this.buyProv.tipo_pago == 0) {
          mensajes +="Seleccione un tipo de pago";
        } else if (this.buyProv.forma_pago == 0) {
          mensajes +="Seleccione una forma de pago";
        } else if (this.buyProv.fk_id_contribuyente == 0) {
          mensajes +="debe seleccionar un contribuyente";
        } else if (this.dataProducto.length == 0) {
          mensajes +="debe ingresar al menos un detalle para el registro de la liquidacion";
        } else if

          ((this.dataProducto.length == 1 && this.dataProducto[0].fk_producto == 0)) {

          mensajes +="Debe agregar por lo menos un detalle para el registro de liquidacion";

        } else if (this.buyProv.isActive == 0 && (this.buyProv.observacion == "" || this.buyProv.observacion == null || this.buyProv.observacion == undefined)) {
          mensajes +="Ingrese una observación por la cual el estado es Inactivo";
        } else {

          if (this.dataProducto.length > 0 && this.dataProducto[0].fk_producto != 0) {

            c = 0;
            this.dataProducto.forEach(element => {
              if (element['precio'] <= 0 || element['precio'] == "" || element['precio'] == null ||
                element['cantidad'] <= 0 || element['cantidad'] == "" || element['cantidad'] == null) {
                c += 1;
                if (c == 1) {
                  //this.toastr.info("Revise la información en los items, el valor o la cantidad no pueden ser 0")
                  mensajes +="Revise la información en los items, el valor o la cantidad no pueden ser 0";
                }
                //flag = true; return;
              }
            });

           // (!flag) ? resolve(true) : resolve(false);
           return (!mensajes.length) ? resolve(true) : reject(mensajes);

          }


        }


      }
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
    let validt = false;
    this.dataCuenta.forEach(element => {
      if (element.codigo == filt.codigo) { validt = true; }
    });

    if (validt) {
      Swal.fire(
        'Atención!',
        'Este cuenta ya se encuenta en la lista ingresada!',
        'error'
      )
      this.dataCuenta[index].codigo = '';
    } else {

      console.log(cuenta);
      console.log(this.dataCuenta);

      //debugger;
      this.dataCuenta[index].cuenta_detalle = "(" + filt.codigo + ") " + filt.nombre
      this.dataCuenta[index].codigo = filt.codigo;
      this.dataCuenta[index].nombre = filt.nombre;
      this.dataCuenta[index].InputDisabledCantidad = false;
      this.dataCuenta[index].codigo_presupuesto = filt.codigo_presupuesto;
      this.dataCuenta[index].nombre_catalogo_presupuesto = filt.nombre_catalogo_presupuesto;
      console.log(filt.codigo_presupuesto);
      console.log(this.dataCuenta);
     // $('#cantidad_cuenta_' + index).focus();

    }


    this.modalService.dismissAll();
    this.generaPreviewAsientoContable()

  }



  CargarCuentasPorPagar(cuenta: any, index) {

    let filt = cuenta["data"];

    let validt = false;
    this.dataCuenta.forEach(element => {
      if (element.codigo == filt.codigo) { validt = true; }
    });

    if (validt) {

      /*Ya existe una cuenta asignada se agrupa */

    } else {


      this.dataCuenta[index].cod_cuenta_por_pagar = filt.codigo;
      this.dataCuenta[index].cuenta_por_pagar = filt.nombre;
      console.log(this.dataCuenta);
      this.generaPreviewAsientoContable();


      //$('#cantidad_cuenta_' + index).focus();

    }


    this.modalService.dismissAll();

  }


  CargarProveedor(event: any) {


    this.buyProv.fk_id_proveedor = event.id_proveedor;
    this.buyProv.proveedor_name = event.razon_social;
    this.buyProv.tipo_identificacion = (event.tipo_documento === 'Ruc') ? '01' : '02';
    this.buyProv.identificacion_proveedor = event.num_documento;

    this.proveedor = event;

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

  CargarComboUsuario() {

    if (typeof (this.infoUsers) === 'undefined') {
      this.LoadOpcionUsuario = true;
      this.comSrv.getUsuario().subscribe(res => {
        this.infoUsers = res['data'];
        this.LoadOpcionUsuario = false;
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.LoadOpcionUsuario = false;
        this.toastr.info(error.error.message);
      })
    }
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
      this.lcargando.ctlSpinner(false);
      this.sustento_array = res['data'];
      this.LoadOpcionSustento = false;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
      this.LoadOpcionSustento = false;
    })


    //}
  }

  getImpuestosDetalle(i, data_combo) {

    if ((typeof (this.impuestos) === 'undefined') || (this.impuestos.length === 1)) {

      data_combo[i].LoadOpcionImpuesto = true;
      let data = { fields: ["IMPUESTOS"] };

      this.contableService.ObtenerCatalogoGeneral(data).subscribe(res => {

        let catalogo = res['data']['catalogs'];
        this.impuestos = catalogo['IMPUESTOS'];
        data_combo[i].LoadOpcionImpuesto = false;

      }, error => {

        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
        data_combo[i].LoadOpcionImpuesto = false;

      })

    }
  }

  getRetencionFuente(i) {

    this.dataCuenta[i].LoadOpcionReteFuente = true;

    this.contableService.getRetencionFuenteCompras().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.rete_fuente = res['data'];
      this.dataCuenta[i].LoadOpcionReteFuente = false;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
      this.dataCuenta[i].LoadOpcionReteFuente = false;
    })

  }




  getRetencionIva(i, datos) {

    datos[i].LoadOpcionRteIva = true;

    this.contableService.getRetencionIvaCompras().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.rte_iva = res['data'];
      datos[i].LoadOpcionRteIva = false;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
      datos[i].LoadOpcionRteIva = false;
    })

  }

  cargarEgresosBodega(event){
    console.log(event);
    if (typeof event !== undefined && event !== '' && event !== 0) {
      this.ExistenItems = false;
    }

    // this.egresosBodega = []
    // if (typeof event !== undefined && event !== '' && event !== 0) {
    //   if(event=='VB'){
    //     this.comSrv.cargarEgresosBodega().subscribe(res => {
    //       console.log(res);
    //       this.egresosBodega = res['data'];
    //       this.ExistenItems = false;
    //     },error => {
    //       this.lcargando.ctlSpinner(false);
    //       this.toastr.info(error.error.message);
    //     })


    //   }
    // }
  }

  getCentroDetalle(i) {

    //this.dataProducto[i].LoadOpcionCentro = true;
    this.dataCuenta[i].LoadOpcionCentro = true;

    /* this.contableService.getRetencionIvaCompras().subscribe(res => {
       console.log(res);
       this.lcargando.ctlSpinner(false);
       this.centros = res;
       this.dataProducto[i].LoadOpcionCentro = false;
     }, error => {
       this.lcargando.ctlSpinner(false);
       this.toastr.info(error.error.message);
       this.dataProducto[i].LoadOpcionCentro = false;
     })*/

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

    );

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

        this.showModalFacturas();
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
      case "PDF":
        this.descargarPdf();
        break;


    }
  }

  showModalFacturas(){
    let modal = this.modalService.open(ModalFacturasComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true
  }

  expandModalDocSecundario() {
    console.log('ModalSecundario')
    const modal = this.modalService.open(ModalBusquedaFacturaComponent, {
      size: 'xl',
      backdrop: 'static'
    })
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

    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }

    let reader = new FileReader();
    const filetext = new Promise(resolve => {
      reader.onload = () => resolve(reader.result);
      reader.readAsText(this.files[0]);
    });


    filetext.then((value) => {
      this.xmlToJson(value).then(response => this.ProcesaCargaXml(response));
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


  async ProcesaCargaXml(result) {


    if (result.hasOwnProperty('autorizacion')) {

      let autorizacion = result.autorizacion;
      let estado = autorizacion.estado;
      if (estado[0] === "AUTORIZADO") {

        let numAuto = autorizacion.numeroAutorizacion[0];
        let comprobante = autorizacion.comprobante[0];


        if (typeof comprobante === 'string') {
          this.xmlToJson(comprobante).then(response => this.ProcesaCargaXmlFormatoObjeto(response, autorizacion, estado[0], numAuto));
        } else {

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

      if (comprobante.hasOwnProperty('factura')) {

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





    } else {
      this.toastr.info('El comprobantes no se encuentra autorizado');
      this.lcargando.ctlSpinner(false);
    }


  }



  async xmlToJson(string) {
    var xml2js = require('xml2js');
    try {
      const json = await xml2js.parseStringPromise(string);
      return json;
    } catch (e) {
      return null;
    }
  }



  descargarPdf(){
    console.log(this.buyProv.id_tipo_documento)
    if(this.buyProv.id_tipo_documento == 7){
      window.open(environment.ReportingUrl + "rpt_comprobante_factura_barcode.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&numero=" + this.id_compra, '_blank')
    }
    if(this.buyProv.id_tipo_documento == 22){
      window.open(environment.ReportingUrl + "rpt_comprobante_nota_credito_barcode.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&numero=" + this.id_compra, '_blank')
    }
    if(this.buyProv.id_tipo_documento == 14){
      window.open(environment.ReportingUrl + "rpt_comprobante_nota_debito_barcode.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&numero=" + this.id_compra, '_blank')
    }

  }

    showFacturas() {
    const modalInvoice = this.modalService.open(ShowInvoicesComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
  }

  expandListContribuyentes() {

      const modalInvoice = this.modalService.open(ModalContribuyentesComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fTesRecTitulos;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      modalInvoice.componentInstance.validacion = 8;

  }

  async getLatest() {
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Cargando Registro'
    try {
      const response = await this.comSrv.getUltimaFactura()
      console.log(response)
      if (response.data) {
        // this.totalRecords = response.data.total
        this.lastRecord = response.data.id_factura
        this.comSrv.listaFacturas$.emit(response.data)
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

  async handleEnter({key}) {
    if (key === 'Enter') {
      if (this.lastRecord == null) {
        await this.getLatest()
        return
      }

      this.lcargando.ctlSpinner(true);
      (this as any).mensajeSpinner = 'Cargando Registro'
      try {
        const response = await this.comSrv.getFacturasGeneradas({params: {filter: {id: this.lastRecord}, paginate: {page: 1, perPage: 1}}}) as any
        console.log(response)
        if (response.data.data.length > 0) {
          this.totalRecords = response.data.total
          this.comSrv.listaFacturas$.emit(response.data.data[0])
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

  async getPrevRecord() {
    this.lastRecord -= 1
    await this.handleEnter({key: 'Enter'})
  }

  async getNextRecord() {
    this.lastRecord += 1
    await this.handleEnter({key: 'Enter'})
  }

}
