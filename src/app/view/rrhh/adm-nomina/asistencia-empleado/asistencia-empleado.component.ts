import {  AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { AsistenciaEmpleadoService } from './asistencia-empleado.service';
import * as myVarGlobals from "../../../../global"
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { environment } from 'src/environments/environment';

import * as moment from 'moment'
import Swal from "sweetalert2";
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiaTrabajado, DiaTrabajadoAditionalResponseI } from 'src/app/models/responseDayWorkedAditional.interface';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
//import { TranslateService } from "@ngx-translate/core";
import * as XLSX from 'xlsx';
import { GeneralResponseI } from 'src/app/models/responseGeneral.interface';
import { MatDialog } from '@angular/material/dialog';
import { CcModalListFaltasPermisosComponent } from 'src/app/config/custom/modal-component/cc-modal-list-faltas-permisos/cc-modal-list-faltas-permisos.component';
import { FaltaPermiso } from 'src/app/models/responseFaltasAndPermisosAditional.interfase';
import { GeneralService } from 'src/app/services/general.service';
import { CatalogoNominaResponseI } from 'src/app/models/responseCatalogoNomina.interfase';
import { CatalogoResponseI } from 'src/app/models/responseCatalogo.interface';
import { MatTabChangeEvent } from '@angular/material/tabs';
import Botonera from 'src/app/models/IBotonera';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalProgramaComponent } from '../../beneficios/rol-general/modal-programa/modal-programa.component';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';

ModalProgramaComponent

@Component({
standalone: false,
  selector: 'app-asistencia-empleado',
  templateUrl: './asistencia-empleado.component.html',
  styleUrls: ['./asistencia-empleado.component.scss'],
  styles: [`

  :host ::ng-deep .p-datatable .p-datatable-thead .col-nombre {
      left: 0px;
      position: sticky;
      z-index: 1;
      background-color: #FFFFFF;
  }
`],
  providers: [MessageService, ExcelService]
})
export class AsistenciaEmpleadoComponent implements OnInit {
  @ViewChild(DataTableDirective)

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('fileUpload') fileUpload: ElementRef;

  dataUser: any;
  permiso_ver: any = "0";
  empresLogo: any;
  permisions: any;
  asistencia_empleado: any = [];
  vmButtons: Botonera[] = [];

  DiasTrabajados: any = [];

  mes_actual: any = 0;
  AnioAsistencia: any = 0;

  //------------------------------

  //formulario
  ref: DynamicDialogRef;
  formGroupDiasTrabajados: FormGroup;
  submitted = false;

  //
  mes_id_cc: BigInteger | String | number;

  //
  sld_anio: any;
  //
  diasTrabajadosForm: DiaTrabajado = {
    ditr_anio: 0,
    id_mes: 0,
    id_dia_trabajado: 0,
    id_empresa: 0,
    id_empleado: 0,
    ditr_dias_trabajados: 0,
    ditr_dias_adicionales: 0,
    ditr_horas_en_contra_falta_permisos: 0,
    ditr_dias_efectivos: 0,
    ditr_horas_efectivos: 0,
    ditr_horas_trabajados: 0,
    ditr_horas_adicionales: 0,
    ditr_horas_25: 0,
    ditr_horas_50: 0,
    ditr_horas_60: 0,
    ditr_horas_100: 0,
    ditr_horas_restadas: 0,
    ditr_horas_efectivas: 0,
    ditr_fecha_generacion: undefined,
    estado_id: 0,
    emp_full_nombre: '',
    emp_identificacion: '',
    emp_fecha_ingreso: undefined,
    mes_generar : '',
    id_sueldo : 0,
    sld_salario_minimo : '',
    estado_generacion : '',
    aux:'',
    ditr_modo_generacion: '',
    carga_excel: false,
  };

  //
  btnSubirArchivo: boolean;
  mensajeSppiner: string = "Cargando...";
  //tabla
  @Input() objGetDiasTrabajados: DiaTrabajadoAditionalResponseI | any;//DocFicha[];
  loading: boolean;
  disableHeaderCheckbox: boolean;
  totalRecords: number;
  rows: number;
  pageIndex: number = 1;
  pageSize: number= 5;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  cargaExcel = false;
  disableBotton : boolean = false;
  mesesCatalog : CatalogoResponseI| any;
  //------------------------------

  filter: any = {
    area: 0,
    departamento: 0,
    programa: '',
    fk_programa:0,
    periodo: moment().format('YYYY'),
    mes: null,
  }
  cmb_periodo: any[] = []
  cmb_meses: any[] = []
  periodoSelected: string
  fileName: string | null = null

  //------------------------------

  areas: any = []
  departamentos: any = []
  verNoEncontrados: boolean = false
  empHorasExtraEncontrados: any = []
  empHorasExtraNoEncontrados: any = []

  tipoContratos: any = [];
  tipoContrato: any = 0
  exportList: any = [];
  excelData: any [];

  consultaHorasExtra:boolean = true
  btnSubirArchivoHorasExtra: boolean = true
  cierreMes: boolean = false

