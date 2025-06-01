import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices';
import { PrestamosInternosService } from './prestamos-internos.service';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService, PrimeNGConfig } from 'primeng/api';
import { GeneralService } from 'src/app/services/general.service';
import { Empleado } from 'src/app/models/responseEmployeesAditional.interface';
import { formatDate } from '@angular/common';
import { VacacionAditionalResponseI, Vacaciones, VacionesDetalle } from 'src/app/models/responseVacationAditional.interfase';
import { FaltaAndPermisoAditionalResponseI, FaltaPermiso } from 'src/app/models/responseFaltasAndPermisosAditional.interfase';
// import { EmplVacacionesService } from '../../beneficios/vacaciones/empl-vacaciones.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PerFaltasYPermisosService } from '../faltas-y-permisos/per-faltas-y-permisos.service';
// import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { VacacionesService } from '../../beneficios/vacaciones/vacaciones.services';
import { GeneralResponseI } from 'src/app/models/responseGeneral.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiServices } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { CcModalTableEmpleadoComponent } from "src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component";


@Component({
  selector: 'app-prestamos-internos',
  templateUrl: './prestamos-internos.component.html',
  styleUrls: ['./prestamos-internos.component.scss'],
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
export class PrestamosInternosComponent implements OnInit {

  @ViewChild(DataTableDirective)

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  permiso_ver: any = "0";
  empresLogo: any;
  permisions: any;
  prestamodelempleado: any = [];
  vmButtons: any = [];

  mensajeSppiner: string = "Cargando...";
  /** 
   * vaciones tab inicio
  */
  //formulario
  ref: DynamicDialogRef;
  formGroupVacaciones: FormGroup;
  submitted = false;
  processing: any = false;

  empleadoData: Empleado;
  vacacionesForm: Vacaciones = {
    id_vacacion: 0,
    id_empresa: 0,
    emp_full_nombre: '',
    vac_anio: 0,
    // id_falt_perm:      0,
    id_empleado: 0,
    vac_periodos_totales: 0,
    vac_dias_acumulados: 0,
    vac_gozados: 0,
    vac_restantes: 0,
    vc_valor_liquidado: '',
    vc_valor_por_liquidar: '',
    id_procesado_rol: 0,
    estado_id: 0,
    empleado: undefined,
    procesando_rol: undefined,
    estado: undefined,
    vaciones_detalles: []
  };

  vacDetalleFORM: VacionesDetalle = {
    id_vac_detalle: 0,
    id_vacacion: 0,
    id_empresa: 0,
    id_empleado: 0,
    vdt_anio: 0,
    vdt_fecha_inicio: new Date,
    vdt_fecha_fin: new Date,
    vdt_num_horas: 0,
    vdt_observacion: '',
    vac_detalle_estado_id: 0,
    estado_detalle_vacion: undefined
  }




  actions: any = { btnGuardar: true, btnMod: false };

  public emp_fecha_ingreso: Date;
  public vac_fecha_inicio: string;
  public vac_fecha_fin: string;

  //tabla
  loading: boolean;
  totalRecords: number;
  rows: number;
  pageIndex: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  @Input() objGetVacationes: VacacionAditionalResponseI | any;//DocFicha[];

  displayModalVacacionesFaltasPermisos: boolean;
  @Input() objGetFaltaPermisosByParameter: FaltaPermiso[];

  /** 
   * vaciones tab FIN
  */


  public getInitialDateFrom(): Date {
    return new Date();
  }

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private fbVac: FormBuilder,
    private fbCert: FormBuilder,
    private messageService: MessageService,
    private prestamosinternosService: PrestamosInternosService,
    private generalService: GeneralService,
    // private vacacionesEmpleadoService: EmplVacacionesService,
    private serviceFaltasYPermisosService: PerFaltasYPermisosService,
    // private translateService: TranslateService,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private vacaServ: VacacionesService,
    public sanitizer: DomSanitizer,
    private apiService: ApiServices,
    private perfaltasypermisosService: PerFaltasYPermisosService, 
  ) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.faltasPermisosContruct();
  }

  ngOnInit(): void {

    this.sld_anio = moment(new Date()).format("YYYY");
    this.faltasAndDescuentosForm.flpr_anio = this.sld_anio;

    this.anio_reporte = this.sld_anio;

    this.vmButtons = [
      {
        orig: "btnsSoliciudesEmpleados",
        paramAccion: "TAB_VACACIONES",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,

      },
      {
        orig: "btnsSoliciudesEmpleados",
        paramAccion: "TAB_VACACIONES",
        boton: { icon: "fa fa-plus-square-o", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn btn-primary boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsSoliciudesEmpleados",
        paramAccion: "TAB_VACACIONES",
        boton: { icon: "fa fa-trash-o", texto: "ELIMINAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn btn-warning boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsSoliciudesEmpleados",
        paramAccion: "TAB_VACACIONES",
        boton: { icon: "fa fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsSoliciudesEmpleados",
        paramAccion: "TAB_PERMISOS",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsSoliciudesEmpleados",
        paramAccion: "TAB_PERMISOS",
        boton: { icon: "fa fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true
      },
      {
        orig: "btnsSoliciudesEmpleados",
        paramAccion: "TAB_PERMISOS",
        boton: { icon: "fa fa-plus-square-o", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn btn-primary boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsSoliciudesEmpleados",
        paramAccion: "TAB_PERMISOS",
        boton: { icon: "fa fa-trash-o", texto: "ELIMINAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn btn-warning boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsSoliciudesEmpleados",
        paramAccion: "TAB_PERMISOS",
        boton: { icon: "fa fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
      /* { 
        orig: "btnsSoliciudesEmpleados", paramAccion: "TAB_PERMISOS", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true,
        showtxt: true, showimg: false, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false
      },
      { 
        orig: "btnsSoliciudesEmpleados", paramAccion: "TAB_PERMISOS", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, 
        showtxt: true, showimg: false, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false
      }, */
      // { 
      //   orig: "btnsSoliciudesEmpleados", paramAccion: "TAB_CERTIFICADOS_LABORALES", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, 
      //   showtxt: true, showimg: false, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false
      // },
      {
        orig: "btnsSoliciudesEmpleados",
        paramAccion: "TAB_CERTIFICADOS_LABORALES",
        boton: { icon: "fa fa-file-pdf-o", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
        imprimir: false
      },
    ];

    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;

    let data = {
      id: 2,
      codigo: myVarGlobals.fPrestamosInternos,
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
    });

    this.validateForm();

    let today = new Date();

    this.emp_fecha_ingreso = this.getInitialDateFrom();
    this.emp_fecha_ingreso.setDate(today.getDate());

    this.vac_fecha_inicio = moment().format('YYYY-MM-DD');
    // this.vac_fecha_inicio.setDate(today.getDate());

    this.vac_fecha_fin = moment().format('YYYY-MM-DD');
    // this.vac_fecha_fin.setDate(today.getDate());

    this.formGroupVacaciones.get("fcn_fecha_inicio").setValue(this.vac_fecha_inicio);
    this.formGroupVacaciones.get("fcn_fecha_fin").setValue(this.vac_fecha_fin);

    this.vmButtons[0].habilitar = true;
    this.changeFechaFin();

    //certificados 
    this.validateFormCertificadosLaboral();
    //vacaciones
    this.validateFormFaltasPermisos();
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
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "EXCEL":
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-excel' ).trigger();
        break;
      case "TAB_CERTIFICADOS_LABORALESIMPRIMIR":
        this.imprimirPDFCertificados();
        break;
      case "TAB_CERTIFICADOS_LABORALESPDF":
        this.validaPDFCertificados();
        break;
      case "LIMPIAR":
        //this.informaciondtlimpiar();
        break;
      case "TAB_VACACIONESGUARDAR":
        this.validaSaveVacaciones();
        break;
      case "TAB_VACACIONESMODIFICAR":
        this.validaVacacionEmpleado();
        break;
      case "TAB_VACACIONESELIMINAR":
        this.validaDeleteVacaciones();
        break;
      case "TAB_VACACIONESCANCELAR":
        this.cancelar();
        break;
      case "TAB_PERMISOSGUARDAR":
        this.validaSaveFaltaAndPermiso();
        break;
      case "TAB_PERMISOSCONSULTAR":
        this.consultarFaltaAndPermiso();
        break;
      case "TAB_PERMISOSMODIFICAR":
        this.validaUpdateFaltaAndPermiso();
        break;
      case "TAB_PERMISOSELIMINAR":
        this.validaDeleteFaltaAndPermiso();
        break;
      case "TAB_PERMISOSCANCELAR":
        this.cancel(1);
        break;
    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.formGroupVacaciones.controls; }

  dinamicoBotones($event) {

    let opcion = $event.originalEvent.currentTarget.innerText;

    switch (opcion) {
      case "VACACIONES"://1
        this.accionesVerOcultarBotones('TAB_VACACIONES');
        break;
      case "PERMISOS"://2
        this.accionesVerOcultarBotones('TAB_PERMISOS');
        break;
      case "CERTIFICADOS LABORALES"://3
        this.accionesVerOcultarBotones('TAB_CERTIFICADOS_LABORALES');
        break;

    }
  }

  accionesVerOcultarBotones($valor) {
    for (let i = 0; i < this.vmButtons.length; i++) {
      if (this.vmButtons[i].paramAccion != $valor) {
        this.vmButtons[i].showimg = false;
      }
      else if (this.vmButtons[i].paramAccion == $valor) {
        this.vmButtons[i].showimg = true;
      }
    }
  }

  /**
   * inicio tab vacaciones
   */
  validateForm() {
    return this.formGroupVacaciones = this.fbVac.group({
      fcn_seach_empleado: [""],

      fcn_emp_identificacion: ["", [Validators.required]],
      fcn_full_nombre_empleado: ["", [Validators.required, Validators.minLength(1)]],
      fcn_emp_fecha_ingreso: ["", [Validators.required]],
      fcn_emp_sueldo_variable: ["", [Validators.required]],
      fcn_fecha_inicio: ["", [Validators.required]],
      fcn_fecha_fin: ["", [Validators.required]],
      fcn_vac_total_horas: ["", [Validators.required]],
      fcn_vac_num_dias_gozar: [""],
      fcn_vac_num_horas_gozar: [""],
      fcn_vac_num_dias_max_vacaciones: ["", [Validators.required]],
      fcn_vac_a_partir_meses: ["", [Validators.required]],
      fcn_vac_tiempo_trabajando: ["", [Validators.required]],
      fnc_vdt_observacion: [""],
      fcn_vac_cat_D_H_acumuladas: [""],
      fcn_vac_cat_horas_acumuladas: [""],
    });
  }

  /**
 * metodo de eliminar
 */
  async validaDeleteVacaciones() {
    this.confirmSave(
      "Seguro desea eliminar vacación?",
      "DELETE_VACACIONES_EMPLEADO"
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
        } else if (action == "UPDATE_VACACIONES_EMPLEADO") {
          this.updateVacacionEmpleado();
        } else if (action == "DELETE_VACACIONES_EMPLEADO") {
          this.deleteVacacionesEmpleado();
        } else if (action == "PDF_CERTIFICADOS") {
          this.pdfCertificados();
        } else if (action == "IMPRIMIR_PDF_CERTIFICADOS") {
          this.pdfImprimirCertificados();
        }
      }
    });
  }

  /**
   * borrar
   */
  deleteVacacionesEmpleado() {
    console.log("delete");
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Borrar vacaciones rrhh",
      id_controlador: myVarGlobals.fBovedas,
      id_vac_detalle: this.vacDetalleFORM.id_vac_detalle,

    };
    // this.validaDt = false;
    this.mensajeSppiner = "Borrando...";
    this.lcargando.ctlSpinner(true);
    this.vacaServ.deleteVacationdetails(data).subscribe(
      (res) => {

        this.cancelar();
        this.consultarVacionesCabecera();
        this.lcargando.ctlSpinner(false);
        this.toastr.success("Datos de vacaciones borrado correctamente.");
        this.vmButtons[0].habilitar = true;

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.toastr.info(error.error.message);
      }
    );
  }

  /**
  * consultar vaciones cab and det
  */
  consultarVacionesCabecera() {

    this.loading = true;

    let parameterUrl: any = {
      id_empleado: this.vacacionesForm.id_empleado,
      id_empresa: 1,
      page: this.pageIndex,
      size: 1000,// this.rows,
      sort: 'id_vacacion',
      type_sort: 'desc'
    };

    this.vacaServ.getVacationCabParameter(parameterUrl)
      .subscribe({
        next: (rpt: VacacionAditionalResponseI) => {
          this.objGetVacationes = [];
          this.totalRecords = rpt.total;
          this.objGetVacationes = rpt.data;
          //  console.log(rpt.data);
          this.loading = false;

          let diasHorasAcumuladas = 0;
          let info = rpt.data;
          for (let i = 0; i < info.length; i++) {
            if (info[i].vac_observacion.toString() == 'POR_GOZAR') {
              diasHorasAcumuladas = diasHorasAcumuladas + info[i].vac_dias_acumulados;
            }
          }


          this.formGroupVacaciones.get("fcn_vac_cat_D_H_acumuladas").setValue(this.convertHorasAndDias(diasHorasAcumuladas));
          this.formGroupVacaciones.get("fcn_vac_cat_horas_acumuladas").setValue(diasHorasAcumuladas);

        },
        error: (e) => {
          console.log(e);
          this.loading = false;
          this.toastr.error(e?.error?.detail);
        },
      });
  }

  /**-----METODOS DE ACTUALIZAR */
  async validaVacacionEmpleado() {
    // console.log(JSON.stringify(this.formGroupFaltaAndPermiso.value));
    // console.log(new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio+'-12-31').getFullYear());
    this.submitted = true;
    // console.log(this.formGroupFaltaAndPermiso.invalid);
    if (this.formGroupVacaciones.invalid) {
      return;
    }

    // console.log("guadrar");
    this.confirmSave(
      "Seguro desea actualizar vacaciones del empleado?",
      "UPDATE_VACACIONES_EMPLEADO"
    );
  }

  /**
  * actualizar
  */
  async updateVacacionEmpleado() {

    // let fechaInicio = this.formGroupVacaciones.value.fcn_fecha_inicio;
    // let fechaFin = this.formGroupVacaciones.value.fcn_fecha_fin;
    // let unoInicio = typeof (this.formGroupVacaciones.value.fcn_fecha_inicio)
    // let dosFin = typeof (this.formGroupVacaciones.value.fcn_fecha_fin);
    // let fi = '';
    // let ff = '';


    /* if (unoInicio === 'string' && dosFin === 'string') {
      fi = fechaInicio.split("/").reverse().join("-");
      ff = fechaFin.split("/").reverse().join("-");
    } else if (unoInicio === 'string' && dosFin === 'object') {
      fi = fechaInicio.split("/").reverse().join("-");
      ff = moment(this.formGroupVacaciones.value.fcn_fecha_fin).format("YYYY-MM-DD");
    } else if (unoInicio === 'string' && dosFin === 'object') {
      fi = moment(this.formGroupVacaciones.value.fcn_fecha_inicio).format("YYYY-MM-DD");
      ff = fechaFin.split("/").reverse().join("-");
    } else if (unoInicio === 'object' && dosFin === 'object') {
      fi = moment(this.formGroupVacaciones.value.fcn_fecha_inicio).format("YYYY-MM-DD");
      ff = moment(this.formGroupVacaciones.value.fcn_fecha_fin).format("YYYY-MM-DD");
    } */

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Actualizacion de nueva vacacion  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      id_vac_detalle: this.vacDetalleFORM.id_vac_detalle,
      id_vacacion: this.vacDetalleFORM.id_vacacion,
      id_empresa: this.vacDetalleFORM.id_empresa,
      id_empleado: this.vacDetalleFORM.id_empleado,
      vdt_anio: this.vacDetalleFORM.vdt_anio,
      vdt_fecha_inicio: this.formGroupVacaciones.value.fcn_fecha_inicio,
      vdt_fecha_fin: this.formGroupVacaciones.value.fcn_fecha_fin,
      vdt_num_horas: this.formGroupVacaciones.value.fcn_vac_total_horas,
      vdt_observacion: this.formGroupVacaciones.value.fnc_vdt_observacion,
    }
    this.mensajeSppiner = "Actualizando...";
    this.lcargando.ctlSpinner(true);
    this.vacaServ.updateVacationdetails(data).subscribe(
      (res: GeneralResponseI) => {
        // console.log(res);
        this.toastr.success(
          "Datos de vacaciones actualizados correctamente."
        );
        //consultar nuevamente 
        // this.cancel(0);
        // this.getFaltasPermisos(idEmp);
        this.objGetVacationes = [];
        this.consultarVacionesCabecera();
        this.cancelar();
        this.lcargando.ctlSpinner(false);


      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        // this.toastr.error(error?.error?.detail);

        let errorApi = Object.values(error?.error?.detail);
        for (let i = 0; i < errorApi.length; i++) {
          let msj = errorApi[i].toString();
          this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: this.capitalizarPrimeraLetra(msj) });
        }
      }
    );
  }

  /**-----METODOS DE GUARDAR */
  async validaSaveVacaciones() {
    // console.log(JSON.stringify(this.formGroupFaltaAndPermiso.value));
    // console.log(new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio+'-12-31').getFullYear());
    let horasAcumulada = this.formGroupVacaciones.value.fcn_vac_cat_horas_acumuladas;
    let totalHorasPedidas = this.formGroupVacaciones.value.fcn_vac_total_horas;

    if (totalHorasPedidas > horasAcumulada) {
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Sus vacaciones superan la cantidad de horas acumuladas' });
    }

    this.submitted = true;
    // console.log(this.formGroupFaltaAndPermiso.invalid);
    if (this.formGroupVacaciones.invalid) {
      return;
    }

    console.log("guadrar");
    this.confirmSave(
      "Seguro desea guardar vacaciones del empleado?",
      "SAVE_VACACIONES_EMPLEADO"
    );
  }

  formatDate(date) {
    if (!(date instanceof Date)) {
      throw new Error('Invalid "date" argument. You must pass a date instance')
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  /**
   * guardar
  */
  async saveFaltaAndPermisoEmpleado() {
    // let fechaInicio = this.formGroupVacaciones.value.fcn_fecha_inicio;
    // let fechaFin = this.formGroupVacaciones.value.fcn_fecha_fin;
    // let unoInicio = typeof (this.formGroupVacaciones.value.fcn_fecha_inicio)
    // let dosFin = typeof (this.formGroupVacaciones.value.fcn_fecha_fin);
    // let fi = '';
    // let ff = '';


    // if (unoInicio === 'string' && dosFin === 'string') {
    //   fi = fechaInicio.split("/").reverse().join("-");
    //   ff = fechaFin.split("/").reverse().join("-");
    // } else if (unoInicio === 'string' && dosFin === 'object') {
    //   fi = fechaInicio.split("/").reverse().join("-");
    //   ff = moment(this.formGroupVacaciones.value.fcn_fecha_fin).format("YYYY-MM-DD");
    // } else if (unoInicio === 'string' && dosFin === 'object') {
    //   fi = moment(this.formGroupVacaciones.value.fcn_fecha_inicio).format("YYYY-MM-DD");
    //   ff = fechaFin.split("/").reverse().join("-");
    // } else if (unoInicio === 'object' && dosFin === 'object') {
    //   fi = moment(this.formGroupVacaciones.value.fcn_fecha_inicio).format("YYYY-MM-DD");
    //   ff = moment(this.formGroupVacaciones.value.fcn_fecha_fin).format("YYYY-MM-DD");
    // }

    // console.log( fi, ff );

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de nueva vacacion  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      id_vacacion: this.vacDetalleFORM.id_vacacion,
      id_empresa: this.vacDetalleFORM.id_empresa,
      id_empleado: this.vacDetalleFORM.id_empleado,
      vdt_anio: this.vacDetalleFORM.vdt_anio,
      vdt_fecha_inicio: this.formGroupVacaciones.value.fcn_fecha_inicio,
      vdt_fecha_fin: this.formGroupVacaciones.value.fcn_fecha_fin,
      vdt_num_horas: this.formGroupVacaciones.value.fcn_vac_total_horas,
      vdt_observacion: this.formGroupVacaciones.value.fnc_vdt_observacion,
      vac_detalle_estado_id: 'PAPR'
    }
    // console.log(data)
    // return;

    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.vacaServ.saveVacationDetail(data).subscribe(
      (res: GeneralResponseI) => {
        console.log(res);
        this.toastr.success(
          "Datos de vacaciones guardados correctamente."
        );
        //consultar nuevamente 
        // this.cancel(0);
        // this.getFaltasPermisos(idEmp);
        this.objGetVacationes = [];
        // this.consultarVacionesCabecera();
        // this.cancelar();
        this.lcargando.ctlSpinner(false);

        this.getVacacionesEmpleado(this.empleadoData)

      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        // this.toastr.error(error?.error?.detail);

        if (error.error?.detail) {
          let errorApi = Object.values(error?.error?.detail);
          for (let i = 0; i < errorApi.length; i++) {
            let msj = errorApi[i].toString();
            this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: this.capitalizarPrimeraLetra(msj) });
          }
        } else {
          this.messageService.add({key: 'tr', severity: 'warning', summary: 'Atencion', detail: error.error?.message})
        }

      }
    );
  }

  capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  onClicConsultaEmpleadosPorIdenificacion() {
    let identificacionEmp = this.formGroupVacaciones.value.fcn_seach_empleado;
    // console.log(identificacionEmp);

    if (identificacionEmp == '') {
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Identificación es requerida para buscar.' });
    }

    let parameterUrl: any = {
      identification: identificacionEmp,
      // relation_selected : 'codigoTrabajo@sueldo'
      relation_selected: 'codigoTrabajo',
      relation: ''
    };

    this.mensajeSppiner = "Consultando...";
    this.lcargando.ctlSpinner(true);
    this.generalService.getEmpleadosOnlyIdentificacion(parameterUrl)
      .subscribe({
        next: (rpt: Empleado) => {
          this.messageService.add({ key: 'tr', severity: 'success', summary: 'Exitoso', detail: 'Identificación del empleado encontrada.' });


          this.llenarInputEmpleado(rpt);
          this.lcargando.ctlSpinner(false);
        },
        error: (e) => {
          console.log(e);
          this.lcargando.ctlSpinner(false);
          this.toastr.error(e?.error?.detail);
        },
      });


  }

  llenarInputEmpleado(empleadoData) {
    this.empleadoData = empleadoData;
    console.log(empleadoData);
    this.objGetVacationes = [];
    /**
     * 
     */
    this.vacacionesForm.id_empleado = empleadoData.id_empleado;
    this.formGroupVacaciones.get("fcn_full_nombre_empleado").setValue(empleadoData.emp_full_nombre);
    this.formGroupVacaciones.get("fcn_emp_identificacion").setValue(empleadoData.emp_identificacion);
    // let fechaIngreso = new Date(empleadoData.emp_fecha_ingreso).toLocaleString('es-US', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: "long" });
    this.formGroupVacaciones.get("fcn_emp_fecha_ingreso").setValue(moment(empleadoData.emp_fecha_ingreso).format('YYYY-MM-DD'));
    this.formGroupVacaciones.get("fcn_emp_sueldo_variable").setValue(empleadoData.codigo_trabajo.cat_nombre);

    const maxDiasVacaciones = empleadoData.codigo_trabajo.cat_keyword == 'LOSEP' ? 30 : 15;
    // COTR
    this.formGroupVacaciones.get("fcn_vac_num_dias_max_vacaciones").setValue(maxDiasVacaciones);

    let mesVacaciones = (empleadoData.codigo_trabajo.cat_keyword == 'LOSEP') ? 11 : 12;
    this.formGroupVacaciones.get("fcn_vac_a_partir_meses").setValue(mesVacaciones + " Meses");

    // dias trabajando

    // let finalIngreso = formatDate(new Date(empleadoData.emp_fecha_ingreso), 'yyyy-MM-dd', "en-US");
    // let fechaActual = formatDate(new Date(), 'yyyy-MM-dd', "en-US");


    // let totalD = new Date(fechaActual).getTime() - new Date(finalIngreso).getTime();
    // let totalDias = totalD / (1000 * 60 * 60 * 24);
    let totalDias = moment().diff(moment(empleadoData.emp_fecha_ingreso), "days");

    this.formGroupVacaciones.get("fcn_vac_tiempo_trabajando").setValue(this.getFormatedStringFromDays(totalDias));

    this.getVacacionesEmpleado(empleadoData)

    /* this.mensajeSppiner = "Cargando datos de Empleado...";


    this.loading = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get lista vacaciones empleado rrhh",
      id_controlador: myVarGlobals.fBovedas,

      page: this.pageIndex,
      size: 1000,  // this.rows
      sort: 'vac_anio',
      type_sort: 'desc',
      search: '',
      id_empleado: empleadoData.id_empleado,
      id_empresa: empleadoData.id_empresa,

    };
    this.lcargando.ctlSpinner(true);
    this.vacaServ.getVacaciones(empleadoData.id_empleado) //.getVacationDaysEmployees(data)
      .subscribe({
        next: (rpt: VacacionAditionalResponseI) => {
          console.log(rpt);
          let info = rpt.data;
          console.log(info);
          this.objGetVacationes = info;

          let diasHorasAcumuladas = 0;

          for (let i = 0; i < info.length; i++) {
            if (info[i].vac_observacion.toString() == 'POR_GOZAR') {
              diasHorasAcumuladas = diasHorasAcumuladas + info[i].vac_dias_acumulados;
            }
          }


          this.formGroupVacaciones.get("fcn_vac_cat_D_H_acumuladas").setValue(this.convertHorasAndDias(diasHorasAcumuladas));
          this.formGroupVacaciones.get("fcn_vac_cat_horas_acumuladas").setValue(diasHorasAcumuladas);

          this.lcargando.ctlSpinner(false);

          this.loading = false;


        },
        error: (e) => {
          console.log(e);
          this.loading = false;
          this.lcargando.ctlSpinner(false);

        },
      }); */
  }

  getVacacionesEmpleado = async (empleadoData) => {
    this.loading = true;
    try {
      const response = await this.vacaServ.getVacaciones(empleadoData.id_empleado).toPromise();
      console.log(response)
      this.objGetVacationes = response['data']
      let diasHorasAcumuladas = 0;

      for (let i = 0; i < this.objGetVacationes.length; i++) {
        if (this.objGetVacationes[i].vac_observacion.toString() == 'POR_GOZAR') {
          diasHorasAcumuladas = diasHorasAcumuladas + this.objGetVacationes[i].vac_dias_acumulados;
        }
      }


      this.formGroupVacaciones.get("fcn_vac_cat_D_H_acumuladas").setValue(this.convertHorasAndDias(diasHorasAcumuladas));
      this.formGroupVacaciones.get("fcn_vac_cat_horas_acumuladas").setValue(diasHorasAcumuladas);

      // this.lcargando.ctlSpinner(false);

      this.loading = false;
    } catch (err) {
      console.log(err)
      this.loading = false
      this.toastr.error(err.error?.message, 'Error cargando Vacaciones')
    }
    
  }

  nextPage($event) {
    console.log( $event );
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



  cancelar() {
    // Limpiar datos del Empleado
    this.formGroupVacaciones.get('fcn_emp_identificacion').setValue('');
    this.formGroupVacaciones.get('fcn_emp_fecha_ingreso').setValue('');
    this.formGroupVacaciones.get('fcn_full_nombre_empleado').setValue('');
    this.formGroupVacaciones.get('fcn_emp_sueldo_variable').setValue('');
    this.formGroupVacaciones.get('fcn_vac_num_dias_max_vacaciones').setValue('');
    this.formGroupVacaciones.get('fcn_vac_a_partir_meses').setValue('');
    this.formGroupVacaciones.get('fcn_vac_tiempo_trabajando').setValue('');

    this.formGroupVacaciones.get("fcn_fecha_inicio").setValue(moment().format('YYYY-MM-DD'));
    this.formGroupVacaciones.get("fcn_fecha_fin").setValue(moment().format('YYYY-MM-DD'));
    this.formGroupVacaciones.get('fnc_vdt_observacion').setValue('');
    this.changeFechaFin();
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;


  }


  changeFechaFin() {


    let inputFechaInicio = this.formGroupVacaciones.get("fcn_fecha_inicio").value;
    let inputFechaFin = this.formGroupVacaciones.get("fcn_fecha_fin").value;

    // let finalFI = '';
    // let finalFF = '';
    // let uno = typeof (inputFechaInicio);
    // let dos = typeof (inputFechaFin);

    // if (uno === 'string') {
    //   finalFI = inputFechaInicio.split("/").reverse().join("-");
    //   finalFF = formatDate(new Date(inputFechaFin), 'yyyy-MM-dd', "en-US");
    // } else if (dos === 'string') {
    //   finalFI = formatDate(new Date(inputFechaInicio), 'yyyy-MM-dd', "en-US");
    //   finalFF = inputFechaFin.split("/").reverse().join("-");
    // } else {
    //   finalFI = formatDate(new Date(inputFechaInicio), 'yyyy-MM-dd', "en-US");
    //   finalFF = formatDate(new Date(inputFechaFin), 'yyyy-MM-dd', "en-US");
    // }


    // let totalD = new Date(finalFF).getTime() - new Date(finalFI).getTime();
    // let totalDias = totalD / (1000 * 60 * 60 * 24);
    let totalDias = moment(inputFechaFin).diff(moment(inputFechaInicio), 'days')

    this.formGroupVacaciones.get("fcn_vac_total_horas").setValue(totalDias);

    // let totaHoras = fechaFin - fechaInicio

    this.formGroupVacaciones.get("fcn_vac_num_dias_gozar").setValue((totalDias == 0) ? 1 : totalDias + 1);
    // this.formGroupVacaciones.get("fcn_vac_num_horas_gozar").setValue((finalFI == finalFF) ? 8 : (totalDias * 8) + 8);
    this.formGroupVacaciones.get("fcn_vac_num_horas_gozar").setValue((moment(inputFechaInicio).isSame(moment(inputFechaFin))) ? 8 : (totalDias * 8) + 8);
    // this.formGroupVacaciones.get("fcn_vac_total_horas").setValue((finalFI == finalFF) ? 8 : (totalDias * 8) + 8);
    this.formGroupVacaciones.get("fcn_vac_total_horas").setValue((moment(inputFechaInicio).isSame(moment(inputFechaFin))) ? 8 : (totalDias * 8) + 8);

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
    const horasDias = this.SplitTime($horas, 8);
    console.log(horasDias)
    return horasDias;
  }

  convertFaltasPermisosDiasHoras($horas) {
    let horasDias = this.SplitTime($horas, 8);
    return horasDias;
  }

  /**
  * faltas y permisos
  */
  @Input() horasVacaciones: number;
  showModalDialogFaltasPermisos(det_vacation: Vacaciones) {
    // console.log(det_vacation);
    let parameterUrl: any = {
      id_empleado: det_vacation.id_empleado,
      anio: det_vacation.vac_anio,
      keyword_afecta_rol: 'VACS'
    };

    this.mensajeSppiner = "Consultando vacaciones...";
    this.lcargando.ctlSpinner(true);
    this.serviceFaltasYPermisosService.getFaltasPermisosAfectaRolParameter(parameterUrl)
      .subscribe({
        next: (rpt: any) => {


          this.objGetFaltaPermisosByParameter = rpt;
          this.lcargando.ctlSpinner(false);


          this.horasVacaciones = 0;
          let dataVacResp = Object.values(rpt);
          for (let i = 0; i < dataVacResp.length; i++) {
            this.horasVacaciones = this.horasVacaciones + dataVacResp[i]['flpr_num_horas'];
          }

        },
        error: (e) => {
          console.log(e);
          this.lcargando.ctlSpinner(false);
          this.toastr.error(e?.error?.detail);
        },
      });
    this.displayModalVacacionesFaltasPermisos = true;
  }


  onRowSelectVacionesEmp(dataVacaciones: Vacaciones) {
    let dataVac = dataVacaciones.data;
    // 'POR_GOZAR', 'ANULADOS' , 'GOZADOS'

    // Revisa si tiene dias/horas disponibles en periodo de fila seleccionada
    if (dataVac.vac_observacion.toString() == 'ANULADOS' || dataVac.vac_observacion.toString() == 'GOZADOS') {
      let $mensaje = dataVac.vac_observacion.toString() == 'ANULADOS' ? 'los Días estan perdidos' : 'los Días estan GOZADOS en su totalidad';
      this.vmButtons[0].habilitar = true;
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'El año ha seleccinar ya no acepta mas vaciones porque,' + $mensaje + ' .Por favor selecione otro año.' });

    }

    // Dias restantes
    let dia = dataVac.vac_restantes;

    // Periodo seleccionado
    let anio = dataVac.vac_anio;
    this.vacDetalleFORM.vdt_anio = anio;

    // console.log(this.empleadoData.emp_fecha_ingreso)

    let fechaIngresoEmpl = formatDate(this.empleadoData.emp_fecha_ingreso, 'MM-dd', "en-US");


    /* let fechaInicio = moment(anio+'01').format("DD/MM/YYYY"); */
    let fechaInicio = moment(`${anio}-${fechaIngresoEmpl}`).format('YYYY-MM-DD');
    // let fechaFin = moment(anio+'/01/'+dia).format("DD/MM/YYYY");
    /* let fechaFin = moment(anio+'01').format("DD/MM/YYYY"); */
    let fechaFin = moment(`${anio}-${fechaIngresoEmpl}`).format('YYYY-MM-DD');

    this.vacDetalleFORM.vdt_fecha_inicio = new Date(fechaInicio);
    this.vacDetalleFORM.vdt_fecha_fin = new Date(fechaFin);

    this.vacDetalleFORM.id_vacacion = dataVac.id_vacacion;
    this.vacDetalleFORM.id_empresa = dataVac.id_empresa;
    this.vacDetalleFORM.id_vacacion = dataVac.id_vacacion;
    this.vacDetalleFORM.id_empleado = dataVac.id_empleado;

    // No sobreescribir las fecha seleccionadas en el formulario
    // this.formGroupVacaciones.get("fcn_fecha_inicio").setValue(fechaInicio);
    // this.formGroupVacaciones.get("fcn_fecha_fin").setValue(fechaFin);

    //cambiar input de numero de horas
    // this.changeFechaFin();



    // let inputFechaInicio = fechaInicio;
    // let inputFechaFin = fechaFin;

    // let finalFI = formatDate(inputFechaInicio,'yyyy-MM-dd',"en-US");
    // let finalFF = formatDate(inputFechaFin,'yyyy-MM-dd',"en-US");


    // let totalD = new Date(finalFF).getTime() - new Date(finalFI).getTime();
    // let totalDias = totalD/(1000*60*60*24);

    // this.formGroupVacaciones.get("fcn_vac_total_horas").setValue( totalDias );

    // // let totaHoras = fechaFin - fechaInicio

    // this.formGroupVacaciones.get("fcn_vac_num_dias_gozar").setValue( (totalDias == 0 )? 1 : totalDias + 1);
    // this.formGroupVacaciones.get("fcn_vac_num_horas_gozar").setValue((finalFI == finalFF )? 8 : (totalDias*8)+8);
    // this.formGroupVacaciones.get("fcn_vac_total_horas").setValue((finalFI == finalFF )? 8 : (totalDias*8)+8);

    this.vmButtons[0].habilitar = false;

    //console.log(dataVacaciones.data);
  }

  /**
   * seleccionar vacione detalles
   */
  onRowSelectVacionesDetalles(data: VacionesDetalle) {
    if (data.data != undefined) {
      let infoDetalleVac = data.data;
      // console.log(infoDetalleVac);
      if (infoDetalleVac.estado_detalle_vacion.cat_keyword == 'ERDO') {
        let $mensaje = 'los dias de vaciones fueron Rechazados'
        return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'No se puede eliminar o actualizar porque,' + $mensaje + ' .Por favor selecione otro registro.' });
      } else if (infoDetalleVac.estado_detalle_vacion.cat_keyword == 'EPRB') {
        let $mensaje = 'los dias de vaciones fueron Aprobados'
        return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'No se puede eliminar o actualizar porque,' + $mensaje + ' .Por favor selecione otro registro.' });
      } else {
        // 'POR_GOZAR', 'ANULADOS' , 'GOZADOS'
        let valores = Object.values(this.objGetVacationes);
        for (let i = 0; i < valores.length; i++) {
          if (valores[i]['id_vacacion'] == infoDetalleVac.id_vacacion && ( /* valores[i]['vac_observacion'] == 'GOZADOS' ||  */ valores[i]['vac_observacion'] == 'ANULADOS')) {
            let $mensaje = valores[i]['vdt_observacion'] == 'ANULADOS' ? 'los Días estan perdidos' : 'los Días estan GOZADOS en su totalidad';
            return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'No se puede eleminar o actualizar porque,' + $mensaje + ' .Por favor selecione otro año.' });
          }
        }
      }


      this.vacDetalleFORM = infoDetalleVac;
      // this.vacDetalleFORM.id_vac_detalle = infoDetalleVac.id_vac_detalle;
      // this.vacDetalleFORM.id_vacacion = infoDetalleVac.id_vacacion;
      // this.vacDetalleFORM.id_empresa = infoDetalleVac.id_empresa;
      // this.vacDetalleFORM.id_empleado = infoDetalleVac.id_empleado;
      // this.vacDetalleFORM.vdt_anio = infoDetalleVac.vdt_anio;
      // this.vacDetalleFORM.vdt_fecha_inicio = infoDetalleVac.vdt_fecha_inicio;// :new Date,
      // this.vacDetalleFORM.vdt_fecha_fin = infoDetalleVac.vdt_fecha_fin;
      // this.vacDetalleFORM.vdt_num_horas = infoDetalleVac.vdt_num_horas;
      // this.vacDetalleFORM.vdt_observacion = infoDetalleVac.vdt_observacion;

      let dataFechaIN = formatDate(infoDetalleVac.vdt_fecha_inicio, 'dd/MM/yyyy', "en-US")
      let dataFechaFN = formatDate(infoDetalleVac.vdt_fecha_fin, 'dd/MM/yyyy', "en-US")

      this.formGroupVacaciones.get("fcn_fecha_inicio").setValue(dataFechaIN);
      this.formGroupVacaciones.get("fcn_fecha_fin").setValue(dataFechaFN);
      this.formGroupVacaciones.get("fcn_vac_total_horas").setValue(infoDetalleVac.vdt_num_horas);
      this.formGroupVacaciones.get("fnc_vdt_observacion").setValue(infoDetalleVac.vdt_observacion);
      this.formGroupVacaciones.get("fcn_vac_num_dias_gozar").setValue((infoDetalleVac.vdt_num_horas) / 8);
      this.formGroupVacaciones.get("fcn_vac_num_horas_gozar").setValue(infoDetalleVac.vdt_num_horas);

      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = false;

    }
  }


  setNessageVacacion($enumVac) {
    if ($enumVac == 'POR_GOZAR') {
      return 'Días pendiente por gozar';
    } else if ($enumVac == 'ANULADOS') {
      return 'Días perdidos';
    } else if ($enumVac == 'GOZADOS') {
      return 'Días gozados en su totalidad';
    }

  }

  /**
 * Borrar desde el input
 */
  deleteDataVacacionDetalle($data: VacionesDetalle) {
    if ($data.estado_detalle_vacion.cat_keyword == 'ERDO') {
      let $mensaje = 'los dias de vaciones fueron Rechazados'
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'No se puede eliminar o actualizar porque,' + $mensaje + ' .Por favor selecione otro registro.' });
    } else if ($data.estado_detalle_vacion.cat_keyword == 'EPRB') {
      let $mensaje = 'los dias de vaciones fueron Aprobados'
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'No se puede eliminar o actualizar porque,' + $mensaje + ' .Por favor selecione otro registro.' });
    } else {
      let valores = Object.values(this.objGetVacationes);
      for (let i = 0; i < valores.length; i++) {
        if (valores[i]['id_vacacion'] == $data.id_vacacion && ( /* valores[i]['vac_observacion'] == 'GOZADOS' ||  */ valores[i]['vac_observacion'] == 'ANULADOS')) {
          let $mensaje = valores[i]['vdt_observacion'] == 'ANULADOS' ? 'los Días estan perdidos' : 'los Días estan GOZADOS en su totalidad';
          return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'No se puede ELIMINAR porque,' + $mensaje + ' .Por favor selecione otro año.' });
        }
      }
    }
    this.vacDetalleFORM = $data;
    this.validaDeleteVacaciones();
  }


  /**
   * fin tab vaciones
   */

  /**
   * ----------------------------------------------------------------------------
   * INICIO certificados laborales
   */

  formGroupCertificadosLaborales: FormGroup;
  empleadoDataCertificados: Empleado;
  tipo_certificado_id_cc: BigInteger | String | number;
  urlStringPreviewCertificate: string;
  urlPreviewCertificate: SafeResourceUrl;




  validateFormCertificadosLaboral() {
    return this.formGroupCertificadosLaborales = this.fbCert.group({
      fcn_seach_empleado_certificado: [""],
      fc_cer_identificacion: ["", [Validators.required]],
      fcn_cer_emp_fecha_ingreso: ["", [Validators.required]],
      fcn_cer_emp_fecha_naciiento: ["", [Validators.required]],
      fcn_cer_full_nombre_empleado: ["", [Validators.required]],
      fcn_cer_emp_correo_personal: ["", [Validators.required]],
      fcn_cer_emp_correo_empresarial: ["", [Validators.required]],
      fcn_cer_emp_telefono: ["", [Validators.required]],
      fcn_cer_emp_celular: ["", [Validators.required]],
      fcn_cer_genero: ["", [Validators.required]],
    });
  }


  onClicConsultaEmpleadosPorIdenificacionCertificados() {
    let identificacionEmp = this.formGroupCertificadosLaborales.value.fcn_seach_empleado_certificado;
    // console.log(identificacionEmp);

    if (identificacionEmp == '') {
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Identificación es requerida para buscar.' });
    }

    let parameterUrl: any = {
      identification: identificacionEmp,
      relation_selected: '',
      relation: 'all'
    };

    this.mensajeSppiner = "Consultando...";
    this.lcargando.ctlSpinner(true);
    this.generalService.getEmpleadosOnlyIdentificacion(parameterUrl)
      .subscribe({
        next: (rpt: Empleado) => {
          this.messageService.add({ key: 'tr', severity: 'success', summary: 'Exitoso', detail: 'Identificación del empleado encontrada.' });

          // console.log(rpt);
          this.llenarInputEmpleadoCertificado(rpt);
          this.lcargando.ctlSpinner(false);
        },
        error: (e) => {
          console.log(e);
          this.lcargando.ctlSpinner(false);
          this.toastr.error(e?.error?.detail);
        },
      });


  }

  llenarInputEmpleadoCertificado(empleadoData) {
    this.empleadoDataCertificados = empleadoData;
    this.objGetVacationes = [];
    /**
     * 
     */

    this.formGroupCertificadosLaborales.get("fcn_cer_full_nombre_empleado").setValue(empleadoData.emp_full_nombre);
    this.formGroupCertificadosLaborales.get("fc_cer_identificacion").setValue(empleadoData.emp_identificacion);
    let fechaIngresoCer = new Date(empleadoData.emp_fecha_ingreso).toLocaleString('es-US', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: "long" });
    this.formGroupCertificadosLaborales.get("fcn_cer_emp_fecha_ingreso").setValue(fechaIngresoCer);
    let fechaNacimientoCer = new Date(empleadoData.emp_fecha_nacimiento).toLocaleString('es-US', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: "long" });
    this.formGroupCertificadosLaborales.get("fcn_cer_emp_fecha_naciiento").setValue(fechaNacimientoCer);
    this.formGroupCertificadosLaborales.get("fcn_cer_emp_correo_personal").setValue(empleadoData?.emp_correo);
    this.formGroupCertificadosLaborales.get("fcn_cer_emp_correo_empresarial").setValue(empleadoData?.emp_correo_empresarial);
    this.formGroupCertificadosLaborales.get("fcn_cer_emp_telefono").setValue(empleadoData?.emp_telefono);
    this.formGroupCertificadosLaborales.get("fcn_cer_emp_celular").setValue(empleadoData?.emp_celular);
    this.formGroupCertificadosLaborales.get("fcn_cer_genero").setValue(empleadoData?.genero.cat_nombre);
    // this.formGroupVacaciones.get("fcn_emp_sueldo_variable").setValue(empleadoData.codigo_trabajo.cat_nombre);
  }

  viewSelectionTipoCertificadoCC(responseId: any) {

    this.tipo_certificado_id_cc = responseId;
    // this.extension_conyuge_id_cc = responseId;
    // this.formFichaEmpleado
    //   .get("nameExtencionConyuge")
    //   .setValue(this.extension_conyuge_id_cc);
  }



  generarPrevisualizacionCertificado() {

    if (this.empleadoDataCertificados == undefined) {
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Eliga el Empleado.' });
    }
    if (this.tipo_certificado_id_cc == 0 || this.tipo_certificado_id_cc == undefined) {
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Eliga el tipo de certificado.' });
    }


    let id_certificado = this.tipo_certificado_id_cc;
    let id_empleado = this.empleadoDataCertificados.id_empleado;
    let id_empresa = 1;
    this.urlStringPreviewCertificate = environment.apiUrl + `certificate-preview?id_empleado=${id_empleado}&id_certificado=${id_certificado}&id_empresa=${id_empresa}`;

    this.urlPreviewCertificate = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlStringPreviewCertificate);

  }


  async validaPDFCertificados() {

    if (this.empleadoDataCertificados == undefined) {
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Eliga el Empleado.' });
    }
    if (this.tipo_certificado_id_cc == 0 || this.tipo_certificado_id_cc == undefined) {
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Eliga el tipo de certificado.' });
    }


    this.confirmSave(
      "Seguro desea generar pdf del certificado?",
      "PDF_CERTIFICADOS"
    );
  }

  async imprimirPDFCertificados() {

    if (this.empleadoDataCertificados == undefined) {
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Eliga el Empleado.' });
    }
    if (this.tipo_certificado_id_cc == 0 || this.tipo_certificado_id_cc == undefined) {
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Eliga el tipo de certificado.' });
    }


    this.confirmSave(
      "Seguro desea generar pdf del certificado?",
      "IMPRIMIR_PDF_CERTIFICADOS"
    );
  }



  /**
 * descargar
 */
  pdfCertificados() {

    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Generar Pdf certificados rrhh",
      id_controlador: myVarGlobals.fBovedas,
      id_empleado: this.empleadoDataCertificados.id_empleado,
      id_certificado: this.tipo_certificado_id_cc,
      id_empresa: 1,

    };
    // this.validaDt = false;
    this.mensajeSppiner = "PDF...";
    this.lcargando.ctlSpinner(true);
    this.prestamosinternosService.geDownloadCertificado(data).subscribe(
      (res: any) => {

        const filename = 'CertificadoTrabajo-' + this.empleadoDataCertificados.emp_identificacion;
        let dataType = res.type;
        let binaryData = [];
        binaryData.push(res);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        if (filename) {
          downloadLink.setAttribute('download', filename);
        }
        document.body.appendChild(downloadLink);
        downloadLink.click()

        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.toastr.info(error.error.message);
      }
    );
  }


  pdfImprimirCertificados() {

    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Generar Pdf certificados rrhh",
      id_controlador: myVarGlobals.fBovedas,
      id_empleado: this.empleadoDataCertificados.id_empleado,
      id_certificado: this.tipo_certificado_id_cc,
      id_empresa: 1,

    };
    // this.validaDt = false;
    this.mensajeSppiner = "PDF...";
    this.lcargando.ctlSpinner(true);
    this.prestamosinternosService.geDownloadCertificado(data).subscribe(
      (res: any) => {

        // const blobUrl = URL.createObjectURL(res.blob);


        // window.print();

        // const filename = 'CertificadoTrabajo-'+this.empleadoDataCertificados.emp_identificacion;
        // let dataType = res.type;
        // let binaryData = [];
        // binaryData.push(res);
        // let downloadLink = document.createElement('a');
        // downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        // if (filename) {
        //   downloadLink.setAttribute('download', filename);
        // }

        let blob = new Blob([res.buffer], {
          type: 'application/pdf'
        });


        const blobUrl = window.URL.createObjectURL((res.blob));
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();

        // document.body.appendChild(downloadLink);
        // downloadLink.click()

        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.toastr.info(error.error.message);
      }
    );

  }

  // https://stackblitz.com/edit/ng2-pdf-viewer-print?file=src%2Fapp%2Fapp.component.ts,src%2Fapp%2Fapp.component.html
  // src = '';
  // isPdfLoaded = false;
  // private pdf: PDFDocumentProxy;
  // onLoaded(pdf: PDFDocumentProxy) {
  //   this.pdf = pdf;
  //   this.isPdfLoaded = true;
  // }

  //   onload="autoResize(this);"
  // autoResize(iframe) {
  //   $(iframe).height($(iframe).contents().find('html').height());
  // }
  /**
   * FIN CERTIFICADOS LABORALES
   */


  /**
   * INICIO PERMISOS
   */
  //tabla
  @Input() objGetFaltaPermisosByParameterSolicitud: FaltaPermiso[];
  // // // @Input() objGetFaltaPermisosReport: FaltaPermiso[];
  loadingFaltaPermiso: boolean;
  totalRecordsFaltaPermiso: number;
  rowsFaltaPermiso: number;
  pageIndexFaltaPermiso: number = 1;
  pageSizeFaltaPermiso: number = 5;
  pageSizeOptionsFaltaPermiso: number[] = [10, 15, 20];

  //
  mes_id_cc: BigInteger | String | number;
  tipo_permiso_id_cc: BigInteger | String | number;
  afecta_rol_id_cc: BigInteger | String | number;

  sld_anio: any;
  //formulario
  // ref: DynamicDialogRef;
  formGroupFaltaAndPermiso: FormGroup;
  // submitted = false;
  // processing: any = false;
  anio_reporte: any;
  id_empleado: any = 0;


  faltasAndDescuentosForm: FaltaPermiso = {
    // indc_anio:0,///
    emp_full_nombre: '',
    id_falt_perm: 0,
    id_empleado: 0,
    flpr_anio: 0,
    id_mes: 0,
    id_tipo_permiso: 0,
    id_afecta_rol: 0,
    flpr_fecha_inicio: new Date,
    flpr_fecha_fin: new Date,
    flpr_num_horas: 0,
    flpr_observacion: '',
    estado_id: 0,
    mes: undefined,
    tipo_permiso: undefined,
    afecta_rol: undefined,
    estado: undefined,
    flpr_estado_id: 0,
    estado_falta_permiso: undefined
  };



  validateFormFaltasPermisos() {
    return this.formGroupFaltaAndPermiso = this.fbCert.group({
      fcn_seach_empleado_faltas_permisos: [""],
      fcn_full_nombre_empleado_permiso: ["", [Validators.required, Validators.minLength(1)]],
      fcn_flpr_anio_permiso: ["", [Validators.required]],
      fcn_mes_permiso: ['', [Validators.required]],
      fcn_tipo_permiso_permiso: ['', [Validators.required]],
      fcn_afecta_rol_permiso: ["", [Validators.required]],
      fnc_flpr_fecha_inicio_permiso: ['', [Validators.required/* , this.dateRangeValidator */]],
      fnc_fnc_flpr_fecha_fin_permiso: ['', [Validators.required/* , this.dateRangeValidator */]],
      fnc_flpr_num_horas_permiso: ['', [Validators.required]],
      fnc_flpr_observacion_permiso: [''],
    });
  }

  onClicConsultaEmpleadosPorIdentificacionPermisos() {
    let identificacionEmp = this.formGroupFaltaAndPermiso.value.fcn_seach_empleado_faltas_permisos;
    // console.log(identificacionEmp);

    if (identificacionEmp == '') {
      return this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Identificación es requerida para buscar.' });
    }

    let parameterUrl: any = {
      identification: identificacionEmp,
      relation_selected: '',
      relation: ''
    };

    this.mensajeSppiner = "Consultando...";
    this.lcargando.ctlSpinner(true);
    this.generalService.getEmpleadosOnlyIdentificacion(parameterUrl)
      .subscribe({
        next: (rpt: Empleado) => {
          this.messageService.add({ key: 'tr', severity: 'success', summary: 'Exitoso', detail: 'Identificación del empleado encontrada.' });

          // console.log(rpt);
          this.llenarInputEmpleadoPermisos(rpt);
          // this.lcargando.ctlSpinner(false);
        },
        error: (e) => {
          console.log(e);
          this.lcargando.ctlSpinner(false);
          this.toastr.error(e?.error?.detail);
        },
      });
  }

  llenarInputEmpleadoPermisos(data: Empleado) {

    this.formGroupFaltaAndPermiso.get("fcn_full_nombre_empleado_permiso").setValue(data.emp_full_nombre);
    this.faltasAndDescuentosForm.id_empleado = data.id_empleado;
    this.getFaltasPermisos(this.faltasAndDescuentosForm.id_empleado);
    // this.vmButtons[1].habilitar = false;

    this.vmButtons.forEach(element => {
      if (element.paramAccion == "TAB_PERMISOS") {
        if (element.boton.texto == 'GUARDAR') element.habilitar = false
        else if (element.boton.texto == 'CONSULTAR') element.habilitar = false
      }
    });

  }

  onClicConsultaEmpleados(content) {

    this.ref = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: "not",
        search: '',//this.inputNameSearchEmpleado.nativeElement.value,
        // relation_selected : "sueldoVariable@sueldo",
        relation_selected: "codigoTrabajo",
      },

      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe(
      (empleadoData: Empleado) => this.llenarInputEmpleado(empleadoData)
      
      /* {
        console.log(empleadoData)
        this.formGroupVacaciones.get("fcn_full_nombre_empleado").setValue(empleadoData.emp_full_nombre);
        this.formGroupVacaciones.get("fcn_emp_identificacion").setValue(empleadoData.emp_identificacion);
        this.formGroupVacaciones.get("fcn_emp_fecha_ingreso").setValue(moment(empleadoData.emp_fecha_ingreso).format('YYYY-MM-DD'));
        this.formGroupVacaciones.get("fcn_emp_sueldo_variable").setValue(empleadoData.codigo_trabajo.cat_nombre);

        const maxDiasVacaciones = empleadoData.codigo_trabajo.cat_keyword == 'LOSEP' ? 30 : 15;
        // COTR
        this.formGroupVacaciones.get("fcn_vac_num_dias_max_vacaciones").setValue(maxDiasVacaciones);

        let mesVacaciones = (empleadoData.codigo_trabajo.cat_keyword == 'LOSEP') ? 11 : 12;
        this.formGroupVacaciones.get("fcn_vac_a_partir_meses").setValue(mesVacaciones + " Meses");

        // dias trabajando

        // let finalIngreso = formatDate(new Date(empleadoData.emp_fecha_ingreso), 'yyyy-MM-dd', "en-US");
        // let fechaActual = formatDate(new Date(), 'yyyy-MM-dd', "en-US");


        // let totalD = new Date(fechaActual).getTime() - new Date(finalIngreso).getTime();
        let totalD = moment().diff(moment(empleadoData.emp_fecha_ingreso), 'days');
        // let totalDias = totalD/(1000*60*60*24);

        this.formGroupVacaciones.get("fcn_vac_tiempo_trabajando").setValue(this.getFormatedStringFromDays(totalD));

        // this.llenarInputEmpleado(empleadoData);
      } */
    )

    /* this.ref.onClose.subscribe((empleadoData: Empleado) => {

      this.vacacionesForm.id_empleado = empleadoData.id_empleado;
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

      this.formGroupVacaciones.get("fcn_vac_tiempo_trabajando").setValue(this.getFormatedStringFromDays(totalDias));
      

      this.mensajeSppiner = "Guardando...";
      this.lcargando.ctlSpinner(true);

      this.loading = true;
      let data = {
        // info: this.areaForm,
        ip: this.commonService.getIpAddress(),
        accion: "get lista vacaciones empleado rrhh",
        id_controlador: myVarGlobals.fBovedas,
  
        page : this.pageIndex,
        size : 10,  // this.rows
        sort : 'vac_anio',
        type_sort :'desc',
        search : '',
        id_empleado : empleadoData.id_empleado,
        id_empresa : 1,
  
      };
  
    this.vacacionesEmpleadoService.getVacationDaysEmployees(data)
      .subscribe({
        next: (rpt: VacacionAditionalResponseI) => {
          console.log(rpt);
          let info = rpt.data['data'];
          // console.log(info);
          this.objGetVacationes = info;
          this.lcargando.ctlSpinner(false);
          
          this.loading = false;
        
          
        },
        error: (e) => {
          console.log(e);
          this.loading = false;
          this.lcargando.ctlSpinner(false);
         
        },
      }); */


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


    // });
  }

  // convenience getter for easy access to form fields
  get ffp() { return this.formGroupFaltaAndPermiso.controls; }

  /**-----METODOS DE GUARDAR */
  async validaSaveFaltaAndPermiso() {
    // console.log(JSON.stringify(this.formGroupFaltaAndPermiso.value));
    // console.log(new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio+'-12-31').getFullYear());
    this.submitted = true;
    // console.log(this.formGroupFaltaAndPermiso.invalid);
    if (this.formGroupFaltaAndPermiso.invalid) {
      return;
    }

    // console.log("guadrar");
    this.confirmSaveFP(
      "Seguro desea guardar falta y permiso del empleado?",
      "SAVE_FALTA_AND_PERMISO_EMPLEADO"
    );
  }

  async confirmSaveFP(message, action) {
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
        if (action == "SAVE_FALTA_AND_PERMISO_EMPLEADO") {
          this.saveFaltaAndPermisoEmpleadoSolicitudes();
        } else if (action == "UPDATED_FALTA_AND_PERMISO_EMPLEADO") {
          this.updateFaltaAndPermisoEmpleadoSolicitudes();
        } else if (action == "DELETE_FALTA_AND_PERMISO_EMPLEADO") {
          this.deleteFaltaAndPermisoEmpleadoSolicitudes();
        }
      }
    });
  }

  /**
 * guardar
 */
  async saveFaltaAndPermisoEmpleadoSolicitudes() {
    const idEmp = this.faltasAndDescuentosForm.id_empleado;

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de nueva falta y permisos  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      id_empleado: idEmp,
      flpr_anio: new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio_permiso.getFullYear() + '-12-31').getFullYear(),
      id_mes: this.mes_id_cc,
      id_tipo_permiso: this.tipo_permiso_id_cc,
      id_afecta_rol: this.afecta_rol_id_cc,
      flpr_fecha_inicio: this.formGroupFaltaAndPermiso.value.fnc_flpr_fecha_inicio_permiso,
      flpr_fecha_fin: this.formGroupFaltaAndPermiso.value.fnc_fnc_flpr_fecha_fin_permiso,
      flpr_num_horas: this.formGroupFaltaAndPermiso.value.fnc_flpr_num_horas_permiso,
      flpr_observacion: this.formGroupFaltaAndPermiso.get('fnc_flpr_observacion_permiso').value,
      flpr_estado_id: 'EFPP',
      // formatDate(this.inputFechaIngreso.value,'yyyy-MM-dd',"en-US"),
    }
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.perfaltasypermisosService.saveFaultAndPermission(data).subscribe(
      (res: GeneralResponseI) => {
        // console.log(res);
        this.toastr.success(
          "Datos de falta y permisos guardados correctamente."
        );

        this.cancel(0);
        this.getFaltasPermisos(idEmp);
        this.lcargando.ctlSpinner(false);
        // if (res.code == 200) {
        //   this.toastr.success(
        //     "Datos de falta y permisos guardados correctamente."
        //   );
        // }

        // this.submitted = false;
        // this.cancel(0);

        // this.rerender();


      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error?.error?.detail);
        // console.log(error);
        // this.lcargando.ctlSpinner(false);
        // this.processing = true;
        // this.toastr.info(error.error.message);
      }
    );
  }

  viewSelectionTipoPermisoCC(responseId: any) {
    this.tipo_permiso_id_cc = responseId;
    this.faltasAndDescuentosForm.id_tipo_permiso = responseId;
    this.formGroupFaltaAndPermiso.get("fcn_tipo_permiso_permiso").setValue(this.tipo_permiso_id_cc);
  }

  viewSelectionAfectaRolCC(responseId: any) {
    this.afecta_rol_id_cc = responseId;
    this.faltasAndDescuentosForm.id_afecta_rol = responseId;
    this.formGroupFaltaAndPermiso.get("fcn_afecta_rol_permiso").setValue(this.afecta_rol_id_cc);
  }

  viewSelectionMesCC(responseId: any) {

    this.mes_id_cc = responseId;
    this.faltasAndDescuentosForm.id_mes = responseId;
    this.formGroupFaltaAndPermiso.get("fcn_mes_permiso").setValue(this.mes_id_cc);

    if (this.faltasAndDescuentosForm.id_mes != 0 && this.faltasAndDescuentosForm.id_empleado != 0) {
      // this.vmButtons[1].habilitar = false;
    }

  }

  onValidateRangoFecha($valor) {
    var fechaInicio: string = this.formGroupFaltaAndPermiso.value.fnc_flpr_fecha_inicio;
    var fechaFin: string = this.formGroupFaltaAndPermiso.value.fnc_fnc_flpr_fecha_fin;


    if ($valor == 'inicio' && moment(fechaInicio).format('DD-MM-YYYY') > moment(fechaFin).format('DD-MM-YYYY')) {
      this.faltasAndDescuentosForm.flpr_fecha_inicio = new Date(this.faltasAndDescuentosForm.flpr_fecha_inicio);
      this.faltasAndDescuentosForm.flpr_fecha_fin = new Date(this.faltasAndDescuentosForm.flpr_fecha_fin);
      this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Fecha Inicio debe ser menor o igual q le Fecha de Fin.'/* ,life:300000 */ });
      return;
    }

    if ($valor == 'fin' && moment(fechaFin).format('DD-MM-YYYY') < moment(fechaInicio).format('DD-MM-YYYY')) {
      this.faltasAndDescuentosForm.flpr_fecha_inicio = new Date(this.faltasAndDescuentosForm.flpr_fecha_inicio);
      this.faltasAndDescuentosForm.flpr_fecha_fin = new Date(this.faltasAndDescuentosForm.flpr_fecha_fin);

      this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'Fecha Fin debe ser menor o igual q le Fecha de Inicio.'/* ,life:300000 */ });
      return;
    }
  }

  /**
  *
  * @param ptr_id_empleado
  */
  async getFaltasPermisos(ptr_id_empleado) {

    this.loadingFaltaPermiso = true;
    let parameterUrl: any = {
      id_empleado: ptr_id_empleado,
      page: this.pageIndexFaltaPermiso,
      size: this.rowsFaltaPermiso,
      sort: 'id_falt_perm',
      type_sort: 'desc'
    };
    //  console.log(parameterUrl);
    this.perfaltasypermisosService.getFaultAndPermissionByParameter(parameterUrl).subscribe({
      next: (rpt: FaltaAndPermisoAditionalResponseI) => {
        this.totalRecordsFaltaPermiso = rpt.total;
        this.objGetFaltaPermisosByParameterSolicitud = rpt.data;
        //  console.log(rpt.data);
        this.loadingFaltaPermiso = false;
        this.lcargando.ctlSpinner(false);
      },
      error: (e) => {
        console.log(e);
        this.loadingFaltaPermiso = false;
        this.lcargando.ctlSpinner(false);
      },
    });
  }

  faltasPermisosContruct() {
    this.rowsFaltaPermiso = 10;
  }


  nextPageFaltaPermiso(event: LazyLoadEvent) {
    let id_emp = this.faltasAndDescuentosForm.id_empleado;
    // console.log(id_emp);
    if (id_emp != 0) {
      this.pageIndexFaltaPermiso = (event.first / this.rowsFaltaPermiso) + 1;
      this.getFaltasPermisos(id_emp);
    }
    return;
  }


  cancel(dataTable) {

    this.formGroupFaltaAndPermiso.reset();
    this.afecta_rol_id_cc = "0";
    this.tipo_permiso_id_cc = "0";
    this.mes_id_cc = "0";

    this.faltasAndDescuentosForm.flpr_fecha_inicio = new Date();
    this.faltasAndDescuentosForm.flpr_fecha_fin = new Date();

    this.sld_anio = moment(new Date()).format("YYYY");
    this.faltasAndDescuentosForm.flpr_anio = this.sld_anio;
    this.formGroupFaltaAndPermiso.get("fcn_flpr_anio_permiso").setValue(this.sld_anio);

    this.formGroupFaltaAndPermiso.get("fnc_flpr_num_horas_permiso").setValue(0);

    this.formGroupFaltaAndPermiso.value.fnc_flpr_num_horas = 0;
    this.formGroupFaltaAndPermiso.get('fnc_flpr_observacion_permiso').setValue('');
    if (dataTable == 1) {
      this.faltasAndDescuentosForm.id_empleado = 0;
      this.formGroupFaltaAndPermiso.get("fcn_full_nombre_empleado_permiso").setValue('');
      this.faltasAndDescuentosForm.emp_full_nombre = '';
      this.objGetFaltaPermisosByParameter = [];
      this.vmButtons[1].habilitar = false;
    }

    this.faltasAndDescuentosForm.id_empleado = this.faltasAndDescuentosForm.id_empleado;
    this.formGroupFaltaAndPermiso.get("fcn_full_nombre_empleado_permiso").setValue(this.faltasAndDescuentosForm.emp_full_nombre);


    this.vmButtons.forEach(element => {
      if (element.paramAccion == "TAB_PERMISOS") {
        if (element.boton.texto == 'GUARDAR') element.habilitar = false
        else if (element.boton.texto == 'MODIFICAR') element.habilitar = true
        else if (element.boton.texto == 'ELIMINAR') element.habilitar = true
      }
    });

    // this.actions = { btnGuardar: true, btnMod: false };
    // this.vmButtons[0].habilitar = false;
    // this.vmButtons[1].habilitar = true;
    // this.vmButtons[2].habilitar = true;
    // this.vmButtons[3].habilitar = true;
    // console.log(this.faltasAndDescuentosForm);
    this.submitted = false;
  }

  /**
  * consultar or parametros
  */
  consultarFaltaAndPermiso() {

    this.loadingFaltaPermiso = true;

    let parameterUrl: any = {
      id_empleado: this.faltasAndDescuentosForm.id_empleado,
      flpr_anio: new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio_permiso + '-12-31').getFullYear(),
      id_mes: this.faltasAndDescuentosForm.id_mes,
      page: this.pageIndexFaltaPermiso,
      size: this.rowsFaltaPermiso,
      sort: 'id_falt_perm',
      type_sort: 'desc'
    };

    this.perfaltasypermisosService.getFaultAndPermissionByParameterAditional(parameterUrl)
      .subscribe({
        next: (rpt: FaltaAndPermisoAditionalResponseI) => {
          this.objGetFaltaPermisosByParameterSolicitud = [];
          this.totalRecordsFaltaPermiso = rpt.total;
          this.objGetFaltaPermisosByParameterSolicitud = rpt.data;
          //  console.log(rpt.data);
          this.loadingFaltaPermiso = false;

        },
        error: (e) => {
          console.log(e);
          this.loadingFaltaPermiso = false;
          this.toastr.error(e?.error?.detail);
        },
      });
  }



  onRowSelectFaltaPermisoEmp(dataFaltaPermiso: FaltaPermiso) {

    // this.actions.btnMod = true;
    // this.actions.btnGuardar = false;

    let dataFP = dataFaltaPermiso.data;
    if (dataFP.estado_falta_permiso.cat_keyword == "EFPR" || dataFP.estado_falta_permiso.cat_keyword == "EFPA") {
      let msj = this.messageService.add({ key: 'tr', severity: 'error', summary: 'Advertencia', detail: 'No se puede editar o borrar porque esta ' + dataFP.estado_falta_permiso.cat_nombre/* ,life:300000 */ });
      return msj;
    }

    this.faltasAndDescuentosForm = dataFaltaPermiso.data;

    this.faltasAndDescuentosForm.emp_full_nombre = this.faltasAndDescuentosForm.emp_full_nombre;
    this.formGroupFaltaAndPermiso.get("fcn_full_nombre_empleado_permiso").setValue(this.faltasAndDescuentosForm.emp_full_nombre);


    this.sld_anio = moment(this.faltasAndDescuentosForm.flpr_anio + '12').format("YYYY");

    this.faltasAndDescuentosForm.flpr_anio = this.sld_anio;

    this.faltasAndDescuentosForm.flpr_fecha_inicio = new Date(this.faltasAndDescuentosForm.flpr_fecha_inicio);
    this.faltasAndDescuentosForm.flpr_fecha_fin = new Date(this.faltasAndDescuentosForm.flpr_fecha_fin);


    this.formGroupFaltaAndPermiso.get('fnc_flpr_observacion_permiso').setValue(this.faltasAndDescuentosForm.flpr_observacion);
    this.viewSelectionMesCC(this.faltasAndDescuentosForm.id_mes);
    this.viewSelectionTipoPermisoCC(this.faltasAndDescuentosForm.id_tipo_permiso);
    this.viewSelectionAfectaRolCC(this.faltasAndDescuentosForm.id_afecta_rol);


    this.vmButtons.forEach(element => {
      if (element.paramAccion == "TAB_PERMISOS") {
        if (element.boton.texto == 'GUARDAR') element.habilitar = true
        else if (element.boton.texto == 'MODIFICAR') element.habilitar = false
        else if (element.boton.texto == 'ELIMINAR') element.habilitar = false
      }
    });


    // this.vmButtons[0].habilitar = true;
    // this.vmButtons[1].habilitar = false;
    // this.vmButtons[2].habilitar = false;
    // this.vmButtons[3].habilitar = false;

  }


  /**
   * 
   * @returns actualizar confir
   */
  async validaUpdateFaltaAndPermiso() {

    this.submitted = true;
    if (this.formGroupFaltaAndPermiso.invalid) {
      return;
    }
    this.confirmSaveFP(
      "Seguro desea actualizar falta y permiso del empleado?",
      "UPDATED_FALTA_AND_PERMISO_EMPLEADO"
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


  /**
  * actualizar 
  */
  async updateFaltaAndPermisoEmpleadoSolicitudes() {
    const idEmp = this.faltasAndDescuentosForm.id_empleado;

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de nueva ficha empleado  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,
      id_falt_perm: this.faltasAndDescuentosForm.id_falt_perm,
      id_empleado: idEmp,
      flpr_anio: new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio_permiso + '-12-31').getFullYear(),//this.formGroupFaltaAndPermiso.value.fcn_flpr_anio,
      id_mes: this.mes_id_cc,
      id_tipo_permiso: this.tipo_permiso_id_cc,
      id_afecta_rol: this.afecta_rol_id_cc,
      flpr_fecha_inicio: this.formGroupFaltaAndPermiso.value.fnc_flpr_fecha_inicio_permiso,
      flpr_fecha_fin: this.formGroupFaltaAndPermiso.value.fnc_fnc_flpr_fecha_fin_permiso,
      flpr_num_horas: this.formGroupFaltaAndPermiso.value.fnc_flpr_num_horas_permiso,
      flpr_observacion: this.formGroupFaltaAndPermiso.get('fnc_flpr_observacion_permiso').value,
    }
    this.mensajeSppiner = "Actualizando...";
    this.lcargando.ctlSpinner(true);
    this.perfaltasypermisosService.updatedFaultAndPermission(data).subscribe(
      (res: GeneralResponseI) => {
        // console.log(res);
        this.toastr.success(
          "Datos de falta y permisos actualizados correctamente."
        );
        this.objGetFaltaPermisosByParameterSolicitud = [];
        this.cancel(0);

        this.getFaltasPermisos(idEmp);
        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error?.error?.detail);
        // console.log(error);
        // this.lcargando.ctlSpinner(false);
        // this.processing = true;
        // this.toastr.info(error.error.message);
      }
    );
  }

  //eliminar
  async validaDeleteFaltaAndPermiso() {
    this.confirmSaveFP(
      "Seguro desea eliminar falta / permiso?",
      "DELETE_FALTA_AND_PERMISO_EMPLEADO"
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

  /**
  * borrar
  */
  deleteFaltaAndPermisoEmpleadoSolicitudes() {
    console.log("delete");
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Borrar falta y permiso rrhh",
      id_controlador: myVarGlobals.fBovedas,
      id_falt_perm: this.faltasAndDescuentosForm.id_falt_perm,

    };
    // this.validaDt = false;
    this.mensajeSppiner = "Borrando...";
    this.lcargando.ctlSpinner(true);
    this.perfaltasypermisosService.deleteFaultAndPermission(data).subscribe(
      (res) => {

        this.objGetFaltaPermisosByParameterSolicitud = [];
        this.cancel(0);
        this.getFaltasPermisos(this.faltasAndDescuentosForm.id_empleado);
        this.lcargando.ctlSpinner(false);
        this.toastr.success("Datos de falta y permisos borradis correctamente.");

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.toastr.info(error.error.message);
      }
    );
  }

  /**
   * FIN PERMISOS
   */
}
