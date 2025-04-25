import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ConvenioArrienteTService } from './convenio-arriente-t.service';
import * as myVarGlobals from 'src/app/global';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { environment } from 'src/environments/environment';
import { ModalCompraTerrenosComponent } from './modal-compra-terrenos/modal-compra-terrenos.component';
@Component({
  selector: 'app-convenio-arriente-t',
  templateUrl: './convenio-arriente-t.component.html',
  styleUrls: ['./convenio-arriente-t.component.scss']
})
export class ConvenioArrienteTComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle: string = 'Convenio por Compra de Terreno'
  validaciones = new ValidacionesFactory

  liquidacion = {
    id: null,
    at_tipo: "",
    at_contrato: undefined,
    documento: "",
    //periodo: "",
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    fk_contribuyente: null,
    fk_concepto: 54,
    fk_lote: null,
    observacion: "",
    subtotal: 0,
    exoneraciones: 0,
    estado: "P",
    total: 0,
    cuota_inicial: 0,
    porcentaje: 0,
    num_cuotas: 0,
    detalles: [],
    cuotas: [], // cuotas que se guardaran como detalles con liq y deudas
    fk_caja: 0, // caja activa al momento de cobrar
    concepto: { codigo: 'AR' }
  };
  firstday: any;
  today: any;
  fecha_hasta: any


  arriendoTerreno = {
    tipo_documento: 'COTE',
    fk_contribuyente: null,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    observacion: null,
    estado: 'E',
    subtotal: null,
    total: null,
    id_usuario: null,
    fk_documento_2: null,
    documento_2: null,
    fk_caja: null,
    cuota_inicial: null,
    porcentaje: null,
    num_cuotas: null,
    at_tipo: null,
    at_contrato: null,
    documento: null,
    cuotas: []
  }
  fileListEM: FileList;
  dateEM: any
  valiEM = false


  newDocument = {
    tipo_documento: 'COTE',
    fk_contribuyente: null,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    observacion: null,
    estado: 'E',
    subtotal: null,
    total: null,
    id_usuario: null,
    fk_documento_2: null,
    documento_2: null,
    fk_caja: null,
    cuota_inicial: null,
    porcentaje: null,
    num_cuotas: null,
    at_tipo: null,
    at_contrato: null,
    documento: null,
    cuotas: []
  }

  propiedades: any = [];

  contribuyenteActive: any = {};
  compraTerrenoActive: any = {}

  propiedadActive: any = 0;

  conceptosDisabled: boolean;
  exoneracionDisabled: boolean;
  formReadOnly: boolean

  baseImponible: any;
  porcentaje: any;
  conceptos: any = [];

  exoneraciones: any = [];

  msgSpinner: string;
  mensajeSppiner: string
  dataUser: any;
  permissions: any;
  vmButtons = [];
  verifyRestore = false;
  codCastDisabled = true;
  observacionesDisabled = true;
  conceptosBackup: any = [];
  detallLiquidacion = {
    comentario: '',
    cobro: ''
  }

  amortizacion: any = {
    cuota_inicial: 0,
    num_cuotas: 0,
    interes: 0,
    monto_amortizar: 0,
  }

  amortizaciones: any = [];
  totalCobro: any = 0;

  totalIntereses = 0;
  totalPagoMensual = 0;
  totalPagoTotal = 0;
  titulosDisabled = true;

  empresLogo: any;

  // documento: any = {
  //   id_documento: null,
  //   tipo_documento: "", // concepto.codigo
  //   fk_contribuyente: null, // contr id
  //   fecha: moment(new Date()).format('YYYY-MM-DD'),
  //   observacion: "",
  //   estado: "P",
  //   subtotal: 0,
  //   total: 0,
  //   cuota_inicial: 0,
  //   porcentaje: 0,
  //   num_cuotas: 0,
  //   detalles: [], // deudas
  //   formas_pago: [], // pagos
  //   cuotas: [], // cuotas que se guardaran como detalles con liq y deudas
  //   fk_caja: 0, // caja activa al momento de cobrar
  // }

  constructor(
    public commonService: CommonService,
    // private commonServices: CommonService,
    private commonVarService: CommonVarService,
    //private apiService: ContratoService,
    private serArrt: ConvenioArrienteTService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.serArrt.selectCompraTerreno$.subscribe(
      (documento: any) => {
        console.log(documento)
        this.compraTerrenoActive = documento
        this.propiedadActive = documento.lote
        this.selectPropiedad(documento.lote)
        this.baseImponible = documento.total
      }
    )
    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(
      res => {

        if(res['valid'] == 120){
          console.log(res);
          this.msgSpinner = 'Cargando Propiedades...';
          this.lcargando.ctlSpinner(true);
          this.selectContibuyente(res);
          this.conceptos.fk_contribuyente = res;
          this.titulosDisabled = false;
        }
        
      }
    );

    this.commonVarService.diableCargarDis.asObservable().subscribe(
      (res) => {
        if (res.custom1 == 'EM') {
          this.valiEM = true
        }

      }
    )
    this.commonVarService.selectAnexo.asObservable().subscribe(
      (res) => {
        if (res.custom1 == 'EM') {
          console.log(res);
          this.dateEM = res.custom2
        }
      }
    )

    this.commonVarService.selectRecDocumento.asObservable().subscribe(
      (res) => {

        this.msgSpinner = 'Cargando convenio...';
        this.lcargando.ctlSpinner(true);

        this.formReadOnly = true;
        console.log(res);
        // this.concepto = res.concepto; // ya no se maneja eligiendo concepto se puede eliminar
        this.contribuyenteActive = res.contribuyente;
        this.arriendoTerreno = res;
        this.newDocument = res['id_documento'];
        this.arriendoTerreno.fecha = res.fecha.split(" ")[0];

        res.detalles.forEach(e => {

         // if (e.codigo_concepto == "CUTE") { // si es cuota va a amortizacion

            let amort = {
              num: e.num_cuota,
              pago_total: e.valor,
              pago_mensual: e.abono,
              interes: 0, //por ahora hasta que se involucre interes
              saldo_inicial: e.saldo_anterior,
              saldo_final: e.saldo_actual,
              plazo_maximo: e.fecha_plazo_maximo
            }

            this.amortizaciones.push(amort);

          //}

        })

        this.totalCobro = res.total;
        // this.totalPago = res.total;

        // LLENADO DE CAMPOS EXTRA DE AMORTIZACION
        this.amortizacion = {
          cuota_inicial: res.cuota_inicial,
          num_cuotas: res.num_cuotas,
          interes: 0, //por ahora hasta que tenga valor
          monto_amortizar: +res.total - +res.cuota_inicial,
        }

        this.amortizaciones.forEach(e => {
          // intereses aun no porque esta en 0
          this.totalPagoMensual += +e.pago_mensual;
          this.totalPagoTotal += +e.pago_total;
        })


        this.serArrt.getLote({ id: res.fk_documento_2 }).subscribe(
          (res1) => {
            console.log(res1);
            this.propiedadActive = res1['data'][0]
            this.getConceptos(); this.propiedades = res1['data']
            this.propiedades.push(res1);
            console.log(this.propiedades);
            this.codCastDisabled = false;
            this.lcargando.ctlSpinner(false);
            // this.selectContibuyente(res['contribuyente']);


          }
        )

        // res.formas_pago.forEach(e => {
        //   this.pagos.push(e);
        // });



        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
      }
    )

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
        habilitar: false,
      },
      {
        orig: "btnsRenLiq",
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
        orig: "btnsRenLiq",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,

      },
      {
        orig: "btnsRenLiq",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true,
      }
    ]

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.validaPermisos();
      this.getConceptos();
      //this.calcSubtotal();
      //this.getArriendoTerrenoTabla();
    }, 50);
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.validacionArriendoT();
        break;
      case "BUSCAR":
        this.expandListDocumentosRec();
        break;
      case "IMPRIMIR":
        this.printConvenio();
        break;
      case "LIMPIAR":
        this.confirmRestore();
        break;
      default:
        break;
    }
  }


  async validacionArriendoT() {
    let arriendo = await this.validacionesTerreno().then(
      (res) => {
        if (res) {
          this.guardarTerreno()
        }
      }
    )
  }

  cargaArchivo2(archivos, custom1) {
    let fileList: FileList

    if (archivos.length > 0) {
      fileList = archivos
      if (custom1 == 'EM') {
        this.fileListEM = fileList

        setTimeout(() => {
          this.toastr.info('Ha seleccionado ' + fileList.length + ' archivo(s).', 'Anexos de trámite')
        }, 50)
        // console.log(this.fileList)
      }


    }
  }

  uploadFile(custom1) {
    console.log('Presionado una vez');
    let date: any = null;


    if (custom1 == 'EM') {
      this.today = new Date();
      this.fecha_hasta = moment(this.today).format('YYYY-MM-DD');
      date = this.fecha_hasta
    }


    let data = {
      // Informacion para almacenamiento de anexo
      module: 20,
      component: myVarGlobals.fContratacion,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: 50,
      custom1: custom1,
      custom2: date,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fContratacion,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Nuevo anexo para Ticket ${this.arriendoTerreno['id_documento']}`,
      ip: this.commonService.getIpAddress()
    }

    let fileList: FileList
    if (custom1 == 'EM') {
      fileList = this.fileListEM
    }



    for (let i = 0; i < fileList.length; i++) {
      console.log('File', data);
      this.UploadService(fileList[i], data, null);
    }
    if (custom1 == 'EM') {
      this.fileListEM = undefined
    }

    this.lcargando.ctlSpinner(false)

  }

  UploadService(file, payload?: any, custom1?: any): void {
    let cont = 0
    console.log('Se ejecuto con:', payload);
    this.serArrt.uploadAnexo(file, payload).toPromise().then(res => {
      console.log('aqui', res);
    }).then(res => {
      this.commonVarService.contribAnexoLoad.next({ id_cliente: this.arriendoTerreno['id_documento'], condi: 'dis', custom1: custom1 })
      setTimeout(() => {
        this.toastr.info('Carga exitosa', 'Anexos de trámite')
      }, 50)
    })
  }


  validacionesTerreno() {
    let flag = false;
    return new Promise((resolve, rej) => {
      if (
        this.contribuyenteActive.razon_social == undefined
      ) {
        this.toastr.info("El campo Contribuyente no puede ser vacío");
        flag = true;
      } else if (
        this.propiedadActive == 0 ||
        this.propiedadActive == undefined
      ) {
        this.toastr.info("El campo Propiedad no puede ser vacío");
        flag = true;
      } else if (
        this.totalCobro == undefined ||
        this.totalCobro == 0
      ) {
        this.toastr.info("El campo Cobro no puede ser vacío");
        flag = true;
      } else if (
        this.amortizacion.cuota_inicial == undefined ||
        this.amortizacion.cuota_inicial == 0
      ) {
        this.toastr.info("El campo Cuota inicial no puede ser vacío");
        flag = true;
      } else if (
        this.amortizacion.num_cuotas == undefined ||
        this.amortizacion.num_cuotas == 0
      ) {
        this.toastr.info("El campo No. cuotas inicial no puede ser vacío");
        flag = true;
      } else if (
        this.amortizaciones.length == 0
      ) {
        this.toastr.info("Los campos del calculo de amortizacion no puede ser vacío");
        flag = true;
      }
      /* else if (
        this.arriendoTerreno.at_tipo == '' ||
        this.arriendoTerreno.at_tipo == null
      ) {
        this.toastr.info("El campo Tipo no puede ser vacío");
        flag = true;
      }  else if (
        this.arriendoTerreno.at_contrato == '' ||
        this.arriendoTerreno.at_contrato == null
      ) {
        this.toastr.info("El campo Numero de contrato no puede ser vacío");
        flag = true;
      } */

      !flag ? resolve(true) : resolve(false);
    })
  }



  guardarTerreno() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Está a punto de emitir una nueva liquidación. ¿Desea continuar?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.msgSpinner = 'Generando convenio...';
        this.lcargando.ctlSpinner(true);
        this.arriendoTerreno.fk_contribuyente = this.contribuyenteActive.id_cliente;
        this.arriendoTerreno['cant_convenios'] = this.contribuyenteActive.cant_convenios 
        this.arriendoTerreno.subtotal = this.totalCobro;
        this.arriendoTerreno.total = this.totalCobro;
        this.arriendoTerreno.cuota_inicial = this.amortizacion.cuota_inicial;
        this.arriendoTerreno.porcentaje = (+this.amortizacion.cuota_inicial / +this.totalCobro * 100);
        this.arriendoTerreno.num_cuotas = this.amortizacion.num_cuotas;
        // console.log(this.liquidacion);

        this.amortizaciones.forEach(e => {
          if (e.pago_mensual > 0 && e.pago_total > 0) {


            let cuota = {
              num_cuota: e.num,
              valor: e.pago_total,
              abono: e.pago_mensual,
              saldo_anterior: e.saldo_inicial,
              saldo_actual: e.saldo_final,
              fecha_plazo_maximo: e.plazo_maximo
            }

            this.arriendoTerreno.cuotas.push(cuota);
          }
        })

        let data = {
          documento: this.arriendoTerreno,
          compra: this.compraTerrenoActive,
        }



        this.serArrt.createRecDocumentosArriendoTerreno(data).subscribe(
          (res) => {
            console.log(res);
            this.newDocument = res['data']['id_documento']
            this.arriendoTerreno.documento = res['data']['documento']
            this.lcargando.ctlSpinner(false);

            // this.restoreForm(false, false);
            Swal.fire({
              icon: "success",
              // title: "¡Atención!",
              titleText: "Operacion realizada con éxito",
              showCloseButton: true,
              cancelButtonText: "Cancelar",
              confirmButtonText: "Aceptar",
              cancelButtonColor: '#F86C6B',
              confirmButtonColor: '#4DBD74',
            })
            // this.vmButtons[0].habilitar = true;
            // this.vmButtons[1].habilitar = false;
            // this.vmButtons[2].habilitar = false;
          },
          (erro) => {
            console.log(erro);
          }
        )


        console.log(this.arriendoTerreno);
      }
    })
  }



  selectPropiedad(event) {
    // console.log(event);
    //this.propiedadSelected = c;
    //console.log(this.propiedadActive);
    this.arriendoTerreno.fk_documento_2 = event.id
    this.getConceptos();
    this.verifyRestore = true;
    // this.restoreForm(true, true);
    this.conceptosDisabled = false;
    this.exoneracionDisabled = false;
    // this.calculateExoneraciones();
  }

  async confirmRestore() {
    const result = await Swal.fire({
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
    })

    if (result.isConfirmed) {
      Object.assign(this.arriendoTerreno, {fecha: moment().format('YYYY-MM-DD')})
      this.restoreForm(false, false)
    }
  }

  selectContibuyente(contr) {
    this.restoreForm(false, false);
    this.contribuyenteActive = contr;
    this.contribuyenteActive['cant_convenios'] += 1
    this.liquidacion.fk_contribuyente = contr.id_cliente;
    this.observacionesDisabled = false;
    this.vmButtons[3].habilitar = false;
    //console.log(this.liquidacion);
    let id = contr.id_cliente;
    //console.log(id);
    this.serArrt.getPropiedades(id).subscribe(
      (res) => {
        //console.log(res);
        if (res['data'].length > 0) {
          this.propiedades = res['data']
          this.propiedades.push(res);
          console.log(this.propiedades);
          this.codCastDisabled = false;
          this.lcargando.ctlSpinner(false);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Error cargando Propiedades",
            text: "El contribuyente seleccionado no presenta propiedades registradas a su nombre. Por favor seleccione otro contribuyente.",
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
          });
          this.lcargando.ctlSpinner(false);
        }
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error cargando Propiedades')
      }
    );
  }

  expandListDocumentosRec() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListRecDocumentosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
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

  getConceptos() {
    let data = {
      id_concepto: 54
    }
    let salario = 425.00
    let limiteArea = 250.00
    let excedente = this.propiedadActive.area - limiteArea;
    let valorExcedente = 0.20
    let valorArea = 3.00
    let valorSalario = 425.00
    let limiteRbu = 25
    let valorRbuMenor = 2.00
    let valorRbuMayor = 5.00
    // this.baseImponible = this.propiedadActive.area * this.propiedadActive.valor_metro_cuadrado;

    this.serArrt.getArriendoTerrenoTabla({}).subscribe(
      (res) => {
        let porcentaje = 0;
        let arriendoTabla = res['data'];
        let cant = parseFloat(this.baseImponible);

        arriendoTabla.forEach(t => {
          if (t.rango_hasta > 0) {
            // cuando esta en un rango de valores normal
            if (cant >= t.rango_desde && cant <= t.rango_hasta) {
              porcentaje = t.porcentaje;
            }
          } else if (t.rango_hasta == 0) {
            // cuando el rango hasta es infinito
            if (cant >= t.rango_desde) {
              porcentaje = t.porcentaje;
            }
          }
        });
        this.porcentaje = porcentaje;
        //  console.log('porcentaje'+this.porcentaje);
      });

    this.serArrt.getConceptoDetalle(data).subscribe(
      (res) => {
        let calculo = 0;
        res['data'].forEach(e => {
          //console.log('codigo '+e.codigo_detalle);
          if (this.propiedadActive != 0) {

            if (e.codigo_detalle == "ARRI") {
              //this.getArriendoTerrenoTabla(this.baseImponible);
              Object.assign(e, { valor: this.porcentaje * this.baseImponible / 100, comentario: e.comentario, fk_concepto_detalle: e.id_concepto_detalle });
              calculo += +e.valor
            } else if (e.codigo_detalle == "DETI") {
              Object.assign(e, { valor: this.propiedadActive.avaluo * 1 / 1000, comentario: e.comentario, fk_concepto_detalle: e.id_concepto_detalle });
              calculo += +e.valor
            }
            else if (e.codigo_detalle == "DEME") {
              if (this.propiedadActive.area != 0 && this.propiedadActive.area <= limiteArea) {
                Object.assign(e, { valor: valorArea, comentario: e.comentario, fk_concepto_detalle: e.id_concepto_detalle });
                calculo += +e.valor
              } else if (this.propiedadActive.area > limiteArea) {

                Object.assign(e, { valor: excedente * valorExcedente + valorArea, comentario: e.comentario, fk_concepto_detalle: e.id_concepto_detalle });
                calculo += +e.valor
              } else {
                Object.assign(e, { valor: 0, comentario: e.comentario, fk_concepto_detalle: e.id_concepto_detalle });
                calculo += +e.valor
              }
            }
            else if (e.codigo_detalle == "ASEO") {
              Object.assign(e, { valor: 0, comentario: e.comentario, fk_concepto_detalle: e.id_concepto_detalle });
              calculo += +e.valor
            }
            else if (e.codigo_detalle == "STAA") {
              if (this.propiedadActive.avaluo != 0 && this.propiedadActive.avaluo < valorSalario * limiteRbu) {

                Object.assign(e, { valor: valorRbuMenor, comentario: e.comentario, fk_concepto_detalle: e.id_concepto_detalle });
                calculo += +e.valor
              } else if (this.propiedadActive.avaluo != 0 && this.propiedadActive.avaluo > valorSalario * limiteRbu) {

                Object.assign(e, { valor: valorRbuMayor, comentario: e.comentario, fk_concepto_detalle: e.id_concepto_detalle });
                calculo += +e.valor
              } else {

                Object.assign(e, { valor: 0, comentario: e.comentario, fk_concepto_detalle: e.id_concepto_detalle });
                calculo += +e.valor
              }
            }
            else {
              Object.assign(e, { valor: 0, comentario: e.comentario, fk_concepto_detalle: e.id_concepto_detalle });
              calculo += +e.valor
            }
          }
        })

        this.conceptos = JSON.parse(JSON.stringify(res['data']));
        this.liquidacion.subtotal = calculo;
        this.calcExonerTotal();
        //this.calcTotal();
        //this.calcSubtotal();
        // console.log('CONCEPTOS '+this.conceptos);
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error cargando Conceptos');
      }
    );
  }


  detAmortizacion() {
    console.log(this.amortizacion.cuota_inicial, '>=', this.totalCobro);
    console.log(typeof this.amortizacion.cuota_inicial);
    const cuota_inicial_minima = Math.round(20 * +this.totalCobro) / 100
    if (this.amortizacion.cuota_inicial < cuota_inicial_minima) {
      this.toastr.info(`La cuota inicial debe ser de al menos $${cuota_inicial_minima}`);
      return;
    } else if (parseFloat(this.amortizacion.cuota_inicial) >= parseFloat(this.totalCobro)) {

      this.toastr.info("La cuota inicial no puede ser mayor o igual al monto total a pagar");
      return;
    } else if (this.amortizacion.num_cuotas > 24 || this.amortizacion.num_cuotas <= 0) {
      this.toastr.info("El No. de cuotas debe ser de 1 a 24");
      return;
    } else if (this.amortizacion.interes > 100) {
      this.toastr.info("El interés no puede ser mayor a 100");
      return;
    }


    this.amortizaciones = [];

    this.amortizacion.monto_amortizar = +this.totalCobro - +this.amortizacion.cuota_inicial;
    let pago_mensual = +this.amortizacion.monto_amortizar / +this.amortizacion.num_cuotas;

    let inicial_anterior = 0;

    const fecha_documento = this.arriendoTerreno.fecha.split('-')
    let hoy = new Date(parseInt(fecha_documento[0]), parseInt(fecha_documento[1]) - 1, parseInt(fecha_documento[2]));
    let mes = hoy.getMonth();
    let anio = hoy.getFullYear();

    for (let i = 0; i < this.amortizacion.num_cuotas; i++) {


      if (i == 0) {
        let saldo_inicial = +this.amortizacion.monto_amortizar;
        let interes = (+saldo_inicial * +this.amortizacion.interes) / 100;
        let pago_total = +interes + +pago_mensual;
        let saldo_final = +saldo_inicial - +pago_mensual;
        inicial_anterior = +saldo_final;

        let fecha = new Date();

        if (mes == 11) {
          mes = 0;
          anio += 1;
        } else {
          mes += 1;
        }

        fecha.setMonth(mes);
        fecha.setFullYear(anio);

        let amort = {
          num: i + 1,
          saldo_inicial: saldo_inicial,
          interes: interes,
          pago_mensual: pago_mensual,
          pago_total: pago_total,
          saldo_final: saldo_final,
          plazo_maximo: moment(fecha).format('YYYY-MM-DD')
        }

        this.amortizaciones.push(amort);

      } else {
        let saldo_inicial = +inicial_anterior;
        let interes = (+saldo_inicial * +this.amortizacion.interes) / 100;
        let pago_total = +interes + +pago_mensual;
        let saldo_final = +saldo_inicial - +pago_mensual;
        inicial_anterior = +saldo_final;

        let fecha = new Date();

        if (mes == 11) {
          mes = 0;
          anio += 1;
        } else {
          mes += 1;
        }

        fecha.setMonth(mes);
        fecha.setFullYear(anio);

        let amort = {
          num: i + 1,
          saldo_inicial: saldo_inicial,
          interes: interes,
          pago_mensual: pago_mensual,
          pago_total: pago_total,
          saldo_final: saldo_final,
          plazo_maximo: moment(fecha).format('YYYY-MM-DD')
        }

        this.amortizaciones.push(amort);

        if (i == this.amortizacion.num_cuotas - 1) {
          this.calcAmortizaciones()
        }
      }


    }
    let cuota_inicial = {
      id_documento_detalle: 0,
      num: 0,
      saldo_inicial: this.totalCobro,
      interes: 0,
      pago_mensual: this.amortizacion.cuota_inicial,
      pago_total: this.amortizacion.cuota_inicial,
      saldo_final: this.totalCobro - this.amortizacion.cuota_inicial,
      plazo_maximo: this.arriendoTerreno.fecha,
      estado: "P"
    }
    this.amortizaciones.unshift(cuota_inicial);

    this.vmButtons[0].habilitar = false;

  }

  restar() {
    this.totalCobro = this.detallLiquidacion.cobro
  }

  calcAmortizaciones() {

    this.totalIntereses = 0;
    this.totalPagoMensual = 0;
    this.totalPagoTotal = 0;

    this.amortizaciones.forEach(e => {
      this.totalIntereses += +e.interes;
      this.totalPagoMensual += +e.pago_mensual;
      this.totalPagoTotal += +e.pago_total;
    })
    this.totalPagoMensual =  this.totalPagoMensual + this.amortizacion.cuota_inicial
    this.totalPagoTotal =  this.totalPagoTotal + this.amortizacion.cuota_inicial
  }

  // restar(deuda) {
  //   deuda.nuevo_saldo = +deuda.saldo - +deuda.cobro;
  //   this.calcCobroTotal();
  // }

  // calcCobroTotal() {
  //   let cobroTotal = 0;
  //   this.deudas.forEach(e => {
  //     // if (e.aplica) {
  //       cobroTotal += +e.cobro; // en este caso es total porque sale de valor unitario * cantidad
  //     // }
  //   });
  //   this.totalCobro = cobroTotal;
  //   // this.calcSaldoRestanteTotal();
  //   this.calcDifCobroPago();
  // }

  calcExonerTotal() {
    let calculo = 0;
    this.exoneraciones.forEach(e => {
      e.valor = this.conceptos.find(c => e.cod_concepto_det_aplicable == c.codigo_detalle).valor * e.porcentaje;
      calculo += +e.valor
    });
    this.liquidacion.exoneraciones = calculo;
    this.calcTotal();
  }

  calcTotal() {

    let preTotal = this.liquidacion.subtotal - this.liquidacion.exoneraciones;
    if (preTotal > 0) {
      this.liquidacion.total = preTotal;
    } else {
      this.liquidacion.total = 0;
    }
    this.vmButtons[0].habilitar = false;
  }

  expandContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenArriendoTerrenos;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.validacion = 120;
  }


  restoreForm(keepContr, softRestore) {
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.formReadOnly = false;
    this.conceptosDisabled = true;
    this.exoneracionDisabled = true;
    this.titulosDisabled = true;
    this.totalCobro = 0;
    this.compraTerrenoActive.documento = ''
    this.detallLiquidacion = {
      comentario: '',
      cobro: ''
    }
    Object.assign(this.arriendoTerreno, {
      tipo_documento: 'COTE',
      fk_contribuyente: null,
      // fecha: moment(new Date()).format('YYYY-MM-DD'),
      observacion: null,
      estado: 'E',
      subtotal: null,
      total: null,
      id_usuario: null,
      fk_documento_2: null,
      documento_2: null,
      fk_caja: null,
      cuota_inicial: null,
      porcentaje: null,
      num_cuotas: null,
      // at_tipo: null,
      // at_contrato: null,
      documento: null,
      cuotas: []
    })
  

    // Cambiado a Object.assign()
    /* this.arriendoTerreno = {
      tipo_documento: 'COTE',
      fk_contribuyente: null,
      // fecha: moment(new Date()).format('YYYY-MM-DD'),
      observacion: null,
      estado: 'E',
      subtotal: null,
      total: null,
      id_usuario: null,
      fk_documento_2: null,
      documento_2: null,
      fk_caja: null,
      cuota_inicial: null,
      porcentaje: null,
      num_cuotas: null,
      at_tipo: null,
      at_contrato: null,
      documento: null,
      cuotas: []
    } */
    this.amortizaciones = []
    this.amortizacion = {
      cuota_inicial: 0,
      num_cuotas: 0,
      interes: 0,
      monto_amortizar: 0,
    }
    this.liquidacion = {
      id: null,
      at_tipo: "",
      at_contrato: undefined,
      documento: "",
      //periodo: "",
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      fk_contribuyente: null,
      fk_concepto: 54,
      fk_lote: null,
      observacion: "",
      subtotal: 0,
      exoneraciones: 0,
      estado: "P",
      total: 0,
      cuota_inicial: 0,
      porcentaje: 0,
      num_cuotas: 0,
      detalles: [],
      cuotas: [], // cuotas que se guardaran como detalles con liq y deudas
      fk_caja: 0, // caja activa al momento de cobrar
      concepto: { codigo: 'AR' }
    };
    this.baseImponible = undefined
    this.conceptosBackup = [];
    this.conceptos.forEach(e => {
      e.comentario = "";
      e.valor = 0;
      // console.log(this.conceptos);
    });
    // this.exoneracionesBackup = [];
    this.exoneraciones = [];
    if (keepContr && Object.keys(this.contribuyenteActive).length > 0) {
      this.liquidacion.fk_contribuyente = this.contribuyenteActive.id_cliente
    } else {
      this.contribuyenteActive = {};
      this.codCastDisabled = true;
      this.observacionesDisabled = true;
      this.vmButtons[3].habilitar = true;
    }
    if (!softRestore) {
      this.verifyRestore = false;
      this.propiedades = [];
      this.propiedadActive = {};
    }
  }

  validaPermisos = () => {
    this.msgSpinner = 'Cargando Permisos de Usuario...'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))
    this.empresLogo = this.dataUser.logoEmpresa

    let params = {
      codigo: myVarGlobals.fConConvenioTerreno,
      id_rol: this.dataUser.id_rol,
    };
    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        //console.log(this.permissions);
        if (this.permissions.abrir == "0") {
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.");
        } else {
          this.getConceptos();
        }
      },
      err => {
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  printConvenio() {
    console.log(this.newDocument)
    //window.open(environment.ReportingUrl + "rpt_notifiacion_convenios.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_convenio=145" , '_blank')
    window.open(environment.ReportingUrl + "rpt_convenio_pago_terreno.pdf?id_convenio.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_convenio=" + this.newDocument, '_blank')
    //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_notifiacion_convenios.html?id_convenio=



  }

  expandCompraTerreno() {
    const modal = this.modalService.open(ModalCompraTerrenosComponent, {size: 'xl', backdrop: 'static'})
    modal.componentInstance.contribuyente = this.contribuyenteActive
  }

}
