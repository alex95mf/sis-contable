

//EMPIEZA NUEVO ESQUEMA DE FICHA DE EMPLEADOS CPIN
import { AfterViewInit, Component, Input, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { EmpleadoService } from "./empleado.service";
import * as myVarGlobals from "../../../../global";
import { ToastrService } from "ngx-toastr";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";

import { PaginatorComponent } from "../../../../config/custom/paginator/paginator.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { GeneralService } from "src/app/services/general.service";
import { GeneralResponseI } from "src/app/models/responseGeneral.interface";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { DialogService } from "primeng/dynamicdialog";
import { CcModalTableDepartamentoComponent } from "src/app/config/custom/modal-component/cc-modal-table-departamento/cc-modal-table-departamento.component";
import { DepartemtAditionalI } from "src/app/models/responseDepartemtAditional.interface";
import { DepartamentoResponseI } from "src/app/models/responseDepartamento.interface";
 import { CargoService } from "../../configuracion/cargo/cargo.service";
import { CargoResponseI } from "src/app/models/responseCargo.interface";
//import Swal from "sweetalert2";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { formatDate } from "@angular/common";
import { CcModalTableEmpleadoComponent } from "src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component";
import { EmployeesResponseI } from "src/app/models/responseEmployee.interface";
import { CcModalTableJornadaComponent } from "src/app/config/custom/modal-component/cc-modal-table-jornada/cc-modal-table-jornada.component";
import { JornadaNominaResponseI } from "src/app/models/responseJornada.interface";
import { CcModalTableSueldoComponent } from "src/app/config/custom/modal-component/cc-modal-table-sueldo/cc-modal-table-sueldo.component";
import { SueldoResponseI } from "src/app/models/responseSueldo.interface";
import { CargaFamiliarResponseI } from "src/app/models/responseCargaFamiliar.interface";
import { FotoEmpleadoResponseI } from "src/app/models/responseFotoEmpleado.interface";
import { EducacionEmpleadoResponseI } from "src/app/models/responseEducacionEmp.interface";
import { ReferenciaEmpleadoResponseI } from "src/app/models/responseReferenciaEmp.interface";

import {MessageService, PrimeNGConfig, SelectItem} from 'primeng/api';
import { CatalogoResponseI } from "src/app/models/responseCatalogo.interface";


import { LazyLoadEvent, Message } from 'primeng/api';

import { DocFicha, DocFichaAditionalResponseI } from 'src/app/models/responseDocFichaAditional.interfase';
// import { RhfolderDigitalEmpleadoService } from "../folder-digital-empleado/rhfolder-digital-empleado.service";
// import { TranslateService } from "@ngx-translate/core";

import { environment } from 'src/environments/environment';
import { HistoryResponseI } from "src/app/models/responseHistory.interface";
import { HistoryContractsResponseI } from "src/app/models/responseHistoryContacts.interface copy";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModelFamiliarComponent } from "./model-familiar/model-familiar.component";
import { CommonVarService } from "src/app/services/common-var.services";
import { ValidacionesFactory } from "src/app/config/custom/utils/ValidacionesFactory";
import moment from "moment";
import { ModalTipoArchivoComponent } from "./modal-tipo-archivo/modal-tipo-archivo.component";
import { ModalRetencionJudicialComponent } from "./modal-retencion-judicial/modal-retencion-judicial.component";
@Component({
standalone: false,
  selector: "app-empleado",
  templateUrl: "./empleado.component.html",
  styleUrls: ["./empleado.component.scss"],
  providers: [DialogService, MessageService],
})
export class EmpleadoComponent implements OnInit {


  ////////////
  //inicio modal
  tieneFondo :boolean = false;
  ultimoCese :any;
  numAccountMayor: any;
  ref: DynamicDialogRef;
  tableDataSeccionTrabajoEmp: DepartamentoResponseI;
  //fin modal
  @ViewChild("nameDepartamentoInput") inputNameDepartamento; // accessing the reference element
  @ViewChild("nameArea") inputNameArea; // accessing the reference element

  @ViewChild("nameIdentificacion") inputNameIdentificacion; // accessing the reference element
  @ViewChild("namePrimerNombre") inputNamePrimerNombre; // accessing the reference element
  @ViewChild("namePrimerApellido") inputPrimerApellido; // accessing the reference element
  @ViewChild("nameSegundoNombre") inputSegundoNombre; // accessing the reference element
  @ViewChild("nameSegundoApellido") inputSegundoApellido; // accessing the reference element
  @ViewChild("nameFechaNacimiento") inputFechaNacimiento; // accessing the reference element
  @ViewChild("nameFechaJubilacion") inputFechaJubilacion;
  @ViewChild("nameFechaIngreso") inputFechaIngreso; // accessing the reference element
  @ViewChild("nameFechaCese") inputFechaCese;
  @ViewChild("nameTelefonoConvencional") inputTelefonoConvencional; // accessing the reference element
  @ViewChild("nameCelular") inputCelular; // accessing the reference element
  @ViewChild("nameCorreo") inputCorreo; // accessing the reference element
  @ViewChild("nameCorreoEmpresarial") inputCorreoEmpresarial; // accessing the reference element
  @ViewChild("nameTipoJornada") inputTipoJornada; // accessing the reference element
  @ViewChild("nameJornadaParcialPermanente") inputJornadaParcialPermanente
  @ViewChild("nameAlmuerza") inputAlmuerza; // accessing the reference element
  @ViewChild("nameTiempoAlmuerzo") inputTiempoAlmuerzo; // accessing the reference element
  @ViewChild("nameSueldo") inputNameSueldo; // accessing the reference element
  @ViewChild("nameSueldoAnio") inputSueldoAnio; // accessing the reference element
  @ViewChild("nameCargoSueldo") inputCargoSueldo; // accessing the reference element
  @ViewChild("nameCodigoSectorial") inputCodigoSectorial; // accessing the reference element
  @ViewChild("nameSalarioMinimo") inputSalarioMinimo; // accessing the reference element
  @ViewChild("nameTipoContrato") inputTipoContrato; // accessing the reference element
  @ViewChild("nameEmpuFullNombre") inputNameEmpFullNombre; // accessing the reference element
  @ViewChild("namePorcentajeValorQuincena") inputNamePorcentajeValorQuincena; // accessing the reference element
  @ViewChild("nameTipoDiscapacidad") inputNameTipoDiscapacidad; // accessing the reference element
  @ViewChild("namePorcentajeDiscapacidad") inputNamePorcentajeDiscapacidad; // accessing the reference element
  @ViewChild("nameExtencionConyuge") inputExtencionConyuge; // accessing the reference element
  @ViewChild("nameIeesJubilado") inputIeesJubilado; // accessing the reference element
  @ViewChild("nameFondoReservaUnoDia") inputFondoReservaUnoDia; // accessing the reference element
  @ViewChild("nameAcuDecimoTercero") inputAcuDecimoTercero; // accessing the reference element
  @ViewChild("nameAcuDecimoCuarto") inputAcuDecimoCuarto; // accessing the reference element
  @ViewChild("nameAcuFondoReserva") inputAcuFondoReserva; // accessing the reference element
  @ViewChild("nameRetencionesJudiciales") inputRetencionesJudiciales; // accessing the reference element
  @ViewChild("nameValorVarible") inputValorVariable; // accessing the reference element
  @ViewChild("nameValorRetencion") inputValorRetencionJudiacial; // accessing the reference element
  @ViewChild("Image") inputImage; // accessing the reference element
  @ViewChild("nameInputSearchEmpleado") inputNameSearchEmpleado; // accessing the reference element
  @ViewChild("nameNacionalidad") inputNacionalidad; // accessing the reference element
  @ViewChild("nameLocalidad") inputLocalidad; // accessing the reference element
  @ViewChild("nameJubilacion") inputJubilacion; // accessing the reference element

  @ViewChild("nameRegion") inputRegion; // accessing the reference element
  @ViewChild("nameDireccion") inputDireccion; // accessing the reference element
  @ViewChild("nameCodigoBiometrico") inputCodigoBiometrico; // accessing the reference element
  @ViewChild("nameMarcaBiometrico") inputMarcaBiometrico; // accessing the reference element
  @ViewChild("nameEntidad") inputEntidad; // accessing the reference element
  @ViewChild("nameTipoCuenta") inputTipoCuenta; // accessing the reference element
  @ViewChild("nameNumeroCuenta") inputNumeroCuenta; // accessing the reference element
  @ViewChild("nameTipopago") inputTipoPago; // accessing the reference element
  @ViewChild("nameClasiPro") inputClasiPro; // accessing the reference element
  @ViewChild("namePrograma") inputNamePrograma; // accessing the reference element
  @ViewChild("nameTipAnticipo") inputTipAnticipo; // accessing the reference element



  tipo_identificacion_id_cc: BigInteger | String | number;
  max_length_tipo_identificacion: number = 30;
  estado_civil_id_cc: BigInteger | String | number;
  genero_id_cc: BigInteger | String | number;
  nivel_edu_id_cc: BigInteger | String | number;
  variable_id_cc: BigInteger | String | number;
  estado_id_cc: BigInteger | String | number;
  tipo_salario_id_cc: BigInteger | String | number;
  cargo_id_cc: BigInteger | String | number;
  tipo_nomina_pago_id_cc: BigInteger | String | number;
  tipo_anticipo_id_cc: BigInteger | String | number;
  configuracion_semanal_id_cc: BigInteger | String | number;
  tipo_discapacidad_id_cc: BigInteger | String | number;
  extension_conyuge_id_cc: BigInteger | String | number;
  iees_jubilado_id_cc: BigInteger | String | number;
  fondo_reserva_uno_dia_id_cc: BigInteger | String | number;
  acu_decimo_tercero_id_cc: BigInteger | String | number;
  acu_decimo_cuarto_id_cc: BigInteger | String | number;
  acu_fondo_reserva_id_cc: BigInteger | String | number;
  retenciones_judiciales_id_cc: BigInteger | String | number;
  id_codigo_trabajo_cc: BigInteger | String | number;
  marca_biometrico_id_cc: BigInteger | String | number;
  tipo_pago_id_cc: BigInteger | String | number;

  @Input() id_departamento: number;
  @Input() id_area: number | string;
  // @Input() id_cargo: any;
  @Input() id_jornada: any;
  @Input() id_estado_almueza: any;
  @Input() id_tiempo_almuerzo: any;
  @Input() id_cargo_sueldo: any;
  @Input() id_tipo_contrato: any;
  @Input() id_sueldo: any;
  @Input() objDetalleJornada: any;
  @Input() objCargasFamiliares: CargaFamiliarResponseI [] = [];
  @Input() objEducacionEmp: EducacionEmpleadoResponseI | any;
  @Input() objReferenciaEmp: ReferenciaEmpleadoResponseI | any;

  // @Input() id_tipo_salario: any;


  isValorVariable:boolean = true;
  isDisableTipoAnticipo:boolean = true;
  isDisableConfigSemanal:boolean = true;
  isDisableRetenJuducaial:boolean = true;
  lgValorReetenJudiacial:boolean = true;
  lgValorMarcaBiometrico:boolean = true;
  fechaActual:any;
  isDisableTipoPago:boolean = true;

  timeout: any;

  dataCatalogoResponse: CatalogoResponseI;

  dataCargos: CargoResponseI;
  dataResponseGeneral: any; /* GeneralResponseI = {
    // timestamps: Date,
    path: "",
    detail:"",
    code: 0

  }; */

  processing: any = false;

  formFichaEmpleado: FormGroup;
  actions: any = { btnGuardar: true, btnMod: false };

  visible: boolean = false;

  fileToUpload: any;
  imageBase64: any;
  namePhoto: any;

  empleadoForm: EmployeesResponseI = {
    id_empleado: 0,
    id_tipo_identificacion: 0,
    emp_identificacion: "",
    emp_primer_nombre: "",
    emp_segundo_nombre: "",
    emp_primer_apellido: "",
    emp_segundo_apellido: "",
    emp_full_nombre: "",
    emp_fecha_nacimiento: undefined,
    fechajubilacion: undefined,
    id_estado_civil:undefined,
    id_genero: undefined,
    id_nivel_educativo:undefined,
    estado_id: 0,
    id_tipo_discapacidad: undefined,
    porcentaje_discapacidad: 0,
    emp_telefono: "",
    emp_celular: "",
    emp_correo: "",
    emp_correo_empresarial: "",
    id_area:undefined,
    id_departamento: undefined,
    id_cargo: undefined,
    id_jornada: undefined,
    id_tipo_salario: undefined,
    id_sueldo: undefined,
    id_tipo_nomina_pago: undefined,
    id_tipo_anticipo:undefined,
    emp_porcentaje_valor_quincena: "",
    id_config_semanal: 0,
    emp_fecha_ingreso: undefined,
    emp_fecha_cese: null,
    id_extension_conyuge: 0,
    id_iees_jubilado: 0,
    id_fondo_reserva_uno_dia: 0,
    // emp_codigo_trabajo:0,
    id_codigo_trabajo:undefined,
    id_acu_decimo_tercero: undefined,
    id_acu_decimo_cuarto: undefined,
    id_acu_fondo_reserva: undefined,
    id_retenciones_judiciales: undefined,
    estado: undefined,
    tipo_identificacion: undefined,
    estado_civil: undefined,
    genero: undefined,
    area: undefined,
    departamento: undefined,
    cargo: undefined,
    jornada: undefined,
    sueldo: undefined,
    id_sueldo_variable: 0,
    valor_sueldo_variable:0,
    valor_retencion_judicial:0,
    emp_valor_reeten_judicial:"",
    nacionalidad:"",
    tienejubilacion:"",
    localidad:"",
    region: "",
    direccion:"",
    id_codigo_biometrico:"",
    marca_biometrico:0,
    entidad: "",
    num_cuenta: "",
    tipo_cuenta:"",
    id_tipo_pago:undefined,
    jornada_parcial_permanente: false
  };

  emp_fecha_nacimiento = moment().format('YYYY-MM-DD');
  fechajubilacion:any;//= moment().format('YYYY-MM-DD');
  emp_fecha_ingreso = moment().format('YYYY-MM-DD');
  emp_fecha_cese: string|null = null;

  loading: boolean;
  loadingEdu: boolean;

  //busqueda empleado
  readonlyInputSearchEmpleado : boolean;
  disableBtnConsultaEmpleados : boolean;
  disableBtnDescargarFoto : boolean;
  disableBtnSubirFoto : boolean;

  //Datos del empleado
  readonlyInputTipoIdentificacion : boolean;
  readonlyInputIdentificacion : boolean;
  readonlyInputPrimerNombre : boolean;
  readonlyInputSegundoNombre : boolean;
  readonlyInputPrimerApellido : boolean;
  readonlyInputSegundoApellido : boolean;
  readonlyInputFechaNacimiento : boolean;
  readonlyInputFechaJubilacion : boolean;
  readonlyInputEstadoCivil : boolean;
  readonlyInputGenero : boolean;
  disabledCCEstado : boolean;
  disabledCCTipoDiscapacidad : boolean;

  //Contactos
  readonlyInputTelefonoConvencional : boolean;
  readonlyInputCelular : boolean;
  readonlyInputCorreo : boolean;
  readonlyInputCorreoEmpresarial : boolean;

  //Datos Bancarios
  readonlyInputTipoPago: boolean;
  readonlyInputEntidad: boolean;
  readonlyInputTipoCuenta: boolean;
  readonlyInputNumeroCuenta: boolean;

  //SECCIÓN DE TRABAJO DEL EMPLEADO
  readonlyInpuArea : boolean;
  readonlyInputSearchDepartamento : boolean;
  disableBtnConsultaDepartamento : boolean;


  //JORNADA DE TRABAJO DEL EMPLEADO
  readonlyInpuAlmuerza : boolean;
  readonlyInpuTiempoAlmuerzo : boolean;
  readonlyInputSearchJornada : boolean;
  disableBtnConsultaJornada : boolean;
  //readonly SUELDO EMPLEADO
  readonlyInpusalarioMinimo: boolean;
  readonlyInpuSueldoAnio: boolean;
  readonlyInpuCargoSueldo: boolean;
  readonlyInpuCodigoSectorial: boolean;
  readonlyInpuTipoContrato: boolean;
  readonlyInputSueldo: boolean;
  disableBtnConsultaSueldo: boolean;
  readonlyInpuCodigoBiometrico: boolean;
  readonlyInputClasiPro: boolean;

  readonlyButtonContrato: boolean;

  readonlyInputSearchJornadaParcialPerm : boolean;

  cargo_cc: any = []
  jornadaParcialPermanente: any = false
  ////////////////////

  @ViewChild(DataTableDirective)
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(PaginatorComponent, { static: false })
  paginatorComponent: PaginatorComponent;


   /*folder digital */

   fileToUploadFolde: any;
   fileBase64: any;
   nameFile: any;

   submitted = false;
   messageError: Message[] = [];

   tipo_archivo_id_cc: BigInteger | String | number;
   registerForm: FormGroup;

    totalRecords: number;
    rows: number;
    pageIndex: number = 1;
    pageSize: number= 5;
    pageSizeOptions: number[] = [5, 10, 15, 20];

   @Input() objGetDocumentByEmployee: DocFicha[];
   @Input() objGetHistoryByEmployee: HistoryResponseI[];
   @Input() objGetHistoryByEmployeeContracts: HistoryContractsResponseI[];

   folderDigitalForm: DocFicha = {
    full_nombre_empleado: '',
    nombre_archivo: '',
    id_doc_ficha: 0,
    id_empleado: 0,
    tipo_archivo_id: 0,
    extension: '',
    peso_archivo : 0,
    archivo_base_64: '',
    fecha_creacion: undefined,
    fecha_modificacion: undefined,
    estado_id: 0,
    estado: undefined,
    tipo_archivo: undefined,
  };

  /*folder digital fin */

  lstTablaEmpleados: MatTableDataSource<any> = new MatTableDataSource<any>();
  lstModificar: MatTableDataSource<any> = new MatTableDataSource<any>();

  dataUser: any;
  permiso_ver: any = "0";
  empresLogo: any;
  permisions: any;
  faltasYpermisos: any = [];
  vmButtons: any = [];
  cmb_nacionalidad: any[] = [];
  cmb_localidad: any[] = [];

  cmb_region: any[] = [];
  cmb_forma_pago: any = [];
  cmb_entidad: any = [];
  cmb_tipo_cuenta: any = [];
  nacionalidad:any;
  tienejubilacion:any;
  localidad:any;
  region:any;
  entidad:any;
  numero_cuenta:any;
  tipo_cuenta:any;
  direccion:any;
  codigo_biometrico:any;
  disable_fecha_cese: boolean = true

  isDisableGeneraContra: boolean = true

  cmb_tipo_documento: Array<any> = [
    { value: 'C', label: 'Cedula' },
    { value: 'P', label: 'Pasaporte' },
  ]

  disafi = [
    { valor: 0, descripcion: 'NO' },
    { valor: 1, descripcion: 'SI' },
  ]

  disafis = [
    { valor: 'NO', descripcion: 'NO' },
    { valor: 'SI', descripcion: 'SI' },
  ]
t
totalSemanal: any = 0

  validaciones: ValidacionesFactory = new ValidacionesFactory();

  lst_tipo_archivo: any[] = [];
  id_tipo_archivo_selected: number|null = null

  objRetencionesJudiciales: any[] = []

