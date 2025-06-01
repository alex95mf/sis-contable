import { Component, OnInit, ViewChild } from "@angular/core";
import { ContribuyenteService } from "./contribuyente.service";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import * as myVarGlobals from "../../../../global";
import { CommonService } from "src/app/services/commonServices";
import { CommonVarService } from "src/app/services/common-var.services";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ModalContribuyentesComponent } from "src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { ModalNuevolocalComponent } from "./modal-nuevolocal/modal-nuevolocal.component";
import { ModalSolaresComponent } from "./modal-solares/modal-solares.component";
import { ConfirmationDialogService } from "src/app/config/custom/confirmation-dialog/confirmation-dialog.service";
import { VistaArchivoComponent } from "src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component";
import { ValidacionesFactory } from "src/app/config/custom/utils/ValidacionesFactory";
import { ModalConvenioComponent } from "./modal-convenio/modal-convenio.component";
import { ConceptoDetComponent } from "../estado-cuenta/concepto-det/concepto-det.component";
import { environment } from "src/environments/environment";
import { EstadoCuentaService } from "../estado-cuenta/estado-cuenta.service";
import { ModalPagosDetComponent } from "./modal-pagos-det/modal-pagos-det.component";
import { ConsultaLotesComponent } from "./consulta-lotes/consulta-lotes.component";
import { DetalleInteresesComponent } from "./detalle-intereses/detalle-intereses.component";
import { takeUntil } from "rxjs/operators";
import * as moment from 'moment';

