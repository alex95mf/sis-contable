

import { AfterViewInit, Component, Input, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { SubrogacionService } from "./subrogacion.service";
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { formatDate } from "@angular/common";
import { CcModalTableEmpleadoComponent } from "src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component";
import { EmployeesResponseI } from "src/app/models/responseEmployee.interface";


import {MessageService, PrimeNGConfig, SelectItem} from 'primeng/api';
import { CatalogoResponseI } from "src/app/models/responseCatalogo.interface";
// import { TranslateService } from "@ngx-translate/core";

import { LazyLoadEvent, Message } from 'primeng/api';

import { RhfolderDigitalEmpleadoService } from "../folder-digital-empleado/rhfolder-digital-empleado.service";
import { AccionPErsonalResponseI } from "src/app/models/responseAccionPersonal.interface";
import * as moment from 'moment';
import { ModalConsultaSubrogacionComponent } from "./modal-consulta-subrogacion/modal-consulta-subrogacion.component";
import { CierreMesService } from "src/app/view/presupuesto/configuracion/cierre-de-mes/cierre-mes.service";

@Component({
standalone: false,
  selector: "app-subrogacion",
  templateUrl: "./subrogacion.component.html",
  styleUrls: ["./subrogacion.component.scss"],
  providers: [DialogService],
})
export class SubrogacionComponent implements OnInit,AfterViewInit {
  ////////////
  //inicio modal
  numAccountMayor: any;
  ref: DynamicDialogRef;
  //fin modal

  @ViewChild("nameTipo") inputTipo; // accessing the reference element
  @ViewChild("nameEmpuFullNombre") inputNameEmpFullNombre; // accessing the reference element
  @ViewChild("nameEmpuFullNombre2") inputNameEmpFullNombre2; // accessing the reference element
  @ViewChild("nameInputSearchEmpleado") inputNameSearchEmpleado; // accessing the reference element
  @ViewChild("nameInputSearchEmpleado2") inputNameSearchEmpleado2; // accessing the reference element

  @ViewChild("nameDepartamento") inputNamenameDepartamento; // accessing the reference element
  @ViewChild("nameDepartamentoDos") inputNamenameDepartamentoDos; // accessing the reference element


  @ViewChild("nameCargo") inputNamenameCargo; // accessing the reference element
  @ViewChild("nameCargoDos") inputNamenameCargoDos; // accessing the reference element

  @ViewChild("nameSalarioMinimo") inputNameSalarioMinimo; // accessing the reference element
  @ViewChild("nameSalarioMinimoDos") inputNameSalarioMinimoDos; // accessing the reference element
  @ViewChild("nameFechaReg") inputNameFechaReg; // accessing the reference element
  @ViewChild("nameFechaDesde") inputNameFechaDesde; // accessing the reference element
  @ViewChild("nameFechaHasta") inputNameFechaHasta; // accessing the reference element
  @ViewChild("nameEstadoReg") inputNameEstadoReg; // accessing the reference element
  @ViewChild("nameObservacion") inputNameObservacion; // accessing the reference element


  tipo_id_cc: BigInteger | String | number;
  observacion_input: BigInteger | String | number;

  @Input() objGetAccionPersonal: AccionPErsonalResponseI;

  isValorVariable:boolean = true;
  isDisableTipoAnticipo:boolean = true;
  isDisableConfigSemanal:boolean = true;
  isDisableRetenJuducaial:boolean = true;
  lgValorReetenJudiacial:boolean = true;
  paginate: any;
  isDisableDepartament:boolean = true;
  isDisableCargo:boolean = true;
  isDisableCatalogo:boolean = true;
  
  timeout: any;
  nombreFilter:any;
  dataCatalogoResponse: CatalogoResponseI;

  dataResponseGeneral: any; 
  processing: any = false;

  registroSubrogacion: FormGroup;
  actions: any = { btnGuardar: true, btnMod: false };

  visible: boolean = false;

  fileToUpload: any;
  imageBase64: any;
  namePhoto: any;
  saliente_salario_minimo: any;
  adicional_salario_minimo: any;

  cargo_id_cc: BigInteger | String | number;
  cargo_id_cc_dos: BigInteger | String | number;

  departamento_id_cc: BigInteger | String | number;
  departamento_id_cc_dos: BigInteger | String | number;

  empleadoForm: EmployeesResponseI = {
    id_empleado: 0,
    id_tipo_identificacion: 0,
    emp_identificacion: "",
    emp_primer_nombre: "",
    emp_segundo_nombre: "",
    emp_primer_apellido: "",
    emp_segundo_apellido: "",
    emp_full_nombre: "",
    id_nivel_educativo: 0,
    emp_fecha_nacimiento: undefined,
    fechajubilacion:undefined,
    id_estado_civil: 0,
    id_genero: 0,
    estado_id: 0,
    id_tipo_discapacidad: 0,
    porcentaje_discapacidad: 0,
    emp_telefono: "",
    emp_celular: "",
    emp_correo: "",
    emp_correo_empresarial: "",
    id_area: 0,
    id_departamento: 0,
    id_cargo: 0,
    id_jornada: 0,
    id_tipo_salario: 0,
    id_sueldo: 0,
    id_tipo_nomina_pago: 0,
    id_tipo_anticipo: 0,
    emp_porcentaje_valor_quincena: "",
    id_config_semanal: 0,
    emp_fecha_ingreso: undefined,
    id_extension_conyuge: 0,
    id_iees_jubilado: 0,
    id_fondo_reserva_uno_dia: 0,
    // emp_codigo_trabajo:0,
    id_codigo_trabajo: 0,
    id_acu_decimo_tercero: 0,
    id_acu_decimo_cuarto: 0,
    id_acu_fondo_reserva: 0,
    id_retenciones_judiciales: 0,
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
    valor_sueldo_variable: 0,
    valor_retencion_judicial: 0,
    emp_valor_reeten_judicial:"",
    tienejubilacion:"",
    nacionalidad:"",
    localidad:"",
    region:"",
    direccion:"",
    id_codigo_biometrico:"",
    marca_biometrico: 0,
    entidad:"",
    num_cuenta: "",
    tipo_cuenta:"",
    id_tipo_pago:0,
    jornada_parcial_permanente: false
    // id_countries: 0,
    // name_countries: "",
    // id_states: 0,
    // name_states: "",
    // id_cities: 0,
    // name_cities: "",
    // direccion_domicilio_emp: ""
  };

  loading: boolean;
  loadingEdu: boolean;

  //busqueda empleado
  readonlyInputSearchEmpleado : boolean;
  disableBtnConsultaEmpleados : boolean;
  disableBtnDescargarFoto : boolean;
  disableBtnSubirFoto : boolean;
  readonlyInputObservacion : boolean;
 

  //Datos del empleado
  readonlyInputTipo : boolean;
  readonlyInputFecha : boolean;
  fecha_reporte: any
  
  fecha_desde: any
  fecha_hasta: any


  @ViewChild(DataTableDirective)
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(PaginatorComponent, { static: false })
  paginatorComponent: PaginatorComponent;

  submitted = false;
  messageError: Message[] = [];

  totalRecords: number;
  rows: number = 50;
  pageIndex: number = 1;
  pageSize: number= 50;
  pageSizeOptions: number[] = [ 10,50, 100, 200];

  /*folder digital fin */
  lstTablaEmpleados: MatTableDataSource<any> = new MatTableDataSource<any>();
  lstModificar: MatTableDataSource<any> = new MatTableDataSource<any>();

  dataUser: any;
  permiso_ver: any = "0";
  empresLogo: any;
  permisions: any;
  faltasYpermisos: any = [];
  vmButtons: any = [];
  observacion:any
  id_empleado_1:any
  id_empleado_2:any

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  fechaReg:any;
  fechaDesdeReg: any;
  fechaHastaReg: any;
  estado: any = 0;

  estados = [
    {value: "A",label: "ACTIVO"},
    {value: "I",label: "INACTIVO"}
  ]

  id_accion_personal: any = 0

  filter: any 
     
  constructor(
    private rhfolderdigitalService: RhfolderDigitalEmpleadoService, 
    private commonService: CommonService,
    private generalService: GeneralService,
    private toastr: ToastrService,
    private empleadoService: SubrogacionService,
    public dialogService: DialogService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private modalService: NgbModal,
    private cierremesService: CierreMesService,
    // private translateService: TranslateService,
  ) {
 
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.totalRecords = 0;
    //this.rows = 5;

    this.empleadoService.consultaSubrogacion$.subscribe(
      (res: any) => {
        console.log(res)

        this.readonlyInputSearchEmpleado = true ;
        this.disableBtnConsultaEmpleados = true ;
        this.readonlyInputObservacion = false;
        this.readonlyInputTipo = true ;
        this.isDisableCatalogo = true ;
        this.readonlyInputFecha = true ;


        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = false;
        
        this.tipo_id_cc = res.id_catalogo_tipo_accion;
        this.id_accion_personal = res.id_accion_personal;
        this.consultarCatalogo(this.tipo_id_cc);
       
       // this.inputTipo.nativeElement.value = this.tipo_id_cc;
        this.inputNameEmpFullNombre.nativeElement.value = res.empleado_saliente;
        this.inputNameSalarioMinimo.nativeElement.value =res.sueldo_saliente;
        this.inputNamenameDepartamento.nativeElement.value = res.nombre_departamento_saliente;
        this.inputNamenameCargo.nativeElement.value = res.nombre_cargo_saliente;

        this.inputNameEmpFullNombre2.nativeElement.value = res.empleado_adicional;
        this.inputNameSalarioMinimoDos.nativeElement.value = res.sueldo_adicional;
        this.inputNamenameDepartamentoDos.nativeElement.value = res.nombre_departamento_adicional;      
        this.inputNamenameCargoDos.nativeElement.value = res.nombre_cargo_adicional;
       
    
        //this.inputNameEstadoReg.nativeElement.value = res.estado;
        this.inputNameFechaReg.nativeElement.value = res.fecha;
        this.inputNameFechaDesde.nativeElement.value = moment(res.fecha_desde).format('YYYY-MM-DD');
        this.inputNameFechaHasta.nativeElement.value = moment(res.fecha_hasta).format('YYYY-MM-DD');
    
        this.inputNameObservacion.nativeElement.value = res.observacion;
        
        // this.fechaReg= res.fecha
        // this.observacion= res.observacion
        // this.fechaDesdeReg= res.fecha_desde
        // this.fechaHastaReg= res.fecha_hasta
        this.id_empleado_1 = res.id_empleado_saliente
        this.id_empleado_2 = res.id_empleado_adicional
      }
    )
  }
  ngAfterViewInit(): void {
    // this.translateService.addLangs(['en', 'es', 'fr', 'pt'])
    this.translateChange('es')
  }

  translateChange(lang: string) {
    // this.translateService.use(lang)
    // this.translateService.get('primeng').subscribe((res) => this.primengConfig.setTranslation(res))
  }

  mensajeSppiner: string = "Cargando...";

 
  public getInitialDateFrom(): Date {
    return new Date();
  }

  ngOnInit(): void {
    
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 

    this.filter= {
      nombre: '',
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta:  moment(this.lastday).format('YYYY-MM-DD')
    }

   
  
   
    this.fecha_reporte = moment().format('YYYY-MM-DD');
    this.fecha_desde= moment().format('YYYY-MM-DD');
    this.fecha_hasta= moment().format('YYYY-MM-DD');
    this.vmButtons = [
      {
        orig: "btnsRegSub",paramAccion: "1",
        boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },{
        orig: "btnsRegSub",paramAccion: "1",boton: { icon: "fa fa-search", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },

      {
        orig: "btnsRegSub",
        paramAccion: "1",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRegSub",
        paramAccion: "1",
        boton: { icon: "fa fa-plus-square-o", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn btn-primary boton btn-sm",
        habilitar: true,
        imprimir: false,
      },
      {
        orig: "btnsRegSub",
        paramAccion: "1",
        boton: { icon: "fa fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },

      {
        orig: "btnsRegSub",
        paramAccion: "2",
        boton: { icon: "fa fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },

      /*Botones de folder */
      {
        orig: "btnsRegSub",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "REGISTRAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRegSub",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square-o", texto: "ACTUALIZAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn btn-primary boton btn-sm",
        habilitar: true,
        imprimir: false,
      }, 
     
    ];


    

    this.fechaReg = moment().format('YYYY-MM-DD')
    this.fechaDesdeReg = moment().format('YYYY-MM-DD')
    this.fechaHastaReg = moment().format('YYYY-MM-DD')



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
  
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }

      
    );

 
    this.registroSubrogacion = this.fb.group({
      nameEmpuFullNombre : [{value: '', disabled: true}, [Validators.required]],
      nameEmpuFullNombre2 : [{value: '', disabled: true}, [Validators.required]],
      sugrSalarioMinimo: [{value: '', disabled: true}, [Validators.required]],
      sugrSalarioMinimoDos: [{value: '', disabled: true}, [Validators.required]],
      nameCargo: [{value: '', disabled: true}, [Validators.required]],
      nameCargoDos: [{value: '', disabled: true}, [Validators.required]],
      nameDepartamento: [{value: '', disabled: true}, [Validators.required]],
      nameDepartamentoDos: [{value: '', disabled: true}, [Validators.required]],
      nameFechaReg: [{value: '', disabled: false}, [Validators.required]],
      nameFechaDesde: [{value: '', disabled: false}, [Validators.required]],
      nameFechaHasta: [{value: '', disabled: false}, [Validators.required]],
      nameObservacion: [{value: '', disabled: false}, [Validators.required]],
    
    });

    let today = new Date();
    this.readOnlyInputsTrueInitialTrue('yes');

    this.paginate = {
      length: 0,
      perPage: 100,
      page: 1,
      pageSizeOptions: [ 50, 100]
    };
    
    this.vmButtons[2].habilitar = true;
  }

  readOnlyInputsTrueInitialTrue(ptr){

    this.readonlyInputSearchEmpleado = ptr=='yes' ? true :false;
    this.disableBtnConsultaEmpleados = ptr=='yes' ? true :false;
    this.readonlyInputObservacion = ptr=='yes' ? true :false;
    this.readonlyInputTipo = ptr=='yes' ? true :false;
    this.isDisableCatalogo = ptr=='yes' ? true :false;
    this.readonlyInputFecha = ptr=='yes' ? true :false;

    this.vmButtons[2].habilitar = false;
  }


  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "1NUEVO":
        this.readOnlyInputsTrueInitialTrue('not');
        break;
      case "1BUSCAR":
          this.expandModalSubrogaciones()
        //this.consultarFiltro();
        break;
      case "1GUARDAR":
        this.validaSaveAccionPersonal();
        break;
      case "1MODIFICAR":
        this.validaUpdateAccionPersonal();
        break;
        break;
      case "1CANCELAR":
        this.cancel();
        break;
      case "2CONSULTAR":
          this.getAccionPersonal()
        //this.consultarFiltro();
        break;
     
    }
  }

  /**-----METODOS DE GUARDAR */
  async validaSaveAccionPersonal() {
    this.validateDataGlobal().then(respuesta => {
      console.log(respuesta)
      if (respuesta) {
        console.log(this.registroSubrogacion.valid)
        if (this.registroSubrogacion.valid == true) {
          
          this.confirmSave(
            "Seguro desea guardar la acción personal?",
            "SAVE_ACCION_PERSONAL"
          );
        }else{
          this.toastr.info('Debe rellenar todos los campos del formulario para guardar')
        }
      }
    }).catch((err) => {
      console.log(err);
      this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
    });

    console.log("falta validar");
    return;
  }

  validateDataGlobal() {
  console.log(this.inputNameSalarioMinimoDos.nativeElement.value +'----'+ this.inputNameSalarioMinimo.nativeElement.value)
    let c = 0;
    let mensajes: string = '';
    return new Promise((resolve, reject) => {
      if ( this.id_empleado_1 != undefined   && this.id_empleado_2 != undefined ) {
        if ( this.id_empleado_1 == this.id_empleado_2 ) {
          mensajes += "* El empleado saliente no puede ser el mismo que delega.  <br>"
        }
      }

      if( Number(this.inputNameSalarioMinimoDos.nativeElement.value) >=  Number(this.inputNameSalarioMinimo.nativeElement.value)){
        mensajes += "* El empleado saliente no puede tener un salario menor al empleado que delega. <br>"
      }

      let fecha = moment(this.fechaReg).format('YYYY-MM-DD')
      let fechaDesde = moment(this.fechaDesdeReg).format('YYYY-MM-DD')
       let fechaHasta = moment(this.fechaHastaReg).format('YYYY-MM-DD')

      let mesSelected = moment(this.fechaReg).format('MM')
      let anioSelected = moment(this.fechaReg).format('YYYY')

      let mesDesdeSelected = moment(this.fechaDesdeReg).format('MM')
      let anioDesdeSelected = moment(this.fechaDesdeReg).format('YYYY')
      
      let mesHastaSelected = moment(this.fechaHastaReg).format('MM')
      let anioHastaSelected = moment(this.fechaHastaReg).format('YYYY')

      console.log(mesSelected+'/'+mesHastaSelected)
      console.log(anioSelected+'/'+anioHastaSelected)
      
      if(fechaDesde < fecha ){
        mensajes += "* El campo Fecha Desde no debe ser menor al campo Fecha <br>"
      }

      if( fechaHasta < fecha ){
        mensajes += "* El campo Fecha Hasta no debe ser menor al campo Fecha <br>"
      }
      if(mesDesdeSelected != mesSelected){
        mensajes += "* En la Fecha Desde debe seleccionar el mes de "+ moment(this.fechaReg).format('MMMM') +" . <br>"
      }
      if(anioDesdeSelected != anioSelected){
        mensajes += "* En la Fecha Desde debe seleccionar el año "+ anioSelected +" . <br>"
      }

      if(mesHastaSelected != mesSelected){
        mensajes += "* En la Fecha Hasta debe seleccionar el mes de "+ moment(this.fechaReg).format('MMMM') +" . <br>"
      }
      if(anioHastaSelected != anioSelected){
        mensajes += "* En la Fecha Hasta debe seleccionar el año "+ anioSelected +" . <br>"
      }

      return (mensajes.length) ? reject(mensajes) : resolve(true)
     
    });
  }

  async validaUpdateAccionPersonal() {
      this.confirmSave(
        "Seguro desea modificar la acción personal?",
        "UPDATE_ACCION_PERSONAL"
      );
    console.log("falta validar");
    return;
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
        if (action == "SAVE_ACCION_PERSONAL") {
          this.saveAccionPersonal();
        } else if (action == "UPDATE_ACCION_PERSONAL") {
          this.updateAccionPersonal();
        } else if (action == "DELETE_ACCION_PERSONAL") {
          // this.deleteFichaEmpleado();
        }
      }
    });
  }

  async saveAccionPersonal() {

    this.mensajeSppiner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);

    let dat = {
      "anio": Number(moment(this.fechaReg).format('YYYY')),
      "mes": Number(moment(this.fechaReg).format('MM')),
      }
      
    this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(async (res) => {
        try {
          if (res["data"][0].estado !=='C') {
            let data = {
              // info: this.formSueldoEmpleado,
              ip: this.commonService.getIpAddress(),
              accion: "Creación de nueva accion personal  rrhh",
              id_controlador: myVarGlobals.fCuentaBancos,
              // DATOS DEL EMPLEADO
              id_tipo: this.tipo_id_cc,
              //emp_nombre_completo:this.inputNameEmpFullNombre.nativeElement.value,
              //emp_nombre_completo2:this.inputNameEmpFullNombre2.nativeElement.value,
              id_empleado_1:this.id_empleado_1,
              id_empleado_2:this.id_empleado_2,
              observacion: this.observacion,
              id_empresa:this.dataUser.id_empresa,
              fecha_registro: this.fechaReg,
              fecha_desde: this.fechaDesdeReg,
              fecha_hasta: this.fechaHastaReg,
              //estado: this.estado
             
            };
            this.mensajeSppiner = "Guardando...";
            this.lcargando.ctlSpinner(true);
            this.empleadoService.saveAccionPersonal(data).subscribe(
              (res: GeneralResponseI) => {
                if (res.code == 200) {
                  this.toastr.success(
                    "Datos de Subrogación guardados correctamente."
                  );
                  this.inputNameObservacion.nativeElement.value = "";
                  this.observacion = "";
                  this.tipo_id_cc= "0"
                  this.vmButtons[2].habilitar = true;
                }
               this.getAccionPersonal()
                // this.rerender();
                this.lcargando.ctlSpinner(false);
                this.cancel();
              },
              (error) => {
                this.lcargando.ctlSpinner(false);
                this.toastr.error(error.error.detail);
        
              }
            );
          } else {
              
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
          }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });
  }


  async updateAccionPersonal() {

    this.mensajeSppiner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);

    let dat = {
      "anio": Number(moment(this.fechaReg).format('YYYY')),
      "mes": Number(moment(this.fechaReg).format('MM')),
      }
      
    this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(async (res) => {
        try {
          if (res["data"][0].estado !=='C') {
            let data = {
              // info: this.formSueldoEmpleado,
              ip: this.commonService.getIpAddress(),
              accion: "Modificación de accion personal  rrhh",
              id_controlador: myVarGlobals.fCuentaBancos,
              // DATOS DEL EMPLEADO
              id_accion_personal: this.id_accion_personal,
              id_tipo: this.tipo_id_cc,
              id_empleado_1:this.id_empleado_1,
              id_empleado_2:this.id_empleado_2,
              observacion: this.observacion,
              id_empresa:this.dataUser.id_empresa,
              fecha_registro: this.fechaReg,
              fecha_desde: this.fechaDesdeReg,
              fecha_hasta: this.fechaHastaReg,
              //estado: this.estado
             
            };
            this.mensajeSppiner = "Modificando...";
            this.lcargando.ctlSpinner(true);
            this.empleadoService.updateAccionPersonal(data).subscribe(
              (res: GeneralResponseI) => {
                if (res.code == 200) {
                  this.toastr.success(
                    "Datos de Subrogación modificados correctamente."
                  );
                  this.inputNameObservacion.nativeElement.value = "";
                  this.observacion = "";
                  this.tipo_id_cc= "0"
                  this.vmButtons[3].habilitar = true;
                }
                this.getAccionPersonal()
                // this.rerender();
                this.lcargando.ctlSpinner(false);
                this.cancel();
              },
              (error) => {
                this.lcargando.ctlSpinner(false);
                this.toastr.error(error.error.detail);
        
              }
            );
          } else {
              
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
          }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });
  }
  


  //***************************** */
  viewSelectionTipoCC(responseId: any) {
    console.log(responseId)
    this.tipo_id_cc = responseId;

    this.consultarCatalogo(this.tipo_id_cc);
    
   // this.registroSubrogacion.get("nameTipo").setValue(this.tipo_id_cc);
  }
  consultarCatalogo(idCatalog){
    this.generalService
    .getCatalogoOnly(idCatalog)
    .subscribe({
      next: (rpt: CatalogoResponseI) => {
        this.dataCatalogoResponse = rpt;
      },
      error: (e) => {
        this.dataResponseGeneral = e.error;
        this.toastr.error(this.dataResponseGeneral.detail);
      },
    });
  }

  onKeypressEvent(event: any){

    console.log(event.target.value);

    if (event.target.value.length == 10) {
      return false;
    }
 
 }

 getAccionPersonal()
 {
  // this.loading = true;
  // let parameterUrl: any = {
  //   fecha: this.fecha_reporte,
  //   page:  this.pageIndex ,
  //   size: 10,//event.rows,
  //   sort: 'id', 
  //   type_sort: 'asc' ,
  //   fechaDesde: this.fecha_desde,
  //   fechaHasta: this.fecha_hasta
  // };

  this.loading = true;
  let data= {
    params: {
      filter: this.filter,
      paginate: this.paginate,
      
    }
  }
  console.log(data)
  this.empleadoService.getAccionPersonalPaginate(data).subscribe(
    (res: any) => {
       console.log(res);
       if(res.status==1){
        this.objGetAccionPersonal = res.data.data;
        this.totalRecords= res.data?.total[0]?.count
      
        //this.dataReportes = res.data;
        this.loading = false;
        //this.lcargando.ctlSpinner(false);
       }
       else{
        //this.objGetAccionPersonal =[]
        this.loading = false;
        //this.lcargando.ctlSpinner(false);
       }
    },
    (err: any) => {
      console.log(err);
      this.loading = false;
      //this.lcargando.ctlSpinner(false);
    }
  )

//   //this.empleadoService.getAccionPersonal(parameterUrl).subscribe({
//   this.empleadoService.getAccionPersonalPaginate(data).subscribe({
//     // next: (rpt: AccionPErsonalResponseI) => {

//     next: (rpt: AccionPErsonalResponseI) => {
//       console.log(rpt)
//       this.objGetAccionPersonal = rpt['data'];

//     },
//     error: (e) => {
//       this.loading = false;
//     },
//   });
//  }

//  nextPage(event: LazyLoadEvent) {
//   // let id_emp = this.faltasAndDescuentosForm.id_empleado;
//   // console.log(id_emp);
//   console.log(event);

//   Object.assign(this.paginate,  {
//     page: (event.first / this.rows) + 1,
//     perPage: event.rows
//   })
//    // this.cargarConsultaReportes();
 }

 nextPage(event: LazyLoadEvent) {
  // let id_emp = this.faltasAndDescuentosForm.id_empleado;
  // console.log(id_emp);
  console.log(event);

  Object.assign(this.paginate,  {
    page: (event.first / this.rows) + 1,
    perPage: event.rows
  })
    this.getAccionPersonal();
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
      console.log(empleadoData);

      this.empleadoForm = empleadoData;

      this.inputNameEmpFullNombre.nativeElement.value = empleadoData.emp_full_nombre;
      this.inputNameSalarioMinimo.nativeElement.value = empleadoData.sueldo.sld_salario_minimo,
      this.id_empleado_1 = empleadoData.id_empleado;

      this.inputNamenameDepartamento.nativeElement.value = empleadoData.departamento.dep_nombre;
      this.inputNamenameCargo.nativeElement.value = empleadoData.sueldo.cargo.car_nombre;

      //this.registroSubrogacion.get("nameCargo").setValue(this.cargo_id_cc);

    });
  }
  onClicConsultaEmpleados2(content) {
    this.ref = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: "yes",
        search : this.inputNameSearchEmpleado2.nativeElement.value,
        relation_selected : "",
      },
      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe((empleadoData: EmployeesResponseI) => {
      console.log(empleadoData);

      this.empleadoForm = empleadoData;

      this.inputNameEmpFullNombre2.nativeElement.value =empleadoData.emp_full_nombre;
      this.inputNameSalarioMinimoDos.nativeElement.value = empleadoData.sueldo.sld_salario_minimo,
      this.id_empleado_2 = empleadoData.id_empleado;

      this.inputNamenameDepartamentoDos.nativeElement.value = empleadoData.departamento.dep_nombre;      
      this.inputNamenameCargoDos.nativeElement.value = empleadoData.sueldo.cargo.car_nombre;
      //this.registroSubrogacion.get("nameCargoDos").setValue(this.cargo_id_cc_dos);

    });
  }

  viewSelectionCargoCC(responseCargoId: any) {
    this.cargo_id_cc = responseCargoId;
    this.registroSubrogacion.get("nameCargo").setValue(this.cargo_id_cc);
  }


  viewSelectionCargoCCDos(responseCargoId: any) {
    this.cargo_id_cc_dos = responseCargoId;
    this.registroSubrogacion.get("nameCargoDos").setValue(this.cargo_id_cc_dos);
  }

  cancel() {

    this.readOnlyInputsTrueInitialTrue("yes");
    this.empleadoForm.id_empleado = 0;
    // DATOS DEL EMPLEADO
   
    this.inputNameEmpFullNombre.nativeElement.value = "";
    this.inputNameEmpFullNombre2.nativeElement.value = "";
    this.actions = { btnGuardar: true, btnMod: false };



    this.inputNameSalarioMinimoDos.nativeElement.value = "";
    this.inputNamenameDepartamentoDos.nativeElement.value = "";      
    this.inputNamenameCargoDos.nativeElement.value = "";

    this.inputNameSalarioMinimo.nativeElement.value = "";
    this.inputNamenameDepartamento.nativeElement.value = "";
    this.inputNamenameCargo.nativeElement.value = "";

   // this.inputNameEstadoReg.nativeElement.value = "";
    this.inputNameFechaReg.nativeElement.value = moment(this.firstday).format('YYYY-MM-DD');
    this.inputNameFechaDesde.nativeElement.value =moment(this.firstday).format('YYYY-MM-DD');
    this.inputNameFechaHasta.nativeElement.value =  moment(this.lastday).format('YYYY-MM-DD');

    this.inputNameObservacion.nativeElement.value = "";
    this.observacion = "";
    this.tipo_id_cc= "0"

    this.fechaReg =moment(this.firstday).format('YYYY-MM-DD')
    this.fechaDesdeReg = moment(this.firstday).format('YYYY-MM-DD')
    this.fechaHastaReg = moment(this.lastday).format('YYYY-MM-DD')

    
    
    this.estado = 0
 
 
    
   
  }

  values = "";
  // dinamicoBotones(e){
  //   console.log(e)
  //   var index = e.index;
  //   if(e.index == 0){
  //     this.vmButtons[0].showimg = true;
  //     this.vmButtons[1].showimg = true;
  //     this.vmButtons[2].showimg = true;
  //     this.vmButtons[3].showimg = false;
  //     this.vmButtons[4].showimg = false;
  //     this.vmButtons[5].showimg = false;
  //    }
  //   if(e.index== 1){
  //   this.getAccionPersonal();
  //   this.vmButtons[1].showimg = true;
    
  //  }
   
  // }
  dinamicoBotones(valor: any) {

    let value = valor.index + 1;

    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if (element.paramAccion == value) {
          element.permiso = true; element.showimg = true;
        } else {
          element.permiso = false; element.showimg = false;
        }
      });
    }, 10);


  }


  /* async  */consultarFiltro() {
   
     
     this.lcargando.ctlSpinner(true)
     try {

      // let parameterUrl: any = {
      //   name: this.nombreFilter,
      //   fecha: this.fecha_reporte,
      //   page:  this.pageIndex ,
      //   size: 10,//event.rows,
      //   sort: 'id', 
      //   type_sort: 'asc',
      //   fechaDesde: this.fecha_desde,
      //   fechaHasta: this.fecha_hasta
      // };
      
      // console.log(parameterUrl);
      let data= {
        params: {
          filter: this.filter,
          paginate: this.paginate,
          
        }
      }
    //  /*  await  */ this.empleadoService.getAccionPersonal(parameterUrl).subscribe({
      this.empleadoService.getAccionPersonalPaginate(data).subscribe({
    
        next: (rpt: AccionPErsonalResponseI) => {
          console.log(rpt)
          this.objGetAccionPersonal = rpt['data'];

         // this.objGetAccionPersonal.push(parameterUrl);
         this.loading = false;
        },
        error: (e) => {
          this.loading = false;
        },
      });
        
         this.vmButtons[2].habilitar = false
         this.lcargando.ctlSpinner(false)
     } catch (err) {
       console.log(err)
       this.lcargando.ctlSpinner(false)
       this.toastr.error(err.error.message, 'Error consultando Reporte')
     }
   }
 

  //  regDelete(item) {
  //   let parameterUrl: any = {
  //     name: this.nombreFilter,
  //     fecha: this.fecha_reporte,
  //     page:  this.pageIndex ,
  //     size: 100,//event.rows,
  //     sort: 'id', 
  //     type_sort: 'asc',
  //     fechaDesde: this.fecha_desde,
  //     fechaHasta: this.fecha_hasta,
  //     idToDelete: item
  //   };
  //   this.empleadoService.deleteAccionPersonal(parameterUrl).subscribe({
  //     next: (rpt: AccionPErsonalResponseI) => {
  //       console.log(rpt)
  //       this.objGetAccionPersonal = rpt['data'];
  //      // this.objGetAccionPersonal.push(parameterUrl);
  //     },
  //     error: (e) => {
  //       this.loading = false;
  //     },
  //   });
  //  /*  this.viewDelete.push(item);
  //   this.guardaT.splice(pos, 1); */
  // }
  regDelete(item){
    console.log(item)

    Swal.fire({
      title: 'Eliminar',
      text: 'Seguro desea eliminar este registro?',
      icon: 'question',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(
      res => {
        if (res.value) {
          let data = {
            idToDelete: item
          }
      
          this.mensajeSppiner = 'Eliminando registro'
          this.lcargando.ctlSpinner(true)
              this.empleadoService.deleteAccionPersonal(data).subscribe(
                res => {
                  console.log(res)
                  Swal.fire({
                    title: 'Eliminado',
                    text: 'Registro eliminado con éxito',
                    icon: 'success'
                  })
                  this.lcargando.ctlSpinner(false)
                  this.getAccionPersonal()
                },
                err => {
                  this.lcargando.ctlSpinner(false)
                  console.log(err)
                  this.toastr.error(err.error.message, 'Error eliminando')
                  }
                );
        }
      }
    )
  }

  changePaginate({pageIndex, pageSize}) {

    let parameterUrl: any = {
      name: this.nombreFilter,
      fecha: this.fecha_reporte,
      page:   pageIndex + 1 ,
      size: 10,//event.rows,
      sort: 'id', 
      type_sort: 'asc',
      fechaDesde: this.fecha_desde,
      fechaHasta: this.fecha_hasta
    };
    
    console.log(parameterUrl);
    /*  await  */ this.empleadoService.getAccionPersonal(parameterUrl).subscribe({
      next: (rpt: AccionPErsonalResponseI) => {
        console.log(rpt)
        this.objGetAccionPersonal = rpt['data'];
       // this.objGetAccionPersonal.push(parameterUrl);
      },
      error: (e) => {
        this.loading = false;
      },
    });
      
    Object.assign(this.paginate, {page: pageIndex + 1, perPage: pageSize})
   
  }

  expandModalSubrogaciones() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ModalConsultaSubrogacionComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    //modal.componentInstance.permissions = this.permissions;
  }



}
