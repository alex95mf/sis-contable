import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import moment from 'moment';
import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneracionIcpService } from './generacion-icp.service';
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
  selector: 'app-generacion-icp',
  templateUrl: './generacion-icp.component.html',
  styleUrls: ['./generacion-icp.component.scss']
})
export class GeneracionIcpComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild("print") print!: ElementRef;
  fTitle = "Generación de ICP";
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

  contribuyenteActive: any = {
    razon_social: ""
  };

  mercados = []
  puestos = []
  puestos_filter: any[] = []
  listaorientacion: any[] = []
  listafuncion: any[] = []
  idpIngresos: any = []
  proyectos = []

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
    fecha_anulacion:moment(new Date()).format('YYYY-MM-DD'),
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

  cmb_periodo: Array<any>  [];
  fk_programa: any

  ajustar: boolean = false;
  mostrarAjustado: boolean = false;

  changeAjuste: boolean = false
  habilitarAjuste: boolean = false

  proyectosTodos: any[]=[];

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: AnticipoPrecobradoService,
    private contSvr:ContratoService,
    private genIdpSvr: GeneracionIcpService,
    private cierremesService: CierreMesService,
    ) {
      this.commonVrs.selectContribuyenteCustom.asObservable().subscribe(
        (res) => {
          console.log('Aqui '+res);
          // this.cargarDatosModal(res);
          this.contribuyenteActive = res;
          this.ordenDisabled = false;
          this.titulosDisabled = false;
          // this.getLiquidaciones();
          this.vmButtons[0].habilitar=true;
        }
      );

      this.commonVrs.selectRecDocumento.asObservable().subscribe(
        (res) => {

          // this.formReadOnly = true;
          this.restoreForm();


          console.log("BUSCAR",res);

          // this.concepto = res.concepto; // ya no se maneja eligiendo concepto se puede eliminar
          this.habilitar=true;
          this.habilitarAjuste= true;
          if(res.contribuyente){
            this.contribuyenteActive = res.contribuyente;
            this.deshabilitarCont = true;

          }
          this.documento = res;
          this.documento.fecha = res.fecha.split(" ")[0];
          this.documento.mercado =  this.mercados.find(m => m.id == res.fk_mercado);
          this.documento.proyecto = res.proyecto?.secuencia+'-'+res.proyecto?.descripcion;

          (this as any).mensajeSpinner = 'Cargando...';
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
                console.log(res);
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
                let resultado = res.detalles.find(detalle => detalle.fk_solicitud_detalle === e.id_solicitud_det);
                if (resultado) {
                  e["codigopartida"] = resultado.codigopartida;
                  e["precio_solicitado"] = resultado.precio_solicitado;

                  e["valor_icp"] = resultado.precio_cotizado;
                  if(res.total < 0){
                    this.mostrarAjustado = true
                    e["ajuste"] = resultado.ajuste;
                  }else{
                    e["ajuste"] = parseFloat("0.00");
                  }
                  e["saldo_anterior"] = resultado.saldo_anterior;
                  e["saldo_actual"] = resultado.saldo_actual;
                }
                this.solicitudDetalle.push(e);


                if(this.solicitudDetalle[0]?.fk_programa){
                  this.fk_programa = this.solicitudDetalle[0]?.fk_programa
                  this.cargarProyectos()
                }
                console.log(this.solicitudDetalle)


              }
              else {
                this.idpIngresos.push(e);
              }
            }
          )

          this.solicitud = [res.solicitud];


          this.totalCobro = res.total;
          this.totalPago = +res.total + +res.superavit;
          this.difCobroPago = 0 - +res.superavit;

          this.formReadOnly = true;
          this.vmButtons[0].habilitar = true;
          this.vmButtons[2].habilitar = false;
          //this.vmButtons[3].habilitar = false;
          this.vmButtons[4].habilitar = !(this.documento.estado == 'E');

        }
      )
      this.commonVrs.modalAsignacionIngreso.asObservable().subscribe(
        (res)=>{

          //res['fk_documento'] =  this.documento.id_documento
          console.log(res);
          if(this.idpIngresos.length > 0){
            this.idpIngresos.forEach(c => {
                if(res.partida != c.partida){
                  let data= {
                    partida: res.partida,
                    denominacion: res.denominacion,
                    asignacion_codificada: res.asignacion_codificada,
                    comprometido: res.comprometido,
                    disponible: res.disponible
                  }
                  this.idpIngresos.push(data);
                }

            })
          }else{

            let data= {
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
        (res)=>{
           console.log("SOLICITUD",res);
           this.solicitud = [];
           this.solicitudDetalle = [];
           if (res.id_solicitud != null || res.id_solicitud!=undefined) {
            (this as any).mensajeSpinner = 'Cargando ...';
            this.lcargando.ctlSpinner(true);
            let data = {
              id_solicitud: res.id_solicitud
            }
            this.genIdpSvr.getIdpSolicitudGenerados(data).subscribe(
              (res2) => {
                console.log(res2);

                //this.idps= res2
                if(res2['data'].length == 0){
                  this.lcargando.ctlSpinner(false);
                  this.solicitud = [res];
                  res.detalles.map((item: any) => Object.assign(item, { precio_solicitado: item.precio_cotizado }))
                  this.solicitudDetalle = res.detalles;

                  if(this.solicitudDetalle[0]?.fk_programa){
                    this.fk_programa = this.solicitudDetalle[0]?.fk_programa
                    this.cargarProyectos()
                  }

                  this.armarcodigos();
                  this.totalSolicitud()
                }else{
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "info",
                    title: "Ya existe un ICP generado para la solicitud "+ res.num_solicitud,
                    //text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  })
                  //this.toastr.info('Existe un IDP generado para esta solicitud')
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
          //printSection: "PrintSection", imprimir: true
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
        this.getCatalogos();
        this.cargarProyectosTodos()
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
        this.ajustarIcp();
        break;

      default:
        break;
    }
  }

  totalSolicitud() {
    this.totalCobro = this.solicitudDetalle.reduce((acc: number, curr: any) => acc + curr.precio_solicitado, 0)
  }
  totalSolicitudAjuste() {
    this.totalCobro = this.solicitudDetalle.reduce((acc: number, curr: any) => acc + curr.ajuste, 0)

    this.solicitudDetalle.forEach(e => {
      let detalleDoc = this.documento?.detalles.find(detalle => detalle.fk_solicitud_detalle === e.id_solicitud_det);
      Object.assign(e,{saldo_anterior: detalleDoc.saldo_anterior, saldo_actual: detalleDoc.saldo_actual - e.ajuste})
    });
  }

  armarcodigos() {
     this.solicitudDetalle.forEach(item => {

     this.documento.geografico = "0926";

      const documentoPeriodo = this.documento.periodo || '';
      const documentoProyecto = this.documento.proyecto || '';
      const documentoActividad = this.documento.actividad || '';
      const documentoOrientacion = this.documento.orientacion || '';
      const documentoFuncion = this.documento.funcion || '';
//catalogo_departamento
      const codigopartidaParts = [
        documentoPeriodo,
        item.catalogo_programa?.descripcion,
        documentoProyecto,
        documentoActividad,
        item.partida_data?.partida,
        documentoOrientacion,
        '0926',
        documentoFuncion
      ];

      item['geografico'] = '0926';
      item['codigopartida'] = codigopartidaParts.filter(Boolean).join('.');
/*
      this.documento.geografico = "0926";
      item["geografico"] = "0926";
      item["codigopartida"] = ""
      if (this.documento.periodo != null && this.documento.periodo != "" && this.documento.periodo != undefined) {
        item["codigopartida"] += this.documento.periodo
      }
      if (item.catalogo_departamento?.descripcion != null && item.catalogo_departamento?.descripcion != "" && item.catalogo_departamento?.descripcion != undefined) {
        item["codigopartida"] += "." + item.catalogo_departamento?.descripcion
      }
      if (this.documento.proyecto != null && this.documento.proyecto != "" && this.documento.proyecto != undefined) {
        item["codigopartida"] += "." + this.documento.proyecto
      }
      if (this.documento.actividad != null && this.documento.actividad != "" && this.documento.actividad != undefined) {
        item["codigopartida"] += "." + this.documento.actividad
      }
      if (item.partida_data?.partida != null && item.partida_data?.partida != "" && item.partida_data?.partida != undefined) {
        item["codigopartida"] += "." + item.partida_data?.partida
      }
      if (this.documento.orientacion != null && this.documento.orientacion != "" && this.documento.orientacion != undefined) {
        item["codigopartida"] += "." + this.documento.orientacion
      }
      item["codigopartida"] += ".0926"

      if (this.documento.funcion != null && this.documento.funcion != "" && this.documento.funcion != undefined) {
        item["codigopartida"] += "." + this.documento.funcion
      } */


    })
  }

  async cargarProyectos(){

    this.lcargando.ctlSpinner(true);
    try {

        (this as any).mensajeSpinner = 'Cargando Proyectos'
        this.proyectos = await this.genIdpSvr.getProyectos({periodo: this.documento.periodo, programa: this.solicitudDetalle[0]?.catalogo_programa});
        if(this.proyectos.length > 0){
          this.proyectos.forEach((elem: any) => {
            Object.assign(elem,{fk_proyecto: elem.id_proyecto,
              fk_programa: elem.fk_programa,
              secuencia: elem.secuencia,
              descripcion: elem.descripcion,
              label: `${elem.secuencia}-${elem.descripcion}`})
          })

        }
      // (this as any).mensajeSpinner = 'Cargando Catalogos';
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial')
    }
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

      //(this as any).mensajeSpinner = 'Cargando Proyectos'
      //this.proyectos = await this.genIdpSvr.getProyectos({periodo: this.documento.periodo, programa: this.programa});

      // this.proyectos.forEach((elem: any) => {
      //   Object.assign(elem,{fk_proyecto: elem.id_proyecto,
      //     fk_programa: elem.fk_programa,
      //     secuencia: elem.secuencia,
      //     descripcion: elem.descripcion,
      //     label: `${elem.secuencia}-${elem.descripcion}`})
      // })

      // (this as any).mensajeSpinner = 'Cargando Catalogos';
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial')
    }
  }

  handleSelectProyecto(event: any, item: any) {
    Object.assign(
      item,
      { fk_proyecto: event.fk_proyecto, codigo_proyecto: event.secuencia }
    )
  }

  removeIdpIngresos(index){
    this.idpIngresos.splice(index,1)
    this.solicitud = [];
    this.solicitudDetalle = [];
    this.totalCobro = 0
  }

  sumarIngreso(event, d){

    if(event > d.definitivo){
      this.toastr.info('No debe pasar el valor definitivo')
    }else {

      let total = 0
      this.idpIngresos.map(
        (res)=>{
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
      params: "'REC_FORMA_PAGO','REC_FORMA_PAGO_ENTIDAD','REC_FORMA_PAGO_EMISOR','PRE_CATALOGO_FUNCIONAL','PRE_ORIENTACION_GASTO',''",
    }
    this.apiSrv.getCatalogos(data).subscribe(
      (res) => {
        console.log("datos", res);

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
        res['data']['PRE_ORIENTACION_GASTO'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.listaorientacion.push(f_pago);
        })
        res['data']['PRE_CATALOGO_FUNCIONAL'].forEach(e => {
          let f_pago = {
            nombre: e.descripcion,
            valor: e.valor,
            grupo: e.grupo
          }
          this.listafuncion.push(f_pago);
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
        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }

  updateIdp(){

  }



  createRecDocumento() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para generar ICP.", this.fTitle);
      return;
    }

    let message = '';

    if (this.documento.periodo == "" || this.documento.periodo == null || this.documento.periodo == undefined) message += '* Debe ingresar un Período.<br>';
    if (this.documento.periodo != moment(this.documento.fecha).format('YYYY')) message += '* El Periodo difiere de la Fecha seleccionada.<br>';
    if (this.documento.observacion == "" || this.documento.observacion == undefined) message += '* Debe ingresar una Observación.<br>';
    if (this.totalCobro <= 0 || this.totalCobro == undefined) message += '* Monto de la solicitud no puede ser menor o igual a 0.<br>';
    if (this.totalCobro > this.solicitud[0].valor) message += '* El monto no puede exceder al valor de la solicitud.<br>';
    if (this.documento.funcion == "" || this.documento.funcion == null || this.documento.funcion == undefined) message += '* Debe ingresar una Funcion.<br>';
    if (this.documento.proyecto == "" || this.documento.proyecto == null || this.documento.proyecto == undefined) message += '* Debe ingresar un Proyecto.<br>';
    if (this.documento.orientacion == "" || this.documento.orientacion == null || this.documento.orientacion == undefined) message += '* Debe ingresar un Orientacion.<br>';
    if (this.documento.actividad == "" || this.documento.actividad == null || this.documento.actividad == undefined) message += '* Debe ingresar una Actividad.<br>';
    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true });
      return;
    }

    if (+this.difCobroPago<0){
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
      text:'¿Está a punto de generar un ICP desea continuar?' ,
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
              (this as any).mensajeSpinner = 'Generando ICP...';
              this.lcargando.ctlSpinner(true);
              this.documento.estado = "E";
              this.documento.tipo_documento = this.concepto.codigo;
              this.documento.subtotal = this.totalCobro;
              this.documento.total = this.totalCobro;
              this.documento.detalles = [];
              this.documento.formas_pago = [];
              this.documento.saldo_anterior = this.totalCobro;
              this.documento.ajuste = parseFloat("0.00");
              this.documento.saldo_actual = this.totalCobro;
              this.pagos.forEach(e => {
                if(e.valor > 0){
                  this.documento.formas_pago.push(e);
                }
              });
              this.documento.solicitud = this.solicitud[0];
              this.documento.ingresos = [];
              this.idpIngresos.map(
                (e)=>{
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
                    title: "ICP No: "+ this.documento.documento,
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  }).then((res)=> {
                    if(res.isConfirmed){
                    //  this.triggerPrint(); imprimir documentos
                    }
                  })
                },
                (error) => {
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "error",
                    title: "Error al generar ICP",
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

    // this.conceptosList = [];
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
      fecha_anulacion:moment(new Date()).format('YYYY-MM-DD'),
      saldo_anterior: 0,
      ajuste:0,
      saldo_actual: 0
    }
    this.documento.periodo = ""
    this.documento.proyecto= ""
    this.documento.actividad= ""
    this.documento.orientacion= ""
    this.documento.funcion= ""

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    //this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;

  }
  validarNumeros(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
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

  expandListDocumentosRec() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListRecDocumentosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }

  expandListContribuyentes() {

    // if (this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    // } else {
      const modalInvoice = this.modalService.open(ModalContribuyentesComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      modalInvoice.componentInstance.validacion = 8;
    // }
  }

  modalIngresoAsignacion(){

    if(this.documento.periodo == null){
      this.toastr.info('Ingrese el periodo')
    }else{
      const modal = this.modalService.open(ModalIngresoAsignacionComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      })

      modal.componentInstance.periodo = this.documento.periodo;

    }


  }

  modalSolicitud(){
    if(this.documento.periodo == undefined || this.documento.periodo ==''){
      this.toastr.info('Debe seleccionar un período')
    }else{
      const modal = this.modalService.open(ModalSolicitudComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      })
      modal.componentInstance.periodo = this.documento.periodo;
    }
  }

  async anularDocumento(original_id: number) {
    let result: SweetAlertResult = await Swal.fire({
      title: 'Anulacion de Documento',
      text: 'Seguro/a desea anular este documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Anular',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      try {
        let response = await this.genIdpSvr.anularDocumento(original_id);
        console.log(response)

        this.lcargando.ctlSpinner(false)
        Swal.fire('Documento anulado', '', 'success').then(() => this.restoreForm())
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error anulando Documento')
      }
    }
  }
  descargarPdf(){
    console.log(this.documento.id_documento)
    window.open(environment.ReportingUrl + "rpt_presupuesto_icp.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + this.documento.id_documento, '_blank')


  }

  async ajustarIcp(){

    let message = '';

    if (this.totalCobro <= 0 || this.totalCobro == undefined) message += '* Monto de la solicitud no puede ser menor o igual a 0.<br>';
   // if (this.totalCobro > this.solicitud[0].valor) message += '* El monto no puede exceder al valor de la solicitud.<br>';

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true });
      return;
    }

    let result: SweetAlertResult = await Swal.fire({
      title: 'Ajuste de ICP',
      text: 'Seguro/a desea ajustar este ICP?',
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
            let response = await this.genIdpSvr.ajustarIcp(this.documento.id_documento, this.documento);
            console.log(response)

            this.lcargando.ctlSpinner(false)
            Swal.fire('ICP N°:  '+this.documento.documento+' ajustado', '', 'success').then(() => this.restoreForm())
          } catch (err) {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error?.message, 'Error ajustando ICP')
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

  cargarProyectosTodos(){
    this.genIdpSvr.getProyectosTodos({}).subscribe(
      (res) => {
       console.log(res['data'])
        if(res['data'].length > 0){
          this.lcargando.ctlSpinner(false);
          res['data'].forEach((elem: any) => {
            Object.assign(elem,{fk_proyecto: elem.id_proyecto,
              fk_programa: elem.fk_programa,
              secuencia: elem.secuencia,
              descripcion: elem.descripcion,
              label: `${elem.secuencia}-${elem.descripcion}`})
          })
          this.proyectosTodos=res['data']

        }else{
          this.lcargando.ctlSpinner(false);
        }
      }, (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.warning(error.error.message)
        // Swal.fire({
        //   icon: "error",
        //   title: "Error al cargar Proyectos",
        //   text: error.error.message,
        //   showCloseButton: true,
        //   confirmButtonText: "Aceptar",
        //   confirmButtonColor: '#20A8D8',
        // });
      }
    );
  }

}
