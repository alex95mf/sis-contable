import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxCurrencyInputMode  } from 'ngx-currency';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { LiquidacionService } from './liquidacion.service';
import { ListLiquidacionesComponent } from './list-liquidaciones/list-liquidaciones.component';
import { ModalContribuyentesCompradorComponent } from './modal-contribuyentes-comprador/modal-contribuyentes-comprador.component';
//import e from 'cors';
import { ModalSupervivenciaComponent } from 'src/app/config/custom/modal-supervivencia/modal-supervivencia.component';
import { ModalExoneracionesComponent } from './modal-exoneraciones/modal-exoneraciones.component';
import { ModalExoneracionesAlComponent } from './modal-exoneraciones-al/modal-exoneraciones-al.component';

@Component({
standalone: false,
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.scss']
})
export class LiquidacionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle = "Emisión de Plusvalía y Alcabala";
  msgSpinner: string;
  vmButtons = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  formReadOnly = false;
  codCastDisabled = true;
  observacionesDisabled = true;
  conceptosDisabled = true;
  exoneracionDisabled = true;
  verifyRestore = false;
  conceptos = [];
  conceptos_2 = [];
  listaActivos: any = [];

  mostrarPro = false;
  impProvAl: any = 0

  conceptoStaPlus:boolean = true;
  conceptoStaAlca:boolean = true;

  sumaTotalSolares = 0;

  liquidacion = {
    id: null,
    documento: "",
    documento_2: "",
    fk_documento_2: 53,
    fk_lote: null,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    estado: true,
    fk_contribuyente: null,
    fk_contribuyente_2: null,
    fk_concepto: 52,
    observacion: "",
    subtotal: 0,
    exoneraciones: 0,
    total: 0,
    pl_subtotal_0: 0,
    pl_subtotal_1: 0,
    pl_subtotal_2: 0,
    pl_recargo:0,
    pl_coactiva:0,
    pl_interes:0,
    pl_descuento:0,
    pl_exoneraciones: 0,
    pl_base_imponible: 0,
    pl_subtotal: 0,
    pl_total: 0,
    al_cuantia: 0,
    al_descuento: 0,
    al_subtotal: 0,
    al_subtotal_0: 0,
    al_exoneraciones: 0,
    al_total: 0,
    al_subtotal_1: 0,
    al_subtotal_2: 0,
    al_recargo:0,
    al_coactiva:0,
    al_interes:0,
    al_descuento2:0,
    certificado_pv: "",
    certif_pv_valor: 0,
    exoneracion_al: 0,
    // certif_al_valor: 0,
    // certificado_al: "",
    detalles: [],
    concepto: { codigo: 'PL' },
    concepto_2: { codigo: 'AL' },
    pl_sta:0,
    al_sta:0,
    al_imps:0
  };


  liquidacion_2 = {
    id: null,
    // documento: "",
    // documento_2: "",
    fk_documento_2: 52,
    fk_lote: null,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    estado: true,
    fk_contribuyente: "",
    fk_contribuyente_2: "",
    fk_concepto: 53,
    observacion: "",
    subtotal: 0,
    exoneraciones: 0,
    total: 0,
    pl_exoneraciones: 0,
    pl_base_imponible: 0,
    pl_subtotal: 0,
    pl_total: 0,
    al_cuantia: 0,
    al_descuento: 0,
    al_subtotal: 0,
    al_subtotal_0: 0,
    al_exoneraciones: 0,
    al_subtotal_1: 0,
    al_subtotal_2: 0,
    al_total: 0,
    certificado_pv: "",
    certif_pv_valor: 0,
    exoneracion_al: 0,
    // certif_al_valor: 0,
    // certificado_al: "",
    detalles: [],
    concepto: { codigo: 'AL' },
    concepto_2: { codigo: 'PL' }
  };

  propiedades: any = [];
  contribuyenteActive: any = {};
  contribuyenteCActive: any = {};
  propiedadActive: any = {};
  propiedadActive2: any;
  conceptosBackup: any = [];
  conceptosBackup_2: any = {};
  exoneracionesBackup: any = [];
  exoneraciones: any = [];
  exoneracionesAL: any = [];

  detallesPl: any = []
  detallesAl: any = []

  al_descuento: any
  pl_descuento: any
  al_porcentaje: any
  pl_porcentaje
  alcabalaDisabled = true;
  avaluoComercial: any
  valor_solares_contrib = 0
  lista_Propiedades: any = []
  id_solar = 0
  id = 0
  id_alcabala = 0
  avaluo_alcabala = 0

  edit_detalles_plusvalia = []
  edit_detalles_alcabala = []

  variable: number | null = null;
  max_inputnumber: number = 100_000_000;
  options = {
    //max: 1000000,
    min: 0,
    inputMode: NgxCurrencyInputMode .Natural,
  }
  options2 = {
    //max: 1000000,
    precision: 3,
    min: 0,
    inputMode: NgxCurrencyInputMode .Natural,
  }

  certList = [
    {value: "S",label: "SI"},
    {value: "N",label: "NO"},
  ]



  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: LiquidacionService,
    private cierremesService: CierreMesService
  ) {
    this.commonVarService.selectListLiq.asObservable().subscribe(
      (res) => {
        console.log(res)
        this.detallesAl = []
        this.detallesPl = []
        this.msgSpinner = 'Cargando datos de la Liquidación...';
        this.lcargando.ctlSpinner(true)
        this.restoreForm(false, false);
        //this.restoreForm2(false, false)
        //res.certificado_pv = this.liquidacion.certificado_pv
        this.liquidacion.certificado_pv =  res.certificado_pv
        res.alcaba = this.liquidacion_2

        this.mostrarPro = true;

        if (res.estado == "P") {
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
          this.vmButtons[3].habilitar = false;
          this.vmButtons[4].habilitar = false;
          this.vmButtons[5].habilitar = false;
          this.avaluoComercial = parseFloat(res.lote.avaluo)
          this.formReadOnly = false;
          this.alcabalaDisabled = false
          this.conceptosDisabled = false
          //this.calcSubtotal()
          //this.calcSubtotal_2()
          //this.calcExonerALTotal()
          //this.calcExonerTotal()
          this.cargarActivos()


        }
        else {
          this.formReadOnly = true;
          this.alcabalaDisabled = true
          //this.calcSubtotal()
          this.vmButtons[0].habilitar = true;
          this.vmButtons[3].habilitar = false;
          this.vmButtons[4].habilitar = true;
          this.vmButtons[5].habilitar = true;
        }


        console.log(res)
        this.id = res['id_liquidacion']
        this.id_alcabala = res.alcabala.id_liquidacion
        this.liquidacion = res;
        this.liquidacion_2.detalles = res.alcabala.detalles

        this.contribuyenteCActive = res.contribuyente_2;
        this.contribuyenteActive = res.contribuyente;

        if (res.lote != null) {
          this.propiedades = [
            {
              id: res.lote.id,
              cod_catastral: res.cod_catastral,
              manzana: res.lote.manzana,
              solar: res.lote.solar,
              area: res.lote.area
            }
          ];
        }
        else {
          this.propiedades = [
            {
              id: null,
              cod_catastral: res.cod_catastral,
              manzana: null,
              solar: null,
              area: null
            }
          ];
        }
       this.propiedadActive = res.lote;
       this.propiedadActive2 = 'Cod.Catastral:'+ res.lote.cod_catastral +' Mz.: '+ res.lote.manzana +' Solar:'+ res.lote.solar +' Area:'+ res.lote.area

       res.detalles.forEach(e => {
          if(e.concepto.codigo_detalle === 'AVCC'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 1
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'AVCT'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 2
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'AVALUO'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 3
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'ADQ2'){
            let fila = Object.assign(e, {
              comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 4
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'ADQ1'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 5
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'ADQU'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 6
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'CON2'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 7
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'CON1'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 8
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'CONS'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 9
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'UTIL'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 10
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'CEME'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 11
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'UTCE'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 12
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'REBA'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 13
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'UTRE'){
            let fila = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 14
            });
            this.detallesPl.push(fila);

          }else if(e.concepto.codigo_detalle === 'DEVA'){
            let fila = Object.assign(e, {
              comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle, idCon: 15
            });
            this.detallesPl.push(fila);

          }

          if(e.concepto.codigo_detalle == "AVALUO"){
            this.avaluo_alcabala = e.valor
          }
        });


        this.detallesPl.sort(function(a, b) {
          return a.idCon - b.idCon;
        });

        res.alcabala.detalles.forEach(e => {
          if(e.fk_con_det_aplicado == null ){
            let fila_2 = Object.assign(e, {
               comentario: e.comentario, valor: e.total, porcentaje: e.porcentaje, concepto: e.concepto, id_liquidacion_detalle: e.id_liquidacion_detalle
            });
            this.detallesAl.push(fila_2)
          }
        });

        res.detalles.forEach(e => {
          if (e.fk_con_det_aplicado) {
            let exon = {
              id_liquidacion_detalle: e.id_liquidacion_detalle,
              cod_concepto_det_aplicable: e.cod_con_det_aplicado,
              con_det_codigo: e.concepto.codigo_detalle,
              comentario: e.comentario,
              descripcion: e.concepto.nombre_detalle,
              porcentaje: e.porcentaje,
              //valor: e.porcentaje
            }
            console.log(exon)
            this.exoneraciones.push(exon);

          }
        });

        res.alcabala.detalles.forEach(e => {
          if (e.fk_con_det_aplicado) {
            let exon = {
              id_liquidacion_detalle: e.id_liquidacion_detalle,
              cod_concepto_det_aplicable: e.cod_con_det_aplicado,
              con_det_codigo: e.concepto.codigo_detalle,
              comentario: e.comentario,
              descripcion: e.concepto.nombre_detalle,
              porcentaje: e.porcentaje,
              //valor: e.porcentaje
            }
            console.log(exon)
            this.exoneracionesAL.push(exon);
          }
        });
        console.log()

        // this.liquidacion.pl_interes = 0.00
        // this.liquidacion.al_interes = 0.00

        // this.liquidacion.pl_descuento = 0.00
        // this.liquidacion.al_descuento2 = 0.00

        // this.liquidacion.pl_subtotal_1 = parseFloat(res.pl_subtotal) - parseFloat(res.pl_exoneraciones) + parseFloat(res.pl_sta)
        // this.liquidacion.al_subtotal_1 = parseFloat(res.al_subtotal) - parseFloat(res.al_exoneraciones) + parseFloat(res.alcabala.al_sta)
        // console.log(this.liquidacion.pl_subtotal_1)
        // console.log(this.liquidacion.al_subtotal_1)
        // this.liquidacion.al_sta = res.alcabala.al_sta
        // this.liquidacion.pl_total = res.pl_total
        // this.liquidacion.al_total = res.al_total

        this.liquidacion.pl_subtotal = res['subtotal']
        this.liquidacion.pl_subtotal_0 = res['subtotal_0']
        this.liquidacion.pl_subtotal_1 = res['subtotal_1']
        this.liquidacion.pl_subtotal_2 = res['subtotal_2']
        this.liquidacion.pl_sta = res['sta']
        this.liquidacion.pl_recargo = res['recargo']
        this.liquidacion.pl_coactiva = res['coactiva']
        this.liquidacion.pl_interes = res['interes']
        this.liquidacion.pl_descuento = res['descuento']

        this.liquidacion.pl_total = res['total']

        this.liquidacion.al_subtotal = res['alcabala']['subtotal']
        this.liquidacion.al_subtotal_0 = res['alcabala']['subtotal_0']
        this.liquidacion.al_subtotal_1 = res['alcabala']['subtotal_1']
        this.liquidacion.al_subtotal_2 = res['alcabala']['subtotal_2']
        this.liquidacion.al_imps = res['alcabala']['al_imps']
        this.liquidacion.al_sta = res['alcabala']['sta']
        this.liquidacion.al_recargo = res['alcabala']['recargo']
        this.liquidacion.al_coactiva = res['alcabala']['coactiva']
        this.liquidacion.al_interes = res['alcabala']['interes']
        this.liquidacion.al_descuento2 = res['alcabala']['descuento']
        this.liquidacion.al_total = res['alcabala']['total']

        this.liquidacion.fecha = moment(res.fecha).format('YYYY-MM-DD');

        this.vmButtons[0].habilitar = true;
        this.lcargando.ctlSpinner(false);
      }
    )
    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      (res) => {
        if (res.valid == 12) {
          this.selectContibuyente(res);
          if (res.fecha_nacimiento != null) {
            if (this.contribuyenteActive.contribuyente == "Natural" && this.contribuyenteActive.supervivencia == "S" && this.verificacionTerceraEdad(res.fecha_nacimiento)
            ) {
              this.expandSupervivencia(res.id_cliente);
            }
          }
          else {

          }
        }
      }
    )
    this.commonVarService.selectContribuyenteC.asObservable().subscribe(
      (res) => {
        this.selectContibuyenteC(res);

      }
    )
    this.commonVarService.selectExonerPV.asObservable().subscribe(
      (res) => {
        this.exoneraciones = res
        console.log(this.exoneraciones)
        this.calculateExoneraciones()
        this.pl_porcentaje = this.exoneraciones.porcentaje

      }
    )
    this.commonVarService.selectExonerAL.asObservable().subscribe(
      (res) => {
        this.exoneracionesAL = res
        console.log(this.exoneracionesAL)

        this.exoneracionesAL.forEach(e => {
          Object.assign(e, {fk_concepto_detalle: e['fk_concepto_det']})
        });

        this.calculateExoneracionesAL()
        // this.calculateExoneraciones()
        console.log(this.exoneracionesAL)
        this.al_porcentaje = this.exoneracionesAL.porcentaje
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsRenLiq",
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
        orig: "btnsRenLiq",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: " BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenLiq",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
        printSection: "PrintSection", imprimir: true
      },
      {
        orig: "btnsRenLiq",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenLiq",
        paramAccion: "",
        boton: { icon: "fa fa-check", texto: "APROBADO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRenLiq",
        paramAccion: "",
        boton: { icon: "fas fa-edit", texto: "EDITAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
    ]
    setTimeout(() => {
      this.validaPermisos();
      this.calcSubtotal
      this.validarStaPlusALca();
    }, 0);
  }

  validaPermisos = () => {
    this.msgSpinner = 'Cargando Permisos de Usuario...'
    this.lcargando.ctlSpinner(true)
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))
    this.empresLogo = this.dataUser.logoEmpresa
    let params = {
      codigo: myVarGlobals.fRenPALiquidacion,
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
          this.lcargando.ctlSpinner(false);
          this.getConceptos();
          this.getConceptos_2();
          this.calcSubtotal

        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.createLiquidacion();
        break;

      case " BUSCAR":
        this.expandListLiquidaciones();
        break;
      case " IMPRIMIR":
        break;
      case " LIMPIAR":
        this.confirmRestore();
        break;
      case "APROBADO":
        this.aprobar();
        break;
      case "EDITAR":
        this.editar();
        break;
      default:
        break;
    }
  }

  validaMinMax(event, item) {
    console.log(event, item);
    if (event.value > this.max_inputnumber) {
      event.value = this.max_inputnumber;
    }
    item.valor = event.value;
    console.log(item);
    /* const el = event.target || event
    console.log(el, item.valor)

    if(el.type == "number" && el.max && el.min ){
      let value = parseInt(el.value)
      el.value = value // for 000 like input cleanup to 0
      let max = parseInt(el.max)
      let min = parseInt(el.min)
      if ( value > max ) {el.value = el.max; item.valor = el.max}
      if ( value < min ) {el.value = el.min; item.valor = el.min}
    } */
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
        this.restoreForm2(false, false);

      }
    });
  }

  restoreForm(keepContr, softRestore) {
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.formReadOnly = false;
    this.conceptosDisabled = true;
    this.exoneracionDisabled = true;
    this.alcabalaDisabled = true
    this.liquidacion = {
      id: null,
      documento: "",
      documento_2: "",
      fk_documento_2: 53,
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: true,
      fk_contribuyente: null,
      fk_contribuyente_2: null,
      fk_lote: null,
      fk_concepto: 52,
      observacion: "",
      subtotal: 0,
      exoneraciones: 0,
      total: 0,
      pl_exoneraciones: 0,
      pl_subtotal_0: 0,
      pl_subtotal_1: 0,
      pl_subtotal_2: 0,
      pl_recargo:0,
      pl_coactiva: 0,
      pl_interes:0,
      pl_descuento:0,
      pl_base_imponible: 0,
      pl_subtotal: 0,
      pl_total: 0,
      al_cuantia: 0,
      al_descuento: 0,
      al_subtotal: 0,
      al_subtotal_0: 0,
      al_exoneraciones: 0,
      al_total: 0,
      al_subtotal_1: 0,
      al_subtotal_2: 0,
      al_recargo:0,
      al_coactiva:0,
      al_interes:0,
      al_descuento2:0,
      certificado_pv: "",
      certif_pv_valor: 0,
      // certif_al_valor: 0,
      // certificado_al: "",
      exoneracion_al: 0,
      detalles: [],
      concepto: { codigo: 'PL' },
      concepto_2: { codigo: 'AL' },
      pl_sta:0,
      al_sta:0,
      al_imps:0
    };

    this.conceptosBackup = [];
    this.conceptosBackup_2 = [];
    this.conceptos.forEach(e => {
      e.valor = 0;
      e.comentario = "";
      e.tiene_tarifa = 0;
    });
    this.conceptos_2.forEach(e => {
      e.valor = 0;
      e.comentario = "";
    })

    this.contribuyenteCActive = {};
    this.exoneracionesBackup = [];
    this.exoneraciones = [];
    if (keepContr && Object.keys(this.contribuyenteActive).length > 0) {
      this.liquidacion.fk_contribuyente = this.contribuyenteActive.id_cliente
    } else {
      this.contribuyenteActive = {};
      // this.contribuyenteCActive = {};
      this.codCastDisabled = true;
      this.observacionesDisabled = true;
      this.vmButtons[3].habilitar = true;
    }


    if (!softRestore) {
      this.verifyRestore = false;
      this.propiedades = [];
      this.propiedadActive = {};
      // this.detallesAl = []
      // this.detallesPl = []
      // this.getConceptos()
      // this.getConceptos_2()
    }

  }

  restoreForm2(keepContr, softRestore) {
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.formReadOnly = false;
    this.conceptosDisabled = true;
    this.exoneracionDisabled = true;
    this.alcabalaDisabled = true
    this.liquidacion = {
      id: null,
      documento: "",
      documento_2: "",
      fk_documento_2: 53,
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: true,
      fk_contribuyente: null,
      fk_contribuyente_2: null,
      fk_lote: null,
      fk_concepto: 52,
      observacion: "",
      certificado_pv: "",
      certif_pv_valor: 0,
      // certif_al_valor: 0,
      // certificado_al: "",
      subtotal: 0,
      exoneraciones: 0,
      total: 0,
      pl_exoneraciones: 0,
      pl_base_imponible: 0,
      pl_subtotal: 0,
      pl_subtotal_0: 0,
      pl_subtotal_1: 0,
      pl_subtotal_2: 0,
      pl_sta:0,
      pl_recargo:0,
      pl_coactiva:0,
      pl_interes:0,
      pl_descuento:0,
      pl_total: 0,
      al_cuantia: 0,
      al_descuento: 0,
      al_subtotal: 0,
      al_subtotal_0: 0,
      al_exoneraciones: 0,
      al_subtotal_1: 0,
      al_subtotal_2: 0,
      al_total: 0,
      al_recargo:0,
      al_coactiva:0,
      al_interes:0,
      al_sta:0,
      al_imps:0,
      al_descuento2:0,
      exoneracion_al: 0,
      detalles: [],
      concepto: { codigo: 'PL' },
      concepto_2: { codigo: 'AL' },
    };

    this.exoneracionesAL = []
    this.detallesPl = []
    this.detallesAl = []
    this.getConceptos();
    this.getConceptos_2();
    this.conceptosBackup = [];
    this.conceptosBackup_2 = [];
    this.conceptos.forEach(e => {
      e.valor = 0;
      e.comentario = "";
      e.tiene_tarifa = 0;
    });
    this.conceptos_2.forEach(e => {
      e.valor = 0;
      e.comentario = "";
    })

    this.contribuyenteCActive = {};
    this.exoneracionesBackup = [];
    this.exoneraciones = [];
    if (keepContr && Object.keys(this.contribuyenteActive).length > 0) {
      this.liquidacion.fk_contribuyente = this.contribuyenteActive.id_cliente
    } else {
      this.contribuyenteActive = {};
      // this.contribuyenteCActive = {};
      this.codCastDisabled = true;
      this.observacionesDisabled = true;
      this.vmButtons[3].habilitar = true;
    }


    if (!softRestore) {
      this.verifyRestore = false;
      this.propiedades = [];
      this.propiedadActive = {};
    }

    this.liquidacion_2 = {
      id: null,
      // documento: "",
      // documento_2: "",
      fk_documento_2: 52,
      fk_lote: null,
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      estado: true,
      fk_contribuyente: "",
      fk_contribuyente_2: "",
      fk_concepto: 53,
      observacion: "",
      subtotal: 0,

      exoneraciones: 0,
      total: 0,
      pl_exoneraciones: 0,
      pl_base_imponible: 0,
      pl_subtotal: 0,
      pl_total: 0,
      al_cuantia: 0,
      al_descuento: 0,
      al_subtotal: 0,
      al_subtotal_0: 0,
      al_exoneraciones: 0,
      al_subtotal_1: 0,
      al_subtotal_2: 0,
      al_total: 0,
      certificado_pv: "",
      certif_pv_valor: 0,
      exoneracion_al: 0,
      // certif_al_valor: 0,
      // certificado_al: "",
      detalles: [],
      concepto: { codigo: 'AL' },
      concepto_2: { codigo: 'PL' }
    };

    this.propiedadActive2 = ''
    this.mostrarPro = false;

  }

  validarStaPlusALca(){
    this.msgSpinner = 'Validadando Sta...';
    this.lcargando.ctlSpinner(true);

    this.apiService.getStaPlusAlca().subscribe(
      (res) => {
        this.lcargando.ctlSpinner(false);

        const datosPL = res['data'].filter(e => e.codigo == 'PL')[0]
        const datosAL = res['data'].filter(e => e.codigo == 'AL')[0]

        if(datosPL.tiene_sta == 'S') {
          this.conceptoStaPlus= false;
        }else{
          this.conceptoStaPlus= true;
        }
        if(datosAL.tiene_sta == 'S'){
          this.conceptoStaAlca = false;
        }else{
          this.conceptoStaAlca = true;
        }
        console.log(datosPL)
        console.log(datosAL)

      },
      (error) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(error.error.message, 'Error validando STA');
      }
    );
  }

  cargarActivos() {
    this.reiniciarActivos()
    let data = {
      id_contribuyente: this.contribuyenteActive.id_cliente,
      id_solar: this.id_solar
    }
    this.apiService.getLoteContribucion(data).subscribe((res) => {
      console.log(res)
      this.listaActivos = res;
      this.listaActivos.forEach(e => {
        this.valor_solares_contrib += parseFloat(e.valor)

      })

      // console.log(this.listaActivos)
      // this.listaActivos.map(  n => ( n ) )
      // console.log(this.listaActivos)
      // .reduce( (curr, accum) => curr + accum, 0);
    },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error al intentar cargar activos');
      }
    )
  }
  getConceptos() {
    this.msgSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    let data = {
      id_concepto: 52
    }
    this.apiService.getConceptoDetalle(data).subscribe(
      (res) => {
        res['data'].forEach(e => {
          let fila = { valor: 0, fk_concepto_detalle: e.id_concepto_detalle, comentario: '', concepto: e, porcentaje: 0 }
          this.detallesPl.push(fila)
          // Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle });
        })
        console.log(this.detallesPl)
        this.conceptos = JSON.parse(JSON.stringify(res['data']));

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(error.error.message, 'Error cargando Conceptos');
      }
    );
  }

  getConceptos_2() {
    this.msgSpinner = 'Obteniendo Conceptos...';
    this.lcargando.ctlSpinner(true);
    let data = {
      id_concepto: 53
    }
    this.apiService.getConceptoDetalle(data).subscribe(
      (res) => {
        res['data'].forEach(e => {
          let fila = { valor: 0, fk_concepto_detalle: e.id_concepto_detalle, comentario: '', concepto: e }
          this.detallesAl.push(fila)
          // Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle });
        })
        this.conceptos_2 = JSON.parse(JSON.stringify(res['data']));

        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(true);
        this.toastr.error(error.error.message, 'Error cargando Conceptos');
      }
    );
  }

  selectContibuyente(contr) {
    this.restoreForm(false, false);
    this.contribuyenteActive = contr;
    this.liquidacion.fk_contribuyente = contr.id_cliente;
    this.liquidacion_2.fk_contribuyente_2 = contr.id_cliente
    this.observacionesDisabled = false;
    this.vmButtons[3].habilitar = false;
    this.msgSpinner = 'Obteniendo Propiedades...'
    this.lcargando.ctlSpinner(true)
    this.apiService.getPropiedades(this.liquidacion.fk_contribuyente).subscribe(
      (res) => {
        if (res['data'].length > 0) {
          this.propiedades = res['data']
          this.codCastDisabled = false;
          this.lcargando.ctlSpinner(false);
        }
        else {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "warning",
            title: "Error cargando Propiedades",
            text: "El contribuyente seleccionado no presenta propiedades registradas a su nombre. Por favor seleccione otro contribuyente.",
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
          });
        }

      },
      (error) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(error.error.message, 'Error cargando Propiedades')
      }
    );
  }

  selectContibuyenteC(contr) {
    // this.restoreForm(false, false);
    this.contribuyenteCActive = contr;
    this.liquidacion.fk_contribuyente_2 = contr.id_cliente;
    this.liquidacion_2.fk_contribuyente = contr.id_cliente
    this.conceptosDisabled = false;
    this.alcabalaDisabled = false
    this.observacionesDisabled = false;
    this.vmButtons[3].habilitar = false;
    this.msgSpinner = 'Obteniendo Propiedades...'
    this.lcargando.ctlSpinner(true)

    this.apiService.getPropiedades(this.liquidacion.fk_contribuyente).subscribe(
      (res) => {
        if (this.liquidacion.fk_contribuyente != this.liquidacion.fk_contribuyente_2) {
          if (res['data'].length > 0) {
            this.propiedades = res['data']
            this.codCastDisabled = false;
            this.lcargando.ctlSpinner(false);
          } else {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "warning",
              title: "Error cargando Propiedades",
              text: "El contribuyente seleccionado no presenta propiedades registradas a su nombre. Por favor seleccione otro contribuyente.",
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
          }
        }
        else {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "warning",
            title: "Error ",
            text: "El contribuyente seleccionado es el mismo que en plusvalías, por favor seleccione un contribuyente diferente.",
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',

          });
          this.verifyRestore = true;
          this.restoreForm(true, true);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(error.error.message, 'Error cargando Propiedades')
      }
    );
  }

  selectPropiedad(event) {
    this.avaluoComercial = event.avaluo
    this.id_solar = event.id
    this.verifyRestore = true;
    // this.restoreForm(true, true);
    this.cargarActivos()
    this.calcSubtotal_2()


    // this.conceptosDisabled = false;
    this.exoneracionDisabled = false;
    this.calcSubtotal();
    this.liquidacion.fk_lote = event.id
    if (this.liquidacion.fk_contribuyente_2 == 0 || this.liquidacion.fk_contribuyente_2 == null || this.liquidacion.fk_contribuyente_2 == "") {
      Swal.fire({
        icon: "warning",
        title: "Seleccione un contribuyente para alcabala",
        showCloseButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8',
      });
    }


  }

  createLiquidacion() {

    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos emitir Liquidaciones.", this.fTitle);
    }
    else {
      if (this.liquidacion.fk_contribuyente_2 == undefined || this.liquidacion.fk_contribuyente_2 == "") {
        this.toastr.info("Debe seleccionar un contribuyente para alcabala")
        return;
      }

      else if (this.liquidacion.observacion == undefined || this.liquidacion.observacion == "") {
        this.toastr.info("Debe ingresar el comentario para la liquidación")
        return;
      }

      else if (this.liquidacion.al_subtotal <= 0) {
        this.toastr.info("Debe ingresar valores válidos el cálculo de alcaba ")
        return;
      }
      else if (this.liquidacion.pl_subtotal <= 0) {
        this.toastr.info("Debe ingresar valores válidos el cálculo de plusvalía")
        return;
      }
      else if (this.liquidacion.pl_total < 0) {
        this.toastr.info("El valor de total cobro en plusvalia no puede ser negativo")
        return;
      }
      else if (this.liquidacion.al_total < 0) {
        this.toastr.info("El valor de total cobro en alcabala no puede ser negativo ")
        return;
      }



      // for(let i = 0; i < this.detallesPl.length; i++) {
      //   if (this.detallesPl[i].valor <= 0 || this.detallesPl[i].price == null) {
      //     this.toastr.info("Debe ingresar los datos completos")
      //      return;
      //   }


      // }
      // for(let i = 0; i < this.detallesAl.length; i++) {
      //   if (this.detallesAl[i].valor <= 0 || this.detallesAl[i].price == null) {
      //     this.toastr.info("Debe ingresar los datos completos")
      //      return;
      //   }


      // }
    }
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Está a punto de emitir una nueva liquidación ¿Desea continuar?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {


        this.msgSpinner = 'Verificando período contable...';
        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(moment(this.liquidacion.fecha).format('YYYY')),
          "mes": Number(moment(this.liquidacion.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              this.msgSpinner = 'Generando Liquidación...';
              this.lcargando.ctlSpinner(true);
              this.liquidacion.detalles = [];
              this.liquidacion_2.detalles = [];

              this.detallesPl.forEach(e => {
                // if (e.valor > 0) {
                //   this.liquidacion.detalles.push(e);
                // }
                this.liquidacion.detalles.push(e);
              });

              this.detallesAl.forEach(e => {
                // if (e.valor > 0) {
                //   this.liquidacion_2.detalles.push(e);
                // }
                this.liquidacion_2.detalles.push(e);
              });
              console.log(this.exoneraciones)
              this.exoneraciones.forEach(e => {
                e['fk_concepto_detalle'] = e['fk_concepto_det'];
                this.liquidacion.detalles.push(e);
              });
              this.exoneracionesAL.forEach(e => {
                e['fk_concepto_detalle'] = e['fk_concepto_det'];
                this.liquidacion_2.detalles.push(e);
              });
              console.log(this.liquidacion.detalles)

              let data = {
                liquidacion: this.liquidacion,
                liquidacion_2: this.liquidacion_2

              }
              console.log(data);

              this.apiService.setLiquidaciones(data).subscribe(
                (res) => {
                  Swal.fire({
                    icon: "success",
                    title: "Liquidación generada",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  });
                  console.log(res);
                  this.vmButtons[0].habilitar = true;
                  this.liquidacion.documento = res['data']['documento']
                  // this.liquidacion = res['data']
                  // this.calcSubtotal()
                  // this.calcSubtotal_2()

                  this.formReadOnly = true;
                  this.mostrarPro = false;

                  this.vmButtons[2].habilitar = false;
                  this.vmButtons[3].habilitar = false;
                  this.vmButtons[5].habilitar = true;
                  this.lcargando.ctlSpinner(false);
                  this.conceptosDisabled = false;
                  // this.guardarDeuda(res['data'].id_liquidacion);

                  // this.calcSubtotal
                  // this.calcSubtotal_2
                  // this.calcExonerALTotal()
                  // this.formReadOnly = true;
                },
                (error) => {
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "error",
                    title: "Error al generar la liquidación",
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

      }
    });

  }


  guardarDeuda(id) {
    this.apiService.aprobarLiquidacionVendedor(id).subscribe(
      (res) => {
        console.log(res);
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(err.error.message);
      }
    )
  }

  //Para generar deuda de alcabalas
  guardarDeudaComprador(id) {
    this.apiService.aprobarLiquidacionComprador(id).subscribe(
      (res) => {
        console.log(res);
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(err.error.message);
      }
    )
  }

  onlyNumberDot(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  calcSubtotal() {
     console.log('ejecuta')
     console.log(this.avaluoComercial)

    let coad = 0;
    let aval = 0;
    let cons = 0;
    let adq1 = 0;
    let adq2 = 0;
    let con1 = 0;
    let con2 = 0;
    let deva = 0;
    let reba = 0;
    let ceme = 0;
    let avct = 0;
    let calculo = 0;
    let acomercial = 0;
    let sumaSolares = 0;
    let util = 0;
    let avalCC = 0;
    let baseAvaluo = 0;
    let avaluo_mayor = 0;
    acomercial = this.avaluoComercial
    let reba_desc = 0
    let reba_util = 0
    let utce = 0
    let reba_des_por = 0
    let reba_valor = 0
    let utre = 0
    let deva_desc = 0
    let deva_des_por = 0
    let util_deva = 0
    let cme = 0

    this.detallesPl.forEach(e => {

      if (e.concepto.codigo_detalle == "AVCT") {
        // this.valorConcepto =false;
        avct = +e.valor
        // Object.assign(e, { valor: avct, fk_concepto_detalle: e.id_concepto_detalle })
      }
      if (e.concepto.codigo_detalle == "AVCC") {
        // this.valorConcepto =false;

        Object.assign(e, { valor: this.avaluoComercial, fk_concepto_detalle: e.concepto.id_concepto_detalle })
      }
      if (avct > this.avaluoComercial) {
        this.avaluo_alcabala = avct
      }
      else {
        this.avaluo_alcabala = this.avaluoComercial
      }

      if (e.concepto.codigo_detalle == "ADQ1") {
        adq1 = +e.valor
      }
      if (e.concepto.codigo_detalle == "ADQ2") {
        adq2 = +e.valor
      }
      if (e.concepto.codigo_detalle == "CON1") {
        con1 = +e.valor
      }
      if (e.concepto.codigo_detalle == "CON2") {
        con2 = +e.valor
      }
      if (e.concepto.codigo_detalle == "CEME") {
        cme = +e.valor
      }


      //CEME
      // if (e.concepto.codigo_detalle == "CEME") {
      //   Object.assign(e, { valor: this.valor_solares_contrib, fk_concepto_detalle: e.concepto.id_concepto_detalle })
      // }


      if (avct > this.avaluoComercial) {
        let avaluo_mayor = avct
        if (e.concepto.codigo_detalle == "ADQU") {
          coad = adq2 + adq1
          Object.assign(e, { valor: coad, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        if (e.concepto.codigo_detalle == "CONS") {
          cons = con2 - con1
          Object.assign(e, { valor: cons, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        if (e.concepto.codigo_detalle == "AVALUO") {
          Object.assign(e, { valor: avaluo_mayor, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        if (e.concepto.codigo_detalle == "UTIL") {

          util = avaluo_mayor - cons - coad
          Object.assign(e, { valor: util, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        if (e.concepto.codigo_detalle == "UTCE") {
          // utce = util - this.valor_solares_contrib
          utce = util - cme
          Object.assign(e, { valor: utce, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        //rebaja
        if (e.concepto.codigo_detalle == "REBA") {
          reba_desc = +e.porcentaje
          reba_des_por = reba_desc / 100
          reba_util = utce * reba_des_por
          Object.assign(e, { valor: reba_util, fk_concepto_detalle: e.concepto.id_concepto_detalle, porcentaje: reba_desc })
        }

        if (e.concepto.codigo_detalle == "UTRE") {
          utre = utce - reba_util
          Object.assign(e, { valor: utre, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        if (e.concepto.codigo_detalle == "DEVA") {
          deva_desc = +e.porcentaje
          deva_des_por = deva_desc / 100
          util_deva = utre * deva_des_por
          Object.assign(e, { valor: util_deva, fk_concepto_detalle: e.concepto.id_concepto_detalle, porcentaje: deva_desc })
        }
      }

      else if (this.avaluoComercial >= avct) {
        let avaluo_mayor = this.avaluoComercial
        if (e.concepto.codigo_detalle == "ADQU") {
          coad = adq2 + adq1
          Object.assign(e, { valor: coad, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        if (e.concepto.codigo_detalle == "CONS") {
          cons = con2 - con1
          Object.assign(e, { valor: cons, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        if (e.concepto.codigo_detalle == "AVALUO") {
          Object.assign(e, { valor: avaluo_mayor, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        if (e.concepto.codigo_detalle == "UTIL") {

          util = avaluo_mayor - cons - coad
          Object.assign(e, { valor: util, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        if (e.concepto.codigo_detalle == "UTCE") {
          utce = util -  cme
          Object.assign(e, { valor: utce, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        //rebaja
        if (e.concepto.codigo_detalle == "REBA") {
          reba_desc = +e.porcentaje
          reba_des_por = reba_desc / 100
          reba_util = utce * reba_des_por
          Object.assign(e, { valor: reba_util, fk_concepto_detalle: e.concepto.id_concepto_detalle, porcentaje: reba_desc })

        }
        if (e.concepto.codigo_detalle == "UTRE") {
          utre = utce - reba_util
          Object.assign(e, { valor: utre, fk_concepto_detalle: e.concepto.id_concepto_detalle })
        }
        if (e.concepto.codigo_detalle == "DEVA") {
          deva_desc = +e.porcentaje
          deva_des_por = deva_desc / 100
          util_deva = utre * deva_des_por

          Object.assign(e, { valor: util_deva, fk_concepto_detalle: e.concepto.id_concepto_detalle, porcentaje: deva_desc })
        }
      }



      this.listaActivos.forEach(t => {
      })
    })
    console.log(acomercial , avct)

    if (acomercial > avct) {
      aval = acomercial
      coad = adq1 + adq2
      // calculo = aval - coad - cons - deva - reba - ceme
      calculo = utre - util_deva
      console.log(calculo)
      this.liquidacion.pl_base_imponible = calculo;
      this.liquidacion.pl_subtotal = calculo * 0.10 ;
      this.liquidacion.subtotal = this.liquidacion.pl_subtotal
      console.log(this.liquidacion.subtotal)
    }
    else {
      aval = avct
      coad = adq1 + adq2
      cons = con2 + con1
      // calculo = aval - coad - cons - deva - reba - ceme
      calculo = utre - util_deva
      this.liquidacion.pl_base_imponible = calculo;

      this.liquidacion.pl_subtotal = calculo * 0.10;
      this.liquidacion.pl_subtotal_0 = calculo * 0.10;


    }

    // }
    this.calculateExoneraciones()
    this.calcSubtotal_2()


  }

  getPorcentaje(event, d) {
    console.log(d.porcentaje)

    const descuento = Math.round(this.detallesAl[0].valor * this.detallesAl[1].porcentaje) / 100
    this.detallesAl[1].valor = descuento

    //let impconcejo =  Math.round(this.detallesAl[0].valor - descuento) * 0.01 * (this.detallesAl[2].porcentaje) / 100;
    let porcentajeUno = 0.01
    let porcentajeDos = 0.001
    let impconcejo =  Math.round(this.detallesAl[0].valor - descuento) * porcentajeUno * porcentajeDos / 100;
    //this.detallesAl[2].valor = impconcejo

    this.liquidacion.al_imps = impconcejo
    this.calcSubtotal_2()
  }
  // getPorcentajeImps(event, d) {
  //   console.log(d.porcentaje)
  //   const descuento2 = Math.round(this.detallesAl[0].valor * this.detallesAl[1].porcentaje) / 100

  //   let impconcejo =  Math.round(this.detallesAl[0].valor - descuento2) * (this.detallesAl[2].porcentaje) / 100;

  //   //let avaluo = this.detallesAl[0].valor
  //   //const imps = descuento * this.detallesAl[2].porcentaje) / 100
  //   this.detallesAl[2].valor = impconcejo

  //   this.calcSubtotal_2()
  // }

  calcSubtotal_2() {

    let calculo = 0;
    let avuo = 0;
    let desc = 0;
    let porcentaje = 0;
    let imp = 0;
    let acomercial = 0
    let avaluo_final = 0
    let porcImps = 0.001



    acomercial = this.propiedadActive.avaluo
    this.detallesAl.forEach(e => {
      if (e.concepto.codigo_detalle == "AVUO") {
        // console.log(this.propiedadActive)
        avuo = +e.valor
        Object.assign(e, { valor: this.avaluo_alcabala, fk_concepto_detalle: e.concepto.id_concepto_detalle })
      }
      if (e.concepto.codigo_detalle == "DESC") {
        desc = +e.valor
        Object.assign(e, { valor: desc, fk_concepto_detalle: e.concepto.id_concepto_detalle })
      }
      // if (e.concepto.codigo_detalle == "IMPS") {
      //   imp = +e.valor
      //   Object.assign(e, { valor: imp, porcentaje: porcImps, fk_concepto_detalle: e.concepto.id_concepto_detalle })
      // }
    })

    //calculo = this.avaluo_alcabala - desc + imp
    calculo = this.avaluo_alcabala - desc
    //this.impProvAl = imp
    this.liquidacion.al_cuantia = calculo;
    this.liquidacion_2.al_cuantia = calculo
    //this.liquidacion.al_subtotal = calculo * 0.01  + imp;
    this.liquidacion.al_subtotal = calculo * 0.01 ;
    this.liquidacion.al_subtotal_0 = calculo * 0.01 ;
    this.liquidacion_2.al_subtotal = calculo * 0.01;
    this.liquidacion_2.al_subtotal_0 = calculo * 0.01;
    //this.liquidacion_2.al_subtotal = calculo + imp;
    this.calcExonerTotal();
    this.calculateExoneracionesAL()

  }

  calculateExoneraciones() {
    let porcentaje = 0;
    let calculo = 0;
    let exo = 0
    let totalExo = 0
    if (this.exoneraciones.length == 0) {
      // this.liquidacion.pl_subtotal_1 = this.liquidacion.pl_subtotal + this.liquidacion.pl_sta
      // this.liquidacion.pl_total = this.liquidacion.pl_subtotal_1
      this.liquidacion.exoneraciones = 0
    }
    else {
      this.exoneraciones.forEach(e => {
        porcentaje = e.porcentaje * 100
        this.pl_porcentaje = e.porcentaje
        calculo = this.liquidacion.pl_subtotal / 100
        exo = calculo * porcentaje
        totalExo +=  +Math.floor(exo *100) /100


      });
      this.liquidacion.exoneraciones =  totalExo
      if (this.liquidacion.exoneraciones == 0) {
        // this.liquidacion.pl_subtotal_1 = this.liquidacion.pl_subtotal + this.liquidacion.pl_sta
        // this.liquidacion.pl_total = this.liquidacion.pl_subtotal_1
      }
      else {
        // this.liquidacion.pl_subtotal_1 = (this.liquidacion.pl_subtotal - this.liquidacion.exoneraciones)  + this.liquidacion.pl_sta
        // this.liquidacion.pl_total = this.liquidacion.pl_subtotal_1
      }
    }

    // if (this.liquidacion.exoneraciones == 0) {
    //   this.liquidacion.pl_subtotal_1 = this.liquidacion.pl_subtotal
    //   this.liquidacion.pl_total = this.liquidacion.pl_subtotal_1
    // }
   // this.calcTotal()
    this.calcSubtotal_1_1()

  }

  calcSubtotal_1_1() {
    let pl_subtotal_1 = this.liquidacion.pl_subtotal - this.liquidacion.exoneraciones;
    this.liquidacion.pl_subtotal_1 = pl_subtotal_1;

    this.calcSubtotal_2_1();
  }
  calcSubtotal_2_1() {
    let pl_subtotal_2 = this.liquidacion.pl_subtotal_1 + this.liquidacion.pl_sta;
    this.liquidacion.pl_subtotal_2 = pl_subtotal_2;
    this.calcTotal();
}

  calculateExoneracionesAL() {
    let porcentaje = 0;
    let calculo = 0;
    let exo = 0;
    let total = 0;
    let totalExo = 0
    if (this.exoneracionesAL.length == 0) {
      // this.liquidacion.al_subtotal_1 = this.liquidacion.al_subtotal + this.liquidacion.al_sta + this.impProvAl
      // this.liquidacion.al_total = this.liquidacion.al_subtotal_1
      this.liquidacion.al_exoneraciones = 0
    }
    else {
      this.exoneracionesAL.forEach(e => {
        porcentaje = e.porcentaje * 100
        calculo = this.liquidacion.al_subtotal / 100
        exo = calculo * porcentaje
        this.al_porcentaje = e.porcentaje
        totalExo += +Math.floor(exo * 100) / 100

      });
      this.liquidacion.al_exoneraciones = totalExo
      this.liquidacion_2.al_exoneraciones = totalExo
      if (this.liquidacion.al_exoneraciones == 0) {
        //total = this.liquidacion.al_subtotal
        // this.liquidacion.al_subtotal_1 = total + this.liquidacion.al_sta + this.impProvAl
        // this.liquidacion.al_total = this.liquidacion.al_subtotal_1
        // this.liquidacion_2.al_total = this.liquidacion.al_total
        // this.liquidacion_2.total = this.liquidacion_2.al_total
      }
      else {
        // total = this.liquidacion.al_subtotal - this.liquidacion.al_exoneraciones
        // this.liquidacion.al_subtotal_1 = total + this.liquidacion.al_sta + this.impProvAl
        // this.liquidacion.al_total = this.liquidacion.al_subtotal_1
        // this.liquidacion_2.al_total = this.liquidacion.al_subtotal_1
        // this.liquidacion_2.total = this.liquidacion_2.al_total
      }
    }


    // if (this.liquidacion.al_exoneraciones == 0) {
    //   total = this.liquidacion.al_subtotal
    //   this.liquidacion.al_subtotal_1 = total
    //   this.liquidacion.al_total = total
    //   this.liquidacion_2.al_total = total
    //   this.liquidacion_2.total = this.liquidacion_2.al_total
    // }
   // this.calcTotal()
   this.calcSubtotal_1_2()
  }

  calcExonerTotal() {
    let calculo = 0;
    this.exoneraciones.forEach(e => {
      e.valor = this.liquidacion.exoneraciones
      e.total = this.liquidacion.exoneraciones
      e.porcentaje = this.pl_porcentaje
      //this.conceptos.find(c => e.fk_concepto == c.fk_concepto).valor;
      //console.log(e.valor)
      //calculo += +e.valor
    });
    this.calcTotal();
  }

  calcSubtotal_1_2() {
    let al_subtotal_1 = this.liquidacion.al_subtotal - this.liquidacion.al_exoneraciones;
    this.liquidacion.al_subtotal_1 = al_subtotal_1;

    this.calcSubtotal_2_2();
  }
  calcSubtotal_2_2() {
      let al_subtotal_2 = this.liquidacion.al_subtotal_1 + this.liquidacion.al_sta + this.liquidacion.al_imps;
      this.liquidacion.al_subtotal_2 = al_subtotal_2;
      this.calcTotal();
  }
  calcTotal() {

    let sumasValoresAl =  (this.liquidacion.al_subtotal_2 + this.liquidacion.al_recargo  + this.liquidacion.al_coactiva + this.liquidacion.al_interes)
    this.liquidacion.al_total = sumasValoresAl - this.liquidacion.al_descuento2;
    let sumasValoresPl =  (this.liquidacion.pl_subtotal_2 + this.liquidacion.pl_recargo + this.liquidacion.pl_coactiva + this.liquidacion.pl_interes)
    this.liquidacion.pl_total = sumasValoresPl - this.liquidacion.pl_descuento;

    this.vmButtons[0].habilitar = false;
  }


  calcExonerALTotal() {
    let calculo = 0;
    this.exoneracionesAL.forEach(e => {
      console.log(e)
      e.valor = this.liquidacion.exoneracion_al
      e.total = this.liquidacion.exoneracion_al

    });
    console.log(this.exoneracionesAL)
  }

  // calcTotal() {
  //   let pl_preTotal = this.liquidacion.pl_subtotal_1;
  //   let al_preTotal = this.liquidacion.al_subtotal_1;
  //   this.liquidacion.pl_total = pl_preTotal;
  //   this.liquidacion.al_total = al_preTotal;

  //   this.vmButtons[0].habilitar = false;

  // }

  expandListLiquidaciones() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos de consultar Liquidaciones.", this.fTitle);
    } else {
      const modalInvoice = this.modalService.open(ListLiquidacionesComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPALiquidacion;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    }
  }

  expandContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    modalInvoice.componentInstance.validacion = 12;
  }

  expandContribuyentesC() {
    const modalInvoice = this.modalService.open(ModalContribuyentesCompradorComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;

  }

  expandExoneracion() {

    const modalInvoice = this.modalService.open(ModalExoneracionesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    //  modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
    modalInvoice.componentInstance.contribuyente = this.contribuyenteActive;
  }

  expandSupervivencia(id) {

    const modalInvoice = this.modalService.open(ModalSupervivenciaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.id_contribuyente = id;

    // modalInvoice.componentInstance.permissions = this.permissions;
    // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;

  }

  verificacionTerceraEdad(event) {
    // console.log(event);
    let fecha = event.split('-')
    let actualyear = new Date().getFullYear()
    let anio = actualyear - parseInt(fecha[0])
    let mes = (new Date().getMonth() + 1) >= parseInt(fecha[1])
    let dia = (new Date().getDate()) >= parseInt(fecha[2])


    if (anio >= 65) {

      if ((new Date().getMonth() + 1) > parseInt(fecha[1])) {

        return true
        console.log('Mayor a mes');

      } else if ((new Date().getMonth() + 1) == parseInt(fecha[1])) {
        if (dia) {

          return true
          console.log('Mayor mes y dia');
        } else {

          return (false)
        }
      } else {

        return (false)
        console.log(anio - 1);
      }

    } else {

      return (false)
      console.log(anio - 1);
    }

  }

  expandExoneracionAL() {
    console.log(this.contribuyenteCActive)
    console.log(this.contribuyenteActive)
    const modalInvoice = this.modalService.open(ModalExoneracionesAlComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    //  modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
    modalInvoice.componentInstance.contribuyente = this.contribuyenteCActive;
  }

  removeExoneracion(index) {
    this.exoneraciones.splice(index, 1);
    this.calculateExoneraciones();

  }

  removeExoneracionAL(index) {
    this.exoneracionesAL.splice(index, 1);
    this.calculateExoneracionesAL();


  }

  valorCertificado() {

    let coad = 0;
    let aval = 0;
    let cons = 0;
    let adq1 = 0;
    let adq2 = 0;
    let con1 = 0;
    let con2 = 0;
    let deva = 0;
    let reba = 0;
    let ceme = 0;
    let avct = 0;
    let calculo = 0;
    let acomercial = 0;
    let sumaSolares = 0;
    if (this.liquidacion.certificado_pv == "S") {
      this.liquidacion.certif_pv_valor = 10
      this.conceptos.forEach(e => {
        //calculos para costo de adquisicion
        if (e.codigo_detalle == "ADQ1") {
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "ADQ2") {
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "ADQU") {

          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        //calculos de construccion
        if (e.codigo_detalle == "CON1") {
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "CON2") {
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "CONS") {
          cons = con2 + con1
          Object.assign(e, { valor: cons, fk_concepto_detalle: e.id_concepto_detalle })
        }
        // DEVALUACION DE MONEDA
        if (e.codigo_detalle == "DEVA") {
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        //rebaja
        if (e.codigo_detalle == "REBA") {
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        //CEME
        if (e.codigo_detalle == "CEME") {
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "AVCT") {
          // this.valorConcepto =false;
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "AVCC") {
          // this.valorConcepto =false;
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "UTIL") {
          // this.valorConcepto =false;
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "AVALUO") {
          // this.valorConcepto =false;
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "UTCE") {
          // this.valorConcepto =false;
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "UTRE") {
          // this.valorConcepto =false;
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }

      })
      console.log(this.liquidacion.certif_pv_valor)
      this.liquidacion.pl_base_imponible = 0
      this.liquidacion.pl_subtotal = this.liquidacion.certif_pv_valor
      if (this.exoneraciones.length == 0) {
        this.liquidacion.pl_total = this.liquidacion.pl_subtotal
      }
      else {
        this.calcExonerTotal()
      }

      this.conceptos_2.forEach(e => {
        if (e.codigo_detalle == "AVUO") {
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "DESC") {
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
        if (e.codigo_detalle == "IMPS") {
          Object.assign(e, { valor: 0, fk_concepto_detalle: e.id_concepto_detalle })
        }
      })
      this.liquidacion.al_cuantia = 0
      this.liquidacion.al_subtotal = this.liquidacion.certif_pv_valor
      if (this.exoneracionesAL.length == 0) {
        this.liquidacion.al_total = this.liquidacion.al_subtotal
      }
      else {
        this.calcExonerTotal()
      }
    }
    else if (this.liquidacion.certificado_pv == 'N') {

      this.calcSubtotal()
      this.calcSubtotal_2()
      this.calcExonerTotal()
      this.calcExonerALTotal()

    }
    else {
      this.calcSubtotal()
      this.calcSubtotal_2()
      this.calcExonerTotal()
      this.calcExonerALTotal()
    }

  }

  reiniciarActivos() {
    this.listaActivos = []
    this.valor_solares_contrib = 0

  }

  aprobar() {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea aprobar està liquidación?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result) => {
      if (result.isConfirmed) {

        this.msgSpinner = 'Verificando período contable...';
        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(moment(this.liquidacion.fecha).format('YYYY')),
          "mes": Number(moment(this.liquidacion.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {

              this.msgSpinner = 'Guardando...';
              this.lcargando.ctlSpinner(true);
              let alcabala = {
                id_liquidacion: this.id_alcabala

              }

              let data = {
                id: this.id,
                alcabala

              }
              console.log(data)
              this.apiService.aprobarLiquidacion(data).subscribe(
                (res) => {
                  console.log(res)
                  if (res["status"] == 1) {
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "success",
                      title: "Se actualizó con éxito",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        this.lcargando.ctlSpinner(false);
                        this.vmButtons[4].habilitar = true;
                        this.vmButtons[5].habilitar = true;
                        this.guardarDeuda(this.id);
                        this.guardarDeudaComprador(this.id_alcabala)
                      }
                    })
                  }
                  else {
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8'
                    });
                  }

                },
                (error) => {
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.message);
                }
              )

            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

          }, error => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.mesagge);
          })

      }
    })

  }

  editar() {
    console.log(this.liquidacion.fecha)
    let msgInvalid = ''

    if (!moment(this.liquidacion.fecha).isValid()) msgInvalid += '* La fecha seleccionada es invalida.<br>'

    if (msgInvalid.length > 0) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return
    }
    // return
    this.liquidacion_2.id = this.id_alcabala
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar esta liquidacion?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74'
    }).then((result) => {
      if (result.isConfirmed) {

        this.msgSpinner = 'Verificando período contable...';
        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(moment(this.liquidacion.fecha).format('YYYY')),
          "mes": Number(moment(this.liquidacion.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {

              this.msgSpinner = 'Guardando...';
              this.lcargando.ctlSpinner(true);
              // this.calcSubtotal()
              // this.calcSubtotal_2()
              // this.calcExonerALTotal()
              // this.calcExonerTotal()
              // this.cargarActivos()
              console.log(this.detallesPl);

              this.liquidacion.detalles = []
              this.liquidacion_2.detalles = []


              this.detallesPl.forEach(e => {
                // if (e.valor > 0) {
                //   this.liquidacion.detalles.push(e);
                // }
                e['total'] = e.valor
                this.liquidacion.detalles.push(e);
              });

              this.detallesAl.forEach(e => {
                // if (e.valor > 0) {
                //   this.liquidacion_2.detalles.push(e);
                // }
                e['total'] = e.valor
                this.liquidacion_2.detalles.push(e);
              });
              console.log(this.exoneraciones)
              this.exoneraciones.forEach(e => {
                e['fk_concepto_detalle'] = e['fk_concepto_det'];
                this.liquidacion.detalles.push(e);
              });
              this.exoneracionesAL.forEach(e => {
                e['fk_concepto_detalle'] = e['fk_concepto_det'];
                this.liquidacion_2.detalles.push(e);
              });

              // this.liquidacion.detalles = this.edit_detalles_plusvalia
              // this.liquidacion_2.detalles = this.edit_detalles_alcabala

              let data = {
                liquidacion: this.liquidacion,
                liquidacion_2: this.liquidacion_2

              }
              // let alcabala = {
              //   id_liquidacion: this.id_alcabala,
              //   liquidacion_2: this.liquidacion_2,
              //   detalles: this.liquidacion_2.detalles,
              //   liquidacion : this.liquidacion

              //  }

              // let data = {
              //   id:this.id,
              //   liquidacion:this.liquidacion,
              //   detalles:this.liquidacion.detalles,
              //   alcabala
              // }
              console.log(data)

              this.apiService.editarLiquidacion(data).subscribe(
                (res) => {
                  console.log(res)
                  if (res["status"] == 1) {
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "success",
                      title: "Se actualizó con éxito",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        // this.mantenimientoDisabled = true
                      }
                    });
                    this.vmButtons[0].habilitar = true;
                    this.vmButtons[5].habilitar = true;
                  }
                  else {
                    this.lcargando.ctlSpinner(false);
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8'
                    });
                  }

                },
                (error) => {
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.message);
                }
              )

            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

          }, error => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.mesagge);
          })

      }
    })

  }

}