  constructor(
    private commonService: CommonService,
    private asistenciadiasempleService: AsistenciaEmpleadoService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private primengConfig: PrimeNG,
    //private translateService: TranslateService,
    private dialogRef: MatDialog,
    private messageService: MessageService,
    private generalService: GeneralService,
    private excelService: ExcelService,
    private modalService: NgbModal,
    private commonVarSrv: CommonVarService,
    private cierremesService: CierreMesService,

    ) {
    this.totalRecords = 0;
    this.rows = 10;
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    // this.mesesCatalogos();

    this.asistenciadiasempleService.importarBotones.subscribe(
      ({modificar, aprobar, eliminar}) => {
        // console.log(!modificar, !aprobar)
        this.vmButtons[6].habilitar = !modificar
        this.vmButtons[7].habilitar = !eliminar
        this.vmButtons[8].habilitar = !aprobar

      }
    )
    this.asistenciadiasempleService.atrasosBotones.subscribe(
      ({modificar, aprobar, eliminar}) => {
        // console.log(!modificar, !aprobar)
        this.vmButtons[11].habilitar = !modificar
        this.vmButtons[12].habilitar = !eliminar
        this.vmButtons[13].habilitar = !aprobar

      }
    )

    this.commonVarSrv.modalProgramArea.subscribe(
      (res)=>{
        console.log(res.id_nom_programa)
        this.filter.programa = res.nombre
        this.filter.fk_programa = res.id_nom_programa
        this.cargarAreas()
      }
    )



    this.vmButtons = [
      // Manual
      { orig: "btnsConsultDiasTrabajados", paramAccion: "0", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsConsultDiasTrabajados", paramAccion: "0", boton: { icon: "fa fa-floppy-o", texto: "APROBAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btns-modificar boton btn-sm", habilitar: false },
      { orig: "btnsConsultDiasTrabajados", paramAccion: "0", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsConsultDiasTrabajados", paramAccion: "0", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true },
      {
        orig: "btnsConsultDiasTrabajados",
        paramAccion: "0",
        boton: { icon: "fa fa-download", texto: "PLANTILLA" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-help boton btn-sm",
        habilitar: false,
      },
      // Importar
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '2',
        boton: { icon: 'fa fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '2',
        boton: { icon: 'fa fa-edit', texto: 'MODIFICAR' },
        clase: 'btn btn-sm btn-info',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '2',
        boton: { icon: 'fas fa-trash-alt', texto: 'ELIMINAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '2',
        boton: { icon: 'fa fa-check', texto: 'APROBAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '2',
        boton: { icon: 'fa fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '3',
        boton: { icon: 'fa fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '3',
        boton: { icon: 'fa fa-edit', texto: 'MODIFICAR' },
        clase: 'btn btn-sm btn-info',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '3',
        boton: { icon: 'fas fa-trash-alt', texto: 'ELIMINAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '3',
        boton: { icon: 'fa fa-check', texto: 'APROBAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '3',
        boton: { icon: 'fa fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '0',
        boton: { icon: 'fa fa-check', texto: 'GENERAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      { orig: 'btnsConsultDiasTrabajados', paramAccion: '0', boton: {icon: 'far fa-trash-alt', texto: 'ELIMINAR'}, clase: 'btn btn-sm btn-danger', permiso: true, habilitar: true, showbadge: false, showimg: true, showtxt: true, },
      { orig: 'btnsConsultDiasTrabajados', paramAccion: '0', boton: {icon: 'far fa-file-excel', texto: 'EXCEL'}, clase: 'btn btn-sm btn-success', permiso: true, habilitar: true, showbadge: false, showimg: true, showtxt: true, },
      { orig: 'btnsConsultDiasTrabajados', paramAccion: '1', boton: {icon: 'far fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true, },
      { orig: 'btnsConsultDiasTrabajados', paramAccion: '1', boton: {icon: 'far fa-eraser', texto: 'CANCELAR'}, clase: 'btn btn-sm btn-danger', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true, },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '0',
        boton: { icon: 'fa fa-edit', texto: 'ACTUALIZAR F/P' },
        clase: 'btn btn-sm btn-info',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: "btnsConsultDiasTrabajados",
        paramAccion: "4",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsConsultDiasTrabajados",
        paramAccion: "4",
        boton: { icon: "far fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConsultDiasTrabajados",
        paramAccion: "4",
        boton: { icon: "fa fa-download", texto: "PLANTILLA HORAS EXTRA" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-help boton btn-sm",
        habilitar: false,
      },
      {
        orig: 'btnsConsultDiasTrabajados',
        paramAccion: '0',
        boton: { icon: 'fa fa-edit', texto: 'ACTUALIZAR H/E' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      { orig: 'btnsConsultDiasTrabajados',
        paramAccion: '4',
        boton: {icon: 'far fa-trash-alt',
        texto: 'ELIMINAR'},
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        habilitar: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
      }

    ];
  }

  ngAfterViewInit(): void {
     // this.translateService.addLangs(['en', 'es', 'fr', 'pt'])
     this.translateChange('es')
  }

  translateChange(lang: string) {
    //this.translateService.use(lang)
    //this.translateService.get('primeng').subscribe((res) => this.primengConfig.setTranslation(res))
  }


  ngOnInit(): void {
    this.sld_anio = moment(new Date()).format("YYYY");
    //this.diasTrabajadosForm.ditr_anio = this.sld_anio;
    // this.diasTrabajadosForm.ditr_anio = Number(moment(new Date()).format("YYYY"));
    // this.deleteDataLclStorage();
    if (localStorage.getItem('objCopyGetDiasTrabajados')) localStorage.removeItem('objCopyGetDiasTrabajados');

    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;

    this.AnioAsistencia = moment(new Date()).format('YYYY');
    this.mes_actual = Number(moment(new Date()).format('MM'));

    let data = {
      id: 2,
      codigo: myVarGlobals.fDiasTrabajados,
      id_rol: id_rol
    }

    this.commonService.getPermisionsGlobas(data).subscribe(res => {

      this.permisions = res['data'];

      this.permiso_ver = this.permisions[0].ver;

      if (this.permiso_ver == "0") {

        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Jornada");
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

    setTimeout(async () => {
      // this.cmb_periodo = await this.asistenciadiasempleService.getPeriodos()
      this.lcargando.ctlSpinner(true)
      await this.cargaInicial()
      this.getTipoContratos()
      this.lcargando.ctlSpinner(false)
    }, 0)

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = true;
    this.btnSubirArchivo= true;
    // this.validateForm();

    this.handleTabChange({index: 0})

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


  validateForm(){
    return this.formGroupDiasTrabajados = this.fb.group({
      // fcn_full_nombre_empleado: ["", [Validators.required, Validators.minLength(1)]],
      fcn_ditr_anio: ["", [Validators.required]],
      fcn_mes: ['', [Validators.required]],
      fcn_nombre_archivo_input : [""/* , [Validators.required] */],
      fcn_arvivo_input : [""/* , [Validators.required] */],

      // fcn_tipo_permiso: ['', [Validators.required]],
      // fcn_afecta_rol: ["", [Validators.required]],
      // fnc_flpr_fecha_inicio: ['', [Validators.required/* , this.dateRangeValidator */]],
      // fnc_fnc_flpr_fecha_fin: ['', [Validators.required/* , this.dateRangeValidator */]],
      // fnc_flpr_num_horas: ['', [Validators.required]],
      // fnc_flpr_observacion:[''],
      // flpr_observacion: ['', [Validators.required]],
    });
  }

  async cargaInicial() {
    try {
      this.mensajeSppiner = "Carga Inicial"
      const resPeriodos = await this.asistenciadiasempleService.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos

      const resMeses = await this.generalService.getCatalogoKeyWork('MES') as any
      console.log(resMeses)
      this.cmb_meses = resMeses.data

    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }


  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "0ELIMINAR":
        this.deleteDiasTrabajados()
        break;
      case "0EXCEL":
        // Exportar listado a Excel
        this.exportExcel()
        break;
      case "0GENERAR":
        this.generarDiasTrabajados();
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-print' ).trigger();
        break;
      case "0CONSULTAR":
        this.getDiasTrabajados();
        // // this.ObtenerDiasTrabajados();
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-excel' ).trigger();
        break;
      case "0APROBAR":
        this.saveGenerarDiasTrabajados();
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-print' ).trigger();
        break;
      case "0PDF":

        let anio;

        if (typeof this.AnioAsistencia == 'string') {
          anio = this.AnioAsistencia;
        } else {
          anio = moment(this.AnioAsistencia).format('YYYY');;
        }

        window.open(environment.ReportingUrl + "rpt_dias_trabajados.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1&anio=" + anio + '&mes=' + this.mes_actual, '_blank')


        //$('#tablaConsultCjChica').DataTable().button( '.buttons-pdf' ).trigger();
        break;
      case "0EXCEL":

        let anioConsulta;

        if (typeof this.AnioAsistencia == 'string') {
          anioConsulta = this.AnioAsistencia;
        } else {
          anioConsulta = moment(this.AnioAsistencia).format('YYYY');;
        }
        window.open(environment.ReportingUrl + "rpt_dias_trabajados.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1&anio=" + anioConsulta + '&mes=' + this.mes_actual, '_blank')

        break;
      case "0PLANTILLA":
        this.descargar_plantilla();
        break;
      case "0ACTUALIZAR F/P":
          this.actualizarFaltasPermisos();
        break;
      case "0ACTUALIZAR H/E":
        this.actualizarHorasExtra();
      break;
      case "2CONSULTAR":
        this.asistenciadiasempleService.importarConsultar.emit();
        break;
      case "2MODIFICAR":
        this.asistenciadiasempleService.importarModificar.emit();
        break;
      case "2ELIMINAR":
        this.asistenciadiasempleService.importarEliminar.emit();
        break;
      case "2APROBAR":
        this.asistenciadiasempleService.importarAprobar.emit();
        break;
      case "2LIMPIAR":
        this.asistenciadiasempleService.importarLimpiar.emit();
        break;
      case "3CONSULTAR":
        this.asistenciadiasempleService.atrasosConsultar.emit();
        break;
      case "3MODIFICAR":
        this.asistenciadiasempleService.atrasosModificar.emit();
        break;
      case "3ELIMINAR":
        this.asistenciadiasempleService.atrasosEliminar.emit();
        break;
      case "3APROBAR":
        this.asistenciadiasempleService.atrasosAprobar.emit();
        break;
      case "3LIMPIAR":
        this.asistenciadiasempleService.atrasosLimpiar.emit();
        break;
      case "1CANCELAR":
        this.asistenciadiasempleService.biometricoCancelar.emit()
        break;
      case "4GUARDAR":
        this.guardarHorasExtra()
        break;
      case "4CONSULTAR":
        this.consultarHorasExtra()
      break;
      case "4ELIMINAR":
        this.validaDeleteHorasExtraEmpleado()
        break;
      case "4PLANTILLA HORAS EXTRA":
        this.descargar_plantilla_horas_extra()
        break;

      default:
        break;
    }
  }

  mesesCatalogos()
  {

    this.generalService.getCatalogoKeyWork('MES')
    .subscribe({
      next: (rpt : CatalogoResponseI|any) => {
        this.mesesCatalog = rpt;
        // rpt.map(function(element){
        //   let mesId = `${element.cat_keyword}`.split("-");
        //   if (mesId[1] > monthActual && anioActual >= yearActual){
        //     return this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: 'No se puede registrar información, con fecha posterior a la fecha actual'/* ,life:300000 */});
        //   }
        // });

      },
      error: (e) => {
        console.log(e);
        this.loading = false;

      },
    });
  }
  /**-----METODOS DE GUARDAR */
  async saveGenerarDiasTrabajados() {


    const fecha = new Date();
    let month = 0;

    const añoActual = fecha.getFullYear();
    const mesActual = fecha.getMonth() + 1;

    // this.mesesCatalog.map(function(element){
    //   console.log(`${element.cat_keyword}`);
    switch (this.filter.mes) {
      case 45:
        month = 1;
        break;
      case 46:
        month = 2;
        break;
      case 47:
        month = 3;
        break;
      case 48:
        month = 4;
        break;
      case 49:
        month = 5;
        break;
      case 50:
        month = 6;
        break;
      case 51:
        month = 7;
        break;
      case 52:
        month = 8;
        break;
      case 53:
        month = 9;
        break;
      case 54:
        month = 10;
        break;
      case 55:
        month = 11;
        break;
      case 56:
        month = 12;
        break;


      default:
      // code block
    }
    // });

    // if (month > mesActual && this.diasTrabajadosForm.ditr_anio >=añoActual){
    //   this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: 'No se puede registrar información, con fecha posterior a la fecha actual'/* ,life:300000 */});
    //   // this.toastr.error(
    //   //   "No se puede registrar información, con fecha posterior a la fecha actual"
    //   // );
    //   return false;
    // }

    // let anioActual = this.diasTrabajadosForm.ditr_anio;
    // let date = new Date()
    // // let day = `${(date.getDate())}`.padStart(2,'0');
    // let monthActual = `${(date.getMonth()+1)}`.padStart(2,'0');
    // let yearActual = date.getFullYear();
    // let aux =0;

    // this.mesesCatalog.map(function(element){
    //   let mesId = `${element.cat_keyword}`.split("-");
    //   if (mesId[1] > monthActual && anioActual >= yearActual){
    //     aux++;
    //     // this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: 'No se puede registrar información, con fecha posterior a la fecha actual'/* ,life:300000 */});
    //     // return false;
    //   }
    // });
    // console.log(aux);
    // this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: 'No se puede registrar información, con fecha posterior a la fecha actual'/* ,life:300000 */});

    //saber si esta debo bloquear el check de cabecera
    let valores = Object.values(this.objGetDiasTrabajados);
    let cont = 0;
    let totalData = valores.length;
    for(let i=0; i< valores.length; i++){
      if(valores[i]['estado_generacion']=="por_generar") cont++;
    }
    if(cont==0){
      return this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: 'Por favor seleccionar al menos un registro..'/* ,life:300000 */});

      // return this.toastr.error("Por favor seleccionar al menos un registro.");
    }


    this.confirmSave(
      "Seguro desea generar dias trabajados para los empleados seleccionados?",
      "SAVE_DIA_TRABAJADOS_EMPLEADO"
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
      // this.processing = false;
      if (result.value) {
        if (action == "SAVE_DIA_TRABAJADOS_EMPLEADO") {
          this.saveListDiasTrbajadosEmpleado();
        }
      }
    });
  }


  async saveListDiasTrbajadosEmpleado() {

    //crear el objeto a enviar---------------------------
    let insertData = [];

    let valores = Object.values(this.objGetDiasTrabajados);
    for(let i=0; i< valores.length; i++){
      // let data = Object.assign(valores[i],this.ingresoDesctForm);
      let data =valores[i];
      if(valores[i]['estado_generacion']=='por_generar'){
        valores[i]['estado_generacion'] = "generada";
        insertData.push(data)
      }
    }

    //---------------------------------------------------


    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de ingreso y desceunto  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      //DATOS
      listGenerar : insertData,

    };
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.asistenciadiasempleService.saveListDiasTrabajados(data).subscribe(
      (res: GeneralResponseI) => {
        if (res.code == 200) {
          this.toastr.success(
            "Datos generados correctamente."
          );
        }
        // this.rerender();
        this.objGetDiasTrabajados = [];
        // this.deleteDataLclStorage();
        if (localStorage.getItem('objCopyGetDiasTrabajados')) localStorage.removeItem('objCopyGetDiasTrabajados');
        this.getDiasTrabajadosOnlyConsult();
        this.lcargando.ctlSpinner(false);
        // this.cancel();
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error.error.detail);
        // console.log(error);
        // this.lcargando.ctlSpinner(false);
        // this.processing = true;
        // this.toastr.info(error.error.message);
      }
    );
  }

  actualizarFaltasPermisos(){

    if(this.filter.periodo ==undefined){
      this.toastr.info('Debe seleccionar un Período');
    }
    else if(this.filter.mes==undefined || this.filter.mes=='' || this.filter.mes==0){
      this.toastr.info('Debe seleccionar un Mes');
    }
    else{

      let data = {
        periodo: Number(this.filter.periodo),
        mes: Number(this.filter.mes)
      }
      this.mensajeSppiner = "Actualizando Faltas y Permisos"
      this.lcargando.ctlSpinner(true);
      this.asistenciadiasempleService.procesarSpActualizaFaltasPermisos(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "La actualización de Faltas y Permisos fue ejecutada con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
         })
        //this.toastr.info('El proceso fue ejecutado con éxito');
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
  }

  actualizarHorasExtra(){

    if(this.filter.periodo ==undefined){
      this.toastr.info('Debe seleccionar un Período');
    }
    else if(this.filter.mes==undefined || this.filter.mes=='' || this.filter.mes==0){
      this.toastr.info('Debe seleccionar un Mes');
    }
    else{

      let data = {
        periodo: Number(this.filter.periodo),
        mes: this.convertirMes()
      }
      this.mensajeSppiner = "Actualizando Horas Extra"
      this.lcargando.ctlSpinner(true);
      this.asistenciadiasempleService.procesarSpActualizaHorasExtra(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "La actualización de Horas Extra fue ejecutada con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
         })
        //this.toastr.info('El proceso fue ejecutado con éxito');
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
  }


  /** metodo de consulta */
  descargar_plantilla(){
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get descargar plantilla ingresos y descuentos rrhh",
      id_controlador: myVarGlobals.fBovedas,
      name_file : 'PlantillaHorasTrabajadas.xlsx'
    };
    console.log(data)

    this.asistenciadiasempleService.getDonwloadFiles(data)
    .subscribe({
      next: (rpt: any) => {
         console.log(rpt);

        const filename = 'PlantillaHorasTrabajadas';
        let dataType = rpt.type;
          let binaryData = [];
          binaryData.push(rpt);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
          if (filename) {
            downloadLink.setAttribute('download', filename);
          }
          document.body.appendChild(downloadLink);
          downloadLink.click()

      },
      error: (e) => {
        console.log(e);
        this.loading = false;
        // this.objGetIngresosDescuento = [];
        // this.dataResponseGeneral = e.error;
        this.toastr.error(e);
      },
    });

  }



  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; }


  padStart(value, length) {
    return (value.toString().length < length) ? this.padStart("0" + value, length) :
      value;
  }

  ObtenerDiasTrabajados() {

    this.lcargando.ctlSpinner(true);

    let anio;

    if (typeof this.AnioAsistencia == 'string') {
      anio = this.AnioAsistencia;
    } else {
      anio = moment(this.AnioAsistencia).format('YYYY');;
    }

    this.asistenciadiasempleService.getDiasTrabjados(anio, this.mes_actual).subscribe(res => {

      this.DiasTrabajados = res;

      this.vmButtons[2].habilitar = false;
      this.vmButtons[3].habilitar = false;

      if (this.DiasTrabajados.length === 0) {

        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = true;

        /*Mensaje de dias no generados */
        Swal.fire({
          title: "Atención!!",
          text: 'No se ha generado los dias trabajados para el periodo seleccionado, Desea Generarlos?',
          //type: "warning",
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar"
        }).then((result) => {
          if (result.value) {
            this.GenerarDiasTrabajados();
          }
        })
      }

      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })


  }

  GenerarDiasTrabajados() {

    this.lcargando.ctlSpinner(true);

    let anio;

    if (typeof this.AnioAsistencia == 'string') {
      anio = this.AnioAsistencia;
    } else {
      anio = moment(this.AnioAsistencia).format('YYYY');;
    }

    let fecha = this.AnioAsistencia + '-' + this.padStart(this.mes_actual, 2) + '-02';
    var date = new Date(fecha);
    var primerDia = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD');
    var ultimoDia = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('YYYY-MM-DD');

    this.asistenciadiasempleService.GenerarDiasTrabajados(1, anio, this.mes_actual, primerDia, ultimoDia).subscribe(res => {
      console.log(res);

      this.DiasTrabajados = res;
      this.vmButtons[2].habilitar = false;
      this.vmButtons[3].habilitar = false;

      if (this.DiasTrabajados.length === 0) {
        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = true;
      }

      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })


  }

  /**
   *
   */

  // convenience getter for easy access to form fields
  get f() { return this.formGroupDiasTrabajados.controls; }

  /* viewSelectionMesCC(responseId: any) {

    this.mes_id_cc = responseId;
    this.diasTrabajadosForm.id_mes = responseId ;
    this.formGroupDiasTrabajados.get("fcn_mes").setValue(this.mes_id_cc);

    if(this.diasTrabajadosForm.id_mes!=0){
      this.vmButtons[0].habilitar = false;
      // this.btnSubirArchivo= false;
    }

    this.deleteDataTable();
    this.deleteDataLclStorage();

  } */



  getDiasTrabajados(event?: LazyLoadEvent){
    // console.log(event)
    if (this.filter.mes == null) return;
    this.cargaExcel = false;
    this.submitted = true;
    // console.log(this.formGroupFaltaAndPermiso.invalid);
    // if (this.formGroupDiasTrabajados.invalid) {
    //   return;
    // }
    // this.formGroupDiasTrabajados.get('fcn_nombre_archivo_input').setValue('');

    // console.log("consultar dias trabajados");
    if(this.filter.programa==undefined || this.filter.programa=='') { this.filter.fk_programa=0 }
    if(this.filter.departamento==null) { this.filter.departamento=0 }
    if(this.filter.area==null) { this.filter.area=0 }
    this.loading = true;
    const first = event?.first ?? 0
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get lista asistencia empleado rrhh",
      id_controlador: myVarGlobals.fBovedas,

      page : (first / this.rows) + 1,
      size : this.rows,
      // sort : 'id_dia_trabajado',
      // type_sort :'asc',
      // sort : 'ditr_modo_generacion',
      // type_sort :'desc',
      search : '',
      ditr_anio : this.filter.periodo,
      id_mes : this.filter.mes,
      id_programa: this.filter.fk_programa,
      id_area: this.filter.area,
      id_departamento: this.filter.departamento,
      id_empresa : 1,

    };
   console.log(data)
  this.lcargando.ctlSpinner(true);
  this.mensajeSppiner = 'Consultando Datos'
  this.asistenciadiasempleService.getOnlyDaysWorkeEmployees(data)
    .subscribe({
      next: (rpt: DiaTrabajadoAditionalResponseI) => {
        console.log(rpt)
        this.lcargando.ctlSpinner(false);

        if (localStorage.getItem('objCopyGetDiasTrabajados')) localStorage.removeItem('objCopyGetDiasTrabajados');
        // let info = rpt.data;
        // console.log(info);
        this.objGetDiasTrabajados = rpt;
        // this.totalRecords = rpt.total

        //saber si esta debo bloquear el check de cabecera
        let valores = Object.values(this.objGetDiasTrabajados);
        let cont = 0;
        let totalData = valores.length ?? 0;
        for(let i=0; i< valores.length; i++){
          if(valores[i]['estado_generacion']=="generada") cont++;
        }
        // console.log('condicion', cont, totalData)
        this.disableHeaderCheckbox = cont==totalData ? true : false;

        // Guardo el objeto como un string
        localStorage.setItem('objCopyGetDiasTrabajados', JSON.stringify(rpt));

        // this.vmButtons[0].habilitar = true;
        // // this.vmButtons[2].habilitar = false;
        // this.vmButtons[3].habilitar = false;
        this.loading = false;
        this.vmButtons[1].habilitar = false;
        this.btnSubirArchivo = cont == totalData;

        if (totalData == 0) {
          this.toastr.info('Presione Generar para cargar datos.', 'No hay datos')
        } else {
          // this.vmButtons[15].habilitar = true
          this.vmButtons[16].habilitar = false  // Eliminar
          this.vmButtons[17].habilitar = false  // Excel
          this.vmButtons[20].habilitar = false  // Actualizar faltas y permisos
          this.vmButtons[24].habilitar = false // Actualizar horas extra
        }

      },
      error: (e) => {
        console.log(e);
        this.loading = false;
        this.lcargando.ctlSpinner(false);

      },
    });
  }
  generarDiasTrabajados(){
    this.cargaExcel = false;
    this.submitted = true;

    if(this.filter.programa==undefined || this.filter.programa=='') { this.filter.fk_programa=0 }
    if(this.filter.departamento==null) { this.filter.departamento=0 }
    if(this.filter.area==null) { this.filter.area=0 }
    this.loading = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get lista asistencia empleado rrhh",
      id_controlador: myVarGlobals.fBovedas,

      page : this.pageIndex,
      size : this.rows,
      // sort : 'id_dia_trabajado',
      // type_sort :'asc',
      // sort : 'ditr_modo_generacion',
      // type_sort :'desc',
      search : '',
      ditr_anio : this.filter.periodo,
      id_mes : this.filter.mes,
      id_empresa : 1,
      id_programa: this.filter.fk_programa,
      id_area: this.filter.area,
      id_departamento: this.filter.departamento,

    };
      let datos = {
        "anio": this.filter.periodo,
        "mes": this.convertirMes()
      }

      this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {
      console.log(res["data"][0].estado)
      /* Validamos si el periodo se encuentra aperturado */
      if (res["data"][0].estado !== 'C') {
        console.log("Mes Aperturado")
        this.lcargando.ctlSpinner(true);
        this.mensajeSppiner = 'Generando Datos'

        this.asistenciadiasempleService.getDaysWorkedCalculateEmployees(data)
        .subscribe({
          next: (rpt: DiaTrabajadoAditionalResponseI) => {
            this.lcargando.ctlSpinner(false);
            console.log(rpt)
            if (localStorage.getItem('objCopyGetDiasTrabajados')) localStorage.removeItem('objCopyGetDiasTrabajados');

            this.getDiasTrabajados();

            //saber si esta debo bloquear el check de cabecera
            let valores = Object.values(this.objGetDiasTrabajados);
            let cont = 0;
            let totalData = valores.length;
            for(let i=0; i< valores.length; i++){
              if(valores[i]['estado_generacion']=="generada") cont++;
            }
            this.disableHeaderCheckbox = cont==totalData ? true : false;
            this.loading = false;
            this.vmButtons[1].habilitar = false;
            this.vmButtons[16].habilitar = false
            this.vmButtons[17].habilitar = false
            this.btnSubirArchivo = cont==totalData ? true : false;

          },
          error: (e) => {
            console.log(e);
            this.loading = false;
            this.lcargando.ctlSpinner(false);

          },
        });

      } else {
        console.log("Mes Cerrado")
        this.loading = false;
        this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
        this.lcargando.ctlSpinner(false);
      }

      }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
      })
  }

  nextPage(event: LazyLoadEvent) {

  }


  /**
   * subir archivo
   */
  dataExcel = Array();
  handleFileInputPlantillaAsistenciasDiasTrabajados(file: FileList, $event) {
    console.log($event);
    // console.log(this.fileToUpload);
    const selectedFile = file.item(0);
    this.fileName = selectedFile.name
    // this.formGroupDiasTrabajados.get('fcn_nombre_archivo_input').setValue( selectedFile.name);
    let reader = new FileReader();
    reader.readAsBinaryString(selectedFile);
    reader.onload = (event: any) =>{
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData,{
        type :'binary'
      });

      workbook.SheetNames.forEach(element => {
        this.dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[element]);
        console.log(this.dataExcel);
      });

      const arrayVacio = (arr) => !Array.isArray(arr) || arr.length === 0;//array vacio retorna TRUE , array lleno FALSE

      if(!arrayVacio(this.dataExcel)){
        this.subirDataExcel(this.dataExcel, $event);
        // se envia peticion paa llenar la tabla
        // this.geEmpleadosListaVerificada(this.dataExcel);
      }

    }
  }


  subirDataExcel(dataExcel, $event)
  {
    Swal.fire({
      title: "Atención!!",
      text: "Esta seguro de subir la información de la plantilla cargada?",
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      // this.processing = false;
      // this.deleteDataTable();
      if (result.value) {
        // console.log(dataExcel);
        this.saveWorkedTemplate(dataExcel);
        $event.target.value = "";
        // if (action == "SAVE_INGRESO_DESCUENTO_EMPLEADO") {
        //   this.saveIngresoDescuentoEmpleado();
        // } else if (action == "UPDATED_INGRESO_DESCUENTO_EMPLEADO") {
        //   this.updateIngresoDescuentoEmpleado();
        // } else if (action == "DELETE_INGRESO_DESCUENTO_EMPLEADO") {
        //   this.deleteIngresoDescuentoEmpleado();
        // }
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        // this.formGroupDiasTrabajados.get('fcn_nombre_archivo_input').setValue('');
        $event.target.value = "";

        Swal.fire(
          'Cancelada',
          'Archivo borrado.Por favor subir nueva pantilla.)',
          'error'
        )
      };
    });
  }
  //

  saveWorkedTemplate(dataExcel)
  {

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Creación de ingreso y desceunto  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      //DATOS
      id_mes :  this.filter.mes,
      id_empresa : 1,
      anio :   this.filter.periodo,
      data_template : dataExcel,


    };
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.asistenciadiasempleService.saveTemplateDayWorked(data).subscribe(
      (res: GeneralResponseI) => {
        if (res.code == 200) {
          this.toastr.success(
            "Datos de plantilla guardados correctamente."
          );
        }
        this.cargaExcel = true;
        this.deleteDataTable();
        this.getDiasTrabajadosOnlyConsult();

        // this.rerender();
        this.lcargando.ctlSpinner(false);
        // this.cancel();
      },
      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error.error?.detail ?? error.error?.message);
        // this.lcargando.ctlSpinner(false);
        // this.processing = true;
        // this.toastr.info(error.error.message);
      }
    );
  }

  calcDiasTrabajados(data: DiaTrabajado) {
    const diasTrabajados = data.ditr_dias_trabajados;
    if (diasTrabajados == null) return data.ditr_dias_trabajados = 0;

    const objCopyGetDiasTrabajados = localStorage.getItem('objCopyGetDiasTrabajados')
    let valores = Object.values(JSON.parse(objCopyGetDiasTrabajados));

    for(let i = 0; i < valores.length; i++) {
      if (valores[i]['id_dia_trabajado'] == data.id_dia_trabajado) {
        const horasTrabajadas = data.ditr_dias_trabajados * 8;
        const horasEfectivas = horasTrabajadas + Number(data.ditr_horas_25 ?? 0) + Number(data.ditr_horas_50 ?? 0) + Number(data.ditr_horas_60 ?? 0) + Number(data.ditr_horas_100 ?? 0)
        Object.assign(data, {
          ditr_horas_trabajados: horasTrabajadas,
          ditr_horas_efectivas: horasEfectivas,
          ditr_dias_efectivos: Math.floor(horasEfectivas / 8),
          ditr_horas_efectivos: Math.ceil(horasEfectivas % 8)
        })
        return data.ditr_dias_trabajados
      }
    }
  }

  horas25(data:DiaTrabajado) {

    let  horas25 = data.ditr_horas_25;
    if(horas25 == ''||horas25 == null) horas25 = 0;

    // const objCopyGetDiasTrabajados = this.getDataLclStorage();
    const objCopyGetDiasTrabajados = localStorage.getItem('objCopyGetDiasTrabajados');
    let valores = Object.values(JSON.parse(objCopyGetDiasTrabajados));

    for(let i=0; i< valores.length; i++){
      if(valores[i]['id_dia_trabajado']==data.id_dia_trabajado)
      {
        console.log(data);
        const horasEfectivas = Number(data.ditr_horas_trabajados) + Number(horas25) + Number(data.ditr_horas_50) + Number(data.ditr_horas_60) + Number(data.ditr_horas_100)
        Object.assign(data, {
          ditr_horas_efectivas: horasEfectivas,
          ditr_dias_efectivos: Math.floor(horasEfectivas / 8),
          ditr_horas_efectivos: Math.ceil(horasEfectivas % 8)
        })
        // let rptHora = Number(valores[i]['ditr_horas_efectivas'] + horas25 + data.ditr_horas_50 + data.ditr_horas_100 ) ;
        return data.ditr_horas_efectivas;
        // console.log(valores[i]['ditr_horas_25'],valores[i]['ditr_horas_efectivas']);
        // return data.ditr_horas_efectivas = Number(valores[i]['ditr_horas_25']+valores[i]['ditr_horas_50']+valores[i]['ditr_horas_100']+ valores[i]['ditr_horas_efectivas']) ;
      }

    }

    // let sumaHora = Number(data.ditr_horas_efectivas) + Number(horas25) /* + Number(data.ditr_horas_50) + Number(data.ditr_horas_100) */;
    // return data.ditr_horas_efectivas = sumaHora;
  }

  horas50(data:DiaTrabajado) {

    let  horas50 = data.ditr_horas_50;
    if(horas50 == ''||horas50 == null) horas50 = 0;

    // const objCopyGetDiasTrabajados = this.getDataLclStorage();
    const objCopyGetDiasTrabajados = localStorage.getItem('objCopyGetDiasTrabajados');
    let valores = Object.values(JSON.parse(objCopyGetDiasTrabajados));
    for(let i=0; i< valores.length; i++){
      if(valores[i]['id_dia_trabajado']==data.id_dia_trabajado)
      {
        console.log(data);
        const horasEfectivas = Number(data.ditr_horas_trabajados) + Number(data.ditr_horas_25) + Number(horas50) + Number(data.ditr_horas_60) + Number(data.ditr_horas_100)
        Object.assign(data, {
          ditr_horas_efectivas: horasEfectivas,
          ditr_dias_efectivos: Math.floor(horasEfectivas / 8),
          ditr_horas_efectivos: Math.ceil(horasEfectivas % 8)
        })
        // let rptHora = Number(valores[i]['ditr_horas_efectivas'] + data.ditr_horas_25 + horas50 + data.ditr_horas_100) ;
        return data.ditr_horas_efectivas;
        // return data.ditr_horas_efectivas = Number(valores[i]['ditr_horas_25']+valores[i]['ditr_horas_50']+valores[i]['ditr_horas_100']+ valores[i]['ditr_horas_efectivas']) ;
      }

    }

    // let sumaHora = Number(data.ditr_horas_efectivas) /* + Number(data.ditr_horas_25) */ + Number(horas50) /* + Number(data.ditr_horas_100) */;
    // return data.ditr_horas_efectivas = sumaHora;
  }
  horas60(data:DiaTrabajado) {

    let  horas60 = data.ditr_horas_60;
    if(horas60 == ''||horas60 == null) horas60 = 0;

    // const objCopyGetDiasTrabajados = this.getDataLclStorage();
    const objCopyGetDiasTrabajados = localStorage.getItem('objCopyGetDiasTrabajados');
    let valores = Object.values(JSON.parse(objCopyGetDiasTrabajados));
    for(let i=0; i< valores.length; i++){
      if(valores[i]['id_dia_trabajado']==data.id_dia_trabajado)
      {
        console.log(data);
        const horasEfectivas = Number(data.ditr_horas_trabajados) + Number(data.ditr_horas_25) + Number(data.ditr_horas_50) + Number(horas60) + Number(data.ditr_horas_100)
        Object.assign(data, {
          ditr_horas_efectivas: horasEfectivas,
          ditr_dias_efectivos: Math.floor(horasEfectivas / 8),
          ditr_horas_efectivos: Math.ceil(horasEfectivas % 8)
        })
        // let rptHora = Number(valores[i]['ditr_horas_efectivas'] + data.ditr_horas_25 + horas60 + data.ditr_horas_100) ;
        return data.ditr_horas_efectivas
        // return data.ditr_horas_efectivas = Number(valores[i]['ditr_horas_25']+valores[i]['ditr_horas_50']+valores[i]['ditr_horas_100']+ valores[i]['ditr_horas_efectivas']) ;
      }

    }

    // let sumaHora = Number(data.ditr_horas_efectivas) /* + Number(data.ditr_horas_25) */ + Number(horas50) /* + Number(data.ditr_horas_100) */;
    // return data.ditr_horas_efectivas = sumaHora;
  }


  horas100(data:DiaTrabajado) {

    let  horas100 = data.ditr_horas_100;
    if(horas100 == ''||horas100 == null) horas100 = 0;

    // const objCopyGetDiasTrabajados = this.getDataLclStorage();
    const objCopyGetDiasTrabajados = localStorage.getItem('objCopyGetDiasTrabajados');
    let valores = Object.values(JSON.parse(objCopyGetDiasTrabajados));
    for(let i=0; i< valores.length; i++){
      if(valores[i]['id_dia_trabajado']==data.id_dia_trabajado)
      {
        console.log(data);
        const horasEfectivas = Number(data.ditr_horas_trabajados) + Number(data.ditr_horas_25) + Number(data.ditr_horas_50) + Number(data.ditr_horas_60) + Number(horas100)
        Object.assign(data, {
          ditr_horas_efectivas: horasEfectivas,
          ditr_dias_efectivos: Math.floor(horasEfectivas / 8),
          ditr_horas_efectivos: Math.ceil(horasEfectivas % 8)
        })
        // let rptHora = Number(valores[i]['ditr_horas_efectivas'] + data.ditr_horas_25 + data.ditr_horas_50 + horas100) ;
        return data.ditr_horas_efectivas ;
        // return data.ditr_horas_efectivas = Number(valores[i]['ditr_horas_25']+valores[i]['ditr_horas_50']+valores[i]['ditr_horas_100']+ valores[i]['ditr_horas_efectivas']) ;
      }

    }

    // let sumaHora =  Number(data.ditr_horas_efectivas) /* + Number(data.ditr_horas_25) + Number(data.ditr_horas_50) */ + Number(horas100);
    // return data.ditr_horas_efectivas = sumaHora;

  }


  getDiasTrabajadosOnlyConsult(){
    // this.cargaExcel = true;
    this.submitted = true;
    // console.log(this.formGroupFaltaAndPermiso.invalid);
    // if (this.formGroupDiasTrabajados.invalid) {
    //   return;
    // }
    console.log("consultar dias trabajados");
    this.loading = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get lista asistencia empleado rrhh",
      id_controlador: myVarGlobals.fBovedas,

      page : this.pageIndex,
      size : this.rows,
      // sort : 'id_dia_trabajado',
      // type_sort :'asc',
      // sort : 'ditr_modo_generacion',
      // type_sort :'desc',
      search : '',
      ditr_anio : this.filter.periodo,
      id_mes : this.filter.mes,
      id_empresa : 1,

    };

  this.asistenciadiasempleService.getOnlyDaysWorkeEmployees(data)
    .subscribe({
      next: (rpt: DiaTrabajadoAditionalResponseI) => {
        console.log(rpt)
        // console.log(info);
        this.objGetDiasTrabajados = rpt;
        // this.vmButtons[0].habilitar = true;
        // // this.vmButtons[2].habilitar = false;
        // this.vmButtons[3].habilitar = false;
        this.loading = false;
        this.vmButtons[1].habilitar = false;
        this.btnSubirArchivo= false;

      },
      error: (e) => {
        console.log(e);
        this.loading = false;

      },
    });
  }


/*   isRowSelectable(event) {
    return !this.isOutOfStock(event.data);
}

isOutOfStock(data) {
    return data.inventoryStatus === 'OUTOFSTOCK';
}
 */

  selectRow(checkValue:DiaTrabajado|any, event) {

    //check de cabecera
    if(checkValue && checkValue.estado_generacion == undefined){
      if(checkValue.checked == true){

        let valores = Object.values(this.objGetDiasTrabajados);

        for(let i=0; i< valores.length; i++){



          if(this.cargaExcel == false){//carga normal
            valores[i]['estado_generacion'] = (valores[i]['estado_generacion']=="generada") ? "generada" : "por_generar";
          }else if(this.cargaExcel == true && valores[i]['ditr_modo_generacion'] != 'Automática'){//carga excel
            valores[i]['estado_generacion'] = 'por_generar';
          }
        }
        // console.log(valores);
        return valores;

        // return this.objGetDiasTrabajados.estado_generacion = "por_generar";
      }else{
        let valores = Object.values(this.objGetDiasTrabajados);
        for(let i=0; i< valores.length; i++){

          valores[i]['estado_generacion'] = (valores[i]['estado_generacion']=="generada") ? "generada" : "no_generado";
        }
        // console.log(valores);
        return valores;
        // return this.objGetDiasTrabajados.estado_generacion = "no_generado";
      }

    }

    //let valorCheck = event.target.ariaChecked;
    console.log(event.target.ariaChecked)
    let valorCheck;
    //if(event.explicitOriginalTarget.attributes[2]!=undefined){
    if(event.target.ariaChecked){
       //valorCheck =event.explicitOriginalTarget.attributes[2].nodeValue;
       valorCheck =event.target.ariaChecked;
    }else{
       valorCheck =null;
    }
    console.log(this.cargaExcel);
    //check individual
    if(this.cargaExcel == false){

      if( valorCheck == true || valorCheck == 'true' ){
        checkValue.estado_generacion = 'por_generar';
      }else if( valorCheck == null || valorCheck == 'null' || valorCheck == false || valorCheck == 'false' ){
        checkValue.estado_generacion = 'no_generado';
      }
    console.log(valorCheck)

    }else if(this.cargaExcel == true){
      if( valorCheck == true || valorCheck == 'true' ){
        checkValue.estado_generacion = 'por_generar';
      }else if( valorCheck == null || valorCheck == 'null' || valorCheck == false || valorCheck == 'false' ){
        checkValue.estado_generacion = 'no_generado';
      }
      console.log(valorCheck)
    }
    console.log(valorCheck)

  }

  deleteDataTable(){
    return this.objGetDiasTrabajados = [];
  }

  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }


  getModalFaltasPermisos(dtDiaTrabajado :DiaTrabajado,dataFaltaPermisos :FaltaPermiso){

    let valores = Object.values(dataFaltaPermisos);
    let totalHFP = 0;
    for(let i=0; i< valores.length; i++){
      totalHFP = Number(valores[i]['flpr_num_horas'] + totalHFP);
    }

    let dialogRefs = this.dialogRef.open(CcModalListFaltasPermisosComponent, {
      data:{
        emp_full_nombre: dtDiaTrabajado.emp_full_nombre,
        emp_identificacion :dtDiaTrabajado.emp_identificacion,
        faltas_permisos : dataFaltaPermisos,
        totalHorasFaltasPermisos : totalHFP,
      },
      // panelClass: 'custom-modalbox'
      // hasBackdrop: false
    });
    dialogRefs.afterClosed().subscribe(result=>{
      console.log(`Dialogo resultado: ${result}`);
    });

  }

  getFaltasPermisosAfectanRolConsult(dataPtr:DiaTrabajado ){


    // this.loading = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get lista faltas y permisos q si afectan rol del empleado rrhh",
      id_controlador: myVarGlobals.fBovedas,

      id_empleado : dataPtr.id_empleado,
      flpr_anio : dataPtr.ditr_anio,
      id_mes : dataPtr.id_mes,
      afecta_rol_keyword :'SROL',//'SROL-NROL',
      // id_empresa : 1,

    };
    this.mensajeSppiner = "Consultando...";
    this.lcargando.ctlSpinner(true);
    this.asistenciadiasempleService.getFaltasPermisosEmployees(data)
      .subscribe({
        next: (rpt: FaltaPermiso) => {

          // console.log(rpt);
          this.getModalFaltasPermisos(dataPtr, rpt);
          this.lcargando.ctlSpinner(false);
          // let info = rpt.data;
          // // console.log(info);
          // this.objGetDiasTrabajados = info;
          // // this.vmButtons[0].habilitar = true;
          // // // this.vmButtons[2].habilitar = false;
          // // this.vmButtons[3].habilitar = false;
          // this.loading = false;
          // this.vmButtons[1].habilitar = false;
          // this.btnSubirArchivo= false;

        },
        error: (e) => {

          this.loading = false;
          this.lcargando.ctlSpinner(false);
          console.log(e);

        },
    });

  }

  handleTabChange({index}) {
    console.log(index)
    this.vmButtons.forEach((element: Botonera) => {
      element.showimg = element.paramAccion == index
    });
  }

  onSubmit() {
    console.log('onSubmit')
  }

  habilitarConsulta() {
    this.vmButtons[0].habilitar = false

    this.deleteDataTable();
    // this.deleteDataLclStorage();
    if (localStorage.getItem('objCopyGetDiasTrabajados')) localStorage.removeItem('objCopyGetDiasTrabajados');
  }

  resetInput() {
    // Limpia el valor seleccionado para que el cambio se dispare siempre
    this.fileUpload.nativeElement.value = null;

    // Dispara el evento de clic en el elemento de entrada de archivo original
    this.fileUpload.nativeElement.click();
  }

  exportExcel() {
    let excelData = [];
    this.objGetDiasTrabajados.forEach((item: any) => {
      const data = {
        Estado: item.estado_generacion,
        Empleado: item.emp_full_nombre,
        Identificacion: item.emp_identificacion,
        FechaIngreso: moment(item.emp_fecha_ingreso).format('YYYY-MM-DD'),
        DiasTrabajados: item.ditr_dias_trabajados,
        HorasTrabajadas: item.ditr_horas_trabajados,
        DiasFaltaPermisos: item.ditr_horas_en_contra_falta_permisos,
        HorasExtra25: item.ditr_horas_25,
        HorasExtra50: item.ditr_horas_50,
        HorasExtra60: item.ditr_horas_60,
        HorasExtra100: item.ditr_horas_100
      }
      excelData.push(data)
    })
    this.excelService.exportAsExcelFile(excelData, 'RepDiasTrabajados');
  }

  async deleteDiasTrabajados() {


    let data = {
      "anio": this.filter.periodo,
      "mes": this.convertirMes()
    }

      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
        try {
          if (res["data"][0].estado !=='C') {
            if(this.filter.programa==undefined || this.filter.programa=='') { this.filter.fk_programa=0 }
            if(this.filter.departamento==null) { this.filter.departamento=0 }
            if(this.filter.area==null) { this.filter.area=0 }
            const result = await Swal.fire({
              titleText: 'Eliminar Dias Trabajados',
              text: 'Esta seguro/a desea eliminar los dias trabajados para este perido?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Eliminar',
              cancelButtonText: 'Cancelar'
            })

            if (result.isConfirmed) {
              try {
                this.lcargando.ctlSpinner(true)
                const response = await this.asistenciadiasempleService.deleteDiasTrabajados(this.filter.periodo, this.filter.mes,this.filter.fk_programa,this.filter.area,this.filter.departamento) as any;
                console.log(response)
                this.lcargando.ctlSpinner(false)
                Swal.fire(response.message, '', 'success').then(() => this.deleteDataTable())
                this.vmButtons[20].habilitar = true
              } catch (err) {
                console.log(err)
                this.toastr.error(err.error?.message, 'Error eliminando Dias Trabajados')
              }
            }
          } else {

            this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
            this.lcargando.ctlSpinner(false);
          }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });









      if(this.cierreMes){
       this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
      }else{


      }


  }

