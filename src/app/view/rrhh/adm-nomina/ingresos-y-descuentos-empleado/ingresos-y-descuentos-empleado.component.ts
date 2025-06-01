import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices';
import { IngresosYDsctosEmpleadosService } from './ingresos-y-dsctos-empleados.service';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CcModalTableRubroComponent } from 'src/app/config/custom/modal-component/cc-modal-table-rubro/cc-modal-table-rubro.component';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { RubrosResponseI } from 'src/app/models/responseRubro.interface';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcModalTableEmpleadoComponent } from 'src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component';
import { EmployeesResponseI } from 'src/app/models/responseEmployee.interface';
import { GeneralResponseI } from 'src/app/models/responseGeneral.interface';
import { IngresoDescuentolResponseI } from 'src/app/models/responseIngresoDescuento.interface';
import { ModalDepartamentosComponent } from 'src/app/config/custom/modal-departamentos/modal-departamentos.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ExcelService } from 'src/app/services/excel.service';
import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';
import { environment } from 'src/environments/environment';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { ModalProgramaComponent } from './modal-programa/modal-programa.component';
import { CierreMesService } from 'src/app/view/presupuesto/configuracion/cierre-de-mes/cierre-mes.service';


@Component({
standalone: false,
  selector: 'app-ingresos-y-descuentos-empleado',
  templateUrl: './ingresos-y-descuentos-empleado.component.html',
  styleUrls: ['./ingresos-y-descuentos-empleado.component.scss'],
  providers: [DialogService,MessageService],
})
export class IngresosYDescuentosEmpleadoComponent implements OnInit {

  @ViewChild(DataTableDirective)

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  permiso_ver: any = "0";
  empresLogo: any;
  permisions: any;
  ingresosydescientos: any = [];
  vmButtons: any = [];
  excelData: any [];
  excelDataIngresos:  any [];
  exportList: any = [];
  exportListIngresos: any = [];
  tipoContratos: any = [];

  /** */
  @Input() objGetIngresosDescuento: IngresoDescuentolResponseI | any;//DocFicha[];
  id_tipo_rubro_cc: BigInteger | String | number;
  id_mes_cc: BigInteger | String | number;
  ref: DynamicDialogRef;
  sld_anio: any = moment().format('YYYY');
  formGroupIngresoDescuento: FormGroup;
  fileToUpload: any;
  loading: boolean;
  objGetIngresosNoEncontrados: any = [];

  ingresoDesctForm: any = {
    indc_anio: 0,
    id_tipo_rubro: 0,
    id_mes: 0,
    id_rubro: 0,
    // nombre_archivo: '',
    // id_doc_ficha: 0,
    // id_empleado: 0,
    // tipo_archivo_id: 0,
    // extension: '',
    // peso_archivo : 0,
    // archivo_base_64: '',
    // fecha_creacion: undefined,
    // fecha_modificacion: undefined,
    // estado_id: 0,
    // estado: undefined,
    // tipo_archivo: undefined,
  };

  btnSearchRubro: boolean;
  btnSubirArchivo: boolean;
  btnNewIngresoDescuento: boolean;
  readonlyInpuRubro: boolean;
  verNoEncontrados : boolean;
  consulta : boolean;

  processing: any = false;
  mensajeSppiner: string = "Cargando...";
  submitted = false;

  programa: any = ''
  fk_programa: any = 0
  areas: any = []
  area: any = 0
  departamento: any = 0

  departamentos: any = []

  dep_nombre: any
  departamentoSelect: any = {
    dep_nombre:"",
    id_departamento:0
  };
  tipoContrato: any = 0

  cuentaContable: any = {
    codigo: null,
    nombre: null
  }

  num_control: any
  guardado: boolean = false

  lastRecord: number|null = null
  cmb_periodo: any[] = []






  /** */
  constructor(
    private messageService: MessageService,
    public dialogService: DialogService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private ingresosydescuentosService: IngresosYDsctosEmpleadosService,
    private toastr: ToastrService,
    private modalSrv: NgbModal,
    private commonVarSrv: CommonVarService,
    private excelService: ExcelService,
    private cierremesService: CierreMesService) {

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    this.commonVarSrv.departamentoSelect.asObservable().subscribe(
      (res)=>{
        this.departamentoSelect = res;
        this.dep_nombre = res['dep_nombre'];



        //console.log(this.departamentoSelect)
      }
    )

    this.commonVarSrv.modalProgramArea.subscribe(
      (res)=>{
        console.log(res)
        this.programa = res.nombre
        this.fk_programa = res.id_nom_programa
        this.formGroupIngresoDescuento.get("fcn_programa_input").setValue(res.nombre)
        this.cargarAreas()
      }
    )

  }