  constructor(
    // private rhfolderdigitalService: RhfolderDigitalEmpleadoService,
    private commonService: CommonService,
    private generalService: GeneralService,
    private toastr: ToastrService,
    private empleadoService: EmpleadoService,
    public dialogService: DialogService,
     public cargoService: CargoService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private modal: NgbModal,
    private commonVrs: CommonVarService,
    // private translateService: TranslateService,
  ) {
    this.catalogsNivelEducacionSelectOptionTable();
    this.catalogsRelacionCargasSelectOptionTable();
    this.catalogsSelectOptionTable();
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.totalRecords = 0;
    this.rows = 5;
    this.commonVrs.modalFamiliares.subscribe(
      (res)=>{
        this.objCargasFamiliares.push(res);
      }
    )

    this.empleadoService.updateTipoArchivo$.subscribe(async () => {
      this.lcargando.ctlSpinner(true)
      this.mensajeSppiner = 'Actualizando Tipos de Archivo'
      const resTipoArchivos: any = await this.generalService.getCatalogoKeyWork('DCFD').toPromise()
      console.log(resTipoArchivos)
      this.lst_tipo_archivo = resTipoArchivos.data
      this.lcargando.ctlSpinner(false)
    })

    this.empleadoService.setRetencionJudicial$.subscribe((retencion: any) => {
      // this.objRetencionesJudiciales = [...this.objRetencionesJudiciales, retencion]
      this.getRetenciones()
    })

    this.empleadoService.setFamiliar$.subscribe(
      (familiar: any) => {
        this.objCargasFamiliares.push(familiar)
        this.getHistoryByEmpleadoUno(familiar.id_empleado);
      }
    )
    this.empleadoService.updateFamiliar$.subscribe(
      (familiar: any) => {

        this.getCargaFamiliares(familiar.id_empleado);
        this.getHistoryByEmpleadoUno(familiar.id_empleado);
        //this.objCargasFamiliares.push(familiar)
      }
    )

    this.vmButtons = [
      {
        orig: "btnsFichaEmpleado",
        paramAccion: "",
        boton: { icon: "fa fa-plus", texto: "Nuevo" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsFichaEmpleado",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "Guardar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsFichaEmpleado",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square-o", texto: "Modificar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn btn-mod boton btn-sm",
        habilitar: true,
        imprimir: false,
      },
      {
        orig: "btnsFichaEmpleado",
        paramAccion: "",
        boton: { icon: "fa fa-times", texto: "Cancelar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-dark boton btn-sm",
        habilitar: false,
      },

      /*Botones de folder */
      {
        orig: "btnsFichaEmpleado",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "Registrar" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsFichaEmpleado",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square-o", texto: "Actualizar" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn btn-primary boton btn-sm",
        habilitar: true,
        imprimir: false,
      },
      {
        orig: "btnsFichaEmpleado",
        paramAccion: "",
        boton: { icon: "fa fa-trash-o", texto: "Eliminar" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn btn-warning boton btn-sm",
        habilitar: true,
        imprimir: false,
      },
      {
        orig: "btnsFichaEmpleado",
        paramAccion: "",
        boton: { icon: "fa fa-download", texto: "F. Empleado" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-mostrar boton btn-sm",
        habilitar: false,
      },
      // {
      //   orig: "btnsFichaEmpleado",
      //   paramAccion: "",
      //   boton: { icon: "fa fa-download", texto: "CONTRATO" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-help boton btn-sm",
      //   habilitar: true,
      // },
    ];
  }
  // ngAfterViewInit(): void {
  //   // this.translateService.addLangs(['en', 'es', 'fr', 'pt'])
  //   this.translateChange('es')
  // }

  // translateChange(lang: string) {
  //   this.translateService.use(lang)
  //   this.translateService.get('primeng').subscribe((res) => this.primengConfig.setTranslation(res))
  // }

  mensajeSppiner: string = "Cargando...";

  /* public getInitialDateFrom(): Date {
    return new Date();
  } */


  idCargoEmpl :string|number= '0';
  ngOnInit(): void {
   this.fechaActual = moment()
    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;

    let data = {
      id: 2,
      codigo: myVarGlobals.fNomEmpleado,
      id_rol: id_rol,
    };

    this.commonService.getPermisionsGlobas(data).subscribe(
       (res) => {
        this.permisions = res["data"];

        this.permiso_ver = this.permisions[0].abrir;

        if (this.permiso_ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Balance comprobación"
          );
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {

          this.imagenDefaultPerfil();
          this.cargarCatalogos();

          /*
          if (this.permisions[0].imprimir == "0") {
            this.btnPrint = false;
            this.vmButtons[2].habilitar = true;
          } else {
            this.btnPrint = true
            this.vmButtons[2].habilitar = false;
          }
          */
          /* this.getParametersFilter(); */
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error?.message);
      }
    );



    this.registerForm = this.fb.group({
      full_nombre_empleado: [{ value: ''/* ,disabled: true */}, [Validators.required, Validators.minLength(1)]],
      fg_nombre_archivo_input: [{ value: ''/* ,disabled: true */}, [Validators.required]],
      fg_tipo_archivo: ['', [Validators.required]],
    });

    this.formFichaEmpleado = this.fb.group({
      lgIdentificacion : [''],
      lgPrimerNombre : [''],
      lgSegundoNombre : [''],
      lgPrimerApellido : [''],
      lgSegundoApellido : [''],
      lgFechaNacimiento : [''],
      lgFechaJubilacion: [''],
      lgPorcentajeDiscapacidad :[{value: '', disabled: this.isDisableTipoAnticipo},''],
      lgTelefonoConvencional : [''],
      lgCelular : [''],
      lgCorreo : [''],
      lgCorreoEmpresarial : [''],
      lgArea : [''],
      lgDepartamento : [''],
      jnd_tipo_jornada : [''],
      lgAlmuerza : [''],
      lgTiempoAlmuerzo : [''],
      lgSueldoAnio : [''],
      lgCargoSueldo : [''],
      lgJornada : [''],
      lgSueldo : [''],
      lgCodigoSectorial : [''],
      lgSalarioMinimo : [''],
      lgTipoContrato : [''],
      lgFechaIngreso : [''],
      lgFechaCese: [''],
      lgValorPorcentajeAnticipo : [{value: '', disabled: this.isDisableTipoAnticipo},''],
      lgValorVariable: [{value: 0, disabled: this.isValorVariable},''],
      lgValorReetenJudiacial:[{value: 0, disabled: this.isValorVariable},''],
      lgSelectCargo : [''],
      lgJubilacion : [''],
      lgNacionalidad : [''],

      lgLocalidad : [''],

      lgRegion : [''],
      lgDireccion : [''],
      lgCodigoBiometrico : [''],
      lgEntidad : [''],
      lgTipoCuenta : [''],
      lgNumeroCuenta : [''],
      lgTipoPago : [{value: '', disabled: this.isDisableTipoPago},''],
      lgClasiPro : [''],
      lgJornadaParcialPermanente :['']



      // lgSldAnio: ["", [Validators.required]],
      // nameMes: ["", [Validators.required]],
      // lgSldCodigoCectorial: ["", [Validators.required]],
      // lgsLdSalarioMinimo: ["", [Validators.required]],
      // nameCargo: ["", [Validators.required]],
      // nameTipoContrato: ["", [Validators.required]],
      // nameEstado: ["", [Validators.required]],
    });

    let today = new Date();

    this.emp_fecha_nacimiento = moment().format('YYYY-MM-DD');
    this.fechajubilacion = null;
    //this.fechajubilacion = moment().format('YYYY-MM-DD');
    // this.emp_fecha_nacimiento.setDate(today.getDate());
    //this.emp_fecha_nacimiento.setDate(today.getDate()-30);


    this.emp_fecha_ingreso = moment().format('YYYY-MM-DD');
    // this.emp_fecha_ingreso.setDate(today.getDate());

    this.readOnlyInputsTrueInitialTrue('yes');
    this.readOnlyInputsTrue();

  }

  readOnlyInputsTrueInitialTrue(ptr){
    //busqueda
    this.readonlyInputSearchEmpleado = ptr=='yes' ? true :false;
   // this.disableBtnConsultaEmpleados = ptr=='yes' ? true :false;
    this.disableBtnDescargarFoto = ptr=='yes' ? true :false;
    this.disableBtnSubirFoto = ptr=='yes' ? true :false;

    //Datos del empleado
    this.readonlyInputTipoIdentificacion = ptr=='yes' ? true :false;
    this.readonlyInputIdentificacion = ptr=='yes' ? true :false;
    this.readonlyInputPrimerNombre = ptr=='yes' ? true :false;
    this.readonlyInputSegundoNombre = ptr=='yes' ? true :false;
    this.readonlyInputPrimerApellido = ptr=='yes' ? true :false;
    this.readonlyInputSegundoApellido = ptr=='yes' ? true :false;
    this.readonlyInputFechaNacimiento = ptr=='yes' ? true :false;
    this.readonlyInputFechaJubilacion =ptr=='yes' ? true :false;
    this.readonlyInputEstadoCivil = ptr=='yes' ? true :false;
    this.readonlyInputGenero = ptr=='yes' ? true :false;
    this.disabledCCEstado = ptr=='yes' ? true :false;
    this.disabledCCTipoDiscapacidad = ptr=='yes' ? true :false;
    //contactos
    this.readonlyInputTelefonoConvencional = ptr=='yes' ? true :false;
    this.readonlyInputCelular = ptr=='yes' ? true :false;
    this.readonlyInputCorreo = ptr=='yes' ? true :false;
    this.readonlyInputCorreoEmpresarial = ptr=='yes' ? true :false;

    //SECCIÓN DE TRABAJO DEL EMPLEADO
    this.readonlyInputSearchDepartamento = ptr=='yes' ? true :false;
    this.disableBtnConsultaDepartamento = ptr=='yes' ? true :false;

    //JORNADA DE TRABAJO DEL EMPLEADO
    this.readonlyInputSearchJornada  = ptr=='yes' ? true :false;
    this.disableBtnConsultaJornada  = ptr=='yes' ? true :false;
    this.readonlyInputSearchJornadaParcialPerm  = ptr=='yes' ? true :false;

    // SUELDO EMPLEADO
    this.readonlyInputSueldo  = ptr=='yes' ? true :false;
    this.disableBtnConsultaSueldo  = ptr=='yes' ? true :false;

    this.readonlyInpuCodigoBiometrico  = ptr=='yes' ? true :false;

    this.readonlyInputTipoPago= ptr=='yes' ? true :false;
    this.readonlyInputEntidad= ptr=='yes' ? true :false;
    this.readonlyInputTipoCuenta= ptr=='yes' ? true :false;
    this.readonlyInputNumeroCuenta= ptr=='yes' ? true :false;

    this.readonlyButtonContrato= ptr=='yes' ? true :false;
this.tieneFondo = false
  }

  readOnlyInputsTrue(){
    //SECCIÓN DE TRABAJO DEL EMPLEADO
    this.readonlyInpuArea = true;
    //JORNADA DE TRABAJO DEL EMPLEADO
    this.readonlyInpuAlmuerza= true;
    this.readonlyInpuTiempoAlmuerzo= true;
    // INPUT SUELDO EMPLEADO
    this.readonlyInpusalarioMinimo= true;
    this.readonlyInpuSueldoAnio= true;
    this.readonlyInpuCargoSueldo= true;
    this.readonlyInpuCodigoSectorial= true;
    this.readonlyInpuTipoContrato= true;
    this.readonlyInputClasiPro= true;
    this.readonlyButtonContrato= true;
  }
  descargarFotoPerfil(){
    const linkSource = this.imageBase64;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = this.namePhoto;
    downloadLink.click();
  }

  /*   getParametersFilter() {
    this.asientoautomaticoService.getParametersFilter({ id_empresa: this.dataUser.id_empresa }).subscribe(res => {
      this.dataLength = res['data'];
      if(this.dataLength[0]){
        for (let index = 0; index < this.dataLength[0].niveles; index++) {
          this.lstNiveles.push(index+1);
        }
      }

      this.getGrupoAccount();
    }, error =>{
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  } */

  onClicFichaDeEmpleado() {
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.empleadoService.presentaTablaEmpleado().subscribe(
      (res) => {

        this.lcargando.ctlSpinner(false);
        this.lstTablaEmpleados.data = res["data"];
        this.lstModificar.data = res["data"];
        this.lstModificar.paginator = this.paginator;
        this.lstModificar.sort = this.sort;
        this.lstTablaEmpleados.paginator = this.paginatorComponent.paginator;

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "Nuevo":
        this.readOnlyInputsTrueInitialTrue('not');
        break;
      case "Guardar":
        this.validaSaveFicheEmpleado();
        break;
      case "Modificar":
        this.validaUpdateFichaEmpleado();
        break;
      case "Cancelar":
        this.cancel();
        break;
      case "Registrar":
        this.validaSaveFolderDigital();
         break;
      case "Actualizar":
        this.validaUpdateFolderDigital();
         break;
      case "Eelimianr":
        this.validaDeleteFolderDigital();
        break;
      case "F. Empleado":
      this.descargarFichaEmpleado();
      break;
      // case "CONTRATO":
      //   this.descargarContrato();
      //   break;
      // case "LIMPIAR":
      //   //this.informaciondtlimpiar();
      //   break;
    }
  }

  /**
   *  descarga de ficha empleado
   */
  descargarFichaEmpleado(){
    let idEmpleado = this.empleadoForm?.id_empleado;
    if(idEmpleado == 0 ){
      return this.messageService.add({key: 'tr', severity:'warn', summary: 'Advertencia', detail: 'Debe selecionar un empleado.'/* ,life:300000 */});

    }
    window.open(environment.ReportingUrl + "rpt_ficha_empleado.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_empresa=1&id_empleado="+idEmpleado, '_blank');
  }

  /**-----METODOS DE GUARDAR */
  async validaSaveFicheEmpleado() {

    if (this.formFichaEmpleado.valid === true) {
      this.confirmSave(
        "Seguro desea guardar la ficha empleado?",
        "SAVE_FICHA_EMPLEADO"
      );
    }

    console.log("falta validar");
    return;
  }

  descargarContrato(){
    let idEmpleado = this.empleadoForm?.id_empleado;
    let tipoContrato = this.empleadoForm?.sueldo?.tipo_contrato.cat_nombre;

    console.log(idEmpleado)
    console.log(tipoContrato)
    if(idEmpleado == 0 ){
      return this.messageService.add({key: 'tr', severity:'warn', summary: 'Advertencia', detail: 'Debe selecionar un empleado.'/* ,life:300000 */});

    }
    else if(tipoContrato =='Contrato ocacionales'){
      window.open(environment.ReportingUrl + "rep_rrhh_contrato_serv_ocasionales.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_empleado="+idEmpleado, '_blank');
    }
    else if(tipoContrato =='Tiempo parcial'){
      window.open(environment.ReportingUrl + "rep_rrhh_contrato_serv_profesionales.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_empleado="+idEmpleado, '_blank');

    }
    else if(tipoContrato  =='Tiempo indefinido'){
      window.open(environment.ReportingUrl + "rep_rrhh_contrato_trabajo.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_empleado="+idEmpleado, '_blank');

    }else{
      window.open(environment.ReportingUrl + "rep_rrhh_contrato_generico.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_empleado="+idEmpleado, '_blank');

    }
  }



  descargarContratoPdf(contrato){
    let tipo_contrato = contrato.catalogo?.cat_nombre;
    let id_tipo_contrato = contrato.catalogo?.id_catalogo;
    let id_emp_contrato = contrato.id_emp_contrato;
    let idEmpleado = this.empleadoForm?.id_empleado;



    if(tipo_contrato =='Contrato ocacionales'){
      window.open(environment.ReportingUrl + "rep_rrhh_contrato_serv_ocasionales.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_emp_contrato="+id_emp_contrato, '_blank');
    }
    else if(tipo_contrato =='Tiempo parcial'){
      window.open(environment.ReportingUrl + "rep_rrhh_contrato_serv_profesionales.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_emp_contrato="+id_emp_contrato, '_blank');

    }
    else if(tipo_contrato  =='Tiempo indefinido'){
      window.open(environment.ReportingUrl + "rep_rrhh_contrato_trabajo.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_emp_contrato="+id_emp_contrato, '_blank');

    }else{
      window.open(environment.ReportingUrl + "rep_rrhh_contrato_generico.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_empleado="+idEmpleado+"&tipo_contrato="+id_tipo_contrato, '_blank');
      console.log(environment.ReportingUrl + "rep_rrhh_contrato_generico.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_empleado="+idEmpleado+"&tipo_contrato="+id_tipo_contrato)
    }
  }



  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      console.log("guarddo");
      this.processing = false;
      if (result.value) {
        if (action == "SAVE_FICHA_EMPLEADO") {
          this.saveFichaEmpleado();
        } else if (action == "UPDATED_FICHA_EMPLEADO") {
          this.updatedFichaEmpleado();
        } else if (action == "DELETE_FICHA_EMPLEADO") {
          // this.deleteFichaEmpleado();
        }
      }
    });
  }

  async saveFichaEmpleado() {

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de nueva ficha empleado  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,
      // DATOS DEL EMPLEADO
      id_tipo_identificacion: this.tipo_identificacion_id_cc,
      emp_identificacion: this.inputNameIdentificacion.nativeElement.value,
      emp_primer_nombre: this.inputNamePrimerNombre.nativeElement.value,
      emp_segundo_nombre: this.inputSegundoNombre.nativeElement.value,
      estado_id: this.estado_id_cc,
      emp_primer_apellido: this.inputPrimerApellido.nativeElement.value,
      emp_segundo_apellido: this.inputSegundoApellido.nativeElement.value,
      emp_fecha_nacimiento: this.emp_fecha_nacimiento,
      fechajubilacion: this.fechajubilacion,//formatDate(this.inputFechaNacimiento.value,'yyyy-MM-dd',"en-US"), //this.dateToYMD(this.inputFechaNacimiento),
      id_estado_civil: this.estado_civil_id_cc,
      id_genero: this.genero_id_cc,
      id_nivel_educativo: this.nivel_edu_id_cc,
      // ---HR
      id_tipo_discapacidad: this.tipo_discapacidad_id_cc,
      porcentaje_discapacidad:
        this.inputNamePorcentajeDiscapacidad.nativeElement.value,

      // CONTACTOS
      emp_telefono: this.inputTelefonoConvencional.nativeElement.value,
      emp_celular: this.inputCelular.nativeElement.value,
      emp_correo: this.inputCorreo.nativeElement.value,
      emp_correo_empresarial: this.inputCorreoEmpresarial.nativeElement.value,

      //DATOS BANCARIOS
      entidad: this.entidad,
      num_cuenta: this.numero_cuenta,
      tipo_cuenta: this.tipo_cuenta,
      id_tipo_pago: this.tipo_pago_id_cc,

      // SECCIÓN DE TRABAJO DEL EMPLEADO
      id_area: this.id_area,
      id_departamento: this.id_departamento,
      //id_cargo: this.cargo_id_cc,
      id_cargo: this.formFichaEmpleado.get('lgSelectCargo').value,//this.cargo_id_cc,

      // JORNADA DE TRABAJO DEL EMPLEADO
      id_jornada: this.id_jornada,
      jornada_parcial_permanente: this.jornadaParcialPermanente,

      // SUELDO EMPLEADO
      id_tipo_salario: this.tipo_salario_id_cc,
      id_sueldo: this.id_sueldo,

      id_tipo_nomina_pago: this.tipo_nomina_pago_id_cc,
      id_tipo_anticipo: ((this.tipo_anticipo_id_cc === 0) || (this.tipo_anticipo_id_cc === '0') ) ? null : this.tipo_anticipo_id_cc,
      emp_porcentaje_valor_quincena:
        this.inputNamePorcentajeValorQuincena.nativeElement.value??0,
      id_config_semanal: ((this.configuracion_semanal_id_cc === 0) || (this.configuracion_semanal_id_cc === '0') ) ? null : this.configuracion_semanal_id_cc,
      emp_fecha_ingreso:this.emp_fecha_ingreso, //formatDate(this.inputFechaIngreso.value,'yyyy-MM-dd',"en-US"), //this.dateToYMD(this.inputFechaNacimiento),
      emp_fecha_cese: this.emp_fecha_cese,

      //    DATOS DE AFILIACION
      id_extension_conyuge: this.extension_conyuge_id_cc,
      id_iees_jubilado: this.iees_jubilado_id_cc,
      // ---HR
      id_fondo_reserva_uno_dia: this.fondo_reserva_uno_dia_id_cc,
      id_acu_decimo_tercero: this.acu_decimo_tercero_id_cc,
      id_acu_decimo_cuarto: this.acu_decimo_cuarto_id_cc,
      id_acu_fondo_reserva: this.acu_fondo_reserva_id_cc,
      // ---HR
      id_retenciones_judiciales: this.retenciones_judiciales_id_cc,
      // emp_codigo_trabajo:this.id_codigo_trabajo_cc,
      id_codigo_trabajo:this.id_codigo_trabajo_cc,


      //- FOTO
      nombre_foto: this.namePhoto,
      extension: null,
      foto_base_64: this.imageBase64,

      //EDUCACION EMPLEADO
      educacion: this.objEducacionEmp,

      //referencia empleado
      refencia: this.objReferenciaEmp,

      id_sueldo_variable:this.variable_id_cc,
      // emp_valor_sueldo_variable:this.inputValorVariable.nativeElement.value,
      emp_valor_sueldo_variable:this.formFichaEmpleado.controls.lgValorVariable.value,
      // emp_valor_reeten_judicial:this.inputValorRetencionJudiacial.nativeElement.value,
      emp_valor_reeten_judicial:this.formFichaEmpleado.controls.lgValorReetenJudiacial.value,
      id_empresa:this.dataUser.id_empresa,
      familiares: this.objCargasFamiliares,

      tienejubilacion: this.tienejubilacion,
      nacionalidad: this.nacionalidad,
      localidad:this.localidad,
      region:this.region,
      direccion: this.direccion,
      id_codigo_biometrico: this.codigo_biometrico,
      marca_biometrico: this.marca_biometrico_id_cc,

      // sld_anio: this.inputNadireccionmeAnio.nativeElement.value,
      // sld_anio: this.inputNameAnio.inputFieldValue,
      // id_mes: this.mes_id_cc,
      // id_cargo: this.cargo_id_cc,
      // id_tipo_contrato: this.tipo_contrato_id_cc,
      // sld_codigo_sectorial: this.inputNameCodigoSectorial.nativeElement.value,
      // sld_salario_minimo: this.inputNameSalarioMinimo.nativeElement.value,
      // estado_id: this.estado_id_cc,
    };
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.empleadoService.saveFichaEmpleado(data).subscribe(
      (res: any) => {
        console.log(res)

       // if (res.code == 200) {
        if (res) {

          Swal.fire({
            icon: "success",
            title: "Empleado Guardado!",
            text: "Datos de ficha empleado guardados correctamente.",
            //type: "success",
            showCancelButton: false,
            confirmButtonColor: "#20A8D8",
            confirmButtonText: "Aceptar",
          })
          // this.toastr.success(
          //   "Datos de ficha empleado guardados correctamente."
          // );
          this.empleadoForm = res

          this.getHistoryByEmpleadoUno(this.empleadoForm.id_empleado);
          this.getHistoryContactsByEmployee(this.empleadoForm.id_empleado);

          this.isDisableGeneraContra = false

          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = false;
          //this.vmButtons[8].habilitar = false;
        }
        // this.rerender();
        this.lcargando.ctlSpinner(false);
        // this.cancel();
      },
      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
        let message = '';
        let errores = Object.keys(error.error.errors)
        errores.forEach((e: string) => { message += `${error.error.errors[e][0]}<br>`})
        this.toastr.warning(message, 'Error de validación', { enableHtml: true });
      }
    );
  }

