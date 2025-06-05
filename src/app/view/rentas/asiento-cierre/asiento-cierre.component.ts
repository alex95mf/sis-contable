import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';

import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsientoCierreService } from './asiento-cierre.service';
import * as myVarGlobals from 'src/app/global';
import { ModalCierresComponent } from './modal-cierres/modal-cierres.component';
import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { SweetAlertResult } from 'sweetalert2';
import { ModalCuentasEmiComponent } from './modal-cuentas-emi/modal-cuentas-emi.component';
import { ExcelService } from 'src/app/services/excel.service';
import { environment } from 'src/environments/environment';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { ModalCuentasContablesComponent } from './modal-cuentas-contables/modal-cuentas-contables.component';



@Component({
standalone: false,
  selector: 'app-asiento-cierre',
  templateUrl: './asiento-cierre.component.html',
  styleUrls: ['./asiento-cierre.component.scss']
})
export class AsientoCierreComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Asiento Cierre";
  mensajeSpinner: string = "Cargando...";
  vmButtons: any = [];

  dataUser: any;
  permissions: any;
  empresLogo: any;

  cierres: Array<any> = [];
  existe: boolean=true;
  datosGuard:boolean=true;
  verTabla:boolean=false;
  paginate: any;
  filter: any;
  totalDebe: number = 0;
  totalHaber: number = 0;

  verifyRestore = false;
  formReadOnly:boolean=false;
  allowEdit: boolean = false;
  verBanco:boolean=false;

  cmb_tipo_cierre: any[] = [
    { value: 'EMI', label: 'Asientos de Emisión' },
    { value: 'REC', label: 'Asientos de Recaudación' },
    { value: 'NOM', label: 'Asientos de Nómina' },
    { value: 'DEP', label: 'Depreciacion' },
    { value: 'CIE', label: 'Cierres Anuales' },
    { value: 'TCC', label: 'Traspaso de Saldo CxC'},
    { value: 'DEPO', label: 'Depósito'},
    { value: 'CONSU', label: 'Consumibles'},
    { value: 'PAGORENTA', label: 'Pago de Impuesto a la Renta'},
    { value: 'PAGOIVA', label: 'Pago de Iva'},
  ]

  tipoPagoSueldo = [
    {value: "Q",label: "Quincena"},
    {value: "M",label: "Fin de mes"},
  ]
  tipoPago: any
  cuenta: any

  codigo_cuenta_contable: any = ''
  descripcion_cuenta: any =''

  codigo_presupuesto: any = ''

  asientoCierre: any ={
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    tipo_cierre: null,
  }
  asientoGuard:any ={
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    tipo:0,
    documento:""
  }
  concepto: {
    codigo: "CM"
  }

  conceptos: any[] = [
    { id_concepto: 0, nombre: 'TODOS' },
  ]

  aggCuenta: any;
  idxSelected: number;
  btnAggCuentaAjusteDisabled = false

  tipoAsientoList: any = []
  tipoAsiento: any = 0

  tipoContratoList: any = [];
  tipoContrato: any = 0

  cierreExcel: any = []

  numeros_control : any = []
  rubPagoTerceros: any = [];

  //tabs de nomina
  cols: any[];
  RolGeneral: any = [];
  totalRecords: any = 0
  dataGeneral: any = []
  numero_empleados: any = 0
  locality: any;

  selectedTab: any = 'nav-asiento-tab';
  listaCuentas: any = []
  cuentaBanco:  any = [];

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: AsientoCierreService,
    public dialogService: DialogService,
    private xlsService: ExcelService,
    private xlsServ: XlsExportService,
    private cierremesService: CierreMesService,

  ) {
    this.commonVrs.selectRecDocumento.asObservable().subscribe(
      (res) => {
        this.restoreForm();

        this.asientoCierre = res;
        this.asientoCierre.fecha = res.fecha.split(" ")[0];
        this.asientoGuard.id_con_cierre = res.id_con_cierre
        this.asientoGuard.num_documento = res.num_documento;
        this.asientoGuard.estado = res.estado;
        this.allowEdit = false

        Object.assign(this.filter, {
          tipo_cierre: res.tipo,
          fecha_desde: res.fecha
        })

        res.detalles.forEach((p) => {
                  let datos = {
                    fecha: p.fecha,
                   // fk_cueta_contable:p.concepto.cuenta_acreedora.id,
                    cuenta_contable: p.cuenta_contable,
                    cuenta_contable_nombre: p.cuenta_contable_nombre,
                    asiento:"",
                    t_m:"",
                    debe:p.debe,
                    haber:p.haber,
                    partida_presupuestaria_cod:p.partida_presupuestaria_cod,
                    partida_presupuestaria_desc:p.partida_presupuestaria_desc,
                    partida_presupuestaria_val:parseFloat(p.partida_presupuestaria_val),
                    fk_contribuyente: p.fk_contribuyente,
                    fk_liquidacion: p.fk_liquidacion,
                    fk_cuenta_contable:p.fk_cuenta_contable,
                    tipo_presupuesto:p.tipo_presupuesto,
                    tipo_afectacion: p.tipo_afectacion,
                    devengado: p.devengado,
                    cobrado_pagado: p.cobrado_pagado,

                  }

                  this.totalDebe += +p.debe;
                  this.totalHaber += +p.haber;

                  this.cierres.push(datos);
                  this.calcPagoTotal()
        })

      //  console.log(this.cierres)

        this.formReadOnly = true;
        this.datosGuard= false;

        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[3].habilitar = false;
        this.vmButtons[4].habilitar = false;
        this.vmButtons[5].habilitar = false;



      }
    )

    this.apiSrv.cuentaSelected$.subscribe((cuenta: any) => {
  //    console.log(cuenta)
      this.aggCuenta = cuenta;
    })
    this.apiSrv.cuentasContablesSelected$.subscribe((cuenta: any) => {
  //    console.log(cuenta)
      this.changeCuenta(cuenta)
      //this.aggCuenta = cuenta;
    })

    this.apiSrv.cuentaEmiSelected$.subscribe(({tipo, cuenta}) => {
    //  console.log(tipo, cuenta)
      if (tipo == 'Deudora') {
        // Decirle a la siguiente posicion la nueva regla de la cuenta seleccionada
        if (this.cierres[this.idxSelected + 1].regla != cuenta.esigef.numero_regla) {
          Object.assign(
            this.cierres[this.idxSelected + 1],
            {
              regla: cuenta.esigef.numero_regla,
              valid: false
            }
          )

        }
      } else if (tipo == 'Acreedora') {
        Object.assign(this.cierres[this.idxSelected], { valid: true }
        )
      }
    })
  }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;

    this.vmButtons = [
      {
        orig: "btnsAsiCierre",
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
        orig: "btnsAsiCierre",
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
        orig: "btnsAsiCierre",
         paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "GENERAR ORDEN" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true
      },
      {
        orig: "btnsAsiCierre",
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
        orig: "btnsAsiCierre",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsAsiCierre",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "ELIMINAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsAsiCierre",
        paramAccion: "",
        boton: { icon: "fas fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-success boton btn-sm",
        habilitar: true,
      },
    ]
    this.filter = {
     // concepto: 0,
      tipo_cierre: null,
      fecha_desde: moment().format('YYYY-MM-DD'),
      fecha_hasta: moment().subtract(1, 'd').format('YYYY-MM-DD'),
      tipo_asiento: 0,
      tipo_contrato:0,
      id_num_control: 0,
      rubros_pagos_terceros: 0
    }
    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    setTimeout(async ()=> {
      this.validaPermisos();
     await this.cargaInicial()
     this.cargarCuentas();
    }, 50);
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.guardarAsientoCierre();
        break;
      case "BUSCAR":
        this.expandListCierres()
        break;
      case "GENERAR ORDEN":
        this.GenerarOrden();
        break;
      case "IMPRIMIR":
        this.imprimirReporte();
        break;
      case "LIMPIAR":
        this.confirmRestore();
        break;
      case "ELIMINAR":
        this.eliminarAsiento();
        break;
      case "EXCEL":

      if(this.selectedTab == 'nav-asiento-tab'){
        this.GenerarReporteExcel();
      }
      if(this.selectedTab == 'nav-nomina-tab'){
        this.btnExportarExcelNuevo();
      }
        //this.exportarExcel();

        break;

      default:
        break;
    }
  }

  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
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
          // this.cargarConceptos()
          this.lcargando.ctlSpinner(false)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  async cargaInicial() {
    try {

      const resCatNomina = await this.apiSrv.getCatalogos({params: "'NOMINA'"})
      this.tipoAsientoList = resCatNomina['NOMINA']

      const resContratos = await this.apiSrv.getTipoContratos({valor_cat: 'TCC'})
      this.tipoContratoList = resContratos

   //   console.log(resCatNomina)
   //   console.log(resContratos)

    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }

  cargarCuentas() {

    this.apiSrv.listarCuentasBancos({}).subscribe((res: any) => {
      //console.log(res);
      res.map((data) => {
        this.listaCuentas.push(data)


      })
    })
  }
  addFields() {

      let datos =  {
        agregada: true,
        fk_contribuyente: 0,
        fk_liquidacion: 0,
        fecha: moment().format('YYYY-MM-DD'),
        regla:'',
        fk_cuenta_contable:0,
        cuenta_contable:'',
        cuenta_contable_nombre: '',
        tipo_cuenta: '',
        asiento:"",
        t_m:"",
        debe:0,
        haber:0 ,
        partida_presupuestaria_cod:'',
        partida_presupuestaria_desc:'',
        tipo_presupuesto:'',
        tipo_afectacion: '',
        partida_presupuestaria_val:0,
        devengado: 0,
        cobrado_pagado: 0,
        tipo: '',
        valid: true,
      }

      this.cierres.push(datos)
  }

  async deleteFields(idx,agg) {
    if(agg){
      let result: SweetAlertResult = await Swal.fire({
        title: 'Eliminar Cuenta Contable',
        text: 'Seguro/a desea eliminar esta cuenta?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        const deletedField = this.cierres.splice(idx, 1);
        this.calcPagoTotal()
      }
    }
  }


  changeCuenta(cuenta){
   // console.log(cuenta)

    this.cierres[cuenta.index].fk_cuenta_contable = cuenta.datos?.id
    this.cierres[cuenta.index].cuenta_contable = cuenta.datos?.codigo
    this.cierres[cuenta.index].cuenta_contable_nombre = cuenta.datos?.nombre
    this.cierres[cuenta.index].tipo_cuenta = cuenta.datos?.tipo
    this.cierres[cuenta.index].partida_presupuestaria_cod = cuenta.datos?.presupuesto?.codigo
    this.cierres[cuenta.index].partida_presupuestaria_desc = cuenta.datos?.codigo_presupuesto !=null ? cuenta.datos?.presupuesto?.nombre : ''



    if (this.filter.tipo_cierre == 'EMI') {
      this.cierres[cuenta.index].tipo_presupuesto = cuenta.datos?.codigo_presupuesto !=null ? 'INGRESO': ''
      this.cierres[cuenta.index].tipo_afectacion = cuenta.datos?.codigo_presupuesto !=null ? 'DEVENGADO': ''
    }
    else if(this.filter.tipo_cierre == 'REC'){
      this.cierres[cuenta.index].tipo_presupuesto = cuenta.datos?.codigo_presupuesto !=null ? 'INGRESO': ''
      this.cierres[cuenta.index].tipo_afectacion = cuenta.datos?.codigo_presupuesto !=null ? 'COBRADO': ''
    }
    else if (this.filter.tipo_cierre == 'NOM'){
      if(this.filter.tipo_asiento == 'DEVENGADO_NOMINA' || this.filter.tipo_asiento == 'ASIENTO_PROVISIONES'){
        this.cierres[cuenta.index].tipo_presupuesto = cuenta.datos?.codigo_presupuesto !=null ? 'GASTOS': ''
        this.cierres[cuenta.index].tipo_afectacion = cuenta.datos?.codigo_presupuesto !=null ? 'DEVENGADO': ''
      }
      if(this.filter.tipo_asiento == 'PAGADO_NOMINA' || this.filter.tipo_asiento == 'PAGADO_APORTES' || this.filter.tipo_asiento == 'PAGADO_PRESTAMOS' || this.filter.tipo_asiento == 'PAGADO_TERCEROS' ){
        this.cierres[cuenta.index].tipo_presupuesto = cuenta.datos?.codigo_presupuesto !=null ? 'GASTOS': ''
        this.cierres[cuenta.index].tipo_afectacion = cuenta.datos?.codigo_presupuesto !=null ? 'PAGADO': ''
      }
    }
    // else if (this.filter.tipo_cierre == 'DEP') {

    // } else if (this.filter.tipo_cierre == 'CIE') {

    // } else if (this.filter.tipo_cierre == 'TCC') {

    // } else if (this.filter.tipo_cierre == 'DEPO') {


    // } else if (this.filter.tipo_cierre == 'CONSU') {

    // }
    else if (this.filter.tipo_cierre == 'PAGORENTA') {
      this.cierres[cuenta.index].tipo_presupuesto = cuenta.datos?.codigo_presupuesto !=null ? 'GASTOS': ''
      this.cierres[cuenta.index].tipo_afectacion = cuenta.datos?.codigo_presupuesto !=null ? 'PAGADO': ''

    }
    // else if (this.filter.tipo_cierre == 'PAGOIVA'){

    // }

    if(this.cierres[cuenta.index].debe != 0){
      this.EventoNumberAsiento(cuenta.index, 'D')
    }
    if(this.cierres[cuenta.index].haber != 0){
      this.EventoNumberAsiento(cuenta.index, 'C')
    }


  }


  EventoNumberAsiento(evento, tipo) {

    let codpresupuesto = this.cierres[evento].partida_presupuestaria_cod;
   // console.log(evento);
    //console.log(tipo);
    if (tipo === 'D') {

      this.cierres[evento].haber=0;
      this.cierres[evento].partida_presupuestaria_val = (codpresupuesto === null || codpresupuesto === '') ? 0.00 : parseFloat(this.cierres[evento].debe);
      if(this.cierres[evento].tipo_afectacion=='DEVENGADO'){
        this.cierres[evento].devengado = (codpresupuesto === null || codpresupuesto === '') ? 0.00 : parseFloat(this.cierres[evento].debe);
      }
      if(this.cierres[evento].tipo_afectacion=='COBRADO' || this.cierres[evento].tipo_afectacion=='PAGADO'){
        this.cierres[evento].cobrado_pagado = (codpresupuesto === null || codpresupuesto === '') ? 0.00 : parseFloat(this.cierres[evento].debe);
      }

      this.calcPagoTotal()
      //this.debitChange();
      //this.presupuestoChange();

    } else {

      this.cierres[evento].debe=0;
      this.cierres[evento].partida_presupuestaria_val = (codpresupuesto === null || codpresupuesto === '') ? 0.00 : parseFloat(this.cierres[evento].haber);
      if(this.cierres[evento].tipo_afectacion=='DEVENGADO'){
        this.cierres[evento].devengado = (codpresupuesto === null || codpresupuesto === '') ? 0.00 : parseFloat(this.cierres[evento].haber);
      }
      if(this.cierres[evento].tipo_afectacion=='COBRADO' || this.cierres[evento].tipo_afectacion=='PAGADO'){
        this.cierres[evento].cobrado_pagado = (codpresupuesto === null || codpresupuesto === '') ? 0.00 : parseFloat(this.cierres[evento].haber);
      }
      this.calcPagoTotal()
      //this.creditChange();
     // this.presupuestoChange();
    }

  }


  geNumControl(event){


    if (this.tipoPago == 0 || this.tipoPago == undefined) {
      this.toastr.warning('Debe seleccionar un Tipo de Pago')
      this.filter.tipo_contrato = null
     return;
    }else{

      this.getCuentaContableTipoPago()
      (this as any).mensajeSpinner = "Cargando Números de Control...";
      this.lcargando.ctlSpinner(true);
      this.numeros_control = []
      let data = {
        anio: moment(this.filter.fecha_desde).format('YYYY'),
        mes: moment(this.filter.fecha_desde).format('MM'),
        tipo_contrato: event,
        tipo_pago: this.tipoPago
      }

      this.apiSrv.geNumControl(data).subscribe(
        (res: any) => {
          console.log(res);
          if(res['data'].length > 0){
            this.numeros_control = res['data']
            this.lcargando.ctlSpinner(false);
          }else {
            this.lcargando.ctlSpinner(false);
            this.toastr.info('No hay numeros de control para el tipo de contrato seleccionado')
          }

        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      )
    }



  }

  // getTipoContratos(){
  //   let data = {
  //     valor_cat: 'TCC',
  //   }
  //   this.apiSrv.getTipoContratos(data).subscribe((result: any) => {
  //     console.log(result);

  //     if(result.length > 0){
  //       this.tipoContratoList=result;
  //     }else {
  //       this.tipoContratoList=[];
  //       //this.toastr.info('No hay registros de dias trabajados para este periodo y mes');
  //       //this.lcargando.ctlSpinner(false);
  //     }
  //   }, error => {
  //     this.lcargando.ctlSpinner(false);
  //     this.toastr.info(error.error.message);
  //   });
  // }

  // getCatalogos() {
  //   let data = {
  //     params: "'NOMINA'",
  //   };

  //   this.apiSrv.getCatalogos(data).subscribe(

  //     (res) => {
  //       this.tipoAsiento = res["data"]['NOMINA'];

  //     },
  //     (error) => {
  //       this.lcargando.ctlSpinner(false);
  //       this.toastr.info(error.error.message);
  //     }
  //   );
  // }

  confirmRestore() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que limpiar los campos?",
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

    this.cierres = [];
    this.cuentaBanco= [];
    this.aggCuenta = null;
    this.asientoCierre={
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      tipo_cierre:0,
    }
    this.filter = {
      //concepto: 0,
      tipo_cierre:undefined,
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      tipo_asiento: 0,
      tipo_contrato:0,
      id_num_control: 0
    }
    this.asientoGuard={
      documento:"",
      estado:undefined
    }
    this.totalDebe = 0
    this.totalHaber = 0
    //this.asientoCierre = moment(new Date()).format('YYYY-MM-DD  HH:mm');
    this.verifyRestore = false;
    this.formReadOnly=false;
    this.datosGuard=true;
    this.verBanco=false;

    this.tipoPago=0

    this.vmButtons[0].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[6].habilitar = true

  }

  cargarConceptos() {
    (this as any).mensajeSpinner = 'Cargando Conceptos'
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getConceptos().subscribe(
      (res: any) => {
        // console.log(res.data)
        res.data.forEach(e => {
          const { id_concepto, nombre } = e
          this.conceptos.push({ id_concepto: id_concepto, nombre: nombre })
          this.lcargando.ctlSpinner(false)
        })
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  consultar() {

    console.log(this.filter.id_numero_control)
    console.log(this.cuentaBanco)
    if(this.filter.id_num_control == undefined){this.filter.id_num_control = 0}
    if (this.filter.tipo_cierre == null) {
      this.toastr.warning('No ha seleccionado un Tipo de Cierre')
      return;
    }
    if (this.filter.tipo_cierre == 'NOM' && (this.filter.tipo_asiento == 0 || this.filter.tipo_asiento == null)) {
      this.toastr.warning('No ha seleccionado un Tipo de Asiento')
      return;
    }
    if (this.filter.tipo_cierre == 'NOM' && (this.filter.tipo_asiento == 'PAGADO_NOMINA' || this.filter.tipo_asiento == 'DEVENGADO_NOMINA') &&(this.filter.tipo_contrato == 0 || this.filter.tipo_contrato == null)) {
      this.toastr.warning('No ha seleccionado un Tipo de Contrato')
      return;
    }
    if ((this.filter.tipo_cierre == 'NOM' && this.filter.tipo_asiento == 'DEVENGADO_NOMINA') && (this.filter.id_num_control == 0 || this.filter.id_num_control == undefined)) {
      this.toastr.warning('No ha seleccionado un Número de Control')
      return;
    }
    if ((this.filter.tipo_cierre == 'NOM' && this.filter.tipo_asiento == 'PAGADO_NOMINA') && (this.filter.id_num_control == 0 || this.filter.id_num_control == undefined)) {
      this.toastr.warning('No ha seleccionado un Número de Control')
      return;
    }
    if ((this.filter.tipo_cierre == 'NOM' && (this.filter.tipo_asiento == 'PAGADO_NOMINA' || this.filter.tipo_asiento == 'PAGADO_APORTES' || this.filter.tipo_asiento == 'PAGADO_PRESTAMOS' || this.filter.tipo_asiento == 'PAGADO_TERCEROS')) && (this.cuentaBanco?.length == 0)) {
      this.toastr.warning('No ha seleccionado una Cuenta Bancaria')
      return;
    }
    if ((this.filter.tipo_cierre == 'PAGORENTA') && (this.cuentaBanco?.length == 0)) {
      this.toastr.warning('No ha seleccionado una Cuenta Bancaria')
      return;
    }

    this.asientoCierre.fecha = this.filter.fecha_desde
    (this as any).mensajeSpinner = 'Consultando Asientos...';
    this.lcargando.ctlSpinner(true);
    this.asientoGuard.estado="";
    let params = {
      fecha: this.filter.fecha_desde,
      tipo: this.filter.tipo_cierre,
      tipo_asiento: this.filter.tipo_asiento,
      tipo_contrato: this.filter.tipo_contrato,
      id_numero_control: this.filter.id_num_control
    };

   // console.log(params);
    this.apiSrv.consultarCierre(params).subscribe(
      (res: any) => {
        console.log('data -->'+res["data"])
        if (res["data"].length > 0) {
         // console.log('existe')
          this.allowEdit = false;
          this.existe = true;
          this.cierres = [];


          //this.cierres=res["data"];

          this.datosGuard=false;
          this.verTabla=true;
          this.formReadOnly = true;
          this.asientoGuard=res["data"][0];
          let cod: any;
          let des: any;

          res["data"][0]["detalles"].forEach((p) => {
            let datos = {
              agregada: false,
              fecha: p.fecha,
             // fk_cueta_contable:p.concepto.cuenta_acreedora.id,
              cuenta_contable: p.cuenta_contable,
              cuenta_contable_nombre: p.cuenta_contable_nombre,
              asiento:"",
              t_m:"",
              debe:p.debe,
              haber:p.haber,
              partida_presupuestaria_cod: p.partida_presupuestaria_cod,
              partida_presupuestaria_desc: p.partida_presupuestaria_desc,
              partida_presupuestaria_val:p.partida_presupuestaria_val,
              tipo_presupuesto: p.tipo_presupuesto,
              tipo_afectacion: p.tipo_afectacion,
              devengado: p.devengado,
              cobrado_pagado: p.cobrado_pagado,
              codigopartida: p?.codigopartida,
            }

            {

          }
            this.totalDebe += +p.debe;
            this.totalHaber += +p.haber;

            this.cierres.push(datos);
          });
          this.calcPagoTotal()
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = false;
          this.vmButtons[4].habilitar = false;
          this.vmButtons[5].habilitar = false;
          this.vmButtons[6].habilitar = false;
          this.lcargando.ctlSpinner(false);
        }else{
          this.allowEdit = true;
          this.existe = false;
        //  console.log('no existe')
          this.consultaServicio();
          this.vmButtons[0].habilitar = false;
          this.vmButtons[1].habilitar = false;
          //this.vmButtons[2].habilitar = false;
          this.vmButtons[4].habilitar = false;
          this.verTabla=false;
          this.datosGuard=true;
          this.existe=true;
          this.formReadOnly = false;
          //this.lcargando.ctlSpinner(false);
        }
        if(this.filter.tipo_cierre == 'NOM' ){
          if(this.filter.tipo_asiento != 'PAGADO_TERCEROS'){
            this.getRolNoControl()
          }
        }



      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

  consultaServicio(){
    (this as any).mensajeSpinner = 'Cargando Asientos';
    this.lcargando.ctlSpinner(true);

    // let datos={
    //   concepto: {
    //     fecha:this.asientoCierre.fecha,
    //     tipo:this.asientoGuard.tipo_cierre,
    //     codigo: "CM",
    //     paginate: this.paginate
    //   }
    // }

    let datos={
      params:{
        filter:{
          concepto: 0,
          tipo: this.filter.tipo_cierre,
          fecha_desde: this.filter.fecha_desde,
          fecha_hasta: this.filter.fecha_hasta,
          tipo_asiento: this.filter.tipo_asiento,
          tipo_contrato: this.filter.tipo_contrato,
          tipo_pago: this.tipoPago,
          id_numero_control: this.filter.id_num_control,
          codigo_rubro: this.filter.rubros_pagos_terceros
        },
      //  paginate:this.paginate
      }
    }
    //console.log('concepto '+this.concepto.codigo);
    this.apiSrv.consultarAsientos(datos).subscribe(
      (res: any) => {




        this.vmButtons[5].habilitar = true
        this.vmButtons[6].habilitar = false
        this.cierres = []
        let cierresAux: any[]
     //   console.log(res)

       // this.paginate.length = res['data']['total'];

        // if (res['data']['current_page'] == 1) {
        //   cierresAux = res['data'];
        // } else {
        //   cierresAux = Object.values(res['data']);
        // }
        cierresAux = Object.values(res['data']);
      // cierresAux = res['data']
        // console.log(cierresAux)
         if (this.filter.tipo_cierre == 'EMI') {
          if (cierresAux.length > 0) {
            let datos=[];
            //let suma=
            cierresAux.forEach((p) => {
            //    console.log(p)

                Object.assign(
                  p,
                  {
                    fk_contribuyente: p.fk_contribuyente,
                    fk_liquidacion: p.id_liquidacion,
                    fecha: p.fecha,
                    regla:'',
                    fk_cuenta_contable:0,
                    cuenta_contable:(p.tipo == 'D') ? p.cuenta_deudora : p.cuenta_acreedora,
                    cuenta_contable_nombre: (p.tipo == 'D') ?  p.nombre_cuenta_deudora :  p.nombre_cuenta_acreedora,
                    tipo_cuenta:  (p.tipo == 'D') ? p.tipo_cuenta_deudora : p.tipo_cuenta_acreedora,
                    asiento:"",
                    t_m:"",
                    debe:(p.tipo == 'D') ? p.total : 0,
                    haber:(p.tipo == 'H') ? p.total : 0 ,
                    partida_presupuestaria_cod:p.codigo_presupuesto,
                    partida_presupuestaria_desc:p.nombre_codigo_presupuesto,
                    tipo_presupuesto: p.tipo_presupuesto,
                    tipo_afectacion: p.tipo_afectacion,
                    partida_presupuestaria_val:p.valor_partida,
                    devengado: p.devengado,
                    cobrado_pagado: p.cobrado_pagado,
                    tipo:  (p.tipo == 'D') ? 'Deudora' : 'Acreedora',
                    valid: true,
                    agregada: false,

                  }
                )

              // console.log(p)
              // if (p.concepto?.cuenta_deudora) {
              //   let datos1= {
              //     fecha: p.fecha,
              //     regla: p.concepto.cuenta_deudora.esigef?.numero_regla,
              //     fk_cuenta_contable:p.concepto.cuenta_deudora.id,
              //     cuenta_contable: p.concepto.cuenta_deudora.codigo,
              //     cuenta_contable_nombre: p.concepto.cuenta_deudora.nombre,
              //     tipo_cuenta: p.concepto.cuenta_deudora.tipo,
              //     asiento:"",
              //     t_m:"",
              //     debe:p.total,
              //     haber:0,
              //     partida_presupuestaria_cod:"",
              //     partida_presupuestaria_desc:"",
              //     partida_presupuestaria_val:"",
              //     tipo: 'Deudora',
              //     valid: true,
              //   };
              //   datos.push(datos1);
              // }

              // if (p.concepto?.cuenta_acreedora) {
              //   let datos2 = {
              //     fecha: p.fecha,
              //     regla: p.concepto.cuenta_deudora.esigef?.numero_regla,
              //     fk_cuenta_contable:p.concepto.cuenta_acreedora.id,
              //     cuenta_contable: p.concepto.cuenta_acreedora.codigo,
              //     cuenta_contable_nombre: p.concepto.cuenta_acreedora.nombre,
              //     tipo_cuenta: p.concepto.cuenta_deudora.tipo,
              //     asiento:"",
              //     t_m:"",
              //     debe:0,
              //     haber:p.total,
              //     partida_presupuestaria_cod:p.concepto.codigo_presupuesto.codigo,
              //     partida_presupuestaria_desc:p.concepto.codigo_presupuesto.nombre,
              //     partida_presupuestaria_val:"",
              //     tipo: 'Acreedora',
              //     valid: true,
              //   };
              //   datos.push(datos2);
              // }
              // console.log(datos)
            })
            this.cierres =cierresAux
            this.vmButtons[2].habilitar = true;

            this.calcPagoTotal()
            //this.cierres=res["data"];
            this.lcargando.ctlSpinner(false);
          }else{
            this.cierres=[];
            this.lcargando.ctlSpinner(false);
            this.toastr.info("No hay aientos para mostrar");
          }
         } else if (this.filter.tipo_cierre == 'REC') {

          this.cierres = cierresAux;
          this.cierres.forEach((e: any) => {
            Object.assign(
              e,
              {
                fk_contribuyente: e.fk_contribuyente,
                fk_liquidacion: e.id_liquidacion,
                fk_documento: e.id_documento,
                fk_cuenta_contable: 1,
                fk_partida_presupuestaria: 1,
                cuenta_contable: (e.tipo == 'D') ? e.cuenta_deudora : e.cuenta_acreedora,
                cuenta_contable_nombre:  (e.tipo == 'D') ? e.nombre_cuenta_deudora : e.nombre_cuenta_acreedora,
                tipo_cuenta:  (e.tipo == 'D') ? e.tipo_cuenta_deudora : e.tipo_cuenta_acreedora,
                partida_presupuestaria_cod: e.codigo_presupuesto,
                partida_presupuestaria_desc: e.nombre_codigo_presupuesto,
                tipo_presupuesto: e.tipo_presupuesto,
                tipo_afectacion: e.tipo_afectacion,
                asiento: "",
                t_m: "",
                partida_presupuestaria_val: e.valor_partida,
                devengado: e.devengado,
                cobrado_pagado: e.cobrado_pagado,
                debe: (e.tipo == 'D') ? e.total : 0,
                haber: (e.tipo == 'H') ? e.total : 0 ,
                agregada: false,
              }
            )
          })
          this.vmButtons[2].habilitar = true;
          this.calcPagoTotal()
          this.lcargando.ctlSpinner(false)

         }else if (this.filter.tipo_cierre == 'NOM'){

          if(this.filter.tipo_asiento =='PAGADO_NOMINA'){

            if (cierresAux.length > 0) {
           //   console.log(cierresAux)
              // cuenta: this.cuenta.name_banks,
              // num_cuenta:this.cuenta.num_cuenta,

              let totalHaber = 0
              cierresAux.forEach(e =>{
                totalHaber += parseFloat(e.total)
              })
              let data_haber={
                fk_cuenta_contable: 1,
                fk_partida_presupuestaria: 1,
                cuenta_contable: this.cuentaBanco.cuenta_contable,
                cuenta_contable_nombre:  this.cuentaBanco.name_cuenta,
                // cuenta_contable: cierresAux[0].banco_cuenta_contable,
                // cuenta_contable_nombre:  cierresAux[0].banco_nombre_cuenta,
                tipo_cuenta: '',
                partida_presupuestaria_cod:'',
                partida_presupuestaria_desc: '',
                tipo_presupuesto:'',
                tipo_afectacion: '',
                asiento: "",
                t_m: "",
                partida_presupuestaria_val: parseFloat('00.00'),
                devengado: parseFloat('00.00'),
                cobrado_pagado: parseFloat('00.00'),
                debe:  parseFloat('00.00'),
                haber:  totalHaber,
                agregada: false,
              }
              this.cierres.push(data_haber)

              cierresAux.forEach((e: any) => {

                let data_debe={
                  fk_cuenta_contable: 1,
                  fk_partida_presupuestaria: 1,
                  cuenta_contable: e.codigo_cuenta,
                  cuenta_contable_nombre:  e.nombre_cuenta,
                  tipo_cuenta: '',
                  partida_presupuestaria_cod: e.codigo_presupuesto,
                  partida_presupuestaria_desc: e.nombre_partida,
                  tipo_presupuesto: 'GASTOS',
                  tipo_afectacion: 'PAGADO',
                  asiento: "",
                  t_m: "",
                  partida_presupuestaria_val: e.total,
                  devengado: parseFloat('00.00'),
                  cobrado_pagado: e.total,
                  debe: e.total,
                  haber: parseFloat('00.00') ,
                  agregada: false,
                }

                this.cierres.push(data_debe)
                this.vmButtons[2].habilitar = true;


                // Object.assign(
                //   e,
                //   {
                //     fk_cuenta_contable: 1,
                //     fk_partida_presupuestaria: 1,
                //     cuenta_contable: (e.tipo == 'D') ? e.cuenta_deudora : e.name_cuenta,
                //     cuenta_contable_nombre:  (e.tipo == 'D') ? e.nombre_cuenta_deudora : e.nombre_cuenta_acreedora,
                //     tipo_cuenta:  (e.tipo == 'D') ? e.tipo_cuenta_deudora : e.tipo_cuenta_acreedora,
                //     partida_presupuestaria_cod: e.codigo_presupuesto,
                //     partida_presupuestaria_desc: e.nombre_codigo_presupuesto,
                //     tipo_presupuesto: e.tipo_presupuesto,
                //     tipo_afectacion: e.tipo_afectacion,
                //     asiento: "",
                //     t_m: "",
                //     partida_presupuestaria_val: e.valor_partida,
                //     devengado: e.devengado,
                //     cobrado_pagado: e.cobrado_pagado,
                //     debe: (e.tipo == 'D') ? e.total : 0,
                //     haber: (e.tipo == 'H') ? e.total : 0 ,

                //   }


                // )
              })
            }

          }else{
            this.cierres = cierresAux;
            this.cierres.forEach((e: any) => {
              Object.assign(
                e,
                {
                  fk_cuenta_contable: 1,
                  fk_partida_presupuestaria: 1,
                  cuenta_contable: (e.tipo == 'D') ? e.cuenta_deudora : e.cuenta_acreedora,
                  cuenta_contable_nombre:  (e.tipo == 'D') ? e.nombre_cuenta_deudora : e.nombre_cuenta_acreedora,
                  tipo_cuenta:  (e.tipo == 'D') ? e.tipo_cuenta_deudora : e.tipo_cuenta_acreedora,
                  partida_presupuestaria_cod: e.codigo_presupuesto,
                  partida_presupuestaria_desc: e.nombre_codigo_presupuesto,
                  tipo_presupuesto: e.tipo_presupuesto,
                  tipo_afectacion: e.tipo_afectacion,
                  asiento: "",
                  t_m: "",
                  partida_presupuestaria_val: e.valor_partida,
                  devengado: e.devengado,
                  cobrado_pagado: e.cobrado_pagado,
                  debe: (e.tipo == 'D') ? e.total : 0,
                  haber: (e.tipo == 'H') ? e.total : 0 ,
                  agregada: false,

                }
              )
            })
            if(this.filter.tipo_asiento =='PAGADO_APORTES' || this.filter.tipo_asiento =='PAGADO_PRESTAMOS'  || this.filter.tipo_asiento =='PAGADO_TERCEROS'){
              let totalHaber = 0
              cierresAux.forEach(e =>{
                totalHaber += parseFloat(e.total)
              })
              let data_haber={
                fk_cuenta_contable: 1,
                fk_partida_presupuestaria: 1,
                cuenta_contable: this.cuentaBanco.cuenta_contable,
                cuenta_contable_nombre:  this.cuentaBanco.name_cuenta,
                // cuenta_contable: cierresAux[0].banco_cuenta_contable,
                // cuenta_contable_nombre:  cierresAux[0].banco_nombre_cuenta,
                tipo_cuenta: '',
                partida_presupuestaria_cod:'',
                partida_presupuestaria_desc: '',
                tipo_presupuesto:'',
                tipo_afectacion: '',
                asiento: "",
                t_m: "",
                partida_presupuestaria_val: parseFloat('00.00'),
                devengado: parseFloat('00.00'),
                cobrado_pagado: parseFloat('00.00'),
                debe:  parseFloat('00.00'),
                haber:  totalHaber,
                agregada: false,
              }
              this.cierres.push(data_haber)
            }
            this.vmButtons[2].habilitar = false;
          }

          this.calcPagoTotal()
          this.lcargando.ctlSpinner(false)
         } else if (this.filter.tipo_cierre == 'DEP') {
          let datos = [];
          cierresAux.forEach((asiento: any) => {
            let as_d = {
              fecha: asiento.fecha,
              fk_cuenta_contable: asiento.id_cuenta_deudora,
              cuenta_contable: asiento.cuenta_deudora,
              cuenta_contable_nombre: asiento.nombre_cuenta_deudora,
              tipo_cuenta: asiento.tipo_cuenta_deudora,
              asiento: "",
              t_m: "",
              debe: asiento.valor_depreciacion,
              haber: parseFloat("0.00"),
              partida_presupuestaria_cod:"",
              partida_presupuestaria_desc:"",
              partida_presupuestaria_val:"",
              tipo_presupuesto: '',
              tipo_afectacion: '',
              devengado: '',
              cobrado_pagado: '',
              agregada: false,
            }
            datos.push(as_d);
            let as_h = {
              fecha: asiento.fecha,
              fk_cuenta_contable: asiento.id_cuenta_acreedora,
              cuenta_contable: asiento.cuenta_acreedora,
              cuenta_contable_nombre: asiento.nombre_cuenta_acreedora,
              tipo_cuenta: asiento.tipo_cuenta_acreedora,
              asiento: "",
              t_m: "",
              debe: parseFloat("0.00"),
              haber: asiento.valor_depreciacion,
              partida_presupuestaria_cod: asiento.codigo_presupuesto,
              partida_presupuestaria_desc: asiento.nombre_codigo_presupuesto,
              partida_presupuestaria_val:"",
              tipo_presupuesto: '',
              tipo_afectacion: '',
              devengado: '',
              cobrado_pagado: '',
              agregada: false,
            }
            datos.push(as_h);

          })
          this.cierres = datos;
          this.calcPagoTotal()
          this.lcargando.ctlSpinner(false);
         } else if (this.filter.tipo_cierre == 'CIE') {
          this.cierres = [];
          if (!cierresAux.length) {
            this.lcargando.ctlSpinner(false)
            this.toastr.info('No hay asientos para mostrar')
            return;
          }

          // Parsear la respuesta del servicio
          let datos = [];
          cierresAux.forEach((asiento: any) => {
            let o = {
              fecha: `${asiento.anio}-${asiento.mes}`,
              fk_cuenta_contable: asiento.fk_cuenta_contable,
              cuenta_contable: asiento.cuenta,
              cuenta_contable_nombre: asiento.descripcion_cuenta,
              tipo_cuenta: asiento.tipo,
              asiento: "",
              t_m: "",
              debe: (asiento.tipo_movimiento == 'D') ? parseFloat(asiento.valor_total) : 0,
              haber: (asiento.tipo_movimiento == 'C') ? parseFloat(asiento.valor_total) : 0,
              partida_presupuestaria_cod: "",
              partida_presupuestaria_desc: "",
              partida_presupuestaria_val: "",
              tipo_presupuesto: '',
              tipo_afectacion: '',
              devengado: '',
              cobrado_pagado: '',
              agregada: false,
            }

            datos.push(o)
          })
          this.cierres = datos;
          this.btnAggCuentaAjusteDisabled = false
          this.calcPagoTotal()
          this.lcargando.ctlSpinner(false)
         } else if (this.filter.tipo_cierre == 'TCC') {
        //  console.log(cierresAux)
          let datos = [];

          cierresAux.forEach((asiento: any) => {
            let orig = {
              fecha: `${asiento.anio}-${asiento.mes}`,
              fk_cuenta_contable: asiento.fk_cuenta_contable,
              cuenta_contable: asiento.cuenta,
              cuenta_contable_nombre: asiento.descripcion_cuenta,
              tipo_cuenta: asiento.tipo_cuenta,
              asiento: "",
              t_m: "",
              debe: (asiento.tipo_movimiento == 'D') ? parseFloat(asiento.valor_total) : 0,
              haber: (asiento.tipo_movimiento == 'C') ? parseFloat(asiento.valor_total) : 0,
              partida_presupuestaria_cod: "",
              partida_presupuestaria_desc: "",
              partida_presupuestaria_val: "",
              tipo_presupuesto: '',
              tipo_afectacion: '',
              devengado: '',
              cobrado_pagado: '',
              agregada: false,
            };

            datos.push(orig);

            let dest = {
              fecha: `${asiento.anio}-${asiento.mes}`,
              fk_cuenta_contable: asiento.fk_cuenta_contable_cierre,
              cuenta_contable: asiento.cuenta_cierre,
              cuenta_contable_nombre: asiento.nom_cuenta_cierre,
              tipo_cuenta: asiento.tipo_cuenta_cierre,
              asiento: "",
              t_m: "",
              debe: (asiento.tipo_movimiento == 'C') ? parseFloat(asiento.valor_total) : 0,
              haber: (asiento.tipo_movimiento == 'D') ? parseFloat(asiento.valor_total) : 0,
              partida_presupuestaria_cod: "",
              partida_presupuestaria_desc: "",
              partida_presupuestaria_val: "",
              tipo_presupuesto: '',
              tipo_afectacion: '',
              devengado: '',
              cobrado_pagado: '',
              agregada: false,
            };

            datos.push(dest);
          })

          this.cierres = datos;
          this.calcPagoTotal()
          this.lcargando.ctlSpinner(false)
         } else if (this.filter.tipo_cierre == 'DEPO') {

          this.cierres = cierresAux;
          this.cierres.forEach((e: any) => {
            Object.assign(
              e,
              {
                fk_cuenta_contable: 1,
                fk_partida_presupuestaria: 1,
                cuenta_contable: e.cuenta_deudora,
                cuenta_contable_nombre: e.nombre_cuenta_acreedora,
                partida_presupuestaria_cod: e.codigo_presupuesto,
                partida_presupuestaria_desc: e.nombre_codigo_presupuesto,
                tipo_cuenta: e.tipo_cuenta_deudora ?? e.tipo_cuenta_acreedora,
                asiento: "",
                t_m: "",
                partida_presupuestaria_val: "",
                tipo_presupuesto: '',
                tipo_afectacion: '',
                devengado: '',
                cobrado_pagado: '',
                debe: (e.tipo == 'D') ? e.total : parseFloat('0.00'),
                haber: (e.tipo == 'H') ? e.total : parseFloat('0.00') ,
                agregada: false,
              }
            )
          })
          this.calcPagoTotal()
          this.lcargando.ctlSpinner(false)

         } else if (this.filter.tipo_cierre == 'CONSU') {
          if (cierresAux.length > 0) {
            let datos=[];
            //let suma=
            cierresAux.forEach((p) => {
            //    console.log(p)

                Object.assign(
                  p,
                  {
                    fecha: p.fecha,
                    regla:'',
                    fk_cuenta_contable:0,
                    cuenta_contable:(p.tipo == 'D') ? p.cuenta_deudora : p.cuenta_acreedora,
                    cuenta_contable_nombre: (p.tipo == 'D') ?  p.nombre_cuenta_deudora :  p.nombre_cuenta_acreedora,
                    tipo_cuenta:  (p.tipo == 'D') ? p.tipo_cuenta_deudora : p.tipo_cuenta_acreedora,
                    asiento:"",
                    t_m:"",
                    debe:(p.tipo == 'D') ? p.total : 0,
                    haber:(p.tipo == 'H') ? p.total : 0 ,
                    partida_presupuestaria_cod:p.codigo_presupuesto,
                    partida_presupuestaria_desc:p.nombre_codigo_presupuesto,
                    tipo_presupuesto: p.tipo_presupuesto,
                    tipo_afectacion: p.tipo_afectacion,
                    partida_presupuestaria_val:p.valor_partida,
                    devengado: p.devengado,
                    cobrado_pagado: p.cobrado_pagado,
                    tipo:  (p.tipo == 'D') ? 'Deudora' : 'Acreedora',
                    valid: true,
                    agregada: false,

                  }
                )
            })
            this.cierres =cierresAux

            this.calcPagoTotal()
            //this.cierres=res["data"];
            this.lcargando.ctlSpinner(false);
          }else{
            this.cierres=[];
            this.lcargando.ctlSpinner(false);
            this.toastr.info("No hay aientos para mostrar");
          }
         } else if (this.filter.tipo_cierre == 'PAGORENTA') {

          this.cierres = cierresAux;
            this.cierres.forEach((e: any) => {
              Object.assign(
                e,
                {
                  fk_cuenta_contable: 1,
                  fk_partida_presupuestaria: 1,
                  cuenta_contable: (e.tipo == 'D') ? e.cuenta_deudora : e.cuenta_acreedora,
                  cuenta_contable_nombre:  (e.tipo == 'D') ? e.nombre_cuenta_deudora : e.nombre_cuenta_acreedora,
                  tipo_cuenta:  (e.tipo == 'D') ? e.tipo_cuenta_deudora : e.tipo_cuenta_acreedora,
                  partida_presupuestaria_cod: e.codigo_presupuesto,
                  partida_presupuestaria_desc: e.nombre_codigo_presupuesto,
                  tipo_presupuesto: e.tipo_presupuesto,
                  tipo_afectacion: e.tipo_afectacion,
                  asiento: "",
                  t_m: "",
                  partida_presupuestaria_val: e.valor_partida,
                  devengado: e.devengado,
                  cobrado_pagado: e.cobrado_pagado,
                  debe: (e.tipo == 'D') ? e.total : 0,
                  haber: (e.tipo == 'H') ? e.total : 0 ,
                  codigopartida: e.codigopartida,
                  agregada: false,

                }
              )
            })
              let totalHaber = 0
              cierresAux.forEach(e =>{
                totalHaber += parseFloat(e.total)
              })
              let data_haber={
                fk_cuenta_contable: 1,
                fk_partida_presupuestaria: 1,
                cuenta_contable: this.cuentaBanco.cuenta_contable,
                cuenta_contable_nombre:  this.cuentaBanco.name_cuenta,
                // cuenta_contable: cierresAux[0].banco_cuenta_contable,
                // cuenta_contable_nombre:  cierresAux[0].banco_nombre_cuenta,
                tipo_cuenta: '',
                partida_presupuestaria_cod:'',
                partida_presupuestaria_desc: '',
                tipo_presupuesto:'',
                tipo_afectacion: '',
                asiento: "",
                t_m: "",
                partida_presupuestaria_val: parseFloat('00.00'),
                devengado: parseFloat('00.00'),
                cobrado_pagado: parseFloat('00.00'),
                debe:  parseFloat('00.00'),
                haber:  totalHaber,
                agregada: false,
              }
              this.cierres.push(data_haber)
         } else if (this.filter.tipo_cierre == 'PAGOIVA'){
          this.cierres = cierresAux;
          this.cierres.forEach((e: any) => {
            Object.assign(
              e,
              {
                fk_cuenta_contable: 1,
                fk_partida_presupuestaria: 1,
                cuenta_contable: (e.tipo == 'D') ? e.cuenta_deudora : e.cuenta_acreedora,
                cuenta_contable_nombre:  (e.tipo == 'D') ? e.nombre_cuenta_deudora : e.nombre_cuenta_acreedora,
                tipo_cuenta:  (e.tipo == 'D') ? e.tipo_cuenta_deudora : e.tipo_cuenta_acreedora,
                partida_presupuestaria_cod: e.codigo_presupuesto,
                partida_presupuestaria_desc: e.nombre_codigo_presupuesto,
                tipo_presupuesto: e.tipo_presupuesto,
                tipo_afectacion: e.tipo_afectacion,
                asiento: "",
                t_m: "",
                partida_presupuestaria_val: e.valor_partida,
                devengado: e.devengado,
                cobrado_pagado: e.cobrado_pagado,
                debe: (e.tipo == 'D') ? e.total : 0,
                haber: (e.tipo == 'H') ? e.total : 0 ,
                codigopartida: e.codigopartida,
                agregada: false,
              }
            )
          })
         }
          this.vmButtons[2].habilitar = false;
          this.calcPagoTotal()
          this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    );

  }

  calcPagoTotal() {
  //  console.log(this.cierres)
    const totalDebe = this.cierres.reduce((acc: number, curr: any, idx: number) => {
      const v = Math.round(parseFloat(curr.debe) * 100) / 100
      return Math.round((acc + v) * 100) / 100
    }, 0)

    const totalHaber = this.cierres.reduce((acc: number, curr: any) => {
      const v = Math.round(parseFloat(curr.haber) * 100) / 100
      return Math.round((acc + v) * 100) / 100
    }, 0)

    /* let pagoDebe = 0;
    let pagoHaber = 0;
    this.cierres.forEach(e => {
      // if (e.aplica) {
        pagoDebe += +e.debe;
        pagoHaber += +e.haber;
      // }
    });
    console.log(pagoDebe) */
    this.totalDebe = totalDebe
    this.totalHaber = totalHaber

  }

  guardarAsientoCierre(){
    (this as any).mensajeSpinner = 'Verificando periodo contable.';
    this.lcargando.ctlSpinner(true);

    let data = {
      "anio": Number(moment(this.asientoCierre.fecha).format('YYYY')),
      "mes": Number(moment(this.asientoCierre.fecha).format('MM')),
    }
      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

      /* Validamos si el periodo se encuentra aperturado */
      if (res["data"][0].estado !== 'C') {

     //   console.log(this.cuentaBanco)
        let msgInvalid = ''

        this.cierres.forEach((element: any, idx: number) => {
          if (element.tipo_cuenta == 'GRUPO') msgInvalid += `La linea ${idx + 1} tiene una cuenta mal configurada.<br>`
          if (element.cuenta_contable == '' || element.cuenta_contable == undefined) msgInvalid += `La linea ${idx + 1} no tiene un número de cuenta seleccionado.<br>`
          if (element.cuenta_contable_nombre == '' || element.cuenta_contable_nombre == undefined) msgInvalid += `La linea ${idx + 1} no tiene un nombre de cuenta seleccionado.<br>`
        })

        if (this.totalDebe != this.totalHaber) msgInvalid += 'El asiento esta descuadrado. Por favor revise.<br>'

        if (this.filter.tipo_asiento == 'PAGADO_NOMINA' && this.cuentaBanco.length == 0) {
           this.toastr.warning('Debe seleccionar una cuenta. . Por favor revise')
           return;
        }

        if (msgInvalid.length > 0) {

          Swal.fire({
            title: "Atención!!",
            html: msgInvalid + " Desea continuar?" ,
            //icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#DC3545",
            confirmButtonColor: "#13A1EA",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.value) {
             this.guardarAsiento()
            }else{
              this.lcargando.ctlSpinner(false);
              this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
              return
            }
          });

        }else{
          this.guardarAsiento()
        }


      } else {
        this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
        this.lcargando.ctlSpinner(false);
      }

      }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
      })

  }

  guardarAsiento(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Está a punto de realizar un Asiento Cierre ¿Desea continuar?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = 'Generando Asiento Cierre. Esto puede tomar unos momentos.';
        this.lcargando.ctlSpinner(true);
        let data = {
          tipo: this.filter.tipo_cierre,
          fecha:this.asientoCierre.fecha,
          documento: this.cierres,
          subtipo: this.filter.tipo_asiento,
          tipo_contrato: this.filter.tipo_contrato,
          id_numero_control: this.filter.id_num_control,
          cuenta_contable: this.codigo_cuenta_contable,
          codigo_rubro: this.filter.rubros_pagos_terceros
        }
        this.apiSrv.guardarAsientoCierre(data).subscribe(
          (res) => {
            //console.log(res);
            Swal.fire({
              icon: "success",
              title: "Asiento cierre generado",
              text: res['message'],
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            }).then((result2) => {
              if (result2.isConfirmed) {
                (this as any).mensajeSpinner = 'Cargando Asiento Cierre...';
                //this.cierres = [];
                this.vmButtons[0].habilitar = true;
                this.vmButtons[1].habilitar = false;
                this.vmButtons[3].habilitar = false;
                this.vmButtons[4].habilitar = false;
                this.vmButtons[5].habilitar = false;
                this.vmButtons[6].habilitar = false;
                this.asientoGuard=res["data"];
                this.datosGuard=false;
                this.formReadOnly = true;
                this.lcargando.ctlSpinner(false);
              }
            });

          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              icon: "error",
              title: "Error al generar el Asiento Cierre",
              text: error.error.message,
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
          }
        );
      }
    });
  }

  expandListCierres() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ModalCierresComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.consultaServicio();
  }

  async eliminarAsiento() {
    let result = await Swal.fire({
      titleText: 'Eliminacion de Cierre',
      text: 'Esta seguro/a de eliminar este Cierre?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Eliminando Cierre'
        await this.apiSrv.eliminarAsiento({id: this.asientoGuard.id_con_cierre})
        this.restoreForm();
        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error eliminando Cierre')
      }
    }
  }

  expandCambioCuenta(asiento: any, posicion: number) {
    let even = posicion % 2 == 0;
    let ref = this.dialogService.open(CcModalTablaCuentaComponent, {
      header: 'Cuentas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    ref.onClose.subscribe((cuenta: any) => {
      if (cuenta) {
        // console.log(cuenta)
        asiento.cuenta_contable = cuenta.data.codigo;
        asiento.cuenta_contable_nombre = cuenta.data.nombre;
        asiento.tipo_cuenta = cuenta.data.tipo
        asiento.actualizado = true;
      }
    })
  }

  handleSelectTipo(event: any) {
    this.cierres=[]
    this.datosGuard = true
    this.totalDebe = 0
    this.totalHaber = 0
    this.asientoGuard ={
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      tipo:0,
      documento:""
    }
  // console.log(this.filter.tipo_cierre)
    this.verBanco= false
    this.filter.tipo_asiento = 0

      if(this.filter.tipo_cierre == 'PAGORENTA'){
        this.verBanco= true
      }


  }

  expandCuentaAjuste() {
    const modal = this.modalService.open(ModalCuentPreComponent, { size: 'xl', backdrop: 'static' });
  }

  expandCuentasContables(index) {
    const modal = this.modalService.open(ModalCuentasContablesComponent, { size: 'xl', backdrop: 'static' });
    modal.componentInstance.index = index;
  }

  async agregarCuenta() {
    // Revisar cual lado esta con menos (D - H => +: Falta en el Haber, -: Falta en el Debe)
    const val = this.totalDebe - this.totalHaber;
    let absVal = Math.abs(val);
    let columna = (val > 0) ? 'DEBE' : 'HABER';
    const result = await Swal.fire({
      title: 'Agregar Cuenta a Cierre',
      text: `Seguro/a desea agregar esta cuenta al ${columna} por el valor de ${absVal}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      this.btnAggCuentaAjusteDisabled = true;
      // Agregar la cuenta a la estructura de Cierres
      const c = {
        fecha: this.filter.fecha_desde,
        fk_cuenta_contable: this.aggCuenta.id,
        cuenta_contable: this.aggCuenta.codigo,
        cuenta_contable_nombre: this.aggCuenta.nombre,
        tipo_cuenta: this.aggCuenta.tipo,
        asiento: "",
        t_m: "",
        debe: (val < 0) ? absVal : 0,
        haber: (val < 0) ? 0 : absVal,
        partida_presupuestaria_cod: (val < 0) ? this.aggCuenta.codigo_presupuesto : "",
        partida_presupuestaria_desc: (val < 0) ? this.aggCuenta.nombre_catalogo_presupuesto : "",
        partida_presupuestaria_val: ""
      }

      this.cierres.push(c)
      this.calcPagoTotal()
    }
  }

  expandCambioCuentaEmi(asiento: any, idx: number) {
    const modal = this.modalService.open(ModalCuentasEmiComponent, { size: 'lg', backdrop: 'static' });
    modal.componentInstance.tipo = asiento.tipo;
    modal.componentInstance.regla = asiento.regla;
    this.idxSelected = idx
  }

  // exportarExcel() {
  //   let excelData = [];

  //   this.cierres.forEach((item: any) => {
  //     let o = {
  //       Fecha: item.fecha,
  //       CtaContable: `${item.cuenta_contable} - ${item.cuenta_contable_nombre}`,
  //       Debe: parseFloat(item.debe),
  //       Haber: parseFloat(item.haber),
  //       PartPresupuestaria: `${item.partida_presupuestaria_cod} - ${item.partida_presupuestaria_desc}`,
  //       Valor: item.partida_presupuestaria_valor ?? '-'
  //     }

  //     excelData.push({...o})
  //   })
  //   excelData.push({Debe: this.totalDebe, Haber: this.totalHaber})

  //   this.xlsService.exportAsExcelFile(excelData, `Cierre-${this.filter.tipo_cierre}-${moment().format('YYYY-MM-DD')}`)
  // }

  GenerarReporteExcel(){

		(this as any).mensajeSpinner = "Generando Archivo Excel...";
		this.lcargando.ctlSpinner(true);



			this.cierreExcel = this.cierres;
      let totalDebe = 0
      let totalHaber = 0
      this.cierreExcel.forEach(e =>{
        Object.assign(e, {debe: parseFloat(e.debe), haber:parseFloat(e.haber)})
        totalDebe += parseFloat(e.debe)
        totalHaber += parseFloat(e.haber)
      })
      this.cierreExcel.push({debe: totalDebe, haber: totalHaber})

			if(this.cierreExcel.length > 0){

				let data = {
          fecha: this.filter.fecha_desde,
				  title: 'Asiento de Cierre',
				  rows:  this.cierreExcel
				}
				//console.log(data)
			  this.xlsServ.exportExcelAsientoCierre(data,  `Cierre-${this.filter.tipo_cierre}-${moment().format('YYYY-MM-DD')}`)
				this.lcargando.ctlSpinner(false);
			  }else{
				this.toastr.info("No hay datos para exportar")
				this.lcargando.ctlSpinner(false);
			  }

	  }

  imprimirReporte(){

   // window.open(environment.ReportingUrl + "rpt_rrhh_asientos_cierre.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha=" + this.filter.fecha_desde + "&id_cierre=" + this.asientoGuard.id_con_cierre, '_blank')
    window.open(environment.ReportingUrl + "rpt_asiento_contable_cierre.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.asientoGuard.id_con_cierre, '_blank')


  }


  getRolNoControl() {

    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Buscando'
    this.RolGeneral = []
    this.cols = []
    let Data = []
    let tipo = ["INGRESO","EGRESO","PROVISIONES"]
    let numControl = this.numeros_control.filter(e => e.id == this.filter.id_num_control)
    let data = {
      num_control : numControl[0].num_documento
    }
    this.apiSrv.consultaNumControl(data).subscribe((result: any) => {
     // console.log(result )

      this.lcargando.ctlSpinner(false)
      if(result.length > 0){

        this.lcargando.ctlSpinner(false);
        this.totalRecords = result.length
       // console.log(result.length)

        const distintosRegistros = Array.from(new Set(
          result.map(usuario => `${usuario.codigo_rubro}-${usuario.id_catalogo_tipo_rubro}-${usuario.rub_descripcion}-${usuario.orden}`)
        )).map((clave: any) => {
          const [codigo_rubro, id_catalogo_tipo_rubro, rub_descripcion, orden] = clave.split('-');
          return { codigo_rubro, id_catalogo_tipo_rubro, rub_descripcion, orden };
        });
         //console.log(distintosRegistros)
        let cabeceraIngresos = []
        let cabeceraEgresos = []
        let cabeceraProvisiones = []
        cabeceraIngresos = distintosRegistros.filter(e => e.id_catalogo_tipo_rubro == 'INGRESO' )
        cabeceraEgresos = distintosRegistros.filter(e => e.id_catalogo_tipo_rubro == 'EGRESO' )
        cabeceraProvisiones = distintosRegistros.filter(e => e.id_catalogo_tipo_rubro == 'PROVISIONES' )

        this.dataGeneral = result
        Data = result;
        this.cols = [
          { field: 'linea', header: '#', order: 1, class: "",total: 0 },
          { field: 'nro_control', header: 'No. Control', order: 2, class: "",total: 0 },
          { field: 'nro_orden_pago', header: 'No. OP', order: 3, class: "",total: 0 },
          { field: 'cedula', header: 'Cédula', order: 4, class: "one" ,total: 0},
          { field: 'id_persona', header: 'Id Persona', order: 5, class: "one",total: 0},
          { field: 'full_name', header: 'Empleado', order: 6, class: "one",total: 0 },
          { field: 'programa_nombre', header: 'Programa', order: 7, class: "one",total: 0 },
          { field: 'area_nombre', header: 'Dirección', order: 8, class: "one",total: 0 },
          { field: 'dep_nombre', header: 'Departamento', order: 9, class: "one",total: 0 },
          { field: 'dias_trabajados', header: 'Días Trabajados', order: 10, class: "one",total: 0 },
          { field: 'horas_trabajadas', header: 'Horas Trabajadas', order: 11, class: "one",total: 0 },
          { field: 'salario', header: 'Sueldo Nominal', order: 12, class: "two",total: 0 },
        ]

        let order = 12
        for ( let i = 0; i < cabeceraIngresos.length; i++){
          this.cols.push(
                    { field: cabeceraIngresos[i].codigo_rubro + cabeceraIngresos[i].id_catalogo_tipo_rubro, header: cabeceraIngresos[i].rub_descripcion, order: order + 1, class: "two", tipo: cabeceraIngresos[i].id_catalogo_tipo_rubro,total: 0 },
          )
          order++
        }

        this.cols.push(
          { field: 'total_ingresos', header: 'Total Ingresos', order: order +1 , class: "two" ,total: 0},
        )
        order++

        for ( let i = 0; i < cabeceraEgresos.length; i++){
          this.cols.push(
                    { field: cabeceraEgresos[i].codigo_rubro + cabeceraEgresos[i].id_catalogo_tipo_rubro, header: cabeceraEgresos[i].rub_descripcion, order: order + 1, class: "two", tipo: cabeceraEgresos[i].id_catalogo_tipo_rubro,total: 0 },
          )
          order++
        }
        this.cols.push(
          {  field: 'total_egresos', header: 'Total Egresos', order: order + 1, class: "two" ,total: 0},
          {   field: 'total_diferencia', header: 'Total a Recibir', order: order +2 , class: "two",total: 0 },
        )
        order++
        order++

        for ( let i = 0; i < cabeceraProvisiones.length; i++){
          this.cols.push(
                    { field: cabeceraProvisiones[i].codigo_rubro + cabeceraProvisiones[i].id_catalogo_tipo_rubro, header: cabeceraProvisiones[i].rub_descripcion, order: order + 1, class: "two", tipo: cabeceraProvisiones[i].id_catalogo_tipo_rubro,total: 0 },
          )
          order++
        }

        this.cols.push(
          { field: 'total_provisiones', header: 'Total Provisiones', order: order +1 , class: "two" ,total: 0},
        )
        let encabezado = this.cols.filter(e => e.order > 9)

        for(let a = 0; a< tipo.length;a++){

          let arrayTipo = this.cols.filter(co => co.id_catalogo_tipo_rubro == tipo[a]);
       //   console.log(arrayTipo);
        }

        let linea = 0

        for (let i = 0; i < Data.length; i++) {
        let rol = this.RolGeneral.filter(rol => rol.id_persona == Data[i].id_persona);

        let valoresColumnas = this.cols.filter(col => col.field === Data[i].codigo_rubro + Data[i].id_catalogo_tipo_rubro);
        if(valoresColumnas.length > 0){
          valoresColumnas.forEach(e =>{
            e.total += parseFloat(Data[i].valor)
          })
        }

         if (rol.length == 0) {
            linea++;
            this.numero_empleados = linea

            let objetoRol = {}
            objetoRol['linea'] = String(linea);
            objetoRol['aprobar'] =Data[i].num_control != ''? true: false;
            objetoRol['tiene_control'] =Data[i].num_control != ''? true: false;
            objetoRol['tiene_op'] =Data[i].num_orden_pago != ''? true: false;
            objetoRol['nro_control'] = Data[i].num_control;
            objetoRol['nro_orden_pago'] =  Data[i].num_orden_pago;
            objetoRol['id_persona'] = Data[i].id_persona;
            objetoRol['full_name'] = Data[i].emp_full_nombre;
            objetoRol['cedula'] = Data[i].emp_identificacion;
            objetoRol['programa_nombre'] = Data[i].programa_nombre;
            objetoRol['area_nombre'] = Data[i].area_nombre;
            objetoRol['dep_nombre'] = Data[i].dep_nombre;
            objetoRol['dias_trabajados'] = Data[i].dias_trabajados;
            objetoRol['horas_trabajadas'] = Data[i].horas_trabajadas;
            objetoRol['salario'] = parseFloat((Data[i].sld_salario_minimo));

            for ( let i = 0; i < cabeceraIngresos.length; i++){

              objetoRol[cabeceraIngresos[i].codigo_rubro + cabeceraIngresos[i].id_catalogo_tipo_rubro] =0;

            }
            objetoRol['total_ingresos'] = 0;

            for ( let i = 0; i < cabeceraEgresos.length; i++){

              objetoRol[cabeceraEgresos[i].codigo_rubro + cabeceraEgresos[i].id_catalogo_tipo_rubro] =0;

            }
            objetoRol['total_egresos'] = 0;
            objetoRol['total_diferencia'] = 0;

            for ( let i = 0; i < cabeceraProvisiones.length; i++){

              objetoRol[cabeceraProvisiones[i].codigo_rubro + cabeceraProvisiones[i].id_catalogo_tipo_rubro] =0;

            }
            objetoRol['total_provisiones'] = 0;

            objetoRol[Data[i].codigo_rubro + Data[i].id_catalogo_tipo_rubro] = parseFloat(Data[i].valor);
            this.RolGeneral.push(objetoRol);
          } else {
            rol[0][Data[i].codigo_rubro + Data[i].id_catalogo_tipo_rubro] = parseFloat(Data[i].valor);

          }
        }
     //   console.log(this.cols)

        this.RolGeneral.forEach(e => {
          let totalIngresos  = 0
          let totalEgresos = 0
          let totalProvisiones = 0
          let rol = Data.filter(rol => rol.id_persona == e.id_persona);
        //  console.log(rol)
            rol.forEach(f => {
              if(f.id_catalogo_tipo_rubro == 'INGRESO'){
                totalIngresos += parseFloat(f.valor)
              }
              if(f.id_catalogo_tipo_rubro == 'EGRESO'){
                totalEgresos += parseFloat(f.valor)
              }
              if(f.id_catalogo_tipo_rubro == 'PROVISIONES'){
                totalProvisiones += parseFloat(f.valor)
              }
            })


            Object.assign(e, {total_ingresos:this.commonService.formatNumberDos(totalIngresos) /*totalIngresos.toFixed(2)*/ ,total_egresos:this.commonService.formatNumberDos(totalEgresos) /*totalEgresos.toFixed(2)*/, total_diferencia: totalIngresos - totalEgresos, total_provisiones:totalProvisiones.toFixed(2)  })
          });
          let totalesSalario = this.RolGeneral.reduce((suma: number, x: any) => suma + parseFloat(x.salario), 0)

          let totalesIngresos = this.RolGeneral.reduce((suma: number, x: any) => suma + parseFloat(x.total_ingresos), 0)
          let totalesEgresos =  this.RolGeneral.reduce((suma: number, x: any) => suma +  parseFloat(x.total_egresos), 0)
          let totalesDiferencia =  this.RolGeneral.reduce((suma: number, x: any) => suma +   parseFloat(x.total_diferencia), 0)
          let totalesProvisiones =  this.RolGeneral.reduce((suma: number, x: any) => suma +   parseFloat(x.total_provisiones), 0)

          let valoresColumnasSal = this.cols.filter(col => col.field === 'salario');
          if(valoresColumnasSal.length > 0){
            valoresColumnasSal.forEach(e =>{
              e.total = parseFloat(totalesSalario)
            })
          }

          let valoresColumnasIn = this.cols.filter(col => col.field === 'total_ingresos');
          if(valoresColumnasIn.length > 0){
            valoresColumnasIn.forEach(e =>{
              e.total = parseFloat(totalesIngresos)
            })
          }

          let valoresColumnasEg = this.cols.filter(col => col.field === 'total_egresos');
          if(valoresColumnasEg.length > 0){
            valoresColumnasEg.forEach(e =>{
              e.total = parseFloat(totalesEgresos)
            })
          }

          let valoresColumnasDif = this.cols.filter(col => col.field === 'total_diferencia');
          if(valoresColumnasDif.length > 0){
            valoresColumnasDif.forEach(e =>{
              e.total = parseFloat(totalesDiferencia)
            })
          }

          let valoresColumnasProv = this.cols.filter(col => col.field === 'total_provisiones');
          if(valoresColumnasProv.length > 0){
            valoresColumnasProv.forEach(e =>{
              e.total = parseFloat(totalesProvisiones)
            })
          }

          let lineaTotales = {}
            lineaTotales['linea'] = 'TOTAL';
            lineaTotales['nro_control'] = '';
            lineaTotales['nro_orden_pago'] = '';
            lineaTotales['id_persona'] = '';
            lineaTotales['full_name'] ='';
            lineaTotales['cedula'] ='';
            lineaTotales['programa_nombre'] = '';
            lineaTotales['area_nombre'] = '';
            lineaTotales['dep_nombre'] = '';
            lineaTotales['dias_trabajados'] ='';
            lineaTotales['horas_trabajadas'] ='';
            lineaTotales['salario'] ='';

            for ( let i = 0; i < cabeceraIngresos.length; i++){

              lineaTotales[cabeceraIngresos[i].codigo_rubro + cabeceraIngresos[i].id_catalogo_tipo_rubro] =0;

            }
            lineaTotales['total_ingresos'] = 0;

            for ( let i = 0; i < cabeceraEgresos.length; i++){

              lineaTotales[cabeceraEgresos[i].codigo_rubro + cabeceraEgresos[i].id_catalogo_tipo_rubro] =0;

            }
            lineaTotales['total_egresos'] = 0;
            lineaTotales['total_diferencia'] = 0;

            for ( let i = 0; i < cabeceraProvisiones.length; i++){

              lineaTotales[cabeceraProvisiones[i].codigo_rubro + cabeceraProvisiones[i].id_catalogo_tipo_rubro] =0;

            }
            lineaTotales['total_provisiones'] = 0;

            for(let i = 8; i < this.cols.length; i++){
              lineaTotales[this.cols[i].field] = parseFloat(this.cols[i].total);
            //  console.log(lineaTotales[this.cols[i].field])
            }
         //   console.log(lineaTotales)

            this.RolGeneral.push(lineaTotales);
          //  console.log(this.RolGeneral)
        // return
        //console.log(this.RolGeneral)
        this.vmButtons[5].habilitar = false;

        // let sinAprobar = this.RolGeneral.filter(e => e.tiene_control == false)
        //   if(sinAprobar.length > 0){
        //     this.vmButtons[3].habilitar = false;
        //   }else {
        //     this.vmButtons[3].habilitar = true;
        //   }

        let empleadosSinOrden= this.RolGeneral.filter(e =>  e.tiene_control == true && e.tiene_op == false)
       // console.log(empleadosSinOrden)
        if(empleadosSinOrden.length > 0){
          this.vmButtons[2].habilitar = false;
        }

      }else{
        this.lcargando.ctlSpinner(false);
        this.toastr.info('No hay registros para esta consulta')
      }


    })


  }
  AsociacionElementType(ahora: any) {


    this.locality = 'en-EN';

    if ((typeof ahora) === 'undefined') {

      let ceroElement = "0";

      ceroElement = parseFloat(ceroElement).toLocaleString(this.locality, {
        minimumFractionDigits: 2
      })
      ceroElement = ceroElement.replace(/[,.]/g, function (m) {
        return m === ',' ? '.' : ',';
      });

      return ceroElement;

    } else {

      const isNumeric = ((typeof ahora));


      if (isNumeric === 'number') {

        //console.log(ahora)

        ahora = parseFloat(ahora).toLocaleString(this.locality, {
          minimumFractionDigits: 2
        })
        // ahora = ahora.replace(/[,.]/g, function (m) {
        //   return m === ',' ? '.' : ',';
        // });

        return ahora;

      } else {
        return ahora;
      }
    }

  }
  handleChange(event){
   // console.log(event.target.id)
    this.selectedTab = event.target.id
  }

  btnExportarExcelNuevo(){

console.log(this.RolGeneral)

    this.RolGeneral.forEach(e => {
      Object.assign(e, {
        total_ingresos: parseFloat(e.total_ingresos),
        total_egresos: parseFloat(e.total_egresos)
      })
    });
    if (this.cols.length > 0) {
        let data = {
          title: 'Rol General',
          //imagen: imagen,
          cols: this.cols,
          rows: this.RolGeneral
        }
        this.xlsServ.exportExcelRolGeneral(data, 'Rol General')
      } else {
      }
   }

   GenerarOrden(){
    let empleadosValorNegativo= this.RolGeneral.filter(e => e.total_diferencia < 0)

    let empleadosSinOrden= this.RolGeneral.filter(e =>e.tiene_control == true && e.tiene_op == false)

    let anio = moment(this.filter.fecha_desde).format('YYYY');
    let mes = moment(this.filter.fecha_desde).format('MM');
    if(anio ==undefined ){
      this.toastr.info('Debe seleccionar un Año');
    }
    else if(mes==undefined){
      this.toastr.info('Debe seleccionar un Mes');
    }
    else if(this.filter.tipo_contrato==undefined || this.filter.tipo_contrato==0){
      this.toastr.info('Debe seleccionar un Tipo de Contrato');
    }
    else if(this.codigo_cuenta_contable==undefined || this.codigo_cuenta_contable==0 || this.codigo_cuenta_contable ==""){
      this.toastr.info('Debe seleccionar una Cuenta Contable');
    }
    else if(empleadosValorNegativo.length > 0){
      this.toastr.info('No se puede generar ordenes con valores negativos, por favor revise las lineas sombreadas en rojo');
    }
    else if(empleadosSinOrden.length == 0){
      this.toastr.info('Ya fueron generadas las ordenes de pago');
    }


    else{

      let data = {
        anio: Number(anio),
        mes: Number(mes),
        tipo_contrato: this.filter.tipo_contrato,
        cuenta_contable: this.codigo_cuenta_contable,
        codigo_presupuesto : this.codigo_presupuesto,
        tipo_pago: this.tipoPago
      }

      this.lcargando.ctlSpinner(true);
      this.apiSrv.generarOrdenesPago(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Se ha procesado con éxito",
          //text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
      })
      this.getRolNoControl()
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
  }

  getCuentaContableTipoPago(){
    (this as any).mensajeSpinner = "Cargando cuenta contable...";
    this.lcargando.ctlSpinner(true);

    let cuenta
    if(this.tipoPago == 'Q'){ cuenta = 'QUIA' }
    if(this.tipoPago == 'M'){cuenta = 'SUELXPAG'}

    let data = {
     tipo_pago: cuenta,
     tipo_contrato: this.filter.tipo_contrato
    }

    this.apiSrv.getConCuentasTipoPago(data).subscribe(
      (res: any) => {
       // console.log(res);
        this.cuenta = res
        //this.codigo_cuenta_contable = res.data?.cuenta_inversion_hab
        this.codigo_cuenta_contable = res.data?.cuenta_acreedora
        this.codigo_presupuesto = res.data?.codigo_presupuesto

        let filter = {
          codigo: res.data?.cuenta_acreedora,
          nombre: undefined,
        }
        let data = {
          params: {
            filter: filter,
            paginate: this.paginate
          }
        }
        this.apiSrv.getConCuentasRol(data).subscribe(
        (res2: any) => {
        //  console.log(res2)
          this.descripcion_cuenta = res2?.data?.data[0]?.nombre
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
        )

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  consultaTipoAsiento(event){
   // [ngClass]="{'d-none': filter.tipo_asiento == 'ASIENTO_PROVISIONES' || filter.tipo_asiento == 'DEVENGADO_NOMINA'  || filter.tipo_asiento == 'CRUCE_ANTICIPO' }"

 //  console.log(event)


   if(event == 'PAGADO_TERCEROS'){
      this.verBanco= true
      (this as any).mensajeSpinner = "Cargando Rubros...";
      this.lcargando.ctlSpinner(true);
      this.apiSrv.getRubrosPagoTerceros().subscribe(
        (res: any) => {
         // console.log(res);
          if(res.data.length > 0){
            this.rubPagoTerceros = res.data
            this.lcargando.ctlSpinner(false);
          }else {
            this.toastr.info('No existen rubros para pagos de terceros')
            this.lcargando.ctlSpinner(false);
          }
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      )

    }
    if( event == 'PAGADO_NOMINA' || event == 'PAGADO_APORTES' || event == 'PAGADO_PRESTAMOS'){
      this.verBanco= true
    }

  }




}