  modalPrograma(){
    let modal = this.modalService.open(ModalProgramaComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  cargarAreas() {
    this.mensajeSppiner = "Cargando listado de Áreas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      fk_programa: this.filter.fk_programa
    }

    this.asistenciadiasempleService.getAreas(data).subscribe(
      (res: any) => {
        console.log(res);
        this.areas = res.data
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  cargarDepartamentos(event) {
    this.mensajeSppiner = "Cargando listado de Departamentos...";
    this.lcargando.ctlSpinner(true);

    let data = {
      id_area: this.filter.area
    }

    this.asistenciadiasempleService.getDepartamentos(data).subscribe(
      (res: any) => {
        console.log(res);
        this.departamentos = res
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }
  getTipoContratos(){
    let data = {
      valor_cat: 'TCC',
    }
    this.asistenciadiasempleService.getTipoContratos(data).subscribe((result: any) => {
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

  // descargar_plantilla_horas_extra() {

  //   let data = {
  //     // info: this.areaForm,
  //     ip: this.commonService.getIpAddress(),
  //     accion: "get descargar plantilla horas extras rrhh",
  //     id_controlador: myVarGlobals.fBovedas,
  //   };

  //   this.asistenciadiasempleService.getPlantilla(data)
  //     .subscribe({
  //       next: (rpt: any) => {
  //         console.log(rpt);

  //         const filename = 'PlantillaHorasExtras';
  //         let dataType = rpt.type;
  //         let binaryData = [];
  //         binaryData.push(rpt);
  //         let downloadLink = document.createElement('a');
  //         downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
  //         if (filename) {
  //           downloadLink.setAttribute('download', filename);
  //         }
  //         document.body.appendChild(downloadLink);
  //         downloadLink.click()

  //       },
  //       error: (e) => {
  //         console.log(e);
  //         this.loading = false;
  //         // this.objGetIngresosDescuento = [];
  //         // this.dataResponseGeneral = e.error;
  //         // this.toastr.error(this.dataResponseGeneral.detail);
  //       },
  //     });

  // }

  descargar_plantilla_horas_extra() {

    if(this.filter.programa==undefined || this.filter.programa=='') { this.filter.fk_programa=0 }
    if(this.filter.departamento==null) { this.filter.departamento=0 }
    if(this.filter.area==null) { this.filter.area=0 }

      let data = {
        params: {
          programa: this.filter.fk_programa,
          area: this.filter.area,
          departamento: this.filter.departamento,
          tipo_contrato: 0,
        }
      }
      this.asistenciadiasempleService.getPlantilla(data).subscribe(
        (res)=>{
          console.log(res);
          this.exportList = res
          this.excelData = [];
          // if (this.permisions[0].ver== "0") {

          //   this.toastr.info("Usuario no tiene permiso para exportar");
          // } else {
            Object.keys(this.exportList).forEach(key => {
              console.log()
              let filter_values = {};
              filter_values['cedula'] = (this.exportList[key].emp_identificacion != null) ? this.exportList[key].emp_identificacion.trim() : "";
              filter_values['nombres'] = (this.exportList[key].emp_full_nombre != null) ? this.exportList[key].emp_full_nombre.trim() : "";
              filter_values['departamento'] = (this.exportList[key].departamento?.dep_nombre != null) ? this.exportList[key].departamento?.dep_nombre.trim() : "";
              filter_values['tipo_contrato'] = (this.exportList[key].sueldo?.tipo_contrato?.cat_nombre != null) ? this.exportList[key].sueldo?.tipo_contrato?.cat_nombre.trim() : "";
              filter_values['horas_extra_25'] = 0
              filter_values['horas_extra_50'] = 0
              filter_values['horas_extra_60'] = 0
              filter_values['horas_extra_100'] = 0

              this.excelData.push(filter_values);
            })
            this.exportAsXLSX();
          //}
        }
      )
    //}



  }
  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Plantilla de Horas Extra');
  }

  handleFileInputPlantillaAsHorasExtra(file: FileList, $event) {

    console.log($event);
    // console.log(this.fileToUpload);
    const selectedFile = file.item(0);
    this.fileName = selectedFile.name
    // this.formGroupDiasTrabajados.get('fcn_nombre_archivo_input').setValue( selectedFile.name);
    let reader = new FileReader();
    reader.readAsBinaryString(selectedFile);
    reader.onload = (event: any) =>{
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData,{
        type :'binary'
      });

      workbook.SheetNames.forEach(element => {
        this.dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[element]);
        console.log(this.dataExcel);
      });

      const arrayVacio = (arr) => !Array.isArray(arr) || arr.length === 0;//array vacio retorna TRUE , array lleno FALSE

      if(!arrayVacio(this.dataExcel)){
        this.subirDataExcelHorasExtra(this.dataExcel, $event);
        // se envia peticion paa llenar la tabla
        // this.geEmpleadosListaVerificada(this.dataExcel);
      }

    }


  }
  subirDataExcelHorasExtra(dataExcel, $event)
  {
    Swal.fire({
      title: "Atención!!",
      text: "Esta seguro de subir la información de la plantilla cargada?",
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      // this.processing = false;
      // this.deleteDataTable();
      if (result.value) {
        // console.log(dataExcel);
        this.verificarHorasExtraTemplate(dataExcel);
        $event.target.value = "";
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        $event.target.value = "";

        Swal.fire(
          'Cancelada',
          'Archivo borrado.Por favor subir nueva pantilla.)',
          'error'
        )
      };
    });
  }

  verificarHorasExtraTemplate(dataExcel)
  {

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "get lista horas extra  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      //DATOS
      id_mes :  this.filter.mes,
      id_empresa : 1,
      anio :   this.filter.periodo,
      data_template : dataExcel,


    };
    this.mensajeSppiner = "Verificando empleados...";
    this.lcargando.ctlSpinner(true);
    this.asistenciadiasempleService.verificarHorasExtra(data).subscribe(

     (res) =>{
      console.log(res)
      this.verNoEncontrados = true;
      this.empHorasExtraEncontrados = res[0].encontrados;

      // this.empleadosHorasExtra.forEach((element: any) => {
      //   Object.assign(element, {cuenta_id: this.cuentaContable?.id, cuenta_codigo: this.cuentaContable?.codigo, cuenta_nombre: this.cuentaContable?.nombre})
      // })
      this.empHorasExtraNoEncontrados = res[0].noencontrados;
      this.lcargando.ctlSpinner(false);
      console.log(res);
      this.loading = false;

      //this.formGroupIngresoDescuento.get('fcn_archivo_input').reset();
     },

      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error.error?.detail ?? error.error?.message);

      }
    );
  }
  onColumnEditComplete(value, model) {
    if (value != 0 || value != '0' || value.value != '') {
      // return model.indc_valor_solicitado = parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');  // 12,345.67
      return model.horas_extra = (parseFloat(value).toFixed(2));
    }

    return "0.00";
  }

  deleteDataHorasExtra(data) {
    console.log(data.id_ing_desc);
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
        const index: number = this.empHorasExtraEncontrados.indexOf(data);//get index by passing the concern row data
        //se borra en base el registro
        if (data.id_horas_extra != 0 && data.id_horas_extra != undefined) {
          this.deleteOneHorasExtra(data.id_horas_extra, index)
        }


        if (data.id_ing_desc == undefined || data.id_ing_desc == 0) {
          if (index !== -1) {
            this.empHorasExtraEncontrados.splice(index, 1);
          }
        }

      }
    });
  }