  /**
   *
   * @param date Metodo Actualizar
   * @returns
   */
  async validaUpdateFichaEmpleado() {
    // if (this.formFichaEmpleado.valid === true) {
    this.confirmSave(
      "Seguro desea actualizar la ficha empleado?",
      "UPDATED_FICHA_EMPLEADO"
    );
    // }

    /*   console.log("falta validar");
    return; */

    // if (this.permisions.guardar == "0") {
    //   this.toastr.info("Usuario no tiene permiso para guardar");
    // } else {
    //   let resp = await this.validateDataGlobal().then(respuesta => {
    //     if (respuesta) {
    //       this.confirmSave("Seguro desea actualizar la cuenta?", "UPDATED_ACCOUNT");
    //     }
    //   })
    // }
  }

  updatedFichaEmpleado() {
    console.log("update");
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Actualización de ficha empleado rrhh",
      id_controlador: myVarGlobals.fBovedas,
      id_empleado: this.empleadoForm.id_empleado,

      // DATOS DEL EMPLEADO
      id_tipo_identificacion: this.tipo_identificacion_id_cc,
      emp_identificacion: this.inputNameIdentificacion.nativeElement.value,
      emp_primer_nombre: this.inputNamePrimerNombre.nativeElement.value,
      emp_segundo_nombre: this.inputSegundoNombre.nativeElement.value,
      estado_id: this.estado_id_cc,
      emp_primer_apellido: this.inputPrimerApellido.nativeElement.value,
      emp_segundo_apellido: this.inputSegundoApellido.nativeElement.value,
      // emp_fecha_nacimiento:  formatDate(this.inputFechaNacimiento.inputFieldValue, 'yyyy-MM-dd', 'en'), "12-01-2023",
      emp_fecha_nacimiento: this.emp_fecha_nacimiento,
      fechajubilacion:this.fechajubilacion,//formatDate(this.inputFechaNacimiento.value,'yyyy-MM-dd',"en-US"), //this.dateToYMD(this.inputFechaNacimiento),
      id_estado_civil: this.estado_civil_id_cc,
      id_genero: this.genero_id_cc,
      id_nivel_educativo: this.nivel_edu_id_cc,
      tienejubilacion: this.tienejubilacion,
      nacionalidad: this.nacionalidad,
      region:this.region,
      localidad: this.localidad,
      direccion: this.direccion,
      id_codigo_biometrico: this.codigo_biometrico,
      marca_biometrico: this.marca_biometrico_id_cc,
      // ---HR
      id_tipo_discapacidad: this.tipo_discapacidad_id_cc,
      porcentaje_discapacidad:
        this.inputNamePorcentajeDiscapacidad.nativeElement.value,

      // CONTACTOS
      emp_telefono: this.inputTelefonoConvencional.nativeElement.value,
      emp_celular: this.inputCelular.nativeElement.value,
      emp_correo: this.inputCorreo.nativeElement.value,
      emp_correo_empresarial: this.inputCorreoEmpresarial.nativeElement.value,

      //DATOS BANCARIOS
      entidad: this.entidad,
      num_cuenta: this.numero_cuenta,
      tipo_cuenta: this.tipo_cuenta,
      id_tipo_pago: this.tipo_pago_id_cc,

      // SECCIÓN DE TRABAJO DEL EMPLEADO
      id_area: this.id_area,
      id_departamento: this.id_departamento,
      //id_cargo: this.cargo_id_cc,
      id_cargo: this.formFichaEmpleado.get('lgSelectCargo').value,//this.cargo_id_cc,

      // JORNADA DE TRABAJO DEL EMPLEADO
      id_jornada: this.id_jornada,
      jornada_parcial_permanente: this.jornadaParcialPermanente,

      // SUELDO EMPLEADO
      id_tipo_salario: this.tipo_salario_id_cc,
      id_sueldo: this.id_sueldo,

      id_tipo_nomina_pago: this.tipo_nomina_pago_id_cc,
      id_tipo_anticipo: ((this.tipo_anticipo_id_cc === 0) || (this.tipo_anticipo_id_cc === '0') ) ? null : this.tipo_anticipo_id_cc,
      emp_porcentaje_valor_quincena:
        this.inputNamePorcentajeValorQuincena.nativeElement.value,
      id_config_semanal: ((this.configuracion_semanal_id_cc === 0) || (this.configuracion_semanal_id_cc === '0') ) ? null : this.configuracion_semanal_id_cc,
      emp_fecha_ingreso: this.emp_fecha_ingreso, //formatDate(this.inputFechaIngreso.value,'yyyy-MM-dd',"en-US"),//"12-01-2023",
      emp_fecha_cese: this.emp_fecha_cese,

      //    DATOS DE AFILIACION
      id_extension_conyuge: this.extension_conyuge_id_cc,
      id_iees_jubilado: this.iees_jubilado_id_cc,
      // ---HR
      id_fondo_reserva_uno_dia: this.fondo_reserva_uno_dia_id_cc,
      id_acu_decimo_tercero: this.acu_decimo_tercero_id_cc,
      id_acu_decimo_cuarto: this.acu_decimo_cuarto_id_cc,
      id_acu_fondo_reserva: this.acu_fondo_reserva_id_cc,
      // ---HR
      id_retenciones_judiciales: this.retenciones_judiciales_id_cc,
      id_codigo_trabajo: this.id_codigo_trabajo_cc,
      // emp_codigo_trabajo: this.id_codigo_trabajo_cc,

      //- FOTO
      nombre_foto: this.namePhoto,
      extension: null,
      foto_base_64: this.imageBase64,

      //educacion empleado
      educacion: this.objEducacionEmp,

      //referencia empleado
      refencia: this.objReferenciaEmp,

      id_sueldo_variable:this.variable_id_cc,
      // emp_valor_sueldo_variable:this.inputValorVariable.nativeElement.value,
      emp_valor_sueldo_variable:this.formFichaEmpleado.controls.lgValorVariable.value,
      // emp_valor_reeten_judicial:this.inputValorRetencionJudiacial.nativeElement.value,
      emp_valor_reeten_judicial:this.formFichaEmpleado.controls.lgValorReetenJudiacial.value,
      id_empresa:this.dataUser.id_empresa
    };
    console.log(data)
    console.log('aun no modifica')
    // this.validaDt = false;
    this.mensajeSppiner = "Actualizando...";
    this.lcargando.ctlSpinner(true);
    this.empleadoService.updatedServiceFichaEmpleado(data).subscribe(
      (res: GeneralResponseI) => {
        //if (res.code == 200 || res.code == 201) {
          console.log('modifico')
          // this.toastr.success(
          //   "Datos de ficha empleado actualizados correctamente."
          // );
          Swal.fire({
            icon: "success",
            title: "Registro actualizado!!",
            text: "La ficha ha sido modificada con éxito",
            //type: "success",
            showCancelButton: false,
            confirmButtonColor: "#20A8D8",
            confirmButtonText: "Aceptar",
          })
          this.getHistoryByEmpleadoUno(this.empleadoForm.id_empleado);
          this.getHistoryContactsByEmployee(this.empleadoForm.id_empleado);

          this.isDisableGeneraContra = false
        //}
        // this.rerender();
        this.lcargando.ctlSpinner(false);
        //this.cancel();
      },
      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
        let message = '';
        let errores = Object.keys(error.error.errors)
        errores.forEach((e: string) => {
          console.log(error.error.errors['entidad'])
          if(error.error.errors['entidad']){error.error.errors['entidad'][0] = 'El campo entidad es obligatorio cuando la forma de pago es TRANSFERENCIA <br>'}
          if(error.error.errors['num_cuenta']){error.error.errors['num_cuenta'][0] = 'El campo número de cuenta es obligatorio cuando la forma de pago es TRANSFERENCIA <br>'}
          if(error.error.errors['tipo_cuenta']){error.error.errors['tipo_cuenta'][0] = 'El campo tipo de cuenta es obligatorio cuando la forma de pago es TRANSFERENCIA <br> '}

          message += error.error.errors[e][0]+'<br>'


          })
        this.toastr.warning(message, 'Error de validación', {enableHtml: true});

      }
    );
  }

  LoadOpcionTipo: any = false;
  LoadOpcionProvincia: any = false;
  LoadOpcionCiudad: any = false;
  LoadOpcionCargo: any = false;
  // arrayCountry:CountrStatesCitiesResponseI | any;
  // arrayStates : StatesResponseI |any;
  // arrayCities : CitiesResponseI | any;
  arrayCargos : CargoResponseI | any;


  //***************************** */
  viewSelectionTipoIdentificacionCC(responseId: any) {
    this.tipo_identificacion_id_cc = responseId;

    if (responseId == 40) this.max_length_tipo_identificacion = 10;
    if (responseId == 41) this.max_length_tipo_identificacion = 13;
    if (responseId == 42) this.max_length_tipo_identificacion = 30;

    this.consultarCatalogo(this.tipo_identificacion_id_cc);

    this.formFichaEmpleado
      .get("nameTipoIdentificacion")
      .setValue(this.tipo_identificacion_id_cc);
  }


  consultarCatalogo(idCatalog){
    this.generalService
    .getCatalogoOnly(idCatalog)
    .subscribe({
      next: (rpt: CatalogoResponseI) => {
        console.log(rpt);
        this.dataCatalogoResponse = rpt;
      },
      error: (e) => {
        this.dataResponseGeneral = e.error;
        this.toastr.error(this.dataResponseGeneral.detail);
      },
    });
  }

  viewSelectionEstadoCivilCC(responseId: any) {
    this.estado_civil_id_cc = responseId;
    this.formFichaEmpleado
      .get("nameEstadoCivil")
      .setValue(this.estado_civil_id_cc);
  }
  viewSelectionGeneroCC(responseId: any) {
    this.genero_id_cc = responseId;
    this.formFichaEmpleado.get("nameGenero").setValue(this.genero_id_cc);
  }


  viewSelectionNicelEduCC(responseId: any) {
    this.nivel_edu_id_cc = responseId;
    this.formFichaEmpleado.get("nameNivelEdu").setValue(this.nivel_edu_id_cc);
  }

  viewSelectionSueldoVariableCC(responseId: any) {
    console.log(responseId)
    this.variable_id_cc = responseId;
    if(this.variable_id_cc === 5){
      this.formFichaEmpleado.controls["lgValorVariable"].enable();
    }else{
      this.formFichaEmpleado.controls["lgValorVariable"].disable();
    }

    // this.formFichaEmpleado.get("nameSueldoVariable").setValue(this.variable_id_cc);
  }

  viewSelectionTipoSalarioCC(responseId: any) {
    this.tipo_salario_id_cc = responseId;
    this.formFichaEmpleado
      .get("nameTipoSalario")
      .setValue(this.tipo_salario_id_cc);
  }
  viewSelectionTipoNominaPagoCC(responseId: any) {


    this.tipo_nomina_pago_id_cc = responseId;
    console.log(this.tipo_nomina_pago_id_cc)

    if(this.tipo_nomina_pago_id_cc === 75){
      this.isDisableTipoAnticipo = false;
      this.formFichaEmpleado.controls["lgValorPorcentajeAnticipo"].enable();

      this.isDisableConfigSemanal = true;
      this.configuracion_semanal_id_cc = '0';

    }else if (this.tipo_nomina_pago_id_cc === 73) {

      this.isDisableConfigSemanal = false;
      this.isDisableTipoAnticipo = true;
      this.formFichaEmpleado.controls["lgValorPorcentajeAnticipo"].disable();
      this.inputNamePorcentajeValorQuincena.nativeElement.value = 0;
      this.tipo_anticipo_id_cc = '0';

    }else{
      this.isDisableTipoAnticipo = true;
      this.formFichaEmpleado.controls["lgValorPorcentajeAnticipo"].disable();
      this.inputNamePorcentajeValorQuincena.nativeElement.value = 0;
      this.tipo_anticipo_id_cc = '0';

      this.isDisableConfigSemanal = true;
      this.configuracion_semanal_id_cc = '0';

    }




    this.formFichaEmpleado
      .get("nameTipoNominaPago")
      .setValue(this.tipo_nomina_pago_id_cc);
  }

  viewSelectionTipoPagoCC(responseId: any) {
    this.tipo_pago_id_cc = responseId;

    if(this.tipo_pago_id_cc === 183){
      this.isDisableTipoPago = false;
      this.formFichaEmpleado.controls["lgEntidad"].enable();
      this.formFichaEmpleado.controls["lgNumeroCuenta"].enable();
      this.formFichaEmpleado.controls["lgTipoCuenta"].enable();
    }else{
      this.isDisableTipoPago = true;
      this.formFichaEmpleado.controls["lgEntidad"].disable();
      this.formFichaEmpleado.controls["lgNumeroCuenta"].disable();
      this.formFichaEmpleado.controls["lgTipoCuenta"].disable();
    }

    this.formFichaEmpleado
    .get("nameTipoPago")
    .setValue(this.tipo_pago_id_cc);
  }
  viewSelectionTipAnticipoCC(responseId: any) {

    console.log(responseId)
    console.log(this.empleadoForm)
    console.log(this.empleadoForm.id_empleado)
    this.tipo_anticipo_id_cc = responseId;
    // this.formFichaEmpleado
    //   .get("nameTipAnticipo")
    //   .setValue(this.tipo_anticipo_id_cc);
    if(this.tipo_anticipo_id_cc === 77 && this.empleadoForm.id_empleado ===0){
      this.getPorcAnticipoQuin();
    }else{
      this.inputNamePorcentajeValorQuincena.nativeElement.value = this.empleadoForm.emp_porcentaje_valor_quincena
    }
  }
  viewSelectionConfiguracionSemanalCC(responseId: any) {
    this.configuracion_semanal_id_cc = responseId;
    this.formFichaEmpleado
      .get("nameConfiguracionSemanal")
      .setValue(this.configuracion_semanal_id_cc);
  }
  viewSelectionEstadoPersonaCC(responseId: any) {
    this.estado_id_cc = responseId;
    if(this.estado_id_cc == 3){
      this.formFichaEmpleado.controls["lgFechaCese"].enable();
    }else{
      this.formFichaEmpleado.controls["lgFechaCese"].disable();
      //this.formFichaEmpleado.get("nameFechaCese").setValue('');
      this.emp_fecha_cese = null
    }

    //this.disable_fecha_cese = responseId == 3
    // this.formFichaEmpleado.get("nameEstado").setValue(this.estado_id_cc);
  }

  viewSelectionCodigoTrabajoCC(responseId: any) {
    this.id_codigo_trabajo_cc = responseId;
    // this.formFichaEmpleado.get("nameEstado").setValue(this.estado_id_cc);
  }

  viewSelectionTipoDiscapacidadCC(responseId: any) {
    this.tipo_discapacidad_id_cc = responseId;

    if(this.tipo_discapacidad_id_cc !== 87){
      this.formFichaEmpleado.controls["lgPorcentajeDiscapacidad"].enable();

    }else{
      this.formFichaEmpleado.controls["lgPorcentajeDiscapacidad"].disable();
      this.formFichaEmpleado
      .get("lgPorcentajeDiscapacidad")
      .setValue('');
    }

    this.formFichaEmpleado
      .get("nameTipoDiscapacidad")
      .setValue(this.tipo_discapacidad_id_cc);
  }

  viewSelectionCargoParameterCC(responseId: any) {

    this.cargo_id_cc = responseId;
    this.formFichaEmpleado.get("nameCargoSession").setValue(this.cargo_id_cc);
  }

  viewSelectionExtencionConyugeCC(responseId: any) {
    this.extension_conyuge_id_cc = responseId;
    this.formFichaEmpleado
      .get("nameExtencionConyuge")
      .setValue(this.extension_conyuge_id_cc);
  }

  viewSelectionIeesJuniladoCC(responseId: any) {
    console.log(responseId);
    this.iees_jubilado_id_cc = responseId;
    this.formFichaEmpleado
      .get("nameIeesJubilado")
      .setValue(this.iees_jubilado_id_cc);
  }

  viewSelectionFondoReservaUnoDiaCC(responseId: any) {
    console.log(responseId)
    this.fondo_reserva_uno_dia_id_cc = responseId;
    this.formFichaEmpleado
      .get("nameFondoReservaUnoDia")
      .setValue(this.fondo_reserva_uno_dia_id_cc);
  }
  viewSelectionAcuDecimoTerceroCC(responseId: any) {
    this.acu_decimo_tercero_id_cc = responseId;
    this.formFichaEmpleado
      .get("nameAcuDecimoTercero")
      .setValue(this.acu_decimo_tercero_id_cc);
  }
  viewSelectionAcuDecimoCuartoCC(responseId: any) {
    this.acu_decimo_cuarto_id_cc = responseId;
    this.formFichaEmpleado
      .get("nameAcuDecimoCuarto")
      .setValue(this.acu_decimo_cuarto_id_cc);
  }
  viewSelectionAcuFondoReservaCC(responseId: any) {
    this.acu_fondo_reserva_id_cc = responseId;
    this.formFichaEmpleado
      .get("nameAcuFondoReserva")
      .setValue(this.acu_fondo_reserva_id_cc);
  }
  viewSelectionMarcaBiometricoCC(responseId: any) {
    console.log(responseId)
    this.marca_biometrico_id_cc = responseId;
    this.formFichaEmpleado
      .get("nameMarcaBiometrico")
      .setValue(this.marca_biometrico_id_cc);
  }


  viewSelectionRetencionesJudicialesCC(responseId: any) {
    this.retenciones_judiciales_id_cc = responseId;

    if(this.retenciones_judiciales_id_cc === 5){
      this.formFichaEmpleado.controls['lgValorReetenJudiacial'].enable();
    }else{
      this.formFichaEmpleado.controls['lgValorReetenJudiacial'].disable();
      this.inputValorRetencionJudiacial.nativeElement.value = 0;
    }

    // this.formFichaEmpleado.get("nameRetencionesJudiciales").setValue(this.retenciones_judiciales_id_cc);
  }


  /**
   * modal jornada
   * @param content
   */
  onClicConsultaJornadas(content) {
    this.ref = this.dialogService.open(CcModalTableJornadaComponent, {
      data: {
        search :  this.formFichaEmpleado.get('jnd_tipo_jornada').value,
      },
      header: "Jornadas",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe(
      (selectJornadaOption: JornadaNominaResponseI) => {
        // console.log(selectJornadaOption.jordana_detalles);
        this.inputTipoJornada.nativeElement.value =
          selectJornadaOption.jnd_tipo_jornada;
        this.id_jornada = selectJornadaOption.id_jornada;

        this.inputAlmuerza.nativeElement.value =
          selectJornadaOption.estado_almuerza.cat_nombre;
        this.id_estado_almueza = selectJornadaOption.id_estado_almueza;

        this.inputTiempoAlmuerzo.nativeElement.value =
          selectJornadaOption.tiempo_almuerzo.cat_nombre;
        this.id_tiempo_almuerzo = selectJornadaOption.id_tiempo_almuerzo;

        this.objDetalleJornada = selectJornadaOption.jordana_detalles;

        let totalHoras = 0
        this.objDetalleJornada.forEach(e =>{
          totalHoras += parseFloat(e.total_horas);
        })

        this.totalSemanal = totalHoras

      }
    );
  }

  /**
   * obtener las cargas familiares del empleado
   * @param ptr_id_empleado
   */
  getCargaFamiliares(ptr_id_empleado) {
    this.loading = true;
    let parameterUrl: any = {
      id_empleado: ptr_id_empleado,
    };
    this.empleadoService.getCargaFamiliares(parameterUrl).subscribe({
      next: (rpt: CargaFamiliarResponseI) => {
        console.log(rpt);
        this.objCargasFamiliares = rpt['data'];
        // console.log(this.objCargasFamiliares);
        this.loading = false;
      },
      error: (e) => {
        console.log(e);
        this.loading = false;
      },
    });
  }

  getPorcAnticipoQuin() {
    this.loading = true;
    // let parameterUrl: any = {
    //   id_empleado: ptr_id_empleado,
    // };
    this.empleadoService.getPorcAnticipoQuin().subscribe(
      (res) => {
        console.log(res)
        this.inputNamePorcentajeValorQuincena.nativeElement.value = res["data"]?.valor
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }


  async getCargos($parmt : number) {

    this.LoadOpcionCargo = true;

    let idDepartamento = $parmt;
    this.cargoService.getPostitionsByDepartment(idDepartamento).subscribe(
      (res: CargoResponseI) => {
        this.lcargando.ctlSpinner(false);
        this.arrayCargos  = res;
       // this.cargo_cc =res
        console.log( this.arrayCargos );
        this.LoadOpcionCargo = false;
      },
      (error) => {
        this.LoadOpcionCargo = false;
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error?.error?.detail);
      }
    );

  }

  /**
   * obtener educacion del empleado
   * @param ptr_id_empleado
   */
  async getEducacionEmpleado(ptr_id_empleado) {
    this.loadingEdu = true;
    let parameterUrl: any = {
      id_empleado: ptr_id_empleado,
    };
    this.empleadoService.getEducacionByEmpleado(parameterUrl).subscribe({
      next: (rpt: EducacionEmpleadoResponseI) => {

        this.objEducacionEmp = rpt;
        console.log( this.objEducacionEmp)
        this.getHistoryByEmpleadoUno( ptr_id_empleado)

        // console.log(this.objEducacionEmp);
        this.loadingEdu = false;
      },
      error: (e) => {
        console.log(e);
        this.loadingEdu = false;
      },
    });
  }


    /**
   * obtener referencias del empleado
   * @param ptr_id_empleado
   */
    async getReferenciaEmpleado(ptr_id_empleado) {
      this.loading = true;
      let parameterUrl: any = {
        id_empleado: ptr_id_empleado,
      };
      this.empleadoService.getReferenciaByEmpleado(parameterUrl).subscribe({
        next: (rpt: ReferenciaEmpleadoResponseI) => {
          this.objReferenciaEmp = rpt;
          // console.log(this.objEducacionEmp);
          this.loading = false;
        },
        error: (e) => {
          console.log(e);
          this.loading = false;
        },
      });
    }

  /**
   *
   * @param ptr_id_empleado obtener la foto del empleado
   */
  async getFotoEmpleado(ptr_id_empleado) {
    let parameterUrl: any = {
      id_empleado: ptr_id_empleado,
    };
    this.empleadoService.getPhotoByEmploye(parameterUrl).subscribe({
      next: (rpt: FotoEmpleadoResponseI) => {

        // this.objCargasFamiliares = rpt;
        if (Object.entries(rpt).length != 0) {
          console.log(rpt)
          //foto empleado
          this.namePhoto = rpt.nombre_foto;
          this.imageBase64 = rpt.foto_base_64;
          // this.inputImage.nativeElement.value = rpt.nombre_foto;
        }else{
          this.imagenDefaultPerfil();
        }

      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  protected imagenDefaultPerfil() {
    this.namePhoto = "no-foto.jpg";
    this.imageBase64 =
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQACWAJYAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wgALCAPUA9QBAREA/8QAHAABAAIDAQEBAAAAAAAAAAAAAAYHAwQFAQII/9oACAEBAAAAANQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH178+AAAAAAAAAAAAAAAAAAAbkokXZ6Of6x6XK4UZ4HgAAAAAAAAAAAAAAAAAJHPZP9gBzoTBdYAAAAAAAAAAAAAAAAB1bPkvoABq11BvkAAAAAAAAAAAAAAAAJzZeYD5w/OXJ6BHqm54AAAAAAAAAAAAAAAD6tCcB8x+Jx7lYXu93JLLtwNKnuGAAAAAAAAAAAAAAAD21pmPIlXfHAGWZ2JvDWpvhAAAAAAAAAAAAAAABZVgDSqmMAANiz5mNKk+cAAAAAAAAAAAAAAASu3vTj07zwAAn1l+nBpb4AAAAAAAAAAAAAAA2b03Tk0vpgAATyzfStq+AAAAAAAAAAAAAAAsufmCkuSAAAWpNjBROkAAAAAAAAAAAAAAG3fOYq+CgAADPeXRK/rUAAAAAAAAAAAAAAJ9ZhyaN+QAAAmVsGpQmMAAAAAAAAAAAAAAXd3Cq4SAAAD6vfolPRYAAAAAAAAAAAAAA3L8+mKgtcAAACyLCILV4AAAAAAAAAAAAABKbhI1TQAAACQ3ScOkQAAAAAAAAAAAAACfWYV7W4AAADN+gvpg/PvgAAAAAAAAAAAAACzZ6VXCQAAAC+995+f9YAAAAAAAAAAAAABac3KiiQAAABeXYeULoAAAAAAAAAAAAAALSnBUkQAAAAL06zyhNEAAAAAAAAAAAAABZVgFXwUAAAAv8A23n58wgAAAAAAAAAAAAAJzaJBavAAAAbl/GnQIAAAAAAAAAAAAABIbpOLR4AAACV2+RumQAAAAAAAAAAAAADLf8AmeURzQAAALWmhXNdgAAAAAAAAAAAAAC4JUV7W4AAANq+c7ykuGAAAAAAAAAAAAAAJdbhrUTqAAABZFhHHo0AAAAAAAAAAAAAAPu9ekQqqgAAB1bvzFVwkAAAAAAAAAAAAAAE0tYVLDwAAGa6e2cqjfgAAAAAAAAAAAAAAHt0SEw0/GwAAZLblZ5TsYAAAAAAAAAAAAAAAdS7dkw1TEQABtW1JhBavAAAAAAAAAAAAAAAEot/7PIPW2uABJbT6QjlOYwAAAAAAAAAAAAAAAmVq/Y04FCtMB7Ip/J/Rwab1wAAAAAAAAAAAAAAAJVbGwHxHo/yNL5z9Ltybf8AR5F6lwAAAAAAAAAAAAAAAAHWuDqAHnoBXddeAAAAAAAAAAAAAAAAZZLKZL0fQAAMXAjEV5QAAAAAAAAAAAAAAD2QzSW5vQAAAPOLDYbqAAAAAAAAAAAAAAGSZTzr+gD409TWx+feba3Nj0AYofAeQAAAAAAAAAAAAAH3NbB6IHmtHuFxeTofABs9Ps9vv9n6A+YlXPKAAAAAAAAAAAAASazeuDzkxKK8X5AAA25NK5RmB8QautYAAAAAAAAAAAAbdmzH0MMNhPDAAAAbEvnHa9DRq+JgAAAAAAAAAAAJLa2+GrA4LqgAAAASOw5H6PIXWOAAAAAAAAAAAAe2FYv0McEr3WAAAAACS2X2g5FQ8oAAAAAAAAAABltWYBHKt5QAAAAAD6nVj5xq1HGwAAAAAAAAAAbFvyMY62gfgAAAAAAdO2O+MdTxEAAAAAAAAAAbFx98c2o+GAAAAAAA+7Knnp8VRDwAAAAAAAAAGW45EI/UOmAAAAAAAE0tP7Pio4oAAAAAAAAAD225cIvUWIAAAAAAACUW7lMNM8EAAAAAAAAALFsUReocYAAAAAAABJbgymjSOiAAAAAAAAASW5PSP01iAAAAAAAACWW59Ecpr5AAAAAAAAA2rx3zmUppgAAAAAAAAT+yxWtfgAAAAAAAAWrNTFS3DAAAAAAAAAe21LzFR/KAAAAAAAACQXT68rOBAAAAAAAAADZvDokZpsAAAAAAAAe3V3yP0t4AAAAAAAAAEnuL0pyMAAAAAAAAEpuE+aR4oAAAAAAAAAFuS44VJ+AAAAAAAALqkBCarAAAAAAAAAAdO88hTUaAAAAAAAA7l2+sdF80AAAAAAAAAAtObkVp8AAAAAAAC0pwQ6pgAAAAAAAAAB1ry+nxQ+gAAAAAAAH3fu0UtHgAAAAAAAAAAuaSFZwEAAAAAAAJLcpzKJ8AAAAAAAAAACZ2uR+lQAAAAAAAsyfFf1qAAAAAAAAAADZv3I+KC1QAAAAAABd/bKZjYAAAAAAAAAAF0yEp+KgAAAAAAGX9A5GP8/YgAAAAAAAAAALGsQruuQAAAAAADt3ecSkAAAAAAAAAAAEquAitPgAAAAAAEvtshtTgAAAAAAAAAAOne5yaLAAAAAAAJ9ZhXVdAAAAAAAAAAAPv9CfbX/P3gAAAAAACybBIjHgAAAAAAAAAAHllZnz+fcIAAAAAAC0J0AAAAAAAAAAAAFAagAAAAAAC05uAAAAAAAAAAAAFB6IAAAAAAC05uAAAAAAAAAAAAFB6IAAAAAACV9wAAAAAAAAAAAAK/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//EAFAQAAEDAQMFCwgHBQUIAwEAAAECAwQFAAYRFyExQVUHEhMgIlFhcZKT0RQyUGCBkaHBEBUjQEJSsTBDYnLhJDM1dLJEU1RjgoOwwjRFZKL/2gAIAQEAAT8A/wDJdBtw6EKPUm3AujS0vsmxSoaUkdY9dINJn1Je9hxHXulKcw9ui0Dc3qkjBUt9mMnm89XwzWibmtKZwMl+Q+ebEJHwtHuhQY2G8prKiNawVfrZqmwWP7qHHR/K2BYNNp0ISOoW3iTpSPdZcZhYwWy2rrQDZ6gUmQDwtOiq/wC0BaVcGgSAd7GWwedpZHwNpu5gMCqFUSDqS8j5i1QuXXKeCpUQvNj8bJ33w02WhTailaSlQ0gjAj1to1y6rV964WxGjn946MMR0DSbUq4NIp4C3kGW8PxO+aOpOizbSGmwhtCUJGgJGAH7So0Om1VOEyI04fzYYKHtGe1X3NVJCnaVJ32vgXvkrxtNp8unPlmZHWysalDT1HX600W71Qrj29itYNg8p1eZKfbrtQrk02jhLq0iTKGfhHBmB6BqtgOb7hOp0WpMFiWw262dSho6ua14Nzt6NvpFJUXm9JYUeUOo67LbW04pDiSlaTgUqGBB9ZdJwFrr3CcmbyZVQppjSljQpfXzC0eMzFYSyw0htpIwSlIwA/YFxKfOIHWbKnw0edKYT1uCwqcAnATY5/7qfGyZLC/MebV/KoGwOPHwxteG6UGvNKWoBmWByXkjP7ecWq9Gm0SWY8xre/kWPNWOcH1jQhbriW20lS1HBKQMSTa6VyW4ARPqSAuXpQ0c4b6+c2w4pWEgknADSTaqX1otNxQZPDuj8DPKPv0WnbpstZKYMJtoalOnfH3DNaXe+vTMd/UXUA/hbwQPhZ2XJfOLsh1w86lk206foStSTilSgeg4Wj1uqRCCxUJKMNQcOHutD3Qq5FIDrjUlPM4jA+8Wp+6VBfUlM6M5GOtSDv0+NoNUg1JvhIclt5P8Cs46xqsDjxapSolXhqiy2gts6DrSecHUbXju1Ku/KwVi5FWfs3gNPQeY+sKUqWtKEJKlKOAA0k2uddBNKZTOmoCpyhilJ/dDxthhxFKCRiTgLV2/tPpZUzEwlyRmwSeQk9J8LVa89VrKiJMlSWjoab5Kfdr9v7NiS/FdDrDq2nBoUhWBtRd0aZGKWqojylrRwqcyx8jamVeDVo4ehyEup1gaU9Y1cWdAj1GIuLJbS4ysYKSbXmu2/d+dvc64jh+yd+R6fWC4l1Ay2irzm/tVZ2G1DzR+brsABxKnVYdJiKkzHg2gaOdR5gNdrxX0nVoqYYKo8PRvEnlLH8R+X7eFOlU6SmREeU06nWk/rz2uzfpiqFEWoFLEs5kq0Ic8D0WBx4lUpkarQHIklsKbWNOtJ1EdNq3R5FDqTkR8YgZ216lp1H1euTdz64qHlUlGMOOrEgjMtWoeNgkJGAGA4l4LwxKBC4Z4751WZtoHOs+HTasVmZW5hky3MfyIHmoHMB9x0WujfhTBbp9VcKm8yW31aU9CujpslQUAUkEHQRxL1Xfar1LU2ABJbxUyvp5uo2dacYeW06kocQSlSTpB9XKfBeqU9mGwnFx1QSOjptSqYzSaczDYTghtOGOtR1k8Sv1yPQqcqU8cV6G2xpWrmtU6nKq85cuW5vlq0DUkcw6PulyL3qjrbpVQd+xVmZdUfMP5T0WBB0cTdEu/vFisx0ZlEJfA59Svl6ubnND4KM5Vnkct3kM46k6z7flxJktmDFckvrCGm0lSlHmteGuP16prkOEhpPJab/Knx+7XEvOahG+rZbmMplPIUdLiR8xxJkVubEdjPICm3UlKgeY2q1NdpNUkQndLSsAecaj7vVqmQHKnU48JrznVhOPMNZ91okZuJFajtJ3rbSQhI6BxN0K8JkyhSI6/smTi8QfOVzez7vDlvQZjUqOspdaUFJNqHVmqzSmZrebfjBSfyq1jibpNI4SMzVW0cps8G6RrSdB9/wCvq1uaUzhJUmprTmbHBN5tZzn4frxLx1dNFor8vEcIBvWxzrOizji3nVOOKKlrJUonWT943Pq2YNVNPdXgxK83HUvV79Hu4lUhIqNNkQ3ByXkFPVzH32fZXGkOMODBbailQ6QcPVm6NP8Aq67UNopwWtPCr61Z/Dibo9WMmqNU5Cvs4w3y+lZ8B+v3ltxbTqHEEpWghSSNRFqFUk1ajxpg0uIG+HMoZj8eJf8Ap/kV5XHUpwRJSHB16D+nx9WKTEM+rxIoGPCupSerHPZCQlISBgBmA+mS+mNHcfWcENoK1HoAtOlrnT35ThxW84Vn2n71uZVIqZmU5R8wh1A6DmPy4m6ZC4SlxZgGdl3eE9Ch4j1Y3Po3lF6mlkZmW1L9ugfrxL9zfI7rSADgp8hoe3T8AfvdypvkV6YhJwS6S0r26PjhxL4RfK7qz0YYlLe/HWk4/L1Y3L2MZk9/DzUJQPaSflxN1CThHp8UHzlKcPsGA/U/e4jxjTGH0nAtuJUPYcbNrDjaVjQoAj6ZrQfgvsnQttSfeLKTvVFJ0g4eq+5g3hTp7nO8ke4f14m6Y7vq5FbxzIj4+8nw++UR3hqHBdxxKmEH4D6TnGFqgjg6lKR+V5Y+J9V9zID6ikn/APQf9I4m6Mcb04czCPn98uqd9demn/kJ+k2rYwrs8DR5Qv8A1H1X3MlY0SUnmkf+o4m6OnC86Vfmjp/U/fLsJ3l2aak/8On9PpNqyrfVucrnkL/1H1X3LncYlQax0OIV7wfDibpzO9qkJ7Utkp9x/r97wxzC1LZ8npcRn8jKE/AfSo71JPMMbS3OFmPufmcUfefVfcxkbyrzI5P94yFD2H+vE3TovCUmJKA/unSknoUP6fe6TGMyrxIwGPCPJT7Mc9gAAANA+mrPiLSJj5OHBsrV8LY45/Ve5EvyS9kMk4JdJbPtGb44cS9kH6wu1NZAxWEb9PWnP8vve59B8qvKl4jFEZBWes5h+vEv3L8lunKGOCniloe05/gD6sRn1RpTL6POaWFj2HG0V5EmK0+g4ocQFg9BGP0qSFAgjEEYEWvBTlUquS4hGCUrJR0pOcfetzimGLRHJi04LlLxH8ozD448TdOmj+xQEnndWPgPn6s3BqXl12m2VHFyMotHq0j4fpxN0mjlTTFVaTiUfZO4c2o/L2/eadBdqVRYhsjFbqwnqGs2hxW4URqM0MG2kBCR0D6ScLXuqP1neWW8k4toVwSOpOb9cfVnc9qog17yVxWDUsb3/rGj5jiT4TdQgvRHgC26gpVaqU56lVJ+E+OW0rDHnGo+77xucUIobcrDycCvFDIPNrPy4l56oKRQJMnHBze7xv8AmOYeNiSSSc5On1ZadWw8h1tRStCgpJGoi1BqaKxR48xBGK08scyhpHEv7dw1CEKjGRjJYHLA0rR4j7vd6iu12qtxUAhocp1f5U2jRm4kdthlIS22kJSkagOJui1jyqpoprS8W42deB0rPgP19W9z6u+Q1FVNfXgxJPIx1L/rxCARgRa+91zS5RnxG/7G6rlAD+7UfkfusWK9Nktxo7ZcdcO9Ska7XZoDNApgZACn18p5zDSebqHEvBV26LR3piyN+BvW0/mUdAs885IfcedUVOOKKlKOsn1bSpSFpWhRSpJxBGo2uleBNcpKVLUPKmsEPJ6ef28STGalx1sPISttYKVJIzEWvVdZ6gyS60FOQVnkL/L/AAn7myw7JeQyy2pxxZwSlIxJNro3TRRI/lEgJVOcHKOpA5hxFKCRidFr63gNZqpZZXjDjkpRhoUrWr1doFaeoVUbltYlHmuI/MnmtAmsVCG3KjrC2nBvkkcSTFZlx1sPtpW0sYKSoZiLXpuU/SVLlwQp6FpI0qb6+cdP3GBT5VTlojRGlOuq1DV0nmFrsXRj0FoPOEPTVDlOYZk9CeLfy84hxzSojn9odH2qgfMTzdZ9X7nXoXRJfk0hRMF1XK/5Z/MPnZt1DzaXG1BSFDEKBzEcQpBGBAIPPa8lwGJpXKpe9YfOdTR8xR6OY2mwJVOkKjy2FsuDUoaern/bUC5dQrKkuupMaIf3ixnUP4RakUSDRYvARGQnHzlnOpZ6Txb13maoMHBtQVMcH2SOb+I9Fn3nZL63nllbq1FSlHST6wXOvgqlKTAnLJhqPJWc5aPhZtxDqErbUFJUMQoHEEcWo0uFVI5YmR0OoP5hnHUdVqxuauI3ztKkBSf9y8cD7FeNp1Kn01zeTIrrJ51JzHqOj9ilKlqCUglR0ADEm1KuRWKmUqUz5K0fxvZs3QNNqLcWmUlSXXU+VyB+N0Zh1JsABoHFvLeeNQImJIclLH2bOOc9J5hadOkVKY5KlOFbrhxJOroHR6xXVvi/RFpiyd87BJ0aVN9I6Oi0SbHnRkSIzqXWljEKSeM4y08godbStB0pUMRafcahziVeS8As/iZVvfhotK3LxnMSpEfwuo+Ys/ucVtv+7VGdHQ5h+osu4t4Uf7Dvv5XE+Nhci8JOH1coda0+Nm9z+8Dhzx2m+lTo+Vo+5jUFkGRNjtDmSCo/K0Pc1pbJBlPvyDzY7wfDPaBQ6ZTEgRITLRH4gnFXvOe2A4pOFr03xjURtTEcpenEZkA5kdKvC0yZIqEpcmU6px1ZxKj6yUO8M+hSd/FXvm1HlsqzpV/XptQ603W4QfQy8yoechxBGB6DrH7HAWwH7E5hja9d95LS1wqc06zqVIcQUk/yg/rZa1OLK1qKlKOJJOJJ9Yo8Z+U4G47Ljqz+FCSTanbn9am4KeQiIg63TyvcLQNzWnM4KmSHpCvyjkJ8bQqDSqeB5NAYbI/FvcT7znsABoH3R6MxIQUPMtuJOpaQR8bT7jUOdiRE4BZ/Eyre/DRafuYvpBVAmpXzIeGB94tULuVemE+UwXQgfjSN8n3j1dAJIABJOgC1KuTWapvV8B5Myf3j2b3DTambnNMib1cxa5bg1Hko9wtFhRYTQbix22UDUhIFgAPvW9HNap3Uo9UxL0JCXD+8a5CvhptVNzOS1vnKbKS8nU27yVe/RadTJtMdLcyM4yr+IZj1HQfVhhh6S8lphpbritCUDEm1H3OZ0veu1FwRWzn4NPKWfkLUm7NKo6R5NETwg/eucpR9uq2AGr9jiPoW802MVuISP4lAWdrdKY/vKjFT1ups5e6gN+dVGD/KSf0sq/N3kn/5+PU2o/Kxv/d4f7U4eppXhbKBd/8A4lzulWF/bvH/AG1Q62leFkX1u8v/AOybH8yVD5WbvNRHfMqkU9bgH62aqEN/+6lsL/lcBsCCMQcbYj9k/GYktFp9lDjatKVpxBtV9zqBM3zlPWqI7+XzkH2aRar3ZqlFUTKjEtDQ83ykn26vb6qNtOPOJbaQpa1HAJSMSbUTc6lyt69U1+TtHPwSc6z181qZRKfSGuDhxkN86tKj1n9hiOe0upQYKd9Klssj+NYBtM3QaHFxDTrklXM0jN7zhaVuoOHERKckdLq8fgLSd0CvyMd6+0yOZtsfqcbSLwVeVjw1SkqB1BwgfCy3XHDi44tZ/iUT+xGY4jNZmoTY5xZmPt/yuEWjXwr8bDe1FxYGpwBX62i7pdVawEiPGfHOAUm0TdNguYCVDeZPOghY+VoV7KJPIDVQaCj+FzkH42S4haQpKgpJ0EHEWBx4620uJKVpCknSDrtW7gU6o752GPI3z+Qcg9Y8LVi7lSojmEtg8HjyXUZ0H26vVGgXKqNZ3rziTGin94sZ1D+EWo13KdRGd7FYHC4YKdXnWr22Aw42I57VK8tJpQIkzWwsfu0HfK9wtUN05IxTToJPM4+cPgPG0+99cqGIcnLbQfwM8gfDPZa1uKKlqUpR0lRxP3SJVJ8BQVEmPMnmQsge61P3RqtFwTKQ1LRrKhvVe8eFqduh0eZvUyCuIs/7wYp94sxKjymg5HebdQdCkKBFsceM4y282pDqErQoYFKhiDavbnbEkrfpKgw7p4FXmHq5rTqfLpslUeYwtlwalDT1c/qbT6bLqspMaGwp1w82gdJOoWu9cOJTCiRPCZUkZwCOQg9A19dgABgONJlx4bKnpL7bTY0qWoAWqu6RBjb5unsqlODNv1clHibVO9tZqhUl2Uppo/u2eSPE2Oc4nT96iTpcB0ORJDjKxrQrC1K3SJ0beoqDKJSNa08lfgbUi9VJrGCWJKUOn907yVf19lsRz8aqUiFV4pYmMJdTqOtPSDqteK48ykBUiIFSYgzkgcpA6R8/Uu7dzplcUl5zfR4WtwjOv+UfO1LpEOkRUsQ2Q2kaTrUecnXxp1Qi01gvy30MtjWo6erntWd0nzmqSx0cM6P0T42nVKbUni7MkuPL/iOYdQ0D7+CQcQcCLUe+1WpOCFO+VMD928cSOo6bUW+tLq+9b4TyaQc3BOnDE9B0G2PFIBGB0WvNcSPUd/KpwTHlaSjQhw/I2lxJEGSuPJaU06g4FKh6jpSVKCUgkk4ADXa6twsSibWEZvORH+avCyEJQkJQAlIGAAGAHFefajsqddcQhtIxKlHAC1d3Rmmt8xSGw6vQX1jkjqGu06oS6lIL8yQt5w61HR1DV6Eod9anRylpxXlUYfu3DnA6DaiXnptcQBHdCHQM7K8yh42x4hz2rt3YNeiFuQjB1I+zdSOUnxHRauXfm0GXwUlGLaj9m6kclY8ej1Fjx3pchDEdtTjqzglKRiTa6ty2aQlMqaEuzSMRrS31dPTYDAYcW8N8IFCBaJD8rDMyg6P5jqtWbxVCuO76U9g0DyWUZkp9mv0O24tpxLjalIWk4hSTgRa726E7H3kergut6A+kcpPWNdostibHQ/HdQ60sYhSTiOLPp8apRVx5TSXWlDOD+o6bXnulJoLpeb3z0FR5LmGdHQrx9Q4UGRUZbcWK0XHVnAAfqei117qxqBH36sHZqx9o7ho6E9HFffajMLeecS22gYqUo4AC15d0ByQVxaQS23oVIPnK/l5uuylKWoqUSpROJJOJPoqjV+fQ5HCRHTvCeW0rOlXWPna716oNfbCWzwUkDlMqOfrHOOK+w3IZW08hK21jBSVDEEWvbc5yjrVMhJUuCTnGktdfR0+oMGDIqMxuLFbLjrhwAH6notdm7MegQ8Bg5KWPtXcNPQOji1itw6JEVIluAD8CB5yzzAWvBeibX3zwh4KKk8hhJzdZ5z6NadcYdS60tSHEHFKknAg2utfxEoohVVSUP6EP6Er6+Y2ScQDxHG0OoUhaQpKhgUkYgi18bnqpK1ToKCqEo8pAzlo+Hp+NGemSW48dtTjrh3qUjWbXVuwzQIeKglcxwfauc38I6OLea9MWgRyk4Oylj7NoH4nmFqlVJdXmKlTHStZ0DUkcwGoekLp33cpykQqkpTkTQhw5y3184sy82+yh1paVoWMUqScQRxHWkOtqQ4kKQoYKSRiCLXwumuiyDLiJKoDh6+CPMejm9OpSpaglIKlE4ADSTa5l1U0aMJcpIM50a/3aeYdPPxb2XtZoTJjs71ycsclOOZA51eFpMp6ZJXIkOKcdWcVKVr9JXUvc9Qnkx5G+dgqOdOkt9I8LRpLUuOh9hxLjSxilSTiCOJJjMy47jD6EracTvVJI0i16buO3fnkJ3y4jpJZc+R6R6cuFdbMmrzUZ9MdCh/8A0flxb23raoUcx2d6uc4OSnUgfmPhZ992S+t95xTjizipSjiSfSl071u0GSGn985BWeUnWg/mHhaPIalR0PsrSttY3yVJOII4lXpUesU9yJJTihQzHWk6iLVelyKPUXIclPKSeSrUpOoj01c67aq5UeFfSfImCC4fznUmyEpQhKUgBIGAA1DiXpvMzQIJwwXLcGDTfzPRaVJemSXJEhxTjrhxUpWv0tc29aqLIEOWomC4dJ/dHn6ueza0uIStBCkqGIIOYjiXvu6iu00ltIExkEtK5+dJ67LQptakLSUqScCCM4PpinQH6nPZhx04uOKwHRzk2o9KYo9OahxxyUDOrWpWsniVysR6JTXJcg6MyEY51q1AWqdSk1ae5MlL3zizo1JGoDo9MXEvUWVopE5z7M5o7ij5p/KejmsDj9J0W3Qrt8Ev64io5Ks0hIGg6lemLgXe8hgGoyEYSJCeQCM6Uf14kl9uNHW+8sIbbBUpR0AC157wu1+pFzEpjN4pZRzDnPSfTIJBBBwIzgi1yLz/AFvDEOUv+2sjSf3iefr5+JJjtyo7jDyQttxJSpJ1g2vDRnKHV3YiwS35zS/zJOjw9LXQof13WUJcSfJmeW6efmT7bJASkAAAAYAD6ScBbdAvGX3jR4rn2SDi+oHSr8vs9NwJz9NnNTIy9660rEHn6Oq1EqzFZpjUxk+eOUn8qtY4l9qEKxRytpGMqOCtvDSoa020HA+lACogAYk5gLXRoiaLQ22lpHlDv2jx6Tq9nEvdX00OkLUgjyp3FDI6dZ9llKUtalqJUpRxJOs+nLlXg+pqsGX14Q5BCV8yValWBChiNH0m1+KJ9VVtTzKcI0rFaMNAV+IfP2+lLiUb6zriZDicY8TBxWOgq/CPn7OI4tLTalrUEpSMSTqFrz1tVdrLj4J4BB3jKeZPP7dPp64lf+tKV5I8rGTFASSdKkaj8uJeyjCs0J5hKRw7f2jR/iGr26LEEEgjAjSPSdzqQKTd9lCk4Pvfau9Z0D2DDiboVc8ipopzK8HpPn4HOlGv36Pf6fu/Vl0WssTEk7wHeuJ/Mk6bMOofZQ62oKQsBSSNYPEvxSBS7wOLbTgxJ+1R0H8Q9/6+krpUr62vDHZUnFps8K51DV7ThYADQPpfdSyyp1at6hAKlHmAtXqqus1mRNV5qlYNjmSNHqBud1ozKYqnOqxdjeZidKD4cS/tJFQu8t5CcXop4VOGsfiHuz+z0lubUsMUl6oLTy5Ct6kn8o/rjxN0Kr+Q0PyNtWD0s709CBp+Q9QbtVU0evRpWODe+3jnSk6fGyVBaQpJxBzg/S42l1CkLAKVAgg6wbVunqpVZlQyMzbh3vSk5x8PSDLK5D7bLYxW4oJSOknC1NhIp1OjxGxyWmwjrwH0k4WvpVPrO8b5QrFpj7FHs0n34+oVyKr9ZXcZC1YvR/sV+zQfdxN0ymcHKi1FCcziS0s9Izj4Y+70hcSB5bedhahiiOC6esZh8TxLwVEUqhS5eOCkNkI/mOYWJKlEqOJJxJ9QtzipeTVxyEtXIlIzD+JOcfDHiX0gfWF2JSAMVtDhUdaf6Y+kNzKBvYEucoZ3FhtJ6Bp+J4m6bUSiJEp6VZ3FF1Y6BmHxPw9Q6fLVAqMeWjzmXAv3GzDqX2UOoOKFpCknoI+l1tLrakKGKVAgjoNqlEVBqcqIrSy6pHsB9H3Rh+RXXgt4YKU3wiutWf58S/U3y29UkA4oYAaHs0/En1EuTO8uurFJOK2gWlezR8MOJugwxGvQ44BgmQ2lz26D+no6MyZEtlhOcuLSge04WYaDLKG0jBKEhI6h9L7oYYcdV5qElR6gLSn1Spb0hedTqys+04+om5hMPBz4ROgpdSPgflxN0+J9lAlgZwpTZPxHz9HXQj+VXrp6CMQlzfn2DH5cS90ryS609wHAlveD/qzfP1F3PZXAXpbbJzPtqR8x+nE3Qo/D3UdXhiWXEL+OHz9HbnDPCXmLmGZphR9+A+fE3SZHBXcbZBzuvpHsAJ8PUW7sjyW8dPexwAfSD1E4fPiXnZ8ouzUWwMSWFEezP8vR25e1jNqD35W0p95PhxN1B7k05jHWtf6D1FZXwT7bg0oWFe42aXwjSF/mSD9M5vhoMhv87ak+8WIwJB1ZvRu5e3/Zqi5zrQn4HiXtunKvHMjusyWmkNNlOCwcSScdVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmE/aEbsqtkwn7QjdlVsmFQ2hG7KrRGlsxGWlkFSEJSSNZAw+lQ3ySOcYWlI4OY+j8rih8fRu5gnCkTVc74/0j1Oqqd5V5qeZ9f+o+jdzH/A5X+Y/wDUep1a/wAcn/5hf+o+jdzH/ApX+Y/9R6nVr/HZ/wDmF/6j6NuvfFN3IDsZUJT5cc3++Dm9wzAc3RbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC2VJvZS++HhbKk3spffDwtlSb2Uvvh4WypN7KX3w8LZUm9lL74eFsqTeyl98PC02R5ZPkSQne8K4pe9xxwxOP/lEP/9k=";
    //this.inputImage.nativeElement.value = "no-foto.jpg";
  }

  /**
   * modal sueldo
   * @param content
   */
  onClicConsultaSueldo() {



    this.ref = this.dialogService.open(CcModalTableSueldoComponent, {
      data: {
        search :  this.formFichaEmpleado.get('lgSueldo').value,
        id_cargo: this.idCargoEmpl
      },
      header: "Sueldo",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe((selectSueldoOption: SueldoResponseI) => {
      console.log(selectSueldoOption);

      this.inputSueldoAnio.nativeElement.value = selectSueldoOption.sld_anio;
      this.inputNameSueldo.nativeElement.value = selectSueldoOption.id_sueldo;
      this.id_sueldo = selectSueldoOption.id_sueldo;

      this.inputCargoSueldo.nativeElement.value = selectSueldoOption.cargo.car_nombre;
      this.id_cargo_sueldo = selectSueldoOption.id_cargo;

      this.inputCodigoSectorial.nativeElement.value =
        selectSueldoOption.sld_codigo_sectorial;
      this.formFichaEmpleado.controls.lgSalarioMinimo.setValue(selectSueldoOption.sld_salario_minimo)
      // this.inputSalarioMinimo.nativeElement.value =
      //   selectSueldoOption.sld_salario_minimo;
      this.inputTipoContrato.nativeElement.value =
        selectSueldoOption.tipo_contrato.cat_nombre;
      this.id_tipo_contrato = selectSueldoOption.id_tipo_contrato;

      // this.inputTiempoAlmuerzo.nativeElement.value = selectSueldoOption.tiempo_almuerzo.cat_nombre;
      // this.id_tiempo_almuerzo = selectSueldoOption.id_tiempo_almuerzo;
    });
  }


  onKeypressEvent(event: any){

    console.log(event.target.value);
    let key = event.which ? event.which : event.keyCode;
    if (event.target.value.length == 10) {
      return false;
    }else if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;

 }



  /**
   * modal departmento
   * @param content
   */
  onClicConsultaDepartamentos(content) {
    // let busqueda = (typeof this.numAccountMayor === 'undefined') ? "" : this.numAccountMayor;

    // let consulta = {
    //   busqueda: this.numAccountMayor
    // }

    // localStorage.setItem("busqueda_cuetas", busqueda)
    // localStorage.setItem("detalle_consulta", "false");

    this.ref = this.dialogService.open(CcModalTableDepartamentoComponent, {
      data: {
        search :  this.formFichaEmpleado.get('lgDepartamento').value,
      },
      header: "Departamentos",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe(
      (selectDepatamentOption: DepartamentoResponseI) => {
        console.log(selectDepatamentOption)
        this.inputNameDepartamento.nativeElement.value =
          selectDepatamentOption.dep_nombre;
        this.id_departamento = selectDepatamentOption.id_departamento;

        this.inputNameArea.nativeElement.value =
          selectDepatamentOption.area.are_nombre;
        this.id_area = selectDepatamentOption.id_area;

        this.inputClasiPro.nativeElement.value = selectDepatamentOption.area?.programa?.clasificacion_programa;

        this.inputNamePrograma.nativeElement.value = selectDepatamentOption.area?.programa?.nombre;

        console.log(selectDepatamentOption);
        this.mensajeSppiner = "Cargando...";
        this.lcargando.ctlSpinner(true);

        this.getCargos(selectDepatamentOption.id_departamento);

        // this.empleadoService.getCargos({id_depa: selectDepatamentOption.id_departamento}).subscribe(
        //   (res)=>{
        //     console.log(res);

        //     this.cargo_cc =  res['data'];

        //     console.log(this.cargo_id_cc);
        //     this.lcargando.ctlSpinner(false);
        //   }
        // )

         this.viewSelectionCargoParameterCC(this.id_departamento);
        // this.cargoService.getPostitionsByDepartment( this.id_departamento).subscribe({
        //   next: (rpt: CargoResponseI) => {

        //     this.dataCargos = rpt;
        //     this.id_cargo = "0";
        //     this.visible = true;

        //   },
        //   error: (e) => {
        //     this.toastr.error(e.error.detail);
        //     console.log(e);

        //   },
        // });
      }
    );
  }

  onClicConsultaEmpleados(content) {
    this.ref = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: "yes",
        search : this.inputNameSearchEmpleado.nativeElement.value,
        relation_selected : "",
      },
      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe((empleadoData: EmployeesResponseI) => {
      this.readOnlyInputsTrueInitialTrue('not');
      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = false;
      if (empleadoData) {
      console.log(empleadoData);

      this.empleadoForm = empleadoData;

      //this.vmButtons[8].habilitar = false;

      this.getCargos(this.empleadoForm.id_departamento);

      //this.arrayCargos = await this.empleadoService.getCargosAsync(this.empleadoForm.id_departamento)


      //FOTO DEL EMPLEADO
      this.getFotoEmpleado(this.empleadoForm.id_empleado);
      //EDUCACION DEL EMPLEADO
      this.getEducacionEmpleado(this.empleadoForm.id_empleado);
      //REFERENCIA DEL EMPLEADO
      this.getReferenciaEmpleado(this.empleadoForm.id_empleado);
      //CARGAS FAMILIARES
      this.getCargaFamiliares(this.empleadoForm.id_empleado);
      //FOLDER DIGITAL
      this.getDocumentoByEmpleadoUno(this.empleadoForm.id_empleado);

      this.getHistoryByEmpleadoUno(this.empleadoForm.id_empleado);

      this.getHistoryContactsByEmployee(this.empleadoForm.id_empleado);

      this.getRetenciones();
      this.inputNameEmpFullNombre.nativeElement.value =
        empleadoData.emp_full_nombre;

      // DATOS DEL EMPLEADO
      this.tipo_identificacion_id_cc = empleadoData.id_tipo_identificacion;
      this.inputNameIdentificacion.nativeElement.value = empleadoData.emp_identificacion;
      this.inputNamePrimerNombre.nativeElement.value = empleadoData.emp_primer_nombre;
      this.inputSegundoNombre.nativeElement.value = empleadoData.emp_segundo_nombre;
      this.estado_id_cc = empleadoData.estado_id;
      if(this.estado_id_cc == 3){
        this.formFichaEmpleado.controls["lgFechaCese"].enable();
      }else{
        this.formFichaEmpleado.controls["lgFechaCese"].disable();
      }
      // this.id_codigo_trabajo_cc = empleadoData.emp_codigo_trabajo;
      this.id_codigo_trabajo_cc = empleadoData.id_codigo_trabajo;

      this.inputPrimerApellido.nativeElement.value = empleadoData.emp_primer_apellido;
      this.inputSegundoApellido.nativeElement.value = empleadoData.emp_segundo_apellido;

      //DATOS EMPLEADO FOLDER DIGITAL
      this.folderDigitalForm.full_nombre_empleado = empleadoData.emp_full_nombre;
      this.folderDigitalForm.id_empleado = empleadoData.id_empleado;

      // let emp_fecha_nacimiento =  new Date(empleadoData.emp_fecha_nacimiento)
      // this.emp_fecha_nacimiento=  new Date(emp_fecha_nacimiento.getFullYear(),emp_fecha_nacimiento.getMonth(),emp_fecha_nacimiento.getDate() + 1);
      this.emp_fecha_nacimiento = moment(empleadoData.emp_fecha_nacimiento).format('YYYY-MM-DD')
     this.fechajubilacion =  empleadoData.fechajubilacion ? moment(empleadoData.fechajubilacion).format('YYYY-MM-DD') : null;
      // let emp_fecha_ingreso =  new Date(empleadoData.emp_fecha_ingreso)
      // this.emp_fecha_ingreso=  new Date(emp_fecha_ingreso.getFullYear(),emp_fecha_ingreso.getMonth(),emp_fecha_ingreso.getDate() + 1);



      //this.emp_fecha_nacimiento =  new Date(empleadoData.emp_fecha_nacimiento);
      this.emp_fecha_ingreso =  moment(empleadoData.emp_fecha_ingreso).format('YYYY-MM-DD')










      this.emp_fecha_cese = empleadoData.emp_fecha_cese ? moment(empleadoData.emp_fecha_cese).format('YYYY-MM-DD') : null

      this.estado_civil_id_cc = empleadoData.id_estado_civil;
      this.genero_id_cc = empleadoData.id_genero;
      this.nivel_edu_id_cc = empleadoData.id_nivel_educativo;

      this.tienejubilacion = empleadoData?.tienejubilacion;
      this.nacionalidad = empleadoData?.nacionalidad;
      this.localidad = empleadoData?.localidad;
      this.region = empleadoData?.region;
      this.direccion = empleadoData?.direccion;
      this.codigo_biometrico = empleadoData?.id_codigo_biometrico;

      // ---HR
      this.tipo_discapacidad_id_cc = empleadoData.id_tipo_discapacidad;
      this.inputNamePorcentajeDiscapacidad.nativeElement.value =
        empleadoData.porcentaje_discapacidad;

      // CONTACTOS
      this.inputTelefonoConvencional.nativeElement.value =
        empleadoData.emp_telefono;
      this.inputCelular.nativeElement.value = empleadoData.emp_celular;
      this.inputCorreo.nativeElement.value = empleadoData.emp_correo;
      this.inputCorreoEmpresarial.nativeElement.value =
        empleadoData.emp_correo_empresarial;

      //DATOS BANCARIOS
      this.entidad = empleadoData.entidad;
      this.numero_cuenta =  empleadoData.num_cuenta;
      this.tipo_cuenta =  empleadoData.tipo_cuenta;
      this.tipo_pago_id_cc = empleadoData.id_tipo_pago

      if(this.tipo_pago_id_cc === 183){
        this.isDisableTipoPago = false;
        this.formFichaEmpleado.controls["lgEntidad"].enable();
        this.formFichaEmpleado.controls["lgNumeroCuenta"].enable();
        this.formFichaEmpleado.controls["lgTipoCuenta"].enable();
      }else{
        this.isDisableTipoPago = true;
        this.formFichaEmpleado.controls["lgEntidad"].disable();
        this.formFichaEmpleado.controls["lgNumeroCuenta"].disable();
        this.formFichaEmpleado.controls["lgTipoCuenta"].disable();
      }






      // SECCIÓN DE TRABAJO DEL EMPLEADO
      this.inputNameDepartamento.nativeElement.value =
        empleadoData.departamento?.dep_nombre;
      this.id_departamento = empleadoData.id_departamento;

      this.inputNameArea.nativeElement.value = empleadoData.area?.are_nombre;
      this.id_area = empleadoData.id_area;

      this.inputClasiPro.nativeElement.value = empleadoData.area?.programa?.clasificacion_programa;

      this.inputNamePrograma.nativeElement.value = empleadoData.area?.programa?.nombre;
      //this.cargo_id_cc = empleadoData.id_cargo;
      this.idCargoEmpl = empleadoData.id_cargo;

      //this.inputClasiPro.nativeElement.value = empleadoData.area?.programa?.clasificacion_programa;

      // JORNADA DE TRABAJO DEL EMPLEADO
      this.inputTipoJornada.nativeElement.value =
        empleadoData.jornada?.jnd_tipo_jornada;
      this.id_jornada = empleadoData.id_jornada;
      this.jornadaParcialPermanente = empleadoData.jornada_parcial_permanente;
      this.inputJornadaParcialPermanente.nativeElement.value = empleadoData.jornada_parcial_permanente;

      this.inputAlmuerza.nativeElement.value =
        empleadoData.jornada?.estado_almuerza.cat_nombre;
      this.id_estado_almueza = empleadoData.jornada?.id_estado_almueza;

      this.inputTiempoAlmuerzo.nativeElement.value =
        empleadoData.jornada?.tiempo_almuerzo.cat_nombre;
      this.id_tiempo_almuerzo = empleadoData.jornada?.id_tiempo_almuerzo;

      this.objDetalleJornada = empleadoData.jornada?.jordana_detalles;

      let totalHoras = 0
      this.objDetalleJornada.forEach(e =>{
        totalHoras += parseFloat(e.total_horas);
      })

      this.totalSemanal = totalHoras

      // SUELDO EMPLEADO
      this.tipo_salario_id_cc = empleadoData.id_tipo_salario;
      this.id_sueldo = empleadoData.id_sueldo;
      this.inputNameSueldo.nativeElement.value = empleadoData.id_sueldo;

      this.inputSueldoAnio.nativeElement.value = empleadoData.sueldo?.sld_anio;

      this.inputCargoSueldo.nativeElement.value =
        empleadoData.sueldo?.cargo.car_nombre;
      this.id_cargo_sueldo = empleadoData.sueldo?.id_cargo;

      this.inputCodigoSectorial.nativeElement.value =
        empleadoData.sueldo?.sld_codigo_sectorial;
      this.inputSalarioMinimo.nativeElement.value =
        empleadoData.sueldo?.sld_salario_minimo;
      this.inputTipoContrato.nativeElement.value =
        empleadoData.sueldo?.tipo_contrato.cat_nombre;
      this.id_tipo_contrato = empleadoData.sueldo?.id_tipo_contrato;

      // HR UNO
      (this.tipo_nomina_pago_id_cc = empleadoData.id_tipo_nomina_pago),
        (this.tipo_anticipo_id_cc = empleadoData.id_tipo_anticipo),
        (this.inputNamePorcentajeValorQuincena.nativeElement.value =
          empleadoData.emp_porcentaje_valor_quincena),
        (this.configuracion_semanal_id_cc = empleadoData.id_config_semanal),
        // emp_fecha_ingreso :  "12-01-2023",





        //    DATOS DE AFILIACION
        (this.extension_conyuge_id_cc = empleadoData.id_extension_conyuge);
      this.iees_jubilado_id_cc = empleadoData.id_iees_jubilado;
      // ---HR
      this.fondo_reserva_uno_dia_id_cc = empleadoData.id_fondo_reserva_uno_dia;
      this.acu_decimo_tercero_id_cc = empleadoData.id_acu_decimo_tercero;
      this.acu_decimo_cuarto_id_cc = empleadoData.id_acu_decimo_cuarto;
      this.acu_fondo_reserva_id_cc = empleadoData.id_fondo_reserva_uno_dia;
      this.variable_id_cc = empleadoData.id_sueldo_variable;


      // ---HR
      this.retenciones_judiciales_id_cc =empleadoData.id_retenciones_judiciales;
      this.inputValorRetencionJudiacial.nativeElement.value = empleadoData.emp_valor_reeten_judicial;

      this.marca_biometrico_id_cc = empleadoData.marca_biometrico;


      if(this.tipo_nomina_pago_id_cc === 75){
        this.isDisableTipoAnticipo = false;
        this.formFichaEmpleado.controls["lgValorPorcentajeAnticipo"].enable();

        this.isDisableConfigSemanal = true;
        this.configuracion_semanal_id_cc = '0';

      }else if (this.tipo_nomina_pago_id_cc === 73) {

        this.isDisableConfigSemanal = false;
        this.isDisableTipoAnticipo = true;
        this.formFichaEmpleado.controls["lgValorPorcentajeAnticipo"].disable();
        this.inputNamePorcentajeValorQuincena.nativeElement.value = 0;
        this.tipo_anticipo_id_cc = '0';

      }else{
        this.isDisableTipoAnticipo = true;
        this.formFichaEmpleado.controls["lgValorPorcentajeAnticipo"].disable();
        this.inputNamePorcentajeValorQuincena.nativeElement.value = 0;
        this.tipo_anticipo_id_cc = '0';

        this.isDisableConfigSemanal = true;
        this.configuracion_semanal_id_cc = '0';

      }
      // this.departamentoForm.area = info.area.are_descripcion;


      // this.inputNameDepartamento.nativeElement.value = selectDepatamentOption.dep_nombre;
      // this.id_departamento = selectDepatamentOption.id_departamento;

      // this.inputNameArea.nativeElement.value = selectDepatamentOption.area.are_nombre;
      // this.id_area = selectDepatamentOption.id_area;

      // this.cargoService.getPostitionsByDepartment( this.id_departamento).subscribe({
      //   next: (rpt: CargoResponseI) => {
      //     this.dataCargos = rpt;

      //   },
      //   error: (e) => {
      //     this.toastr.error(e.error.detail);
      //     console.log(e);

      //   },
      // });
      }
    });
  }

  cancel() {
    // this.readonlyInputIdentificacion = false;
    // this.readOnlyInputsTrueInitialTrue('not');
    this.readOnlyInputsTrueInitialTrue("yes");
    this.disable_fecha_cese = true

    this.empleadoForm.id_empleado = 0;
    // DATOS DEL EMPLEADO
    this.tipo_identificacion_id_cc = "0";
    this.inputNameEmpFullNombre.nativeElement.value = "";
    this.inputNameIdentificacion.nativeElement.value = "";
    this.inputNamePrimerNombre.nativeElement.value = "";
    this.inputSegundoNombre.nativeElement.value = "";
    this.estado_id_cc = "0";
    this.id_codigo_trabajo_cc = "0";
    this.inputPrimerApellido.nativeElement.value = "";
    this.inputSegundoApellido.nativeElement.value = "";
    this.estado_civil_id_cc = "0";
    this.genero_id_cc = "0";

    this.objGetHistoryByEmployee = [];
    this.objGetHistoryByEmployeeContracts = [];
    this.objRetencionesJudiciales = [];

    let today = new Date();
    this.emp_fecha_nacimiento = moment().format('YYYY-MM-DD');
   // this.fechajubilacion = moment().format('YYYY-MM-DD');
    // this.emp_fecha_nacimiento.setDate(today.getDate()-30);

    this.emp_fecha_ingreso = moment().format('YYYY-MM-DD');
    this.emp_fecha_cese = null
    // this.emp_fecha_ingreso.setDate(today.getDate());

    this.tienejubilacion="";
    this.nacionalidad="";
    this.localidad="";
    this.region="";
    this.direccion="";
    this.entidad = "";
    this.numero_cuenta = "";
    this.tipo_cuenta = "";

    // ---HR
    this.tipo_discapacidad_id_cc = "0";
    this.inputNamePorcentajeDiscapacidad.nativeElement.value = "";

    // CONTACTOS
    this.inputTelefonoConvencional.nativeElement.value = "";
    this.inputCelular.nativeElement.value = "";
    this.inputCorreo.nativeElement.value = "";
    this.inputCorreoEmpresarial.nativeElement.value = "";
    this.inputValorRetencionJudiacial = 0;
    this.inputValorVariable = 0

    this.variable_id_cc = '0';

    // SECCIÓN DE TRABAJO DEL EMPLEADO
    this.inputNameDepartamento.nativeElement.value = "";
    this.id_departamento = 0;

    this.inputNameArea.nativeElement.value = "";
    this.id_area = 0;
    this.cargo_id_cc = "0";

    // JORNADA DE TRABAJO DEL EMPLEADO
    this.inputTipoJornada.nativeElement.value = "";
    this.id_jornada = 0;

    this.inputAlmuerza.nativeElement.value = "";
    this.id_estado_almueza = 0;

    this.inputTiempoAlmuerzo.nativeElement.value = "";
    this.id_tiempo_almuerzo = 0;

    this.objDetalleJornada = null;

    // SUELDO EMPLEADO
    this.tipo_salario_id_cc = "0";
    this.idCargoEmpl = '0';

    this.inputSueldoAnio.nativeElement.value = "";
    this.inputNameSueldo.nativeElement.value = "";
    this.id_sueldo = "0";

    this.inputCargoSueldo.nativeElement.value = "";
    this.id_cargo_sueldo = 0;

    this.inputCodigoSectorial.nativeElement.value = "";
    this.inputSalarioMinimo.nativeElement.value = "";
    this.inputTipoContrato.nativeElement.value = "";
    this.id_tipo_contrato = 0;

    // HR UNO
    this.tipo_nomina_pago_id_cc = "0";
    this.tipo_anticipo_id_cc = "0";
    this.inputNamePorcentajeValorQuincena.nativeElement.value = "";
    this.configuracion_semanal_id_cc = "0";
    // emp_fecha_ingreso :  "12-01-2023",*********

    //    DATOS DE AFILIACION
    this.extension_conyuge_id_cc = "0";
    this.iees_jubilado_id_cc = "0";
    // ---HR
    this.fondo_reserva_uno_dia_id_cc = "0";
    this.acu_decimo_tercero_id_cc = "0";
    this.acu_decimo_cuarto_id_cc = "0";
    this.acu_fondo_reserva_id_cc = "0";
    // ---HR
    this.retenciones_judiciales_id_cc = "0";

    // // this.formFichaEmpleado.reset();

    //tabla de cargas familiares
    this.objCargasFamiliares = null;

    //tabla referencias familiares
    this.objEducacionEmp = null;

    //tabla referencias familiares
    this.objReferenciaEmp = null;

    this.actions = { btnGuardar: true, btnMod: false };
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
   // this.vmButtons[8].habilitar = true;
    //foto empleado
    this.imagenDefaultPerfil();
    // this.namePhoto = "",
    // this.imageBase64 = "";
    // this.inputImage.nativeElement.value = "";
this.objGetDocumentByEmployee = []




  }

  // onNodeSelecting(id: any) {

  // }

  /**
   * validar documento
   */
  values = "";

  async cedEvent(event: any) {
    let ident = event.target.value;

    console.log(ident);
    if(ident==''){
      return this.messageService.add({key: 'tr', severity:'error', summary: 'Identificación', detail: 'LLenar campo Identificación.'});
    }
    this.generalService
      .getValidateDocumentIdentification(ident, this.dataCatalogoResponse.cat_keyword/* "CED-05" */)
      .subscribe({
        next: (rpt: GeneralResponseI) => {
          this.dataResponseGeneral = rpt;

          if (this.dataResponseGeneral.code != 200) {
            this.toastr.error(this.dataResponseGeneral.detail);
          }
          this.toastr.info(this.dataResponseGeneral.detail);
          // setTimeout(() => {
          //   // this.dtTrigger.next(null);
          // }, 50);
        },
        error: (e) => {
          this.dataResponseGeneral = e.error;
          this.inputNameIdentificacion.nativeElement.value = "";
          this.toastr.error(this.dataResponseGeneral.detail);
        },
      });
    // if(this.timeout != null){
    //   clearTimeout(this.timeout);
    //  }
    // this.timeout = setTimeout(function() {
    //   // this.validateIdentification();
    //   // console.log(event.value);
    //   console.log(event.target.value);
    //   //consultamos si el numero de ceula es valido
    // },2500);
  }

  async validateIdentification(identification: string, tipo: string) {
    console.log(4545);
    // return this.generalService.getValidateDocumentIdentification(identification,tipo)
    // .subscribe((res: any) => {
    //   console.log(res);
    //   // this.cargosRpt = res;
    // });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageBase64 = event.target.result;
      this.namePhoto = this.fileToUpload.name;

      //console.log("hola" + reader.result);
    };

    // let nombre_foto = this.fileToUpload.name;
    // let base64 = this.fileToUpload;
    reader.readAsDataURL(this.fileToUpload);
  }

  // onFileSelect(event) {
  //   this.selectedFile = event.target.files[0];
  //   console.log(this.selectedFile.name);
  // }

  // changeAvatar(files) {
  //       if (files.length === 0) {
  //           return;
  //       }

  //       const mimeType = files[0].type;
  //       if (mimeType.match(/image\/*/) == null) {
  //           console.log("Only images are supported.");
  //           return;
  //       }

  //       const reader = new FileReader();
  //       reader.readAsDataURL(files[0]);
  //       reader.onload = (_event) => {
  //           this.avatarURL = reader.result;
  //       };
  //   }

  /**
   * referencias empleado
   */

  catalogos: CatalogoResponseI;
  catalogsSelectOptionTable(){
    this.generalService
      .getCatalogoKeyWork('TPRF'/* this.codigocatalogo */)
      .subscribe((res: any) => {
        // console.log(res);
        this.catalogos = res.data;
        // console.log(this.catalogos);
      });
  }

  catalogosNE: CatalogoResponseI;
  catalogsNivelEducacionSelectOptionTable(){
    this.generalService
      .getCatalogoKeyWork('NLED'/* this.codigocatalogo */)
      .subscribe((res: any) => {
        // console.log(res);
        this.catalogosNE = res.data;
        // console.log(this.catalogos);
      });
  }

  catalogosRECA: CatalogoResponseI;
  catalogsRelacionCargasSelectOptionTable(){
    this.generalService
      .getCatalogoKeyWork('CARF'/* this.codigocatalogo */)
      .subscribe((res: any) => {
        // console.log(res);
        this.catalogosRECA = res.data;
        // console.log(this.catalogos);
      });
  }



  onAddNewReferenciaEmpleado()
  {
     //validar q no se pueda agregar mas filas si mas referencias empleados
     if(this.objReferenciaEmp!=undefined){
      let valores = Object.values(this.objReferenciaEmp);

      for(let i=0; i< valores.length; i++){
        if(valores[i]['tipo_referencia_id']=='0' || valores[i]['tipo_referencia_id']==0){
          this.messageService.add({key: 'bc', severity:'error', summary: 'Faltan campos', detail: 'LLenar campo tipo referencia.'});
          return;
        }
      }
    }
    const dataReferencia  : ReferenciaEmpleadoResponseI  = {
      "id_emp_referencia": 0,
      "id_empleado": 0,
      "tipo_referencia_id": 0,
      // "cat_nombre": "",
      "nombre": "",
      "empresa": "",
      "telefono": "",
      "cargo": "",
      "estado_id": 0,
      "tipo_referencia": undefined,
      "estado": undefined
    };

    if(this.objReferenciaEmp !== undefined && this.objReferenciaEmp !== null ){
      this.objReferenciaEmp = [ dataReferencia, ...this.objReferenciaEmp];
    }

    if(this.objReferenciaEmp == undefined){
    this.objReferenciaEmp = [dataReferencia];
    }


     //REFERENCIA EMPLEADO
    //  refencia: [
    //   /*  {
    //      id_emp_referencia: 1,
    //      id_empleado: 0,
    //      tipo_referencia_id: 99,
    //      nombre: "andy panda",
    //      empresa: "tonny",
    //      telefono: "04253453",
    //      cargo: "jefe de alimento",
    //    }, */
    //  ],
  }

  deleteDataReferencia(data)
  {

    Swal.fire({
      title: "Atención!!",
      text: "Esta seguro de borrar el registro?",
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      // this.processing = false;
      if (result.value) {
        //borrar una fila de una tabla
        const index: number = this.objReferenciaEmp.indexOf(data);//get index by passing the concern row data
        //se borra en base el registro
        if( data.id_emp_referencia != 0 && data.id_emp_referencia != undefined ){
          this.deleteOneDataBaseReferencia(data.id_emp_referencia, index)
        }


        if ( data.id_emp_referencia == undefined || data.id_emp_referencia == 0 ) {
          if (index !== -1 ) {
            this.objReferenciaEmp.splice(index, 1);
          }
        }

      }
    });


  }
  deleteDataCargaFamiliar(data)
  {

    Swal.fire({
      title: "Atención!!",
      text: "Esta seguro de borrar la carga familiar?",
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      // this.processing = false;
      if (result.value) {
        //borrar una fila de una tabla
        const index: number = this.objCargasFamiliares.indexOf(data);//get index by passing the concern row data
        //se borra en base el registro
        if( data.id_carga != 0 && data.id_carga != undefined ){
          this.deleteOneDataCargaFamiliar(data.id_carga, index)
        }


        if ( data.id_carga == undefined || data.id_carga == 0 ) {
          if (index !== -1 ) {
            this.objCargasFamiliares.splice(index, 1);
          }
        }

      }
    });


  }
  deleteDocumentoDigital(data)
  {

    Swal.fire({
      title: "Atención!!",
      text: "Esta seguro de borrar este archivo?",
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      // this.processing = false;
      if (result.value) {
        //borrar una fila de una tabla
        const index: number = this.objGetDocumentByEmployee.indexOf(data);//get index by passing the concern row data
        //se borra en base el registro
        if( data.id_doc_ficha != 0 && data.id_doc_ficha != undefined ){
          this.deleteOneDataDocumentoDigital(data.id_doc_ficha, index)
        }


        if ( data.id_doc_ficha == undefined || data.id_doc_ficha == 0 ) {
          if (index !== -1 ) {
            this.objGetDocumentByEmployee.splice(index, 1);
          }
        }

      }
    });


  }


  deleteOneDataBaseReferencia(id_emp_referencia, index){
    this.loading = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get lista desceuntos",
      id_controlador: myVarGlobals.fBovedas,
      id_emp_referencia : id_emp_referencia
    };

    this.empleadoService.deleteOneReferecnia(data)
      .subscribe({
        next: (rpt:any /*  GeneralResponseI */) => {

          this.messageService.add({key: 'bc', severity:'success', summary: 'Confirmado', detail: 'Referencia empleado borrado correctamente.'});

          if ( index !== -1 ) {
            this.objReferenciaEmp.splice(index, 1);
          }
          this.getHistoryByEmpleadoUno(this.empleadoForm.id_empleado);

          this.loading = false;


        },
        error: (e) => {
          console.log(e.data);
          this.loading = false;
          // this.dataResponseGeneral = e.error;
          // this.toastr.error(this.dataResponseGeneral.detail);
        },
    });
  }
  deleteOneDataCargaFamiliar(id_carga, index){
    console.log(id_carga)
    this.loading = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get lista de cargas",
      id_controlador: myVarGlobals.fBovedas,
      id_carga : id_carga
    };

    this.empleadoService.deleteOneCarga(data)
      .subscribe({
        next: (rpt:any /*  GeneralResponseI */) => {

          this.messageService.add({key: 'bc', severity:'success', summary: 'Confirmado', detail: 'Carga familiar del empleado borrada correctamente.'});

          if ( index !== -1 ) {
            this.objCargasFamiliares.splice(index, 1);
          }
          this.getHistoryByEmpleadoUno(this.empleadoForm.id_empleado);

          this.loading = false;


        },
        error: (e) => {
          console.log(e.data);
          this.loading = false;
          // this.dataResponseGeneral = e.error;
          // this.toastr.error(this.dataResponseGeneral.detail);
        },
    });
  }
  deleteOneDataDocumentoDigital(id_doc_ficha, index){
    this.loading = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get folder digital",
      id_controlador: myVarGlobals.fBovedas,
      id_doc_ficha : id_doc_ficha
    };

    this.empleadoService.deleteOneDocumentoDigital(data)
      .subscribe({
        next: (rpt:any /*  GeneralResponseI */) => {

          this.messageService.add({key: 'bc', severity:'success', summary: 'Confirmado', detail: 'Documento digital borrado correctamente.'});

          if ( index !== -1 ) {
            this.objGetDocumentByEmployee.splice(index, 1);
          }
          this.getHistoryByEmpleadoUno(this.empleadoForm.id_empleado);
          this.loading = false;


        },
        error: (e) => {
          console.log(e.data);
          this.loading = false;
          // this.dataResponseGeneral = e.error;
          // this.toastr.error(this.dataResponseGeneral.detail);
        },
    });
  }

  /**
   * select de referencia
   * @param $data
   */
  onSelectOptionTipoReferencia($data, data_row_ref)
  {

    const id_referencia = $data.target.value;

    data_row_ref.tipo_referencia_id = id_referencia;


    // this.objReferenciaEmp.tipo_referencia_id=id_referencia;
    if(this.catalogos!=undefined){
      let valores = Object.values(this.catalogos);

      for(let i=0; i< valores.length; i++){
        if(valores[i]['id_catalogo']==id_referencia){
          // this.objReferenciaEmp.tipo_referencia = valores[i];
          data_row_ref.tipo_referencia = valores[i];
          // console.log(valores[i]);
          // console.log(data_row_ref);
        }
      }
    }

    // console.log(this.objReferenciaEmp);

  }

  saveEditDataReferencia(data){

    console.log("guardar o editar referencia");
    let mensaje = "";
    if(data.id_emp_referencia ==0 && data.id_empleado == 0){
      mensaje = "Guardar"
    }

    if(data.id_emp_referencia !=0 && data.id_empleado != 0){
      mensaje = "Editar"
    }

    // saveOrUpdateOneReferencia
    Swal.fire({
      title: "Atención!!",
      text: mensaje+" Referencia empleado.",
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      // this.processing = false;
      if (result.value) {
        this.execSaveOrUpdateOneReferencia(data,mensaje);
      }
    });

    // console.log(data.id_emp_referencia, data.id_empleado, mensaje);
  }

  execSaveOrUpdateOneReferencia(dataRefEmp,mensaje){

    let idEmpleado = this.empleadoForm.id_empleado==0?dataRefEmp.id_empleado:this.empleadoForm.id_empleado;
    this.loading = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "referencia empleados RRHH",
      id_controlador: myVarGlobals.fBovedas,

      id_emp_referencia: dataRefEmp.id_emp_referencia,
      id_empleado: idEmpleado,
      tipo_referencia_id: dataRefEmp.tipo_referencia_id??0,
      nombre: dataRefEmp.nombre??'',
      empresa: dataRefEmp.empresa??'',
      telefono: dataRefEmp.telefono??'',
      cargo: dataRefEmp.cargo??'0',
    };

    this.empleadoService.saveOrUpdateOneReferencia(data)
      .subscribe({
        next: (rpt:any /*  GeneralResponseI */) => {

          this.getReferenciaEmpleado(idEmpleado);
          this.messageService.add({key: 'bc', severity:'success', summary: 'Confirmado', detail: 'Referencia empleado. '+mensaje});

          this.getHistoryByEmpleadoUno(this.empleadoForm.id_empleado)
          // if ( index !== -1 ) {
          //   this.objReferenciaEmp.splice(index, 1);
          // }

          this.loading = false;


        },
        error: (e) => {
          console.log(e.data);
          this.loading = false;
          // this.dataResponseGeneral = e.error;
          // this.toastr.error(this.dataResponseGeneral.detail);
        },
    });
  }


  /**
   * educaion empleado
   */
  onAddNewEducacionEmpleado()
  {
    //validar q no se pueda agregar mas filas si mas referencias empleados
    if(this.objEducacionEmp!=undefined){
      let valores = Object.values(this.objEducacionEmp);

      for(let i=0; i< valores.length; i++){
        if(valores[i]['nivel_educacion_id']=='0' || valores[i]['nivel_educacion_id']==0){
          this.messageService.add({key: 'bc', severity:'error', summary: 'Faltan campos', detail: 'Llenar campo Nivel Educación.'});
          return;
        }
      }
    }

    const dataReferencia  : EducacionEmpleadoResponseI  = {
      "id_emp_educacion": 0,
      "id_empleado": 0,
      "nivel_educacion_id": 0,
      "num_cursos": 0,
      "institucion": '',
      // "fecha_inicio": Date(),
      // "fecha_fin": Date,
      "grado_obtenido": '',
      "estado_id": 0,
      "nivel_educacion": undefined,
      "estado": undefined,
    };

    if(this.objEducacionEmp !== undefined && this.objEducacionEmp !== null ){
      this.objEducacionEmp = [ dataReferencia, ...this.objEducacionEmp];
    }

    if(this.objEducacionEmp == undefined){
    this.objEducacionEmp = [dataReferencia];
    }
  }


  deleteDataEducacion(data){
    Swal.fire({
      title: "Atención!!",
      text: "Esta seguro de borrar el registro?",
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      // this.processing = false;
      if (result.value) {
        //borrar una fila de una tabla
        const index: number = this.objEducacionEmp.indexOf(data);//get index by passing the concern row data
        //se borra en base el registro
        if( data.id_emp_educacion != 0 && data.id_emp_educacion != undefined ){
          this.deleteOneDataBaseEducacion(data.id_emp_educacion, index)
        }


        if ( data.id_emp_educacion == undefined || data.id_emp_educacion == 0 ) {
          if (index !== -1 ) {
            this.objEducacionEmp.splice(index, 1);
          }
        }

      }
    });
  }



  deleteOneDataBaseEducacion(id_emp_educacion, index){
    this.loadingEdu = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "borrar educacion empleado RRHH",
      id_controlador: myVarGlobals.fBovedas,
      id_emp_educacion : id_emp_educacion
    };

    this.empleadoService.deleteOneEducacion(data)
      .subscribe({
        next: (rpt:any /*  GeneralResponseI */) => {

          this.messageService.add({key: 'bc', severity:'success', summary: 'Confirmado', detail: 'Educación empleado borrado correctamente.'});

          if ( index !== -1 ) {
            this.objEducacionEmp.splice(index, 1);
          }
          this.getHistoryByEmpleadoUno(this.empleadoForm.id_empleado)

          this.loadingEdu = false;


        },
        error: (e) => {
          console.log(e.data);
          this.loadingEdu = false;
          // this.dataResponseGeneral = e.error;
          // this.toastr.error(this.dataResponseGeneral.detail);
        },
    });
  }

  saveEditDataEducacion(data){
    console.log("guardar o editar referencia");
    let mensaje = "";
    if(data.id_emp_educacion ==0 && data.id_empleado == 0){
      mensaje = "Guardar"
    }

    if(data.id_emp_educacion !=0 && data.id_empleado != 0){
      mensaje = "Editar."
    }

    // saveOrUpdateOneReferencia
    Swal.fire({
      title: "Atención!!",
      text: mensaje+" Educación empleado.",
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      // this.processing = false;
      if (result.value) {
        this.saveOrUpdateOneEducacion(data,mensaje);
      }
    });
  }
  // saveEditDataCargaFamiliar(data){

  //   // saveOrUpdateOneReferencia
  //   Swal.fire({
  //     title: "Atención!!",
  //     text: "Seguro desea actualizar esta carga familiar.",
  //     //type: "warning",
  //     showCancelButton: true,
  //     cancelButtonColor: "#DC3545",
  //     confirmButtonColor: "#13A1EA",
  //     confirmButtonText: "Aceptar",
  //     cancelButtonText: "Cancelar",
  //   }).then((result) => {
  //     // this.processing = false;
  //     if (result.value) {
  //       this.updateCargaFamiliar(data);
  //     }
  //   });
  // }

  saveOrUpdateOneEducacion(dataRefEmp,mensaje){

    let idEmpleado = this.empleadoForm.id_empleado==0?dataRefEmp.id_empleado:this.empleadoForm.id_empleado;
    this.loadingEdu = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Cargas Familiares empleados RRHH",
      id_controlador: myVarGlobals.fBovedas,

      id_emp_educacion: dataRefEmp.id_emp_educacion??0,
      id_empleado: idEmpleado,
      nivel_educacion_id: dataRefEmp.nivel_educacion_id??0,
      num_cursos: dataRefEmp.num_cursos??0,
      institucion: dataRefEmp.institucion??'',
      fecha_inicio: dataRefEmp.fecha_inicio??'',
      fecha_fin: dataRefEmp.fecha_fin??'',
      grado_obtenido: dataRefEmp.grado_obtenido??'',
    };

    this.empleadoService.saveOrUpdateOneEducacion(data)
      .subscribe({
        next: (rpt:any /*  GeneralResponseI */) => {

          this.getEducacionEmpleado(idEmpleado);
          this.messageService.add({key: 'bc', severity:'success', summary: 'Confirmado', detail: 'Educación empleado. '+mensaje});

          // if ( index !== -1 ) {
          //   this.objReferenciaEmp.splice(index, 1);
          // }

          this.getDocumentoByEmpleadoUno(this.empleadoForm.id_empleado)

          this.loadingEdu = false;


        },
        error: (e) => {
          console.log(e.data);
          this.loadingEdu = false;
          // this.dataResponseGeneral = e.error;
          // this.toastr.error(this.dataResponseGeneral.detail);
        },
    });
  }
  // updateCargaFamiliar(dataRefEmp){

  //   let idEmpleado = this.empleadoForm.id_empleado==0?dataRefEmp.id_empleado:this.empleadoForm.id_empleado;
  //   this.loadingEdu = true;
  //   let data = {
  //     // info: this.areaForm,
  //     ip: this.commonService.getIpAddress(),
  //     accion: "Cargas Familiares empleados RRHH",
  //     id_controlador: myVarGlobals.fBovedas,

  //     id_emp_educacion: dataRefEmp.id_carga??0,
  //     id_empleado: idEmpleado,
  //     id_carga: dataRefEmp.id_carga??0,
  //     cedula_carga: dataRefEmp.cedula_carga??0,
  //     nombres_general: dataRefEmp.nombres_general??'',
  //     apellidos_general: dataRefEmp.apellidos_general??'',
  //     relacion: dataRefEmp.relacion??'',
  //     fecha_nacim: dataRefEmp.fecha_nacim??'',
  //     afiliado: dataRefEmp.afiliado??'',
  //     discapacidad: dataRefEmp.discapacidad??'',
  //     id_empresa: dataRefEmp.id_empresa??'',
  //     edad_descripcion: dataRefEmp.edad_descripcion??'',
  //   };

  //   this.empleadoService.modificarFamiliar(idEmpleado,data)
  //     .subscribe({
  //       next: (rpt:any /*  GeneralResponseI */) => {

  //         this.getCargaFamiliares(idEmpleado);
  //         this.messageService.add({key: 'bc', severity:'success', summary: 'Confirmado', detail: 'Carga familiar actualizada con éxito. '});

  //         // if ( index !== -1 ) {
  //         //   this.objReferenciaEmp.splice(index, 1);
  //         // }
  //         this.getHistoryByEmpleadoUno(this.empleadoForm.id_empleado);

  //         this.loadingEdu = false;
  //       },
  //       error: (e) => {
  //         console.log(e.data);
  //         this.loadingEdu = false;
  //         // this.dataResponseGeneral = e.error;
  //         // this.toastr.error(this.dataResponseGeneral.detail);
  //       },
  //   });
  // }

  onSelectOptionNivelEducacion($data, data_row_ref)
  {
    console.log("nivel de educacion");
    console.log($data);
    console.log(data_row_ref);
    const id_educacion = $data.target.value;

    data_row_ref.nivel_educacion_id = id_educacion;

    if(this.catalogosNE!=undefined){
      let valores = Object.values(this.catalogosNE);

      for(let i=0; i< valores.length; i++){
        if(valores[i]['id_catalogo']==id_educacion){
          return data_row_ref.nivel_educacion = valores[i];
        }
      }
    }
  }
  onSelectOptionRelacionCarga($data, data_row_ref)
  {
    console.log(data_row_ref);
    const nombre_carga = $data.target.value;

    data_row_ref.relacion = nombre_carga;

    if(this.catalogosRECA!=undefined){
      let valores = Object.values(this.catalogosNE);

      for(let i=0; i< valores.length; i++){
        if(valores[i]['cat_nombre']==nombre_carga){
          return data_row_ref.relacion = valores[i];
        }
      }
    }
  }




  getDocumentoByEmpleadoUno( ptr_id_empleado)
  {
    this.loading = true;
    let parameterUrl: any = {
      id_empleado: ptr_id_empleado,
      page:  this.pageIndex ,
      size: this.rows,//event.rows,
      sort: 'id_doc_ficha',
      type_sort: 'asc'
    };
    console.log(parameterUrl);
    this.objGetDocumentByEmployee = []
    this.empleadoService.getDocumentByEmployee(parameterUrl).subscribe({
      next: (rpt: DocFichaAditionalResponseI) => {
        console.log(rpt.data);
        this.totalRecords = rpt.total;
        this.objGetDocumentByEmployee = rpt.data;
        console.log(rpt.data);
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
      },
    });
  }



  getHistoryByEmpleadoUno( ptr_id_empleado)
  {
    this.loading = true;
    let parameterUrl: any = {
      id_empleado: ptr_id_empleado,
      page:  this.pageIndex ,
      size: 100,//event.rows,
      sort: 'id',
      type_sort: 'asc'
    };
    console.log(parameterUrl);
    this.empleadoService.getHistoryByEmployee(parameterUrl).subscribe({
      next: (rpt: HistoryResponseI) => {

        //console.log(rpt)
        //this.totalRecords = rpt.total;
        this.objGetHistoryByEmployee = rpt['data'];
        //console.log(rpt.data);
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
      },
    });
  }

  getHistoryContactsByEmployee( ptr_id_empleado)
  {
    this.loading = true;
    let parameterUrl: any = {
      id_empleado: ptr_id_empleado,
      page:  this.pageIndex ,
      size: 100,//event.rows,
      sort: 'id_emp_contrato',
      type_sort: 'asc'
    };
    console.log(parameterUrl);
    this.empleadoService.getHistoryContactsByEmployee(parameterUrl).subscribe({
      next: (rpt: HistoryResponseI) => {

        console.log(rpt)
        console.log("contratos........................", rpt['data']);
        //this.totalRecords = rpt.total;
        this.objGetHistoryByEmployeeContracts = rpt['data'];
        const ultimoContrato=this.objGetHistoryByEmployeeContracts[this.objGetHistoryByEmployeeContracts.length - 2]
       this.ultimoCese = this.objGetHistoryByEmployeeContracts[this.objGetHistoryByEmployeeContracts.length - 2]['fecha_cese'];
       console.log("this.ultimoCese",this.ultimoCese);

// Asigna valores a las fechas (ejemplos)
this.fechaActual = moment();  // Fecha de hoy
this.ultimoCese = moment(this.ultimoCese);  // Fecha de cese (ejemplo)

const superaAnios = this.fechaActual.diff(this.emp_fecha_ingreso, 'months', true);

const diferenciaEnMeses = this.fechaActual.diff(this.ultimoCese, 'months', true);
console.log("diferenciaEnMeses",diferenciaEnMeses);

if ( superaAnios >= 12 ){
  console.log("tiene mas o 1 año tiene fondo");
  this.tieneFondo = true;
} else if (diferenciaEnMeses < 6) {
  console.log('La diferencia es menor a 6 meses',ultimoContrato['tiene_fondo']);
  this.tieneFondo = ultimoContrato['tiene_fondo'];
} else {
  console.log('La diferencia es igual o mayor a 6 meses no tiene fondo');
  this.tieneFondo = false;
}













        //console.log(rpt.data);
        this.loading = false;

      },
      error: (e) => {
        this.loading = false;
      },
    });
  }


  tamanioArchivoConvert($data)
  {
    let fileSize = $data.toString();

    if(fileSize.length < 7) return `${Math.round(+fileSize/1024).toFixed(2)} kb`
        return `${(Math.round(+fileSize/1024)/1000).toFixed(2)} MB`
  }

  defaultFechaModificacion($fModif)
  {
    if($fModif) return $fModif;

    return '-';
  }


  onRowSelectFolderDigitalEmp(dataFolderDigital :DocFicha ){
    this.folderDigitalForm = dataFolderDigital.data;
    let nameEmp = dataFolderDigital.data.empleado.emp_full_nombre;
    this.inputNameEmpFullNombre.nativeElement.value = nameEmp;
    this.folderDigitalForm.full_nombre_empleado = nameEmp;
    this.viewSelectionTipoArchivoCC(dataFolderDigital.data.tipo_archivo_id);

    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = false;
    this.vmButtons[5].habilitar = false;

    // console.log(this.folderDigitalForm );
  }

  get f() { return this.registerForm.controls; }

  viewSelectionTipoArchivoCC(responseId: any) {
    this.tipo_archivo_id_cc = responseId;
    this.folderDigitalForm.tipo_archivo_id =  responseId;
    this.registerForm.get("fg_tipo_archivo").setValue(this.tipo_archivo_id_cc);
  }

  handleSelectTipoArchivo(event: any) {
    this.tipo_anticipo_id_cc = event.id_catalogo
    this.folderDigitalForm.tipo_archivo_id = event.id_catalogo
    this.registerForm.get("fg_tipo_archivo").setValue(this.tipo_archivo_id_cc);
  }
  resetearFechaJubilacion() {
    if (this.tienejubilacion === 'NO') {
      this.fechajubilacion = null; // O asigna la fecha que desees, como 'dd/mm/yyyy'
    }
  }

  dinamicoBotones(e){
    console.log(e)
    var index = e;

    if (index === 3) {

      this.vmButtons[0].showimg = false;
      this.vmButtons[1].showimg = false;
      this.vmButtons[2].showimg = false;

      this.vmButtons[3].showimg = true;
      this.vmButtons[4].showimg = true;
      this.vmButtons[5].showimg = true;

    } else if (index === 6) {
      this.vmButtons[0].showimg = false;
      this.vmButtons[1].showimg = false;
      this.vmButtons[2].showimg = false;
    } else {

      this.vmButtons[0].showimg = true;
      this.vmButtons[1].showimg = true;
      this.vmButtons[2].showimg = true;

      this.vmButtons[3].showimg = true;
      this.vmButtons[4].showimg = false;
      this.vmButtons[5].showimg = false;

    }
  }




  async validaSaveFolderDigital() {
    this.submitted = true;
    // stop here if form is invalid
    // if (this.registerForm.invalid) { return; }
    this.confirmSaveFolder("Seguro desea guardar el documento?", "SAVE_FOLDER_DIGITAL");
  }

  async validaUpdateFolderDigital() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) { return; }
    this.confirmSaveFolder("Seguro desea actualizar el documento?", "UPDATED_FOLDER_DIGITAL");
  }

  async validaDeleteFolderDigital() {
    this.confirmSaveFolder(
      "Seguro desea eliminar el documento?",
      "DELETE_FOLDER_DIGITAL"
    );

    // if (this.permisions.guardar == "0") {
    //   this.toastr.info("Usuario no tiene permiso para guardar");
    // } else {
    //   let resp = await this.validateDataGlobal().then(respuesta => {
    //     if (respuesta) {
    //       this.confirmSave("Seguro desea actualizar la cuenta?", "UPDATED_ACCOUNT");
    //     }
    //   })
    // }
  }


  async confirmSaveFolder(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      this.processing = false;
      if (result.value) {
        if (action == "SAVE_FOLDER_DIGITAL") {
          this.saveFolderDigital();
        } else if (action == "UPDATED_FOLDER_DIGITAL") {
          this.updatedFolderDigital();
        } else if (action == "DELETE_FOLDER_DIGITAL") {
          this.deleteFolderDigital();
        }
      }
    });
  }


  async saveFolderDigital() {

    this.submitted = true;

    var date = new Date();


    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de folder digital rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      id_empleado: this.folderDigitalForm.id_empleado,
      tipo_archivo_id: this.folderDigitalForm.tipo_archivo_id,
      nombre_archivo: this.folderDigitalForm.nombre_archivo,
      extension: this.folderDigitalForm.extension,
      peso_archivo: this.folderDigitalForm.peso_archivo,
      archivo_base_64: this.folderDigitalForm.archivo_base_64,
      fecha_creacion: this.toLocal(date),//new Date().toISOString().slice(0, 10),
      fecha_modificacion: null,

    };

    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.empleadoService.saveFolderDigital(data).subscribe(
      (res) => {

        this.toastr.success("Guardado");
        this.messageError = [];
        this.getDocumentoByEmpleadoUno(this.folderDigitalForm.id_empleado);
        this.lcargando.ctlSpinner(false);
        this.folderDigitalForm.nombre_archivo = null
        this.folderDigitalForm.archivo_base_64 = null
       // this.cancelFolder("not");
      },
      (error) => {

        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.messageError = error.error.detail;
        console.log(error.error.detail);
        // this.toastr.info(error.error.message);
      }
    );
  }

  async updatedFolderDigital() {

    this.submitted = true;

    var date = new Date();


    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de folder digital rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,
      id_doc_ficha : this.folderDigitalForm.id_doc_ficha,
      id_empleado: this.folderDigitalForm.id_empleado,
      tipo_archivo_id: this.folderDigitalForm.tipo_archivo_id,
      nombre_archivo: this.folderDigitalForm.nombre_archivo,
      extension: this.folderDigitalForm.extension,
      peso_archivo: this.folderDigitalForm.peso_archivo,
      archivo_base_64: this.folderDigitalForm.archivo_base_64,
      fecha_creacion: this.folderDigitalForm.fecha_creacion,//new Date().toISOString().slice(0, 10),
      fecha_modificacion: this.toLocal(date),

    };
    this.mensajeSppiner = "Actualizando...";
    this.lcargando.ctlSpinner(true);
    this.empleadoService.updatedFolderDigital(data).subscribe(
      (res) => {

        this.toastr.success("Actualizado");
        this.messageError = [];
        this.getDocumentoByEmpleadoUno(this.folderDigitalForm.id_empleado);
        this.lcargando.ctlSpinner(false);
        this.cancelFolder("not");
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.messageError = error.error.detail;
        this.messageError.forEach(element => {
          this.toastr.error(element.toString());
        });
        // this.messageError = [];
        console.log(error.error.detail);
        // this.toastr.info(error.error.message);
      }
    );
  }


  deleteFolderDigital() {

    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Borrar folder digital rrhh",
      id_controlador: myVarGlobals.fBovedas,
      id_doc_ficha: this.folderDigitalForm.id_doc_ficha,
    };
    // this.validaDt = false;
    this.mensajeSppiner = "Borrando...";
    this.lcargando.ctlSpinner(true);
    this.empleadoService.deleteFolderDigital(data).subscribe(
      (res) => {

        this.cancelFolder("not");
        this.messageError = [];
        this.getDocumentoByEmpleadoUno(this.folderDigitalForm.id_empleado);
        this.lcargando.ctlSpinner(false);
        this.toastr.success("Borrado" /* res['message'] */);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.messageError = error.error.detail;
        this.messageError.forEach(element => {
          this.toastr.error(element.toString());
        });
        this.messageError = [];

      }
    );
  }

  toLocal(date) {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON();
  }


  async cargarCatalogos() {
    this.lcargando.ctlSpinner(true);

    try {
      this.mensajeSppiner = "Cargando Catalogos";
      const response = await this.empleadoService.getCatalogs({params: "'PAIS','BANCO','TIPO CUENTA','NOM_LOCALIDAD','NOM_REGION'"}) as any
      console.log(response)
      this.cmb_nacionalidad = response.data["PAIS"];
      this.cmb_entidad = response.data["BANCO"];
      this.cmb_tipo_cuenta= response.data["TIPO CUENTA"];
      this.cmb_localidad= response.data["NOM_LOCALIDAD"];
      this.cmb_region = response.data["NOM_REGION"];
      this.lcargando.ctlSpinner(false);

      const resTipoArchivos: any = await this.generalService.getCatalogoKeyWork('DCFD').toPromise()
      console.log(resTipoArchivos)
      this.lst_tipo_archivo = resTipoArchivos.data
    } catch(err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.info(err.error?.message, 'Error cargando Catalogos');

    }
  }

  cancelFolder($notDeleteParameter) {

    this.submitted = false;
    if($notDeleteParameter == 'yes'){
      this.folderDigitalForm.id_empleado = 0;
      this.folderDigitalForm.full_nombre_empleado = '';
    }

    this.registerForm.get('fg_nombre_archivo_input').setValue('');

   this.objGetDocumentByEmployee = [];

    /* this.folderDigitalForm.nombre_archivo = '';
    this.folderDigitalForm.id_doc_ficha = 0;
    this.folderDigitalForm.tipo_archivo_id = 0;
    this.folderDigitalForm.extension = '';
    this.folderDigitalForm.peso_archivo = 0;
    this.folderDigitalForm.archivo_base_64 = '';
    this.folderDigitalForm.fecha_creacion = null;
    this.folderDigitalForm.fecha_modificacion = null; */

    // this.viewSelectionTipoArchivoCC("0");
    this.tipo_archivo_id_cc = '0';
    // this.registerForm.reset();
    this.actions = { btnGuardar: true, btnMod: false };
    this.vmButtons[3].habilitar = false;
    this.vmButtons[4].habilitar = true;
    this.vmButtons[5].habilitar = true;
  }
  handleButtonUpload(index: number) {
    document.getElementById('getFileFolder').click()
  }

  validarPorcentaje(){
    console.log(this.tipo_discapacidad_id_cc);
    if(this.tipo_discapacidad_id_cc== 87){
    //this.formFichaEmpleado.get("lgPorcentajeDiscapacidad").setValue('');
    this.inputNamePorcentajeDiscapacidad.nativeElement.value = '';

    }//this.formFichaEmpleado.controls["lgPorcentajeDiscapacidad"].value() = '';
  }

  handleFileInputFichaEmpleado(file: FileList) {


    // Convertir en base 64
    this.fileToUpload = file[0];
    console.log(file[0])

    let reader = new FileReader();

    reader.onload = async (event: any) => {
          this.fileBase64 = event.target.result;
          this.nameFile = this.fileToUpload.name;

          this.folderDigitalForm.archivo_base_64 = event.target.result;

          this.folderDigitalForm.nombre_archivo = this.fileToUpload.name;
          this.registerForm.get('fg_nombre_archivo_input').setValue( this.fileToUpload.name);
          this.folderDigitalForm.extension =  this.fileToUpload.name.split('.').pop();
          this.folderDigitalForm.peso_archivo =  this.fileToUpload.size;



    };
    reader.readAsDataURL(this.fileToUpload);
  //   this.fileToUploadFolde = file.item(0);
  //  // this.fileToUploadFolde = file[0];
  //   //console.log(this.fileToUploadFolde);
  //   //Show image preview
  //   let reader = new FileReader();
  //   reader.onload = (event: any) => {
  //     this.fileBase64 = event.target.result;
  //     this.nameFile = this.fileToUploadFolde.name;

  //     this.folderDigitalForm.archivo_base_64 = event.target.result;
  //     this.folderDigitalForm.nombre_archivo = this.fileToUploadFolde.name;
  //     this.registerForm.get('fg_nombre_archivo_input').setValue( this.fileToUploadFolde.name);
  //     this.folderDigitalForm.extension =  this.fileToUploadFolde.name.split('.').pop();
  //     this.folderDigitalForm.peso_archivo =  this.fileToUploadFolde.size;

  //   };

  //   reader.readAsDataURL(this.fileToUploadFolde);
  }


  descargarDocumentoDigital($data){
    // console.log($data.archivo_base_64);
    // const linkSource = `data:${contentType};base64,${base64Data}`;
    const linkSource = $data.archivo_base_64;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = $data.nombre_archivo;
    downloadLink.click();
  }


 // modalFamiliar(edit: boolean,data: any){
    modalFamiliar(){


    const modal = this.modal.open(ModelFamiliarComponent,{
			size: "lg",
			backdrop: "static",
			windowClass: "viewer-content-general",
		})

    modal.componentInstance.empleado = this.empleadoForm.id_empleado
  }

  editFamiliar(data: any) {
    const modal = this.modal.open(ModelFamiliarComponent,{
			size: "lg",
			backdrop: "static",
			windowClass: "viewer-content-general",
		})

    modal.componentInstance.empleado = this.empleadoForm.id_empleado
    modal.componentInstance.data = data
  }

  onlyNumber(event): boolean {
    let key = (event.which) ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  generarContrato(){
    console.log(this.empleadoForm.id_empleado)
    if(this.empleadoForm.id_empleado == undefined || this.empleadoForm.id_empleado ==0){
      this.toastr.info(
        "Debe seleccionar o crear un nuevo empleado para generar un contrato."
      );

      return;
    }
    console.log(this.empleadoForm)

    let data = {
      fk_empleado:this.empleadoForm.id_empleado,
      observacion: "Generación de contrato de empleado RRHH"
    };

    this.mensajeSppiner = "Generando Contrato...";
    this.lcargando.ctlSpinner(true);
    this.empleadoService.generarContratoEmpleado(data).subscribe(
      (res: any) => {
        console.log(res)


          this.toastr.success(
            "Contrato de Empleado generado correctamente."
          );
          this.empleadoForm = res

          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = false;
          //this.vmButtons[8].habilitar = false;
        // }
        // this.rerender();
        this.lcargando.ctlSpinner(false);
        // this.cancel();
      },
      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
        // let message = '';
        // let errores = Object.keys(error.error.errors)
        // errores.forEach((e: string) => { message += `${error.error.errors[e][0]}<br>`})
        // this.toastr.warning(message, 'Error de validación', { enableHtml: true });
      }
    );
  }

  newTipoArchivo = () => {
    const modal = this.modal.open(ModalTipoArchivoComponent, {size: 'lg', backdrop: 'static'})
  }

  modalRetencionJudicial = () => {
    const modal = this.modal.open(ModalRetencionJudicialComponent, {size: 'xl', backdrop: 'static'})
    modal.componentInstance.empleado = this.empleadoForm
  }

  getRetenciones = async () => {
    // console.log(event)
    this.loading = true
    try {
      const response: any = await this.empleadoService.getRetencionesJudiciales(this.empleadoForm.id_empleado)
      console.log(response['data'])
      this.objRetencionesJudiciales = response['data']
      this.loading = false
    } catch (err) {
      console.log(err)
      this.loading = false
      this.toastr.error(err.error?.message)
    }
  }

  deleteDataRetencionJudicial = async (element: any) => {
    const result = await Swal.fire({
      titleText: 'Eliminar registro de Retencion Judicial',
      text: 'Esta seguro/a de eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    })

    if (result.isConfirmed) {
      try {
        const response = await this.empleadoService.deleteRetencionJudicial({retencion: element})
        console.log(response)
        Swal.fire('Registro eliminado', '', 'success').then(() => this.getRetenciones())
      } catch (err) {
        console.log(err)
        this.toastr.error(err.error?.message)
      }
    }
  }

  editRetencionJudicial = async (retencion: any) => {
    const result = await Swal.fire({
      titleText: 'Editar registro de Retencion Judicial',
      text: 'Esta seguro/a desea editar este registro?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Editar'
    })

    if (result.isConfirmed) {
      const modal = this.modal.open(ModalRetencionJudicialComponent, {size: 'xl', backdrop: 'static'})
      modal.componentInstance.empleado = this.empleadoForm
      modal.componentInstance.input_retencion = retencion
    }
  }

  handleRowCheck(event){
    console.log(event.target.checked)
    this.jornadaParcialPermanente = event.target.checked
  }



}
