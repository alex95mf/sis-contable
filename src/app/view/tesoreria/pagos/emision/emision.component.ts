import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import moment from 'moment';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { EmisionService } from './emision.service';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListDocumentosComponent } from './list-documentos/list-documentos.component';
import { HistorialComprobanteComponent } from './historial-comprobante/historial-comprobante.component';
import { ExcelService } from 'src/app/services/excel.service';
import { DiarioService } from 'src/app/view/contabilidad/comprobantes/diario/diario.service';
import { MovimientosBancariosComponent } from './movimientos-bancarios/movimientos-bancarios.component';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
@Component({
standalone: false,
  selector: 'app-emision',
  templateUrl: './emision.component.html',
  styleUrls: ['./emision.component.scss']
})
export class EmisionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle = "Emisión de pago";
  mensajeSpinner: string = "Cargando...";
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  filter: any;
  paginate: any;
  nominaCheck: any;
  filterAsiento: any;

  formReadOnly = false;
  titulosDisabled = true;
  busqueda: boolean = false;

  mostrarCuentas: boolean = true;
  mostrarMovimientos: boolean = false;
  disabledNomina: boolean = false
  // excelData: any[];

  cuenta:  any = [];
  exportList: any[];
  contribuyenteActive: any = {
    razon_social: ""
  };
  disabledComprobante = true
  id: any;
  valorCuentas: any = [];
  asiento: Array<any> = [];
  totalAsiento:Array<any> = [];

  movimiento: any = [];
  movimientoFilter: any = [];
  cuentas_filter: any;

  pipe = new DatePipe('en-US');
  conceptosList: any = [];
  concepto: any = 0;
  totalCobro = 0;
  totalPago = 0;
  difCobroPago = 0;
  deudas: any = [];
  ordenesNomina: any = [];
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
  verifyRestore = false;
  formasDePago = [
    // {
    //   nombre: "EFECTIVO",
    //   valor: "EF"
    // },
    // {
    //   nombre: "TARJETA",
    //   valor: "TC"
    // },
    //  {
    //   nombre: "CHEQUE",
    //   valor: "CH"
    // },
    {
      nombre: "TRANSFERENCIA",
      valor: "TR"
    },
    {
      nombre: "NOTA DE DEBITO",
      valor: "ND"
    }
    // {
    //   nombre: "TRANSFERENCIAS REALIZADAS",
    //   valor: "TRE"
    // }
    // , {
    //   nombre: "DEBITO",
    //   valor: "TD"
    // },
  ];
  listaDesembolso: any = []
  listaCuentas: any = []
  pagos: any = [];
  tipoContratos: any = [];
  formaPago = 0;
  documento: any = {
    // id_documento: null,
    // tipo_documento: "", // concepto.codigo
    // fk_contribuyente: null, // contr id
    documento: "",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    fk_orden_pago: 0,
    observacion: "",
    estado: "E",
    subtotal: 0,
    total: 0,
    forma_pago: "",
    cuenta: '',
    id_banco: undefined,
    comprobante_egreso: "",
    detalles: [],
    asiento: [],
    detalles_asiento: [],
    ordenpago: [],
    saldo: 0,
    tipo_pago:'',
    id_comprobante_eg_cab: undefined,
    motivo_anulacion: ""

    // deudas
    // formas_pago: [], // pagos
    // fk_caja: 0, // caja activa al momento de cobrar
  }
  // cajaActiva: any = {
  //   id_caja: 0,
  //   nombre: "",
  // }

  formValid: boolean = false
  id_orden_pago: any = 0

  changeNomina: boolean = false
  periodo: Date = new Date();
  mes_actual: any = 0;
  tipoContrato: any = 0
  tipo_desembolso: any =0

  totalDebito: any = 0
  totalCredito: any = 0
  valorTotalMovimiento: any = 0

  tipoPagoSueldo = [
    {value: "Q",label: "Quincena"},
    {value: "M",label: "Fin de mes"},
  ]
  tipoPago: any

  anular: boolean = false;
  cmb_motivo_anulacion: any = []
  disabledAnular: boolean = true;

  tabActiva: string = 'nav-ordenes';


  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: EmisionService,
    private excelService: ExcelService,
    private diarioSrv: DiarioService,
    private cierremesService: CierreMesService
  ) {
    // this.commonVrs.selectContribuyenteCustom.asObservable().subscribe(
    //   (res) => {
    //     console.log(res);
    //     // this.cargarDatosModal(res);
    //     this.contribuyenteActive = res;
    //     this.titulosDisabled = false;
    //     this.vmButtons[3].habilitar = false;
    //   }
    // );
    this.commonVrs.modalMovimientosBancarisoAF.asObservable().subscribe(
      (res)=>{
        console.log(res)
        this.movimiento = [];
        res['id_documento_detalle'] = 0;
        res['num_cuenta'] =Number(res['num_cuenta']);
        //this.totalCobro = res['valor'];
        this.valorTotalMovimiento = res['valor'];
        this.documento.id_comprobante_eg_cab = res['id']
        this.movimiento.push(res);
        console.log( this.movimiento)
        this.filterAsiento.cuenta_contable = res['cuenta_contable']
        this.filterAsiento.id_asiento = res['fk_cont_mov_cab']
        this.cargarMovimientosBancariosAsiento();
      }
    )
    this.commonVrs.selectPago.asObservable().subscribe(
      (res) => {
        console.log(res)
        console.log(this.valorCuentas)
        console.log(res.dato.detalles)

        if (res.val == 'val') {
          // Cuando se deselecciona un documento
          // console.log('asd')
         this.totalCobro -= res.dato.cobro
          this.valorCuentas.map(
            (e) => {
              if (e.cuenta == res.banco) {
                e.valor -= res.dato.cobro,
                e.cuenta_contable=res.dato.cuenta_contable ,
                e.name_cuenta=res.dato.name_cuenta

              }
            }
          )
        } else {
          // Cuando se selecciona un documento
          this.titulosDisabled = false;
          this.restar(res);
          console.log(res)
          this.valorCuentas.forEach(
            (e) => {
              if (e.cuenta == res.banco) {
                e.cuenta_contable=res.dato.cuenta_contable ,
                e.name_cuenta=res.dato.name_cuenta
              }
            }
          )
          this.sumarBancos()
          // this.totalCobro = res.cobro
          this.difCobroPago = 0
          this.generaPreviewAsientoContable();

        }

        // this.id_orden_pago=res.dato.id_orden_pago
        // console.log(this.id_orden_pago)




      }
    )
    this.commonVrs.selectRecDocumento.asObservable().subscribe(
      (res) => {
        console.log(res)
        // this.formReadOnly = true;
        this.restoreForm();

        this.disabledAnular = false;

        // this.concepto = res.concepto; // ya no se maneja eligiendo concepto se puede eliminar
        this.contribuyenteActive = res.contribuyente;
        this.documento = res;
        this.documento.fecha = res.fecha.split(" ")[0];
        console.log(res);
        this.id = res['id_pago']
        //this.cuenta = res['cuenta']
        this.cuenta = res.cuenta
        //this.cuenta.name_banks = res['cuenta']
        //this.cuenta.id_banks = res['fk_banco_cuenta']
        let data ={
          name_banks: res.comprobante_egreso?.detalle_banco.name_banks,
          num_cuenta: res.comprobante_egreso?.detalle_banco.num_cuenta,
          tipo_egreso: res.comprobante_egreso?.tipo_egreso,
          fecha_emision:  res.comprobante_egreso?.fecha_emision,
          valor:  res.comprobante_egreso?.valor
        }
        this.movimiento.push(data)


        if(res['tipo_pago']==null || res['tipo_pago']=='FACTURA'){
          this.changeNomina = false;
          this.documento.tipo_pago = 'FACTURA'
          res.detalles.forEach(e => {
            let det = {
              // tipo_documento: e.codigo_concepto ?? "NaN",
              // documento: e.ordenpago.documento,
              // concepto: {nombre: e.concepto ? e.concepto.nombre : "NaN"},
              comentario: e.comentario,
              valor: e.valor,
              saldo: e.saldo_anterior,
              cobro: e.abono,
              nuevo_saldo: e.saldo_actual,
              cuenta: e.cuenta,
              tipo_desembolso: e.tipo_desembolso,
              documento: e.orden_pago[0]?.documento,
              proveedor: e.orden_pago[0]?.proveedor === null ? null :  e.orden_pago[0]?.proveedor.razon_social,
              num_documento: e.orden_pago[0]?.proveedor  === null ? null : e.orden_pago[0]?.proveedor.num_documento,
              num_cuenta: e.orden_pago[0]?.proveedor === null ? null : e.orden_pago[0]?.num_cuenta,
              tipo_cuenta: e.orden_pago[0]?.proveedor === null ? null : e.orden_pago[0]?.proveedor.tipo_cuenta,
              observacion: e.observacion,
              configCont: e.config_contable === null ? null : e.config_contable.descripcion
            }
            this.deudas.push(det);

          })
        }else{
          this.changeNomina = true;
          this.cargarDesembolso();
          this.tipo_desembolso = res.tipo_pago

          res.detalles.forEach(e => {
            let descripcion_desembolso = this.listaDesembolso.filter(d => d.valor == e.tipo_desembolso)
            let det = {
              // tipo_documento: e.codigo_concepto ?? "NaN",
              // documento: e.ordenpago.documento,
              // concepto: {nombre: e.concepto ? e.concepto.nombre : "NaN"},
              comentario: e.comentario,
              total: e.valor,
              saldo: e.valor,
              cobro: e.abono,
              nuevo_saldo: e.saldo_actual,
              cuenta: e.cuenta,
              tipo_desembolso: e.tipo_desembolso,
              descripcion_desembolso:descripcion_desembolso[0].descripcion,
              documento: e.orden_pago[0].documento,
              empleado: e.orden_pago[0].datos_empleado === null ? null :  e.orden_pago[0].datos_empleado.emp_full_nombre,
              num_documento: e.orden_pago[0].proveedor  === null ? null : e.orden_pago[0].proveedor.num_documento,
              num_cuenta: e.orden_pago[0].proveedor === null ? null : e.orden_pago[0].num_cuenta,
              tipo_cuenta: e.orden_pago[0].proveedor === null ? null : e.orden_pago[0].proveedor.tipo_cuenta,
              observacion: e.observacion,
              configCont: e.config_contable === null ? null : e.config_contable.descripcion
            }
            this.ordenesNomina.push(det);

          })
        }
        console.log(this.ordenesNomina)


        if(res.asiento!=null){
          if(res.asiento.detalle.length > 0){
            let cuentas=[];
            res.asiento.detalle.forEach(e => {
              cuentas.push(e.cuenta);
            })

            let cod ={
              codigos:cuentas
            }
            this.apiSrv.getAccountsByCodigo(cod).subscribe(res2 => {


              this.asiento=[];
              let cuentas_filter
              console.log(res.asiento)

                res.asiento.detalle.forEach(e => {
                  if(res2['data'].length > 0 ){
                    cuentas_filter =res2['data'].filter(d => d.codigo == e.cuenta)
                  }else{
                    cuentas_filter = undefined
                  }
                    this.asiento.push({
                      fecha: res.asiento?.fecha,
                      LoadOpcionCatalogoPresupuesto: false,
                      presupuesto: e.partida_presupuestaria,
                      codpresupuesto: e.codigo_partida,
                      valor_presupuesto:parseFloat(e.valor_partida),
                      account: e.cuenta,
                      name: cuentas_filter != undefined ? cuentas_filter[0].nombre : '' ,
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

                    });
                    this.TotalizarAsiento();
                })
            })
          }else{
            this.asiento=[];
          }
        }


        this.formValid = true;

        this.totalCobro = res.total;
        this.totalPago = res.total;
        this.difCobroPago = res.saldo;
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
        this.vmButtons[4].habilitar = false;
        this.vmButtons[5].habilitar = false;
        this.vmButtons[6].habilitar = true;

        // if(this.documento.estado=='X'){
        //   this.vmButtons[6].habilitar = true;
        // }else{
        //   this.vmButtons[6].habilitar = false;
        // }


        this.formReadOnly = true;
        this.titulosDisabled = false;
        this.busqueda = true
        this.disabledComprobante = false
        if(this.documento.forma_pago == 'TRANSFERENCIA'){
          this.mostrarCuentas = true;
          this.mostrarMovimientos = false;
        }
        if(this.documento.forma_pago =='NOTA DE DEBITO'){
          this.mostrarMovimientos = true;
          this.mostrarCuentas = false;
        }

        res.detalles.map(
          (e)=>{
            let valid = true
            this.valorCuentas.map(

              (res) => {
                console.log(res)
                if (res.banco == e.cuenta) {
                  valid = false
                }
              }
            )
            if (valid) {
              this.valorCuentas.push({ banco: e.cuenta, valor: 0 })
            }

          }
        )

        let cobroTotal = 0;
        if(this.deudas.length > 0){
          this.deudas.forEach(e => {
            // if (e.aplica) {
            let cobro100 = +e.cobro * 100;
            cobroTotal += cobro100;
            // cobroTotal += +e.cobro; // en este caso es total porque sale de valor unitario * cantidad
            // }
          });
        }
        if(this.ordenesNomina.length > 0){
          this.ordenesNomina.forEach(e => {
            // if (e.aplica) {
            let cobro100 = +e.cobro * 100;
            cobroTotal += cobro100;
            // cobroTotal += +e.cobro; // en este caso es total porque sale de valor unitario * cantidad
            // }
          });
        }
        this.totalCobro = +cobroTotal / 100;


        this.valorCuentas.map(
          (data) => {
            let total = 0;
            if(this.deudas.length > 0){
              this.deudas.map(
                (res) => {
                  if (res.cuenta == data.banco) {
                    console.log(res.cuenta)
                    total += parseFloat(res.cobro)
                    console.log('val', total)
                  }
                }
              )
              //console.log('valores Bancos',total)
              data.valor = total;
            }

            if(this.ordenesNomina.length > 0){
              this.ordenesNomina.map(
                (res) => {
                  if (res.cuenta == data.banco) {
                    console.log(res.cuenta)
                    total += parseFloat(res.cobro)
                    console.log('val', total)
                  }
                }
              )
              //console.log('valores Bancos',total)
              data.valor = total;
            }
          })


        // this.calcSaldoRestanteTotal();
        //this.calcDifCobroPago();


        // this.restar;
      //  this.calcCobroTotal();
      }

    )

  }

  ngOnInit(): void {
    // this.cajaActiva = JSON.parse(localStorage.getItem('activeCaja'));
    // console.log(this.cajaActiva);

    this.mes_actual = Number(moment(new Date()).format('MM'));
    this.vmButtons = [
      {
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenLiqCobro",
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
        orig: "btnsRenLiqCobro",
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
        orig: "btnsRenLiqCobro",
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
        orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "fas fa-edit", texto: " EDITAR" },
        permiso: true, showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true
      },

      {
        orig: "btnsRenLiqCobro",
        paramAccion: "2",
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true
      },
      { orig: "btnsRenLiqCobro",
        paramAccion: "",
        boton: { icon: "fas fa-trash", texto: "ANULAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true
      }


    ]

    this.filter = {
     periodo: this.periodo,
     mes: 0,
     tipo_contrato: 0,
     tipo_pago: ''


    };

    this.filterAsiento = {
      estado: 3,
      num_cuenta: 3,
      cuenta_contable: 3,
      concepto: "",
      movimiento:undefined,
      id_asiento:undefined
    };


    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    setTimeout(() => {
      this.validaPermisos();
      this.cargarDesembolso();
      this.cargarCuentas();
      this. getTipoContratos();
    }, 0);
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case " GUARDAR":
       this.validateEmision();
        break;
      case " BUSCAR":
        this.expandListDocumentosRec();
        break;
      case " IMPRIMIR":

        break;
      case " LIMPIAR":
        this.confirmRestore();
        break;

      case " EDITAR":
        this.editarComprobante()
        break;
      case "EXCEL":
        this.btnExportar();
        break;
      case "ANULAR":
        this.anularPago();
        break;

      default:
        break;
    }
  }

  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; }

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
          // this.lcargando.ctlSpinner(false);
          // this.getCajaActiva();
          this.getCatalogos()
          this.getConceptos();
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  getCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      params: "'REC_MOTIVO_ANULACION'",
    }

    this.apiSrv.getCatalogos(data).subscribe(
      (res) => {
        console.log(res);
        res['data']['REC_MOTIVO_ANULACION'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.cmb_motivo_anulacion.push(f_pago);
        })
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }

  formaPagoSelected(event){
    console.log(event);
    if(event == 'TRANSFERENCIA'){
      this.mostrarCuentas = true;
      this.mostrarMovimientos = false;
      this.disabledNomina= false;
      //this.buscarMovimientoBancario();

    }
    if(event =='NOTA DE DEBITO'){
      this.mostrarMovimientos = true;
      this.mostrarCuentas = false;
      this.disabledNomina= true;
    }
    console.log(this.mostrarMovimientos)
    console.log( this.mostrarCuentas)
  }

  buscarMovimientoBancario(){

  }

  btnExportar() {

    if(this.documento.tipo_pago == 'FACTURA'){

      this.exportarExcelFactura()
    }else if(this.documento.tipo_pago == 'NOMINA'){
      this.exportarExcelNomina()
    }
  }
  exportarExcelFactura(){
    let excelData = [];
    let tipo_emision = 'Emision de pago factura'

    this.deudas.forEach(elem => {


      const {proveedor, num_documento, num_cuenta, tipo_cuenta, cobro, observacion} = elem

      let objeto = {
        Cedula_Ruc_o_Pasaporte: num_documento,
        // Referencia: ,
        Nombre: proveedor,
        // Institucion_Financiera: ,
        Cuenta_Beneficiario: num_cuenta,
        // TipoCuenta: ,
        Valor: cobro,
        // Tipo_de_contrato: ,
        // Concepto: ,
        Detalle: observacion
      }

      excelData.push(objeto)
    });

    this.exportAsXLSX(excelData,tipo_emision);
  }
  exportarExcelNomina(){
    let excelData = [];
    let tipo_emision = 'Emision de pago nómina'
    this.exportList = this.ordenesNomina

    if (this.permissions.exportar == "0") {
      this.toastr.info("Usuario no tiene permiso para exportar");
    } else {


      Object.keys(this.exportList).forEach(key => {
        let filter_values = {};
        filter_values['ID'] = key;
        filter_values['Documento'] = (this.exportList[key].documento != null) ? this.exportList[key].documento.trim() : "";
        filter_values['Tipo de desembolso'] = (this.exportList[key].descripcion_desembolso != null) ? this.exportList[key].descripcion_desembolso.trim() : "";
        filter_values['Cuenta'] = (this.exportList[key].cuenta != null) ? this.exportList[key].cuenta.trim() : "";
        filter_values['Empleado'] = (this.exportList[key].datos_empleado?.emp_full_nombre != null) ? this.exportList[key].datos_empleado.emp_full_nombre.trim() : this.exportList[key].empleado;
        filter_values['Comentario'] = (this.exportList[key].comentario != null) ? this.exportList[key].comentario.trim() : "";
        filter_values['Valor total'] = (this.exportList[key].total != undefined) ? this.exportList[key].total.trim() : "";
        filter_values['Saldo actual'] =  (this.exportList[key].saldo != undefined) ? this.exportList[key].saldo.trim() : "";
        filter_values['Valor a pagar'] = (this.exportList[key].cobro != undefined) ? this.exportList[key].cobro.trim() : "";
        filter_values['Saldo restante'] = (this.exportList[key].nuevo_saldo != undefined) ? this.exportList[key].nuevo_saldo : "";

        excelData.push(filter_values);
      })
      this.exportAsXLSX(excelData,tipo_emision);
    }
  }

  exportAsXLSX(excelData, emision) {
    this.excelService.exportAsExcelFile(excelData, emision);
  }

  // no se usa ya que la sesion ahora maneja toda la caja activa, no solo el id
  //  getCajaActiva() {
  //   (this as any).mensajeSpinner = 'Obteniendo Caja Activa...';
  //   let id = this.cajaActiva.id_caja;

  //   // funcion necesario solo porque en la sesion se maneja solo el id no toda la info de la caja activa

  //   this.apiSrv.getCajaActiva(id).subscribe(
  //     (res) => {
  //       console.log(res);
  //       this.cajaActiva = res['data'];
  //       this.getConceptos();
  //       // this.lcargando.ctlSpinner(false);
  //     },
  //     (err) => {
  //       this.lcargando.ctlSpinner(false)
  //       this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
  //     }
  //   )
  // }

  getTipoContratos(){
    let data = {
      valor_cat: 'TCC',
    }
    this.apiSrv.getTipoContratos(data).subscribe((result: any) => {
      console.log(result);

      if(result.length > 0){
        this.tipoContratos=result;
      }else {
        this.tipoContratos=[];
        //this.toastr.info('No hay registros de dias trabajados para este periodo y mes');
        //this.lcargando.ctlSpinner(false);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getConceptos() {
    (this as any).mensajeSpinner = 'Obteniendo Conceptos...';
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

  cargarMovimientosBancariosAsiento() {

    (this as any).mensajeSpinner = "Cargando Asiento";
    this.lcargando.ctlSpinner(true);


    let data = {
      empresa: 1,
      params: {
        filter: this.filterAsiento,
        paginate: this.paginate
      }
    }

    this.apiSrv.getMovimientoBancarioAsiento(data).subscribe(
      (res) => {
        console.log(res);
        if(res['data']['data'].length > 0){
          this.movimientoFilter = res['data']['data']
        }
        this.generaPreviewAsientoContable()
        //this.TotalizarAsiento()
        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  openNomina(event) {

    if (event) {
      this.changeNomina = true;
      this.documento.tipo_pago = 'NOMINA'
      this.deudas= [];
      this.totalCobro = 0
      this.difCobroPago = 0
    } else {
      this.changeNomina = false;
      this.documento.tipo_pago = 'FACTURA'
      this.ordenesNomina=[];

    }

  }
  periodoSelected(evt: any, year:any){
    console.log(evt)
    this.periodo = evt.getFullYear()
  }

  cargarOrdenesPagoNomina(){

    if(this.cuenta == undefined || this.cuenta == null || this.cuenta == ""){
      this.toastr.info('Debe seleccionar una cuenta');
    }else if(this.tipo_desembolso == undefined  || this.tipo_desembolso == 0  ){
      this.toastr.info('Debe seleccionar un tipo de desembolso');
    }else if(this.filter.tipo_contrato == undefined  || this.filter.tipo_contrato == 0  ){
      this.toastr.info('Debe seleccionar un tipo de contrato');
    }
    else{
      (this as any).mensajeSpinner = 'Obteniendo Ordenes...';
      this.lcargando.ctlSpinner(true);
      this.filter.mes = this.mes_actual
      this.filter.periodo = this.periodo.getFullYear()
      let data = {
        params:{
          filter: this.filter,
         // paginate: this.paginate
        }
      }
      this.apiSrv.getOrdenesPagoNomina(data).subscribe((result: any) => {
        console.log(result);

        if(result['data'].length > 0){
          this.lcargando.ctlSpinner(false);
          let descripcion_desembolso = this.listaDesembolso.filter(e => e.valor == this.tipo_desembolso)
          //let totalCobro = 0
          result['data'].forEach(e => {
            Object.assign(e,{
              cobro: e.total,
              nuevo_saldo:0,
              tipo_desembolso: this.tipo_desembolso,
              descripcion_desembolso: descripcion_desembolso[0].descripcion,
              cuenta: this.cuenta.name_banks,
              num_cuenta:this.cuenta.num_cuenta,
              cuenta_contable:this.cuenta.cuenta_contable,
              name_cuenta:this.cuenta.name_cuenta
              })

             // totalCobro += + e.total
          });

          //this.totalCobro = totalCobro

          this.ordenesNomina=result['data'];
          this.formReadOnly = false

          let valid = true
          this.valorCuentas.map(
            (res) => {
              if (res.banco == this.cuenta.name_banks) {
                valid = false
              }
            }
          )

          if (valid) {
            this.valorCuentas.push({ banco: this.cuenta.name_banks, valor: 0 })
          }

          this.calcCobroTotal()
          // this.generaPreviewAsientoContable();
          // this.TotalizarAsiento();

        }else {
          this.lcargando.ctlSpinner(false);
          this.ordenesNomina=[];
          //this.toastr.info('No hay registros de dias trabajados para este periodo y mes');
          //this.lcargando.ctlSpinner(false);
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }

  }

  restar(deuda) {
    deuda.nuevo_saldo = +deuda.saldo - +deuda.cobro;
    //console.log(event);
    console.log(this.deudas)
    this.calcCobroTotal();

    this.titulosDisabled = false


  }

  calcCobroTotal() {
    let cobroTotal = 0;
    if(this.deudas.length > 0){
      this.deudas.forEach(e => {
        // if (e.aplica) {
        let cobro100 = +e.cobro * 100;
        cobroTotal += cobro100;
        // cobroTotal += +e.cobro; // en este caso es total porque sale de valor unitario * cantidad
        // }
      });
    }
    if(this.ordenesNomina.length > 0){
      this.ordenesNomina.forEach(e => {
        // if (e.aplica) {
        let cobro100 = +e.cobro * 100;
        cobroTotal += cobro100;
        // cobroTotal += +e.cobro; // en este caso es total porque sale de valor unitario * cantidad
        // }
      });
    }
    this.totalCobro = +cobroTotal / 100;


    this.valorCuentas.map(
      (data) => {
        let total = 0;
        if(this.deudas.length > 0){
          this.deudas.map(
            (res) => {
              if (res.cuenta == data.banco) {
                console.log(res.cuenta)
                total += parseFloat(res.cobro)
                console.log('val', total)
              }
            }
          )
          //console.log('valores Bancos',total)
          data.valor = total;
        }

        if(this.ordenesNomina.length > 0){
          this.ordenesNomina.map(
            (res) => {
              if (res.cuenta == data.banco) {
                console.log(res.cuenta)
                total += parseFloat(res.cobro)
                console.log('val', total)
              }
            }
          )
          //console.log('valores Bancos',total)
          data.valor = total;
        }
      })


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
    this.totalPago = pagoTotal;
    this.calcDifCobroPago();
    console.log(this.titulosDisabled)
  }

  calcDifCobroPago() {
    let saldocobro = 0;
    this.deudas.forEach(e => {
      saldocobro += +e.nuevo_saldo;
    });
    this.difCobroPago = saldocobro;
    if (this.difCobroPago < 0) {
      Swal.fire({
        icon: "warning",
        title: "Error ",
        text: "El valor a pagar no puede ser mayor que el saldo actual",
        showCloseButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8',
      });
    }
    this.generaPreviewAsientoContable()

  }

  removeTitulo(index) {
    this.deudas.splice(index, 1);
    this.generaPreviewAsientoContable()
    this.calcCobroTotal();
    //this.generaPreviewAsientoContable();
    //this.TotalizarAsiento();
    console.log(this.deudas)

    //this.titulosDisabled = true;
  }

  removeFormaPago(index) {
    this.pagos.splice(index, 1);

    if (this.pagos.length == 0) {
      this.vmButtons[0].habilitar = true;
    }
    this.calcPagoTotal();
  }

  agregaPagos() {
    let nuevo = {
      id_documento_forma_pago: 0,
      fk_documento: 0, // sera el id del documento que se cree primero la cabecera
      tipo_pago: this.formaPago,
      numero_documento: "",
      valor: 0,
      comentario: "",
    }
    this.pagos.push(nuevo);
    this.vmButtons[0].habilitar = false;
  }

  checkDeudas() {
    for (let i = 0; i < this.deudas.length; i++) {
      console.log(this.deudas[i].nuevo_saldo)
      if (
        this.deudas[i].nuevo_saldo < 0
      ) {
        return true;
      }
    }
    return false;
  }

  async validateEmision() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
      return;
    }
      this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea generar la emisión de pago ?", "SAVE_EMISION");
        }
      }).catch((err) => {
        console.log(err);
        this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
      });

  }
  validateDataGlobal() {

    let c = 0;
    let mensajes: string = '';
    return new Promise((resolve, reject) => {


      this.asiento.forEach(e => {
        let tipoDesembolso
        this.deudas.forEach(element => {
          if(element.id_orden_pago == e.fk_orden_pago){
            tipoDesembolso = element.tipo_desembolso
          }
        });
        Object.assign(e , { tipo_desembolso: tipoDesembolso })

      })


      if (this.documento.forma_pago == "" || this.documento.forma_pago == undefined) {
        mensajes += "* Debe seleccionar la forma de pago <br>"

      }
      if (this.cuenta == "" || this.cuenta == undefined) {
        mensajes += "* Debe seleccionar una cuenta <br>"
      }

      if (this.deudas.length == 0  && this.documento.tipo_pago == 'FACTURA') {
        mensajes += "* Debe agregar por lo menos una Orden de Pago<br>"
      }

      if (this.documento.observacion == "" || this.documento.observacion == undefined) {
        mensajes += "* Debe ingresar una observación para realizar el pago<br>"
      }

      if(this.documento.forma_pago == "NOTA DE DEBITO" && this.totalCobro != this.valorTotalMovimiento){
        mensajes += "* El valor a pagar es de $"
                          + this.commonService.formatNumberDos(this.totalCobro)
                          + " y el valor del Movimiento es de $"+ this.commonService.formatNumberDos(this.valorTotalMovimiento)
                          + " hay una diferencia de $" + (this.commonService.formatNumberDos(this.totalCobro - this.valorTotalMovimiento))+"<br>"

      }
      if (this.totalCobro <= 0) {
        mensajes += "* El valor del pago debe ser mayor a 0 <br>"
      }
      if(this.documento.forma_pago == "NOTA DE DEBITO") {
        let totalValorCobro= 0
        this.deudas.forEach(element => {
          totalValorCobro += +parseFloat(element.cobro)

        });

        if (totalValorCobro > this.valorTotalMovimiento) {
          mensajes += "* El valor total de las ordenes de pago no puede ser mayor a "+ this.commonService.formatNumberDos(this.valorTotalMovimiento)+"<br>"
        }

      }
      if (this.documento.forma_pago == "TRANSFERENCIA"){
        this.deudas.map(
          (e)=>{
            if(parseFloat(e.cobro) > parseFloat(e.saldo)){
              mensajes += "En la "+ e.documento +" el valor a pagar es de $ "
                + this.commonService.formatNumberDos(e.cobro) + " y el saldo actual es de $ "
                + this.commonService.formatNumberDos(e.saldo) + " la diferencia es de $ "
                + (this.commonService.formatNumberDos(e.cobro - e.saldo))+"<br>"
            }
          }
        )
      }


      this.deudas.map(
        (e: any, idx: number)=>{
          if(!e.tipo_desembolso){
            mensajes += `* Debe escoger el Tipo de desembolso para documento ${e.documento}  <br>`
          }
        }
      )

      return (mensajes.length) ? reject(mensajes) : resolve(true)

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
     // this.processing = false;
      if (result.value) {
        if (action == "SAVE_EMISION") {
          this.createRecDocumento();
        }
      }
    })
  }



  createRecDocumento() {




    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Está a punto de realizar un pago ¿Desea continuar?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        (this as any).mensajeSpinner = "Verificando período contable";
        this.lcargando.ctlSpinner(true);
        let data = {
          "anio": Number(moment(this.documento.fecha).format('YYYY')),
          "mes": Number(moment(this.documento.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
          if (res["data"][0].estado !== 'C') {

            (this as any).mensajeSpinner = 'Generando Documento de pago...';
            this.lcargando.ctlSpinner(true);
            // this.documento.estado = "E";
            // this.documento.cuenta = "";
            // this.documento.tipo_documento = this.concepto.codigo;
            // this.documento.fk_contribuyente = this.contribuyenteActive.id_cliente;
            this.documento.subtotal = this.totalCobro;
            this.documento.cuenta = this.cuenta.name_banks;
            this.documento.id_banco = this.cuenta.id_banks;
            this.documento.total = this.totalCobro;
            this.documento.detalles = [];
            this.documento.saldo = this.difCobroPago;

            this.documento.estado = "E";

            this.deudas.forEach(e => {
              this.documento.fk_orden_pago = e.id_orden_pago
            })

            let detailAsiento = this.asiento;
            let dataAsientoSave = {
              id_company: this.dataUser.id_empresa,
              doc_id: 0,
              // date: this.pipe.transform(this.documento.fecha, 'yyyy-MM-dd'),
              date: moment(this.documento.fecha).format('YYYY-MM-DD'),
              details: detailAsiento,
              total: this.totalCobro,
              tipo_registro: "Emisión de Pago"
            }
            this.documento.asiento= dataAsientoSave
            this.documento.detalles_asiento = detailAsiento

          if(this.deudas.length > 0){
            this.deudas.forEach(e => {

              if (e.aplica && e.cobro > 0) {
                if (this.documento.saldo == 0) {
                  let doc_det = {
                    id_pago_detalle: 0,
                    fk_pago: 0,
                    fk_proveedor:e.fk_proveedor,
                    proveedor:e.proveedor,
                    fk_orden_pago: e.id_orden_pago,
                    comentario: e.comentario,
                    valor: e.valor ?? e.total,
                    abono: e.cobro,
                    saldo_anterior: e.saldo,
                    saldo_actual: e.nuevo_saldo ?? 0,
                    fk_configcont: e.fk_configcont,
                    tipo_desembolso: e.tipo_desembolso,
                    cuenta: e.cuenta,
                    tipo: e.tipo


                  }
                  this.documento.detalles.push(doc_det);

                }
                else {
                  let doc_det = {
                    id_pago_detalle: 0,
                    fk_pago: 0,
                    fk_proveedor:e.fk_proveedor,
                    proveedor:e.proveedor,
                    fk_orden_pago: e.id_orden_pago,
                    comentario: e.comentario,
                    valor: e.valor ?? e.total,
                    abono: e.cobro,
                    saldo_anterior: e.saldo,
                    saldo_actual: e.nuevo_saldo ?? 0,
                    fk_configcont: e.fk_configcont,
                    tipo_desembolso: e.tipo_desembolso,
                    cuenta: e.cuenta,
                    tipo: e.tipo

                  }
                  this.documento.detalles.push(doc_det);

                }
              }
            });


          }

          if(this.ordenesNomina.length > 0){
            this.ordenesNomina.forEach(e => {
              if (e.cobro > 0) {
                if (this.documento.saldo == 0) {
                  let doc_det = {
                    id_pago_detalle: 0,
                    fk_pago: 0,
                    id_empleado:e.id_empleado,
                    empleado:e.datos_empleado?.emp_full_nombre,
                    fk_orden_pago: e.id_orden_pago,
                    comentario: e.comentario,
                    valor: e.valor ?? e.total,
                    abono: e.cobro,
                    saldo_anterior: e.saldo,
                    saldo_actual: e.nuevo_saldo ?? 0,
                    fk_configcont: e.fk_configcont,
                    tipo_desembolso: e.tipo_desembolso,
                    cuenta: e.cuenta,
                    tipo: e.tipo,
                    tipo_presupuesto: e.tipo_presupuesto,
                    tipo_afectacion: e.tipo_afectacion,
                    devengado: e.devengado,
                    cobrado_pagado: e.cobrado_pagado,


                  }
                  this.documento.detalles.push(doc_det);
                }

              }
            })
          }

            console.log(this.documento)
            // this.pagos.forEach(e => {
            //   if(e.valor > 0){
            //     this.documento.formas_pago.push(e);
            //   }
            // })
            let data2 = {
              documento: this.documento
            }
            console.log(data2);
            // return;
            // servicio que crea el documento, sus detalles, sus formas de pago asociadas
            // tambien cambia el saldo de la tabla deudas y el campo estado pasa a C en liquidacion y deudas si el nuevo saldo es 0
            this.apiSrv.setRecDocumento(data2).subscribe(
              (res) => {
                console.log(res);
                Swal.fire({
                  icon: "success",
                  title: "Documento de pago generado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                });
                this.formValid = true;
                this.documento = res['data'];
                this.formReadOnly = true;
                this.vmButtons[0].habilitar = true;
                this.vmButtons[2].habilitar = false;
                this.vmButtons[3].habilitar = false;
                this.vmButtons[5].habilitar = false;
                this.titulosDisabled = false;
                console.log(this.documento);
                // this.guardarDeuda(res['data'].id_liquidacion);
                this.lcargando.ctlSpinner(false);
              },
              (error) => {
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "error",
                  title: "Error al generar el documento de pago",
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





      }else{
        this.lcargando.ctlSpinner(true);
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
    this.formValid = false;
    this.formReadOnly = false;
    this.titulosDisabled = true;
    this.mostrarCuentas= true;
    this.mostrarMovimientos= false;
    this.contribuyenteActive = {
      razon_social: ""
    };
    this.nominaCheck= undefined;
    // this.conceptosList = [];
    this.cuenta = [];
    this.concepto = 0;
    this.totalCobro = 0;
    this.totalPago = 0;
    this.difCobroPago = 0;
    this.deudas = [];
    this.valorCuentas = [];
    this.fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
    this.verifyRestore = false;
    this.busqueda = false
    this.changeNomina = false;
    this.asiento = [];
    this.movimiento = [];
    this.totalAsiento = [];
    this.pagos = [];
    this.formaPago = 0;
    this.documento = {
      // id_documento: null,
      // tipo_documento: "", // concepto.codigo
      // fk_contribuyente: null, // contr id
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      observacion: "",
      estado: "P",
      subtotal: 0,
      saldo: 0,
      total: 0,
      forma_pago: "",
      detalles: [], // deudas
      tipo_pago:'',
      asiento: [],
      detalles_asiento: [],
      // formas_pago: [], // pagos
    }

     this.tabActiva = 'nav-ordenes'
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = false;
    this.vmButtons[5].habilitar = true;
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

  verificarFormaPago(){
    let msgInvalid = ''

    if (this.documento.forma_pago == "") {
      msgInvalid += '* No ha seleccionado una Forma de Pago.<br>'
    }

    if (msgInvalid.length > 0) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return
    }

    if(this.documento.forma_pago=='TRANSFERENCIA'){
      if(this.cuenta == undefined || this.cuenta == null || this.cuenta == ""){
        this.toastr.info('Debe seleccionar una cuenta');
      }else{
       // this.cuenta= this.cuenta
        this.expandModalTitulos();
      }
    }else if(this.documento.forma_pago=='NOTA DE DEBITO'){
      if(this.cuenta == undefined || this.cuenta == null || this.cuenta == ""){
        this.toastr.info('Debe seleccionar una cuenta');
      }else if(this.movimiento == undefined || this.movimiento == null || this.movimiento == ""){
        this.toastr.info('Debe seleccionar una movimiento bancario');
      }else{
        //this.cuenta= this.movimiento
        this.expandModalTitulos();
      }
    }
  }

  expandModalTitulos() {

      const modalInvoice = this.modalService.open(ModalLiquidacionesComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      // modalInvoice.componentInstance.id_concepto = this.concepto.id;
      modalInvoice.componentInstance.listaConceptos = this.conceptosList;
      modalInvoice.componentInstance.codigo = this.concepto.codigo;
      modalInvoice.componentInstance.fk_contribuyente = this.contribuyenteActive.id_cliente;
      modalInvoice.componentInstance.deudas = this.deudas;
      modalInvoice.componentInstance.titulosDisabled = this.titulosDisabled;
      modalInvoice.componentInstance.totalCobro = this.totalCobro;
      modalInvoice.componentInstance.cuenta = this.cuenta
      modalInvoice.componentInstance.formaPago =this.documento.forma_pago


      let valid = true
      this.valorCuentas.forEach(
        (res: any) => {
          if (res.banco == this.cuenta.name_banks) {
            valid = false
          }
        }
      )

      if (valid) {
        this.valorCuentas.push({ banco: this.cuenta.name_banks, valor: 0 ,cuenta_contable: '', name_cuenta:''})
      }




  }

  expandListDocumentosRec() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListDocumentosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }

  showHistorialComprobante(data?:any) {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(HistorialComprobanteComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
    modal.componentInstance.data = data;
  }

  // expandListContribuyentes() {
  //     const modalInvoice = this.modalService.open(ModalContribuyentesComponent,{
  //       size:"xl",
  //       backdrop: "static",
  //       windowClass: "viewer-content-general",
  //     });
  //     modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
  //     modalInvoice.componentInstance.permissions = this.permissions;
  //     modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
  //     modalInvoice.componentInstance.validacion = 8;
  // }

  cargarDesembolso() {

    this.apiSrv.listarDesembolso({}).subscribe((res: any) => {
      //console.log(res);
      res.map((data) => {
        this.listaDesembolso.push(data)
        console.log(this.listaDesembolso)

      })
    })
  }

  cargarCuentas() {

    this.apiSrv.listarCuentasBancos({}).subscribe((res: any) => {
      //console.log(res);
      res.map((data) => {
        this.listaCuentas.push(data)


      })
    })
  }
  // cambioMontoCobro(d){
  //   console.log(d)
  //   this.restar(d)
  //   this.generaPreviewAsientoContable();
  //  this.TotalizarAsiento();
  // }

  // generarAsientoCuenta(event){
  //     console.log(event);
  //     this.asiento.push({
  //       LoadOpcionCatalogoPresupuesto: false,
  //       presupuesto: '',
  //       codpresupuesto: 0,
  //       valor_presupuesto:0,
  //       account: event.cuenta_contable,
  //       name: event.name_cuenta,
  //       detail: "",
  //       credit:event.cobro,
  //       debit:parseFloat('0.00').toFixed(2),
  //       centro: 0,
  //       tipo: 'A',
  //       tipo_detalle: 'Pago'

  //     });
  // }

 // generaPreviewAsientoContable = async () => {
  generaPreviewAsientoContable(){
    try {
      console.log(this.deudas)

      let DetailCount = 0;
      if(this.documento.forma_pago == 'TRANSFERENCIA'){

        if(this.deudas.length > 0){
          let cuentas=[];
          this.asiento = [];
          console.log(this.valorCuentas)

          if(this.valorCuentas.length > 0){

            this.valorCuentas.map((element) => {
              this.asiento.push({
                LoadOpcionCatalogoPresupuesto: false,
                presupuesto: '',
                codpresupuesto: 0,
                valor_presupuesto:0,
                account: element.cuenta_contable,
                name: element.name_cuenta,
                detail: "",
                debit:parseFloat('0.00'),
                credit:parseFloat(element.valor),
                centro: 0,
                tipo: 'A',
                tipo_detalle: 'Pago',
                tipo_presupuesto: '',
                tipo_afectacion: '',
                devengado: parseFloat('0.00'),
                cobrado_pagado:parseFloat('0.00'),

              });
            });
          }


          this.deudas.forEach((element) => {
            if (element.detalles_cuentas.length > 0) {
              console.log(element.detalles_cuentas)
              element.detalles_cuentas.forEach((detalle: any) => {
                this.asiento.push({
                  LoadOpcionCatalogoPresupuesto: false,
                  presupuesto: detalle.codigo_partida != undefined ? detalle.codigo_presupuesto?.nombre : '',
                  codpresupuesto: detalle.codigo_partida,
                  valor_presupuesto:parseFloat(detalle.total) ,
                  account: detalle.cuenta_cxp,
                  name: detalle.nombre_cuenta_cxp,
                  detail: "",
                  debit:parseFloat(detalle.total) ,
                  credit:parseFloat('0.00'),  //elementDetail.valor,
                  centro: 0,
                  tipo: 'A',
                  tipo_detalle: 'Pago',
                  fk_orden_pago:detalle.fk_orden_pago,
                  tipo_desembolso: '',
                  tipo_presupuesto: detalle.codigo_partida != undefined ? 'GASTOS' : '',
                  tipo_afectacion: detalle.codigo_partida != undefined ? 'PAGADO' : '',
                  devengado:parseFloat('0.00'),
                  cobrado_pagado: parseFloat(detalle.total),
                  fecha: element.fecha
                })
              })
            }
            console.log(element.detalles)
            if(element.detalles.length > 0){
                  element.detalles.forEach(elementDetail => {
                    if (elementDetail.cuentas !== null) {
                    this.asiento.push({
                      LoadOpcionCatalogoPresupuesto: false,
                      presupuesto: '',
                      codpresupuesto: 0,
                      valor_presupuesto:0,
                      account: elementDetail.cuentas?.codigo,
                      name: elementDetail.cuentas?.nombre,
                      detail: "",
                      debit:parseFloat(element.cobro) ,
                      credit:parseFloat('0.00'),  //elementDetail.valor,
                      centro: 0,
                      tipo: 'A',
                      tipo_detalle: 'Pago',
                      fk_orden_pago:elementDetail.fk_orden_pago,
                      tipo_desembolso: '',
                      tipo_presupuesto: '',
                      tipo_afectacion: '',
                      devengado: '',
                      cobrado_pagado: '',
                      fecha: element.fecha

                    });
                    }

                  });
                  console.log(this.asiento)
            }

          DetailCount++
        });
        this.TotalizarAsiento();
        }

        if(this.ordenesNomina.length > 0){

          this.asiento.push({
            LoadOpcionCatalogoPresupuesto: false,
            presupuesto: '',
            codpresupuesto: 0,
            valor_presupuesto:0,
            account: this.cuenta.cuenta_contable,
            name: this.cuenta.name_cuenta,
            detail: "",
            credit:this.totalCobro,
            debit:parseFloat('0.00'),
            centro: 0,
            tipo: 'A',
            tipo_detalle: 'Pago',
            tipo_presupuesto: '',
            tipo_afectacion: '',
            devengado: '',
            cobrado_pagado: '',

          });

          console.log(this.ordenesNomina)
          let cuentas_contables=[];
          let codigos_presupuesto=[];
          this.ordenesNomina.forEach(e => {
            cuentas_contables.push(e.fk_cuenta_contable);
            codigos_presupuesto.push(e.codigo_presupuesto);
          })
          let cod ={ codigos:cuentas_contables}
          let codPre = {codigos_pre:codigos_presupuesto}

          let cuentas_filter
          let presupuestos_filter
            this.apiSrv.getAccountsByCodigo(cod).subscribe(res2 => {

              this.apiSrv.getPresupuestoByCodigo(codPre).subscribe(res3 => {

                this.ordenesNomina.map((element) => {
                console.log(res2['data'])
                  if(res2['data'].length > 0 ){
                    cuentas_filter =res2['data'].filter(d => d.codigo == element.fk_cuenta_contable)
                  }else{
                    cuentas_filter = undefined
                  }
                  if(res3['data'].length > 0 ){
                    presupuestos_filter =res3['data'].filter(d => d.codigo == element.codigo_presupuesto)
                  }else{
                    presupuestos_filter = undefined
                  }
                  console.log(cuentas_filter)

                  this.asiento.push({
                    LoadOpcionCatalogoPresupuesto: false,
                    presupuesto: presupuestos_filter != undefined ? presupuestos_filter[0].nombre : '',
                    codpresupuesto: element.codigo_presupuesto,
                    valor_presupuesto: element.codigo_presupuesto != undefined ? element.cobro : 0,
                    account: element.fk_cuenta_contable,
                    name: cuentas_filter != undefined ? cuentas_filter[0].nombre : '',
                    detail: "",
                    credit: parseFloat('0.00'),
                    debit:parseFloat(element.cobro),
                    centro: 0,
                    tipo: 'A',
                    tipo_detalle: 'Pago',
                    tipo_presupuesto:element.codigo_presupuesto != undefined ? 'GASTOS' : '',
                    tipo_afectacion:element.codigo_presupuesto != undefined ? 'PAGADO' : '',
                    devengado: parseFloat('0.00'),
                    cobrado_pagado: element.codigo_presupuesto != undefined ? parseFloat(element.cobro) : '',
                    });
                  DetailCount++

              });
              this.TotalizarAsiento();
            })
          })

        }

      }
      //   if(this.documento.forma_pago =='NOTA DE DEBITO'){
      //     console.log(this.movimientoFilter)
      //     this.asiento = []
      //     this.movimientoFilter.forEach(e => {
      //       this.asiento.push({
      //         LoadOpcionCatalogoPresupuesto: false,
      //         presupuesto: '',
      //         codpresupuesto: 0,
      //         valor_presupuesto:0,
      //         account: e.cuenta,
      //         name: e.name_cuenta,
      //         detail: "",
      //         credit:parseFloat('0.00').toFixed(2),
      //         debit:parseFloat(e.valor_deb),
      //         centro: 0,
      //         tipo: 'A',
      //         tipo_detalle: 'Pago',
      //         tipo_presupuesto: '',
      //         tipo_afectacion: '',
      //         devengado: '',
      //         cobrado_pagado: '',

      //       });

      //     //  this.totalCobro = e.valor;
      //     })

      //     if(this.deudas.length > 0){
      //       (this.deudas.map((element) => {
      //         if(element.detalles.length > 0){
      //               element.detalles.forEach(elementDetail => {
      //                 this.asiento.push({
      //                   LoadOpcionCatalogoPresupuesto: false,
      //                   presupuesto: '',
      //                   codpresupuesto: 0,
      //                   valor_presupuesto:0,
      //                   account: elementDetail.cuentas?.codigo,
      //                   name: elementDetail.cuentas?.nombre,
      //                   detail: "",
      //                   credit:parseFloat(element.cobro) ,
      //                   debit:parseFloat('0.00').toFixed(2),  //elementDetail.valor,
      //                   centro: 0,
      //                   tipo: 'A',
      //                   tipo_detalle: 'Pago',
      //                   fk_orden_pago:elementDetail.fk_orden_pago,
      //                   tipo_desembolso: '',
      //                   tipo_presupuesto: '',
      //                   tipo_afectacion: '',
      //                   devengado: '',
      //                   cobrado_pagado: '',

      //                 });

      //               });
      //               console.log(this.asiento)
      //         }

      //       DetailCount++

      //     }));
      //     }
      //     this.TotalizarAsiento();
      // }


    } catch (err) {
      console.log(err)
      //alert('Something went wrong, try again later!')
      //this.router.navigate(['/login']);
    }
  }

   TotalizarAsiento() {
    console.log(this.asiento)

   // if(this.asiento.length > 0){
        this.totalAsiento=[];
        // let TotalDebito = 0;
        // let TotalCredito = 0;
        // let TotalPresupuesto = 0;

        // this.asiento.map( elementAsiento => {
        //   TotalDebito = +TotalDebito + elementAsiento.debit * 100;
        //   TotalCredito = +TotalCredito + elementAsiento.credit * 100
        //   TotalPresupuesto = TotalPresupuesto + parseFloat(elementAsiento.valor_presupuesto);
        // });
        // console.log(TotalDebito)
        // console.log(TotalCredito)
        // this.totalDebito = TotalDebito / 100
        // this.totalCredito = TotalCredito / 100
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

        // // await Promise.all();
        // TotalDebito = this.asiento.reduce((acc: number, curr) => {
        //   console.log(curr.debit)
        //   return acc + parseFloat(curr.debit)
        // }, 0)
        // TotalCredito = this.asiento.reduce((acc: number, curr) => {
        //  return acc + parseFloat(curr.credit)
        // }, 0)
        // TotalPresupuesto = this.asiento.reduce((acc: number, curr) => {
        //   return acc + parseFloat(curr.valor_presupuesto)
        // }, 0)

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
    //   this.totalAsiento=[];
    // }

  }

  editarComprobante() {

    (this as any).mensajeSpinner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);
    let data = {
      "anio": Number(moment(this.documento.fecha).format('YYYY')),
      "mes": Number(moment(this.documento.fecha).format('MM')),
    }
      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

      /* Validamos si el periodo se encuentra aperturado */
      if (res["data"][0].estado !== 'C') {
        (this as any).mensajeSpinner = "Editando Emisión de Pago";
        this.lcargando.ctlSpinner(true);

        this.disabledComprobante = false
        let data2 = {

          comprobante_egreso: this.documento.comprobante_egreso
        }
        console.log(data2)
        this.apiSrv.updatePago(data2, this.id).subscribe(
          (res) => {
            console.log(res)
            if (res["status"] == 1) {
              this.lcargando.ctlSpinner(false);
              console.log(res);
              Swal.fire({
                icon: "success",
                title: "Actualización de comprobante de egreso con éxito",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  console.log("hola")
                  this.disabledComprobante = true

                }
              });
            }
            else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
            }

          },
          (error) => {
            console.log(error)
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

  sumarBancos() {
    // this.valorCuentas.push(this.cuenta)
    console.log(this.valorCuentas)
  }

  expandirModalMovimiento(){
    if(this.cuenta == undefined || this.cuenta == null || this.cuenta == ""){
      this.toastr.info('Debe seleccionar una cuenta');
    }else{
      const modal = this.modalService.open(MovimientosBancariosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
      modal.componentInstance.cuenta = this.cuenta
    }

  }
  removeActivosFinancieros(index){
    this.movimiento.splice(index,1);
  }

  anularPago() {

    let msgInvalid = ''


    if (this.documento.motivo_anulacion == "" || this.documento.motivo_anulacion == undefined) msgInvalid += 'Debe seleccionar un motivo de anulación.<br>';

    if (msgInvalid.length > 0) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return
    }

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea anular este pago?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        (this as any).mensajeSpinner = "Verificando período contable";
        this.lcargando.ctlSpinner(true);
        let data = {
          "anio": Number(moment(this.documento.fecha).format('YYYY')),
          "mes": Number(moment(this.documento.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
          if (res["data"][0].estado !== 'C') {

            (this as any).mensajeSpinner = 'Anulando pago...';
            this.lcargando.ctlSpinner(true);
            let data2 = {
              documento: this.documento
            }
            console.log(this.documento);
            this.apiSrv.anularPago(data2).subscribe(
              (res) => {
                this.lcargando.ctlSpinner(false);
                console.log(res);

                this.documento = res['data'];
                // this.documento.fecha = res['data'].fecha.split(' ')[0];
                this.formReadOnly = true;
                this.disabledAnular = true;
                this.vmButtons[0].habilitar = true;
                this.vmButtons[4].habilitar = true;
                this.vmButtons[6].habilitar = true;
                console.log(this.documento);
                // this.guardarDeuda(res['data'].id_liquidacion);

                Swal.fire({
                  icon: "success",
                  title: "Pago anulado exitosamente",
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

  anulacionSelected(event){
    console.log(this.anular)
    console.log(event.target.checked)
    if(event.target.checked){
      if(this.documento.estado=='X'){
        this.vmButtons[6].habilitar = true;
      }else{
        this.vmButtons[6].habilitar = false;
      }

    }else{
      this.vmButtons[6].habilitar = true;
    }

  }


}