@Component({
standalone: false,
  selector: "app-contribuyente",
  templateUrl: "./contribuyente.component.html",
  styleUrls: ["./contribuyente.component.scss"],
})
export class ContribuyenteComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  vmButtons: any = [];
  vmButtons2: any = [];
  dataUser: any;
  permissions: any;
  catalog: any = {};
  contribuyente: any = {
    id_cliente: null,
    tipo_documento: 0,
    contribuyente: 0,
    primer_nombre: '', segundo_nombre: '',
    primer_apellido: '', segundo_apellido: '',
    telefono_movil1: null,
    telefono_movil2: null,
    telefono_movil3: null,
  };
  tamDoc: any = 0;
  actions: any = {
    new: false,
    search: false,
    add: true,
    edit: true,
    cancel: true,
    delete: true,
  };
  detalle_contactos: any = [];
  detalle_edit: any;
  paginate: any;
  filter: any;
  filter_estado_cuenta: any;

  desglose: any = {
    valor: 0,
    interes: 0,
    multa: 0,
    descuento: 0,
    exoneraciones: 0,
    recargo: 0,
    coactiva: 0,
    saldo: 0
  }
  verifyRestore = false;

  validaciones = new ValidacionesFactory;

  contriLoteActive: any = '';
  //Locales Comerciales
  locales: any[] = [];
  //Solares
  solares: any[] = [];
  //deudas
  deudas: any[] = [];
  deudasAnuladas: any[] = [];
  //Total de deudas
  totalDeudas = 0;
  totalDeudasAnuladas = 0;
  //Valor comercial
  valComercial: any[] = []
  //Contratos
  contratos: any = []
  //Novedades
  novedades: any = []
  //Detalles pagos
  documentosDt: any = [];
  conceptosList: any = [];


  //Valor de los Checkbox
  conyugue: boolean = false;
  discapcidad: boolean;
  tutor: boolean;
  prestamo: boolean;
  perteneceTax: boolean;
  fileList: FileList
  //Variables para los acordeones
  contribuyenteSpecial: any = {};
  // Variables para maxlegth
  NOCedula: number = 0;
  //Obligado a llevar contabilidad
  estandarVariables = ["SI", "NO"];

  tipo_contribuyente: any;
  //Variables de validacion de tipo de contribuyente
  validadorNt: boolean = false;
  validadorJr: boolean = false;
  validadorNoDocumentoJr: boolean = false;
  validadorNoDocumentoNt: boolean = true;
  // Tipo de persona
  tipoPersona: any;
  //edad del contribuyente
  edadContribuyente: any;
  //No Documento
  NoDocumento: any
  //Tipo de documento
  tipoDocumento: any;
  //Validacion Busqueda Contribuyente
  validacionBusquedaContri: boolean = false
  //Validacion de cedula o ruc en persona natural
  validadorRucCedu: boolean;
  // Valor para el estado de ecuenta
  totalDeudasCheck = 0;
  // logo
  empresLogo: any
  //Anexos para Arriendo
  anexos: any = []
  selectAnexos: any = []
  // Convenios contribuyente
  convenios: any = []

  filterConvenio: any;
  paginateConvenio: any;

  nuevoContribuyente: boolean = false

  JuridicoLis: boolean = true

  superValid: boolean = true

  hayContribuyente: boolean = false;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  //Objeto Formulario Contribuyente
  contribuyenteForm: any = {
    name: '',
    estado: '',
    tipo: '',
    telefono: '',
    direccion: '',
    provincia: '',
    canton: '',
    email: '',
    tipoID: '',
    cedula_pasp: '',
    ruc: '',
    obligadoCon: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    sexo: '',
    fechaNac: '',
    estadoCivil: '',
    nacionalidad: '',
    razonSocial: '',
    nombreComercial: '',
    tipoJuridico: '',
    contribuyenteSpecial: '',
  }

  lote: any = {
    cod_catastral: '',
    cod_catastral_anterior: '',
    zona: '',
    sector: '',
    manzana: '',
    solar: '',
    area: '',
    valor_metro_cuadrado: 0,
    valor_solar: 0,
    valor_edificacion: 0,
    valor_comercial: 0,
    valor_hipoteca: 0,
    tipo_relacion: 0

  }
  n_supervivencia: string = null;

  superv = [
    { valor: 'S', descripcion: 'SI' },
    { valor: 'N', descripcion: 'NO' },
  ]

  listEstados = [
    {value: "E",label: "EMITIDO"},
    {value: "A",label: "APROBADO"},
    {value: "X",label: "ANULADO"},
    {value: "C",label: "CANCELADO"},
    {value: "V",label: "CONVENIO"},
  ]

  sector: any = []
  historial: Array<any> = [];
  histColumns: Array<string> = ['evento', 'fecha_evento', 'usuario'];
  documentos: Array<any> = [];
  resolucionTerceraPendiente: File;

  onDestroy$: Subject<void> = new Subject();

  contriRelacionActive: any = {
    razon_social: ""
  };
  relacion: any


  discapacidad = [
    {value: "S",label: "SI"},
    {value: "N",label: "NO"},
  ]

  dataRelacion: any = [];

  relacionesIds: any = []

  lotesIds: any = []

  disabledRelacion:any = true
  disabledLotes:any = true


  checkEnfermedadCatastrofica: any = false
  datosEnfermedadCatastrofica: any
  fileListEnfermedadCatastrofica: any = undefined
  anexoEnfermedadCatastrofica :any = undefined

  checkConyugue: any = false
  datosConyugue: any

  checkDisca: any =false
  datosDisca:  any
  fileListDisca: any = undefined
  anexoDisca:  any = undefined

  checkTutorApo: any =false
  datosTutorApo: any
  fileListTutorApo:  any = undefined
  anexoTutorApo: any = undefined

  checkPresHipo: any =false
  datosPresHipo: any
  fileListPresHipo: any = undefined
  anexoPresHipo: any = undefined

  checkCoop: any =false
  datosCoop: any
  fileListCoop:  any = undefined
  anexoCoop:any = undefined

  checkArte: any =false
  datosArte: any
  fileListArte: any = undefined
  anexoArte:any = undefined

  checkTutorEnf : any =false
  datosTutorEnf: any
  fileListTutorEnf: any = undefined
  anexoTutorEnf: any = undefined


  constructor(
    private contribuyenteSrv: ContribuyenteService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private confirmationDialogService: ConfirmationDialogService,
    private estadoCuentaSrv: EstadoCuentaService,
  ) {
    this.commonVrs.saveContribu.asObservable().subscribe(
      ({data}) => {
        console.log(data)
        this.contribuyente.id_cliente = data.id_cliente
        if (this.fileList?.length > 0) {
          this.uploadFile()
        }
      }
    )

    this.commonVrs.listencontribuyente.pipe(takeUntil(this.onDestroy$)).subscribe((res) => {
      if (!res.edit) {
        this.detalle_contactos = [];
        this.detalle_contactos = res.arraycontact;
      } else {
        this.detalle_edit = res;
      }
    });

    // this.commonVrs.editContribuyente.asObservable().subscribe((res) => {
    //   this.vmButtons[1].habilitar = true;
    //   this.vmButtons[2].habilitar = false;
    //   this.contribuyente = res;
    // });

    this.commonVrs.selectContribuyenteCustom.pipe(takeUntil(this.onDestroy$)).subscribe(
      async (res) => {
        if (res.valid == 1) {
          this.cancelFormWithout()
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = false;
          this.vmButtons[4].habilitar = false;

          // console.log(res)
          this.sector = this.catalog.sector
          // this.n_supervivencia = 'S'
          this.validacionBusquedaContri = true
          this.disabledRelacion = false
          this.disabledLotes = false
          this.contribuyente = res;
          this.n_supervivencia = this.contribuyente.supervivencia;
          this.actions.new = true;
          this.contribuyente['usuario_actualizacion'] = res.user?.nombre;
          this.contribuyente['usuario_creacion'] = res.creacion?.nombre;
          this.contribuyente['fecha_creacion'] = res.created_at?.split('T')[0];
          this.contribuyente['fecha_actualizacion'] = res.updated_at?.split('T')[0];

          this.lcargando.ctlSpinner(true)
          this.mensajeSppiner = 'Cargando Datos...'
          let historial = await this.contribuyenteSrv.getHistorial(res);
          console.log(historial)
          this.historial = historial;

          let documentos = await this.contribuyenteSrv.getDocumentos({
            params: {
              filter: { fk_contribuyente: this.contribuyente.id_cliente },
            }
          })
          console.log(documentos)
          this.documentos = documentos;

          let resolucion: any = await this.contribuyenteSrv.getResolucion({
            id_component: myVarGlobals.fContribuyente,
            identifier: this.contribuyente.id_cliente
          });
          console.log(resolucion)
          this.contribuyente['resolucion'] = resolucion.data;
          this.lcargando.ctlSpinner(false)

          // console.log(res.created_at.split('T')[0]);
          // console.log(res.supervivencia);
          console.log(res.contribuyente)
          if (res.contribuyente == 'Natural') {
            console.log('Cambia a Natrual', this.validadorNt);
            this.validadorRucCedu = true;
            // if(res.tipo_documento == "Cedula" || res.tipo_documento == "Pasaporte"){
            //   this.validadorRucCedu = true;
            // }else {
            //   this.validadorRucCedu = false;
            // }
            this.validadorNt = true;
            this.validadorJr = false;
            this.validadorNoDocumentoNt = true;
            this.validadorNoDocumentoJr = false;
            this.NoDocumento = this.contribuyente['num_documento']
            console.log('Cambia valor Natrual', this.validadorNt);
            if (res.fecha_nacimiento != null) {
              this.verificacionTerceraEdad(res.fecha_nacimiento);
            } else {
              this.toastr.info(
                "El contribuyente no tiene una fecha de nacimiento ingresada"
              );
            }

            this.n_supervivencia = this.contribuyente.supervivencia;
            this.contribuyente.supervivencia_fecha_registro = res.supervivencia_fecha_registro === null ? null : res.supervivencia_fecha_registro.split(' ')[0];





            console.log('Natural');
          } else if (res.contribuyente == 'Juridico' || res.contribuyente == 'Jurídico') {
            this.validadorJr = true;
            this.validadorNt = false;
            this.validadorNoDocumentoNt = false;
            this.validadorNoDocumentoJr = true;
            this.validadorRucCedu = true;
            this.NoDocumento = this.contribuyente['num_documento']
            console.log('Juridico');
          }
          if(res.relaciones != null){
            this.dataRelacion = res.relaciones
          }
          console.log(res.relaciones)
          console.log(this.dataRelacion)


          this.cargaDatosContribuyente(res);
          this.cargaDatosContribuyenteAnulados(res);
          this.novedadesCarga(res);
          this.cargarDocumentos();
          this.cargarDocumentosConvenio();

          this.commonVrs.contribAnexoLoad.next({ id_cliente: res.id_cliente, condi: 'all' });
          // console.log('Res Contribuyente',res);
          // console.log(this.permissions);
          this.commonVrs.searchDiscapContribu.next({ data: res, permissions: this.permissions });
          this.commonVrs.loadActivo.next({ id_cliente: res.id_cliente });


        }

        if (res.valid == 14) {
          console.log(res)
          this.relacion= []
          this.relacion.porcentaje_discapacidad = 0
          this.contriRelacionActive = res
          this.relacion.fk_contribuyente_relacion= res.id_cliente
          this.relacion.nombre_contribuyente = res.razon_social
          if(res.fecha_nacimiento!=undefined){
            this.relacion.fecha_nacimiento = moment(res.fecha_nacimiento).format('YYYY-MM-DD')
          }
          console.log(this.relacion)
        }

        console.log('Final ', this.validadorNt, this.contribuyente);


      });
    // console.log(this.conyugue);

    this.contribuyenteSrv.uploadResolucion$.pipe(takeUntil(this.onDestroy$)).subscribe(
      async () => {
        this.lcargando.ctlSpinner(true)
        try {
          this.mensajeSppiner = 'Cargando Resolucion'
          let resolucion: any = await this.contribuyenteSrv.getResolucion({
            id_component: myVarGlobals.fContribuyente,
            identifier: this.contribuyente.id_cliente
          });
          console.log(resolucion)
          this.contribuyente['resolucion'] = resolucion.data;
          //
          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error cargando Resolucion')
        }
      }
    )
    this.commonVrs.selectLote.pipe(takeUntil(this.onDestroy$)).subscribe(
       (res) => {
        console.log(res)
        this.lote = res
        let total = parseInt(res.valor_edificacion) + parseInt(res.valor_solar)
        this.lote.valor_comercial = total

        this.contriLoteActive = this.lote.cod_catastral

      });
  }

  limpiar() {
    this.ClearForm();
    this.locales = [];
    this.totalDeudas = 0;
    this.totalDeudasAnuladas = 0;
    this.solares = [];
    this.deudas = [];
    this.commonVrs.clearAnexos.next({})
  }

  novedadesCarga(data) {
    let dataNovedades = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
        data: data
      }
    }

    console.log(data);
    this.contribuyenteSrv.getSupervivencia(dataNovedades).subscribe(
      (res) => {

        // console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.novedades = res['data']['data'];
        } else {
          this.novedades = Object.values(res['data']['data']);
        }
        // this.novedades = res["data"]["data"]
        this.novedades.reverse()
        // this.novedades.sort(function (a, b) {
        //   if (a.fecha_registro < b.fecha_registro) {
        //     return 1;
        //   }
        //   if (a.fecha_registro > b.fecha_registro) {
        //     return -1;
        //   }
        //   // a must be equal to b
        //   return 0;
        // });
      }
    )
  }

  abrirModalSolares(solar, titulo, tipo) {
    const modalSolares = this.modalService.open(ModalSolaresComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    console.log(this.dataUser);
    modalSolares.componentInstance.contr = this.contribuyente;
    modalSolares.componentInstance.permisos = this.permissions;
    modalSolares.componentInstance.dataUser = this.dataUser.id_usuario;
    modalSolares.componentInstance.objSolar = solar;
    modalSolares.componentInstance.fTitle = titulo;
    modalSolares.componentInstance.tipoCont = tipo;



  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "far fa-trash", texto: "ELIMINAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
    ];

    this.vmButtons2 = [
      // {
      //   orig: "btnsContribuyente",
      //   paramAccion: "",
      //   boton: { icon: "far fa-search", texto: "BUSCAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-info boton btn-sm",
      //   habilitar: false,
      // },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fa fa-file-pdf", texto: "IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
        printSection: "Printsection", imprimir: true
      },

    ];

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      contribuyente: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    this.filterConvenio = {
      contribuyente: undefined,
      filterControl: ""
    }

    this.paginateConvenio = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }
    this.relacion  = {
      id_contribuyente_relacion: 0,
      fk_contribuyente: 0,
      fk_contribuyente_relacion: 0,
      nombre_contribuyente: "",
      fecha_nacimiento: '',
      tipo_relacion: null,
      tiene_discapacidad: "",
      porcentaje_discapacidad: 0
    }

    this.filter_estado_cuenta = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      concepto: null,
      estado: null
    }



    setTimeout(() => {
      this.validatePermission();
      this.getConceptos();
    }, 50);
  }

  calculoChecks() {
    let sumaChecks = 0;
    this.deudas.map((deuda) => {
      if (deuda.Check) {
        if (deuda.saldo == null || Number.isNaN(deuda.saldo)) {
          sumaChecks = 0;
          console.log(deuda.saldo);
        } else {
          if (deuda['tipo_documento'] != 'AN' && deuda['tipo_documento'] != 'BA') {
            sumaChecks += parseFloat(deuda.saldo)

            // Desglose
            this.desglose.valor += parseFloat(deuda.valor)
            this.desglose.interes += parseFloat(deuda.interes)
            this.desglose.multa += parseFloat(deuda.multa)
            this.desglose.descuento += parseFloat(deuda.descuento)
            this.desglose.exoneraciones += parseFloat(deuda.exoneraciones)
            this.desglose.recargo += parseFloat(deuda.recargo)
            this.desglose.coactiva += parseFloat(deuda.coactiva)
            this.desglose.saldo += parseFloat(deuda.saldo)
          } else if (deuda['tipo_documento'] == 'AN' || deuda['tipo_documento'] == 'BA') {

            sumaChecks = sumaChecks - parseFloat(deuda.saldo)
          }

          console.log(sumaChecks);
        }
      }

    })

    this.totalDeudasCheck = sumaChecks
  }

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa
    let params = {
      codigo: myVarGlobals.fContribuyente,
      id_rol: this.dataUser.id_rol,
    };

    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        // console.log(this.permissions);
        if (this.permissions.ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Clientes"
          );
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          setTimeout(() => {
            this.fillCatalog();
          }, 500);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }



  //Codigo para detalles pagos
  cargarDocumentos() {
    this.mensajeSppiner = "Cargando lista de documentos de pago...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
        contribuyente: this.contribuyente
      }
    }

    this.contribuyenteSrv.getRecDocumentos(data).subscribe(
      (res: any) => {

        console.log(res);
        Object.assign(this.paginate, { length: res.data.total })
        this.documentosDt = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data)
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getConceptos() {
    this.mensajeSppiner = 'Cargando Tipos de Reporte';
    this.lcargando.ctlSpinner(true);
    this.contribuyenteSrv.getConceptos().subscribe(
      (res: any) => {
         console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            codigo: element.codigo,
            nombre: element.nombre,
            id_concepto: element.id_concepto
          };
          this.conceptosList.push({ ...o });
        });
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

  viewPagosDet(documento: any) {
    const modal = this.modalService.open(ModalPagosDetComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.documento = documento
  }

  changePaginateDetallePago(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarDocumentos();
  }

  //////////////////////////////////////////////////////////////////////////



  // Arriendos Mostrar Pdf


  cargaAnexosTabla(params: any[]) {
    this.anexos = []
    params.forEach(a => {
      if (a !== undefined) {
        let anexo = {
          id: a.id_anexos,
          nombre: a.original_name,
          storageName: a.name,
          extension: a.original_extension,
          storage: a.storage,
          original_type: a.original_type
        }
        this.anexos.push({ ...anexo })
      }
    })
  }


  verAnexo(anexo) {
    console.log(anexo);
    let data = {
      storage: anexo.storage,
      name: anexo.storageName
    }

    this.contribuyenteSrv.downloadAnexo(data).subscribe(
      (resultado) => {
        const dialogRef = this.confirmationDialogService.openDialogMat(VistaArchivoComponent, {
          width: '1000px', height: 'auto',
          data: {
            titulo: 'Vista de archivo',
            dataUser: this.dataUser,
            objectUrl: URL.createObjectURL(resultado),
            tipoArchivo: anexo.original_type
          }
        })
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }

  ///////////////////////////////


  actualizarLocal(local) {
    const modal = this.modalService.open(ModalNuevolocalComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.contribuyente = this.contribuyente;
    modal.componentInstance.id_local = local.id_local;
    modal.componentInstance.nuevo = false;
    modal.componentInstance.permissions = this.permissions;
  }


  cargaDatosContribuyente(contribuyente) {
    // Obtener los locales comerciales del contribuyente
    this.hayContribuyente = true;
    let data = {
      contribuyente: contribuyente
    }
    this.locales = [];
    // this.inspecciones = [];
    this.mensajeSppiner = 'Cargando Locales...';
    this.lcargando.ctlSpinner(true);
    this.contribuyenteSrv.getLocalesComerciales(data).subscribe(
      res => {
        console.log("Trajo")
        res['data'].forEach(elem => {
          let obj = {
            id_local: elem.id_local,
            razon_social: elem.razon_social,
            // fk_tipo_negocio: elem.fk_tipo_negocio,
            fk_actividad_comercial: elem.fk_actividad_comercial,
            tipo_negocio: elem.tipo_negocio,
            sector: elem.fk_sector,
            grupo: elem.fk_grupo,
            fecha: elem.fecha,
            fecha_vencimiento: elem.vencimiento_contrato,
            estado: elem.estado,
            contrato: elem.contrato,
            tipo_local: elem.tipo_local,
            puesto_mercado: elem.puesto_mercado,
            fk_contrato: elem.fk_contrato,
            puesto_id: elem.fk_local,
          }
          this.locales.push({ ...obj });
        })
        console.log("Culmino")
        this.lcargando.ctlSpinner(false);
      },
      err => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Locales Comerciales')
      }
    );



    //Solares
    this.contribuyenteSrv.getPropiedades(contribuyente.id_cliente).subscribe(
      (res) => {
        console.log(res);
        if (res['data'].length > 0) {

          res['data'].forEach(e => {
            //Object.assign(e, e.propietarios.find(p => p.id_cliente == contribuyente.id_cliente))
            Object.assign(e, {
              propietario: e.propietarios.find(p => p.id_cliente == contribuyente.id_cliente),
              valor_comercial: e.avaluo
            })


          });
          this.solares = res['data'];
          // console.log(res);
          // this.calculoValorComercial()
          // this.propiedades = res['data']
          // this.codCastDisabled = false;
          this.lcargando.ctlSpinner(false);
        } else {
          this.lcargando.ctlSpinner(false);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(error.error.message, 'Error cargando Propiedades')
      }
    );

    //Estado de cuenta
    this.contribuyenteSrv.getDeudas({ id_contribuyente: contribuyente.id_cliente }).subscribe(
      res2 => {
         console.log(res2);
        this.deudas = res2["data"]['deudas'];
        this.lcargando.ctlSpinner(false);
        this.calcularTotal();
        this.vmButtons2[0].habilitar = false;
      },
      err => {
        this.toastr.error(err.error);
        this.lcargando.ctlSpinner(false);
      }
    );

    //Rentas
    this.filter.contribuyente = contribuyente
    this.cargaContratos()


  }

  cargaDatosContribuyenteAnulados(contribuyente) {
    // Obtener los locales comerciales del contribuyente
    let data = {
      contribuyente: contribuyente
    }
    this.locales = [];
    // this.inspecciones = [];
    this.mensajeSppiner = 'Cargando Locales...';
    this.lcargando.ctlSpinner(true);
    this.contribuyenteSrv.getLocalesComerciales(data).subscribe(
      res => {
        console.log("Trajo")
        res['data'].forEach(elem => {
          let obj = {
            id_local: elem.id_local,
            razon_social: elem.razon_social,
            // fk_tipo_negocio: elem.fk_tipo_negocio,
            fk_actividad_comercial: elem.fk_actividad_comercial,
            tipo_negocio: elem.tipo_negocio,
            sector: elem.fk_sector,
            grupo: elem.fk_grupo,
            fecha: elem.fecha,
            fecha_vencimiento: elem.vencimiento_contrato,
            estado: elem.estado,
            contrato: elem.contrato,
            tipo_local: elem.tipo_local,
            puesto_mercado: elem.puesto_mercado,
            fk_contrato: elem.fk_contrato,
            puesto_id: elem.fk_local,
          }
          this.locales.push({ ...obj });
        })
        console.log("Culmino")
        this.lcargando.ctlSpinner(false);
      },
      err => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Locales Comerciales')
      }
    );



    //Solares
    this.contribuyenteSrv.getPropiedades(contribuyente.id_cliente).subscribe(
      (res) => {
        console.log(res);
        if (res['data'].length > 0) {
          res['data'].forEach(e => {
            //Object.assign(e, e.propietarios.find(p => p.id_cliente == contribuyente.id_cliente))
            Object.assign(e, {
              propietario: e.propietarios.find(p => p.id_cliente == contribuyente.id_cliente),
              valor_comercial: e.avaluo
            })

          });
          this.solares = res['data'];
          // console.log(res);
          // this.calculoValorComercial()
          // this.propiedades = res['data']
          // this.codCastDisabled = false;
          this.lcargando.ctlSpinner(false);
        } else {
          this.lcargando.ctlSpinner(false);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(error.error.message, 'Error cargando Propiedades')
      }
    );

    //Estado de cuenta
    this.contribuyenteSrv.getDeudasAnuladas({ id_contribuyente: contribuyente.id_cliente }).subscribe(
      res2 => {
        // console.log(res2);
        this.deudasAnuladas = res2["data"]['deudas'];
        this.lcargando.ctlSpinner(false);
        this.calcularTotalAnuladas();
        this.vmButtons2[0].habilitar = false;
      },
      err => {
        this.toastr.error(err.error);
        this.lcargando.ctlSpinner(false);
      }
    );

    //Rentas
    this.filter.contribuyente = contribuyente
    this.cargaContratos()


  }

  cargarDeudas(){
     //Estado de cuenta
     let data = {
      id_contribuyente: this.contribuyente.id_cliente,
      filter: this.filter_estado_cuenta
     }
     this.mensajeSppiner = 'Cargando Deudas';
    this.lcargando.ctlSpinner(true);
     this.contribuyenteSrv.getDeudas(data).subscribe(
      res2 => {
        this.lcargando.ctlSpinner(false);
         console.log(res2);
        this.deudas = res2["data"]['deudas'];
        this.calcularTotal();
        this.vmButtons2[0].habilitar = false;
      },
      err => {
        this.toastr.error(err.error);
        this.lcargando.ctlSpinner(false);
      }
    );
  }

  // Obtener convenios
  cargarDocumentosConvenio() {
    this.mensajeSppiner = "Cargando lista de documentos de pago...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filterConvenio,
        paginate: this.paginateConvenio,
      },
      codigo: "CO",
      fk_contribuyente: this.contribuyente['id_cliente']
    }

    this.contribuyenteSrv.getRecDocumentosConve(data).subscribe(
      (res) => {

        console.log(res);

        this.convenios = res['data'];
        this.paginateConvenio.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.convenios = res['data']['data'];
        } else {
          this.convenios = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  // Paginacion convenio de pago
  changePaginateConvenio(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginateConvenio, newPaginate);
    this.cargarDocumentosConvenio();
  }


  // Modal de detalles convenio
  modalDetallesConvenio(item) {
    const modal = this.modalService.open(ModalConvenioComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.detalles = item['detalles'];
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargaContratos();
  }


  changePaginateNovedades(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.novedadesCarga(this.contribuyente);
  }



  validacionContribu() {

    this.mensajeSppiner = "Cargando lista de Contribuyentes...";
    this.lcargando.ctlSpinner(true);
    if (!this.NoDocumento) {
      this.filter['num_documento'] = 'x'
    } else {
      this.filter['num_documento'] = this.NoDocumento

    }

    if (this.tipoPersona != undefined) {
      if (this.tipoDocumento == 'Cedula') {
        if (this.tipoPersona == "Natural") {
          console.log('Cedular Natural');
          this.contribuyente['cedula'] = this.NoDocumento
          this.contribuyente['ruc'] = null
          this.contribuyente['num_documento'] = this.NoDocumento
          this.validadorRucCedu = true;
          if (this.NoDocumento.length < 10) {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "Atención!!",
              text: "Ingrese 10 digitos para la cedula",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            })
            return
          } else {
            this.buscarContribuyente()
          }

        }


      } else if (this.tipoDocumento == 'Ruc') {
        if (this.tipoPersona == "Natural") {
          this.contribuyente['ruc'] = this.NoDocumento

          this.contribuyente['num_documento'] = this.NoDocumento
          this.validadorRucCedu = true;
          this.contribuyente.cedula = this.contribuyente['ruc'].substring(0, this.contribuyente['ruc'].length - 3)
          if (this.NoDocumento.length < 13) {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "Atención!!",
              text: "Ingrese 13 digitos para el Ruc",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {

            });
          } else {
            this.buscarContribuyente()
          }
        } else {
          this.contribuyente['num_documento'] = this.NoDocumento
          // this.contribuyente['num_documento'] = null
          this.validadorRucCedu = true;
          if (this.NoDocumento.length < 13) {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "Atención!!",
              text: "Ingrese 13 digitos para el Ruc",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {

            });
          } else {
            this.buscarContribuyente()
          }
        }

      } else if (this.tipoDocumento == 'Pasaporte') {
        this.contribuyente['ruc'] = null;
        this.contribuyente['cedula'] = this.NoDocumento;
        this.contribuyente['num_documento'] = this.NoDocumento;
        this.validadorRucCedu = true;
        // this.contribuyente['num_documento'] = this.NoDocumento
        this.buscarContribuyente();
        // if (this.NoDocumento.length < 18) {
        //   this.lcargando.ctlSpinner(false);
        //   Swal.fire({
        //     title: "Atención!!",
        //     text: "Ingrese 18 digitos para el Pasaporte",
        //     icon: "warning",
        //     confirmButtonColor: "#d33",
        //     confirmButtonText: "Ok",
        //   }).then((result) => {

        //   });
        // } else {

        // }

        this.NOCedula = 18
      }
    } else {
      this.lcargando.ctlSpinner(false);
      Swal.fire({
        title: "Atención!!",
        text: "Ingrese el tipo de contribuyente",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "Ok",
      }).then((result) => {

      });
      // this.toastr.info('Ingrese el tipo de contribuyente');
    }
  }


  buscarContribuyente() {
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    console.log(data);
    console.log(this.tipoPersona);
    if (this.tipoPersona != undefined) {
      this.contribuyenteSrv.getContribuyentesByFilter(data).subscribe(
        (res) => {
          console.log(res["data"]);
          this.lcargando.ctlSpinner(false);
          if (res["data"]['data'].length == 0) {
            // this.toastr.info("El contribuyente no se encuentra registrado");
            Swal.fire({
              title: "El contribuyente no se encuentra registrado",
              icon: "success",
              // confirmButtonColor: "#d33",
              confirmButtonText: "Continuar",
            })
            this.validacionBusquedaContri = true
            if (this.tipoPersona === 'Natural') {
              this.validadorNt = true;
              this.validadorJr = false;
              this.validadorNoDocumentoNt = true;
              this.validadorNoDocumentoJr = false;
            } else if (this.tipoPersona == 'Jurídico') {
              this.validadorJr = true;
              this.validadorNt = false;
              this.validadorNoDocumentoNt = false;
              this.validadorNoDocumentoJr = true;
            }
            this.vmButtons[2].habilitar = false;
          } else {
            Swal.fire({
              title: "Atención!!",
              text: "El contribuyente ya se encuentra registrado",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "Ok",
            })
            this.vmButtons[1].habilitar = false;
            this.vmButtons[2].habilitar = true;
            // this.toastr.info('El contribuyente ya se encuentra registrado');

          }



        },
        (error) => {
          console.log(error)
          this.lcargando.ctlSpinner(false);
          this.toastr.info('El contribuyente no se encuentra registrado');
        }
      );
    } else {
      this.lcargando.ctlSpinner(false);
      this.toastr.info('Ingrese el tipo de contribuyente');
    }
  }


  ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  //Sector de acuerdo a zona
  cambioZona(event) {
    // console.log(event);

    this.contribuyente.codigo_sector = null


    // console.log(this.catalog.sector);
    this.sector = this.catalog.sector.filter(e => e.grupo == event);
    // console.log(this.sector);

  }


  verificacionTerceraEdad(event) {
    // console.log(event);
    let fecha = event.split('-')
    let actualyear = new Date().getFullYear()
    let anio = actualyear - parseInt(fecha[0])
    let mes = (new Date().getMonth() + 1) >= parseInt(fecha[1])
    let dia = (new Date().getDate()) >= parseInt(fecha[2])
    // console.log(mes);
    // console.log(dia);


    if (anio >= 65) {

      if ((new Date().getMonth() + 1) > parseInt(fecha[1])) {
        this.contribuyente['tercera_edad'] = 'SI'
        this.n_supervivencia = ''
        this.superValid = false
        this.edadContribuyente = anio
        // console.log('Mayor a mes');

      } else if ((new Date().getMonth() + 1) == parseInt(fecha[1])) {
        if (dia) {
          this.contribuyente['tercera_edad'] = 'SI'
          this.n_supervivencia = ''
          this.superValid = false
          this.edadContribuyente = anio
          // console.log('Mayor mes y dia');
        } else {
          this.contribuyente['tercera_edad'] = 'NO'
          this.n_supervivencia = 'N'
          this.superValid = true
          this.edadContribuyente = (anio - 1)
        }
      } else {
        this.contribuyente['tercera_edad'] = 'NO'
        this.n_supervivencia = 'N'
        this.superValid = true
        this.edadContribuyente = (anio - 1)
        console.log(anio - 1);
      }

      // this.contribuyente['tercera_edad'] = 'SI'
      // console.log('Mayor mes y dia');
      // console.log(anio);
    } else {
      if ((new Date().getMonth() + 1) > parseInt(fecha[1])) {
        this.contribuyente['tercera_edad'] = 'NO'
        this.n_supervivencia = 'N'
        this.superValid = true
        this.edadContribuyente = anio
        console.log('Mayor a mes');

      } else if ((new Date().getMonth() + 1) == parseInt(fecha[1])) {
        if (dia) {
          this.contribuyente['tercera_edad'] = 'NO'
          this.n_supervivencia = 'N'
          this.superValid = true
          this.edadContribuyente = anio
          console.log('Mayor mes y dia');
        } else {
          this.contribuyente['tercera_edad'] = 'NO'
          this.n_supervivencia = 'N'
          this.superValid = true
          this.edadContribuyente = (anio - 1)
        }
      } else {
        this.contribuyente['tercera_edad'] = 'NO'
        this.n_supervivencia = 'N'
        this.superValid = true
        this.edadContribuyente = (anio - 1)
        console.log(anio - 1);
      }
      // this.contribuyente['tercera_edad'] = 'NO'
      // this.edadContribuyente = (anio-1)
      // console.log(anio - 1);
    }

  }

  async cargaResolucionTercera(archivos: FileList | null) {
    if (archivos && archivos.length > 0) {
      if (archivos[0].type !== 'application/pdf') {
        // Como llegamos aqui?!
        this.toastr.warning('Ha escogido un archivo invalido', 'Resolucion Tercera Edad')
        return;
      }

      if (this.contribuyente.id_cliente) {
        const result = await Swal.fire({
          titleText: 'Resolucion Tercera Edad',
          text: 'Esta seguro/a de subir este archivo como Resolucion por Tercera Edad?',
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar'
        })
        if (result.isConfirmed) { this.subirResolucionTercera(archivos[0]) }
      } else {
        this.cargaArchivo(archivos)
      }
    }
  }

  subirResolucionTercera(archivo: File) {
    this.lcargando.ctlSpinner(true)
    this.mensajeSppiner = 'Almacenando Resolucion'
    let data = {
      // Informacion para almacenamiento de anexo
      module: this.permissions.id_modulo,
      component: myVarGlobals.fContribuyente,
      identifier: this.contribuyente.id_cliente,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fContribuyente,
      accion: `Carga de Resolucion de Tercera Edad para Contibuyente ${this.contribuyente.id_cliente}`,
      ip: this.commonServices.getIpAddress(),
      custom1: 'Resolucion',
    }

    this.contribuyenteSrv.uploadAnexo(archivo, data).toPromise().then(
      (res: any) => {
        console.log(res)
        this.lcargando.ctlSpinner(false)
        Swal.fire('Resolucion almacenada correctamente', '', 'success').then(() => this.contribuyenteSrv.uploadResolucion$.emit())
      }
    )
  }

  descargarResolucion() {
    let data = {
      storage: this.contribuyente.resolucion.storage,
      name: this.contribuyente.resolucion.name
    }

    this.contribuyenteSrv.downloadAnexo(data).subscribe(
      (resultado) => {
        const url = URL.createObjectURL(resultado)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', this.contribuyente.resolucion.original_name)
        link.click()
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }

  verResolucion() {
    let data = {
      storage: this.contribuyente.resolucion.storage,
      name: this.contribuyente.resolucion.name
    }

    this.contribuyenteSrv.downloadAnexo(data).subscribe(
      (resultado) => {
        const dialogRef = this.confirmationDialogService.openDialogMat(VistaArchivoComponent, {
          width: '1000px', height: 'auto',
          data: {
            titulo: 'Vista de archivo',
            dataUser: this.dataUser,
            objectUrl: URL.createObjectURL(resultado),
            tipoArchivo: this.contribuyente.resolucion.original_type
          }
        })
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }

  async deleteResolucion() {
    let result = await Swal.fire({
      title: 'Eliminar Resolucion',
      text: 'Seguro/a desea eliminar la resolucion para este contribuyente?',
      icon: 'question',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      let data = {
        // Data del archivo
        id_anexo: this.contribuyente.resolucion.id_anexos,
        component: myVarGlobals.fContribuyente,
        module: this.permissions.id_modulo,
        identifier: this.contribuyente.resolucion.identifier,
        // Datos para registro en Bitacora
        // cambiar con el que haga despues para rentas
        id_controlador: myVarGlobals.fContribuyente,  // TODO: Actualizar cuando formulario ya tenga un ID
        accion: `Borrado de Anexo ${this.contribuyente.resolucion.id_anexos}`,
        ip: this.commonServices.getIpAddress()
      }

      this.mensajeSppiner = 'Eliminando Resolucion'
      this.lcargando.ctlSpinner(true)
      this.contribuyenteSrv.deleteAnexo(data).subscribe(
        res => {
          this.lcargando.ctlSpinner(false)
          this.contribuyente.resolucion = null
          Swal.fire('Resolucion eliminada correctamente', '', 'success')
        },
        err => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error eliminando Resolucion')
        }
      )
    }
  }

  cargaContratos() {
    let dataContrato = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }
    this.contribuyenteSrv.getContratosById(dataContrato).subscribe(res => {
      console.log('contribuyente', res)
      this.contratos = []

      this.paginate.length = res['data']['total'];
      if (res['data']['current_page'] == 1) {
        res['data']['data'].map(dat => {

          let objeto = {
            mercado: dat['fk_mercado']['valor'],
            puesto: dat['fk_mercado_puesto']['descripcion'],
            numero_puesto: dat['fk_mercado_puesto']['numero_puesto'],
            tipo: dat['tipo_contrato'],
            numero_contra: dat['numero_contrato'],
            val_arriendo: dat['valor_arriendo'],
            val_garantia: dat['valor_garantia'],
            observacion: dat['observacion'],
            fecha_inicio: dat['fecha_inicio'],
            fecha_vence: dat['fecha_vencimiento']

          }

          this.contratos = [...this.contratos, objeto]

          this.selectAnexos.push(dat['anexos'][0]);


        })
        console.log(this.selectAnexos);
        this.cargaAnexosTabla(this.selectAnexos);
        // this.novedades = res['data']['data'];
      } else {
        Object.values(res['data']['data']).map(dat => {

          let objeto = {
            mercado: dat['fk_mercado']['valor'],
            puesto: dat['fk_mercado_puesto']['descripcion'],
            numero_puesto: dat['fk_mercado_puesto']['numero_puesto'],
            tipo: dat['tipo_contrato'],
            numero_contra: dat['numero_contrato'],
            val_arriendo: dat['valor_arriendo'],
            val_garantia: dat['valor_garantia'],
            observacion: dat['observacion'],
            fecha_inicio: dat['fecha_inicio'],
            fecha_vence: dat['fecha_vencimiento']

          }
          this.contratos = [...this.contratos, objeto]

        })
        // this.novedades = Object.values(res['data']['data']);
      }


    });
  }

  calculoValorComercial() {

    this.solares.map(data => {
      console.log(parseInt(data.valor_edificacion) + parseInt(data.valor_solar))
      let total = parseInt(data.valor_edificacion) + parseInt(data.valor_solar)
      this.valComercial.push(total)
    })
  }

  calcularTotal() {
    this.mensajeSppiner = 'Calculando total de las deudas...';
    this.lcargando.ctlSpinner(true);
    let total = 0;
    this.deudas.forEach(d => {
      if (d.estado == "A") {
        total += +d.saldo;
      }
    });
    this.totalDeudas = total;
    this.lcargando.ctlSpinner(false);
  }

  calcularTotalAnuladas() {
    this.mensajeSppiner = 'Calculando total de las deudas Anuladas...';
    this.lcargando.ctlSpinner(true);
    let total = 0;
    this.deudasAnuladas.forEach(d => {
      //console.log(this.deudasAnuladas);
      //if (d.estado == "A") {
      total += +d.saldo;
      //}
    });
    this.totalDeudasAnuladas = total;
    this.lcargando.ctlSpinner(false);
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.mensajeSppiner = "Cargando Catalogs";
    let data = {
      params: "'DOCUMENTO', 'PAIS', 'CIUDAD', 'PROVINCIA', 'GENERO','ESTADO CIVIL', 'REN_DISCAPACIDAD', 'REN_INSTITUCION_CREDITO', 'REN_TIPO_PERSONA_JURIDICA', 'REN_ESTADO_CONTRIBUYENTE', 'REN_ACTIVIDAD_AGROPECUARIA', 'CAT_ZONA','CAT_SECTOR','CON_RELACION'",
    };
    this.contribuyenteSrv.getCatalogs(data).subscribe(
      (res) => {
        //console.log(res['data']['RELACION']);
        this.catalog.documents = res["data"]["DOCUMENTO"];
        this.catalog.ciudad = res["data"]["CIUDAD"];
        this.catalog.pais = res["data"]["PAIS"];
        this.catalog.provincia = res["data"]["PROVINCIA"];
        this.catalog.genero = res['data']['GENERO'];
        this.catalog.estado_civil = res['data']['ESTADO CIVIL'];
        this.catalog.ren_discapacidad = res['data']['REN_DISCAPACIDAD'];
        this.catalog.ren_institucion_credito = res['data']['REN_INSTITUCION_CREDITO'];
        this.catalog.tipo_persona_juridica = res['data']['REN_TIPO_PERSONA_JURIDICA'];
        this.catalog.estado = res['data']['REN_ESTADO_CONTRIBUYENTE'];
        this.catalog.ag_actividad = res['data']['REN_ACTIVIDAD_AGROPECUARIA'];
        this.catalog.zona = res['data']['CAT_ZONA'];
        this.catalog.sector = res['data']['CAT_SECTOR'];
        this.catalog.tipo_relacion = res['data']['CON_RELACION'];

        // console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error?.message);
      }
    );

    this.contribuyenteSrv.getAgentRetencion({}).subscribe(
      (res: any) => {
        this.catalog.tipo_contribuyente = res['data']
      }
    )


  }

  onlyNumber(event): boolean {
    // console.log(event);
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }



  /* OnChange */
  docValidate(event) {
    document.getElementById("num_documentoumento").focus();
    if (event == "Cedula") {
      this.tamDoc = 10;
    } else if (event == "Ruc") {
      this.tamDoc = 13;
    } else if (event == "Pasaporte") {
      this.tamDoc = 12;
    }
  }

  metodoGlobal(event) {
    // console.log(event);
    switch (event.items.boton.texto) {
      case "NUEVO":
        this.ActivateForm()
        break;
      case "BUSCAR":
        this.showContribuyentes();
        break;
      case "GUARDAR":
        this.validateSaveContribuyente();
        break;
      case "MODIFICAR":
        this.validateUpdateContribuyente();
        break;
      case "CANCELAR":
        this.CancelForm();
        break;
      case "ELIMINAR":
        this.deleteContribuyente();
        break;
    }
  }

  deleteContribuyente() {
    // if (this.eliminar == "0") {
    //   this.toastr.info("usuario no tiene permiso para eliminar  registro");
    // } else {
    Swal.fire({
      title: "Atención!!",
      text: "Seguro desea eliminar el registro?",
      icon: "warning",
      confirmButtonColor: "#d33",
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.value) {
        this.lcargando.ctlSpinner(true);
        let data = {
          id_contribuyente: this.contribuyente.id_cliente,
          ip: this.commonServices.getIpAddress(),
          accion: "Eliminación de contribuyente",
          id_controlador: myVarGlobals.fContribuyente,
        };
        this.contribuyenteSrv.deleteContribuyente(data).subscribe(
          (res) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.success(res["message"]);
            this.clearFromAfterSave()


            // this.closeModal();
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        );
      }
    });
    // }
  }

  ActivateForm() {
    this.actions.new = true;
    this.actions.search = true;
    this.actions.add = false;
    this.actions.edit = true;
    this.actions.cancel = false;
    this.actions.delete = true;
    this.nuevoContribuyente = true

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = false;
    this.vmButtons[5].habilitar = true;

    // this.supplier.provincia = 0;
    // this.supplier.ciudad = 0

    // this.province = false;
    // this.city = false;

    this.contribuyente.tiene_convenio = 0

    this.commonServices.actionsClient.next(this.actions);
  }

  CancelForm() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea Cancelar.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = true;
        this.vmButtons[4].habilitar = true;

        this.nuevoContribuyente = false
        this.JuridicoLis = true;
        this.hayContribuyente = false;

        this.commonVrs.clearContact.next(this.actions);
        this.ClearForm();
        this.locales = [];
        this.totalDeudas = 0;
        this.solares = [];
        this.deudas = [];
        this.contratos = []
        this.actions.new = false
        this.commonVrs.clearContribu.next({})
        this.validadorNt = false;
        this.validadorJr = false;
        this.validadorNoDocumentoNt = true
        this.validadorNoDocumentoJr = false
        this.validacionBusquedaContri = false
        this.disabledRelacion = true
        this.disabledLotes= true
        this.NoDocumento = undefined
        this.edadContribuyente = undefined
        this.tipoPersona = undefined;
        this.superValid = true;
        this.novedades = []
        this.n_supervivencia = null

      }

    });

  }

  cancelFormWithout() {
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.commonVrs.clearContact.next(this.actions);
    this.ClearForm();
    this.locales = [];
    this.totalDeudas = 0;
    this.solares = [];
    this.deudas = [];
    this.contratos = []
    this.actions.new = false
    this.commonVrs.clearContribu.next({})
    this.validadorNt = false;
    this.validadorJr = false;
    this.validadorNoDocumentoNt = true
    this.validadorNoDocumentoJr = false
    this.validacionBusquedaContri = false
    this.disabledRelacion = true
    this.disabledLotes= true
    this.NoDocumento = undefined
    this.edadContribuyente = undefined
    this.tipoPersona = undefined;
    this.novedades = []
  }

  ClearForm() {
    this.contribuyente = { id_cliente: null, tipo_documento: 0, primer_nombre: '', segundo_nombre: '', primer_apellido: '', segundo_apellido: '' };
    this.detalle_contactos = [];
    this.detalle_edit = undefined;
    this.lote = { cod_catastral: '',cod_catastral_anterior: '',zona: '',sector: '',manzana: '',solar: '',area: '',valor_metro_cuadrado: 0,valor_solar: 0,valor_edificacion: 0,valor_comercial: 0,valor_hipoteca: 0,tipo_relacion: 0

    }

  }

  async validateSaveContribuyente() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea guardar el contribuyente?",
            "SAVE_VENDEDOR"
          );
        }
      });
    }
  }

  async validateUpdateContribuyente() {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para editar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea editar la información del contribuyente?",
            "EDIT_VENDEDOR"
          );
        }
      });
    }
  }

  validacionTipoPerson(event) {
    this.tipoPersona = event

    if (event === 'Jurídico') {
      this.JuridicoLis = false;
      this.contribuyente.tipo_documento = "Ruc"
      this.tipoDocumento = "Ruc"
      this.NOCedula = 13;

      this.changeMaxlength("Ruc");
    } else {
      this.JuridicoLis = true;
      this.contribuyente.tipo_documento = ""
    }

    // if (event == 'Cedula') {
    //   this.NOCedula = 10;
    // } else if (event == 'Ruc') {
    //   this.NOCedula = 13;
    // } else if (event == 'Pasaporte') {
    //   this.NOCedula = 18
    // }

  }

  validateNombres() {
    let flag = false;
    return new Promise((resolve, reject) => {

    })
  }


  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {

      if (this.validadorNt) {
        if (this.contribuyente.tipo_documento == 0) {
          this.toastr.info("Seleccione un tipo de documneto");
          flag = true;
        } else if (
          this.NoDocumento == "" ||
          this.NoDocumento == undefined
        ) {
          this.toastr.info("Ingrese un número de documento");
          flag = true;
        }
        else if (
          this.contribuyente.obligado_contabilidad == '' ||
          this.contribuyente.obligado_contabilidad == undefined
        ) {
          this.toastr.info("Ingrese el valor obligado a llevar contabilidad");
          flag = true;
        } else if (
          this.contribuyente.primer_nombre == '' ||
          this.contribuyente.primer_nombre == undefined
        ) {
          this.toastr.info("Ingrese el primer nombre");
          flag = true;
        }  else if (
          this.contribuyente.genero == '' ||
          this.contribuyente.genero == undefined
        ) {
          this.toastr.info("Ingrese el genero");
          flag = true;
        }
        else if (
          this.contribuyente.fecha_nacimiento == '' ||
          this.contribuyente.fecha_nacimiento == undefined
        ) {
          this.toastr.info("Ingrese la fecha de nacimiento");
          flag = true;
        }

        else if (
          this.contribuyente.estado_civil == '' ||
          this.contribuyente.estado_civil == undefined
        ) {
          this.toastr.info("Ingrese el estado civil");
          flag = true;
        }

        else if (
          this.contribuyente.direccion == "" ||
          this.contribuyente.direccion == undefined
        ) {
          this.toastr.info("Ingrese una dirección");
          flag = true;
        } else if (
          this.contribuyente.telefono == "" ||
          this.contribuyente.telefono == undefined
        ) {
          this.toastr.info("Ingrese teléfono");
          flag = true;
        } else if (
          this.contribuyente.provincia == "" ||
          this.contribuyente.provincia == undefined
        ) {
          this.toastr.info("Ingrese una provincia");
          flag = true;
        } else if (
          this.contribuyente.ciudad == "" ||
          this.contribuyente.ciudad == undefined
        ) {
          this.toastr.info("Ingrese una ciudad");
          flag = true;
        } else if (
          this.contribuyente.contribuyente == '' ||
          this.contribuyente.contribuyente == 0
        ) {
          this.toastr.info("Ingrese el tipo");
          flag = true;

        }

        else if (
          this.contribuyente.pais == '' ||
          this.contribuyente.pais == undefined
        ) {
          this.toastr.info("Ingrese el pais");
          flag = true;
        }

        // else if (
        //   (this.contribuyente.segundo_nombre == '' ||
        //   this.contribuyente.segundo_nombre == undefined )
        // ) {
        //   this.toastr.info("Ingrese el segundo nombre");
        //   flag = true;
        // } else if (
        //   this.contribuyente.primer_apellido == '' ||
        //   this.contribuyente.primer_apellido == undefined
        // ) {
        //   this.toastr.info("Ingrese el primer apellido");
        //   flag = true;
        // } else if (
        //   this.contribuyente.segundo_apellido == '' ||
        //   this.contribuyente.segundo_apellido == undefined
        // ) {
        //   this.toastr.info("Ingrese el segundo apellido");
        //   flag = true;
        // }

        else if (
          this.n_supervivencia == '' ||
          this.n_supervivencia == undefined
        ) {
          this.toastr.info("Escoga un valor en Supervivencia");
          flag = true;
        } else if (
          this.contribuyente.manzana == '' ||
          this.contribuyente.manzana == undefined
        ) {
          this.toastr.info("Escoga un valor en Manzana");
          flag = true;
        } else if (
          this.contribuyente.zona == '' ||
          this.contribuyente.zona == undefined
        ) {
          this.toastr.info("Escoga un valor en Zona");
          flag = true;
        } else if (
          this.contribuyente.correo_facturacion == '' ||
          this.contribuyente.correo_facturacion == undefined
        ) {
          this.toastr.info("Ingrese un valor en el campo e-mail");
          flag = true;
        }

        if(this.checkConyugue){
          if(this.datosConyugue.co_cedula == '' || this.datosConyugue.co_cedula == undefined  || this.datosConyugue.co_cedula == null){
            this.toastr.info("Ingrese una Cédula en la sección conyugue");
            flag = true;
          }
          else if(this.datosConyugue.co_primer_nombre== '' || this.datosConyugue.co_primer_nombre == undefined || this.datosConyugue.co_primer_nombre == null){
            this.toastr.info("Ingrese Primer nombre  en la sección conyugue");
            flag = true;
          }else if(this.datosConyugue.co_tiene_conyuge == '' || this.datosConyugue.co_tiene_conyuge == undefined || this.datosConyugue.co_tiene_conyuge == null){
            this.toastr.info("Ingrese Primer apellido en la sección conyugue");
            flag = true;
          }else if(this.datosConyugue.co_fecha_nacimiento == '' || this.datosConyugue.co_fecha_nacimiento == undefined || this.datosConyugue.co_fecha_nacimiento == null){
            this.toastr.info("Ingrese una Fecha de nacimiento en la sección conyugue");
            flag = true;
          }
        }

        if(this.checkEnfermedadCatastrofica){

          if(this.datosEnfermedadCatastrofica.en_tipo_enfermedad == '' || this.datosEnfermedadCatastrofica.en_tipo_enfermedad == undefined){
            this.toastr.info("Ingrese un Tipo de enfermedad en la sección de Enfermedad Catastrófica");
            flag = true;
          }
          else if(this.datosEnfermedadCatastrofica.en_resolucion == '' || this.datosEnfermedadCatastrofica.en_resolucion == undefined){
            this.toastr.info("Ingrese un No. Resolución en la sección de Enfermedad Catastrófica");
            flag = true;
          }else if(this.datosEnfermedadCatastrofica.en_fecha_resolucion == '' || this.datosEnfermedadCatastrofica.en_fecha_resolucion == undefined){
            this.toastr.info("Ingrese una Fecha de resolución en la sección de Enfermedad Catastrófica");
            flag = true;
          }else if(this.datosEnfermedadCatastrofica.en_persona_autoriza == '' || this.datosEnfermedadCatastrofica.en_persona_autoriza == undefined){
            this.toastr.info("Ingrese una Persona que autoriza en la sección de Enfermedad Catastrófica");
            flag = true;
          }else if(this.anexoEnfermedadCatastrofica == undefined &&  this.fileListEnfermedadCatastrofica == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Enfermedad Catastrófica");
            flag = true;
          }
          else if(this.anexoEnfermedadCatastrofica?.length == 0 &&  this.fileListEnfermedadCatastrofica == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Enfermedad Catastrófica");
            flag = true;
          }

        }



        if(this.checkDisca){
          if(this.datosDisca.di_tipo_discapacidad == undefined || this.datosDisca.di_tipo_discapacidad == 0){
            this.toastr.info("Ingrese un Tipo de discapacidad en la sección de Discapacidad");
            flag = true;
          }
          else if(this.datosDisca.di_porcentaje_discapacidad == '' || this.datosDisca.di_porcentaje_discapacidad == undefined){
            this.toastr.info("Ingrese un Porcentaje de discapacidad en la sección de Discapacidad");
            flag = true;
          }
          else if(this.datosDisca.di_resolucion == '' || this.datosDisca.di_resolucion == undefined){
            this.toastr.info("Ingrese un No. Resolución en la sección de Discapacidad");
            flag = true;
          }
          else if(this.datosDisca.di_fecha_resolucion == '' || this.datosDisca.di_fecha_resolucion == undefined){
            this.toastr.info("Ingrese una Fecha de resolución en la sección de Discapacidad");
            flag = true;
          }
          else if(this.datosDisca.di_persona_autoriza == '' || this.datosDisca.di_persona_autoriza == undefined){
            this.toastr.info("Ingrese una Persona que autoriza en la sección de Discapacidad");
            flag = true;
          }
          else if(this.anexoDisca == undefined &&  this.fileListDisca == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Discapacidad");
            flag = true;
          }
          else if(this.anexoDisca?.length == 0  &&  this.fileListDisca == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Discapacidad");
            flag = true;
          }
        }

        if(this.checkTutorApo){
          if(this.datosTutorApo.ap_cedula == undefined || this.datosTutorApo.ap_cedula == 0){
            this.toastr.info("Ingrese una Cédula en la sección de Tutor o Apoderado");
            flag = true;
          }
          else if(this.datosTutorApo.ap_primer_nombre == '' || this.datosTutorApo.ap_primer_nombre == undefined){
            this.toastr.info("Ingrese Primer Nombre en la sección de Tutor o Apoderado");
            flag = true;
          }
          else if(this.datosTutorApo.ap_primer_apellido == '' || this.datosTutorApo.ap_primer_apellido == undefined){
            this.toastr.info("Ingrese Primer Apellido en la sección de Tutor o Apoderado");
            flag = true;
          }
          else if(this.datosTutorApo.ap_catalogo == 0 || this.datosTutorApo.ap_catalogo == undefined ){
            this.toastr.info("Seleccione un Parentesco en la sección de Tutor o Apoderado");
            flag = true;
          }
          else if(this.datosTutorApo.ap_tipo_discapacidad == 0 || this.datosTutorApo.ap_tipo_discapacidad == undefined){
            this.toastr.info("Seleccione un Tipo de discapacidad en la sección de Tutor o Apoderado");
            flag = true;
          }
          else if(this.datosTutorApo.ap_porcentaje_discapacidad == 0 || this.datosTutorApo.ap_porcentaje_discapacidad == undefined || this.datosTutorApo.ap_porcentaje_discapacidad == ''){
            this.toastr.info("Ingrese un Porcentaje de discapacidad en la sección de Tutor o Apoderado");
            flag = true;
          }
          else if(this.datosTutorApo.ap_resolucion == 0 || this.datosTutorApo.ap_resolucion == undefined || this.datosTutorApo.ap_resolucion == ''){
            this.toastr.info("Ingrese un No. de Resolución en la sección de Tutor o Apoderado");
            flag = true;
          }
          else if(this.datosTutorApo.ap_fecha_resolucion == undefined || this.datosTutorApo.ap_fecha_resolucion == ''){
            this.toastr.info("Ingrese una Fecha de Resolución en la sección de Tutor o Apoderado");
            flag = true;
          }
          else if(this.datosTutorApo.ap_persona_autoriza == undefined || this.datosTutorApo.ap_persona_autoriza == ''){
            this.toastr.info("Ingrese una Persona que autoriza en la sección de Tutor o Apoderado");
            flag = true;
          }
          else if(this.anexoTutorApo == undefined &&  this.fileListTutorApo == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Tutor o Apoderado");
            flag = true;
          }
          else if(this.anexoTutorApo?.length == 0  &&  this.fileListTutorApo == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Tutor o Apoderado");
            flag = true;
          }
        }


        if(this.checkPresHipo){
          if(this.datosPresHipo.ph_valor_credito == undefined || this.datosPresHipo.ph_valor_credito == 0 || this.datosPresHipo.ph_valor_credito == ""){
            this.toastr.info("Ingrese un Valor Crédito en la sección de Préstamo Hipotecario");
            flag = true;
          }
          else if(this.datosPresHipo.ph_institucion_credito == undefined || this.datosPresHipo.ph_institucion_credito == 0 || this.datosPresHipo.ph_institucion_credito == ""){
            this.toastr.info("Ingrese una Institución de Crédito en la sección de Préstamo Hipotecario");
            flag = true;
          }
          else if(this.datosPresHipo.ph_fecha_inicio == undefined || this.datosPresHipo.ph_fecha_inicio == 0 || this.datosPresHipo.ph_fecha_inicio == ""){
            this.toastr.info("Ingrese una Fecha de Inicio en la sección de Préstamo Hipotecario");
            flag = true;
          }
          else if(this.datosPresHipo.ph_fecha_fin == undefined || this.datosPresHipo.ph_fecha_fin == 0 || this.datosPresHipo.ph_fecha_inicio == ""){
            this.toastr.info("Ingrese una Fecha de Fin en la sección de Préstamo Hipotecario");
            flag = true;
          }
          else if(this.datosPresHipo.ph_resolucion == undefined || this.datosPresHipo.ph_resolucion == 0 || this.datosPresHipo.ph_resolucion == ""){
            this.toastr.info("Ingrese un No. Resolución en la sección de Préstamo Hipotecario");
            flag = true;
          }
          else if(this.datosPresHipo.ph_fecha_resolucion == undefined || this.datosPresHipo.ph_fecha_resolucion == 0 || this.datosPresHipo.ph_fecha_resolucion == ""){
            this.toastr.info("Ingrese una Fecha de Resolución en la sección de Préstamo Hipotecario");
            flag = true;
          }
          else if(this.datosPresHipo.ph_persona_autoriza == undefined || this.datosPresHipo.ph_persona_autoriza == 0 || this.datosPresHipo.ph_persona_autoriza == ""){
            this.toastr.info("Ingrese una Persona que autoriza en la sección de Préstamo Hipotecario");
            flag = true;
          }
          else if(this.anexoPresHipo == undefined &&  this.fileListPresHipo == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Préstamo Hipotecario");
            flag = true;
          }
          else if(this.anexoPresHipo?.length == 0  &&  this.fileListPresHipo == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Préstamo Hipotecario");
            flag = true;
          }
        }

        if(this.checkCoop){
          if(this.datosCoop.ta_ruc == undefined || this.datosCoop.ta_ruc == 0 || this.datosCoop.ta_ruc == ""){
            this.toastr.info("Ingrese un Ruc Cooperativa en la sección de Pertenece a Cooperativa (Taxis)");
            flag = true;
          }
          else if(this.datosCoop.ta_nombre_cooperativa == undefined || this.datosCoop.ta_nombre_cooperativa == 0 || this.datosCoop.ta_nombre_cooperativa == ""){
            this.toastr.info("Ingrese un Nombre Cooperativa en la sección de Pertenece a Cooperativa (Taxis)");
            flag = true;
          }
          else if(this.datosCoop.ta_resolucion == undefined || this.datosCoop.ta_resolucion == 0 || this.datosCoop.ta_resolucion == ""){
            this.toastr.info("Ingrese un No. Resolución en la sección de Pertenece a Cooperativa (Taxis)");
            flag = true;
          }
          else if(this.datosCoop.ta_fecha_resolucion == undefined || this.datosCoop.ta_fecha_resolucion == 0 || this.datosCoop.ta_fecha_resolucion == ""){
            this.toastr.info("Ingrese una Fecha de Resolución en la sección de Pertenece a Cooperativa (Taxis)");
            flag = true;
          }
          else if(this.datosCoop.ta_persona_autoriza == undefined || this.datosCoop.ta_persona_autoriza == 0 || this.datosCoop.ta_persona_autoriza == ""){
            this.toastr.info("Ingrese una Persona que autoriza en la sección de Pertenece a Cooperativa (Taxis)");
            flag = true;
          }
          else if(this.anexoCoop == undefined &&  this.fileListCoop == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Pertenece a Cooperativa (Taxis)");
            flag = true;
          }
          else if(this.anexoCoop?.length == 0  &&  this.fileListCoop == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Pertenece a Cooperativa (Taxis)");
            flag = true;
          }

        }

        if(this.checkArte){
          if(this.datosArte.ar_rama == undefined || this.datosArte.ar_rama == 0 || this.datosArte.ar_rama == ""){
            this.toastr.info("Ingrese una Rama en la sección de Artesano");
            flag = true;
          }
          else if(this.datosArte.ar_calificacion_numero == undefined || this.datosArte.ar_calificacion_numero == 0 || this.datosArte.ar_calificacion_numero == ""){
            this.toastr.info("Ingrese una Calificación Artesanal No. en la sección de Artesano");
            flag = true;
          }
          else if(this.datosArte.at_vigencia == undefined || this.datosArte.at_vigencia == 0 || this.datosArte.at_vigencia == ""){
            this.toastr.info("Ingrese una Fecha de Vigencia en la sección de Artesano");
            flag = true;
          }
          else if(this.datosArte.ar_resolucion == undefined || this.datosArte.ar_resolucion == 0 || this.datosArte.ar_resolucion == ""){
            this.toastr.info("Ingrese un No. Resolución en la sección de Artesano");
            flag = true;
          }
          else if(this.datosArte.ar_fecha_resolucion == undefined || this.datosArte.ar_fecha_resolucion == 0 || this.datosArte.ar_fecha_resolucion == ""){
            this.toastr.info("Ingrese una Fecha de Resolución en la sección de Artesano");
            flag = true;
          }
          else if(this.datosArte.ar_persona_autoriza == undefined || this.datosArte.ar_persona_autoriza == 0 || this.datosArte.ar_persona_autoriza == ""){
            this.toastr.info("Ingrese una Persona que autoriza en la sección de Artesano");
            flag = true;
          }
          else if(this.anexoArte == undefined &&  this.fileListArte == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Artesano");
            flag = true;
          }
          else if(this.anexoArte?.length == 0  &&  this.fileListArte == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Artesano");
            flag = true;
          }

        }

        if(this.checkTutorEnf){
          if(this.datosTutorEnf.ca_cedula == undefined || this.datosTutorEnf.ca_cedula == 0 || this.datosTutorEnf.ca_cedula == ""){
            this.toastr.info("Ingrese una Cédula en la sección de Tutor o apoderado (Enfermedades catastróficas)");
            flag = true;
          }
          else if(this.datosTutorEnf.ca_primer_nombre == undefined || this.datosTutorEnf.ca_primer_nombre == 0 || this.datosTutorEnf.ca_primer_nombre == ""){
            this.toastr.info("Ingrese el Primer Nombre en la sección de Tutor o apoderado (Enfermedades catastróficas)");
            flag = true;
          }
          else if(this.datosTutorEnf.ca_primer_apellido == undefined || this.datosTutorEnf.ca_primer_apellido == 0 || this.datosTutorEnf.ca_primer_apellido == ""){
            this.toastr.info("Ingrese el Primer Apellido en la sección de Tutor o apoderado (Enfermedades catastróficas)");
            flag = true;
          }
          else if(this.datosTutorEnf.ca_parentezco == undefined || this.datosTutorEnf.ca_parentezco == 0 || this.datosTutorEnf.ca_parentezco == ""){
            this.toastr.info("Seleccione un Parentesco en la sección de Tutor o apoderado (Enfermedades catastróficas)");
            flag = true;
          }
          else if(this.datosTutorEnf.ca_tipo_enfermedad == undefined || this.datosTutorEnf.ca_tipo_enfermedad == 0 || this.datosTutorEnf.ca_tipo_enfermedad == ""){
            this.toastr.info("Seleccione un Tipo de Enfermedad en la sección de Tutor o apoderado (Enfermedades catastróficas)");
            flag = true;
          }
          else if(this.datosTutorEnf.ca_resolucion == undefined || this.datosTutorEnf.ca_resolucion == 0 || this.datosTutorEnf.ca_resolucion == ""){
            this.toastr.info("Ingrese un No. Resolución en la sección de Tutor o apoderado (Enfermedades catastróficas)");
            flag = true;
          }
          else if(this.datosTutorEnf.ca_fecha_resolucion == undefined || this.datosTutorEnf.ca_fecha_resolucion == 0 || this.datosTutorEnf.ca_fecha_resolucion == ""){
            this.toastr.info("Ingrese una Fecha de Resolución en la sección de Tutor o apoderado (Enfermedades catastróficas)");
            flag = true;
          }
          else if(this.datosTutorEnf.ca_persona_autoriza == undefined || this.datosTutorEnf.ca_persona_autoriza == 0 || this.datosTutorEnf.ca_persona_autoriza == ""){
            this.toastr.info("Ingrese una Persona que autoriza en la sección de Tutor o apoderado (Enfermedades catastróficas)");
            flag = true;
          }
          else if(this.anexoTutorEnf == undefined &&  this.fileListTutorEnf == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Tutor o apoderado (Enfermedades catastróficas)");
            flag = true;
          }
          else if(this.anexoTutorEnf?.length == 0  &&  this.fileListTutorEnf == undefined){
            this.toastr.info("Debe seleccionar un archivo en la sección de Tutor o apoderado (Enfermedades catastróficas)");
            flag = true;
          }

        }




      } else if (this.validadorJr) {
        if (this.contribuyente.tipo_documento == 0) {
          this.toastr.info("Seleccione un tipo de documneto");
          flag = true;
        } else if (
          this.NoDocumento == "" ||
          this.NoDocumento == undefined
        ) {
          this.toastr.info("Ingrese un número de documento");
          flag = true;
        } else if (
          this.contribuyente.razon_social == "" ||
          this.contribuyente.razon_social == undefined
        ) {
          this.toastr.info("Ingrese una razon_social");
          flag = true;
        } else if (
          this.contribuyente.direccion == "" ||
          this.contribuyente.direccion == undefined
        ) {
          this.toastr.info("Ingrese una dirección");
          flag = true;
        } else if (
          this.contribuyente.telefono == "" ||
          this.contribuyente.telefono == undefined
        ) {
          this.toastr.info("Ingrese teléfono");
          flag = true;
        } else if (
          this.contribuyente.provincia == "" ||
          this.contribuyente.provincia == undefined
        ) {
          this.toastr.info("Ingrese una provincia");
          flag = true;
        } else if (
          this.contribuyente.ciudad == "" ||
          this.contribuyente.ciudad == undefined
        ) {
          this.toastr.info("Ingrese una ciudad");
          flag = true;
        } else if (
          this.contribuyente.contribuyente == '' ||
          this.contribuyente.contribuyente == 0
        ) {
          this.toastr.info("Ingrese el tipo de contribuyente");
          flag = true;

        } else if (
          this.contribuyente.nombre_comercial_cli == '' ||
          this.contribuyente.nombre_comercial_cli == undefined
        ) {
          this.toastr.info("Ingrese el nombre comercial");
          flag = true;

        } else if (
          this.contribuyente.tipo_persona_juridica == '' ||
          this.contribuyente.tipo_persona_juridica == undefined
        ) {
          this.toastr.info("Ingrese el tipo de persona jurídica");
          flag = true;

        } else if (
          this.contribuyente.contribuyente_especial == '' ||
          this.contribuyente.contribuyente_especial == undefined
        ) {
          this.toastr.info("Ingrese el contribuyente especial");
          flag = true;

        } else if (
          this.contribuyente.fecha_inicio_actividad == '' ||
          this.contribuyente.fecha_inicio_actividad == undefined
        ) {
          this.toastr.info("Ingrese la fecha de inicio de actividades");
          flag = true;

        } else if (
          this.contribuyente.correo_facturacion == '' ||
          this.contribuyente.correo_facturacion == undefined
        ) {
          this.toastr.info("Ingrese un valor en el campo e-mail");
          flag = true;
        } else if (
          this.contribuyente.cedula_representante_legal == '' ||
          this.contribuyente.cedula_representante_legal == undefined
        ) {
          this.toastr.info("Ingrese un valor en el campo e-mail");
          flag = true;
        }


      } else {
        this.toastr.info("Aun no ha realizado la validacion del contribuyente");
        flag = true;
      }


      if (this.contribuyente.contribuyente == 'Jurídico') {
        console.log('Otra validacion');
      }


      !flag ? resolve(true) : resolve(false);
    });
  }





  async confirmSave(message, action, infodev?: any) {
    let mensaje: string = ''
    if(this.validadorNt){
       if ((this.contribuyente.segundo_nombre == '' || this.contribuyente.segundo_nombre == undefined ) ) {
        mensaje += '* El campo Segundo Nombre esta vacio.<br>'

      }
       if ( this.contribuyente.primer_apellido == '' || this.contribuyente.primer_apellido == undefined) {
        mensaje += '* El campo Primer Apellido esta vacio.<br>'

      }
      if (this.contribuyente.segundo_apellido == '' || this.contribuyente.segundo_apellido == undefined) {
        mensaje += '* El campo Segundo Apellido esta vacio.<br>'
      }
    }

    if (mensaje.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        html:mensaje + '<br> Esta seguro que desea continuar y guardar sin rellenar estos campos? ',
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
           if (result.isConfirmed) {
            Swal.fire({
              title: "Atención!!",
              text: message,
              icon: "warning",
              showCancelButton: true,
              cancelButtonColor: "#DC3545",
              confirmButtonColor: "#13A1EA",
              confirmButtonText: "Aceptar",
            }).then((result) => {
              if (result.value) {
                if (action == "SAVE_VENDEDOR") {
                  this.saveContribuyente();
                } else if (action == "EDIT_VENDEDOR") {
                  this.updateContribuyente();
                }
              }
            });
           }
         });
    }else{
      Swal.fire({
        title: "Atención!!",
        text: message,
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#DC3545",
        confirmButtonColor: "#13A1EA",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.value) {
          if (action == "SAVE_VENDEDOR") {
            this.saveContribuyente();
          } else if (action == "EDIT_VENDEDOR") {
            this.updateContribuyente();
          }
        }
      });

    }




  }

  searchProvinces(event) {
    //console.log(event);
    this.contribuyenteSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.province = res['data'];

    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  changeMaxlength(event) {
    this.tipoDocumento = event
    if (event == 'Cedula') {
      this.NOCedula = 10;
    } else if (event == 'Ruc') {
      this.NOCedula = 13;
    } else if (event == 'Pasaporte') {
      this.NOCedula = 30
    }
  }

  searchCities(event) {
    //console.log(event);
    this.contribuyenteSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      //console.log(res);
      this.contribuyente.ciudad = undefined
      this.catalog.ciudad = res['data'];


    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  // boton(){
  //   console.log(this.dataUser);
  // }

  saveContribuyente() {

    console.log('guardando')
    this.contribuyente["ip"] = this.commonServices.getIpAddress();
    this.contribuyente["accion"] = `Ingreso de contribuyente`;
    this.contribuyente["id_controlador"] = myVarGlobals.fContribuyente;
    this.contribuyente["detalle"] = this.detalle_contactos;
    this.contribuyente["tipo_contribuyente"] = 1;
    this.contribuyente['id_usuario_creacion'] = this.dataUser.id_usuario;
    if (this.validadorNt) {
      this.contribuyente["save"] = 'Natural';
      this.contribuyente["razon_social"] = this.contribuyente.primer_apellido + ' ' + this.contribuyente.segundo_apellido + ' ' + this.contribuyente.primer_nombre + ' ' + this.contribuyente.segundo_nombre
      console.log(this.contribuyente["razon_social"]);
    } else if (this.validadorJr) {
      this.contribuyente["save"] = 'Juridico';
    }
    // this.contribuyente["con_tiene_conyugue"] = this.conyugue;
    // this.contribuyente["dt_tiene_discapacidad"] = this.discapcidad;
    // this.contribuyente["ap_tiene_apoderado"] = this.tutor;
    // this.contribuyente["ph_tiene_prestamo"] = this.prestamo;
    // this.contribuyente["ta_pertenece_cooperativa"] = this.perteneceTax;
    this.contribuyente['cod_catastro'] = this.contribuyente['zona'] + '-' + this.contribuyente['codigo_sector'] + '-' + this.contribuyente['manzana'] + '-' + this.contribuyente['solar']
    this.contribuyente.supervivencia = this.n_supervivencia
    // console.log('Guardando');
    console.log(this.contribuyente);
    this.contribuyenteSrv.saveContribuyente(this.contribuyente).subscribe(
      (res: any) => {
        this.toastr.success(res["message"]);
        console.log(res);
        this.clearFromAfterSave();
        // this.contribuyenteSpecial = res.data;
        this.commonVrs.saveContribu.next({ data: res.data, permissions: this.permissions, dataUser: this.dataUser })

      },
      (error) => {
        this.toastr.info(error.error.message);
        console.log(error.error.message);
      }
    );
  }

  clearFromAfterSave() {
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = false;
    this.vmButtons[4].habilitar = true;

    this.commonVrs.clearContact.next(this.actions);
    this.ClearForm();
    this.locales = [];
    this.totalDeudas = 0;
    this.solares = [];
    this.deudas = [];
    this.actions.new = false
    this.validadorJr = false;
    this.validadorNt = false;
    this.validacionBusquedaContri = true
    this.NoDocumento = undefined
    this.edadContribuyente = undefined
    this.tipoPersona = undefined;
    this.validadorNoDocumentoNt = true
    this.validadorNoDocumentoJr = false
  }

  updateContribuyente() {
    console.log('actualizando')
    this.contribuyente["ip"] = this.commonServices.getIpAddress();
    this.contribuyente["accion"] = `Actualización de contribuyente`;
    this.contribuyente["id_controlador"] = myVarGlobals.fContribuyente;
    this.contribuyente.supervivencia = this.n_supervivencia;

    if (this.detalle_edit != undefined) {
      this.contribuyente["detalle"] = this.detalle_edit.arraycontact;
      this.contribuyente["deleteContribuyente"] = this.detalle_edit.deleteContac;
      this.contribuyente["edit"] = true;
    } else {
      this.contribuyente["edit"] = false;
    }

    if (this.validadorNt) {
      this.contribuyente["razon_social"] = this.contribuyente.primer_apellido + ' ' + this.contribuyente.segundo_apellido + ' ' + this.contribuyente.primer_nombre + ' ' + this.contribuyente.segundo_nombre
      this.contribuyente['Update'] = 'all'
      console.log(this.contribuyente["razon_social"]);
    } else if (this.validadorJr) {
      this.contribuyente['Update'] = 'all_juri'
    }
    this.contribuyente.supervivencia = this.n_supervivencia
    this.contribuyente['cod_catastro'] = this.contribuyente['zona'] + '-' + this.contribuyente['codigo_sector'] + '-' + this.contribuyente['manzana'] + '-' + this.contribuyente['solar']
    console.log('Objeto', this.contribuyente);
    this.contribuyenteSrv.updateContribuyente(this.contribuyente).subscribe(
      (res) => {
        console.log(res);
        this.toastr.success(res["message"]);
        this.commonVrs.saveContribu.next({ data: this.contribuyente, permissions: this.permissions, dataUser: this.dataUser })
        this.commonVrs.clearAnexos.next({})
        this.clearFromAfterSave();
      },
      (error) => {
        console.log(error);
        this.toastr.info(error.error.message);
      }
    );
  }

  codigoCatastral(event) {
    if (!this.contribuyente['zona'] || !this.contribuyente['codigo_sector'] || !this.contribuyente['manzana']) {
      setTimeout(() => {
        this.contribuyente['solar'] = undefined;
      }, 100);

      return this.toastr.info('debe ingresar zona, sector y manzan primero')
    }
    this.contribuyente['cod_catastro'] = this.contribuyente['zona'] + '-' + this.contribuyente['codigo_sector'] + '-' + this.contribuyente['manzana'] + '-' + this.contribuyente['solar']
  }

  showContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    // console.log(this.permissions);
    modalInvoice.componentInstance.module_comp = myVarGlobals.fContribuyente;
    modalInvoice.componentInstance.permissions = this.permissions;
    //modalInvoice.componentInstance.eliminar = this.permissions.eliminar;
    modalInvoice.componentInstance.validacion = 1;
    this.ClearForm();
    this.limpiar()
  }

  expandDetalleConcepto(c) {
    const modalInvoice = this.modalService.open(ConceptoDetComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.concepto = c;
  }
  printTitulo(dt?: any) {
    console.log(dt)
    if (dt.tipo_documento == 'TA') {
      window.open(environment.ReportingUrl + "rep_rentas_tasas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }
    else if (dt.tipo_documento == 'PC') {
      window.open(environment.ReportingUrl + "rep_tasas_permiso_construccion.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }
    else if (dt.tipo_documento == 'CV') {
      window.open(environment.ReportingUrl + "rep_rentas_conceptos_varios.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }
    else if (dt.tipo_documento == 'AM') {
      window.open(environment.ReportingUrl + "rep_rentas_arriendo_mercado.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }
    else if (dt.tipo_documento == 'PL') {
      window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }
    else if (dt.tipo_documento == 'PU') {
      window.open(environment.ReportingUrl + "rpt_rentas_prediosUrbanos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }
    else if (dt.tipo_documento == 'CM') {
      window.open(environment.ReportingUrl + "report_tasa_centro_medico.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }
    else if (dt.tipo_documento == 'CU') {
      window.open(environment.ReportingUrl + "rep_rentas_cuota_convenio.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }
    else if (dt.tipo_documento == 'AR') {
      window.open(environment.ReportingUrl + "rep_rentas_arriendo_terreno.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }
    else if (dt.tipo_documento == 'EP') {
      window.open(environment.ReportingUrl + "rep_rentas_espectaculos_publicos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }
    else if (dt.tipo_documento == 'CT') {
      window.open(environment.ReportingUrl + "rep_rentas_compra_terreno.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }
    else {
      window.open(environment.ReportingUrl + "rep_rentas_generico.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.fk_documento + "&forma_pago=N/A", '_blank')
    }


  }

  /**
   * Almacena en FileList los archivos a ser enviados al backend
   * @param archivos Archivo seleccionado
   */
  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).')
      }, 50)
      // console.log(this.fileList)
    }
  }

  /**
   * Se encarga de enviar los archivos al backend para su almacenado
   * @param data Informacion del Formulario de Inspeccion (CAB)
   */
  uploadFile() {
    let data = {
      // Informacion para almacenamiento de anexo
      module: this.permissions.id_modulo,
      component: myVarGlobals.fContribuyente,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: this.contribuyente.id_cliente,
      custom1: 'Resolucion',
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fContribuyente,  // TODO: Actualizar cuando formulario ya tenga un ID
      accion: `Resolucion Tercera Edad ${this.contribuyente.id_cliente}`,
      ip: this.commonServices.getIpAddress()
    }

    this.UploadService(this.fileList[0], data)

    // for (let i = 0; i < this.fileList.length; i++) {
    //   console.log('File', data);
    //   this.UploadService(this.fileList[i], data);
    // }
    this.lcargando.ctlSpinner(false)
  }

  /**
   * Envia un archivo al backend
   * @param file Archivo
   * @param payload Metadata
   */
  UploadService(file, payload?: any): void {
    this.contribuyenteSrv.uploadAnexo(file, payload).subscribe(
      res => {
        this.commonVrs.contribAnexoLoad.next({ id_cliente: this.contribuyente.id_cliente })
        this.fileList = undefined
      },
      err => {
        console.log(err.error.message);
        this.toastr.info(err.error.message, 'Error cargando Anexos');
      })
  }

    handleChild(event){
      console.log(event)
    }

    guardarRelaciones(){
      if(this.contribuyente['id_cliente'] == undefined){
        this.toastr.info("Debe tener un Contribuyente seleccionado para guardar una relación")
      }else if(this.dataRelacion.length == 0){
        this.toastr.info("Debe agregar al menos una relación")
      }
      else{
        this.lcargando.ctlSpinner(true)
        this.mensajeSppiner = 'Guaradando Relaciones...'

        let data ={
          relaciones: this.dataRelacion,
          eliminar_relacion: this.relacionesIds
        }

        this.contribuyenteSrv.saveContribuyenteRelaciones(data).subscribe(
          (res: any) => {
              if (res["status"] == 1) {
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                    icon: "success",
                    title: "Relación guardada con éxito",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                });
              } else {
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
            console.log(res);
          },
          (error) => {
            this.toastr.info(error.error.message);
            console.log(error.error.message);
          }
        );
      }


    }

    validarRelacion(){

      console.log('valida datos')
      let mensaje: string = ''

         if ((this.relacion.nombre_contribuyente== '' || this.relacion.nombre_contribuyente == undefined ) ) {
          mensaje += '* El campo Nombres Completos esta vacio.<br>'

        }
        //  if ( this.relacion.fecha_nacimiento == '' || this.relacion.fecha_nacimiento== undefined) {
        //   mensaje += '* El campo Fecha Nacimiento esta vacio.<br>'

        // }
        if (this.relacion.tipo_relacion == 0 || this.relacion.tipo_relacion == undefined) {
          mensaje += '* Debe seleccionar un tipo de relación.<br>'
        }
        if (this.relacion.discapacidad == 0 || this.relacion.discapacidad == undefined) {
          mensaje += '* Debe seleccionar si tiene discapacidad.<br>'
        }
        if (this.relacion.discapacidad == 'S' && (this.relacion.porcentaje_discapacidad== undefined || this.relacion.porcentaje_discapacidad==0)) {
          mensaje += '* Debe ingresar un porcentaje de discapacidad.<br>'
        }

        if (mensaje.length > 0) {
          console.log('mensaje')
          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            html:mensaje,
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
          })
        }else{
          console.log('agrega datos')
          this.agregarRelacion(this.relacion)
        }
    }
    agregarRelacion(data){
      console.log(data)
      if(this.dataRelacion.length > 0 ){
       let filter_relacion =  this.dataRelacion.filter(e => e.fk_contribuyente_relacion == data.fk_contribuyente_relacion)
       if(filter_relacion.length > 0){
        this.toastr.warning("No puede agregar el contribuyente porque ya existe en la lista")
        return;
       }else if(data.fk_contribuyente_relacion == this.contribuyente['id_cliente']){
        this.toastr.warning("No puede agregarse el mismo contribuyente como una relación")
       }
       else{
        let obj ={
          id_contribuyente_relacion:0,
          fk_contribuyente: this.contribuyente['id_cliente'],
          fk_contribuyente_relacion: data.fk_contribuyente_relacion,
          nombres_completos:data.nombre_contribuyente,
          fecha_nacimiento:data.fecha_nacimiento,
          tipo_relacion:data.tipo_relacion,
          discapacidad:data.discapacidad,
          porcentaje_discapacidad:data.porcentaje_discapacidad
        }
        this.dataRelacion.push(obj)
        console.log(this.dataRelacion)
       }
      }else{
        let obj ={
          id_contribuyente_relacion:0,
          fk_contribuyente: this.contribuyente['id_cliente'],
          fk_contribuyente_relacion: data.fk_contribuyente_relacion,
          nombres_completos:data.nombre_contribuyente,
          fecha_nacimiento:data.fecha_nacimiento,
          tipo_relacion:data.tipo_relacion,
          discapacidad:data.discapacidad,
          porcentaje_discapacidad:data.porcentaje_discapacidad
        }
        this.dataRelacion.push(obj)
        console.log(this.dataRelacion)
      }
    }
    expandListContribuyentes() {
      if (this.permissions.consultar == "0") {
        this.toastr.warning("No tiene permisos consultar Contribuyentes.");
      } else {
        const modalInvoice = this.modalService.open(ModalContribuyentesComponent,{
          size:"xl",
          backdrop: "static",
          windowClass: "viewer-content-general",
        });
        modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
        modalInvoice.componentInstance.permissions = this.permissions;
        modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
        modalInvoice.componentInstance.validacion = 14;
      }
    }

    expandListLotes(){
      if (this.permissions.consultar == "0") {
        this.toastr.warning("No tiene permisos consultar Lotes.");
      } else {
        const modalInvoice = this.modalService.open(ConsultaLotesComponent,{
          size:"xl",
          backdrop: "static",
          windowClass: "viewer-content-general",
        });
        modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
        modalInvoice.componentInstance.permissions = this.permissions;
        modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      }
    }

    validarLote(){
      console.log('valida datos')
      let mensaje: string = ''

        if ((this.lote.tipo_relacion== 0 || this.lote.tipo_relacion == undefined )) {
          mensaje += '* Debe seleccionar un tipo de relación.<br>'
        }

        if (mensaje.length > 0) {
          console.log('mensaje')
          this.toastr.warning(mensaje, 'Validacion de Datos', { enableHtml: true})
          return;

        }else{
          console.log('agrega datos')
          this.guardarLote(this.lote)
        }
    }

    guardarLote(data){

      let filtro_solares = []
      filtro_solares = this.solares.filter(e => e.id == data.id)
      if(filtro_solares.length > 0){
        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          html: "El lote que desea guardar ya se encuentra asignado a este Contribuyente ",
          showCloseButton: true,
          showCancelButton: false,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        })
      }else {
        if(this.contribuyente['id_cliente'] == undefined){
          this.toastr.info("Debe tener un Contribuyente seleccionado para guardar una lote")
        }else{


          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            html:' Esta seguro que desea continuar y guardar un lote? ',
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
          }).then((result) => {
               if (result.isConfirmed) {
                this.lcargando.ctlSpinner(true)
                this.mensajeSppiner = 'Guaradando Lote...'

                let data ={
                  id_contribuyente: this.contribuyente['id_cliente'],
                  lote: this.lote,
                }

                this.contribuyenteSrv.saveContribuyenteLotes(data).subscribe(
                  (res: any) => {
                      if (res["status"] == 1) {
                        this.lcargando.ctlSpinner(false);
                        Swal.fire({
                            icon: "success",
                            title: "Lote guardado con éxito",
                            text: res['message'],
                            showCloseButton: true,
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: '#20A8D8',
                        });
                        this.contribuyenteSrv.getPropiedades(this.contribuyente['id_cliente']).subscribe(
                          (res) => {
                            console.log(res);
                            if (res['data'].length > 0) {
                              res['data'].forEach(e => {
                                // Object.assign(e, {propietario: e.propietarios.find(p => p.id_cliente == this.contribuyente['id_cliente'])})
                                Object.assign(e, {
                                  propietario: e.propietarios.find(p => p.id_cliente == this.contribuyente['id_cliente']),
                                  valor_comercial: e.avaluo
                                })
                              });
                              this.solares = res['data'];
                              // this.calculoValorComercial()
                              this.lcargando.ctlSpinner(false);
                            } else {
                              this.lcargando.ctlSpinner(false);
                            }
                          },
                          (error) => {
                            this.lcargando.ctlSpinner(false)
                            this.toastr.error(error.error.message, 'Error cargando Propiedades')
                          }
                        );

                      } else {
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
                    console.log(res);
                  },
                  (error) => {
                    this.toastr.info(error.error.message);
                    console.log(error.error.message);
                  }
                );
               }
             });



        }
      }


    }
    activarLote(data){
      console.log(data)
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea activar este Lote?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.mensajeSppiner = "Activando Lote..."
          this.lcargando.ctlSpinner(true);
          this.contribuyenteSrv.activarLote(data.propietario.pivot.id).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.lcargando.ctlSpinner(false);

                Swal.fire({
                  icon: "success",
                  title: "Lote Activado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                });
                this.getSolares(this.contribuyente['id_cliente'])

              } else {
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
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.message);
            }
          )
        }
      });
    }

    inactivarLote(data){
    console.log(data)
        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que desea inactivar este Lote?",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        }).then((result) => {
          if (result.isConfirmed) {
            this.mensajeSppiner = "Inactivando Lote..."
            this.lcargando.ctlSpinner(true);
            this.contribuyenteSrv.inactivarLote(data.propietario.pivot.id).subscribe(
              (res) => {
                if (res["status"] == 1) {
                  this.lcargando.ctlSpinner(false);

                  Swal.fire({
                    icon: "success",
                    title: "Lote inactivado",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  });
                  this.getSolares(this.contribuyente['id_cliente'])

                } else {
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
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.message);
              }
            )
          }
        });

    }

    eliminarRelacion(data){
        if (data.id_contribuyente_relacion !== null || data.id_contribuyente_relacion!== 0) this.relacionesIds.push(data.id_contribuyente_relacion)
        console.log(this.relacionesIds)
        // if (item.id !== null) this.bienesEliminar.push(item.id)
        this.dataRelacion.splice(this.dataRelacion.indexOf(data), 1)
    }

    verificarEnfCheck(evento: any) {
      console.log(evento)

        this.checkEnfermedadCatastrofica = evento.check
        this.datosEnfermedadCatastrofica = evento.datos
        this.fileListEnfermedadCatastrofica = evento.file
        this.anexoEnfermedadCatastrofica = evento.anexo
    }

    verifConyugueCheck(evento: any) {
      console.log(evento)
        this.checkConyugue = evento.check
        this.datosConyugue = evento.datos

    }
    verifDiscaCheck(evento: any) {
      console.log(evento)
      this.checkDisca = evento.check
      this.datosDisca = evento.datos
      this.fileListDisca = evento.file
      this.anexoDisca = evento.anexo

    }
    verifTutorApoCheck(evento: any) {
      console.log(evento)
      this.checkTutorApo = evento.check
      this.datosTutorApo = evento.datos
      this.fileListTutorApo = evento.file
      this.anexoTutorApo = evento.anexo

    }
    verifPresHipoCheck(evento: any) {
      console.log(evento)
      this.checkPresHipo = evento.check
      this.datosPresHipo = evento.datos
      this.fileListPresHipo = evento.file
      this.anexoPresHipo = evento.anexo

    }
    verifCoopCheck(evento: any) {
      console.log(evento)
      this.checkCoop = evento.check
      this.datosCoop = evento.datos
      this.fileListCoop = evento.file
      this.anexoCoop = evento.anexo

    }
    verifArteCheck(evento: any) {
      console.log(evento)
      this.checkArte = evento.check
      this.datosArte = evento.datos
      this.fileListArte = evento.file
      this.anexoArte = evento.anexo

    }

    verificarTutorEnfCheck(evento: any) {
      console.log(evento)
      this.checkTutorEnf = evento.check
      this.datosTutorEnf = evento.datos
      this.fileListTutorEnf = evento.file
      this.anexoTutorEnf = evento.anexo

    }



    getSolares(id_contribuyente){
      this.contribuyenteSrv.getPropiedades(id_contribuyente).subscribe(
        (res) => {
          console.log(res);
          if (res['data'].length > 0) {

            res['data'].forEach(e => {
             // Object.assign(e, e.propietarios.find(p => p.id_cliente == id_contribuyente))
              // Object.assign(e, {propietario: e.propietarios.find(p => p.id_cliente == id_contribuyente)})
              Object.assign(e, {
                propietario: e.propietarios.find(p => p.id_cliente == id_contribuyente),
                valor_comercial: e.avaluo
              })

            });
            this.solares = res['data'];
            // console.log(res);
            // this.calculoValorComercial()
            // this.propiedades = res['data']
            // this.codCastDisabled = false;
            this.lcargando.ctlSpinner(false);
          } else {
            this.lcargando.ctlSpinner(false);
          }
        },
        (error) => {
          this.lcargando.ctlSpinner(false)
          this.toastr.error(error.error.message, 'Error cargando Propiedades')
        }
      );
    }

    consultaDetalleIntereses(data?:any) {

      const modalInvoice = this.modalService.open(DetalleInteresesComponent, {
        size: "lg",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.data = data;
    }

    resetFilterEstadoCuenta = () => {
      this.filter = {
        fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
        fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
        concepto: null,
        estado: null
      }
    }


}
