import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices';
import { PerFaltasYPermisosService } from './per-faltas-y-permisos.service';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeesResponseI } from 'src/app/models/responseEmployee.interface';
import { CcModalTableEmpleadoComponent } from 'src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';
//import { FaltaAndPermisoAditionalResponseI, FaltaPermiso } from 'src/app/Models/responseFaltasAndPermisosAditional.interface';
import { FaltaAndPermisoAditionalResponseI, FaltaPermiso } from 'src/app/models/responseFaltasAndPermisosAditional.interfase';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { GeneralResponseI } from 'src/app/models/responseGeneral.interface';
import { format } from 'util';
// import { TranslateService } from '@ngx-translate/core';

import { environment } from 'src/environments/environment';

import { Subscription } from 'rxjs';
import { AppConfig } from './AppConfig.interface';
import { AppConfigService } from './AppConfig.services';

@Component({
standalone: false,
  selector: 'app-faltas-y-permisos',
  templateUrl: './faltas-y-permisos.component.html',
  styleUrls: ['./faltas-y-permisos.component.scss'],
  providers: [DialogService],
})
export class FaltasYPermisosComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  permiso_ver: any = "0";
  empresLogo: any;
  permisions: any;
  faltasYpermisos: any = [];
  vmButtons: any = [];
  mesConsulta: any = 0;
  empleadoReport: any;

  hidenBarra: boolean = true;
  hidenPastel: boolean = true;

  /**** */
  //formulario
  ref: DynamicDialogRef;
  formGroupFaltaAndPermiso: FormGroup;
  submitted = false;
  processing: any = false;
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

  sld_anio: any;


  //tabla
  @Input() objGetFaltaPermisosByParameter: FaltaPermiso[];
  @Input() objGetFaltaPermisosReport: FaltaPermiso[];
  loading: boolean;
  totalRecords: number;
  rows: number;
  pageIndex: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20];



  //
  mes_id_cc: BigInteger | String | number;
  tipo_permiso_id_cc: BigInteger | String | number;
  afecta_rol_id_cc: BigInteger | String | number;

  mensajeSppiner: string = "Cargando...";
  //
  actions: any = { btnGuardar: true, btnMod: false };







  ReportGrafiFPDona: any;
  ReportGrafiFPBarras: any;
  basicData: any;
  ConfigOpcionCharBarra: any;
  multiAxisData: any;
  chartOptions: any;
  multiAxisOptions: any;
  stackedData: any;
  stackedOptions: any;
  horizontalOptions: any;
  subscription: Subscription;
  config: AppConfig;

  /***** */

  constructor(
    private messageService: MessageService,
    private commonService: CommonService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private fb: FormBuilder,
    private perfaltasypermisosService: PerFaltasYPermisosService,
    private primengConfig: PrimeNG,
    // private translateService: TranslateService,
    private configService: AppConfigService,
  ) {
    this.totalRecords = 0;
    this.rows = 5;
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

  }

  ngAfterViewInit(): void {
    // this.translateService.addLangs(['en', 'es', 'fr', 'pt'])
    this.translateChange('es')
  }

  translateChange(lang: string) {
    // this.translateService.use(lang)
    // this.translateService.get('primeng').subscribe((res) => this.primengConfig.setTranslation(res))
  }

  public getInitialDateFrom(): Date {
    return new Date();
  }

  ngOnInit(): void {



    /*graficos */




    this.multiAxisData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'Dataset 1',
        backgroundColor: [
          '#EC407A',
          '#AB47BC',
          '#42A5F5',
          '#7E57C2',
          '#66BB6A',
          '#FFCA28',
          '#26A69A'
        ],
        yAxisID: 'y',
        data: [65, 59, 80, 81, 56, 55, 10]
      }, {
        label: 'Dataset 2',
        backgroundColor: '#78909C',
        yAxisID: 'y1',
        data: [28, 48, 40, 19, 86, 27, 90]
      }]
    };

    this.multiAxisOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        },
        tooltips: {
          mode: 'index',
          intersect: true
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            min: 0,
            max: 100,
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
            color: '#ebedef'
          },
          ticks: {
            min: 0,
            max: 100,
            color: '#495057'
          }
        }
      }
    };

    this.horizontalOptions = {
      indexAxis: 'y',
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };

    this.stackedData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        type: 'bar',
        label: 'Dataset 1',
        backgroundColor: '#42A5F5',
        data: [
          50,
          25,
          12,
          48,
          90,
          76,
          42
        ]
      }, {
        type: 'bar',
        label: 'Dataset 2',
        backgroundColor: '#66BB6A',
        data: [
          21,
          84,
          24,
          75,
          37,
          65,
          34
        ]
      }, {
        type: 'bar',
        label: 'Dataset 3',
        backgroundColor: '#FFA726',
        data: [
          41,
          52,
          24,
          74,
          23,
          21,
          32
        ]
      }]
    };

    this.stackedOptions = {
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      }
    };

    this.config = this.configService.config;



    /*fin */

    this.sld_anio = moment(new Date()).format("YYYY");
    this.faltasAndDescuentosForm.flpr_anio = this.sld_anio;

    this.anio_reporte = this.sld_anio;

    this.vmButtons = [
      {
        orig: "btnsFaltasYPermisos",
        paramAccion: "1",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsFaltasYPermisos",
        paramAccion: "1",
        boton: { icon: "fa fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsFaltasYPermisos",
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
        orig: "btnsFaltasYPermisos",
        paramAccion: "1",
        boton: { icon: "fa fa-trash-o", texto: "ELIMINAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn btn-warning boton btn-sm",
        habilitar: true,
        imprimir: false,
      },
      {
        orig: "btnsFaltasYPermisos",
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
        orig: "btnsFaltasYPermisos",
        paramAccion: "2",
        boton: { icon: "fa fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn btn-primary boton btn-sm",
        habilitar: false,
        imprimir: false,
      },
      {
        orig: "btnsFaltasYPermisos",
        paramAccion: "2",
        boton: { icon: "fa fa-floppy-o", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsFaltasYPermisos",
        paramAccion: "2",
        boton: { icon: "fa fa-trash-o", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn btn-warning boton btn-sm",
        habilitar: true,
        imprimir: false,
      },


      {
        orig: "btnsFaltasYPermisos",
        paramAccion: "3",
        boton: { icon: "fa fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn btn-primary boton btn-sm",
        habilitar: false,
        imprimir: false,
      },
      {
        orig: "btnsFaltasYPermisos",
        paramAccion: "3",
        boton: { icon: "fa fa-floppy-o", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsFaltasYPermisos",
        paramAccion: "3",
        boton: { icon: "fa fa-trash-o", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn btn-warning boton btn-sm",
        habilitar: true
      }

    ];

    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;

    let data = {
      id: 2,
      codigo: myVarGlobals.fFaltasYPermisos,
      id_rol: id_rol
    }

    this.commonService.getPermisionsGlobas(data).subscribe(res => {

      this.permisions = res['data'];

      this.permiso_ver = this.permisions[0].ver;

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

    this.faltasAndDescuentosForm.flpr_fecha_inicio = new Date();
    this.faltasAndDescuentosForm.flpr_fecha_fin = new Date();
    this.vmButtons[1].habilitar = true;

  }


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

  validateForm() {
    return this.formGroupFaltaAndPermiso = this.fb.group({
      fcn_full_nombre_empleado: ["", [Validators.required, Validators.minLength(1)]],
      fcn_flpr_anio: ["", [Validators.required]],
      fcn_mes: ['', [Validators.required]],
      fcn_tipo_permiso: ['', [Validators.required]],
      fcn_afecta_rol: ["", [Validators.required]],
      fnc_flpr_fecha_inicio: ['', [Validators.required/* , this.dateRangeValidator */]],
      fnc_fnc_flpr_fecha_fin: ['', [Validators.required/* , this.dateRangeValidator */]],
      fnc_flpr_num_horas: ['', [Validators.required]],
      fnc_flpr_observacion: [''],
      // flpr_observacion: ['', [Validators.required]],
    });
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
  /*   dateRangeValidator(control: AbstractControl): ValidationErrors {
      if (control.parent != undefined) {
        var from: string = control.parent.get("fnc_flpr_fecha_inicio").value;
        var to: string = control.parent.get("fnc_fnc_flpr_fecha_fin").value;
        if (new Date(from).valueOf() > new Date(to).valueOf()) {
          this.toastr.error("Rango de fechas no permitido.");
          return { matchPassword: false };
        }
        if (new Date(from).valueOf() < new Date(to).valueOf()) {
          return { matchPassword: true };
        }
      }
      return null;
    } */

  // /**
  //  * validar rango
  //  * @returns
  //  */
  // private dateRangeValidator: ValidatorFn = (): {
  //   [key: string]: any;
  // } | null  => {
  //   let invalid = false;
  //   const from = this.formGroupFaltaAndPermiso && this.formGroupFaltaAndPermiso.get("fnc_flpr_fecha_inicio").value;
  //   const to = this.formGroupFaltaAndPermiso && this.formGroupFaltaAndPermiso.get("fnc_fnc_flpr_fecha_fin").value;
  //   if (from && to) {
  //     invalid = new Date(from).valueOf() > new Date(to).valueOf();
  //     console.log(invalid);
  //   }
  //   return invalid ? { invalidRange: { from, to } } : null;
  // };


  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "1GUARDAR":
        this.validaSaveFaltaAndPermiso();
        break;
      case "1CONSULTAR":
        this.consultarFaltaAndPermiso();
        break;
      case "1MODIFICAR":
        this.validaUpdateFaltaAndPermiso();
        break;
      case "1ELIMINAR":
        this.validaDeleteFaltaAndPermiso();
        break;
      case "1CANCELAR":
        this.cancel(1);
        break;
      case "2CONSULTAR":
        this.consultarFaltaAndPermisoReport();
        break;
      case "2EXCEL":
        this.DonwloadReport();
        break;
      case "2LIMPIAR":
        this.ClearSearchReport();
        break;


      case "3CONSULTAR":
        this.consultarReportGrafi();
        break;
      case "3PDF":
        this.DonwloadReport();
        break;
      case "3LIMPIAR":
        this.ClearSearchReport();
        break;
      // case "LIMPIAR":
      // //this.informaciondtlimpiar();
      // break;
    }
  }



  consultarReportGrafi() {


    let motivo = (typeof this.tipo_permiso_id_cc === 'undefined') ? "" : this.tipo_permiso_id_cc;

    let parameterUrl: any = {
      flpr_anio: new Date(this.anio_reporte + '-12-01').getFullYear(),
      id_mes: this.mesConsulta,
      motivo_permiso: motivo
    };

    this.perfaltasypermisosService.getFaltasPermisosEmployeesReportGrafi(parameterUrl).subscribe((res: any) => {

      if (motivo !== "") {

        let labelInfoBar = [];
        let DataSetGrafit = [];

        for (let i = 0; i < res.length; i++) {
          labelInfoBar.push(res[i].mes);
        }



        /*Recorremos el elemento principal que son los  motivos */

        for (let i = 0; i < res.length; i++) {


          if (DataSetGrafit.length > 0) {

            let labelGraf = DataSetGrafit.filter(co => co.label == res[i].motivo);

            if (labelGraf.length > 0) {
              labelGraf[0]['data'].push(res[i].total);
            } else {

              let dataPointGrafit = []

              dataPointGrafit.push(res[i].total);

              DataSetGrafit.push({
                label: res[i].motivo,
                backgroundColor: '#42A5F5',
                data: dataPointGrafit
              })

            }

          } else {

            let dataPointGrafit = []

            dataPointGrafit.push(res[i].total);

            DataSetGrafit.push({
              label: res[i].motivo,
              backgroundColor: '#42A5F5',
              data: dataPointGrafit
            })

          }



          //labelInfoBar.push(res[i].mes);
        }

        this.ReportGrafiFPBarras = {
          labels: labelInfoBar,
          datasets: DataSetGrafit
        };

        this.hidenPastel = true;
        this.hidenBarra = false;

      } else {

        console.log(res);

        let labelInfoDune = [];
        let DataSetGrafitDune = [];

        for (let i = 0; i < res.length; i++) {
          labelInfoDune.push(res[i].motivo);
        }


        let dataPointGrafit = []

        for (let i = 0; i < res.length; i++) {


          dataPointGrafit.push(res[i].total);

/*
          if (DataSetGrafitDune.length > 0) {

            let labelGraf = DataSetGrafitDune.filter(co => co.label == res[i].motivo);

            if (labelGraf.length > 0) {
              labelGraf[0]['data'].push(res[i].total);
            } else {





              DataSetGrafitDune.push({
                label: res[i].motivo,
                backgroundColor: '#42A5F5',
                data: dataPointGrafit
              })

            }

          } else {

            let dataPointGrafit = []

            dataPointGrafit.push(res[i].total);

            DataSetGrafitDune.push({
              label: res[i].motivo,
              backgroundColor: '#42A5F5',
              data: dataPointGrafit
            })

          }*/



          //labelInfoBar.push(res[i].mes);
        }


        this.ReportGrafiFPDona =
        {
          labels: labelInfoDune,
          datasets: [
            {
              data: dataPointGrafit,
              backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#ff5252"
              ],
              hoverBackgroundColor: [
                "#64B5F6",
                "#81C784",
                "#FFB74D",
                "#ee6565"
              ]
            }
          ]
        };

        this.hidenPastel = false;
        this.hidenBarra = true;




      }


    },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.toastr.info(error.error.message);
      }
    );



    /*
  getFaltasPermisosEmployeesReportGrafi(dataOption? :object){

    let flpr_anio = dataOption['flpr_anio'];
    let id_mes = dataOption['id_mes'];
    let motivo_permiso = dataOption['motivo_permiso'];

    // let id_empresa = dataOption['id_empresa'];
    return this.apiService.apiCall(`fault_and_permissions/report_grafi?flpr_anio=${flpr_anio}&id_mes=${id_mes}&motivo_permiso=${motivo_permiso}`, "GETV1", {});

  }*/


  }

  consultarFaltaAndPermisoReport() {

    this.loading = true;

    let parameterUrl: any = {
      id_empleado: this.id_empleado,
      flpr_anio: new Date(this.anio_reporte + '-12-01').getFullYear(),
      id_mes: this.mesConsulta,
      afecta_rol_keyword: 'SROL'
    };

    this.perfaltasypermisosService.getFaltasPermisosEmployeesReport(parameterUrl)
      .subscribe({
        next: (rpt: any) => {

          if (rpt.length > 0) {
            this.vmButtons[6].habilitar = false;
            this.vmButtons[7].habilitar = false;
          }
          this.objGetFaltaPermisosReport = rpt;
          this.loading = false;

        },
        error: (e) => {
          console.log(e);
          this.loading = false;
          this.toastr.error(e?.error?.detail);
        },
      });
  }


  DonwloadReport() {
    //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_faltas_permisos.html?empleado=~NULL~&id_empresa=1&mes=45&anio=2023&id_empleado=0
    window.open(environment.ReportingUrl + "rpt_faltas_permisos.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1&id_empleado=" + this.id_empleado + "&empleado=" + this.empleadoReport + "&mes=" + this.mesConsulta + "&anio=" + this.anio_reporte, '_blank');
  }

  ClearSearchReport() {

    this.vmButtons[6].habilitar = true;
    this.vmButtons[7].habilitar = true;

    this.objGetFaltaPermisosReport = [];

    this.id_empleado = 0;
    this.empleadoReport = "";
    this.mesConsulta = "0";

  }

  /**
   * consultar or parametros
   */
  consultarFaltaAndPermiso() {

    this.loading = true;

    let parameterUrl: any = {
      id_empleado: this.faltasAndDescuentosForm.id_empleado,
      flpr_anio: new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio + '-12-31').getFullYear(),
      id_mes: this.faltasAndDescuentosForm.id_mes,
      page: this.pageIndex,
      size: this.rows,
      sort: 'id_falt_perm',
      type_sort: 'desc'
    };

    this.perfaltasypermisosService.getFaultAndPermissionByParameterAditional(parameterUrl)
      .subscribe({
        next: (rpt: FaltaAndPermisoAditionalResponseI) => {
          this.totalRecords = rpt.total;
          this.objGetFaltaPermisosByParameter = rpt.data;
          //  console.log(rpt.data);
          this.loading = false;

        },
        error: (e) => {
          console.log(e);
          this.loading = false;
          this.toastr.error(e?.error?.detail);
        },
      });
  }

  async validaDeleteFaltaAndPermiso() {
    this.confirmSave(
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


  // convenience getter for easy access to form fields
  get f() { return this.formGroupFaltaAndPermiso.controls; }


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
    this.confirmSave(
      "Seguro desea guardar falta y permiso del empleado?",
      "SAVE_FALTA_AND_PERMISO_EMPLEADO"
    );
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
    this.confirmSave(
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


  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      //icon: "warning",
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
          this.saveFaltaAndPermisoEmpleado();
        } else if (action == "UPDATED_FALTA_AND_PERMISO_EMPLEADO") {
          this.updateFaltaAndPermisoEmpleado();
        } else if (action == "DELETE_FALTA_AND_PERMISO_EMPLEADO") {
          this.deleteFaltaAndPermisoEmpleado();
        }
      }
    });
  }

  /**
   * guardar
   */
  async saveFaltaAndPermisoEmpleado() {
    const idEmp = this.faltasAndDescuentosForm.id_empleado;

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de nueva falta y permisos  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      id_empleado: idEmp,
      flpr_anio: new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio + '-12-31').getFullYear(),
      id_mes: this.mes_id_cc,
      id_tipo_permiso: this.tipo_permiso_id_cc,
      id_afecta_rol: this.afecta_rol_id_cc,
      flpr_fecha_inicio: this.formGroupFaltaAndPermiso.value.fnc_flpr_fecha_inicio,
      flpr_fecha_fin: this.formGroupFaltaAndPermiso.value.fnc_fnc_flpr_fecha_fin,
      flpr_num_horas: this.formGroupFaltaAndPermiso.value.fnc_flpr_num_horas,
      flpr_observacion: this.formGroupFaltaAndPermiso.get('fnc_flpr_observacion').value,
      flpr_estado_id: 'EFPA',
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

  /**
   * actualizar
   */
  async updateFaltaAndPermisoEmpleado() {
    const idEmp = this.faltasAndDescuentosForm.id_empleado;

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de nueva ficha empleado  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,
      id_falt_perm: this.faltasAndDescuentosForm.id_falt_perm,
      id_empleado: idEmp,
      flpr_anio: new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio + '-12-31').getFullYear(),//this.formGroupFaltaAndPermiso.value.fcn_flpr_anio,
      id_mes: this.mes_id_cc,
      id_tipo_permiso: this.tipo_permiso_id_cc,
      id_afecta_rol: this.afecta_rol_id_cc,
      flpr_fecha_inicio: this.formGroupFaltaAndPermiso.value.fnc_flpr_fecha_inicio,
      flpr_fecha_fin: this.formGroupFaltaAndPermiso.value.fnc_fnc_flpr_fecha_fin,
      flpr_num_horas: this.formGroupFaltaAndPermiso.value.fnc_flpr_num_horas,
      flpr_observacion: this.formGroupFaltaAndPermiso.get('fnc_flpr_observacion').value,
      // formatDate(this.inputFechaIngreso.value,'yyyy-MM-dd',"en-US"),
    }
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.perfaltasypermisosService.updatedFaultAndPermission(data).subscribe(
      (res: GeneralResponseI) => {
        // console.log(res);
        this.toastr.success(
          "Datos de falta y permisos actualizados correctamente."
        );

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

  /**
    * borrar
    */
  deleteFaltaAndPermisoEmpleado() {
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
   * Buscar empleado
   */

  onClicConsultaEmpleadosFaltasAndPermisos(content) {

    console.log(this.formGroupFaltaAndPermiso.get('fcn_full_nombre_empleado').value);

    this.ref = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: "not",
        relation_selected: '',
        search: this.formGroupFaltaAndPermiso.value.fcn_full_nombre_empleado,
      },
      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((empleadoData: EmployeesResponseI) => {

      if (empleadoData != undefined) {

        this.faltasAndDescuentosForm.emp_full_nombre = empleadoData.emp_full_nombre;

        this.formGroupFaltaAndPermiso.get("fcn_full_nombre_empleado").setValue(empleadoData.emp_full_nombre);
        this.faltasAndDescuentosForm.id_empleado = empleadoData.id_empleado;
        this.getFaltasPermisos(this.faltasAndDescuentosForm.id_empleado);
        this.vmButtons[1].habilitar = false;
      }

      // this.inputNameEmpFullNombre.nativeElement.value = empleadoData.emp_full_nombre;

      // this.folderDigitalForm.full_nombre_empleado = empleadoData.emp_full_nombre;
      // this.folderDigitalForm.id_empleado = empleadoData.id_empleado;

    });
  }


  onClicConsultaEmpleadosFaltasAndPermisosReport(content) {
    this.ref = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: "not",
        relation_selected: '',
      },
      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((empleadoData: EmployeesResponseI) => {

      // debugger

      if (empleadoData != undefined) {

        this.empleadoReport = empleadoData.emp_full_nombre;
        this.id_empleado = empleadoData.id_empleado;

        //this.ClearSearchReport();

        /*
        this.formGroupFaltaAndPermiso.get("fcn_full_nombre_empleado").setValue(empleadoData.emp_full_nombre);
        this.faltasAndDescuentosForm.id_empleado = empleadoData.id_empleado;
        this.getFaltasPermisos(this.faltasAndDescuentosForm.id_empleado );
        this.vmButtons[1].habilitar = false;*/
      }

    });
  }

  nextPage(event: LazyLoadEvent) {
    let id_emp = this.faltasAndDescuentosForm.id_empleado;
    // console.log(id_emp);
    if (id_emp != 0) {
      this.pageIndex = (event.first / this.rows) + 1;
      this.getFaltasPermisos(id_emp);
    }
    return;
  }

  /**
  *
  * @param ptr_id_empleado
  */
  async getFaltasPermisos(ptr_id_empleado) {

    this.loading = true;
    let parameterUrl: any = {
      id_empleado: ptr_id_empleado,
      page: this.pageIndex,
      size: this.rows,
      sort: 'id_falt_perm',
      type_sort: 'desc'
    };
    //  console.log(parameterUrl);
    this.perfaltasypermisosService.getFaultAndPermissionByParameter(parameterUrl).subscribe({
      next: (rpt: FaltaAndPermisoAditionalResponseI) => {
        this.totalRecords = rpt.total;
        this.objGetFaltaPermisosByParameter = rpt.data;
        //  console.log(rpt.data);
        this.loading = false;
      },
      error: (e) => {
        console.log(e);
        this.loading = false;
      },
    });
  }


  onRowSelectFaltaPermisoEmp(dataFaltaPermiso: FaltaPermiso) {

    // this.actions.btnMod = true;
    // this.actions.btnGuardar = false;

    let dataFP = dataFaltaPermiso.data;
    if( dataFP.estado_falta_permiso.cat_keyword == "EFPR" || dataFP.estado_falta_permiso.cat_keyword == "EFPA" ){
      let msj = this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: 'No se puede editar o borrar porque esta '+dataFP.estado_falta_permiso.cat_nombre/* ,life:300000 */});
      return msj;
    }

    this.faltasAndDescuentosForm = dataFaltaPermiso.data;

    this.faltasAndDescuentosForm.emp_full_nombre = this.faltasAndDescuentosForm.emp_full_nombre;
    this.formGroupFaltaAndPermiso.get("fcn_full_nombre_empleado").setValue(this.faltasAndDescuentosForm.emp_full_nombre);


    this.sld_anio = moment(this.faltasAndDescuentosForm.flpr_anio + '12').format("YYYY");

    this.faltasAndDescuentosForm.flpr_anio = this.sld_anio;

    this.faltasAndDescuentosForm.flpr_fecha_inicio = new Date(this.faltasAndDescuentosForm.flpr_fecha_inicio);
    this.faltasAndDescuentosForm.flpr_fecha_fin = new Date(this.faltasAndDescuentosForm.flpr_fecha_fin);


    this.formGroupFaltaAndPermiso.get('fnc_flpr_observacion').setValue(this.faltasAndDescuentosForm.flpr_observacion);
    this.viewSelectionMesCC(this.faltasAndDescuentosForm.id_mes);
    this.viewSelectionTipoPermisoCC(this.faltasAndDescuentosForm.id_tipo_permiso);
    this.viewSelectionAfectaRolCC(this.faltasAndDescuentosForm.id_afecta_rol);

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = false;

  }


  viewSelectionmesConsulta(responseId: any) {

    this.mesConsulta = responseId;
    //this.ClearSearchReport();

  }


  viewSelectionMesCC(responseId: any) {

    this.mes_id_cc = responseId;
    this.faltasAndDescuentosForm.id_mes = responseId;
    this.formGroupFaltaAndPermiso.get("fcn_mes").setValue(this.mes_id_cc);

    if (this.faltasAndDescuentosForm.id_mes != 0 && this.faltasAndDescuentosForm.id_empleado != 0) {
      this.vmButtons[1].habilitar = false;
    }

  }

  viewSelectionTipoPermisoCC(responseId: any) {
    this.tipo_permiso_id_cc = responseId;
    this.faltasAndDescuentosForm.id_tipo_permiso = responseId;
    this.formGroupFaltaAndPermiso.get("fcn_tipo_permiso").setValue(this.tipo_permiso_id_cc);
  }

  viewSelectionAfectaRolCC(responseId: any) {
    this.afecta_rol_id_cc = responseId;
    this.faltasAndDescuentosForm.id_afecta_rol = responseId;
    this.formGroupFaltaAndPermiso.get("fcn_afecta_rol").setValue(this.afecta_rol_id_cc);
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
    this.formGroupFaltaAndPermiso.get("fcn_flpr_anio").setValue(this.sld_anio);

    this.formGroupFaltaAndPermiso.get("fnc_flpr_num_horas").setValue(0);

    this.formGroupFaltaAndPermiso.value.fnc_flpr_num_horas = 0;
    this.formGroupFaltaAndPermiso.get('fnc_flpr_observacion').setValue('');
    if (dataTable == 1) {
      this.faltasAndDescuentosForm.id_empleado = 0;
      this.formGroupFaltaAndPermiso.get("fcn_full_nombre_empleado").setValue('');
      this.faltasAndDescuentosForm.emp_full_nombre = '';
      this.objGetFaltaPermisosByParameter = [];
      this.vmButtons[1].habilitar = false;
    }

    this.faltasAndDescuentosForm.id_empleado = this.faltasAndDescuentosForm.id_empleado;
    this.formGroupFaltaAndPermiso.get("fcn_full_nombre_empleado").setValue(this.faltasAndDescuentosForm.emp_full_nombre);

    this.actions = { btnGuardar: true, btnMod: false };
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    // console.log(this.faltasAndDescuentosForm);
    this.submitted = false;
  }


  /*reportes graficos */



  applyDarkTheme() {


    this.horizontalOptions = {
      indexAxis: 'y',
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        y: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        }
      }
    };

    this.multiAxisOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        },
        tooltips: {
          mode: 'index',
          intersect: true
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            min: 0,
            max: 100,
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
            color: 'rgba(255,255,255,0.2)'
          },
          ticks: {
            min: 0,
            max: 100,
            color: '#ebedef'
          }
        }
      }
    };

    this.stackedOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        },
        tooltips: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        }
      }
    };
  }



  cambiarEstadoFalataPermisos( data: FaltaPermiso ){
    //console.log(data);
    Swal.fire({
      title: "Atención!!",
      text: "Esta seguro de realizar la acción?",
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "APROBAR FALTA/PERMISO",
      cancelButtonText: "RECHAZAR FALTA/PERMISO",
    }).then((result) => {

      if (result.value) {
        //console.log('aprobado');
        this.aprobarOrRechazarFaltaPermiso(data,'EFPA');
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        // console.log('rechzado');
        this.aprobarOrRechazarFaltaPermiso(data,'EFPR');
      };
    });
  }

  aprobarOrRechazarFaltaPermiso(dataFP: FaltaPermiso, $keywordVacDet)
  {
    const idEmp = dataFP.id_empleado;

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Actualizacion de estado de falta y permisos aprobar o rechazar  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      id_falt_perm : dataFP.id_falt_perm,
      id_empleado: dataFP.id_empleado,
      flpr_anio: dataFP.flpr_anio,
      id_mes:dataFP.id_mes,
      id_tipo_permiso: dataFP.id_tipo_permiso,
      id_afecta_rol: dataFP.id_afecta_rol,
      flpr_fecha_inicio: dataFP.flpr_fecha_inicio,
      flpr_fecha_fin:  dataFP.flpr_fecha_fin,
      flpr_num_horas:  dataFP.flpr_num_horas,
      flpr_observacion:  dataFP.flpr_observacion,
      flpr_estado_id : $keywordVacDet
    }
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.perfaltasypermisosService.statusFaultAndPermission(data).subscribe(
      (res: GeneralResponseI) => {


        this.cancel(0);

        this.getFaltasPermisos(idEmp);
        this.lcargando.ctlSpinner(false);


      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error?.error?.detail);

      }
    );
  }

}
