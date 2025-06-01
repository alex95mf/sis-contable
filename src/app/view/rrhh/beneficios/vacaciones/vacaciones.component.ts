import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { CcModalTableEmpleadoComponent } from "src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component";

import { VacacionesService } from './vacaciones.services';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { GeneralResponseI } from 'src/app/models/responseGeneral.interface';
// import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Console } from 'console';
import { formatDate } from '@angular/common';
import { Empleado, EmployeesAditionalI } from 'src/app/models/responseEmployeesAditional.interface';
import { VacacionAditionalResponseI, Vacaciones } from 'src/app/models/responseVacationAditional.interfase';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
standalone: false,
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
  styleUrls: ['./vacaciones.component.scss'],
  providers: [DialogService],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
]
})
export class VacacionesComponent implements OnInit,AfterViewInit {

  @ViewChild(DataTableDirective)

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  permiso_ver:any = "0";
  empresLogo: any;
  permisions: any;
  vacacionesempleado: any = [];
  vmButtons:any = [];

  viewDate: Date = new Date();

  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();

   /**** */
  //formulario
  ref: DynamicDialogRef;
  formGroupVacaciones: FormGroup;
  submitted = false;
  processing: any = false;
  // id_empleado:any = 0;

  vacacionesForm: any/* FaltaPermiso */ = {
    // indc_anio:0,///
    id_vacacion : 0,
    id_empresa : 0,
    emp_full_nombre : '',
    vac_anio : 0,
    // id_falt_perm:      0,
    id_empleado:       0,
    // flpr_anio:         0,
    // id_mes:            0,
    // id_tipo_permiso:   0,
    // id_afecta_rol:     0,
    // flpr_fecha_inicio: new Date,
    // flpr_fecha_fin:    new Date,
    // flpr_num_horas:    0,
    // flpr_observacion:  '',
    // estado_id:         0,
    // mes:               undefined,
    // tipo_permiso:      undefined,
    // afecta_rol:        undefined,
    // estado:            undefined,
  };

  vacDetalleFORM :any = {
    id_vac_detalle : 0,
    id_vacacion: 0,
    id_empresa: 0,
    id_empleado: 0,
    vdt_anio: 0,
    vdt_fecha_inicio: moment().format('YYYY-MM-DD'),
    vdt_fecha_fin: moment().format('YYYY-MM-DD'),
    vdt_num_horas: 0,
    vdt_observacion:''
  }

  mensajeSppiner: string = "Cargando...";
  //
  actions: any = { btnGuardar: true,btnMod: false };

  public emp_fecha_ingreso: Date;
  public vac_fecha_inicio: Date;
  public vac_fecha_fin: Date;

  //tabla
  loading: boolean;
  totalRecords: number;
  rows: number;
  pageIndex: number = 1;
  pageSize: number= 5;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  @Input() objGetVacationes: VacacionAditionalResponseI | any = [];//DocFicha[];

  empleado: any = {};
  vacaciones: any = {
    id_vacacion: null,
    id_empresa: 1,
    fecha_inicio: moment().format('YYYY-MM-DD'),
    fecha_fin: moment().format('YYYY-MM-DD'),
    num_dias_gozar: null,
    num_horas_gozar: null,
    total_horas: null,
  }


