import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { DatatableLanguage } from "src/app/models/es-ES";
import { CatalogoResponseI } from "src/app/models/responseCatalogo.interface";
import { TiposContratosService } from "./tipos-contratos.service";
import * as myVarGlobals from '../../../../global';
import { CcSpinerProcesarComponent } from "src/app/config/custom/cc-spiner-procesar.component";
import { CommonService } from "src/app/services/commonServices";
import { ToastrService } from "ngx-toastr";
import { Catalog, CatalogAditionalResponseI, CatalogoDetalle } from "src/app/models/responseCatalogAditional.interfase";
import { LazyLoadEvent, MessageService, PrimeNGConfig } from 'primeng/api';
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralResponseI } from "src/app/models/responseGeneral.interface";
import { GeneralService } from "src/app/services/general.service";
import { EmployeesAditionalI } from "src/app/models/responseEmployeesAditional.interface";
import { TPCTCorreoAditional, TpCtCorreoNom } from "src/app/models/responseTPCTCorreoAditional.interface";
import { SMTPEmailAditionalResponseI, StmpEmailNom } from "src/app/models/responseSmptEmailAditional.interface";
import { NuevoTipoContratoComponent } from "./nuevo-tipo-contrato/nuevo-tipo-contrato.component";
import moment from "moment";


