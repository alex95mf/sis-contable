import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import moment from 'moment';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneracionIdpService } from './generacion-idp.service';
import { AnticipoPrecobradoService } from 'src/app/view/tesoreria/recaudacion/anticipo-precobrado/anticipo-precobrado.service';
import { ContratoService } from 'src/app/view/rentas/mercados/contrato/contrato.service';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ModalIngresoAsignacionComponent } from './modal-ingreso-asignacion/modal-ingreso-asignacion.component';
import { ModalSolicitudComponent } from './modal-solicitud/modal-solicitud.component';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';

//import e from 'cors';
import { SweetAlertResult } from 'sweetalert2';
import { environment } from 'src/environments/environment';



@Component({
standalone: false,
  selector: 'app-generacion-idp',
  templateUrl: './generacion-idp.component.html',
  styleUrls: ['./generacion-idp.component.scss']
})
export class GeneracionIdpComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild("print") print!: ElementRef;
  fTitle = "Generación de IDP";
  mensajeSpinner: string = "Cargando...";
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  formReadOnly = false;
  ordenDisabled = true;
  titulosDisabled = false;
  habilitar: boolean = true;
  deshabilitarCont: boolean = false;
  ajustar: boolean = false;
  mostrarAjustado: boolean = false;

  changeAjuste: boolean = false
  habilitarAjuste: boolean = false

  contribuyenteActive: any = {
    razon_social: ""
  };

  mercados = []
  puestos = []
  puestos_filter: any[] = []

  idpIngresos: any = []

  ordenActive: any = {
    numero_orden: "",
    fk_local: {
      id_local: 0,
      razon_social: "",
      contrato: "",
      fk_sector: {
        id_catalogo: 0,
        tipo: "",
        valor: "",
        descripcion: ""
      },
      fk_actividad_comercial: {
        id_catalogo: 0,
        tipo: "",
        valor: ""
      },
      fk_grupo: {
        id_catalogo: 0,
        tipo: "",
        valor: ""
      },
    },
  }

  conceptosBackup: any = [];
  conceptosList: any = [];
  concepto: any = 0;

  totalCobro = 0;
  totalPago = 0;
  difCobroPago = 0;

  deudas: any = [];
  deudasBackup: any = [];
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
  verifyRestore = false;

  formasDePago: any = [];
  entidades: any = [];
  emisores: any = [];

  pagos: any = [];
  idps: any = [];

  formaPago: any = {
    nombre: '',
    valor: '',
  };

  totalCotizado: any;

  entidadesFiltrada: any = [];
  entidadDisabled: boolean = true;
  hayEntidad: boolean = false;
  entidad: any = {
    nombre: '',
    valor: '',
    grupo: '',
  };

  emisoresFiltrada: any = [];
  emisorDisabled: boolean = true;
  hayEmisor: boolean = false;
  emisor: any = {
    nombre: '',
    valor: '',
    grupo: '',
  };

  documento: any = {
    id_documento: null,
    tipo_documento: "", // concepto.codigo
    fk_contribuyente: null, // contr id
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    observacion: "",
    estado: "E",
    subtotal: 0,
    total: 0,
    superavit: 0,
    detalles: [], // deudas
    formas_pago: [], // pagos
    fk_caja: 0, // caja activa al momento de cobrar
    mercado: 0,
    puesto: 0,
    periodo: null,
    fecha_anulacion: moment(new Date()).format('YYYY-MM-DD') ,
    saldo_anterior: 0,
    ajuste:0,
    saldo_actual: 0
  }

  cajaActiva: any = {
    id_caja: 0,
    nombre: "",
  }

  activo: boolean = false;
  superavit: boolean = false;
  solicitud: any = [];
  solicitudDetalle: any = [];

  cmb_periodo: Array<any>[];

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: AnticipoPrecobradoService,
    private contSvr: ContratoService,
    private genIdpSvr: GeneracionIdpService,
    private cierremesService: CierreMesService,
  ) {
    this.commonVrs.selectContribuyenteCustom.asObservable().subscribe(
      (res) => {
        console.log('Aqui ' + res);
        // this.cargarDatosModal(res);
        this.contribuyenteActive = res;
        this.ordenDisabled = false;
        this.titulosDisabled = false;
        // this.getLiquidaciones();
        this.vmButtons[0].habilitar = true;
      }
    );

    this.commonVrs.selectRecDocumento.asObservable().subscribe(
      (res) => {
        console.log(res)
        this.restoreForm();
        this.habilitar = true;
        this.habilitarAjuste= true;
        if (res.contribuyente) {
          this.contribuyenteActive = res.contribuyente;
          this.deshabilitarCont = true;

        }

        this.documento = res;
        this.documento.fecha = res.fecha.split(" ")[0];
        this.documento.mercado = this.mercados.find(m => m.id == res.fk_mercado);
        (this as any).mensajeSpinner = 'Cargando...'
        this.puestos_filter = this.puestos.filter(e => e.fk_mercado == res.fk_mercado)
        this.documento.puesto = res.fk_mercado_puesto;

        if (res.fk_documento_2 && res.fk_documento_2 != 0) {
          (this as any).mensajeSpinner = 'Cargando datos de la Garantía...';
          this.lcargando.ctlSpinner(true);
          let data = {
            inspeccion: res.fk_documento_2
          }
          this.apiSrv.getInspeccion(data).subscribe(
            (res) => {
              this.lcargando.ctlSpinner(false);
              this.ordenActive = res['data'];
            }
          );
        }
        res.formas_pago.forEach(e => {
          this.pagos.push(e);
        });
        res.solicitud?.detalles.map(
          (e) => {
            if (e.cantidad_solicitada != null) {
              let resultado = res.solicitud?.recdocicp?.detalles.find(detalle => detalle.fk_solicitud_detalle === e.id_solicitud_det);
              if (resultado) {
                e["codigopartida"] = resultado.codigopartida;
              }
              e.precio_solicitado = e.precio_cotizado

              let detalleDoc = res.detalles.find(detalle => detalle.fk_solicitud_detalle === e.id_solicitud_det);
              if (detalleDoc) {
                e["valor_idp"] = detalleDoc.precio_cotizado;
                if(res.total < 0){
                  this.mostrarAjustado = true
                  e["ajuste"] = detalleDoc.ajuste;
                }else{
                  e["ajuste"] = parseFloat("0.00");
                }
                //e["ajuste"] = detalleDoc.ajuste == null ? parseFloat("0.00")  : detalleDoc.ajuste;

                e["saldo_anterior"] = detalleDoc.saldo_anterior;
                e["saldo_actual"] = detalleDoc.saldo_actual;
              }
              this.solicitudDetalle.push(e);

            } else {
              this.idpIngresos.push(e);

            }
          }
        )

        this.solicitud = [res.solicitud];

        this.totalCobro = res.total;
        //this.totalCobro = res.saldo_actual;
        this.totalPago = +res.total + +res.superavit;
        this.difCobroPago = 0 - +res.superavit;
        this.formReadOnly = true;
        this.vmButtons[0].habilitar = true;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[4].habilitar = !(this.documento.estado == 'E');
      }
    )
    this.commonVrs.modalAsignacionIngreso.asObservable().subscribe(
      (res) => {
        if (this.idpIngresos.length > 0) {
          this.idpIngresos.forEach(c => {
            if (res.partida != c.partida) {
              let data = {
                partida: res.partida,
                denominacion: res.denominacion,
                asignacion_codificada: res.asignacion_codificada,
                comprometido: res.comprometido,
                disponible: res.disponible
              }
              this.idpIngresos.push(data);
            }

          })
        } else {

          let data = {
            partida: res.partida,
            denominacion: res.denominacion,
            asignacion_codificada: res.asignacion_codificada,
            comprometido: res.comprometido,
            disponible: res.disponible
          }
          this.idpIngresos.push(data);
        }
      }
    )

    this.commonVrs.seleciconSolicitud.asObservable().subscribe(
      (res) => {
        this.solicitud = [];
        this.solicitudDetalle = [];
        if (res.id_solicitud != null || res.id_solicitud != undefined) {
          (this as any).mensajeSpinner = 'Cargando ...';
          this.lcargando.ctlSpinner(true);
          let data = {
            id_solicitud: res.id_solicitud
          }
          this.genIdpSvr.getIdpSolicitudGenerados(data).subscribe(
            (res2) => {
              if (res2['data'].length == 0) {
                this.lcargando.ctlSpinner(false);
                this.solicitud = [res];
                if (this.solicitud.saldo_restante_para_idp == "-1.00") {
                  this.solicitud.saldo_restante_para_idp = this.solicitud.valor;
                }
                // recorremos solicitud y si el campo de saldo -1 ponerle el mismo de valor
                res.detalles.map((item: any) => Object.assign(item, { precio_solicitado: item.precio_cotizado }))
                this.solicitudDetalle = res.detalles;
                this.solicitudDetalle.map(
                  (e) => {
                    if (e.cantidad_solicitada != null) {
                      let resultado = res.recdocicp?.detalles.find(detalle => detalle.fk_solicitud_detalle === e.id_solicitud_det);
                      if (resultado) {
                        e["codigopartida"] = resultado.codigopartida;
                        e["id_documento_detalle"] = resultado.id_documento_detalle;
                      }
                    }
                  }
                )
                this.solicitudDetalle.forEach(detalle => {
                  if (detalle.saldo_restante_para_idp === "-1.00") {
                    detalle.saldo_restante_para_idp = detalle.precio_cotizado;
                  }
                });
                this.totalSolicitud()
              } else {
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "info",
                  title: "Ya existe un IDP generado para la solicitud " + res.num_solicitud,
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                })
                this.lcargando.ctlSpinner(false);
                this.solicitud = [res];
                res.detalles.map((item: any) => Object.assign(item, { precio_solicitado: item.precio_cotizado }))
                this.solicitudDetalle = res.detalles;
                this.solicitudDetalle.map(
                  (e) => {

                    if (e.cantidad_solicitada != null) {
                      let resultado = res.recdocicp?.detalles.find(detalle => detalle.fk_solicitud_detalle === e.id_solicitud_det);
                      if (resultado) {
                        e["codigopartida"] = resultado.codigopartida;
                        e["id_documento_detalle"] = resultado.id_documento_detalle;
                      }
                    }
                  }
                )
                this.totalSolicitud()
              }
            }
          );
        }

      }
    )

    this.formaPago = 0;
    this.entidad = 0;
    this.emisor = 0;
    this.vmButtons = [
      {
        orig: "btnsGenIdp",
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
        orig: "btnsGenIdp",
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
        orig: "btnsGenIdp",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsGenIdp",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      // {
      //   orig: "btnsGenIdp",
      //   paramAccion: "",
      //   boton: { icon: "far fa-file-times", texto: "ANULAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-danger btn-sm",
      //   habilitar: true,
      // },
      {
        orig: "btnsGenIdp",
        paramAccion: "",
        boton: { icon: "fas fa-pencil-alt", texto: "AJUSTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.validaPermisos();
    }, 0);
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.createRecDocumento();
        break;
      case "BUSCAR":
        this.expandListDocumentosRec();
        break;
      case "PDF":
        this.descargarPdf();

        break;
      case "LIMPIAR":
        this.confirmRestore();
        break;
      case "EDITAR":
        this.updateIdp();
        break;
      // case "ANULAR":
      //   this.anularDocumento(this.documento.id_documento);
      //   break;
      case "AJUSTAR":
        this.ajustarIdp();
        break;

      default:
        break;
    }
  }

  totalSolicitud() {
    this.totalCobro = this.solicitudDetalle.reduce((acc: number, curr: any) => acc + curr.precio_aprobado, 0)
    this.totalCotizado = this.solicitudDetalle.reduce((acc: number, curr: any) => acc + curr.precio_cotizado, 0)
  }
  totalSolicitudAjuste() {
    this.totalCobro = this.solicitudDetalle.reduce((acc: number, curr: any) => acc + curr.ajuste, 0)
    this.totalCotizado = this.solicitudDetalle.reduce((acc: number, curr: any) => acc + curr.valor_idp, 0)
    this.solicitudDetalle.forEach(e => {
      let detalleDoc = this.documento?.detalles.find(detalle => detalle.fk_solicitud_detalle === e.id_solicitud_det);
      Object.assign(e,{saldo_anterior: detalleDoc.saldo_anterior, saldo_actual: detalleDoc.saldo_actual - e.ajuste})
    });

  }

  triggerPrint(): void {
    this.print.nativeElement.click();
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
          this.lcargando.ctlSpinner(false);
          this.cargaInicial()
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Periodos';
      let periodos = await this.genIdpSvr.getPeriodos();
      this.cmb_periodo = periodos;

      // (this as any).mensajeSpinner = 'Cargando Catalogos';
      // let catalogos = await this.genIdpSvr.getCatalogo({params: "'REC_FORMA_PAGO','REC_FORMA_PAGO_ENTIDAD','REC_FORMA_PAGO_EMISOR'"})

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial')
    }
  }

  removeIdpIngresos(index) {
    this.idpIngresos.splice(index, 1)
    this.solicitud = [];
    this.solicitudDetalle = [];
    this.totalCobro = 0
  }

  sumarIngreso(event, d) {

    if (event > d.definitivo) {
      this.toastr.info('No debe pasar el valor definitivo')
    } else {

      let total = 0
      this.idpIngresos.map(
        (res) => {
          total += parseFloat(res.valor)
        }
      )
      this.totalCobro = total;

    }


  }


  getCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      params: "'REC_FORMA_PAGO','REC_FORMA_PAGO_ENTIDAD','REC_FORMA_PAGO_EMISOR',''",
    }

    this.apiSrv.getCatalogos(data).subscribe(
      (res) => {
        console.log(res);

        res['data']['REC_FORMA_PAGO'].forEach(e => {
          if (e.valor != 'GARANTIA' && e.valor != 'FAVOR') {
            let f_pago = {
              nombre: e.descripcion,
              valor: e.valor,
              grupo: e.grupo
            }
            this.formasDePago.push(f_pago);
          }

        })

        res['data']['REC_FORMA_PAGO_ENTIDAD'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.entidades.push(f_pago);
        })

        res['data']['REC_FORMA_PAGO_EMISOR'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.emisores.push(f_pago);
        })

        // res['data']['REC_DENOMINACION_DETALLE'].forEach(e => {
        //   if(e.grupo=="M"){
        //     let m = {
        //       denominacion: e.descripcion,
        //       cantidad: 0,
        //       total_denominacion: 0,
        //     }
        //     this.monedasCat.push(m);
        //   }else if(e.grupo=="B"){
        //     let b = {
        //       denominacion: e.descripcion,
        //       cantidad: 0,
        //       total_denominacion: 0,
        //     }
        //     this.billetesCat.push(b);
        //   }
        // })
        this.lcargando.ctlSpinner(false);
        // this.getConceptos();
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }

  updateIdp() {

  }



  createRecDocumento() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para generar IDP.", this.fTitle);
      return;
    }

    let message = '';

    if (this.documento.periodo == "" || this.documento.periodo == null || this.documento.periodo == undefined) message += '* Debe ingresar un Período.<br>';
    if (this.documento.periodo != moment(this.documento.fecha).format('YYYY')) message += '* El Periodo difiere de la Fecha seleccionada.<br>';
    if (this.documento.observacion == "" || this.documento.observacion == undefined) message += '* Debe ingresar una Observación.<br>';
    if (this.totalCobro <= 0 || this.totalCobro == undefined) message += '* Monto de la solicitud no puede ser menor o igual a 0.<br>';
    if (this.totalCobro > this.solicitud[0].valor) message += '* El monto no puede exceder al valor de la solicitud.<br>';

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true });
      return;
    }

    if (+this.difCobroPago < 0) {
      let dif100 = +this.difCobroPago * 100;
      let super100 = +dif100 - (2 * +dif100); // volver un numero positivo es restarle su doble
      let superavit = +super100 / 100;
      console.log(superavit);
      this.documento.superavit = +superavit.toFixed(2);
      this.superavit = true;
    } else {
      this.documento.superavit = 0;
      this.superavit = false;
    }

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: '¿Está a punto de generar un IDP desea continuar?',
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        this.lcargando.ctlSpinner(true);
        let datos = {
          "anio": Number(this.documento.periodo),
          "mes": Number(moment(this.documento.fecha).format('MM')),
        }
          this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

          /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
                  (this as any).mensajeSpinner = 'Generando IDP...';
                  this.lcargando.ctlSpinner(true);
                  this.documento.estado = "E";
                  this.documento.tipo_documento = this.concepto.codigo;
                  this.documento.cotizado = this.totalCotizado;
                  this.documento.subtotal = this.totalCobro;
                  this.documento.total = this.totalCobro;
                  this.documento.detalles = [];
                  this.documento.formas_pago = [];
                  this.documento.saldo_anterior = this.totalCobro;
                  this.documento.ajuste = parseFloat("0.00");
                  this.documento.saldo_actual = this.totalCobro;
                  this.pagos.forEach(e => {
                    if (e.valor > 0) {
                      this.documento.formas_pago.push(e);
                    }
                  });
                  this.documento.solicitud = this.solicitud[0];
                  this.documento.ingresos = [];
                  this.idpIngresos.map(
                    (e) => {
                      this.documento.ingresos.push(e);
                    }
                  );

                  let data = {
                    documento: this.documento
                  }
                  // servicio que crea el documento, sus detalles, sus formas de pago asociadas
                  // tambien cambia el saldo de la tabla deudas y el campo estado pasa a C en liquidacion y deudas si el nuevo saldo es 0
                  this.genIdpSvr.setGeneracionIdp(data).subscribe(
                    (res) => {
                      this.documento = res['data'];
                      this.formReadOnly = true;
                      this.vmButtons[0].habilitar = true;
                      this.vmButtons[2].habilitar = false;
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                        icon: "success",
                        title: "IDP No: " + this.documento.documento,
                        text: res['message'],
                        showCloseButton: true,
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: '#20A8D8',
                      }).then((res) => {
                        /**
                         *  AOAC
                         *  Este codigo sirve para presentar el pdf una vez guardado
                         */
                        // if(res.isConfirmed){
                        //   this.triggerPrint();
                        // }
                      })
                    },
                    (error) => {
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                        icon: "error",
                        title: "Error al generar IDP",
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
    this.titulosDisabled = false;
    this.ordenDisabled = true;
    this.habilitar = true;
    this.habilitarAjuste= false;
    this.ajustar= false;
    this.mostrarAjustado = false
    this.solicitud = [];
    this.solicitudDetalle = [];
    this.idpIngresos = [];

    this.contribuyenteActive = {
      razon_social: ""
    };

    this.ordenActive = {
      numero_orden: "",
      fk_local: {
        id_local: 0,
        razon_social: "",
        contrato: "",
        fk_sector: {
          id_catalogo: 0,
          tipo: "",
          valor: "",
          descripcion: ""
        },
        fk_actividad_comercial: {
          id_catalogo: 0,
          tipo: "",
          valor: ""
        },
        fk_grupo: {
          id_catalogo: 0,
          tipo: "",
          valor: ""
        },
      },
    }

    this.concepto = 0;
    this.totalCobro = 0;
    this.totalPago = 0;
    this.difCobroPago = 0;
    this.deudas = [];
    this.fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
    this.verifyRestore = false;
    this.pagos = [];
    this.formaPago = 0;
    this.entidad = 0;
    this.emisor = 0;
    this.documento = {
      id_documento: null,
      tipo_documento: "", // concepto.codigo
      fk_contribuyente: null, // contr id
      fecha: moment(new Date()).format('YYYY-MM-DD'),
      observacion: "",
      estado: "E",
      subtotal: 0,
      total: 0,
      superavit: 0,
      detalles: [], // deudas
      formas_pago: [], // pagos
      fecha_anulacion: moment(new Date()).format('YYYY-MM-DD'),
      saldo_anterior: 0,
      ajuste:0,
      saldo_actual: 0
    }

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    //this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;

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

  ajusteSelected(event){
    console.log(event.target.checked)
    console.log(this.ajustar)

    this.changeAjuste = event.target.checked;
    if(this.ajustar){
     this.documento.fecha_anulacion= moment(new Date()).format('YYYY-MM-DD')
     this.vmButtons[4].habilitar = false

    }else{
     this.vmButtons[4].habilitar = true
    }
    console.log(this.changeAjuste)
  }

  expandListDocumentosRec() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListRecDocumentosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.permissions = this.permissions;
  }

  expandListContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    modalInvoice.componentInstance.validacion = 8;
  }

  modalIngresoAsignacion() {
    if (this.documento.periodo == null) {
      this.toastr.info('Ingrese el periodo')
    } else {
      const modal = this.modalService.open(ModalIngresoAsignacionComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      })
      modal.componentInstance.periodo = this.documento.periodo;
    }
  }

  modalSolicitud() {
    if (this.documento.periodo == undefined || this.documento.periodo == '') {
      this.toastr.info('Debe seleccionar un período')
    } else {
      const modal = this.modalService.open(ModalSolicitudComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      })
      modal.componentInstance.periodo = this.documento.periodo;
    }
  }

  // async anularDocumento(original_id: number) {
  //   let result: SweetAlertResult = await Swal.fire({
  //     title: 'Anulacion de Documento',
  //     text: 'Seguro/a desea anular este documento?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Anular',
  //     cancelButtonText: 'Cancelar'
  //   });

  //   if (result.isConfirmed) {
  //     this.lcargando.ctlSpinner(true);
  //     try {
  //       let response = await this.genIdpSvr.anularDocumento(original_id);
  //       console.log(response)

  //       this.lcargando.ctlSpinner(false)
  //       Swal.fire('Documento anulado', '', 'success').then(() => this.restoreForm())
  //     } catch (err) {
  //       console.log(err)
  //       this.lcargando.ctlSpinner(false)
  //       this.toastr.error(err.error?.message, 'Error anulando Documento')
  //     }
  //   }
  // }

  async ajustarIdp(){

    let message = '';

    if (this.totalCobro <= 0 || this.totalCobro == undefined) message += '* Monto de la solicitud no puede ser menor o igual a 0.<br>';
   // if (this.totalCobro > this.solicitud[0].valor) message += '* El monto no puede exceder al valor de la solicitud.<br>';

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true });
      return;
    }

    let result: SweetAlertResult = await Swal.fire({
      title: 'Ajuste de IDP',
      text: 'Seguro/a desea ajustar este IDP?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ajustar',
      cancelButtonText: 'Cancelar'
    });
    this.documento.subtotal = this.totalCobro;
    this.documento.total = this.totalCobro;
    this.documento.ajuste = this.totalCobro;
    this.documento.solicitud = this.solicitud[0];

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);

      let datos = {
        "anio": Number(this.documento.periodo),
        "mes": Number(moment(this.documento.fecha_anulacion).format('MM')),
      }
      this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(async (res) => {
        try {
        if (res["data"][0].estado !=='C') {
          try {
            let response = await this.genIdpSvr.ajustarIdp(this.documento.id_documento, this.documento);
            console.log(response)

            this.lcargando.ctlSpinner(false)
            Swal.fire('IDP N°:  '+this.documento.documento+' ajustado', '', 'success').then(() => this.restoreForm())
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error ajustando IDP')
          }
        } else {

            this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
            this.lcargando.ctlSpinner(false);
        }
        } catch (error) {
            console.error("Error occurred:", error);
        }
      });
    }
  }
  descargarPdf() {
    window.open(environment.ReportingUrl + "rpt_presupuesto_idp.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.documento.id_documento, '_blank')
  }

}