  public getInitialDateFrom(): Date {
    return new Date();
  }

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private vacaServ : VacacionesService,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    // private translateService: TranslateService,
    ) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
  }


  empleSeleccionado: any;
  nombre_empleado:any;
  identifi_empleado:any;


  ngOnInit(): void {

    this.vmButtons = [

			{ orig: "btnsConsultVacacionesEmpleado", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "GENERAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false},
      /* {
        orig: "btnsConsultVacacionesEmpleado",
        // paramAccion: "1",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      { orig: "btnsConsultVacacionesEmpleado", paramAccion: "", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true },
      { orig: "btnsConsultVacacionesEmpleado", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-modificar boton btn-sm", habilitar: true},
      { orig: "btnsConsultVacacionesEmpleado", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "ELIMINAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-eliminar boton btn-sm", habilitar: true} */
		  ];

      this.empresLogo = this.dataUser.logoEmpresa;
      let id_rol = this.dataUser.id_rol;

      let data = {
        id: 2,
        codigo: myVarGlobals.fVacaciones,
        id_rol: id_rol
      }

      this.commonService.getPermisionsGlobas(data).subscribe(res => {

        this.permisions = res['data'];

        this.permiso_ver = this.permisions[0].abrir;

        if (this.permiso_ver == "0") {

          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Balance comprobación");
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);

        } else {
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
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })

    this.validateForm();
    let today = new Date();

    this.emp_fecha_ingreso = this.getInitialDateFrom();
    this.emp_fecha_ingreso.setDate(today.getDate());

    this.vac_fecha_inicio = this.getInitialDateFrom();
    this.vac_fecha_inicio.setDate(today.getDate());

    this.vac_fecha_fin = this.getInitialDateFrom();
    this.vac_fecha_fin.setDate(today.getDate());

    this.formGroupVacaciones.get("fcn_fecha_inicio").setValue(this.vac_fecha_inicio);
    this.formGroupVacaciones.get("fcn_fecha_fin").setValue(this.vac_fecha_fin);



  }

  validateForm(){
    return this.formGroupVacaciones = this.fb.group({
      fcn_emp_identificacion: ["", [Validators.required]],
      fcn_full_nombre_empleado: ["", [Validators.required, Validators.minLength(1)]],
      fcn_emp_fecha_ingreso : ["", [Validators.required]],
      fcn_emp_sueldo_variable : ["", [Validators.required]],
      fcn_fecha_inicio: ["", [Validators.required]],
      fcn_fecha_fin: ["", [Validators.required]],
      fcn_vac_total_horas: ["", [Validators.required]],
      fcn_vac_num_dias_gozar: [""],
      fcn_vac_num_horas_gozar: [""],
      fcn_vac_num_dias_max_vacaciones: ["", [Validators.required]],
      fcn_vac_a_partir_meses: ["", [Validators.required]],
      fcn_vac_tiempo_trabajando: ["", [Validators.required]],
      // fcn_flpr_anio: ["", [Validators.required]],
      // fcn_mes: ['', [Validators.required]],
      // fcn_tipo_permiso: ['', [Validators.required]],
      // fcn_afecta_rol: ["", [Validators.required]],
      // fnc_flpr_fecha_inicio: ['', [Validators.required/* , this.dateRangeValidator */]],
      // fnc_fnc_flpr_fecha_fin: ['', [Validators.required/* , this.dateRangeValidator */]],
      // fnc_flpr_num_horas: ['', [Validators.required]],
      // fnc_flpr_observacion:[''],
      // flpr_observacion: ['', [Validators.required]],
    });
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
  ngAfterViewInit(): void {
    // this.translateService.addLangs(['en', 'es', 'fr', 'pt'])
    this.translateChange('es')
  }
  translateChange(lang: string) {
    // this.translateService.use(lang)
    // this.translateService.get('primeng').subscribe((res) => this.primengConfig.setTranslation(res))
  }


  metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
        case "GUARDAR":
          this.validaSaveVacaciones();
          break;
		    case "EXCEL":
          //$('#tablaConsultCjChica').DataTable().button( '.buttons-excel' ).trigger();
          break;
        case "IMPRIMIR":
          //$('#tablaConsultCjChica').DataTable().button( '.buttons-print' ).trigger();
          break;
        case "PDF":
          //$('#tablaConsultCjChica').DataTable().button( '.buttons-pdf' ).trigger();
          break;
        case "LIMPIAR":
          //this.informaciondtlimpiar();
          break;
        case "GENERAR":
          this.generarVacaciones()
          break;
		}
	}

  // convenience getter for easy access to form fields
  get f() { return this.formGroupVacaciones.controls; }

  onClicConsultaEmpleados(content) {

    this.ref = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: "not",
        search : '',//this.inputNameSearchEmpleado.nativeElement.value,
        // relation_selected : "sueldoVariable@sueldo",
        relation_selected : "codigoTrabajo",
      },

      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe(async (empleadoData: Empleado) => {
      /**
       *
       */
      /* this.vacacionesForm.id_empleado = empleadoData.id_empleado;
      this.formGroupVacaciones.get("fcn_full_nombre_empleado").setValue(empleadoData.emp_full_nombre);
      this.formGroupVacaciones.get("fcn_emp_identificacion").setValue(empleadoData.emp_identificacion);
      let fechaIngreso = new Date(empleadoData.emp_fecha_ingreso).toLocaleString('es-US', {year: 'numeric', month: '2-digit', day: '2-digit', weekday:"long"});
      this.formGroupVacaciones.get("fcn_emp_fecha_ingreso").setValue(fechaIngreso);
      this.formGroupVacaciones.get("fcn_emp_sueldo_variable").setValue(empleadoData.codigo_trabajo.cat_nombre);

      const maxDiasVacaciones = empleadoData.codigo_trabajo.cat_keyword == 'LOSEP' ? 30 : 15;
      // COTR
      this.formGroupVacaciones.get("fcn_vac_num_dias_max_vacaciones").setValue(maxDiasVacaciones);

      let mesVacaciones = (empleadoData.codigo_trabajo.cat_keyword == 'LOSEP') ? 11  : 12 ;
      this.formGroupVacaciones.get("fcn_vac_a_partir_meses").setValue(mesVacaciones +" Meses");

      // dias trabajando

      let finalIngreso = formatDate(new Date(empleadoData.emp_fecha_ingreso),'yyyy-MM-dd',"en-US");
      let fechaActual = formatDate(new Date(),'yyyy-MM-dd',"en-US");


      let totalD = new Date(fechaActual).getTime() - new Date(finalIngreso).getTime();
      let totalDias = totalD/(1000*60*60*24);

      this.formGroupVacaciones.get("fcn_vac_tiempo_trabajando").setValue(this.getFormatedStringFromDays(totalDias)); */

      console.log(empleadoData)
      if (empleadoData) {
        // const {emp_full_nombre, emp_identificacion, emp_fecha_ingreso} = empleadoData
        const max_dias_vacaciones = empleadoData.codigo_trabajo.cat_keyword == 'LOSEP' ? 30 : 15;
        const vac_a_partir_meses = (empleadoData.codigo_trabajo.cat_keyword == 'LOSEP') ? 11  : 12 ;
        const vac_tiempo_trabajando = moment().diff(moment(empleadoData.emp_fecha_ingreso), 'months')
        Object.assign(this.empleado, {...empleadoData, max_dias_vacaciones, vac_a_partir_meses, vac_tiempo_trabajando})
        this.mensajeSppiner = "Cargando...";
        // this.lcargando.ctlSpinner(true);

        this.loading = true;
        let data = {
          // info: this.areaForm,
          ip: this.commonService.getIpAddress(),
          accion: "get lista vacaciones empleado rrhh",
          id_controlador: myVarGlobals.fBovedas,

          page : this.pageIndex,
          size : 10/* this.rows */,
          sort : 'vac_anio',
          type_sort :'desc',
          search : '',
          id_empleado : empleadoData.id_empleado,
          id_empresa : 1,

        };

        try {
          const vacaciones = await this.vacaServ.getVacaciones(empleadoData.id_empleado) as any
          console.log(vacaciones)
          this.objGetVacationes = vacaciones.data
          //
          this.loading = false
        } catch (err) {
          this.loading = false
          console.log(err);
        }

        /* this.vacaServ.getVacationDaysEmployees(data).subscribe({
          next: (rpt: VacacionAditionalResponseI) => {
            console.log(rpt);
            let info = rpt.data['data'];
            // console.log(info);
            this.objGetVacationes = rpt.data;
            // this.lcargando.ctlSpinner(false);

            this.loading = false;


          },
          error: (e) => {
            console.log(e);
            this.loading = false;
            this.lcargando.ctlSpinner(false);

          },
        }); */
      }



      // //
      // this.empleSeleccionado = empleadoData.id_empleado;
      // this.nombre_empleado = empleadoData.emp_full_nombre;
      // this.identifi_empleado = empleadoData.emp_identificacion;

      // this.empresLogo = this.dataUser.logoEmpresa;
      // let id_rol = this.dataUser.id_rol;

      // let data = {
      //   id: 2,
      //   codigo: myVarGlobals.fPrestamosInternos,
      //   id_rol: id_rol,
      //   id_empleado: empleadoData.id_empleado
      // }

      // this.lcargando.ctlSpinner(true);


      // this.vacaServ.GenerarRegistroVaciones(data).subscribe(res => {

      //   // console.log(res);
      //   this.vacacionesempleado = res;
      //   this.lcargando.ctlSpinner(false);

      // }, error => {
      //   this.lcargando.ctlSpinner(false);
      //   this.toastr.info(error.error.message);
      // })


    });
  }

  async generarVacaciones() {
    const result = await Swal.fire({
      titleText: 'Generacion de Periodos de Vacaciones',
      text: 'Esta seguro/a desea generar los periodos de vacaciones?',
      showCancelButton: true,
      confirmButtonText: 'Generar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      await this.setVacacionesCab()
      this.lcargando.ctlSpinner(false)
    }
  }

  async setVacacionesCab() {
    this.loading = true
    try {
      const response = await this.vacaServ.saveVacation({empleado: this.empleado.id_empleado, empresa: this.dataUser.id_empresa}) as any
      console.log(response)
      this.objGetVacationes = response.data
      this.loading = false
    } catch (err) {
      console.log(err)
      this.loading = false
      this.toastr.warning(err.error?.message, 'Error generando Vacaciones')
    }
  }

  getFormatedStringFromDays(numberOfDays) {
    var years = Math.floor(numberOfDays / 365);
    var months = Math.floor(numberOfDays % 365 / 30);
    var days = Math.floor(numberOfDays % 365 % 30);

    var yearsDisplay = years > 0 ? years + (years == 1 ? " año, " : " años, ") : "";
    var monthsDisplay = months > 0 ? months + (months == 1 ? " mes, " : " meses, ") : "";
    var daysDisplay = days > 0 ? days + (days == 1 ? " día" : " dias") : "";
    return yearsDisplay + monthsDisplay + daysDisplay;
}


  /**-----METODOS DE GUARDAR */
  async validaSaveVacaciones() {
    // console.log(JSON.stringify(this.formGroupFaltaAndPermiso.value));
    // console.log(new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio+'-12-31').getFullYear());
    // this.submitted = true;
    // console.log(this.formGroupFaltaAndPermiso.invalid);
    // if (this.formGroupVacaciones.invalid) {
    //   return;
    // }

    // console.log("guadrar");
    this.confirmSave(
      "Seguro desea guardar vacaciones del empleado?",
      "SAVE_VACACIONES_EMPLEADO"
    );
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
        if (action == "SAVE_VACACIONES_EMPLEADO") {
          this.saveFaltaAndPermisoEmpleado();
        } /* else if (action == "UPDATED_FALTA_AND_PERMISO_EMPLEADO") {
          this.updateFaltaAndPermisoEmpleado();
        }else if (action == "DELETE_FALTA_AND_PERMISO_EMPLEADO") {
          this.deleteFaltaAndPermisoEmpleado();
        } */
      }
    });
  }

    /**
   * guardar
   */
    saveFaltaAndPermisoEmpleado() {
      // const idEmp = this.faltasAndDescuentosForm.id_empleado;

      let data = {
        // info: this.formSueldoEmpleado,
        ip: this.commonService.getIpAddress(),
        accion: "Creación de nueva falta y permisos  rrhh",
        id_controlador: myVarGlobals.fCuentaBancos,

        id_vacacion: this.vacDetalleFORM.id_vacacion,
        id_empresa: this.vacDetalleFORM.id_empresa,
        id_empleado:  this.vacDetalleFORM.id_empleado ,
        vdt_anio: this.vacDetalleFORM.vdt_anio,
        vdt_fecha_inicio: this.vacDetalleFORM.vdt_fecha_inicio,
        vdt_fecha_fin: this.vacDetalleFORM.vdt_fecha_fin,
        vdt_num_horas: 8,
        vdt_observacion: "454"
      }
      this.mensajeSppiner = "Guardando...";
      this.lcargando.ctlSpinner(true);
      this.vacaServ.saveVacationDetail(data).subscribe(
        (res: GeneralResponseI) => {
          // console.log(res);
          this.toastr.success(
            "Datos de vacaciones guardados correctamente."
          );

          // this.cancel(0);
          // this.getFaltasPermisos(idEmp);
          this.lcargando.ctlSpinner(false);


        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.error(error?.error?.detail);

        }
      );
    }

  /* changeFechaFin(){
    let inputFechaInicio = this.formGroupVacaciones.get("fcn_fecha_inicio").value;
    let inputFechaFin = this.formGroupVacaciones.get("fcn_fecha_fin").value;

    let finalFI = formatDate(inputFechaInicio,'yyyy-MM-dd',"en-US");
    let finalFF = formatDate(inputFechaFin,'yyyy-MM-dd',"en-US");


    let totalD = new Date(finalFF).getTime() - new Date(finalFI).getTime();
    let totalDias = totalD/(1000*60*60*24);

    this.formGroupVacaciones.get("fcn_vac_total_horas").setValue(totalDias);

    // let totaHoras = fechaFin - fechaInicio

    this.formGroupVacaciones.get("fcn_vac_num_dias_gozar").setValue(totalDias);
    this.formGroupVacaciones.get("fcn_vac_num_horas_gozar").setValue(totalDias*8);
    this.formGroupVacaciones.get("fcn_vac_total_horas").setValue(totalDias*8);
  } */

  changeFechaFin() {
    const inputFechaInicio = moment(this.vacaciones.fecha_inicio)
    const inputFechaFin = moment(this.vacaciones.fecha_fin)

    const totalD = inputFechaFin.diff(inputFechaInicio, 'days')
    Object.assign(this.vacaciones, {
      num_dias_gozar: totalD,
      num_horas_gozar: totalD * 8,
      total_horas: totalD * 8,
    })
    /* let inputFechaInicio = this.formGroupVacaciones.get("fcn_fecha_inicio").value;
    let inputFechaFin = this.formGroupVacaciones.get("fcn_fecha_fin").value;

    let totalD = moment(inputFechaFin).diff(moment(inputFechaInicio));
    let totalDias = totalD/(1000*60*60*24);

    console.log(inputFechaInicio, inputFechaFin, totalD, totalDias);

    this.formGroupVacaciones.get("fcn_vac_num_dias_gozar").setValue(totalDias);
    this.formGroupVacaciones.get("fcn_vac_num_horas_gozar").setValue(totalDias*8);
    this.formGroupVacaciones.get("fcn_vac_total_horas").setValue(totalDias*8); */
  }


  onRowSelectVacionesEmp(dataVacaciones : Vacaciones){
    let dataVac = dataVacaciones.data;

    let dia = dataVac.vac_restantes;

    let anio = dataVac.vac_anio;
    this.vacDetalleFORM.vdt_anio = anio;

    let fechaInicio = moment(anio+'01').format("DD/MM/YYYY");
    // let fechaFin = moment(anio+'/01/'+dia).format("DD/MM/YYYY");
    let fechaFin = moment(anio+'01').format("DD/MM/YYYY");

    Object.assign(this.vacaciones, {
      id_vacacion: dataVac.id_vacacion,
      id_empresa: dataVac.id_empresa,
      fecha_inicio: ''
    })

    this.vacDetalleFORM.vdt_fecha_inicio = fechaInicio;
    this.vacDetalleFORM.vdt_fecha_fin = fechaFin;

    this.vacDetalleFORM.id_vacacion = dataVac.id_vacacion;
    this.vacDetalleFORM.id_empresa = dataVac.id_empresa;
    this.vacDetalleFORM.id_vacacion = dataVac.id_vacacion;
    this.vacDetalleFORM.id_empleado = dataVac.id_empleado;
    //cambiar input de numero de horas
    this.changeFechaFin();

    console.log(dataVacaciones.data);
  }

  getLastDayOfMonth(year, month) {
    let date = new Date(year, month + 1, 0);
    return date.getDate();
  }

  SplitTime(numberOfHours, $horasAlDia) {
    var Days = Math.floor(numberOfHours / $horasAlDia);
    var Remainder = numberOfHours % $horasAlDia;
    var Hours = Math.floor(Remainder);
    var Minutes = Math.floor(60 * (Remainder - Hours));
    return Days + " Días/" + Hours + " Horas"
    // return({"Dias":Days,"/ Horas":Hours})
    // return({"Days":Days,"Hours":Hours,"Minutes":Minutes})
  }

  convertHorasAndDias($horas) {
    let horasDias = this.SplitTime($horas, 8);
    return horasDias;
  }

  convertFaltasPermisosDiasHoras($horas) {
    let horasDias = this.SplitTime($horas, 8);
    return horasDias;
  }

  async aprobarVacaciones(det_vacaciones_nom: any) {
    let result: SweetAlertResult = await Swal.fire({
      title: 'Vacaciones de Empleado',
      text: 'Desea aprobar o negar la solicitud?',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      denyButtonText: 'Negar',
      cancelButtonText: 'Cancelar'
    });

    let estado: string;
    if (result.isConfirmed) estado = 'EPRB'
    else if (result.isDenied) estado = 'ERDO'
    else {
      return;
    }

    this.lcargando.ctlSpinner(true)
    try {
      let response = await this.vacaServ.setEstadoVacacion(det_vacaciones_nom.id_vac_detalle, { vac_detalle_estado_id: estado })
      console.log(response)
      // Object.assign(det_vacaciones_nom, response)
      // Volver a consultar las vacaciones del Periodo
      this.loading = true
      const data = {
        // info: this.areaForm,
        ip: this.commonService.getIpAddress(),
        accion: "get lista vacaciones empleado rrhh",
        id_controlador: myVarGlobals.fBovedas,

        page : this.pageIndex,
        size : 10/* this.rows */,
        sort : 'vac_anio',
        type_sort :'desc',
        search : '',
        id_empleado : this.empleado.id_empleado,
        id_empresa : 1,
      }
      const vacaciones = await this.vacaServ.getVacaciones(this.empleado.id_empleado) as any
      console.log(vacaciones)
      this.objGetVacationes = vacaciones.data
      this.lcargando.ctlSpinner(false)
      this.loading = false
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message)
    }
  }
}
