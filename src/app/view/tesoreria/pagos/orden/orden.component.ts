import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdenService } from './orden.service';
import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';
//import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ModalSolicitudComponent } from './modal-solicitud/modal-solicitud.component';
import { ModalCuentPreComponent } from 'src/app/view/gestion-bienes/configuracion/categoria-producto/modal-cuent-pre/modal-cuent-pre.component';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { ModalCajaComponent } from './modal-caja/modal-caja.component';
//import { ThisReceiver } from '@angular/compiler/src/expression_parser/ast';
import { ModalSolicitudCatComponent } from './modal-solicitud-cat/modal-solicitud-cat.component';
import { ModalComprasComponent } from './modal-compras/modal-compras.component';
import { environment } from 'src/environments/environment';
//import e from 'cors';
import { Socket } from '../../../../services/socket.service';


@Component({
standalone: false,
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.scss']
})
export class OrdenComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild("print") print!: ElementRef;
  fTitle = "Orden de Pago";
  mensajeSpinner: string;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  conceptos: any = {};
  condiciones: any = {};
  facturas: any = [];

  formReadOnly = false;
  titulosDisabled = true;
  addConcepto = true;
  deshabilitar: boolean = false;
  procesoCompra: boolean = true;
  procesoConceptos: boolean = false;
  procesoFacturas: boolean = true;
  condicionDisabled: boolean = true;
  cuentaDisabled: boolean = true;
  addCondicion: boolean = true;
  masterSelected: boolean = false;
  checkDisabled: boolean = false;
  procesoInf: boolean = true;
  procesoCat: boolean = true;
  procesoUnaFactura:boolean = true;
  addCompra:boolean = true;
  disabledCampo:boolean = false;

  proveedorActive: any = {
    razon_social: ""
  };
  beneficiarioActive: any = {
    razon_social: ""
  };
  desConcepto: any;
  desCondicion: any;
  valorCondicion: any;
  idCondicion: any;
  validaciones: ValidacionesFactory = new ValidacionesFactory()


  conceptosList: any = [];
  concepto: any = 0;
  tipoDesembolso: any = 0;

  totalCobro = 0;
  totalPago = 0;
  difCobroPago = 0;

  deudas: any = [];
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
  verifyRestore = false;

  pagos: any = [];
  pagosUnaFactura: any = [];
  detallesUnaFactura: any[] = [];
  pagosCondicion: any = [];
  pagosFacturas: any = [];
  formaPago = 0;
  condicionesPago = 0;

  catalog: any = []
  tipo_proceso: any;
  fk_compra_cab: any;
  fk_proveedor: any;

  asiento: Array<any> = [];
  totalAsiento:Array<any> = [];

  documento: any = {
    id_documento: null,
    tipo_documento: "", // concepto.codigo
    fk_contribuyente: null, // contr id
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    observacion: "",
    estado: "P",
    subtotal: 0,
    total: 0,
    detalles: [], // deudas
    formas_pago: [], // pagos
    asiento: [],//asiento
    detalles_asiento: [],
    fk_caja: 0,
    nro_proceso: "",
    nombre_proceso: "",
    monto_proceso: 0,
    total_aprobado: 0,
    nro_poliza: "",
    vigencia_poliza: moment(new Date()).format('YYYY-MM-DD'),
    tipo_desembolso: 0,
    idp: "",
    fk_idp: 0,
    id_cuenta: "",
    fk_cajaChi: 0,
    cajaChicaName: '',
    tiene_divisas: false,
    moneda_divisas: 0,
    tipo_cambio: null,
    valor_divisa: null,
    valor_dolares: 0,
    num_orden: "",
    valor_orden:0,
    id_orden:0,
    cuenta:'',
    id_banco:0,
    tiene_beneficiario: false,
    fk_beneficiario: null


  }
  grupo = {
    id_cuenta_contable: null,
    codigo_grupo_producto: null,
    descripcion: null,
    codigo_cuenta_contable: null,
    codigo_presupuesto: null,
    estado: null,
    descripcion_cuenta: null,
    descripcion_presupuesto: null,
    tipo_bien: null
  }

  cajaActiva: any = {
    id_caja: 0,
    nombre: "",
  }

  // tipoOrden = [
  //   {valor: "PC",descripcion: "PROCESO DE COMPRAS"},
  //   {valor: "CCH",descripcion: "CAJA CHICA"},
  //   {valor: "AE",descripcion: "ANTICIPO A EMPLEADOS"},
  //   {valor: "PF",descripcion: "POR FACTURA"},
  //   {valor: "VF",descripcion: "POR VARIAS FACTURAS"},
  //   {valor: "OT",descripcion: "OTROS"},
  // ]
  tipoOrden = []

  id_solicitud: any;
  asientoCabname: any;

  cajaVL: boolean = false
  cambioVal: boolean = false
  botonRegresa: boolean = false
  changeDivisas: boolean = false
  cambioMoneda: boolean = false

  changeBeneficiario: boolean = false

  busqueda: boolean = false;

  tipo_compras_pub = ""

  listaCuentas: any = []
  cuenta:  any = [];

  asientoCabId: number

  tabActiva: any =''
  cuentasBanco : any =[]

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: OrdenService,
    private cierremesService: CierreMesService,
    private socket: Socket
  ) {
    this.commonVrs.selectProveedorCustom.asObservable().subscribe(
      (res) => {

        console.log(res)
        if(res.valid == 'beneficiario'){
            this.beneficiarioActive = res;
            this.documento.fk_beneficiario = this.beneficiarioActive.id_proveedor
        }

        if(res.valid == 'proveedor'){
        //console.log(new Date(this.documento.vigencia_poliza)).format('YYYY-MM-DD') < this.documento.fecha)(res);
          // this.cargarDatosModal(res);
        this.pagosUnaFactura = [];
        this.proveedorActive = res;
        console.log(this.proveedorActive);
        this.titulosDisabled = false;
        this.cuentaDisabled = false;
        this.addCompra = false;
        //this.addConcepto = true;
        this.vmButtons[3].habilitar = false;
        if(this.documento.tipo =='VF'){
          this.getProvCompras(this.proveedorActive.id_proveedor)
        }

      //  this.getCatalogoConceptos();
        //console.log(new Date(this.documento.vigencia_poliza)).format('YYYY-MM-DD') < this.documento.fecha)(this.formaPago);
        }




      }
    );

    this.apiSrv.listaCompras$.subscribe(
      (res) => {
        console.log(res)

        this.agregaCompra(res)
      }
    )

    this.commonVrs.selectRecDocumentoOrden.asObservable().subscribe(
      (res) => {

        // this.formReadOnly = true;
        this.restoreForm();
        //this.getCatalogoConceptos();

        //console.log(new Date(this.documento.vigencia_poliza)).format('YYYY-MM-DD') < this.documento.fecha)('aquiiiiii'+res.total);
        // this.concepto = res.concepto; // ya no se maneja eligiendo concepto se puede eliminar
        this.busqueda= true
        this.asientoCabId =res.asiento?.id
        this.asientoCabname = res.asiento?.asiento
        this.proveedorActive = res?.proveedor;
        this.documento.tiene_beneficiario = res.tiene_beneficiario == "SI" ? true : false

        if(this.documento.tiene_beneficiario ){
          this.beneficiarioActive = res?.proveedor_beneficiario;
          this.documento.fk_proveedor = res?.proveedor_beneficiario?.id_proveedor
          this.changeBeneficiario = this.documento.tiene_beneficiario
        }
        this.documento = res;
        this.documento.tiene_divisas = res.tiene_divisas == 'S' ? true : false
        this.documento.fecha = res.fecha.split(" ")[0];


        // this.documento.fecha_gestion = res.fecha_gestion.split(" ")[0];
        // this.pagos = res.detalles;
        console.log(res)
        this.getCondiciones(res['id_solicitud']);


        if (res['tipo'] == 'PC') {
          this.documento.vigencia_poliza = res.vigencia_poliza.split(" ")[0];
          this.procesoCompra = false;
          this.procesoConceptos = true;
          this.procesoInf = true
          //this.pagosCondicion = res.detalles;

          res.detalles.forEach((p) => {
            Object.assign(p, {
              valor: p.valor,
              descripcion: p.tipo_concepto,
              comentario: p.comentario,
              id_cuenta: 0,
              codigo_cuenta: p.cuentas.codigo,
              descripcion_cuenta: p.cuentas.nombre
            });
          })

          this.pagosCondicion = JSON.parse(JSON.stringify(res.detalles));
          if(res.asiento!=null){
            if(res.asiento.detalle.length > 0){
              this.asiento=[]
                res.asiento.detalle.forEach(e => {
                  this.asiento.push({
                    fecha: res.asiento?.fecha,
                    LoadOpcionCatalogoPresupuesto: false,
                    presupuesto: e.partida_presupuestaria,
                    codpresupuesto: e.codigo_partida,
                    codigopartida: e.codigopartida,
                    valor_presupuesto:parseFloat(e.valor_partida),
                    account: e.cuenta,
                    name: e.cuentas?.nombre,
                    detail: "",
                    credit: parseFloat(e.valor_cre),
                    debit: parseFloat(e.valor_deb),
                    centro: 0,
                    tipo: '',
                    tipo_detalle: e.tipo_detalle,
                    tipo_presupuesto: e.tipo_presupuesto,
                    tipo_afectacion: e.tipo_afectacion,
                    devengado: e.devengado,
                    cobrado_pagado: e.cobrado_pagado,
                    fk_programa: e.fk_programa

                  });
                  this.TotalizarAsiento();
                })
            }
          }

        } else if (res['tipo'] == 'VF') {
          this.procesoCompra = true;
          this.procesoConceptos = true;
          this.procesoFacturas = false;
          this.procesoInf = true
          this.checkDisabled = true;
          //this.pagosCondicion = res.detalles;

          res.detalles.forEach((p) => {
            Object.assign(p, {
              check: true,
              num_doc: p.fact_num_doc,
              fecha_compra: p.fact_fecha_compra,
              valor_iva: p.fact_valor_iva,
              subtotal: p.fact_subtotal,
              total: p.fact_total,
            });
          })

          this.facturas = JSON.parse(JSON.stringify(res.detalles));
        }
        else if (res['tipo'] == 'PF') {
          this.procesoCompra = true;
          this.procesoConceptos = true;
          this.procesoFacturas = true;
          this.procesoUnaFactura = false;
          this.procesoInf = true
        //this.pagosCondicion = res.detalles;

          console.log(res.detalles)
          res.detalles.forEach((p) => {
            Object.assign(p, {
              num_doc: p.fact_num_doc,
              fecha_compra: p.fact_fecha_compra,
              valor_iva: p.fact_valor_iva,
              subtotal: parseFloat(p.fact_subtotal),
              total: parseFloat(p.fact_total),
              valor:parseFloat(p.fact_total),
              saldo: parseFloat(p.fact_total),
              saldo_orden_pago:parseFloat(p.fact_total),
            });
            if(p.cuentas!=null){
              this.grupo.codigo_cuenta_contable=p.cuentas.codigo;
              this.grupo.descripcion_cuenta=p.cuentas.nombre;
            }

          })

          this.pagosUnaFactura = JSON.parse(JSON.stringify(res.detalles));
          if(res.asiento!=null){
            if(res.asiento.detalle.length > 0){
              this.asiento=[]
                res.asiento.detalle.forEach(e => {
                  this.asiento.push({
                    fecha: res.asiento?.fecha,
                    LoadOpcionCatalogoPresupuesto: false,
                    presupuesto: e.partida_presupuestaria,
                    codpresupuesto: e.codigo_partida,
                    codigopartida: e.codigopartida,
                    valor_presupuesto:parseFloat(e.valor_partida),
                    account: e.cuenta,
                    name: e.cuentas?.nombre,
                    detail: "",
                    credit: parseFloat(e.valor_cre),
                    debit: parseFloat(e.valor_deb),
                    centro: 0,
                    tipo: '',
                    tipo_detalle: e.tipo_detalle,
                    tipo_presupuesto: e.tipo_presupuesto,
                    tipo_afectacion: e.tipo_afectacion,
                    devengado: e.devengado,
                    cobrado_pagado: e.cobrado_pagado,
                    fk_programa: e.fk_programa

                  });
                  this.TotalizarAsiento();
                })
            }
          }
        }

        else if (res['tipo']=='INF'){
          this.procesoCompra = true
          this.procesoInf = false
          this.procesoConceptos = false
          this.procesoFacturas = true
          this.procesoCat = false
          res.detalles.forEach((p) => {
            Object.assign(p, {
              valor: p.valor,
              descripcion: p.tipo_concepto,
              comentario: p.comentario,
              id_cuenta: 0,
              codigo_cuenta: p.cuentas.codigo,
              descripcion_cuenta: p.cuentas.nombre
            });
          })
          this.pagos = JSON.parse(JSON.stringify(res.detalles));
        }
        else if (res['tipo']=='CAT'){
          console.log("CAT")
          this.procesoCompra = true
          this.procesoInf = false
          this.procesoConceptos = false
          this.procesoFacturas = true
          this.procesoCat = false
          this.documento.id_ordenes = res.ordenes?.id_ordenes
          this.documento.num_orden = res.ordenes?.num_orden
          this.documento.valor_orden = res.ordenes?.valor
          res.detalles.forEach((p) => {
            Object.assign(p, {
              valor: p.valor,
              descripcion: p.tipo_concepto,
              comentario: p.comentario,
              id_cuenta: 0,
              codigo_cuenta: p.cuentas.codigo,
              descripcion_cuenta: p.cuentas.nombre
            });
          })
          this.pagos = JSON.parse(JSON.stringify(res.detalles));
        }
        else {
          res.detalles.forEach((p) => {
            this.conceptos.filter((c) => {
              if (c.valor === p.tipo_concepto) {
                Object.assign(p, {
                  valor: p.valor,
                  descripcion: c.descripcion,
                  comentario: p.comentario,
                  id_cuenta: 0,
                  codigo_cuenta: p.cuentas.codigo,
                  descripcion_cuenta: p.cuentas.nombre
                });
              }
            })
          })
          this.pagos = JSON.parse(JSON.stringify(res.detalles));
        }

        this.totalPago = res.total;

        this.formReadOnly = true;

        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
        this.vmButtons[4].habilitar = false;

      }
    )

    // Escoge Proceso
    this.commonVrs.seleciconSolicitud.asObservable().subscribe(
      (res) => {
        console.log(res)

        console.log(res['fk_idp']);
        // Proceso de Compra/Contratacion
        if(this.procesoCompra == false){
          this.documento.nro_proceso = res.num_solicitud;
          this.documento.nombre_proceso = res.descripcion;
          this.documento.monto_proceso = res.valor;
          this.documento.total_aprobado = res.con_valor;
          this.documento.nro_poliza = res.poliza?.num_poliza;
          this.documento.vigencia_poliza = res.poliza?.fecha_finalizacion;
          this.documento.idp = res.idp;
          this.documento.fk_solicitud_compra = res.id_solicitud;

          if(res.fk_idp!= null){
            this.documento.fk_idp = res.fk_idp;
          }else{
            this.documento.fk_idp = null;
          }
          this.id_solicitud = res.id_solicitud;

          this.getCondiciones(res.id_solicitud);


        }else if(this.procesoCat == false || this.procesoInf == false){

          if(this.documento.tipo=='CAT'){
            this.documento.nro_proceso = res.solicitud.num_solicitud;
            this.documento.nombre_proceso = res.solicitud.descripcion;
            this.documento.monto_proceso = res.solicitud.valor;
            this.documento.total_aprobado = res.solicitud.ce_valor ?? 0;
            this.documento.idp = res.solicitud.idp;
            this.documento.id_ordenes = res.id_ordenes;
            this.documento.num_orden = res.num_orden ? res.num_orden  : '';
            this.documento.valor_orden = res.valor_orden ? res.valor_orden : '';
            this.documento.fk_solicitud_compra = res.solicitud.id_solicitud;
            if(res.solicitud.fk_idp!= null){
              this.documento.fk_idp = res.solicitud.fk_idp;
            }else{
              this.documento.fk_idp = null;
            }
            this.id_solicitud = res.solicitud.id_solicitud;
          }else{
            this.documento.nro_proceso = res['num_solicitud'];
            this.documento.nombre_proceso = res['descripcion']
            this.documento.monto_proceso = res['valor'];
            this.documento.total_aprobado = res['inf_valor'] ?? 0;
            this.documento.idp = res['idp'];
            if(res['fk_idp']!= null){
              this.documento.fk_idp = res['fk_idp'];
            }else{
              this.documento.fk_idp = null;
            }
            this.id_solicitud = res['id_solicitud'];
            this.documento.fk_solicitud_compra = res['id_solicitud'];

            //this.getCondiciones(res['id_solicitud']);
          }


          //this.getCondiciones(res['id_solicitud']);
        }


      }
    )
    this.commonVrs.seleciconCategoriaCuentaPro.asObservable().subscribe(
      (res) => {
        console.log(res);
        if (res['validacion']) {
          this.grupo.id_cuenta_contable = res['data']['id'];
          this.grupo.codigo_cuenta_contable = res['data']['codigo'];
          this.grupo.descripcion_cuenta = res['data']['nombre'];
          this.addConcepto = false;
          this.titulosDisabled = false;
          this.condicionDisabled = false;
          this.addCondicion = false;
        } else {
          this.grupo.codigo_presupuesto = res['data']['codigo'];
          this.grupo.descripcion_presupuesto = res['data']['nombre']
        }

      }
    )

    this.commonVrs.modalCajaChica.subscribe(
      (res) => {
        this.documento.fk_cajaChi = res.id_configuracion_contable
        this.documento.cajaChicaName = res.descripcion
        this.cuentaDisabled = false;
      }
    )

  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
       // printSection: "PrintSection", imprimir: true
      },
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      { orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "fa fa-trash-o", texto: "ANULAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger btn-sm",
        habilitar: true
      }

    ]



    setTimeout(() => {
      this.validaPermisos();
      this.getCatalogoConceptos();
      this.cargarCuentas();

    }, 50);

  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.validaOrdenPago();
        break;
      case "BUSCAR":
        this.expandListDocumentosRec();
        break;
      case "IMPRIMIR":
        this.imprimirOrdenPago()
        break;
      case "LIMPIAR":
        this.confirmRestore();
        break;
      case "ANULAR":
        this.anularOrdenPago();
        break;
      default:
        break;
    }
  }

  triggerPrint(): void {
    this.print.nativeElement.click();
  }

  changeTab(tab){
    this.tabActiva = tab;
    console.log(this.tabActiva)

  }

  validaPermisos = () => {
    this.mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;

    let params = {
      codigo: myVarGlobals.fRenPredUrbanoEmision,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          // this.lcargando.ctlSpinner(false);
          // this.getCajaActiva();
          this.getConceptos();
          this.fillCatalog();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  selectAll() {
    this.facturas.map((e: any) => e.check = this.masterSelected)
    this.calcCheck();
    if (!this.masterSelected) {
      this.totalPago = 0;
    }
    else {

    }
  }
  calcCheck() {
    // console.log('Calculo')
    let cobroTotal = 0;
    this.facturas.forEach(e => {
      if (e.check) {
        let cobro100 = + parseFloat(e.total);
        cobroTotal += +cobro100;
        this.calcDifCobroPago();
      }
      else {
        // console.log("holis")

      }
    });

    this.totalPago = cobroTotal;
    if (this.totalPago > 0) {
      this.vmButtons[0].habilitar = false;
    }
  }
  selectedCheck(index, check) {
    console.log(check)

    this.facturas.filter(e => {
      if (check.check) {
        if (e.id != check.id) {
          this.pagosFacturas.push(check)
        }
      }

    });
    console.log(this.pagosFacturas)

  }


  tipoSelected(event) {
    this.pagosUnaFactura= [];
    this.addCompra = true;
    console.log(event);
    this.proveedorActive = {
      razon_social: ""
    };
    this.condiciones = []
    if (event == 'PC') {
      this.procesoCompra = false;
      this.procesoConceptos = true;
      this.procesoFacturas = true;
      this.cajaVL = false;
      this.procesoCat = true
      this.procesoInf = true
      this.tipo_proceso = "Contratacion"
      this.tipo_compras_pub ="PC"
      this.procesoUnaFactura = true;
      this.tabActiva= 'nav-condiciones';



    } else if (event == 'VF') {
      //this.getProvCompras(this.proveedorActive.id_proveedor)
      this.procesoFacturas = false;
      this.procesoCompra = true;
      this.procesoConceptos = true;
      this.cajaVL = false;
      this.procesoCat = true
      this.procesoInf = true
      this.procesoUnaFactura = true
    }
    else if (event == 'CAT' ){
      this.procesoCat = false
      this.procesoInf = false
      this.procesoCompra = true
      this.procesoConceptos = false
      this.procesoFacturas = true;
      this.cajaVL = false;
      this.tipo_proceso = "Catalogo Electronico"
      this.tipo_compras_pub = "CAT"
      this.procesoUnaFactura = true
    }
    else if ( event == 'INF'){
      this.procesoCat = false
      this.procesoInf = false
      this.procesoCompra = true
      this.procesoConceptos = false
      this.procesoFacturas = true;
      this.cajaVL = false;
      this.tipo_proceso = "Infimas"
      this.tipo_compras_pub = "INF"
      this.procesoUnaFactura = true
    }
    else if ( event == 'PF'){
      this.procesoCat = true
      this.procesoInf = true
      this.procesoCompra = true
      this.procesoConceptos = true
      this.procesoFacturas = true;
      this.procesoUnaFactura = false;
      this.cajaVL = false;
      this.tabActiva= 'nav-ordenes';
    }
    else {

      this.procesoCompra = true;
      this.procesoFacturas = true;
      this.documento.nro_proceso = "";
      this.documento.nombre_proceso = "";
      this.documento.monto_proceso = "";
      this.documento.nro_poliza = "";
      this.documento.vigencia_poliza = "";
      this.documento.idp = "";
      this.documento.fk_idp = "";
      this.procesoConceptos = false;
      this.condicionDisabled = true;
      this.cajaVL = false;
      this.procesoCat = true
      this.procesoInf = true
      this.procesoUnaFactura = true
    }

    if (event == 'CAJACHICA' || event == 'VIATICOS' ) {
      this.cajaVL = true;
    }
  }



  getCondiciones(id_solicitud) {
    let data = {
      params: id_solicitud,
    };
    this.mensajeSpinner = "Buscando condiciones...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getCondiciones(data).subscribe(

      (res) => {
        console.log(res)
        //this.condiciones = res["data"];
        this.condiciones = Object.values(res['data']);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
  getProvCompras(id_proveedor) {
    let data = {
      params: id_proveedor,
    };
    this.mensajeSpinner = "Buscando facturas...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getProvCompras(data).subscribe(

      (res) => {
        console.log(res)
        //this.condiciones = res["data"];
        //this.facturas = Object.values(res['data']);
        this.facturas = [];

        res['data'].forEach(e => {
          Object.assign(e, {
            check: false,
            num_doc: e.num_doc ?? "NA",
            fecha_compra: e.fecha_compra,
            valor_iva: e.valor_iva ?? "NA",
            subtotal: e.subtotal,
            total: e.total,
          })
          this.facturas.push(e);
          // console.log(this.deudas)

        });
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getCatalogoConceptos() {
    let data = {
      params: "'OP_CONCEPTOS', 'REC_TIPO_ORDENP'",
      //params: "'OP_CONCEPTOS','PAG_TIPO_DESEMBOLSO'",
    };
    this.mensajeSpinner = "Buscando concepto...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getCatalogoConcepto(data).subscribe(

      (res) => {
        this.conceptos = res["data"]['OP_CONCEPTOS'];

        res["data"]["REC_TIPO_ORDENP"].forEach(element => {
          let data = {
            valor: element.valor,
            descripcion: element.descripcion

          }

          this.tipoOrden.push(data)
          console.log(this.tipoOrden)
        });


        // this.tipoDesembolso = res["data"]['PAG_TIPO_DESEMBOLSO'];
        this.lcargando.ctlSpinner(false);
        // console.log(new Date(this.documento.vigencia_poliza)).format('YYYY-MM-DD') < this.documento.fecha)('conceptos '+res);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getConceptos() {
    this.mensajeSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getConceptos().subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Conceptos para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res['data'].forEach(c => {
          let concepto = {
            id: c.id_concepto,
            codigo: c.codigo,
            nombre: c.nombre,
            id_tarifa: c.id_tarifa,
            tipo_calculo: c.tipo_calculo,
            tiene_tarifa: c.tiene_tarifa == 1 ? true : false //llena el campo con true si tiene tarifa
          }
          this.conceptosList.push({ ...concepto })
        })


        this.conceptosList = this.conceptosList.filter(c => (c.codigo != "BA" && c.codigo != "AN" && c.codigo != "EX"));

        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  restar(deuda) {
    deuda.nuevo_saldo = +deuda.saldo - +deuda.cobro;
    this.calcCobroTotal();
  }

  calcCobroTotal() {
    let cobroTotal = 0;
    this.deudas.forEach(e => {
      // if (e.aplica) {
      cobroTotal += +e.cobro; // en este caso es total porque sale de valor unitario * cantidad
      // }
    });
    this.totalCobro = cobroTotal;
    // this.calcSaldoRestanteTotal();
    this.calcDifCobroPago();
  }

  sumar(pago) {

    this.calcPagoTotal();
  }

  calcPagoTotal() {
    let pagoTotal = 0;
    this.pagos.forEach(e => {
      // if (e.aplica) {
      pagoTotal += +e.valor; // en este caso es total porque sale de valor unitario * cantidad
      // }
    });
    if (this.documento.tipo == 'PC') {
      this.pagosCondicion.forEach(e => {
        // if (e.aplica) {
        pagoTotal += +e.valor; // en este caso es total porque sale de valor unitario * cantidad
        // }
      });
      this.generaPreviewAsientoContable()
    } else if (this.documento.tipo == 'VF') {
      this.pagosFacturas.forEach(e => {
        // if (e.aplica) {
        pagoTotal += +e.valor; // en este caso es total porque sale de valor unitario * cantidad
        // }
      });
    }else if(this.documento.tipo == 'PF'){
      this.pagosUnaFactura.forEach(e => {
        // if (e.aplica) {
        pagoTotal += +e.valor; // en este caso es total porque sale de valor unitario * cantidad
        // }
      });
      this.detallesUnaFactura.forEach((element: any) => {
        console.log(element.valor_item, pagoTotal)
        // const proporcional: number = parseFloat(element.valor_item) / pagoTotal
        Object.assign(element, {
          // proporcional,
          base: pagoTotal,
        })
      })
      this.generaPreviewAsientoContable()
    }

    this.totalPago = pagoTotal;
    this.calcDifCobroPago();
  }

  calcDifCobroPago() {
    this.difCobroPago = +this.totalCobro - +this.totalPago;

  }

  removeTitulo(index) {

    this.deudas.splice(index, 1);
    this.calcCobroTotal();
  }

  removeFormaPago(index) {

    this.pagos.splice(index, 1);
    if (this.pagos.length == 0) {
      this.vmButtons[0].habilitar = true;
    }
    this.calcPagoTotal();
  }
  removeCondicion(index) {

    this.pagosCondicion.splice(index, 1);
    if (this.pagosCondicion.length == 0) {
      this.vmButtons[0].habilitar = true;
    }
    this.calcPagoTotal();
  }

  selectConcepto() {


    this.conceptos.forEach(c => {
      if (c.valor === this.formaPago) {
        this.desConcepto = c.descripcion;
      }
    })
    if (this.formaPago == 0) {
      this.addConcepto = true;
    } else {
      this.addConcepto = false;
    }
  }
  selectCondicion() {


    this.condiciones.forEach(c => {
      if (c.condicion === this.condicionesPago) {
        this.desCondicion = c.condicion;
        this.valorCondicion = c.valor;
        this.idCondicion = c.id_condicion;

      }
    })
    if (this.condicionesPago == 0) {
      this.addCondicion = true;
    } else {
      this.addCondicion = false;
    }
  }


  modalSolicitud() {

    if (!this.proveedorActive.id_proveedor) {

      this.toastr.info('Debe seleccionar primero un proveedor')

    } else {

      if(this.tipo_compras_pub =="CAT"){
        let modal = this.modalService.open(ModalSolicitudCatComponent, {
          size: "xl",
          backdrop: "static",
          windowClass: "viewer-content-general",
        })
        modal.componentInstance.proveedor = this.proveedorActive
        modal.componentInstance.tipo_proceso = this.tipo_proceso
      }
      else {
        let modal = this.modalService.open(ModalSolicitudComponent, {
          size: "xl",
          backdrop: "static",
          windowClass: "viewer-content-general",
        })
        modal.componentInstance.proveedor = this.proveedorActive
        modal.componentInstance.tipo_proceso = this.tipo_proceso
      }



    }

  }
  agregaCompra(compra : any) {
    this.pagosUnaFactura= [];


    let nuevo = {
      id: compra.id,
      num_doc: compra.num_doc ?? "NA",
      num_proceso: compra.contratacion?.num_solicitud,
      fecha_compra: compra.fecha_compra,
      valor_iva: compra.valor_iva ?? "NA",
      subtotal: compra.subtotal,
      total: compra.saldo,
      saldo:compra.saldo,
      saldo_orden_pago:compra.saldo_orden_pago,
      valor: compra.saldo_orden_pago,
      id_cuenta: this.grupo.id_cuenta_contable,
      codigo_cuenta: this.grupo.codigo_cuenta_contable,
      descripcion_cuenta: this.grupo.descripcion_cuenta,
    }
    this.pagosUnaFactura.push(nuevo);

    this.detallesUnaFactura = []
    console.log(compra.detalle_cuentas)
    compra.detalle_cuentas.forEach((element: any) => {
      console.log(parseFloat(element.totalitems) )
      console.log(parseFloat(element.iva_detalle_item) )
      console.log(parseFloat(element.total_rft) )
      console.log(parseFloat(element.total_riva) )
      console.log(parseFloat(element.valor_anticipo) )
      console.log(parseFloat(element.valor_multa) )

      if(element.totalitems == null)element.totalitems=0
      if(element.iva_detalle_item == null)element.iva_detalle_item=0
      if(element.total_rft == null)element.total_rft=0
      if(element.total_riva == null)element.total_riva=0
      if(element.valor_anticipo == null)element.valor_anticipo=0
      if(element.valor_multa == null)element.valor_multa=0


      let totalConIva = parseFloat(element.totalitems) +  parseFloat(element.iva_detalle_item)
      let totalConDescuentos = totalConIva - parseFloat(element.total_rft) - parseFloat(element.total_riva) - parseFloat(element.valor_anticipo) -  parseFloat(element.valor_multa)
      console.log(totalConDescuentos)
      if(this.documento.tipo == 'PF'){
        this.fk_compra_cab = compra.id;
        this.fk_proveedor = compra.fk_id_proveedor;

        this.detallesUnaFactura.push({
          fk_compra_det: element.id,
          cuenta_cxp: element.var_cod_codigo_cxp,
          nombre_cuenta_cxp: element.var_nombre_cxp,
          codigo_partida: element.codigo_partida,
          partida_nombre: element.catalogo_presupuesto?.nombre,
          codigopartida: element.codigopartida, ///codigo partida ICP
          proporcional: element.valor_proporcional,
          base: nuevo.valor,
          total: totalConDescuentos,
          fecha: compra.fecha_compra,
          fk_compra_cab: compra.id,
          fk_proveedor: compra.fk_id_proveedor,
          fk_programa: element.fk_programa
        })
      }else {
        this.detallesUnaFactura.push({
          fk_compra_det: element.id,
          cuenta_cxp: element.var_cod_codigo_cxp,
          nombre_cuenta_cxp: element.var_nombre_cxp,
          codigo_partida: element.codigo_partida,
          partida_nombre: element.catalogo_presupuesto?.nombre,
          proporcional: element.valor_proporcional,
          base: nuevo.valor,
          total: element.totalitems,
          fecha: compra.fecha_compra
        })
      }


    })



    this.calcPagoTotal();

    this.vmButtons[0].habilitar = false;
    // console.log(this.deudas)
  }

  agregaConceptos() {

    let nuevo = {
      id_documento_forma_pago: 0,
      fk_documento: 0, // sera el id del documento que se cree primero la cabecera
      tipo_concepto: this.formaPago,
      numero_documento: "",
      descripcion: this.desConcepto,
      valor: 0,
      comentario: "",
      id_cuenta: this.grupo.codigo_cuenta_contable,
      codigo_cuenta: this.grupo.codigo_cuenta_contable,
      descripcion_cuenta: this.grupo.descripcion_cuenta
    }
    this.pagos.push(nuevo);
    this.vmButtons[0].habilitar = false;
  }
  agregaCondiciones() {

    let nuevo = {
      id_condicion: this.idCondicion,
      id_documento_forma_pago: 0,
      fk_documento: 0, // sera el id del documento que se cree primero la cabecera
      tipo_concepto: this.condicionesPago,
      numero_documento: "",
      descripcion: this.desCondicion,
      valor: 0,
      comentario: "",
      id_cuenta: this.grupo.codigo_cuenta_contable,
      codigo_cuenta: this.grupo.codigo_cuenta_contable,
      descripcion_cuenta: this.grupo.descripcion_cuenta
    }
    let cuenta = {
      codigo: this.cuenta.cuenta_contable,
      nombre:this.cuenta.name_cuenta
    }

    if(this.cuentasBanco.length == 0){
      this.cuentasBanco.push(cuenta)
    }else{
      this.cuentasBanco.forEach(e => {
        if(e.codigo != this.cuenta.cuenta_contable){
          this.cuentasBanco.push(cuenta)
        }
      })
    }
    this.cuentasBanco

    this.pagosCondicion.push(nuevo);
    this.generaPreviewAsientoContable()
    this.vmButtons[0].habilitar = false;
  }

  checkDeudas() {
    for (let i = 0; i < this.deudas.length; i++) {
      //console.log(new Date(this.documento.vigencia_poliza)).format('YYYY-MM-DD') < this.documento.fecha)(this.deudas[i].nuevo_saldo)
      if (
        this.deudas[i].nuevo_saldo < 0
      ) {
        return true;
      }
    }
    return false;
  }

  async validaOrdenPago() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos emitir Ordenes de Pago.", this.fTitle);
      return
    } //else {
      /* let resp = await  */this.validaDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.createRecDocumento();
        }
      });
    // }
  }

  validaDataGlobal() {
    // this.pagosCondicion.forEach(e => {
    //   let condicion = this.condiciones.filter(c => c.id_condicion == e.id_condicion)
    //   console.log(condicion)

    // })

    console.log(new Date(this.documento.vigencia_poliza) < new Date(this.documento.fecha));
    console.log(this.documento.valor_dolares, this.totalPago);
    let flag = false;
    return new Promise((resolve, reject) => {



      if (this.documento.tipo == 'PC') {
        if (
          this.pagosCondicion.length <= 0 || !this.pagosCondicion.length
        ) {
          this.toastr.info("Debe ingresar al menos una Condición")
          flag = true;
        }
        else if (this.documento.nro_proceso == "" || this.documento.nro_proceso == undefined) {
          this.toastr.info("Debe ingresar un Nro del Proceso para el pago")
          flag = true;
        }
        else if (this.documento.nombre_proceso == "" || this.documento.nombre_proceso == undefined) {
          this.toastr.info("Debe ingresar un Nombre del Proceso para el pago")
          flag = true;
        }
        else if (this.documento.monto_proceso == 0 || this.documento.monto_proceso == undefined) {
          this.toastr.info("Debe ingresar un Monto del Proceso para el pago")
          flag = true;
        }
        else if (this.documento.nro_poliza == "" || this.documento.nro_poliza == undefined) {
          this.toastr.info("Debe ingresar un Nro de Póliza para el pago")
          flag = true;
        }
        else if (this.documento.vigencia_poliza == "" || this.documento.vigencia_poliza == undefined) {
          this.toastr.info("No existe fecha de vigecia de Pólizqa por favor revisar")
          flag = true;
        }

        if (this.documento.tiene_divisas) {
          if (this.documento.valor_dolares != this.totalPago) {
            this.toastr.info("El valor Total debe ser igual al valor en dolares");
            flag = true;
          }
        }


        if (new Date(this.documento.vigencia_poliza) <= new Date(this.documento.fecha)) {

          this.toastr.info("La vigencia de la Póliza esta vencida por favor revisar")
          flag = true;
        }

        if (this.pagosCondicion.length > 0) {
          this.pagosCondicion.forEach(e => {
            let condicion = this.condiciones.filter(c => c.id_condicion == e.id_condicion)
            if (e.valor <= 0) {
              this.toastr.info("Debe ingresar un valor mayor a 0 en " + e.tipo_concepto)
              flag = true;
            }else if(e.valor > condicion[0].valor){
              this.toastr.info("El valor en " + e.tipo_concepto + " de $"+ this.commonService.formatNumberDos(e.valor) +" no puede ser mayor al valor de la condicion $ " + this.commonService.formatNumberDos(condicion[0].valor) )
              flag = true;
            }
          })
        }
      } else if (this.documento.tipo == 'VF') {
        if (this.totalPago == 0 || this.totalPago == undefined) {
          this.toastr.info("El valor a pagar debe ser mayor a 0")
          flag = true;
        } else if (this.grupo.codigo_cuenta_contable == 0 || this.grupo.codigo_cuenta_contable == undefined) {
          this.toastr.info("Debe seleccionar una cuenta")
          flag = true;
        }

        if (this.documento.tiene_divisas) {
          if (this.documento.valor_dolares != this.totalPago) {
            this.toastr.info("El valor Total debe ser igual al valor en dolares");
            flag = true;
          }
        }
      } else if (this.documento.tipo == 'PF') {
        if (this.totalPago == 0 || this.totalPago == undefined) {
          this.toastr.info("El valor a pagar debe ser mayor a 0")
          flag = true;
        }
        else if (this.cuenta == undefined || this.cuenta == null || this.cuenta == "") {
          this.toastr.info("Debe seleccionar una cuenta")
          flag = true;
        }

        if (this.documento.tiene_divisas) {
          if (this.documento.valor_dolares != this.totalPago) {
            this.toastr.info("El valor Total debe ser igual al valor en dolares");
            flag = true;
          }
        }
        if (this.documento.tiene_beneficiario) {
          if (this.documento.fk_beneficiario == null || this.documento.fk_beneficiario== undefined) {
            this.toastr.info("Si tiene beneficiario debe seleccionar uno");
            flag = true;
          }
        }
        if(this.pagosUnaFactura.length > 0){
          let ultimoPaso= 0;
          this.pagosUnaFactura.forEach(
            (factura, index)=>{
              if(parseFloat(factura['valor']) > parseFloat(factura['saldo_orden_pago'])){
                this.toastr.info("El total a pagar no puede ser mayor al saldo");
                flag = true;
              }


            }
          )
        }
      }else {
        if (
          this.pagos.length <= 0 || !this.pagos.length
        ) {
          this.toastr.info("Debe ingresar al menos un concepto")
          flag = true;
        }
        else if (this.pagos.length > 0) {
          this.pagos.forEach(e => {
            if (e.valor <= 0) {
              this.toastr.info("Debe ingresar un valor mayor a 0 en " + e.tipo_concepto)
              flag = true;
            }
          })
        }

        if (this.documento.tiene_divisas) {
          if (this.documento.valor_dolares != this.totalPago) {
            this.toastr.info("El valor Total debe ser igual al valor en dolares");
            flag = true;
          }
        }
      }

      // else if(this.documento.tipo_desembolso==0 || this.documento.tipo_desembolso==undefined) {
      //   this.toastr.info("Debe iseleccionar un Tipo Desembolso para el pago")
      //   flag = true;
      // }




      !flag ? resolve(true) : resolve(false);
    })
  }


  generaPreviewAsientoContable(){
    try {


      // let DetailCount = 0;
      // if(this.documento.forma_pago == 'TRANSFERENCIA'){

      //   if(this.deudas.length > 0){
      //     let cuentas=[]
      //     this.asiento = []
      //     console.log(this.valorCuentas)
        if(this.documento.tipo == 'PF'){
          this.asiento = []
          let pagoTotal = 0
          this.pagosUnaFactura.forEach(e => {
            // if (e.aplica) {
            pagoTotal += +e.valor; // en este caso es total porque sale de valor unitario * cantidad
            // }
          });
          console.log(this.cuenta)
          if(this.cuenta?.cuenta_contable){

              this.asiento.push({
                LoadOpcionCatalogoPresupuesto: false,
                presupuesto: '',
                codpresupuesto: 0,
                valor_presupuesto:0,
                account: this.cuenta.cuenta_contable,
                name: this.cuenta.name_cuenta,
                detail: "",
                debit:parseFloat('0.00'),
                credit:pagoTotal,
                centro: 0,
                tipo: 'A',
                tipo_detalle: 'Pago',
                tipo_presupuesto: '',
                tipo_afectacion: '',
                devengado: parseFloat('0.00'),
                cobrado_pagado:parseFloat('0.00'),
                fk_compra_cab: this.fk_compra_cab,
                fk_proveedor: this.fk_proveedor

              });

          }

          console.log(this.detallesUnaFactura)
          if(this.detallesUnaFactura.length > 0){
            this.detallesUnaFactura.forEach(e => {
              this.asiento.push({
                LoadOpcionCatalogoPresupuesto: false,
                presupuesto: e.codigo_partida != undefined ? e.partida_nombre : '',
                codpresupuesto: e.codigo_partida,
                codigopartida: e.codigo_partida != undefined ? e.codigopartida : '', //codigo partida ICP
                valor_presupuesto:e.total ,
                account: e.cuenta_cxp,
                name: e.nombre_cuenta_cxp,
                detail: "",
                debit:e.total ,
                credit:parseFloat('0.00'),  //elementDetail.valor,
                centro: 0,
                tipo: 'A',
                tipo_detalle: 'Pago',
                fk_orden_pago:'',
                tipo_desembolso: '',
                tipo_presupuesto: e.codigo_partida != undefined ? 'GASTOS' : '',
                tipo_afectacion: e.codigo_partida != undefined ? 'PAGADO' : '',
                devengado:parseFloat('0.00'),
                cobrado_pagado: e.codigo_partida != undefined ? e.total : parseFloat('0.00'),
                fecha: e.fecha,
                fk_compra_cab: e.fk_compra_cab,
                fk_proveedor: e.fk_proveedor,
                fk_programa: e.fk_programa
              })
            });
            this.TotalizarAsiento();
          }
        }else if(this.documento.tipo == 'PC'){
          this.asiento = []
          let pagoTotal = 0

          this.pagosCondicion.forEach(e => {
            // if (e.aplica) {
            pagoTotal += +e.valor; // en este caso es total porque sale de valor unitario * cantidad
            // }
          });

          if(this.cuenta?.cuenta_contable){
            this.asiento.push({
              LoadOpcionCatalogoPresupuesto: false,
              presupuesto: '',
              codpresupuesto: 0,
              valor_presupuesto:0,
              account: this.cuenta.cuenta_contable,
              name: this.cuenta.name_cuenta,
              detail: "",
              debit:parseFloat('0.00'),
              credit:pagoTotal,
              centro: 0,
              tipo: 'A',
              tipo_detalle: 'Pago',
              tipo_presupuesto: '',
              tipo_afectacion: '',
              devengado: parseFloat('0.00'),
              cobrado_pagado:parseFloat('0.00'),
              fk_compra_cab: null,
              fk_proveedor: this.fk_proveedor,
              fecha: this.documento.fecha

            });
          }



          if(this.pagosCondicion.length > 0){
            this.pagosCondicion.forEach(e => {
              if(e.codigo_cuenta){
                this.asiento.push({
                  LoadOpcionCatalogoPresupuesto: false,
                  presupuesto: '',
                  codpresupuesto: 0,
                  valor_presupuesto:0,
                  account: e.codigo_cuenta,
                  name: e.descripcion_cuenta,
                  detail: "",
                  debit:e.valor ,
                  credit:parseFloat('0.00'),
                  centro: 0,
                  tipo: 'A',
                  tipo_detalle: 'Pago',
                  tipo_presupuesto: '',
                  tipo_afectacion: '',
                  devengado: parseFloat('0.00'),
                  cobrado_pagado:parseFloat('0.00'),
                  fk_compra_cab: null,
                  fk_proveedor: this.fk_proveedor,
                  fecha: this.documento.fecha
                });
              }
            })

            this.TotalizarAsiento();
          }
        }




    } catch (err) {
      console.log(err)
      //alert('Something went wrong, try again later!')
      //this.router.navigate(['/login']);
    }
  }

   TotalizarAsiento() {
    console.log(this.asiento)

   // if(this.asiento.length > 0){
        this.totalAsiento=[]

        let TotalDebito = 0;
        let TotalCredito = 0;
        let TotalPresupuesto = 0;
        let arrayDebit = []
        let arrayCredit = []
        for (let index = 0; index < this.asiento.length; index++) {
          const element =this.asiento[index];
          arrayDebit.push(element.debit)
          arrayCredit.push(element.credit)
          TotalDebito +=  element.debit
          TotalCredito +=  element.credit
          TotalPresupuesto +=  element.valor_presupuesto

        }

        this.totalAsiento.push({
          LoadOpcionCatalogoPresupuesto: false,
          presupuesto: '',
          codpresupuesto: '',
          valor_presupuesto: TotalPresupuesto,
          account: '',
          name: '',
          detail: "",
          credit: TotalCredito,
          debit: TotalDebito,
          centro: 0,
          tipo: 'T',
          tipo_detalle: ''
        });
        console.log(this.totalAsiento)
    // }else{
    //   this.totalAsiento=[]
    // }

  }

  createRecDocumento() {
    /* if (this.permissions.guardar == "0") {
       this.toastr.warning("No tiene permisos emitir Ordenes de Pago.", this.fTitle);
     } else {
       if(this.documento.observacion==""||this.documento.observacion==undefined){
         this.toastr.info("Debe ingresar una observación para el pago")
         return;
       } else if(
         this.pagos.length<=0||!this.pagos.length
       ) {
         this.toastr.info("Debe ingresar al menos un concepto")
         return;
       }else if(this.pagos.length>0){
         this.pagos.forEach(e => {
           if(e.valor <=0){
             this.toastr.info("Debe ingresar un valor mayor a 0 en "+ e.tipo_concepto )
             return;
           }
         })
       }*/




    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Está a punto de realizar una Orden de Pago ¿Desea continuar?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = "Verificando período contable";
        this.lcargando.ctlSpinner(true);
        let data = {
          "anio": Number(moment(this.documento.fecha).format('YYYY')),
          "mes": Number(moment(this.documento.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
          if (res["data"][0].estado !== 'C') {
            this.mensajeSpinner = 'Generando Orden de pago...';
            this.lcargando.ctlSpinner(true);
            this.documento.estado = "E";
            this.documento.cuenta = this.cuenta.name_banks;
            this.documento.id_banco = this.cuenta.id_banks;
            this.documento.tipo_documento = this.concepto.codigo;
            this.documento.fk_proveedor = this.proveedorActive.id_proveedor;
            this.documento.subtotal = this.totalPago;
            this.documento.total = this.totalPago;
            this.documento.detalles = [];
            this.documento.fk_caja = this.cajaActiva.id_caja;
           // this.documento.id_cuenta = this.grupo.id_cuenta_contable;
           this.documento.id_cuenta = this.grupo.codigo_cuenta_contable
            //console.log(new Date(this.documento.vigencia_poliza)).format('YYYY-MM-DD') < this.documento.fecha)(this.deudas);
            //console.log(new Date(this.documento.vigencia_poliza)).format('YYYY-MM-DD') < this.documento.fecha)(this.pagos);
            if (this.documento.tiene_divisas) {
              this.documento.tiene_divisas = 'S'
            } else {
              this.documento.tiene_divisas = 'N'
            }
            this.deudas.forEach(e => {
              if (e.aplica && e.cobro > 0) {

                let doc_det = {
                  id_documento_detalle: 0,
                  fk_documento: 0,
                  valor: e.valor ?? e.total,
                  abono: e.cobro,
                  saldo_anterior: e.saldo,
                  saldo_actual: e.nuevo_saldo,
                  comentario: e.comentario,
                  fk_concepto: e.fk_concepto,
                  codigo_concepto: e.concepto.codigo,
                }
                this.documento.detalles.push(doc_det);
              }
            });


            if (this.documento.tipo == 'PC') {
              this.pagosCondicion.forEach(e => {

                if (e.valor > 0) {
                  this.documento.formas_pago.push(e);
                }
              })
            } else if (this.documento.tipo == 'VF') {

              this.documento.formas_pago = this.facturas

              console.log(this.documento.formas_pago)
              //this.documento.formas_pago.push(this.facturas);
              // this.facturas.forEach(e => {

              //   if(e.check){
              //     this.documento.formas_pago.push(e);
              //   }
              // })
            }else if(this.documento.tipo == 'PF'){
              //pagosUnaFactura
              this.documento.formas_pago = this.pagosUnaFactura
              console.log(this.documento.formas_pago)
            }
             else {
              this.pagos.forEach(e => {

                if (e.valor > 0) {
                  this.documento.formas_pago.push(e);
                }
              })
            }
            let detailAsiento = this.asiento;
            let dataAsientoSave = {
              id_company: this.dataUser.id_empresa,
              doc_id: 0,
              date: moment(this.documento.fecha).format('YYYY-MM-DD'),
              details: detailAsiento,
              total: this.totalCobro,
              tipo_registro: "Orden de Pago",
              fk_compra_cab: this.fk_compra_cab
            }
            this.documento.asiento= dataAsientoSave
            this.documento.detalles_asiento = detailAsiento

            const usersFilter = this.commonService.filterUserNotification(1, 40)


            let data2 = {
              documento: this.documento,
              detalle_cuenta: this.detallesUnaFactura,
              usersFilter,
              ip: this.commonService.getIpAddress(),
              accion:`Orden de pago creada por ${this.dataUser['usuario']}`,
              id_controlador: myVarGlobals.fRenPredUrbanoEmision,

            }
            console.log(this.pagosFacturas)
            console.log(this.documento.formas_pago)
            //console.log(new Date(this.documento.vigencia_poliza)).format('YYYY-MM-DD') < this.documento.fecha)(this.documento);
            // servicio que crea el documento, sus detalles, sus formas de pago asociadas
            // tambien cambia el saldo de la tabla deudas y el campo estado pasa a C en liquidacion y deudas si el nuevo saldo es 0
            this.apiSrv.setRecDocumento(data2).subscribe(
              (res) => {
                //console.log(new Date(this.documento.vigencia_poliza)).format('YYYY-MM-DD') < this.documento.fecha)(res);
                if (res["status"] == 1) {
                  console.log(usersFilter)
                  this.socket.onEmitNotification(usersFilter);
                  this.documento = res['data'];
                  this.documento.documento = res['data']['documento'];
                  this.documento.estado = res['data']['estado'];
                  this.asientoCabname =this.documento['num_asiento'];
                  this.asientoCabId = this.documento['id_asiento'];
                  this.formaPago = 0;
                  this.formReadOnly = true;
                  this.vmButtons[0].habilitar = true;
                  this.vmButtons[2].habilitar = false;
                  this.vmButtons[3].habilitar = false;
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "success",
                    title: "Orden de pago generada",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  }).then((res) => {
                    if (res.isConfirmed) {

                    }
                  })
                } else {
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
              },
              (error) => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.message);
              }
            );


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
    //}
  }

  anularOrdenPago(){

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea anular esta orden de pago?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        this.mensajeSpinner = "Verificando período contable";
        this.lcargando.ctlSpinner(true);
        let data = {
          "anio": Number(moment(this.documento.fecha).format('YYYY')),
          "mes": Number(moment(this.documento.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
          if (res["data"][0].estado !== 'C') {

            this.mensajeSpinner = 'Anulando orden de pago...';
            this.lcargando.ctlSpinner(true);
            let data2 = {
              documento: this.documento
            }
            console.log(this.documento);
            this.apiSrv.anularOrdenPago(data2).subscribe(
              (res) => {
                this.lcargando.ctlSpinner(false);
                console.log(res);

                //this.documento = res['data'];
                this.documento.estado = res['data'].estado;
                // this.documento.fecha = res['data'].fecha.split(' ')[0];
                this.formReadOnly = true;
                this.vmButtons[0].habilitar = true;
                console.log(this.documento);
                // this.guardarDeuda(res['data'].id_liquidacion);

                Swal.fire({
                  icon: "success",
                  title: "Orden de Pago anulado exitosamente",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                })
              },
              (error) => {
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "error",
                  title: "Error al anular el pago",
                  text: error.error.message,
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                });
              }
            );


          } else {
            this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
            this.lcargando.ctlSpinner(false);
          }

          }, error => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.mesagge);
          })

      }else {
        this.lcargando.ctlSpinner(false);
      }
    });
  }

  confirmRestore() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea reiniciar el formulario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.restoreForm();
      }
    });
  }

  restoreForm() {
    this.formReadOnly = false;
    this.titulosDisabled = true;
    this.addConcepto = true;
    this.addCondicion = true;
    this.procesoCompra = true;
    this.procesoConceptos = false;
    this.procesoFacturas = true;
    this.procesoUnaFactura = true;
    this.condicionDisabled = true;
    this.cuentaDisabled = true;
    this.checkDisabled = false;
    this.cajaVL = false;
    this.changeDivisas = false;
    this.changeBeneficiario = false;
    this.procesoCat = true
    this.procesoInf = true
    this.addCompra = true
    this.disabledCampo = false;
    this.busqueda= true

    this.proveedorActive = {
      razon_social: ""
    };
    this.beneficiarioActive = {
      razon_social: ""
    };

    // this.conceptosList = [];
    this.concepto = 0;

    this.totalCobro = 0;
    this.totalPago = 0;
    this.difCobroPago = 0;

    this.deudas = [];
    this.fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
    this.verifyRestore = false;

    this.pagos = [];
    this.pagosCondicion = [];
    this.pagosFacturas = [];
    this.pagosUnaFactura= [];
    this.totalAsiento=[]
    this.asiento = []

    this.formaPago = 0;

    this.documento = {
      id_documento: null,
      tipo_documento: "", // concepto.codigo
      fk_contribuyente: null, // contr id
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      observacion: "",
      estado: "P",
      subtotal: 0,
      total: 0,
      detalles: [], // deudas
      formas_pago: [], // pagos
      fk_caja: 0,
      nro_proceso: "",
      nombre_proceso: "",
      monto_proceso: "",
      nro_poliza: "",
      vigencia_poliza: moment(new Date()).format('YYYY-MM-DD'),
      tipo_desembolso: 0,
      idp: "",
      fk_idp: 0,
      id_cuenta: "",
      fk_cajaChi: 0,
      cajaChicaName: '',
      tiene_divisas: false,
      moneda_divisas: 0,
      tipo_cambio: null,
      valor_divisa: null,
      valor_dolares: 0,
      num_orden: "",
      valor_orden:0,
      tiene_beneficiario: false,
      fk_beneficiario: null
    }
    this.grupo = {
      id_cuenta_contable: null,
      codigo_grupo_producto: null,
      descripcion: null,
      codigo_cuenta_contable: null,
      codigo_presupuesto: null,
      estado: null,
      descripcion_cuenta: null,
      descripcion_presupuesto: null,
      tipo_bien: null
    }

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;

  }

  handleConcepto() {
    this.titulosDisabled = false;
  }

  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  onlyNumberDot(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  expandListProveedores() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Proveedores.", this.fTitle);
    } else {
      const modalInvoice = this.modalService.open(ModalProveedoresComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      modalInvoice.componentInstance.validacion = 'proveedor';
      //modalInvoice.componentInstance.validacion = 8;
    }
  }

  expandListBeneficiarios() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Proveedores.", this.fTitle);
    } else {
      const modalInvoice = this.modalService.open(ModalProveedoresComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      modalInvoice.componentInstance.validacion = 'beneficiario';
    }
  }



  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.mensajeSpinner = "Cargando Catalogos";
    let data = {
      params: "'DIVISAS'",
    };
    this.apiSrv.getCatalogs(data).subscribe(
      (res) => {
        // console.log(res);
        this.catalog = res["data"]["DIVISAS"];


        // console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cambioDeDivisas() {
    console.log(typeof this.documento.tipo_cambio);
    console.log(this.documento.moneda_divisas);
    if (this.documento.tipo_cambio === null) {
      return this.toastr.info('Ingrese el tipo de cambio')
    } else if (this.documento.moneda_divisas == 0 || this.documento.moneda_divisas == 0) {
      return this.toastr.info('Escoja la moneda')
    }
    this.cambioVal = true;
    this.botonRegresa = true;
    this.cambioMoneda = true;

  }

  regresarDeDivisas() {
    this.cambioVal = false;
    this.botonRegresa = false;
    this.cambioMoneda = false
    this.documento.valor_divisa = null;
    this.documento.valor_dolares = null;

  }

  openDivisas(event) {

    if (event) {
      this.changeDivisas = true;
    } else {
      this.changeDivisas = false;
      this.cambioMoneda = false;
      this.documento.valor_divisa = null;
      this.documento.valor_dolares = null;

    }

  }

  openBeneficiario(event){
    console.log(event.target.checked)
    console.log(this.documento.tiene_beneficiario)

    this.changeBeneficiario = event.target.checked;
    // if(event){
    //   this.changeBeneficiario = true;
    // }else{
    //   this.changeBeneficiario = false;
    // }
    console.log(this.changeBeneficiario)
  }

  cambioDivisas(event) {
    this.documento.valor_dolares = event * this.documento.tipo_cambio
  }

  cargarCuentas() {

    this.apiSrv.listarCuentasBancos({}).subscribe((res: any) => {
      //console.log(res);
      res.map((data) => {
        this.listaCuentas.push(data)


      })
    })
  }

  imprimirAsiento() {
    console.log(this.asientoCabId)
    window.open(environment.ReportingUrl + "rpt_asiento_contable.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.asientoCabId, '_blank')
  }


  expandListDocumentosRec() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListRecDocumentosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
    modal.componentInstance.cmb_tipoOrden = this.tipoOrden
  }
  modalCuentaContable() {
    let modal = this.modalService.open(ModalCuentPreComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true

  }

  searchCaja() {
    let modal = this.modalService.open(ModalCajaComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  expandModalCompras() {
console.log(this.cuenta.length)


    if(this.grupo.codigo_cuenta_contable != undefined || (this.documento.tipo=='PF' && this.cuenta.length != 0)){
        // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
        const modal = this.modalService.open(ModalComprasComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
        modal.componentInstance.proveedor = this.proveedorActive;
        modal.componentInstance.permissions = this.permissions;
    }else{
      if((this.documento.tipo=='PF' && this.cuenta.length == 0)){
        this.toastr.warning('Debe seleccionar una cuenta')
      }else{
        this.toastr.warning('Debe seleccionar una cuenta contable')
      }

    }

  }

  imprimirOrdenPago(){
    if(this.documento.tipo == 'PF'){
      window.open(environment.ReportingUrl + "rpt_asiento_contable_orden_pago.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.documento.id_orden_pago, '_blank')
    }else{
      window.open(environment.ReportingUrl + "rep_tesoreria_orden_pago.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_orden=" + this.documento.id_orden_pago, '_blank')
    }
    //window.open(environment.ReportingUrl + "rep_rentas_tasas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + 116 + "&forma_pago=" + 'efectivo' , '_blank')
   // console.log(environment.ReportingUrl + "rep_rentas_comprobante_sobrante.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.idDoc)
  }




}