@Component({
  selector: "app-tipo-contratos",
  templateUrl: "./tipo-contratos.component.html",
  styleUrls: ["./tipo-contratos.component.scss"],
  providers: [MessageService]
})
export class TipoContratosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  permisions: any;
  permiso_ver: any = "0";
  fTitle: string = "Tipo Contratos";
  vmButtons: any = [];
  dtOptions: any = {};
  mensajeSppiner: string = "Cargando...";
  dataTipoContrato: any;

  //tabla tipo contratos
  loadingTipoContrato: boolean;
  totalRecordsTipoContrato: number;
  rowsTipoContrato: number;
  pageIndexTipoContrato: number = 1;
  pageSizeTipoContrato: number= 10;
  pageSizeOptionsTipoContrato: number[] = [10, 15, 20];

  @Input() objGetTiposDeContratos: CatalogAditionalResponseI[]|any;

  //formulario
  ref: DynamicDialogRef;
  formGroupTiposContratos: FormGroup;
  submittedTipoContrato = false;
  processingTipoContrato :any = false;

  catalogDetailForm : CatalogoDetalle = {
    id_cat_detalle: 0,
    id_catalogo: 0,
    cantidad_tiempo: 0,
    id_tiempo: 0
  }

  catalogCabForm : Catalog = {
    id_catalogo: 0,
    cat_nombre: "",
    cat_descripcion: "",
    cat_keyword: "",
    parent_id: 0
  }

  unidad_tiempo_id_cc: BigInteger | String | number;
  //
  dtTrigger = new Subject();
  dataUser: any;

  constructor(
    private tiposContratosService: TiposContratosService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private fbTpContract: FormBuilder,
    private generalService: GeneralService,
    private modalSrv: NgbModal,
  ) {
    this.rowsTipoContrato = 10;
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
  }

  ngOnInit(): void {
    this.vmButtons = [

      // {
      //   orig: "btnsTiposContratos",
      //   paramAccion: "TAB_TIPO_CONTRATO",
      //   boton: { icon: "fa fa-floppy-o", texto: "GUARDAR"},
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-success boton btn-sm",
      //   habilitar: false,
        
      // },
      {
        orig: "btnsTiposContratos",
        paramAccion: "TAB_TIPO_CONTRATO",
        boton: { icon: "fa fa-plus-square", texto: "NUEVO"},
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
        
      },
      {
        orig: "btnsTiposContratos",
        paramAccion: "TAB_TIPO_CONTRATO",
        boton: { icon: "fa fa-plus-square-o", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn btn-primary boton btn-sm",
        habilitar: true,
      },
      // {
      //   orig: "btnsTiposContratos",
      //   paramAccion: "TAB_TIPO_CONTRATO",
      //   boton: { icon: "fa fa-trash-o", texto: "ELIMINAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn btn-warning boton btn-sm",
      //   habilitar: true,
      // },
      {
        orig: "btnsTiposContratos",
        paramAccion: "TAB_TIPO_CONTRATO",
        boton: { icon: "fa fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsTiposContratos",
        paramAccion: "TAB_CONFIGURAR_REMITENTE",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsTiposContratos",
        paramAccion: "TAB_CONFIGURAR_REMITENTE",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR CONFG SMTP" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsTiposContratos",
        paramAccion: "TAB_CONFIGURAR_REMITENTE",
        boton: { icon: "fa fa-floppy-o", texto: "ENVIAR CORREO MANUAL" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      // { 
      //   orig: "btnsTiposContratos", 
      //   paramAccion: "TAB_CONFIGURAR_REMITENTE", 
      //   boton: { icon: "fa fa-search", texto: "CONSULTAR" }, 
      //   permiso: true,
      //   showtxt: true,
      //   showimg: false,
      //   showbadge: false, 
      //   clase: "btn btn-info boton btn-sm",
      //   habilitar: true 
      // },
      // {
      //   orig: "btnsTiposContratos",
      //   paramAccion: "TAB_CONFIGURAR_REMITENTE",
      //   boton: { icon: "fa fa-plus-square-o", texto: "MODIFICAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: false,
      //   showbadge: false,
      //   clase: "btn btn btn-primary boton btn-sm",
      //   habilitar: true,
      // },
      // {
      //   orig: "btnsTiposContratos",
      //   paramAccion: "TAB_CONFIGURAR_REMITENTE",
      //   boton: { icon: "fa fa-trash-o", texto: "ELIMINAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: false,
      //   showbadge: false,
      //   clase: "btn btn btn-warning boton btn-sm",
      //   habilitar: true,
      // },
      // {
      //   orig: "btnsTiposContratos",
      //   paramAccion: "TAB_CONFIGURAR_REMITENTE",
      //   boton: { icon: "fa fa-times", texto: "CANCELAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: false,
      //   showbadge: false,
      //   clase: "btn btn-danger boton btn-sm",
      //   habilitar: false,
      // },
			{ 
        orig: "btnsTiposContratos", 
        paramAccion: "TAB_LISTA_EMPLEADOS",
        boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, 
        permiso: true, 
        showtxt: true, 
        showimg: false, 
        showbadge: false, 
        clase: "btn btn-danger boton btn-sm", 
        habilitar: true, 
      },
		];

    setTimeout(() => {
      this.getPermissions()
    }, 50);

    
  }

  getPermissions(){
    
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fTiposDeContratos,
      id_rol: id_rol
    }

    this.commonService.getPermisionsGlobas(data).subscribe(res => {
      console.log(res)
      this.permisions = res['data'];

      this.permiso_ver = this.permisions[0].ver;

      if (this.permiso_ver == "0") {

        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Tipos de contratos");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);

      } else {
        this.getDataTableTipoContrato('TCC');
        this.totalRecordsTipoContrato = 0;
        this.validateForm();

        this.validateFormTabConfigurarRemitente();
        this.validateFormTabConfigurarRemitenteTestEmailSend();
        this.validateFormTabSmtpEmail();
        // this.totalRecordsEmpTpCt = 0;
        // this.getDataTableEmpleadoTipoContrato();
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
  }

  metodoGlobal(evento: any) {
  	switch (evento.items.paramAccion + evento.items.boton.texto ) {
      case "TAB_TIPO_CONTRATOGUARDAR":
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-excel' ).trigger();
      break;
      case "TAB_TIPO_CONTRATONUEVO":
        this.showNuevoTipoContrato(true, {});
      break;
      case "TAB_TIPO_CONTRATOMODIFICAR":
        this.validaTipoContratoFormulario();
      break;
      case "TAB_TIPO_CONTRATOCANCELAR":
        this.cancelTipoContrato(0);
      break;
      case "TAB_CONFIGURAR_REMITENTEGUARDAR":
        this.validaConfigurarRemitenteFormulario();
      break;
      case "TAB_CONFIGURAR_REMITENTEGUARDAR CONFG SMTP":
        this.validaConfigurarFormularioSmtpEmail();
      break;
      case "TAB_CONFIGURAR_REMITENTEENVIAR CORREO MANUAL":
        this.enviarCorreo();
      break;
      case "TAB_LISTA_EMPLEADOSPDF":
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-excel' ).trigger();
      break;
    }
  }


  /**
 * inicio tab vacaciones
  */
  validateForm(){
    return this.formGroupTiposContratos = this.fbTpContract.group({
      fcn_cat_tipo_contrato: ["", [Validators.required]],
      fcn_cat_det_cantidad_tiempo: ["", [Validators.required]],
      fcn_cat_unidad_tiempo: ["", [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get ftp() { return this.formGroupTiposContratos.controls; }

  dinamicoBotones($event){
    
    let opcion = $event.originalEvent.currentTarget.innerText;
    
    switch (opcion) {
      case "TIPOS DE CONTRATOS"://1
        this.accionesVerOcultarBotones('TAB_TIPO_CONTRATO');
      break;
      case "CONFIGURAR REMITENTES DE ALERTAS"://2
        this.accionesVerOcultarBotones('TAB_CONFIGURAR_REMITENTE');
      break;
      case "LISTA EMPLEADOS CON TIPO CONTRATOS"://3
      this.accionesVerOcultarBotones('TAB_LISTA_EMPLEADOS');
      break;
       
		}  	 
  }

  
  accionesVerOcultarBotones($valor)
  {
    for(let i=0; i< this.vmButtons.length; i++){
      if(this.vmButtons[i].paramAccion != $valor){
        this.vmButtons[i].showimg=false;
      }
      else if(this.vmButtons[i].paramAccion == $valor){
        this.vmButtons[i].showimg=true;
      }
    }
  }

  async getDataTableTipoContrato(acrom) {


    this.loadingTipoContrato = true;
    let parameterUrl: any = {
      cat_keyword : acrom/* 'TCC' */,
      page:  this.pageIndexTipoContrato ,
      size: this.pageSizeTipoContrato,//event.rows,
      sort: 'id_catalogo', 
      type_sort: 'asc' ,
      search : '',
      relation_selected : 'catalogoDetalle.tiempo' //catalogoDetalle.tiempo@
    };
    this.mensajeSppiner = "Cargando";
    this.lcargando.ctlSpinner(true);
    this.tiposContratosService.getTypeContracTimer(parameterUrl)
      .subscribe({
        next: (rpt: CatalogAditionalResponseI) => {
        
          let dataCat = rpt.data;
      
          this.objGetTiposDeContratos = dataCat;
          // this.totalRecordsTipoContrato = rpt.total;
          this.totalRecords = rpt.total;
          this.lcargando.ctlSpinner(false);
          this.loadingTipoContrato = false;
      
      },
      error: (e) => {
        console.log(e);
        this.lcargando.ctlSpinner(false);
        this.loadingTipoContrato = false;
      },
    });
  }

  


  onRowSelectTipoContrato(data:Catalog){
    let cellData = data.data;
    // console.log(cellData);

    this.formGroupTiposContratos.get("fcn_cat_tipo_contrato").setValue(cellData.cat_nombre);
    this.formGroupTiposContratos.get('fcn_cat_det_cantidad_tiempo').setValue(cellData.catalogo_detalle?.cantidad_tiempo);
    this.formGroupTiposContratos.get('fcn_cat_unidad_tiempo').setValue(cellData.catalogo_detalle?.id_tiempo);

    let catId = cellData.catalogo_detalle?.id_tiempo;
    this.viewSelectionUnidadTiempoCC(catId == undefined ? "0" : catId);

    this.catalogDetailForm = cellData.catalogo_detalle;
    this.catalogCabForm = cellData;

    this.vmButtons.forEach(element => {
      if(element.paramAccion == "TAB_TIPO_CONTRATO"){
        // if(element.boton.texto=='GUARDAR') element.habilitar = false
        if(element.boton.texto=='MODIFICAR') element.habilitar = false
      }
    });

  }

  nextPageTipoContrato(event: LazyLoadEvent) {

    this.pageIndexTipoContrato = (event.first/this.rowsTipoContrato)+1;
    this.getDataTableTipoContrato('TCC');

  }

  setTiempoTipocontrato( data : Catalog){
    let tiempo = data.catalogo_detalle?.cantidad_tiempo;
    let nombretiempo = data.catalogo_detalle?.tiempo?.cat_nombre;

    if( tiempo!= undefined && nombretiempo!= undefined ){
      let rptData = tiempo+' '+nombretiempo;
      return rptData;
    }
    return 'No definido'
    
  }


  viewSelectionUnidadTiempoCC(responseId: any) {

    this.unidad_tiempo_id_cc = responseId;

    if(responseId!=0 || responseId!='0' ) {
      // this.catalogDetailForm.id_tiempo = 166;
      this.formGroupTiposContratos.get("fcn_cat_unidad_tiempo").setValue(responseId);
    }
  }

  /**
   * metodo de actualizar
   */
  validaTipoContratoFormulario(){
   // console.log(JSON.stringify(this.formGroupFaltaAndPermiso.value));
    // console.log(new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio+'-12-31').getFullYear());
    this.submittedTipoContrato = true;
    // console.log(this.formGroupFaltaAndPermiso.invalid);
    if (this.formGroupTiposContratos.invalid) {
      return;
    }

    // console.log("guadrar");
    this.confirmSave(
      "Seguro desea actualizar tipo de contrato?",
      "UPDATE_CATALOGO_TIPO_CONTRATO"
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
      this.processingTipoContrato = false;
      if (result.value) {
        if (action == "SAVE_CATALOGO_TIPO_CONTRATO") {
          // this.saveFaltaAndPermisoEmpleado();
        } else if (action == "UPDATE_CATALOGO_TIPO_CONTRATO") {
          this.updateTipoContrato();
        } else if( action == 'CREATE_OR_UPDATE_ALERTA_TIPO_CONTRATO'){
          this.updateOrCreateAlertaTipoContrato();
        } else if( action == 'SEND_EMAIL_TEST'){
          this.senEmailTest();
        } else if( action == 'CREATE_OR_UPDATE_SMTP_EMAIL'){
          this.saveOrUpdateStmpEmail();
        }else if( action == 'SEND_EMAIL'){
          this.sebdStmpEmail();
        }
        /* else if (action == "DELETE_VACACIONES_EMPLEADO") {
          this.deleteVacacionesEmpleado();
        }else if (action == "PDF_CERTIFICADOS") {
          this.pdfCertificados();
        }else if (action == "IMPRIMIR_PDF_CERTIFICADOS") {
          this.pdfImprimirCertificados();
        } */
      }
    });
  }

  /**
  * actualizar tipo contrato
  */
  async updateTipoContrato() {

    let idDetCat = this.catalogDetailForm?.id_cat_detalle ?? 0;
    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Actualizacion de nueva vacacion  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      id_cat_detalle : idDetCat,
      id_catalogo: this.catalogCabForm.id_catalogo,
      cantidad_tiempo: this.formGroupTiposContratos.value.fcn_cat_det_cantidad_tiempo,
      id_tiempo: this.unidad_tiempo_id_cc,

    }
    this.mensajeSppiner = "Actualizando...";
    this.lcargando.ctlSpinner(true);
    this.tiposContratosService.createOrUpdateCatalogDetailWorkTime(data).subscribe(
      (res: GeneralResponseI) => {
        // console.log(res);
        this.toastr.success(
          "Datos de tipo contrato actualizados correctamente."
        );
      
        // this.objGetTiposDeContratos = [];
        this.cancelTipoContrato(1);
        this.getDataTableTipoContrato('TCC');
        // this.cancelar();
        this.lcargando.ctlSpinner(false);
      
        
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error?.error?.detail);

        /* let errorApi =  Object.values(error?.error?.detail);
        for(let i=0; i< errorApi.length; i++){
          let msj = errorApi[i].toString();
          this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: this.capitalizarPrimeraLetra(msj)});
        } */
      }
    );
  }

  cancelTipoContrato($parameter){
    // this.objGetTiposDeContratos = [];
    if($parameter==1){
      this.objGetTiposDeContratos = [];
    }
    this.unidad_tiempo_id_cc = '0';
    this.formGroupTiposContratos.get('fcn_cat_det_cantidad_tiempo').setValue('');
    this.formGroupTiposContratos.get('fcn_cat_det_cantidad_tiempo').setValue('');
    this.formGroupTiposContratos.get('fcn_cat_tipo_contrato').setValue('');
    this.submittedTipoContrato = false;

    this.catalogCabForm = undefined;
    this.catalogDetailForm = undefined;
    // this.onRowSelectTipoContrato(undefined);

    this.vmButtons.forEach(element => {
      if(element.paramAccion == "TAB_TIPO_CONTRATO"){
        // if(element.boton.texto=='GUARDAR') element.habilitar = false
        if(element.boton.texto=='MODIFICAR') element.habilitar = true
      }
    });
  }

  /**
   * TAB INICIO
   * lista de empleados con tipos de contratos
   */

  //tabla EMPLEADOS TIPOS DE CONTRATOS
  loadingEmpTpCt: boolean;
  totalRecordsEmpTpCt: number;//
  rowsEmpTpCt: number;
  pageSizeEmpTpCt: number= 10;
  pageSizeOptionsEmpTpCt: number[] = [10, 15, 20];
  totalRecords: number;

  @Input() objGetEmpleadosTiposDeContratos: EmployeesAditionalI[]|any;

  tpCtCorreoNomForm : TpCtCorreoNom = {
    id_tpct_correo: 0,
    id_empresa: 0,
    cantidad_dias_vencer: 0,
    hora: "",
    estado_id: 0
  };


  CargaEmpleadoTiposContratos(event: LazyLoadEvent) {
  
    this.rowsEmpTpCt = 10;
    this.loadingEmpTpCt = true;

    const p_page = event.first / this.rowsEmpTpCt + 1;

    let parameterUrl: any = {
      page:  p_page,
      size:  this.pageSizeEmpTpCt,
      sort: 'id_empleado', 
      type_sort: 'asc',
      search: '',
      relation: 'not',
      relation_selected: 'sueldo.tipoContrato.catalogoDetalle.tiempo',
    };

    this.tiposContratosService.getEmpleadosPaginate(parameterUrl).subscribe({
      next: (rpt: EmployeesAditionalI) => {
        console.log(rpt)
        rpt.data.forEach((empleado: any) => {
          let inicio_contrato = moment(empleado.emp_fecha_ingreso)
          let factor: string = (empleado.sueldo?.tipo_contrato?.catalogo_detalle?.tiempo?.cat_nombre == 'Días') ? 'd' : (empleado.sueldo?.tipo_contrato?.catalogo_detalle?.tiempo?.cat_nombre == 'Meses') ? 'M' : 'y'
          let fin_contrato = moment(inicio_contrato).add(empleado.sueldo?.tipo_contrato?.catalogo_detalle?.cantidad_tiempo, factor)
          let tiempo_restante = moment().diff(fin_contrato, 'days')

          // console.log(fin_contrato.format('YYYY-MM-DD'), tiempo_restante)
          Object.assign(empleado, { fin_contrato, tiempo_restante })
        })
        this.objGetEmpleadosTiposDeContratos = rpt.data;
 
        this.totalRecords = rpt.total;
        // this.totalRecordsEmpTpCt = rpt.total;

        this.loadingEmpTpCt = false;
      },
      error: (e) => {
        this.toastr.error(e.error.detail);
        console.log(e);
        this.loadingEmpTpCt = false;
      },
    });

  }


  botonConfigurarRemitenteAlerta($habilitar, $num){
    this.vmButtons.forEach(element => {
      if(element.paramAccion == "TAB_CONFIGURAR_REMITENTE"){
        // if(element.boton.texto=='GUARDAR') element.habilitar = false
        if(element.boton.texto=='GUARDAR' && $num==1) element.habilitar = $habilitar
        else if(element.boton.texto=='GUARDAR CONFG SMTP' && $num== 2) element.habilitar = $habilitar
        // else if(element.boton.texto=='ENVIAR CORREO MANUAL' && $num== 2) element.habilitar = $habilitar
      }
    });
  }

  // nextPageEmpTpCt(event: LazyLoadEvent) {

  //   console.info('se ehecuto');
  //   // this.pageIndexEmpTpCt = (event.first/this.rowsEmpTpCt)+1;
  //   // this.getDataTableEmpleadoTipoContrato();

  // }

  /**
   * TAB FIN
   * lista de empleados con tipos de contratos
   */


  /**
   * CONFIGURAR REMITENTES DE ALERTAS INICIO
   */

  //formulario
  // ref: DynamicDialogRef;
  formGroupConfigurarRemitenteAlertas: FormGroup;
  submittedConfigurarRemitenteAlertas = false;
  processingConfigurarRemitenteAlertas :any = false;

  // convenience getter for easy access to form fields
  get fcra() { return this.formGroupConfigurarRemitenteAlertas.controls; }

  validateFormTabConfigurarRemitente(){
    return this.formGroupConfigurarRemitenteAlertas = this.fbTpContract.group({
      fcn_cantidad_dias_vencer: ["", [Validators.required]],
      fcn_hora: ["", [Validators.required]],

    });
  }


  //tabla EMPLEADOS TIPOS DE CONTRATOS
  loadingTpCtCorreo: boolean;
  totalRecordsTpCtCorreo: number;//
  rowsTpCtCorreo: number;
  pageSizeTpCtCorreo: number= 10;
  pageSizeOptionsTpCtCorreo: number[] = [10, 15, 20];
  // totalRecords: number;
 
  @Input() objGetConfiguracionTipoContrato: TPCTCorreoAditional[]|any;
 
 
  getConfiguracionTipoContrato(event: LazyLoadEvent) {
  
    this.rowsTpCtCorreo = 10;
    this.loadingTpCtCorreo = true;

    const p_page = event.first / this.rowsTpCtCorreo + 1;

    let parameterUrl: any = {
      page:  p_page,
      size:  this.pageSizeTpCtCorreo,
      sort: 'id_tpct_correo', 
      type_sort: 'asc',
      search: '',
    };

    this.getTpCtCorreo(parameterUrl);

  }

  getTpCtCorreo(parameterUrl){
    this.tiposContratosService.getTypeContracConfiguration(parameterUrl).subscribe({
      next: (rpt: TPCTCorreoAditional) => {
        this.objGetConfiguracionTipoContrato = rpt.data;

        this.totalRecords = rpt.total;
  

        if(rpt.data.length == 0)
          this.botonConfigurarRemitenteAlerta(false,1);

        if(rpt.data.length > 0)
          this.botonConfigurarRemitenteAlerta(true,1);

        this.loadingTpCtCorreo = false;
      },
      error: (e) => {
        this.toastr.error(e.error.detail);
        console.log(e);
        this.loadingTpCtCorreo = false;
      },
    });
  }

  onRowSelectConfiguracionTipoContrato(data: TpCtCorreoNom){
    this.botonConfigurarRemitenteAlerta(false,1);

    let dataCorreoTpCt = data.data;
    this.tpCtCorreoNomForm = dataCorreoTpCt;

  }


  /**
 * metodo de actualizar
 */
  validaConfigurarRemitenteFormulario(){
  // console.log(JSON.stringify(this.formGroupFaltaAndPermiso.value));
    // console.log(new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio+'-12-31').getFullYear());
    this.submittedConfigurarRemitenteAlertas = true;
    // console.log(this.formGroupFaltaAndPermiso.invalid);
    if (this.formGroupConfigurarRemitenteAlertas.invalid) {
      return;
    }

    // console.log("guadrar");
    this.confirmSave(
      "Seguro desea guardar configuracion de alerta tipo de contrato?",
      "CREATE_OR_UPDATE_ALERTA_TIPO_CONTRATO"
    );
  }

  /**
  * actualizar alerta tipo contrato
  */
  async updateOrCreateAlertaTipoContrato() {

    let idDetCat = this.catalogDetailForm?.id_cat_detalle ?? 0;
    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Actualizacion o guardar alerta tipo de contrato  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      id_tpct_correo: this.tpCtCorreoNomForm.id_tpct_correo,
      id_empresa: this.dataUser.id_empresa,
      cantidad_dias_vencer: this.formGroupConfigurarRemitenteAlertas.value.fcn_cantidad_dias_vencer,
      hora: this.formGroupConfigurarRemitenteAlertas.value.fcn_hora,

    }
    this.mensajeSppiner = "Actualizando...";
    this.lcargando.ctlSpinner(true);
    this.tiposContratosService.createOrUpdateTiempoContratoCorreo(data).subscribe(
      (res: GeneralResponseI) => {
        // console.log(res);
        this.toastr.success(
          "Datos de alerta tipo contrato actualizados correctamente."
        );
      
        let parameterUrl: any = {
          page:  1,
          size:  this.pageSizeTpCtCorreo,
          sort: 'id_tpct_correo', 
          type_sort: 'asc',
          search: '',
        };
    
        this.loadingTpCtCorreo = true;
        this.getTpCtCorreo(parameterUrl);
        this.lcargando.ctlSpinner(false);
      
        
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error?.error?.detail);

        /* let errorApi =  Object.values(error?.error?.detail);
        for(let i=0; i< errorApi.length; i++){
          let msj = errorApi[i].toString();
          this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: this.capitalizarPrimeraLetra(msj)});
        } */
      }
    );
  }
  

    //formulario
  // ref: DynamicDialogRef;
  formGroupTestEmail: FormGroup;
  submittedTestEmail = false;
  
  // processingConfigurarRemitenteAlertas :any = false;

  // convenience getter for easy access to form fields
  get fsendEmail() { return this.formGroupTestEmail.controls; }

  validateFormTabConfigurarRemitenteTestEmailSend(){
    return this.formGroupTestEmail = this.fbTpContract.group({
      fcn_subject_test: ["", [Validators.required]],
      fcn_mail_destinationt: ["", [Validators.required]],
    });
  }


  enviarCorreoTest()
  {
    this.submittedTestEmail = true;
    // console.log(this.formGroupFaltaAndPermiso.invalid);
    if (this.formGroupTestEmail.invalid) {
      return;
    }

    // console.log("guadrar");
    this.confirmSave(
      "Seguro desea enviar correo de test?",
      "SEND_EMAIL_TEST"
    );
  }

  /**
  * enviar correo de test
  */
  async senEmailTest() {

    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Actualizacion o guardar alerta tipo de contrato  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,

      id_empresa          : this.dataUser.id_empresa,
      subject             : this.formGroupTestEmail.value.fcn_subject_test,
      mailDestination     : this.formGroupTestEmail.value.fcn_mail_destinationt,
      
    }
    this.mensajeSppiner = "Enviando Correo Test...";
    this.lcargando.ctlSpinner(true);
    this.tiposContratosService.testEmailSend(data).subscribe(
      (res: GeneralResponseI) => {

        this.toastr.success("Correo enviado correctamente.");
      
        this.lcargando.ctlSpinner(false);
      
        this.cancelFormEmail();

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error?.error?.detail);

        /* let errorApi =  Object.values(error?.error?.detail);
        for(let i=0; i< errorApi.length; i++){
          let msj = errorApi[i].toString();
          this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: this.capitalizarPrimeraLetra(msj)});
        } */
      }
    );
  }

  cancelFormEmail(){
    this.formGroupTestEmail.get("fcn_subject_test").setValue('');
    this.formGroupTestEmail.get("fcn_mail_destinationt").setValue('');
    this.submittedTestEmail = false;
  }

  //tabla EMPLEADOS TIPOS DE CONTRATOS
  loadingTbCfEmail: boolean;
  totalRecordsTbCfEmail: number;//
  rowsTbCfEmail: number;
  pageSizeTbCfEmail: number= 10;
  pageSizeOptionsTbCfEmail: number[] = [10, 15, 20];
  // totalRecords: number;
 
  @Input() objGetConfiguracionStmpEmail: SMTPEmailAditionalResponseI[]|any;
  smtpemailForm : StmpEmailNom = {
    id_smpt_email: 0,
    id_empresa: 0,
    smtp_transport: "",
    smtp_host: "",
    smtp_port: 0,
    smtp_encryption: "",
    smtp_username: "",
    smtp_password: "",
    address: "",
    name: null,
    estado_id: 0
  };

    //formulario
  // ref: DynamicDialogRef;
  formGroupEmailConfig: FormGroup;
  submittedEmailConfig = false;
  
  // processingConfigurarRemitenteAlertas :any = false;

  // convenience getter for easy access to form fields
  get fec() { return this.formGroupEmailConfig.controls; }

  validateFormTabSmtpEmail(){
    return this.formGroupEmailConfig = this.fbTpContract.group({
      fcn_smtp_transport: ["", [Validators.required]],
      fcn_smtp_host: ["", [Validators.required]],
      fcn_puerto: ["", [Validators.required]],
      fcn_encriptacion: ["", [Validators.required]],
      fcn_usuario_smtp: ["", [Validators.required]],
      fcn_clave_smpt: ["", [Validators.required]],
    });
  }
 
  getConfiguracionEmailSmtp(event: LazyLoadEvent) {
  
    this.rowsTbCfEmail = 10;
    this.loadingTbCfEmail = true;

    const p_page = event.first / this.rowsTbCfEmail + 1;

    let parameterUrl: any = {
      page:  p_page,
      size:  this.pageSizeTbCfEmail,
      sort: 'id_smpt_email', 
      type_sort: 'asc',
      search: '',
    };

    this.getEmailConfig(parameterUrl);

  }

  getEmailConfig(parameterUrl){
    this.tiposContratosService.getSmtpEmail(parameterUrl).subscribe({
      next: (rpt: SMTPEmailAditionalResponseI) => {
        this.objGetConfiguracionStmpEmail = rpt.data;

        this.totalRecords = rpt.total;
  

        if(rpt.data.length == 0)
          this.botonConfigurarRemitenteAlerta(false,2);

        if(rpt.data.length > 0)
          this.botonConfigurarRemitenteAlerta(true,2);

        this.loadingTbCfEmail = false;
      },
      error: (e) => {
        this.toastr.error(e.error.detail);
        console.log(e);
        this.loadingTbCfEmail = false;
      },
    });
  }


  onRowSelectConfiguracionSmtpEmail(data: StmpEmailNom){
    let smtpEmal = data.data;
    this.smtpemailForm = smtpEmal;
    this.botonConfigurarRemitenteAlerta(false,2);
  }


  /**
  * metodo de actualizar o guardar
  */
  validaConfigurarFormularioSmtpEmail(){
  // console.log(JSON.stringify(this.formGroupFaltaAndPermiso.value));
    // console.log(new Date(this.formGroupFaltaAndPermiso.value.fcn_flpr_anio+'-12-31').getFullYear());
    this.submittedEmailConfig = true;
    // console.log(this.formGroupFaltaAndPermiso.invalid);
    if (this.formGroupEmailConfig.invalid) {
      return;
    }

    // console.log("guadrar");
    this.confirmSave(
      "Seguro desea guardar configuracion stmp correo?",
      "CREATE_OR_UPDATE_SMTP_EMAIL"
    );
  }

  /**
  * actualizar tipo contrato
  */
  async saveOrUpdateStmpEmail() {

    let idDetCat = this.catalogDetailForm?.id_cat_detalle ?? 0;
    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "Actualizacion de email stmp  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,


      id_smpt_email       : this.smtpemailForm.id_smpt_email,
      id_empresa          : this.dataUser.id_empresa,
      smtp_transport      : this.formGroupEmailConfig.value.fcn_smtp_transport,
      smtp_host           : this.formGroupEmailConfig.value.fcn_smtp_host,
      smtp_port           : this.formGroupEmailConfig.value.fcn_puerto,
      smtp_encryption     : this.formGroupEmailConfig.value.fcn_encriptacion,
      smtp_username       : this.formGroupEmailConfig.value.fcn_usuario_smtp,
      smtp_password       : this.formGroupEmailConfig.value.fcn_clave_smpt,
      address             : this.formGroupEmailConfig.value.fcn_usuario_smtp,
      name: null
    }
    this.mensajeSppiner = "Actualizando...";
    this.lcargando.ctlSpinner(true);
    this.tiposContratosService.createOrUpdateSmtpEmail(data).subscribe(
      (res: GeneralResponseI) => {
        // console.log(res);
        this.toastr.success(
          "Datos de configuracion smtp actualizados correctamente."
        );
      
        
        this.cancelSmtpEmail(1);
        this.getDataSmtpEmail();
        this.lcargando.ctlSpinner(false);
      
        
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error?.error?.detail);

        /* let errorApi =  Object.values(error?.error?.detail);
        for(let i=0; i< errorApi.length; i++){
          let msj = errorApi[i].toString();
          this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: this.capitalizarPrimeraLetra(msj)});
        } */
      }
    );
  }

  getDataSmtpEmail(){
    this.rowsTbCfEmail = 10;
    this.loadingTbCfEmail = true;

    const p_page = 1;

    let parameterUrl: any = {
      page:  p_page,
      size:  this.pageSizeTbCfEmail,
      sort: 'id_smpt_email', 
      type_sort: 'asc',
      search: '',
    };

    this.getEmailConfig(parameterUrl);
  }

  cancelSmtpEmail( $parameter ){

    if($parameter==1){
      this.objGetConfiguracionStmpEmail = [];
    }

    this.formGroupEmailConfig.get('fcn_smtp_transport').setValue('');
    this.formGroupEmailConfig.get('fcn_smtp_host').setValue('');
    this.formGroupEmailConfig.get('fcn_puerto').setValue('');
    this.formGroupEmailConfig.get('fcn_encriptacion').setValue('');
    this.formGroupEmailConfig.get('fcn_usuario_smtp').setValue('');
    this.formGroupEmailConfig.get('fcn_clave_smpt').setValue('');
    this.submittedTipoContrato = false;

    // this.catalogCabForm = undefined;
    // this.catalogDetailForm = undefined;

    this.submittedEmailConfig = false;
    this.botonConfigurarRemitenteAlerta(true,2);

  }


  //lista empleados notificar
  //tabla EMPLEADOS NOTIFICAR
  loadingEmpNotif: boolean;
  totalRecordsEmpNotif: number;//
  rowsEmpNotif: number;
  pageSizeEmpNotif: number= 10000;
  pageSizeOptionsEmpNotif: number[] = [10, 15, 20];
  
  @Input() objGetListNotificationListEmp: SMTPEmailAditionalResponseI[]|any;

  // totalRecords: number;

  getListaEmpleadosNotificar(event: LazyLoadEvent) {
  
    this.rowsEmpNotif = 10;
    this.loadingTbCfEmail = true;

    const p_page = event.first / this.rowsEmpNotif + 1;

    let parameterUrl: any = {
      page        :  p_page,
      size        :  this.pageSizeEmpNotif,
      sort        : 'id_empleado', 
      type_sort   : 'asc',
      id_empresa  : this.dataUser.id_empresa,
    };

    this.getEmailNotificacion(parameterUrl);

  }

  getEmailNotificacion(parameterUrl){
    this.loadingEmpNotif = true;
    this.tiposContratosService.emailNotificationListEmp(parameterUrl).subscribe({
      next: (rpt: SMTPEmailAditionalResponseI) => {
        this.objGetListNotificationListEmp = rpt.data;

        this.totalRecords = rpt.total;
  
        if(rpt.data.length == 0){
          this.vmButtons.forEach(element => {
            if(element.paramAccion == "TAB_CONFIGURAR_REMITENTE"){
              if(element.boton.texto=='ENVIAR CORREO MANUAL') element.habilitar = true
            }
          });
          // this.botonConfigurarRemitenteAlerta(false,2);
        }

        if(rpt.data.length > 0){
          this.vmButtons.forEach(element => {
            if(element.paramAccion == "TAB_CONFIGURAR_REMITENTE"){
              if(element.boton.texto=='ENVIAR CORREO MANUAL') element.habilitar = false
            }
          });
          // this.botonConfigurarRemitenteAlerta(true,2);
        }

        this.loadingEmpNotif = false;
      },
      error: (e) => {
        this.toastr.error(e.error.detail);
        console.log(e);
        this.loadingEmpNotif = false;
      },
    });
  }

  //enviar correo 
  /**
  * metodo de enviar correo
  */
  enviarCorreo(){
    // console.log("guadrar");
    this.confirmSave(
      "Los correo seran enviado manualmente ha aquellos que la fecha de notificacion sea la de hoy y en la fecha configurada!",
      "SEND_EMAIL"
    );
  }

  async sebdStmpEmail() {


    let data = {
      // info: this.formSueldoEmpleado,
      ip: this.commonService.getIpAddress(),
      accion: "enviar correo  rrhh",
      id_controlador: myVarGlobals.fCuentaBancos,
      id_empresa          : this.dataUser.id_empresa,
    }
    this.mensajeSppiner = "Enviando correos...";
    this.lcargando.ctlSpinner(true);
    this.tiposContratosService.sendEmailServer(data).subscribe(
      (res: GeneralResponseI) => {
        // console.log(res);
        this.toastr.success(
          "Correos enviados correctamente."
        );

        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(error?.error?.detail);

        /* let errorApi =  Object.values(error?.error?.detail);
        for(let i=0; i< errorApi.length; i++){
          let msj = errorApi[i].toString();
          this.messageService.add({key: 'tr', severity:'error', summary: 'Advertencia', detail: this.capitalizarPrimeraLetra(msj)});
        } */
      }
    );
  }
  showNuevoTipoContrato(isNew:boolean, data?:any) {
    console.log(data);
    const modalInvoice = this.modalSrv.open(NuevoTipoContratoComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.fTitle = this.fTitle;
    modalInvoice.componentInstance.isNew = isNew;
    modalInvoice.componentInstance.data = data;    
}

  /**
   * CONFIGURAR REMITENTES DE ALERTAS FIN
   */
}