  ngOnInit(): void {
    this.btnSearchRubro = true;
    this.btnSubirArchivo = true;
    this.verNoEncontrados = false;
    this.btnNewIngresoDescuento = true;
    this.consulta= false;
    this.readonlyInpuRubro = true;
    //this.sld_anio = moment().format("YYYY");
    this.sld_anio = moment(new Date()).format("YYYY");
    this.ingresoDesctForm.indc_anio = this.sld_anio;
    this.dep_nombre = '';
    this.departamentoSelect.id_departamento= 0

    // console.log(this.sld_anio);
    this.vmButtons = [
      // { orig: "btnsIngresosDsctosEmpl", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true },
      {
        orig: "btnsIngresosDsctosEmpl",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsIngresosDsctosEmpl",
        paramAccion: "",
        boton: { icon: "fa fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false
      },
      { orig: "btnsIngresosDsctosEmpl",
       paramAccion: "",
        boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true },
      {
        orig: "btnsIngresosDsctosEmpl",
        paramAccion: "",
        boton: { icon: "fa fa-check", texto: "APROBAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsIngresosDsctosEmpl",
        paramAccion: "",
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
        orig: "btnsIngresosDsctosEmpl",
        paramAccion: "",
        boton: { icon: "fa fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsIngresosDsctosEmpl",
        paramAccion: "",
        boton: { icon: "fa fa-download", texto: "PLANTILLA" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-help boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsIngresosDsctosEmpl",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsIngresosDsctosEmpl",
        paramAccion: "",
        boton: { icon: "fa fa-file-pdf-o", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      }
    ];


    this.formGroupIngresoDescuento = this.fb.group({
     // fcn_searh_rubro: [''],
     // fcn_indc_anio: ["", [Validators.required]],
      fcn_mes: ["", [Validators.required]],
      fcn_tipo_ribro: ["", [Validators.required]],
      fcn_input_searh_rubro: ["", [Validators.required]],
      fcn_descripcion_rubro_input: ["", [Validators.required]],
      fcn_nombre_archivo_input: ["", []],
      //fcn_archivo_input: ["", []],
      fcn_programa_input: ["",[]],
      fcn_direccion_input: ["",[]],
      fcn_departamento_input: ["", []],
      fcn_tipo_contrato_input: ["", []],


    });

    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;

    let data = {
      id: 11,
      codigo: myVarGlobals.fIngrsYDsctosEmpleado,
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
      await this.cargaInicial()
      this. getTipoContratos();
      this.lcargando.ctlSpinner(false)
    }, 50)
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

  // convenience getter for easy access to form fields
  get f() { return this.formGroupIngresoDescuento.controls; }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validaSaveIngresoDescuento();
        break;
      case "CONSULTAR":
        this.consultarIngresoDescuento();
        break;
      case "MODIFICAR":
        this.validaUpdateIngresoDescuento();
        break;
      case "APROBAR":
        this.aprobarIngresoDescuento()
        break;
      case "ELIMINAR":
        this.validaDeleteIngresoDescuentoEmpleado();
        break;
      case "CANCELAR":
        this.cancel();
        break;
      case "PLANTILLA":
        //this.descargar_plantilla();
        this.btnExportarPlantilla();
        break;
      case "EXCEL":
        this.btnExportExcel();
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-excel' ).trigger();
        break;
      case "IMPRIMIR":
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-print' ).trigger();
        break;
      case "PDF":
        this.exportarPdf();
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-pdf' ).trigger();
        break;
      case "LIMPIAR":
        //this.informaciondtlimpiar();
        break;
    }
  }

  async cargaInicial() {
    try {
      this.mensajeSppiner = "Carga Inicial"
      const resPeriodos = await this.ingresosydescuentosService.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos
    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }

  cancel() {
    this.objGetIngresosDescuento = [];
    this.dataExcel = [];
    this.btnSubirArchivo = true;
    this.verNoEncontrados = false;
    this.id_tipo_rubro_cc = undefined
    this.id_mes_cc = undefined
    this.consulta = false;
    this.tipoContrato = 0
    this.formGroupIngresoDescuento.reset()
    this.formGroupIngresoDescuento.get("fcn_tipo_ribro").setValue(undefined);
    this.formGroupIngresoDescuento.get("fcn_mes").setValue(this.id_mes_cc);
    this.formGroupIngresoDescuento.get("fcn_tipo_contrato_input").setValue(undefined);
    this.formGroupIngresoDescuento.get('fcn_departamento_input').setValue(undefined);
    this.formGroupIngresoDescuento.get('fcn_direccion_input').setValue(undefined);
    this.formGroupIngresoDescuento.get('fcn_programa_input').setValue(undefined);
    this.vmButtons[7].habilitar = true;

    Object.assign(this.cuentaContable, {
      codigo: null,
      nombre: null
    })


    this.borrarArchivo();
  }


  /** metodo de consulta */
  consultarIngresoDescuento() {

      this.verNoEncontrados = false;
      this.loading = true;

      if(this.dep_nombre == '' || this.dep_nombre == undefined){
        this.departamentoSelect.id_departamento = 0
      }
      if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
      if(this.departamento==null) { this.departamento=0 }
      if(this.area==null) { this.area=0 }


      let data = {
        // info: this.areaForm,
        ip: this.commonService.getIpAddress(),
        accion: "get lista ingresos y descuentos rrhh",
        id_controlador: myVarGlobals.fBovedas,
        indc_anio: this.ingresoDesctForm.indc_anio,
        id_mes: this.ingresoDesctForm.id_mes,
        id_tipo_rubro: this.ingresoDesctForm.id_tipo_rubro,
        id_rubro: this.ingresoDesctForm.id_rubro,
        id_programa: this.fk_programa,
        id_area: this.area,
        id_departamento: this.departamento,
       // id_departamento: this.departamentoSelect.id_departamento,
        tipo_contrato: this.tipoContrato == null ? 0 : this.tipoContrato
      };

      this.ingresosydescuentosService.getListIngresoDescuentoAll(data)
        .subscribe({
          next: (rpt: IngresoDescuentolResponseI) => {


            this.objGetIngresosDescuento = rpt;
            this.objGetIngresosDescuento.forEach((e,index) => {

              if(e.num_control ==null || e.num_control =='' || e.num_control ==undefined){
                Object.assign(e,{ aprobar:false, tiene_control:false})
              }else{
                Object.assign(e,{ aprobar:true, tiene_control:true})
              }

            });
            console.log(this.objGetIngresosDescuento);
            this.consulta = true;
            if(this.objGetIngresosDescuento.length > 0){
              Object.assign(this.cuentaContable, {
                id: this.objGetIngresosDescuento[0].cuenta_id,
                codigo: this.objGetIngresosDescuento[0].cuenta_codigo,
                nombre: this.objGetIngresosDescuento[0].cuenta_nombre,
                label: `${this.objGetIngresosDescuento[0].cuenta_codigo} - ${this.objGetIngresosDescuento[0].cuenta_nombre}`
              })
              this.vmButtons[0].habilitar = true;
              this.vmButtons[4].habilitar = false;
              this.vmButtons[7].habilitar = false;
              this.vmButtons[8].habilitar = false;
              this.btnSubirArchivo = true;
              this.consulta = true;
            }else{
              this.vmButtons[0].habilitar = false;
              this.btnSubirArchivo = false;
              this.consulta = false;
              this.toastr.info('No se encontraron datos en la consulta');
            }

            // this.vmButtons[2].habilitar = false;

            this.loading = false;

            // if (this.dataResponseGeneral.code != 200) {
            //   this.toastr.error(this.dataResponseGeneral.detail);
            // }
            // this.toastr.info(this.dataResponseGeneral.detail);
            // // setTimeout(() => {
            // //   // this.dtTrigger.next(null);
            // // }, 50);
          },
          error: (e) => {
            console.log(e);
            this.loading = false;
            // this.objGetIngresosDescuento = [];
            // this.dataResponseGeneral = e.error;
            // this.toastr.error(this.dataResponseGeneral.detail);
          },
        });



  }


  /***Editar */
  async validaUpdateIngresoDescuento() {
    let valores = Object.values(this.objGetIngresosDescuento);
    if (valores.length == 0) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Tabla vacia', detail: ' Tabla ingresos y descuentos vacia.' });
      return;
    }
    for (let i = 0; i < valores.length; i++) {
      if (valores[i]['id_empleado'] == 0 || valores[i]['id_empleado'] == "0") {
        this.messageService.add({ key: 'bc', severity: 'error', summary: 'Faltan campos', detail: 'Seleccionar Empleado.' });
        return;
      }
    }

    // Revisa que los elementos de la tabla tengan asignado la Cuenta Contable
    // true: Tienen cuenta_id asignada, false: uno de los elementos no lo tiene asignado
    const cuentaDetalles: boolean = this.objGetIngresosDescuento.reduce((acc: boolean, curr: any) => acc && (curr.cuenta_id != undefined || curr.cuenta_id != null), 1)

    console.log(cuentaDetalles)
    if (this.cuentaContable == undefined || !cuentaDetalles) {
      this.messageService.add({key: 'bc', severity: 'error', summary: 'Cuenta Contable', detail: 'No ha seleccionado una Cuenta Contable'});
      return;
    }
    this.submitted = false;
    // stop here if form is invalid *****
    // if (this.formGroupIngresoDescuento.invalid) { return; }
    this.confirmSave("Seguro desea actualizar los diferentes ingresos y descuentos?", "UPDATED_INGRESO_DESCUENTO_EMPLEADO");
  }

  /**-----METODOS DE GUARDAR */
  async validaSaveIngresoDescuento() {
    // let  PTRobjGetIngresosDescuento = this.objGetIngresosDescuento == undefined ? [] : this.objGetIngresosDescuento;


    /*Validamos registros */

    const fecha = new Date();
    let month = 0;

    const añoActual = fecha.getFullYear();
    const mesActual = fecha.getMonth() + 1;

    switch (this.id_mes_cc) {
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

    console.log(this.sld_anio)
    if(this.sld_anio == undefined){
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Valores Solicitados', detail: ' Debe seleccionar un periodo' });
      return;
    }

    if(this.id_mes_cc == undefined){
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Valores Solicitados', detail: ' Debe seleccionar un mes' });
      return;
    }


    if (month > mesActual && this.sld_anio>=añoActual){
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
          return true;
        }else{
          this.toastr.error(
          "No se puede registrar información, con fecha posterior a la fecha actual"
          );
          return false;
        }
      });
      // this.toastr.error(
      //   "No se puede registrar información, con fecha posterior a la fecha actual"
      // );
      // return false;
    }

    let regValoresCeroNegativo = this.objGetIngresosDescuento.filter(e => e.indc_valor_solicitado <= 0)

    if(regValoresCeroNegativo.length > 0){
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Valores Solicitados', detail: ' El valor solicitado debe ser mayor a 0. Por favor corrija el Valor Solicitado en las filas marcadas en rojo o elimine las filas para poder guardar .' });
      return;
    }


    if (this.objGetIngresosDescuento != undefined) {

      let valores = Object.values(this.objGetIngresosDescuento);
      if (valores.length == 0) {
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Tabla vacia', detail: ' Tabla ingresos y descuentos vacia.' });
        return;
      }
      let countEmp=0
      for (let i = 0; i < valores.length; i++) {
        if (valores[i]['id_empleado'] == 0 || valores[i]['id_empleado'] == "0") {
          this.messageService.add({ key: 'bc', severity: 'error', summary: 'Faltan campos', detail: 'Seleccionar Empleado.' });
          return;
        }
      }
    }

    // Revisa que los elementos de la tabla tengan asignado la Cuenta Contable
    // true: Tienen cuenta_id asignada, false: uno de los elementos no lo tiene asignado
    const cuentaDetalles: boolean = this.objGetIngresosDescuento.reduce((acc: boolean, curr: any) => acc && (curr.cuenta_id != undefined || curr.cuenta_id != null), 1)

    //console.log(cuentaDetalles)
    if (this.cuentaContable == undefined || !cuentaDetalles) {
      this.messageService.add({key: 'bc', severity: 'error', summary: 'Cuenta Contable', detail: 'No ha seleccionado una Cuenta Contable'});
      return;
    }
    console.log(this.formGroupIngresoDescuento)
    if (this.formGroupIngresoDescuento.valid == true) {

      console.log(this.formGroupIngresoDescuento.valid)
      this.confirmSave(
        "Tiene "+this.objGetIngresosNoEncontrados.length+" no encontrados.Seguro desea guardar la ficha de los "+this.objGetIngresosDescuento.length+" empleados encontrados?",
        "SAVE_INGRESO_DESCUENTO_EMPLEADO"
      );
    }
    this.submitted = true;
    if (this.objGetIngresosDescuento == undefined) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Alerta', detail: 'Falta detalles - Lista de Ingresos - Descuentos.' });
      return;
    }

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
        if (action == "SAVE_INGRESO_DESCUENTO_EMPLEADO") {
          this.saveIngresoDescuentoEmpleado();
        } else if (action == "UPDATED_INGRESO_DESCUENTO_EMPLEADO") {
          this.updateIngresoDescuentoEmpleado();
        } else if (action == "DELETE_INGRESO_DESCUENTO_EMPLEADO") {
          this.deleteIngresoDescuentoEmpleado();
        }
      }
    });
  }

  async updateIngresoDescuentoEmpleado() {

    this.mensajeSppiner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);

    let dat = {
      "anio": Number(this.sld_anio),
      "mes": this.convertirMes()
      }

    this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(async (res) => {
        try {
          if (res["data"][0].estado !=='C') {
                      //crear el objeto a enviar---------------------------
              let insertData = [];

              let valores = Object.values(this.objGetIngresosDescuento);
              for (let i = 0; i < valores.length; i++) {
                let data = Object.assign(valores[i], this.ingresoDesctForm);
                insertData.push(data);
              }

              console.log(insertData);
              //---------------------------------------------------
              let data = {
                // info: this.formSueldoEmpleado,
                ip: this.commonService.getIpAddress(),
                accion: "Actualizacion de ingreso y desceunto  rrhh",
                id_controlador: myVarGlobals.fCuentaBancos,

                //DATOS
                ing_desc: insertData,

              };
              this.mensajeSppiner = "Actualizando...";
              this.lcargando.ctlSpinner(true);
              this.ingresosydescuentosService.saveListIngresoDescuento(data).subscribe(
                (res: GeneralResponseI) => {
                  this.objGetIngresosDescuento = [];
                  if (res.code == 200) {
                    this.toastr.success(
                      "Datos de ingresos y descuentos actualizados correctamente."
                    );
                  }

                  this.consultarIngresoDescuento();
                  // this.rerender();
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
          } else {

              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
          }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });

  }

  ///
  async saveIngresoDescuentoEmpleado() {

    this.mensajeSppiner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);

    let dat = {
      "anio": Number(this.sld_anio),
      "mes": this.convertirMes()
      }

    this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(async (res) => {
        try {
          if (res["data"][0].estado !=='C') {
            console.log(this.tipoContrato)

            //crear el objeto a enviar---------------------------
            let insertData = [];

            let valores = Object.values(this.objGetIngresosDescuento);
            for (let i = 0; i < valores.length; i++) {
              let data = Object.assign(valores[i], this.ingresoDesctForm);
              insertData.push(data);

            }
            //---------------------------------------------------
            if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
            if(this.departamento==null) { this.departamento=0 }
            if(this.area==null) { this.area=0 }

            let data = {
              // info: this.formSueldoEmpleado,
              ip: this.commonService.getIpAddress(),
              accion: "Creación de ingreso y desceunto  rrhh",
              id_controlador: myVarGlobals.fCuentaBancos,

              //DATOS
              ing_desc: insertData,
              id_programa: this.fk_programa,
              id_area: this.area,
              id_departamento: this.departamento,
              //id_departamento: this.departamentoSelect.id_departamento,
              tipo_contrato: this.tipoContrato

            };
            this.mensajeSppiner = "Guardando...";
            this.lcargando.ctlSpinner(true);
            this.ingresosydescuentosService.saveListIngresoDescuento(data).subscribe(
              (res: GeneralResponseI) => {
                console.log(res)
                if (res.code == 200) {
                  this.toastr.success(
                    "Datos de ingresos y descuentos guardados correctamente."
                  );
                  //this.objGetIngresosDescuento=res
                  //this.objGetIngresosDescuento = []
                  //this.objGetIngresosNoEncontrados = []
                  this.btnSubirArchivo=true;
                }
                // this.rerender();
                this.consultarIngresoDescuento();
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

          } else {

              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
          }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });
  }

  /**
   *
   * @param responseId
   */
  async validaDeleteIngresoDescuentoEmpleado() {

    this.confirmSave(
      "Seguro desea eliminar los registros?",
      "DELETE_INGRESO_DESCUENTO_EMPLEADO"
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

  deleteIngresoDescuentoEmpleado() {
    this.mensajeSppiner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);

    let dat = {
      "anio": Number(this.sld_anio),
      "mes": this.convertirMes()
      }

    this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(async (res) => {
        try {
          if (res["data"][0].estado !=='C') {
            let idDeleteIngDEscData = [];
            this.loading = true;

            let valores = Object.values(this.objGetIngresosDescuento);
            for (let i = 0; i < valores.length; i++) {

              idDeleteIngDEscData.push(valores[i]['id_ing_desc']);

            }

            console.log("delete");
            let data = {
              // info: this.areaForm,
              ip: this.commonService.getIpAddress(),
              accion: "Borrar ingresos y desceuntos rrhh",
              id_controlador: myVarGlobals.fBovedas,
              delete_list: idDeleteIngDEscData,
            };
            // this.validaDt = false;
            this.mensajeSppiner = "Borrando...";
            this.lcargando.ctlSpinner(true);
            this.ingresosydescuentosService.deleteList(data).subscribe(
              (res) => {
                console.log(res);
                // // this.rerender();
                // this.cancel("not");
                // this.messageError = [];
                // this.getDocumentoByEmpleadoUno(this.folderDigitalForm.id_empleado);
                this.objGetIngresosDescuento = [];
                this.lcargando.ctlSpinner(false);
                this.loading = false;
                this.toastr.success("Borrado" /* res['message'] */);

              },
              (error) => {
                this.lcargando.ctlSpinner(false);
                this.processing = true;
                // this.messageError = error.error.detail;
                // this.messageError.forEach(element => {
                //   this.toastr.error(element.toString());
                // });
                // this.messageError = [];

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

  //*****------------------ */

  viewSelectionTipoRubroCC(responseId: any) {
    // this.formGroupIngresoDescuento.get('fcn_searh_rubro').disable({ onlySelf: false });
    this.readonlyInpuRubro = false;
    this.btnSearchRubro = false;
    this.id_tipo_rubro_cc = responseId;
    this.ingresoDesctForm.id_tipo_rubro = responseId;
    this.formGroupIngresoDescuento.get("fcn_tipo_ribro").setValue(this.id_tipo_rubro_cc);
  }

  viewSelectionMesCC(responseId: any) {
    this.id_mes_cc = responseId;
    this.ingresoDesctForm.id_mes = responseId;
    this.formGroupIngresoDescuento.get("fcn_mes").setValue(this.id_mes_cc);
  }

  /**
   *
   * @param content consultar rubros
   */
  onClicConsultaRubros(content) {
    this.ref = this.dialogService.open(CcModalTableRubroComponent, {
      data: {
        relation: "not",
        tipo_rubro_id: this.ingresoDesctForm.id_tipo_rubro,
      },
      header: "Rubros",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe((rubroData: any) => {
      console.log(rubroData)
      this.vmButtons[2].habilitar = false;
      this.formGroupIngresoDescuento.get("fcn_input_searh_rubro").setValue(rubroData.rub_codigo);
      this.formGroupIngresoDescuento.get('fcn_descripcion_rubro_input').setValue(rubroData.rub_descripcion);
      this.ingresoDesctForm.id_rubro = rubroData.id_rubro;
      this.btnNewIngresoDescuento = false;
      //this.btnSubirArchivo = false;
      if (rubroData.cuentas) {
        console.log(rubroData.cuentas)
        const data = rubroData.cuentas
        Object.assign(this.cuentaContable, {
          label: `${data.codigo} - ${data.nombre}`,
          clase: data.clase,
          codigo: data.codigo,
          codigo_padre: data.codigo_padre,
          descripcion_original: data.descripcion_original,
          id: data.id,
          nombre: data.nombre,
          tipo: data.tipo
        })
      }
    });

  }

  dataExcel = Array();
  handleFileInputPlantilla(file: FileList) {


    console.log(file)

        // this.fileToUpload = file.item(0);
    // console.log(this.fileToUpload);
    const selectedFile = file.item(0);
    console.log(selectedFile)
    this.formGroupIngresoDescuento.get('fcn_nombre_archivo_input').setValue(selectedFile.name);
    let reader = new FileReader();
    reader.readAsBinaryString(selectedFile);
    reader.onload = (event: any) => {
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, {
        type: 'binary'
      });

      workbook.SheetNames.forEach(element => {
        this.dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[element]);
        console.log(this.dataExcel);
      });



      const arrayVacio = (arr) => !Array.isArray(arr) || arr.length === 0;//array vacio retorna TRUE , array lleno FALSE

      if (!arrayVacio(this.dataExcel)) {
        // se envia peticion paa llenar la tabla
        this.geEmpleadosListaVerificada(this.dataExcel);
      }

    }


  }

  geEmpleadosListaVerificada(prtEmp) {

    if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
    if(this.departamento==null) { this.departamento=0 }
    if(this.area==null) { this.area=0 }

    this.loading = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get lista desceuntos",
      id_controlador: myVarGlobals.fBovedas,
      indc_anio: this.ingresoDesctForm.indc_anio,
      id_mes: this.ingresoDesctForm.id_mes,
      id_tipo_rubro: this.ingresoDesctForm.id_tipo_rubro,
      id_rubro: this.ingresoDesctForm.id_rubro,
      persons: prtEmp,
      id_programa: this.fk_programa,
      id_area: this.area,
      id_departamento: this.departamento,
     // id_departamento: this.departamentoSelect.id_departamento,
      departamento_nombre: this.departamentoSelect.dep_nombre,
      tipo_contrato: this.tipoContrato == null ? 0 : this.tipoContrato
    };

    this.ingresosydescuentosService.getValidateEmpleyeesIncomeDiscounts(data)
      .subscribe({
        next: (rpt: any/* GeneralResponseI */) => {
         // this.objGetIngresosDescuento = rpt;
         this.verNoEncontrados = true;
          this.objGetIngresosDescuento = rpt[0].encontrados;
          this.objGetIngresosDescuento.forEach((element: any) => {
            Object.assign(element, {cuenta_id: this.cuentaContable?.id, cuenta_codigo: this.cuentaContable?.codigo, cuenta_nombre: this.cuentaContable?.nombre})
          })
          this.objGetIngresosNoEncontrados = rpt[0].noencontrados;
          console.log(rpt);
          this.loading = false;
          this.formGroupIngresoDescuento.get('fcn_archivo_input').reset();
          // this.dataResponseGeneral = rpt;

          // if (this.dataResponseGeneral.code != 200) {
          //   this.toastr.error(this.dataResponseGeneral.detail);
          // }
          // this.toastr.info(this.dataResponseGeneral.detail);
          // // setTimeout(() => {
          // //   // this.dtTrigger.next(null);
          // // }, 50);
        },
        error: (e) => {
          console.log(e);
          this.loading = false;
          // this.dataResponseGeneral = e.error;
          // this.toastr.error(this.dataResponseGeneral.detail);
        },
      });
  }


  onRowSelectIbgresoDescuento(data: any) {
    const dat = data.data;


    console.log(data.data);

  }

  /**
   *
   * @param value
   * @param model
   * @returns
   */
  onColumnEditComplete(value, model) {
    if (value != 0 || value != '0' || value.value != '') {
      // return model.indc_valor_solicitado = parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');  // 12,345.67
      return model.indc_valor_solicitado = (parseFloat(value).toFixed(2));
    }

    return "0.00";
  }

  /**
   *
   * @param index
   */
  deleteDataIngDesc(data) {
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
        const index: number = this.objGetIngresosDescuento.indexOf(data);//get index by passing the concern row data
        //se borra en base el registro
        if (data.id_ing_desc != 0 && data.id_ing_desc != undefined) {
          this.deleteOneIngrDesc(data.id_ing_desc, index)
        }


        if (data.id_ing_desc == undefined || data.id_ing_desc == 0) {
          if (index !== -1) {
            this.objGetIngresosDescuento.splice(index, 1);
          }
        }

      }
    });
  }

  deleteOneIngrDesc(ptr_id_ing_desc, index) {
    this.loading = true;
    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get lista desceuntos",
      id_controlador: myVarGlobals.fBovedas,
      id_ing_desc: ptr_id_ing_desc
    };

    this.ingresosydescuentosService.deleteOne(data)
      .subscribe({
        next: (rpt: any /*  GeneralResponseI */) => {

          this.messageService.add({ key: 'bc', severity: 'success', summary: 'Confirmado', detail: 'Ingresos - Descuentos borrado correctamente.' });

          if (index !== -1) {
            this.objGetIngresosDescuento.splice(index, 1);
          }

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

  onAddNewIngresoDescuento() {
    //validar q no se pueda agregar mas filas si estan sin empleados
    if (this.objGetIngresosDescuento != undefined) {
      let valores = Object.values(this.objGetIngresosDescuento);

      for (let i = 0; i < valores.length; i++) {
        if (valores[i]['id_empleado'] == 0 || valores[i]['id_empleado'] == "0") {
          this.messageService.add({ key: 'bc', severity: 'error', summary: 'Faltan campos', detail: 'Seleccionar Empleado.' });
          return;
        }
      }
    }

    const insertData = {
      "id_ing_desc": 0,
      "id_empleado": 0,
      "emp_identificacion": '',
      "emp_full_nombre": '',
      "indc_valor_solicitado": 0.00
    };

    if (this.objGetIngresosDescuento !== undefined) {
      this.objGetIngresosDescuento = [insertData, ...this.objGetIngresosDescuento];
    }

    if (this.objGetIngresosDescuento == undefined) {
      this.objGetIngresosDescuento = [insertData];
    }


    // this.objGetIngresosDescuento.unshift([]);
    // const newP = {
    //   id: '2022',
    //   code: 'test2022',
    //   name: 'new Gaming Set',
    //   description: 'new Product Description',
    //   image: 'gaming-set.jpg',
    //   price: 299,
    //   category: 'Electronics',
    //   quantity: 63,
    //   inventoryStatus: 'INSTOCK',
    //   rating: 3,
    // };
    // this.products2.unshift(newP);
    // //Caution: guard again dataKey here
    // this.pTable.editingRowKeys[newP[this.pTable.dataKey]] = true;
    // this.onRowEditInit(newP);

  }


  onClicConsultaEmpleadosIngDesc(content: any) {

    this.ref = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: "not",
      },
      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((empleadoData: EmployeesResponseI) => {

      content.id_empleado = empleadoData.id_empleado;
      content.emp_identificacion = empleadoData.emp_identificacion;
      content.emp_full_nombre = empleadoData.emp_full_nombre;
      content.indc_valor_solicitado = content.indc_valor_solicitado ?? 0.00;
      // return content;

    });
  }

  borrarArchivo() {
    console.log("boorarrrr archivo");
    this.formGroupIngresoDescuento.get('fcn_nombre_archivo_input').setValue('');
  }


  /** metodo de consulta */
  descargar_plantilla() {

    let data = {
      // info: this.areaForm,
      ip: this.commonService.getIpAddress(),
      accion: "get descargar plantilla ingresos y descuentos rrhh",
      id_controlador: myVarGlobals.fBovedas,
    };

    this.ingresosydescuentosService.getPlantilla(data)
      .subscribe({
        next: (rpt: any) => {
          console.log(rpt);

          const filename = 'PlantillaIngresoDescuento';
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
          // this.toastr.error(this.dataResponseGeneral.detail);
        },
      });

  }

  // anioSelected(evt: any, year:any){
  //   console.log(evt)
  //   this.sld_anio = evt

  // }

   handleBoton() {
    console.log('hooked')
    return;

    if(this.sld_anio == undefined || this.sld_anio == ''){
      this.toastr.info('Debe seleccionar un año')
    }else{
      document.getElementById('getFile').click();
    }

  }
  modalDepartamentos(){
    let modal = this.modalSrv.open(ModalDepartamentosComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  btnExportarPlantilla() {
    // if(this.departamentoSelect.id_departamento == 0 || this.departamentoSelect.id_departamento == ''   || this.departamentoSelect.id_departamento == undefined){
    //   this.toastr.info('Debe seleccionar un departamento')
    // }else if (this.tipoContrato == 0 || this.tipoContrato == ''   || this.tipoContrato == undefined){
    //   this.toastr.info('Debe seleccionar un tipo de contrato')
    // }else{

    if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
    if(this.departamento==null) { this.departamento=0 }
    if(this.area==null) { this.area=0 }

      let data = {
        params: {
          programa: this.fk_programa,
          area: this.area,
          departamento: this.departamento,
         // departamento: this.departamentoSelect.id_departamento,
          tipo_contrato: this.tipoContrato,
        }
      }
      this.ingresosydescuentosService.getRecDocumentosExport(data).subscribe(
        (res)=>{
          console.log(res);
          this.exportList = res
          this.excelData = [];
          // if (this.permisions[0].ver== "0") {

          //   this.toastr.info("Usuario no tiene permiso para exportar");
          // } else {
            Object.keys(this.exportList).forEach(key => {
              let filter_values = {};
              filter_values['cedula'] = (this.exportList[key].emp_identificacion != null) ? this.exportList[key].emp_identificacion.trim() : "";;
              filter_values['nombres'] = (this.exportList[key].emp_full_nombre != null) ? this.exportList[key].emp_full_nombre.trim() : "";
              filter_values['departamento'] = (this.exportList[key].departamento?.dep_nombre != null) ? this.exportList[key].departamento?.dep_nombre.trim() : "";
              filter_values['tipo_contrato'] = (this.exportList[key].sueldo?.tipo_contrato?.cat_nombre != null) ? this.exportList[key].sueldo?.tipo_contrato?.cat_nombre.trim() : "";
              filter_values['valor_solicitado'] = (this.exportList[key].departamento?.sueldo?.sld_salario_minimo != null) ? this.exportList[key].departamento?.sueldo?.sld_salario_minimo.trim() : "";
              this.excelData.push(filter_values);
            })
            this.exportAsXLSX();
          //}
        }
      )
    //}



  }
  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Plantilla de Ingresos y Descuentos');
  }

  getTipoContratos(){
    let data = {
      valor_cat: 'TCC',
    }
    this.ingresosydescuentosService.getTipoContratos(data).subscribe((result: any) => {
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

  contratoSelected(event){
    console.log(this.formGroupIngresoDescuento.value.fcn_tipo_contrato_input)
    this.tipoContrato=this.formGroupIngresoDescuento.value.fcn_tipo_contrato_input
  }

  onClickConsultaCuentas() {
    localStorage.setItem('detalle_consulta', 'true')
    const ref = this.dialogService.open(CcModalTablaCuentaComponent, {
      header: 'Cuentas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    ref.onClose.subscribe((cuentas: any) => {
      localStorage.removeItem('detalle_consulta')
      if (cuentas) {
        console.log(cuentas.data)
        const data = cuentas.data
        Object.assign(this.cuentaContable, {
          label: `${data.codigo} - ${data.nombre}`,
          clase: data.clase,
          codigo: data.codigo,
          codigo_padre: data.codigo_padre,
          descripcion_original: data.descripcion_original,
          id: data.id,
          nombre: data.nombre,
          tipo: data.tipo
        })

        if (this.objGetIngresosDescuento.length > 0) {
          this.objGetIngresosDescuento.forEach((element: any) => {
            Object.assign(element, {
              cuenta_id: this.cuentaContable.id,
              cuenta_codigo: this.cuentaContable.codigo,
              cuenta_nombre: this.cuentaContable.nombre,
            })
          })
        }
      }
    });
  }

  btnExportExcel(){
    this.mensajeSppiner = "Generando Archivo Excel...";
    this.lcargando.ctlSpinner(true);
   // this.ingresosydescuentosService.getRecDocumentosExport(data).subscribe(
    //  (res)=>{

        this.exportListIngresos = this.objGetIngresosDescuento
        this.excelDataIngresos = [];
          Object.keys(this.exportListIngresos).forEach(key => {
            let filter_values = {};
            filter_values['Cédula'] = (this.exportListIngresos[key].emp_identificacion != null) ? this.exportListIngresos[key].emp_identificacion.trim() : "";;
            filter_values['Nombres'] = (this.exportListIngresos[key].emp_full_nombre != null) ? this.exportListIngresos[key].emp_full_nombre.trim() : "";
            filter_values['Departamento'] = (this.exportListIngresos[key].dep_nombre != null) ? this.exportListIngresos[key].dep_nombre.trim() : "";
            //filter_values['Tipo Contrato'] = (this.exportListIngresos[key].sueldo?.tipo_contrato?.cat_nombre != null) ? this.exportListIngresos[key].sueldo?.tipo_contrato?.cat_nombre.trim() : "";
            filter_values['Valor Solicitado'] = (this.exportListIngresos[key].indc_valor_solicitado != null) ? this.exportListIngresos[key].indc_valor_solicitado.trim() : "";
            //filter_values['Período'] = (this.exportListIngresos[key].ndc_anio != null) ? this.exportListIngresos[key].ndc_anio.trim() : "";

            this.excelDataIngresos.push(filter_values);
          })

          this.exportAsXLSXIngresos();
          this.lcargando.ctlSpinner(false);

        //}
     // }
   // )

  }

  exportAsXLSXIngresos() {
    this.excelService.exportAsExcelFile(this.excelDataIngresos, 'Consulta de Ingresos y Descuentos');
  }

  exportarPdf(){


    if(this.tipoContrato == undefined || this.tipoContrato == null ){
      this.tipoContrato = 0
    }
    if(this.dep_nombre ==null || this.departamentoSelect.id_departamento == undefined) { this.departamentoSelect.id_departamento=0 }
    let numeroControl= '0'
    console.log(this.sld_anio)
    if(this.id_tipo_rubro_cc == undefined){
      this.id_tipo_rubro_cc = 0
    }
    if(this.id_mes_cc == undefined){
      this.id_mes_cc = 0
    }
    if(this.sld_anio == undefined){this.sld_anio = 0}else{this.sld_anio = this.sld_anio}

    if(this.lastRecord ==undefined || String(this.lastRecord) ==''){
      numeroControl= '0'
      this.num_control = undefined
    }
    if(this.num_control == undefined || this.num_control == '' ){
      numeroControl= '0'
    }else {
      numeroControl = this.num_control
    }

    window.open(environment.ReportingUrl + "rpt_rrhh_ingresos_descuentos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&anio=" + this.sld_anio + "&mes_id=" + this.id_mes_cc + "&id_tipo_rubro=" + this.id_tipo_rubro_cc + "&id_rubro=" + this.ingresoDesctForm.id_rubro + "&tipo_contrato=" + this.tipoContrato + "&departamento=" +  this.departamentoSelect.id_departamento +  "&num_control=" +  numeroControl, '_blank')
    console.log(environment.ReportingUrl + "rpt_rrhh_ingresos_descuentos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&anio=" + this.sld_anio + "&mes_id=" + this.id_mes_cc + "&id_tipo_rubro=" + this.id_tipo_rubro_cc + "&id_rubro=" + this.ingresoDesctForm.id_rubro + "&tipo_contrato=" + this.tipoContrato + "&num_control=" + numeroControl)
  }

  handleColumnCheck(event: any, data: any) {
    console.log(event.target.checked)
    console.log(data)
    this.objGetIngresosDescuento.forEach(e => {

      if(event.target.checked ){
        Object.assign(e, {aprobar: event.target.checked})
      }else{
        if(e.tiene_control != true){
          Object.assign(e, {aprobar: false})
        }
      }
     });
    let sinAprobar = this.objGetIngresosDescuento.filter(e => e.aprobar == true && e.num_control ==null)
    if(sinAprobar.length > 0){
      this.vmButtons[3].habilitar = false;
    }else{
      this.vmButtons[3].habilitar = true;
    }
     console.log(this.objGetIngresosDescuento)
  }

  handleRowCheck(event, data: any) {
    console.log(event.target.checked)
    console.log(data)
    console.log(this.objGetIngresosDescuento)
   this.objGetIngresosDescuento.forEach(e => {

    if(e.emp_identificacion == data.emp_identificacion && data.valor > 0){
      Object.assign(e, {aprobar: event.target.checked})
    }
   });
   let sinAprobar = this.objGetIngresosDescuento.filter(e => e.aprobar == true && e.num_control ==null)
    if(sinAprobar.length > 0){
      this.vmButtons[3].habilitar = false;
    }else{
      this.vmButtons[3].habilitar = true;
    }

   console.log(this.objGetIngresosDescuento)
  }

  aprobarIngresoDescuento(){

    this.mensajeSppiner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);
    let dat = {
      "anio": Number(this.sld_anio),
      "mes": this.convertirMes()
    }
      this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(res => {

      /* Validamos si el periodo se encuentra aperturado */
      if (res["data"][0].estado !== 'C') {
        let empleadosCheck= this.objGetIngresosDescuento.filter(e => e.aprobar==true && e.tiene_control== false)
        console.log(empleadosCheck)
        let data = {
          anio: this.sld_anio,
          empleados: empleadosCheck
        }

        console.log("datadecimoterce",data)
        this.mensajeSppiner = "Aprobando Ingresos y Descuentos...";
        this.lcargando.ctlSpinner(true);
        this.ingresosydescuentosService.aprobarIngresoDescuento(data).subscribe(res => {
          console.log(res)
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            icon: "success",
            title: "Se ha procesado con éxito",
            //text: res['message'],
            showCloseButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#20A8D8',
        })
        this.consultarIngresoDescuento()

        },error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
        });


      } else {
        this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
        this.lcargando.ctlSpinner(false);
      }

      }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
      })

  }

  getPorNoControl() {

    if(this.num_control == '' || this.num_control == undefined){
      this.toastr.info('Debe ingresar un No. de control para realizar la busqueda')
    }else{
      this.mensajeSppiner = "Buscando";
      this.lcargando.ctlSpinner(true);

      let data = {
        num_control : this.num_control
      }
      this.ingresosydescuentosService.consultaNumControl(data).subscribe(
        (result: any) => {
          console.log(result)

          this.objGetIngresosDescuento = result;
          this.objGetIngresosDescuento.forEach(e => {

            if(e.num_control !=null){
              Object.assign(e,{ aprobar:true, tiene_control:true})
            }
          });

          // let totalDiasTrab = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.dias_trabajados), 0)
          // let totalGanado = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.total_ganado), 0)
          // let totalDevengado = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.total_devengado), 0)
          // let totalDecimos = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.valor_decimo), 0)
          // let totalRetencionDecimo = this.decimotercero.reduce((suma: number, x: any) => suma + parseFloat(x.valor_retencion_decimo), 0)


          // this.totalDiasTrab =totalDiasTrab
          // this.totalGanado =totalGanado
          // this.totalDevengado =totalDevengado
          // this.totalDecimos =  totalDecimos
          // this.totalRetencionDecimo =  totalRetencionDecimo
          this.vmButtons[7].habilitar = false
          this.vmButtons[8].habilitar = false
          this.lcargando.ctlSpinner(false);

          // // //si trae datos de empleados con decimo habilito el boton aprobar
          // let sinAprobar = this.decimotercero.filter(e => e.aprobar == true && e.num_control =='')
          // if(sinAprobar.length > 0){
          //   this.vmButtons[2].habilitar = false;
          // }else{
          //   this.vmButtons[2].habilitar = true;
          // }

          // //si hay aprobados sin orden de pago habilito el boton generar orden de pago
          // let aprobados = this.decimotercero.filter(e => e.tiene_control == true && e.num_orden_pago =='')
          // if(aprobados.length > 0){
          //   this.vmButtons[3].habilitar = false;
          // }

          // this.vmButtons[6].habilitar = false
          // this.vmButtons[7].habilitar = false

        })
    }

  }


  async getPrevRecord() {

    this.lastRecord = Number(this.lastRecord)- 1;
    this.getNumControl()
  //  await this.handleEnter({key: 'Enter'})
  }

  async getNextRecord() {

    this.lastRecord = Number(this.lastRecord)+ 1;
    this.getNumControl()
   // await this.handleEnter({key: 'Enter'})
  }

  async  getNumControl(){
    this.lcargando.ctlSpinner(true)
    this.mensajeSppiner = 'Cargando Registro'

    this.cancel()
    try {
      const response = await this.ingresosydescuentosService.getNumControl({id: this.lastRecord })
      console.log(response)
      if (response) {
        //this.num_control = response.data.num_documento
        this.getPorNoControl()
      } else {
        this.cancel()
        this.lcargando.ctlSpinner(false)
        Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
      }
    } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error cargando Registro')
    }
  }

  async handleEnter({key}) {
    if (key === 'Enter') {
      if (this.lastRecord == null) {
        await this.getLatest()
        return
      }else{
       this.getNumControl()
      }
    }
  }

  async getLatest() {
    this.lcargando.ctlSpinner(true)
    this.mensajeSppiner= 'Cargando Registro'
    try {
      const response = await this.ingresosydescuentosService.getUltimoNumero()
      console.log(response)
      if (response.num_documento) {
        // this.totalRecords = response.data.total
        this.lastRecord = response.id
        this.num_control = response.num_documento
        this.ingresosydescuentosService.listaIngresosDesc$.emit(response.data)
        this.getPorNoControl()
        this.lcargando.ctlSpinner(false)
      } else {
        this.cancel()
        this.lcargando.ctlSpinner(false)
        Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
      }
      //
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Registro')
    }
  }

  modalPrograma(){
    let modal = this.modalSrv.open(ModalProgramaComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  cargarAreas() {
    this.mensajeSppiner = "Cargando listado de Áreas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      fk_programa: this.fk_programa
    }

    this.ingresosydescuentosService.getAreas(data).subscribe(
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
    console.log(event)
    this.mensajeSppiner = "Cargando listado de Departamentos...";
    this.lcargando.ctlSpinner(true);
    this.area = event;
    let data = {
      id_area: event
    }

    this.ingresosydescuentosService.getDepartamentos(data).subscribe(
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

  selectedDepartamento(event){
    console.log(event)
    this.departamento = event
  }

  convertirMes(){
    let month = 0
    switch (this.id_mes_cc) {
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