  guardarHorasExtra(){
console.log(this.filter.mes)

    let regValoresCeroNegativo = this.empHorasExtraEncontrados.filter(e => e.horas_extra_25 <= 0 && e.horas_extra_50 <= 0 && e.horas_extra_60 <= 0 && e.horas_extra_100 <= 0)

    if(this.filter.mes == 0 || this.filter.mes  ==null){
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Mes', detail: ' Debe seleccionar un Mes.' });
      return;
    }
    // if(this.tipoContrato == 0 || this.tipoContrato ==undefined){
    //   this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Tipo Contrato', detail: ' Debe seleccionar un tipo de contrato.' });
    //   return;
    // }
    if(this.empHorasExtraEncontrados.length == 0){
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Horas Extra', detail: ' Debe cargar al menos un emplado con horas extra para poder guardar.' });
      return;
    }
    if(regValoresCeroNegativo.length > 0){
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Horas Extra', detail: ' No puede guardar registros con horas extra en 0.' });
      return;
    }


    Swal.fire({
      title: "Atención!!",
      text: "Esta seguro de guardar este mes?",
      //type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.saveHorasExtra()
      }else{
        this.toastr.error(
        "No se puede registrar información, con fecha posterior a la fecha actual"
        );
        return false;
      }
    });





  }

  saveHorasExtra(){

    let month = 0
    switch (this.filter.mes) {
      case 45:
        month = 1;
        break;
      case 46:
        month = 2;
        break;
      case 47:
        month = 3;
        break;
      case 48:
        month = 4;
        break;
      case 49:
        month = 5;
        break;
      case 50:
        month = 6;
        break;
      case 51:
        month = 7;
        break;
      case 52:
        month = 8;
        break;
      case 53:
        month = 9;
        break;
      case 54:
        month = 10;
        break;
      case 55:
        month = 11;
        break;
      case 56:
        month = 12;
        break;


      default:
    }
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);

    this.empHorasExtraEncontrados.forEach(e => {
      Object.assign(e,{
        horas_extra_25: parseFloat(e.horas_extra_25),
        horas_extra_50: parseFloat(e.horas_extra_50),
        horas_extra_60: parseFloat(e.horas_extra_60),
        horas_extra_100: parseFloat(e.horas_extra_100)})
    });
    let data = {
      anio: Number(this.filter.periodo),
      mes: month,
      //tipo_contrato: this.tipoContrato,
      empleados: this.empHorasExtraEncontrados
    }
    this.asistenciadiasempleService.saveHorasExtra(data).subscribe(
      (res) => {
        console.log(res)
       // if (res.code == 200) {
          this.toastr.success(
            "Datos de horas extra guardados correctamente."
          );

       // }
        // this.rerender();
        //this.consultarIngresoDescuento();
        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error.error.detail);
      }
    );
  }

  consultarHorasExtra(){
    let month = 0
    switch (this.filter.mes) {
      case 45:
        month = 1;
        break;
      case 46:
        month = 2;
        break;
      case 47:
        month = 3;
        break;
      case 48:
        month = 4;
        break;
      case 49:
        month = 5;
        break;
      case 50:
        month = 6;
        break;
      case 51:
        month = 7;
        break;
      case 52:
        month = 8;
        break;
      case 53:
        month = 9;
        break;
      case 54:
        month = 10;
        break;
      case 55:
        month = 11;
        break;
      case 56:
        month = 12;
        break;
      default:
    }

    if(this.filter.mes == 0 || this.filter.mes  ==null){
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Mes', detail: ' Debe seleccionar un Mes.' });
      return;
    }

    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);


    let data = {
      anio: Number(this.filter.periodo),
      mes: month,
      //tipo_contrato: this.tipoContrato,
    }
    this.asistenciadiasempleService.consultarHorasExtra(data).subscribe(
      (res) => {
        console.log(res)
        this.empHorasExtraEncontrados= res
        if(this.empHorasExtraEncontrados.length > 0){
          this.consultaHorasExtra = true
          this.vmButtons[21].habilitar= true
          this.vmButtons[25].habilitar= false
          this.btnSubirArchivoHorasExtra = true
        }else{
          this.consultaHorasExtra = false
          this.vmButtons[21].habilitar= false
          this.vmButtons[25].habilitar= true
          this.btnSubirArchivoHorasExtra = false
        }


       this.empHorasExtraEncontrados.forEach((e,index) => {
        Object.assign(e,{
          linea:(index+1),
          emp_identificacion: e.empleado.emp_identificacion,
          emp_full_nombre: e.empleado.emp_full_nombre,
          dep_nombre: e.departamento.dep_nombre,
          departamento: e.departamento.dep_nombre,

        })

       });
        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error.error.detail);
      }
    );
  }

  deleteOneHorasExtra(ptr_id_horas_extra, index) {
    // this.loading = true;
    // let data = {
    //   // info: this.areaForm,
    //   ip: this.commonService.getIpAddress(),
    //   accion: "get lista desceuntos",
    //   id_controlador: myVarGlobals.fBovedas,
    //   id_horas_extra: ptr_id_horas_extra
    // };

    // this.ingresosydescuentosService.deleteOne(data)
    //   .subscribe({
    //     next: (rpt: any /*  GeneralResponseI */) => {

    //       this.messageService.add({ key: 'bc', severity: 'success', summary: 'Confirmado', detail: 'Ingresos - Descuentos borrado correctamente.' });

    //       if (index !== -1) {
    //         this.objGetIngresosDescuento.splice(index, 1);
    //       }

    //       this.loading = false;


    //     },
    //     error: (e) => {
    //       console.log(e.data);
    //       this.loading = false;
    //       // this.dataResponseGeneral = e.error;
    //       // this.toastr.error(this.dataResponseGeneral.detail);
    //     },
    //   });
  }


  // geEmpleadosListaVerificada(prtEmp) {

  //   if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
  //   if(this.departamento==null) { this.departamento=0 }
  //   if(this.area==null) { this.area=0 }

  //   this.loading = true;
  //   let data = {
  //     // info: this.areaForm,
  //     ip: this.commonService.getIpAddress(),
  //     accion: "get lista desceuntos",
  //     id_controlador: myVarGlobals.fBovedas,
  //     indc_anio: this.ingresoDesctForm.indc_anio,
  //     id_mes: this.ingresoDesctForm.id_mes,
  //     id_tipo_rubro: this.ingresoDesctForm.id_tipo_rubro,
  //     id_rubro: this.ingresoDesctForm.id_rubro,
  //     persons: prtEmp,
  //     id_programa: this.fk_programa,
  //     id_area: this.area,
  //     id_departamento: this.departamento,
  //    // id_departamento: this.departamentoSelect.id_departamento,
  //     departamento_nombre: this.departamentoSelect.dep_nombre,
  //     tipo_contrato: this.tipoContrato == null ? 0 : this.tipoContrato
  //   };

  //   this.ingresosydescuentosService.getValidateEmpleyeesIncomeDiscounts(data)
  //     .subscribe({
  //       next: (rpt: any/* GeneralResponseI */) => {
  //        // this.objGetIngresosDescuento = rpt;
  //        this.verNoEncontrados = true;
  //         this.objGetIngresosDescuento = rpt[0].encontrados;
  //         this.objGetIngresosDescuento.forEach((element: any) => {
  //           Object.assign(element, {cuenta_id: this.cuentaContable?.id, cuenta_codigo: this.cuentaContable?.codigo, cuenta_nombre: this.cuentaContable?.nombre})
  //         })
  //         this.objGetIngresosNoEncontrados = rpt[0].noencontrados;
  //         console.log(rpt);
  //         this.loading = false;
  //         this.formGroupIngresoDescuento.get('fcn_archivo_input').reset();
  //         // this.dataResponseGeneral = rpt;

  //         // if (this.dataResponseGeneral.code != 200) {
  //         //   this.toastr.error(this.dataResponseGeneral.detail);
  //         // }
  //         // this.toastr.info(this.dataResponseGeneral.detail);
  //         // // setTimeout(() => {
  //         // //   // this.dtTrigger.next(null);
  //         // // }, 50);
  //       },
  //       error: (e) => {
  //         console.log(e);
  //         this.loading = false;
  //         // this.dataResponseGeneral = e.error;
  //         // this.toastr.error(this.dataResponseGeneral.detail);
  //       },
  //     });
  // }
  async validaDeleteHorasExtraEmpleado() {

    this.confirmSaveHorasExtra(
      "Seguro desea eliminar los registros?",
      "DELETE_HORAS_EXTRA_EMPLEADO"
    );

  }
  async confirmSaveHorasExtra(message, action) {
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
      if (result.value) {
        if (action == "DELETE_HORAS_EXTRA_EMPLEADO") {
          this.deleteHorasExtraEmpleado();
        }
      }
    });
  }

  deleteHorasExtraEmpleado() {
    let month = 0
    switch (this.filter.mes) {
      case 45:
        month = 1;
        break;
      case 46:
        month = 2;
        break;
      case 47:
        month = 3;
        break;
      case 48:
        month = 4;
        break;
      case 49:
        month = 5;
        break;
      case 50:
        month = 6;
        break;
      case 51:
        month = 7;
        break;
      case 52:
        month = 8;
        break;
      case 53:
        month = 9;
        break;
      case 54:
        month = 10;
        break;
      case 55:
        month = 11;
        break;
      case 56:
        month = 12;
        break;


      default:
    }


    console.log("delete");
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "Borrar horas extra rrhh",
      id_controlador: myVarGlobals.fBovedas,
      anio: Number(this.filter.periodo),
      mes: month,

    };
    // this.validaDt = false;
    this.mensajeSppiner = "Eliminando registros de Horas Extra...";
    this.lcargando.ctlSpinner(true);
    this.asistenciadiasempleService.deleteList(data).subscribe(
      (res) => {
        console.log(res);
        this.consultarHorasExtra()
        this.lcargando.ctlSpinner(false);
        this.loading = false;
        this.toastr.success("Registros de Horas Extra eliminados" );

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  convertirMes(){
    let month = 0
    switch (this.filter.mes) {
      case 45:
        month = 1;
        break;
      case 46:
        month = 2;
        break;
      case 47:
        month = 3;
        break;
      case 48:
        month = 4;
        break;
      case 49:
        month = 5;
        break;
      case 50:
        month = 6;
        break;
      case 51:
        month = 7;
        break;
      case 52:
        month = 8;
        break;
      case 53:
        month = 9;
        break;
      case 54:
        month = 10;
        break;
      case 55:
        month = 11;
        break;
      case 56:
        month = 12;
        break;
      default:
    }

    return month
  }

}
