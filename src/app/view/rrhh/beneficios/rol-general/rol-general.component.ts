import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { RolGeneralEmplService } from './rol-general-empl.service';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { rolinterface } from './rolinterface ';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { ModalProgramaComponent } from './modal-programa/modal-programa.component';
import { DetallesRolComponent } from './detalles-rol/detalles-rol.component';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { GeneralService } from 'src/app/services/general.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';




import * as moment from 'moment'
import { AnyForUntypedForms } from '@angular/forms';
import { OneDimension } from '@syncfusion/ej2-angular-barcode-generator';


@Component({
standalone: false,
  selector: 'app-rol-general',
  templateUrl: './rol-general.component.html',
  styleUrls: ['./rol-general.component.scss'],
  styles: [`
  :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      position: -webkit-sticky;
      position: sticky;
      top: 5rem;
  }

  .layout-news-active :host ::ng-deep .p-datatable tr > th {
      top: 7rem;
  }
`]
})
export class RolGeneralComponent implements OnInit {

  @ViewChild(DataTableDirective)
  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  permiso_ver: any = "0";
  empresLogo: any;
  permisions: any;
  rolgeneralempleado: any = [];

  vmButtons: any = [];
  RolGeneral: any = [];
  customers: any = [];

  cmb_periodo: any[] = []
  cmb_meses: any[] = []

  dataGeneral: any = []

  mes_actual: any = 0;
  mes: any = 45;
  AnioAsistencia: any = moment().format('YYYY');
  //AnioAsistencia: Date = new Date();
  tipoContrato: any = 0
  codigo_cuenta_contable: any = ''
  descripcion_cuenta: any =''

  codigo_presupuesto: any = ''

  locality: any;

  loading: boolean;
  cols: any[];
  excelData: any = []
  tipoContratos: any = [];

  totalRecords: any = 0

  num_control: any

  // tipoPagoSueldo = [
  //   {value: "Q",label: "Quincena"},
  //   {value: "M",label: "Fin de mes"},
  // ]
  tipoPagoSueldo = []
  tipoPago: any

  programa: any = ''
  departamento: any = 0
  fk_programa: any = 0
  areas: any = []
  area: any = 0
  departamentos: any = []

  numero_empleados: any = 0
  numero_control: any = 0
  pendientes_numero_control: any = 0
  cant_orden_pago: any = 0
  pendientes_orden_pago: any = 0

  checked: any = false
  paginate: any
  cuenta: any

  lastRecord: number|null = null


  constructor(
    private commonService: CommonService,
    private rolgeneralemplService: RolGeneralEmplService,
    private toastr: ToastrService,private excelService: ExcelService,
    private modalService: NgbModal,
    private commonVarSrv: CommonVarService,
    private xlsService: XlsExportService,
    private generalService: GeneralService,
    private cierremesService: CierreMesService,) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    this.rolgeneralemplService.cuentasContables$.subscribe(
      (res) => {

        console.log(res);
        if (res['validacion']) {
          //this.grupo.id_cuenta_contable = res['data']['id'];
          this.codigo_cuenta_contable = res['data']['codigo'];
          this.descripcion_cuenta = res['data']['nombre'];

        }

      }
    )
    this.commonVarSrv.modalProgramArea.subscribe(
      (res)=>{
        this.programa = res.nombre
        this.fk_programa = res.id_nom_programa
        this.cargarAreas()
      }
    )
  }

  ngOnInit(): void {

   // this.AnioAsistencia = moment(new Date()).format('YYYY');
    this.mes_actual = Number(moment(new Date()).format('MM'));

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }
    this.cols = [];

    this.vmButtons = [

      { orig: "btnsConsultRol_general", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "Procesar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsConsultRol_general", paramAccion: "", boton: { icon: "fa fa-search", texto: "Consultar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-action boton btn-sm", habilitar: false },
      { orig: "btnsConsultRol_general", paramAccion: "", boton: { icon: "fa fa-check", texto: "Aprobar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-help boton btn-sm", habilitar: true },
      // { orig: "btnsConsultRol_general", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GENERAR ORDEN" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true },
      { orig: "btnsConsultRol_general", paramAccion: "", boton: { icon: "far fa-close", texto: "Anular Orden" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-mostrar boton btn-sm", habilitar: true },
      { orig: "btnsConsultRol_general", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "Pdf" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true },
      { orig: "btnsConsultRol_general", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "Excel" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsConsultRol_general", paramAccion: "", boton: { icon: "fas fa-trash-alt", texto: "Eliminar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-sm btn-danger boton btn-sm", habilitar: true },
      { orig: "btnsConsultRol_general", paramAccion: "", boton: { icon: "fas fa-eraser", texto: "Limpiar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-sm btn-warning boton btn-sm", habilitar: false },

    ];

    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;

    //this.AnioAsistencia = moment(new Date()).format('YYYY');
    this.mes_actual = Number(moment(new Date()).format('MM'));

    let data = {
      id: 2,
      codigo: myVarGlobals.fRolGeneral,
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

    setTimeout(()=> {
      this. getTipoContratos();
      this.cargaInicial();
    }, 50);
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


  formatNumber(params) {
    this.locality = 'en-EN';
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 2
    })
    params = params.replace(/[,.]/g, function (m) {
      return m === ',' ? '.' : ',';
    });
    return params;
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "Procesar":
        // let sinNumControl = this.RolGeneral.filter(e => e.tiene_control==false)
        // if(sinNumControl.length > 0){
        //   this.toastr.info('Ya existe un proceso generado, para volver a procesar elimine los registros')
        // }else{
          this.validaProcesarRoles();
        //}

      break;
      case "Aprobar":
      this.setAprobarRol();
      break;
      case "Consultar":
        this.GenerarConsultaNomina();
        break;
      // case "GENERAR ORDEN":
      //   this.GenerarOrden();
      //   break;
      case "Anular Orden":
        this.AnularOrden();
        break;
      case "Excel":
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-print' ).trigger();
        this.btnExportarExcelNuevo()
        //this.btnExportarExcel()
        break;
      case "Pdf":
        this.btnExportPdf()
        //$('#tablaConsultCjChica').DataTable().button( '.buttons-pdf' ).trigger();
        break;
      case "Eliminar":
        this.eliminarRolGeneral();
        break;
      case "Limpiar":
        this.limpiarForm();
        break;
    }
  }

  async cargaInicial() {
    try {

      const resPeriodos = await this.rolgeneralemplService.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos

      const resMeses = await this.generalService.getCatalogoKeyWork('MES') as any
      const resTipoPago = await this.generalService.getCatalogoKeyWork('TDP') as any
      console.log(resMeses)
      this.cmb_meses = resMeses.data
      this.tipoPagoSueldo = resTipoPago.data

    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }


  async validaProcesarRoles() {

    let data = {
      "anio": this.AnioAsistencia,
      "mes": this.convertirMes()
    }

    this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
        try {
          if (res["data"][0].estado !=='C') {
            let resp = await this.validaDataGlobal().then((respuesta) => {
              if(respuesta) {
                  this.getDiasTrabajadosPeriodo();
              }
            });
          } else {

              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
          }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });

  }

validaDataGlobal() {
  let flag = false;
  return new Promise((resolve, reject) => {

    if(
      this.AnioAsistencia == undefined
    ) {
      this.toastr.info("El campo Año no puede ser vacio");
      flag = true;
    }
    else if (
      this.tipoContrato == 0 ||
      this.tipoContrato == undefined
    ){
      this.toastr.info("Debe seleccionar un Tipo de Contrato");
      flag = true;
    }
    else if(this.tipoPago == 0 ||
      this.tipoPago == undefined ){
        this.toastr.info("Debe seleccionar un tipo de pago");
        flag = true;
    }

    !flag ? resolve(true) : resolve(false);
  })
}


setAprobarRol(){
  let empleadosCheck= this.RolGeneral.filter(e => e.aprobar==true && e.tiene_control === false)
  let empleadosValorNegativo= this.RolGeneral.filter(e => e.total_diferencia < 0)
  if(this.AnioAsistencia ==undefined ){
    this.toastr.info('Debe seleccionar un Año');
  }
  // else if(this.mes_actual==undefined || this.mes_actual==0){
  //   this.toastr.info('Debe seleccionar un Mes');
  // }
  else if(this.mes==undefined || this.mes==0 || this.mes==null){
    this.toastr.info('Debe seleccionar un Mes');
  }
  else if(this.tipoContrato==undefined || this.tipoContrato==0){
    this.toastr.info('Debe seleccionar un Tipo de Contrato');
  }
  else if(empleadosCheck.length == 0){
    this.toastr.info('Debe seleccionar al menos un registro');
  }
  else if(empleadosValorNegativo.length > 0){
    this.toastr.info('No se puede aprobar con valores negativos, por favor revise las lineas sombreadas en rojo');
  }
  // else if(this.codigo_cuenta_contable==undefined || this.codigo_cuenta_contable==0 || this.codigo_cuenta_contable ==""){
  //   this.toastr.info('Debe seleccionar una Cuenta Contable');
  // }
  else{


    console.log(empleadosCheck)
    let data = {
      // anio: Number(moment(this.AnioAsistencia).format('YYYY')),
      anio: Number(this.AnioAsistencia),
      //mes: Number(this.mes_actual),
      mes: this.convertirMes(),
      tipo_contrato: this.tipoContrato,
      //cuenta_contable: this.codigo_cuenta_contable,
      tipo_pago: this.tipoPago,
      empleados: empleadosCheck
    }

    this.lcargando.ctlSpinner(true);
    this.rolgeneralemplService.aprobarRol(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      Swal.fire({
        icon: "success",
        title: "Se ha procesado con éxito",
        //text: res['message'],
        showCloseButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8',
    })
    this.GenerarConsultaNomina()
    },error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    });
  }
}


  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; }

  GenerarConsultaNomina() {

    if( this.AnioAsistencia == undefined ) {
      this.toastr.info("El campo Año no puede ser vacio");
    }
    else if (this.mes == 0 || this.mes == undefined ){
      this.toastr.info("Debe seleccionar un Mes");
    }
    else if (this.tipoContrato == 0 || this.tipoContrato == undefined ){
      this.toastr.info("Debe seleccionar un Tipo de Contrato");
    }
    else if(this.tipoPago == 0 || this.tipoPago == undefined ){
      this.toastr.info("Debe seleccionar un Tipo de pago");
    }else{
      this.mensajeSpiner = "Consultando ...";
      this.lcargando.ctlSpinner(true);
      this.RolGeneral = []
      this.cols = []
      this.totalRecords = 0
      let tipo = ["INGRESO","EGRESO","PROVISIONES"]
      let Data = []
      let anio;

      if (typeof this.AnioAsistencia == 'string') {
        anio = this.AnioAsistencia;
      } else {
        //anio = moment(this.AnioAsistencia).format('YYYY');
        //anio = this.AnioAsistencia.getFullYear();
        anio = this.AnioAsistencia;
      }
      if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
      if(this.departamento==null) { this.departamento=0 }
      if(this.area==null) { this.area=0 }

      let dataRolGeneral = {

        id_empresa: this.dataUser.id_empresa,
        anio: anio,
       // mes: Number(this.mes_actual),
        mes: this.convertirMes(),
        tipo_contrato: this.tipoContrato,
        tipo_nomina:this.tipoPago ,
        id_programa: this.fk_programa,
        id_area: this.area,
        id_departamento: this.departamento
      }

      this.rolgeneralemplService.GenerarNominaRolGeneral(dataRolGeneral).subscribe((result: any) => {
        console.log(result);

        this.lcargando.ctlSpinner(false);
        if(result.length > 0){
          this.vmButtons[2].habilitar = false;
          this.vmButtons[6].habilitar = false;
          this.vmButtons[7].habilitar = false;
          this.lcargando.ctlSpinner(false);
          this.totalRecords = result.length
         // console.log(result.length)

          const distintosRegistros = Array.from(new Set(
            result.map(usuario => `${usuario.codigo_rubro}-${usuario.id_catalogo_tipo_rubro}-${usuario.rub_descripcion}-${usuario.orden}`)
          )).map((clave: any) => {
            const [codigo_rubro, id_catalogo_tipo_rubro, rub_descripcion, orden] = clave.split('-');
            return { codigo_rubro, id_catalogo_tipo_rubro, rub_descripcion, orden };
          });

          let cabeceraIngresos = []
          let cabeceraEgresos = []
          let cabeceraProvisiones = []
          cabeceraIngresos = distintosRegistros.filter(e => e.id_catalogo_tipo_rubro == 'INGRESO' )
          cabeceraEgresos = distintosRegistros.filter(e => e.id_catalogo_tipo_rubro == 'EGRESO' )
          cabeceraProvisiones = distintosRegistros.filter(e => e.id_catalogo_tipo_rubro == 'PROVISIONES' )

          this.dataGeneral = result

          Data = result;
          // var objetoRol = {};
          this.cols = [
            { field: 'linea', header: '#', order: 1, class: "",total: 0 , tipo: ''},
            { field: 'nro_control', header: 'No. Control', order: 2, class: "",total: 0,tipo: '' },
            { field: 'nro_orden_pago', header: 'No. OP', order: 3, class: "",total: 0,tipo: '' },
            { field: 'cedula', header: 'Cédula', order: 4, class: "one" ,total: 0,tipo: 'link'},
            { field: 'id_persona', header: 'Id Persona', order: 5, class: "one",total: 0,tipo: ''},
            { field: 'full_name', header: 'Empleado', order: 6, class: "one",total: 0,tipo: '' },
            { field: 'programa_nombre', header: 'Programa', order: 7, class: "one",total: 0,tipo: '' },
            { field: 'area_nombre', header: 'Dirección', order: 8, class: "one",total: 0 ,tipo: ''},
            { field: 'dep_nombre', header: 'Departamento', order: 9, class: "one",total: 0,tipo: '' },
            { field: 'dias_trabajados', header: 'Días Trabajados', order: 10, class: "one",total: 0,tipo: '' },
            { field: 'horas_trabajadas', header: 'Horas Trabajadas', order: 11, class: "",total: 0,tipo: '' },
            { field: 'salario', header: 'Sueldo Nominal', order: 12, class: "two",total: 0,tipo: '' },
          ]

          let order = 12
          for ( let i = 0; i < cabeceraIngresos.length; i++){
            this.cols.push(
                      { field: cabeceraIngresos[i].codigo_rubro + cabeceraIngresos[i].id_catalogo_tipo_rubro, header: cabeceraIngresos[i].rub_descripcion, order: order + 1, class: "two", tipo: cabeceraIngresos[i].id_catalogo_tipo_rubro,total: 0 },
            )
            order++
          }

          this.cols.push(
            { field: 'total_ingresos', header: 'Total Ingresos', order: order +1 , class: "two" ,total: 0},
          )
          order++

          for ( let i = 0; i < cabeceraEgresos.length; i++){
            this.cols.push(
                      { field: cabeceraEgresos[i].codigo_rubro + cabeceraEgresos[i].id_catalogo_tipo_rubro, header: cabeceraEgresos[i].rub_descripcion, order: order + 1, class: "two", tipo: cabeceraEgresos[i].id_catalogo_tipo_rubro,total: 0 },
            )
            order++
          }
          this.cols.push(
            {  field: 'total_egresos', header: 'Total Egresos', order: order + 1, class: "two" ,total: 0},
            {   field: 'total_diferencia', header: 'Total a Recibir', order: order +2 , class: "two",total: 0 },
          )
          order++
          order++

          for ( let i = 0; i < cabeceraProvisiones.length; i++){
            this.cols.push(
                      { field: cabeceraProvisiones[i].codigo_rubro + cabeceraProvisiones[i].id_catalogo_tipo_rubro, header: cabeceraProvisiones[i].rub_descripcion, order: order + 1, class: "two", tipo: cabeceraProvisiones[i].id_catalogo_tipo_rubro,total: 0 },
            )
            order++
          }

          this.cols.push(
            { field: 'total_provisiones', header: 'Total Provisiones', order: order +1 , class: "two" ,total: 0},
          )
          let encabezado = this.cols.filter(e => e.order > 9)




          //console.log(this.cols);

          for(let a = 0; a< tipo.length;a++){

            let arrayTipo = this.cols.filter(co => co.id_catalogo_tipo_rubro == tipo[a]);
            console.log(arrayTipo);
          }
          //this.cols.splice(1, 0, { field: 'total_ingreso', header: 'TOTAL INGRESOS', order: 4, class: "one" });
          //console.log(this.RolGeneral)
         // console.log(Data)
          let linea = 0

          for (let i = 0; i < Data.length; i++) {
            /*arreglo detall de rol */
            let rol = this.RolGeneral.filter(rol => rol.id_persona == Data[i].id_persona);
           // console.log(rol)

          let valoresColumnas = this.cols.filter(col => col.field === Data[i].codigo_rubro + Data[i].id_catalogo_tipo_rubro);
          // console.log('primero')
          // console.log(valoresColumnas[0])
          // console.log(Data[i].valor)

          if(valoresColumnas.length > 0){
            valoresColumnas.forEach(e =>{
              e.total += parseFloat(Data[i].valor)
            })
          }
          // console.log('segundo')
          // console.log(valoresColumnas[0])

           if (rol.length == 0) {
              linea++;
              this.numero_empleados = linea
              let objetoRol = {}
              objetoRol['linea'] = String(linea);
              objetoRol['aprobar'] =Data[i].num_control != ''? true: false;
              objetoRol['tiene_control'] =Data[i].num_control != ''? true: false;
              objetoRol['tiene_op'] =Data[i].num_orden_pago != ''? true: false;
              objetoRol['nro_control'] = Data[i].num_control;
              objetoRol['nro_orden_pago'] =  Data[i].num_orden_pago;
              objetoRol['id_persona'] = Data[i].id_persona;
              objetoRol['full_name'] = Data[i].emp_full_nombre;
              objetoRol['cedula'] = Data[i].emp_identificacion;
              objetoRol['programa_nombre'] = Data[i].programa_nombre;
              objetoRol['area_nombre'] = Data[i].area_nombre;
              objetoRol['dep_nombre'] = Data[i].dep_nombre;
              objetoRol['dias_trabajados'] = Data[i].dias_trabajados;
              objetoRol['horas_trabajadas'] = Data[i].horas_trabajadas;
              objetoRol['salario'] = parseFloat((Data[i].sld_salario_minimo));

              for ( let i = 0; i < cabeceraIngresos.length; i++){

                objetoRol[cabeceraIngresos[i].codigo_rubro + cabeceraIngresos[i].id_catalogo_tipo_rubro] =0;

              }
              objetoRol['total_ingresos'] = 0;

              for ( let i = 0; i < cabeceraEgresos.length; i++){

                objetoRol[cabeceraEgresos[i].codigo_rubro + cabeceraEgresos[i].id_catalogo_tipo_rubro] =0;

              }
              objetoRol['total_egresos'] = 0;
              objetoRol['total_diferencia'] = 0;



              for ( let i = 0; i < cabeceraProvisiones.length; i++){

                objetoRol[cabeceraProvisiones[i].codigo_rubro + cabeceraProvisiones[i].id_catalogo_tipo_rubro] =0;

              }
              objetoRol['total_provisiones'] = 0;

              objetoRol[Data[i].codigo_rubro + Data[i].id_catalogo_tipo_rubro] = parseFloat(Data[i].valor);

              this.RolGeneral.push(objetoRol);



            } else {
              rol[0][Data[i].codigo_rubro + Data[i].id_catalogo_tipo_rubro] = parseFloat(Data[i].valor);

              // objetoRol = {};
            }
           //  console.log(this.RolGeneral)

          }
          console.log(this.cols)
          console.log(Data)
          this.RolGeneral.forEach(e => {
            let totalIngresos  = 0
            let totalEgresos = 0
            let totalProvisiones = 0
            let rol = Data.filter(rol => rol.id_persona == e.id_persona);
            console.log(rol)
              rol.forEach(f => {
                if(f.id_catalogo_tipo_rubro == 'INGRESO'){
                  totalIngresos += parseFloat(f.valor)
                }
                if(f.id_catalogo_tipo_rubro == 'EGRESO'){
                  totalEgresos += parseFloat(f.valor)
                }
                if(f.id_catalogo_tipo_rubro == 'PROVISIONES'){
                  totalProvisiones += parseFloat(f.valor)
                }


              })


              Object.assign(e, {total_ingresos:this.commonService.formatNumberDos(totalIngresos)/* totalIngresos.toFixed(2)*/ ,total_egresos:this.commonService.formatNumberDos(totalEgresos) /*totalEgresos.toFixed(2)*/, total_diferencia: totalIngresos - totalEgresos, total_provisiones:totalProvisiones.toFixed(2)  })
          });
            let totalesSalario = this.RolGeneral.reduce((suma: number, x: any) => suma + parseFloat(x.salario), 0)

            let totalesIngresos = this.RolGeneral.reduce((suma: number, x: any) => suma + parseFloat(x.total_ingresos), 0)
            let totalesEgresos =  this.RolGeneral.reduce((suma: number, x: any) => suma +  parseFloat(x.total_egresos), 0)
            let totalesDiferencia =  this.RolGeneral.reduce((suma: number, x: any) => suma +   parseFloat(x.total_diferencia), 0)
            let totalesProvisiones =  this.RolGeneral.reduce((suma: number, x: any) => suma +   parseFloat(x.total_provisiones), 0)


            console.log(totalesIngresos)
            console.log(totalesEgresos)
            console.log(totalesDiferencia)
            let valoresColumnasSal = this.cols.filter(col => col.field === 'salario');
            if(valoresColumnasSal.length > 0){
              valoresColumnasSal.forEach(e =>{
                e.total = parseFloat(totalesSalario)
              })
            }

            let valoresColumnasIn = this.cols.filter(col => col.field === 'total_ingresos');
            if(valoresColumnasIn.length > 0){
              valoresColumnasIn.forEach(e =>{
                e.total = parseFloat(totalesIngresos)
              })
            }

            let valoresColumnasEg = this.cols.filter(col => col.field === 'total_egresos');
            if(valoresColumnasEg.length > 0){
              valoresColumnasEg.forEach(e =>{
                e.total = parseFloat(totalesEgresos)
              })
            }

            let valoresColumnasDif = this.cols.filter(col => col.field === 'total_diferencia');
            if(valoresColumnasDif.length > 0){
              valoresColumnasDif.forEach(e =>{
                e.total = parseFloat(totalesDiferencia)
              })
            }

            let valoresColumnasProv = this.cols.filter(col => col.field === 'total_provisiones');
            if(valoresColumnasProv.length > 0){
              valoresColumnasProv.forEach(e =>{
                e.total = parseFloat(totalesProvisiones)
              })
            }

            let lineaTotales = {}
              lineaTotales['linea'] = 'TOTAL';
              lineaTotales['nro_control'] = '';
              lineaTotales['nro_orden_pago'] = '';
              lineaTotales['id_persona'] = '';
              lineaTotales['full_name'] ='';
              lineaTotales['cedula'] ='';
              lineaTotales['programa_nombre'] = '';
              lineaTotales['area_nombre'] = '';
              lineaTotales['dep_nombre'] = '';
              lineaTotales['dias_trabajados'] ='';
              lineaTotales['horas_trabajadas'] ='';
              lineaTotales['salario'] ='';

              for ( let i = 0; i < cabeceraIngresos.length; i++){

                lineaTotales[cabeceraIngresos[i].codigo_rubro + cabeceraIngresos[i].id_catalogo_tipo_rubro] =0;

              }
              lineaTotales['total_ingresos'] = 0;

              for ( let i = 0; i < cabeceraEgresos.length; i++){

                lineaTotales[cabeceraEgresos[i].codigo_rubro + cabeceraEgresos[i].id_catalogo_tipo_rubro] =0;

              }
              lineaTotales['total_egresos'] = 0;
              //lineaTotales['total_diferencia'] = 0;

              for ( let i = 0; i < cabeceraProvisiones.length; i++){

                lineaTotales[cabeceraProvisiones[i].codigo_rubro + cabeceraProvisiones[i].id_catalogo_tipo_rubro] =0;

              }
              lineaTotales['total_provisiones'] = 0;

              for(let i = 8; i < this.cols.length; i++){
                lineaTotales[this.cols[i].field] = parseFloat(this.cols[i].total);
                console.log(lineaTotales[this.cols[i].field])
              }
              console.log(lineaTotales)

              this.RolGeneral.push(lineaTotales);
              let totalDiferenciaNegativo =  this.RolGeneral.filter(e=>e.total_diferencia < 0)
              if(totalDiferenciaNegativo.length > 0 ){
                this.toastr.error('Hay valores negativos, por favor revisar')
              }
              console.log(this.RolGeneral)

          // return
          //console.log(this.RolGeneral)
          this.vmButtons[3].habilitar = false;
          this.vmButtons[5].habilitar = false;
          this.vmButtons[4].habilitar = false;

          let sinAprobar = this.RolGeneral.filter(e => e.tiene_control == false)
          if(sinAprobar.length > 0){
            this.vmButtons[2].habilitar = false;
          }else {
            this.vmButtons[2].habilitar = true;
          }

          let sinOp = this.RolGeneral.filter(e => e.tiene_op == false)
          if(sinOp.length > 0){
            this.vmButtons[3].habilitar = false;
          }else {
            this.vmButtons[3].habilitar = true;
          }
        }else{
          this.lcargando.ctlSpinner(false);
          this.toastr.info('No hay registros para esta consulta')
        }



      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
      this.loading = false;
    }

  }

  handleColumnCheck(event: any, data: any) {
    console.log(event.target.checked)
    console.log(data)
    this.RolGeneral.forEach(e => {

      if(event.target.checked ){
        Object.assign(e, {aprobar: event.target.checked})
      }else{
        if(e.tiene_control != true){
          Object.assign(e, {aprobar: false})
        }
      }
     });
     console.log(this.RolGeneral)
  }

  handleRowCheck(event, data: any) {
    console.log(event.target.checked)
    console.log(data)
    console.log(this.RolGeneral)
   this.RolGeneral.forEach(e => {
    if(e.linea == data.linea){
      Object.assign(e, {aprobar: event.target.checked})
    }
   });

   console.log(this.RolGeneral)


  }


  GenerarOrden(){
    let empleadosValorNegativo= this.RolGeneral.filter(e => e.total_diferencia < 0)

    let empleadosSinOrden= this.RolGeneral.filter(e => e.aprobar == true && e.tiene_control == true && e.tiene_op == false)
    if(this.AnioAsistencia ==undefined ){
      this.toastr.info('Debe seleccionar un Año');
    }
    // else if(this.mes_actual==undefined || this.mes_actual==0){
    //   this.toastr.info('Debe seleccionar un Mes');
    // }
    else if(this.mes==undefined || this.mes==0 || this.mes==null){
      this.toastr.info('Debe seleccionar un Mes');
    }
    else if(this.tipoContrato==undefined || this.tipoContrato==0){
      this.toastr.info('Debe seleccionar un Tipo de Contrato');
    }
    else if(this.codigo_cuenta_contable==undefined || this.codigo_cuenta_contable==0 || this.codigo_cuenta_contable ==""){
      this.toastr.info('Debe seleccionar una Cuenta Contable');
    }
    else if(empleadosValorNegativo.length > 0){
      this.toastr.info('No se puede generar ordenes con valores negativos, por favor revise las lineas sombreadas en rojo');
    }
    else if(empleadosSinOrden.length == 0){
      this.toastr.info('Ya fueron generadas las ordenes de pago');
    }


    else{

      let data = {

        //anio: Number(moment(this.AnioAsistencia).format('YYYY')),
        anio: Number(this.AnioAsistencia),
        //mes: Number(this.mes_actual),
        mes: this.convertirMes(),
        tipo_contrato: this.tipoContrato,
        cuenta_contable: this.codigo_cuenta_contable,
        codigo_presupuesto : this.codigo_presupuesto,
        tipo_pago: this.tipoPago
      }

      this.lcargando.ctlSpinner(true);
      this.rolgeneralemplService.generarOrdenesPago(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Se ha procesado con éxito",
          //text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
      })
      this.GenerarConsultaNomina()
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
  }

  AnularOrden(){



      let data = {
        num_control: this.num_control

      }

      this.lcargando.ctlSpinner(true);
      this.rolgeneralemplService.anularOrdenesPago(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Se ha procesado con éxito",
          //text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
      })
      this.GenerarConsultaNomina()
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });

  }

  btnExportarExcel() {

    console.log(this.RolGeneral)
    this.mensajeSpiner = "Generando Archivo Excel...";
    this.lcargando.ctlSpinner(true);


         this.excelData = [];
        // console.log(this.RolGeneral);

           Object.keys(this.RolGeneral).forEach(key => {
            let totalIngresos  = 0
            let totalEgresos = 0
            let rol = this.dataGeneral.filter(rol => rol.id_persona == this.RolGeneral[key].id_persona);

            rol.forEach(f => {
              if(f.id_catalogo_tipo_rubro == 'INGRESO'){
                totalIngresos += parseFloat(f.valor)
              }
              if(f.id_catalogo_tipo_rubro == 'EGRESO'){
                totalEgresos += parseFloat(f.valor)
              }

            })

            //Object.assign(this.RolGeneral[key], {total_ingresos: totalIngresos.toFixed(2) ,total_egresos: totalEgresos.toFixed(2), total_diferencia: Math.floor(totalIngresos - totalEgresos).toFixed(2) })

             let filter_values = {};
             filter_values['#'] = this.RolGeneral[key].linea;
             filter_values['No. Control'] = (this.RolGeneral[key].nro_control != null) ? this.RolGeneral[key].nro_control: "";
             filter_values['No. Orden Pago'] = (this.RolGeneral[key].nro_orden_pago != null) ? this.RolGeneral[key].nro_orden_pago: "";
             filter_values['Cédula'] = this.RolGeneral[key].cedula;
             filter_values['Id Persona'] = (this.RolGeneral[key].id_persona != null) ? this.RolGeneral[key].id_persona : "";
             filter_values['Empleado'] = (this.RolGeneral[key].full_name != null) ? this.RolGeneral[key].full_name : "";
             filter_values['Programa'] = (this.RolGeneral[key].programa_nombre != null) ? this.RolGeneral[key].programa_nombre : "";
             filter_values['Dirección'] = (this.RolGeneral[key].area_nombre != null) ? this.RolGeneral[key].area_nombre : "";
             filter_values['Departamento'] = (this.RolGeneral[key].dep_nombre != null) ? this.RolGeneral[key].dep_nombre : "";
             filter_values['Días Trabajados'] = (this.RolGeneral[key].dias_trabajados != null) ? this.RolGeneral[key].dias_trabajados : "";
             filter_values['Horas Trabajadas'] = (this.RolGeneral[key].horas_trabajadas != null) ? this.RolGeneral[key].horas_trabajadas : "";
             filter_values['Sueldo Nominal'] = (this.RolGeneral[key].salario != null) ? this.RolGeneral[key].salario : "0.00";
             filter_values['Sueldos'] = (this.RolGeneral[key].SUELINGRESO != null) ? this.RolGeneral[key].SUELINGRESO : "0.00";
              if(this.RolGeneral[key].HE25INGRESO != null){
                filter_values['Horas Extra 25'] = (this.RolGeneral[key].HE25INGRESO != null) ? this.RolGeneral[key].HE25INGRESO : "0.00";
              }
              if(this.RolGeneral[key].HE50INGRESO != null){
                filter_values['Horas Extra 50'] = (this.RolGeneral[key].HE50EGRESO != null) ? this.RolGeneral[key].HE50EGRESO : "0.00";
              }
              if(this.RolGeneral[key].HE60INGRESO != null){
                filter_values['Horas Extra 60'] = (this.RolGeneral[key].HE60INGRESO != null) ? this.RolGeneral[key].HE60INGRESO : "0.00";
              }
              if(this.RolGeneral[key].HE100INGRESO  != null){
                filter_values['Horas Extra 100'] = (this.RolGeneral[key].HE100INGRESO != null) ? this.RolGeneral[key].HE100INGRESO : "0.00";
              }
              if(this.RolGeneral[key].IESSIINGRESO != null){
                filter_values['Iess Aporte Personal (I)'] = (this.RolGeneral[key].IESSIINGRESO != null) ? this.RolGeneral[key].IESSIINGRESO : "0.00";
              }
              if(this.RolGeneral[key].SUELVAINGRESO != null){
               filter_values['Variable'] = (this.RolGeneral[key].SUELVAINGRESO != null) ? this.RolGeneral[key].SUELVAINGRESO : "0.00";
              }
              if(this.RolGeneral[key].DECITINGRESO != null){
                filter_values['Decimo Tercero Mensualizados'] = (this.RolGeneral[key].DECITINGRESO != null) ? this.RolGeneral[key].DECITINGRESO : "0.00";
              }
              if(this.RolGeneral[key].DECICINGRESO != null){
                filter_values['Decimo Cuarto Sueldo Mensualizado'] = (this.RolGeneral[key].DECICINGRESO != null) ? this.RolGeneral[key].DECICINGRESO : "0.00";
              }

              if(this.RolGeneral[key].FDRESINGRESO != null){
                filter_values['Fondos De Reserva'] = (this.RolGeneral[key].FDRESINGRESO != null) ? this.RolGeneral[key].FDRESINGRESO : "0.00";
              }
              if(this.RolGeneral[key].ENCARINGRESO != null){
                filter_values['Encargo'] = (this.RolGeneral[key].ENCARINGRESO != null) ? this.RolGeneral[key].ENCARINGRESO : "0.00";
              }
              if(this.RolGeneral[key].SUBROINGRESO != null){
                filter_values['Subrogación'] = (this.RolGeneral[key].SUBROINGRESO != null) ? this.RolGeneral[key].SUBROINGRESO : "0.00";
              }
              if(this.RolGeneral[key].COMVINGRESO != null){
                filter_values['Comisiones En Ventas'] = (this.RolGeneral[key].COMVINGRESO != null) ? this.RolGeneral[key].COMVINGRESO : "0.00";
              }
              if(this.RolGeneral[key].QUIAINGRESO != null){
                filter_values['Anticipo de Quincena (I)'] = (this.RolGeneral[key].QUIAINGRESO != null) ? this.RolGeneral[key].QUIAINGRESO : "0.00";
              }

              //filter_values['Total Ingresos'] = totalIngresos
              filter_values['Total Ingresos'] = (this.RolGeneral[key].total_ingresos != null) ? parseFloat(this.RolGeneral[key].total_ingresos) : "0.00";

              if(this.RolGeneral[key].PRESEGRESO != null){
                filter_values['Préstamos Internos'] = (this.RolGeneral[key].PRESEGRESO != null) ? this.RolGeneral[key].PRESEGRESO : "0.00";
              }
              if(this.RolGeneral[key].IESSEEGRESO != null){
                filter_values['Iess Aporte Personal'] = (this.RolGeneral[key].IESSEEGRESO != null) ? this.RolGeneral[key].IESSEEGRESO : "0.00";
              }
              if(this.RolGeneral[key].RETJUDEGRESO != null){
                filter_values['Retencion Judicial'] = (this.RolGeneral[key].RETJUDEGRESO != null) ? this.RolGeneral[key].RETJUDEGRESO : "0.00";
              }
              if(this.RolGeneral[key].PREHIPEGRESO != null){
                filter_values['Préstamos Hipotecarios'] = (this.RolGeneral[key].PREHIPEGRESO != null) ? this.RolGeneral[key].PREHIPEGRESO : "0.00";
              }
              if(this.RolGeneral[key].PREQUIEGRESO != null){
                filter_values['Préstamos Quirografarios'] = (this.RolGeneral[key].PREQUIEGRESO != null) ? this.RolGeneral[key].PREQUIEGRESO : "0.00";
              }
              if(this.RolGeneral[key].MULEGRESO != null){
                filter_values['Multas'] = (this.RolGeneral[key].MULEGRESO != null) ? this.RolGeneral[key].MULEGRESO : "0.00";
              }
              if(this.RolGeneral[key].IMRENTAEGRESO != null){
                filter_values['Impuesto A La Renta (E)'] = (this.RolGeneral[key].IMRENTAEGRESO != null) ? this.RolGeneral[key].IMRENTAEGRESO : "0.00";
              }

              //filter_values['Total Egresos'] = totalEgresos
              filter_values['Total Egresos'] = (this.RolGeneral[key].total_egresos != null) ? parseFloat(this.RolGeneral[key].total_egresos) : "0.00";

             //filter_values['Total a Recibir'] = totalIngresos - totalEgresos

              filter_values['Total a Recibir'] = (this.RolGeneral[key].total_ingresos != null && this.RolGeneral[key].total_egresos != null) ?   this.RolGeneral[key].total_ingresos  - this.RolGeneral[key].total_egresos : "0.00"

              if(this.RolGeneral[key].DECITPROVISIONES != null){
                filter_values['Decimo Tercer Sueldo Provision'] = (this.RolGeneral[key].DECITPROVISIONES != null) ? this.RolGeneral[key].DECITPROVISIONES : "0.00";
              }
              if(this.RolGeneral[key].DECICPROVISIONES != null){
                filter_values['Decimo Cuarto Sueldo Provision'] = (this.RolGeneral[key].DECICPROVISIONES != null) ? this.RolGeneral[key].DECICPROVISIONES : "0.00";
              }
              if(this.RolGeneral[key].IESSPPROVISIONES != null){
                filter_values['Iess Aporte Patronal'] = (this.RolGeneral[key].IESSPPROVISIONES != null) ? this.RolGeneral[key].IESSPPROVISIONES : "0.00";
              }

             // console.log(filter_values)

             this.excelData.push(filter_values);
             console.log(this.excelData)
             this.lcargando.ctlSpinner(false);
           })
           console.log(this.excelData)
           this.exportAsXLSX();

   }

   exportAsXLSX() {
     this.excelService.exportAsExcelFile(this.excelData, 'Reporte Rol General');
   }

   btnExportarExcelNuevo(){

    this.RolGeneral.forEach(e => {
      Object.assign(e, {
        total_ingresos: parseFloat(e.total_ingresos),
        total_egresos: parseFloat(e.total_egresos),
        total_provisiones: parseFloat(e.total_provisiones)
      })
    });
    if (this.cols.length > 0) {
        let data = {
          title: 'Rol General',
          cols: this.cols,
          rows: this.RolGeneral
        }
        this.xlsService.exportExcelRolGeneral(data, 'Rol General')
      } else {
      }
   }

   btnExportPdf(){
    let numeroControl= '0'
    console.log(numeroControl)
    console.log(this.num_control)
    console.log(this.lastRecord)
    if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
    if(this.departamento==null) { this.departamento=0 }
    if(this.area==null) { this.area=0 }
    if(this.lastRecord ==undefined || String(this.lastRecord) ==''){
      numeroControl= '0'
      this.num_control = undefined
    }
    if(this.num_control == undefined || this.num_control == '' ){
      numeroControl= '0'
    }else {
      numeroControl = this.num_control

    }
    if(this.tipoPago == undefined){this.tipoPago=0}
    //console.log(this.programa)
    //console.log(this.departamento)
    //console.log(this.area)
    console.log(numeroControl)
    console.log(this.num_control)
    window.open(environment.ReportingUrl + "rpt_rol_general.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=" + this.dataUser.id_empresa +"&anio=" + this.AnioAsistencia + "&mes=" + this.convertirMes() + "&tipo_nomina=" + this.tipoPago + "&tipo_contrato=" + this.tipoContrato + "&programa=" + this.fk_programa + "&area=" + this.area  + "&departamento=" + this.departamento +"&numero_control=" + numeroControl , '_blank')
    console.log(environment.ReportingUrl + "rpt_rol_general.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=" + this.dataUser.id_empresa +"&anio=" + this.AnioAsistencia + "&mes=" + this.convertirMes() + "&tipo_nomina=" + this.tipoPago + "&tipo_contrato=" + this.tipoContrato + "&programa=" + this.fk_programa + "&area=" + this.area  + "&departamento=" + this.departamento +"&numero_control=" + numeroControl)
  }

  getTipoContratos(){
    let data = {
      valor_cat: 'TCC',
    }
    this.rolgeneralemplService.getTipoContratos(data).subscribe((result: any) => {
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

  getDiasTrabajadosPeriodo(){
   // this.lcargando.ctlSpinner(true);
    let anio;
      if(this.tipoPago == 'Q'){
        this.GenerarNominaRolGeneralQuncenal()
      }else{

      if (typeof this.AnioAsistencia == 'string') {
        anio = this.AnioAsistencia;
      } else {
        //anio = moment(this.AnioAsistencia).format('YYYY');
        //anio = this.AnioAsistencia.getFullYear()
        anio = this.AnioAsistencia
      }

        if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
        if(this.departamento==null) { this.departamento=0 }
        if(this.area==null) { this.area=0 }

        let dataRolGeneral = {

          id_empresa: this.dataUser.id_empresa,
          anio: anio,
        // mes: this.mes_actual,
          mes: this.convertirMes(),
          id_programa: this.fk_programa,
          id_area: this.area,
          id_departamento: this.departamento

        }
        this.rolgeneralemplService.getDiasTrabajadosPeriodo(dataRolGeneral).subscribe((result: any) => {
          console.log(result);
          //let mensaje = ''
        // let noGenerados = result.filter(e => e.estado_generacion == 'no_generada')

          // if(noGenerados.length > 0){
          //   noGenerados.forEach(e => {
          //     mensaje += "El empleado "+ e.emp_full_nombre+ " no tiene dias generados<br>"
          //   });
          //    Swal.fire({
          //     icon: "warning",
          //     title: "¡Atención!",
          //     html:mensaje,
          //     showCloseButton: true,
          //     showCancelButton: true,
          //     showConfirmButton: true,
          //     cancelButtonText: "Cancelar",
          //     confirmButtonText: "Aceptar",
          //     cancelButtonColor: '#F86C6B',
          //     confirmButtonColor: '#4DBD74',
          //   })
          // }

          if(result.length > 0){

            if(this.tipoPago == 'M'){
              this.GenerarNominaRolGeneralMensual();
            }


          }else {
            this.toastr.info('No hay registros de dias trabajados para este periodo y mes');
            this.lcargando.ctlSpinner(false);
          }


        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        });
      }

  }

  GenerarNominaRolGeneralQuncenal() {

    this.lcargando.ctlSpinner(true);

    let anio;

    if (typeof this.AnioAsistencia == 'string') {
      anio = this.AnioAsistencia;
    } else {
      //anio = this.AnioAsistencia.getFullYear();
      anio = this.AnioAsistencia;
      //anio = moment(this.AnioAsistencia).format('YYYY');;
    }

    if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
    if(this.departamento==null) { this.departamento=0 }
    if(this.area==null) { this.area=0 }

    let dataRolGeneral = {

      id_empresa: this.dataUser.id_empresa,
      anio: anio,
      //mes: Number(this.mes_actual),
      mes: this.convertirMes(),
      tipo_contrato: this.tipoContrato,
      id_programa: this.fk_programa,
      id_area: this.area,
      id_departamento: this.departamento

    }

    this.rolgeneralemplService.GenerarNominaRolGeneralQuincenal(dataRolGeneral).subscribe((result: any) => {
      console.log(result);
      this.lcargando.ctlSpinner(false);
      //this.toastr.info('Se ha procesado con éxito');
      Swal.fire({
        icon: "success",
        title: "Se ha procesado con éxito",
        //text: res['message'],
        showCloseButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8',
    })
    this.vmButtons[2].habilitar = false;
    this.vmButtons[6].habilitar = false;
    this.GenerarConsultaNomina();
    this.vmButtons[1].habilitar = false;

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }
  GenerarNominaRolGeneralMensual() {

    this.lcargando.ctlSpinner(true);

    let anio;

    if (typeof this.AnioAsistencia == 'string') {
      anio = this.AnioAsistencia;
    } else {
      //anio = moment(this.AnioAsistencia).format('YYYY');
      //anio = this.AnioAsistencia.getFullYear();
      anio = this.AnioAsistencia;
    }
    if(this.programa==undefined || this.programa=='') { this.fk_programa=0 }
    if(this.departamento==null) { this.departamento=0 }
    if(this.area==null) { this.area=0 }


    let dataRolGeneral = {

      id_empresa: this.dataUser.id_empresa,
      anio: anio,
      //mes: this.mes_actual,
      mes: this.convertirMes(),
      tipo_contrato: this.tipoContrato,
      id_programa: this.fk_programa,
      id_area: this.area,
      id_departamento: this.departamento

    }

    this.rolgeneralemplService.GenerarNominaRolGeneralMensual(dataRolGeneral).subscribe((result: any) => {
      console.log(result);



      this.lcargando.ctlSpinner(false);
      //this.toastr.info('Se ha procesado con éxito');
      Swal.fire({
        icon: "success",
        title: "Se ha procesado con éxito",
        //text: res['message'],
        showCloseButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#20A8D8',
    })
    this.GenerarConsultaNomina();

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  eliminarRolGeneral(){





      Swal.fire({
        titleText: 'Eliminar registros de Rol General',
        text: 'Esta seguro/a que desea eliminar los registros generados de Rol General?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.lcargando.ctlSpinner(true);
          this.mensajeSpiner = 'Generando Datos'

          let data = {
            "anio": this.AnioAsistencia,
            "mes": this.convertirMes()
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {

              let anio;

              if (typeof this.AnioAsistencia == 'string') {
                anio = this.AnioAsistencia;
              } else {
                //anio = this.AnioAsistencia.getFullYear();
                anio = this.AnioAsistencia;
                //anio = moment(this.AnioAsistencia).format('YYYY');;
              }

              let dataRolGeneral = {

                id_empresa: this.dataUser.id_empresa,
                anio: anio,
                //mes: Number(this.mes_actual),
                mes: this.convertirMes(),
                tipo_contrato: this.tipoContrato,
                tipo_nomina: this.tipoPago

              }

              this.rolgeneralemplService.eliminarRolGeneral(dataRolGeneral).subscribe((result: any) => {
                console.log(result);
                this.lcargando.ctlSpinner(false);
                //this.toastr.info('Se ha procesado con éxito');
                Swal.fire({
                  icon: "success",
                  title: "Se ha procesado con éxito",
                  //text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
              })
              this.GenerarConsultaNomina();

              }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.message);
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
      })



  }




  AsociacionElementType(ahora: any) {


    this.locality = 'en-EN';

    if ((typeof ahora) === 'undefined') {

      let ceroElement = "0";

      ceroElement = parseFloat(ceroElement).toLocaleString(this.locality, {
        minimumFractionDigits: 2
      })
      ceroElement = ceroElement.replace(/[,.]/g, function (m) {
        return m === ',' ? '.' : ',';
      });

      return ceroElement;

    } else {

      const isNumeric = ((typeof ahora));


      if (isNumeric === 'number') {

        //console.log(ahora)

        ahora = parseFloat(ahora).toLocaleString(this.locality, {
          minimumFractionDigits: 2
        })
        // ahora = ahora.replace(/[,.]/g, function (m) {
        //   return m === ',' ? '.' : ',';
        // });

        return ahora;

      } else {
        return ahora;
      }
    }

  }
  modalCuentaContable() {
    let modal = this.modalService.open(ModalCuentPreComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true

  }

  modalPrograma(){
    let modal = this.modalService.open(ModalProgramaComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  cargarAreas() {
    this.mensajeSpiner = "Cargando listado de Áreas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      fk_programa: this.fk_programa
    }

    this.rolgeneralemplService.getAreas(data).subscribe(
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
    this.mensajeSpiner = "Cargando listado de Departamentos...";
    this.lcargando.ctlSpinner(true);

    let data = {
      id_area: this.area
    }

    this.rolgeneralemplService.getDepartamentos(data).subscribe(
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

  getCuentaContableTipoPago(){
    console.log(this.tipoContrato)

     if(this.tipoContrato == undefined || this.tipoContrato == 0){
      this.toastr.warning("Para seleccionar un Tipo de Pago primero debe escoger un Tipo de Contrato. Por favor revise")
      return;
     }
     if(this.tipoPago == undefined || this.tipoContrato == 0){
      this.toastr.warning("Debe seleccionar un Tipo de Pago. Por favor revise")
      return;
     }


    this.mensajeSpiner = "Cargando cuenta contable...";
    this.lcargando.ctlSpinner(true);
    let cuenta
    if(this.tipoPago == 'Q'){ cuenta = 'QUIA' }
    if(this.tipoPago == 'M'){cuenta = 'SUELXPAG'}

    let data = {
     tipo_pago: cuenta,
     tipo_contrato: this.tipoContrato
    }

    this.rolgeneralemplService.getConCuentasTipoPago(data).subscribe(
      (res: any) => {
        console.log(res);
        this.cuenta = res
        //this.codigo_cuenta_contable = res.data?.cuenta_inversion_hab
        this.codigo_cuenta_contable = res.data?.cuenta_acreedora
        this.codigo_presupuesto = res.data?.codigo_presupuesto

        let filter = {
          codigo: res.data?.cuenta_acreedora,
          nombre: undefined,
        }
        let data = {
          params: {
            filter: filter,
            paginate: this.paginate
          }
        }
        this.rolgeneralemplService.getConCuentas(data).subscribe(
        (res2: any) => {
          console.log(res2)
          this.descripcion_cuenta = res2?.data?.data[0]?.nombre
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
        )

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  expandDetalleRol(detalle) {
    console.log(this.dataGeneral)
    console.log(detalle)

    let rubrosEmpleado = this.dataGeneral.filter(e => e.id_persona == detalle.id_persona)

    console.log()

    const modalInvoice = this.modalService.open(DetallesRolComponent,{
      size:"lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.detalle = detalle;
    modalInvoice.componentInstance.empleado = rubrosEmpleado;
  }

  limpiarForm(){

  this.dataGeneral=  []
  //this.mes_actual = Number(moment(new Date()).format('MM'));
  this.mes = null;
  //this.AnioAsistencia=  new Date();
  //this.AnioAsistencia= '';
  this.tipoContrato=  0;
  this.codigo_cuenta_contable= '';
  this.descripcion_cuenta='';
  this.tipoPago= 0;
  this.programa= ''
  this.departamento= 0
  this.fk_programa = 0
  this.area= 0

  this.RolGeneral = []
  this.cols = []
  this.totalRecords = 0
  this.numero_empleados = 0
  this.num_control = ''
  //this.lastRecord= null
  this.vmButtons[5].habilitar = true;
  this.vmButtons[4].habilitar = true;
  }

    getRolNoControl() {

    this.lcargando.ctlSpinner(true)
    this.mensajeSpiner = 'Buscando'
    this.RolGeneral = []
    this.cols = []
    let Data = []
    let tipo = ["INGRESO","EGRESO","PROVISIONES"]
    let data = {
      num_control : this.num_control
    }
    this.rolgeneralemplService.consultaNumControl(data).subscribe((result: any) => {
      console.log(result )

      this.lcargando.ctlSpinner(false)
      if(result.length > 0){
        this.vmButtons[6].habilitar = false;
        this.lcargando.ctlSpinner(false);
        this.totalRecords = result.length
       // console.log(result.length)

        const distintosRegistros = Array.from(new Set(
          result.map(usuario => `${usuario.codigo_rubro}-${usuario.id_catalogo_tipo_rubro}-${usuario.rub_descripcion}-${usuario.orden}`)
        )).map((clave: any) => {
          const [codigo_rubro, id_catalogo_tipo_rubro, rub_descripcion, orden] = clave.split('-');
          return { codigo_rubro, id_catalogo_tipo_rubro, rub_descripcion, orden };
        });
         //console.log(distintosRegistros)
        let cabeceraIngresos = []
        let cabeceraEgresos = []
        let cabeceraProvisiones = []
        cabeceraIngresos = distintosRegistros.filter(e => e.id_catalogo_tipo_rubro == 'INGRESO' )
        cabeceraEgresos = distintosRegistros.filter(e => e.id_catalogo_tipo_rubro == 'EGRESO' )
        cabeceraProvisiones = distintosRegistros.filter(e => e.id_catalogo_tipo_rubro == 'PROVISIONES' )

        this.dataGeneral = result
        Data = result;
        this.cols = [
          { field: 'linea', header: '#', order: 1, class: "",total: 0 },
          { field: 'nro_control', header: 'No. Control', order: 2, class: "",total: 0 },
          { field: 'nro_orden_pago', header: 'No. OP', order: 3, class: "",total: 0 },
          { field: 'cedula', header: 'Cédula', order: 4, class: "one" ,total: 0},
          { field: 'id_persona', header: 'Id Persona', order: 5, class: "one",total: 0},
          { field: 'full_name', header: 'Empleado', order: 6, class: "one",total: 0 },
          { field: 'programa_nombre', header: 'Programa', order: 7, class: "one",total: 0 },
          { field: 'area_nombre', header: 'Dirección', order: 8, class: "one",total: 0 },
          { field: 'dep_nombre', header: 'Departamento', order: 9, class: "one",total: 0 },
          { field: 'dias_trabajados', header: 'Días Trabajados', order: 10, class: "one",total: 0 },
          { field: 'horas_trabajadas', header: 'Horas Trabajadas', order: 11, class: "",total: 0,tipo: '' },
          { field: 'salario', header: 'Sueldo Nominal', order: 12, class: "two",total: 0 },
        ]

        let order = 12
        for ( let i = 0; i < cabeceraIngresos.length; i++){
          this.cols.push(
                    { field: cabeceraIngresos[i].codigo_rubro + cabeceraIngresos[i].id_catalogo_tipo_rubro, header: cabeceraIngresos[i].rub_descripcion, order: order + 1, class: "two", tipo: cabeceraIngresos[i].id_catalogo_tipo_rubro,total: 0 },
          )
          order++
        }

        this.cols.push(
          { field: 'total_ingresos', header: 'Total Ingresos', order: order +1 , class: "two" ,total: 0},
        )
        order++

        for ( let i = 0; i < cabeceraEgresos.length; i++){
          this.cols.push(
                    { field: cabeceraEgresos[i].codigo_rubro + cabeceraEgresos[i].id_catalogo_tipo_rubro, header: cabeceraEgresos[i].rub_descripcion, order: order + 1, class: "two", tipo: cabeceraEgresos[i].id_catalogo_tipo_rubro,total: 0 },
          )
          order++
        }
        this.cols.push(
          {  field: 'total_egresos', header: 'Total Egresos', order: order + 1, class: "two" ,total: 0},
          {   field: 'total_diferencia', header: 'Total a Recibir', order: order +2 , class: "two",total: 0 },
        )

        order++
          order++

          for ( let i = 0; i < cabeceraProvisiones.length; i++){
            this.cols.push(
                      { field: cabeceraProvisiones[i].codigo_rubro + cabeceraProvisiones[i].id_catalogo_tipo_rubro, header: cabeceraProvisiones[i].rub_descripcion, order: order + 1, class: "two", tipo: cabeceraProvisiones[i].id_catalogo_tipo_rubro,total: 0 },
            )
            order++
          }

          this.cols.push(
            { field: 'total_provisiones', header: 'Total Provisiones', order: order +1 , class: "two" ,total: 0},
          )
        let encabezado = this.cols.filter(e => e.order > 9)

        for(let a = 0; a< tipo.length;a++){

          let arrayTipo = this.cols.filter(co => co.id_catalogo_tipo_rubro == tipo[a]);
          console.log(arrayTipo);
        }

        let linea = 0

        for (let i = 0; i < Data.length; i++) {
        let rol = this.RolGeneral.filter(rol => rol.id_persona == Data[i].id_persona);

        let valoresColumnas = this.cols.filter(col => col.field === Data[i].codigo_rubro + Data[i].id_catalogo_tipo_rubro);
        if(valoresColumnas.length > 0){
          valoresColumnas.forEach(e =>{
            e.total += parseFloat(Data[i].valor)
          })
        }

         if (rol.length == 0) {
            linea++;
            this.numero_empleados = linea

            let objetoRol = {}
            objetoRol['linea'] = String(linea);
            objetoRol['aprobar'] =Data[i].num_control != ''? true: false;
            objetoRol['tiene_control'] =Data[i].num_control != ''? true: false;
            objetoRol['tiene_op'] =Data[i].num_orden_pago != ''? true: false;
            objetoRol['nro_control'] = Data[i].num_control;
            objetoRol['nro_orden_pago'] =  Data[i].num_orden_pago;
            objetoRol['id_persona'] = Data[i].id_persona;
            objetoRol['full_name'] = Data[i].emp_full_nombre;
            objetoRol['cedula'] = Data[i].emp_identificacion;
            objetoRol['programa_nombre'] = Data[i].programa_nombre;
            objetoRol['area_nombre'] = Data[i].area_nombre;
            objetoRol['dep_nombre'] = Data[i].dep_nombre;
            objetoRol['dias_trabajados'] = Data[i].dias_trabajados;
            objetoRol['horas_trabajadas'] = Data[i].horas_trabajadas;
            objetoRol['salario'] = parseFloat((Data[i].sld_salario_minimo));

            for ( let i = 0; i < cabeceraIngresos.length; i++){

              objetoRol[cabeceraIngresos[i].codigo_rubro + cabeceraIngresos[i].id_catalogo_tipo_rubro] =0;

            }
            objetoRol['total_ingresos'] = 0;

            for ( let i = 0; i < cabeceraEgresos.length; i++){

              objetoRol[cabeceraEgresos[i].codigo_rubro + cabeceraEgresos[i].id_catalogo_tipo_rubro] =0;

            }
            objetoRol['total_egresos'] = 0;
            objetoRol['total_diferencia'] = 0;

            for ( let i = 0; i < cabeceraProvisiones.length; i++){

              objetoRol[cabeceraProvisiones[i].codigo_rubro + cabeceraProvisiones[i].id_catalogo_tipo_rubro] =0;

            }

            objetoRol['total_provisiones'] = 0;
            objetoRol[Data[i].codigo_rubro + Data[i].id_catalogo_tipo_rubro] = parseFloat(Data[i].valor);
            this.RolGeneral.push(objetoRol);
          } else {
            rol[0][Data[i].codigo_rubro + Data[i].id_catalogo_tipo_rubro] = parseFloat(Data[i].valor);

          }
        }
        console.log(this.cols)

        this.RolGeneral.forEach(e => {
          let totalIngresos  = 0
          let totalEgresos = 0
          let totalProvisiones = 0
          let rol = Data.filter(rol => rol.id_persona == e.id_persona);
          console.log(rol)
            rol.forEach(f => {
              if(f.id_catalogo_tipo_rubro == 'INGRESO'){
                totalIngresos += parseFloat(f.valor)
              }
              if(f.id_catalogo_tipo_rubro == 'EGRESO'){
                totalEgresos += parseFloat(f.valor)
              }
              if(f.id_catalogo_tipo_rubro == 'PROVISIONES'){
                totalProvisiones += parseFloat(f.valor)
              }
            })


            Object.assign(e, {total_ingresos:this.commonService.formatNumberDos(totalIngresos) /*totalIngresos.toFixed(2)*/ ,total_egresos:this.commonService.formatNumberDos(totalEgresos) /*totalEgresos.toFixed(2)*/, total_diferencia: totalIngresos - totalEgresos, total_provisiones:totalProvisiones.toFixed(2)  })
          });
          let totalesSalario = this.RolGeneral.reduce((suma: number, x: any) => suma + parseFloat(x.salario), 0)

          let totalesIngresos = this.RolGeneral.reduce((suma: number, x: any) => suma + parseFloat(x.total_ingresos), 0)
          let totalesEgresos =  this.RolGeneral.reduce((suma: number, x: any) => suma +  parseFloat(x.total_egresos), 0)
          let totalesDiferencia =  this.RolGeneral.reduce((suma: number, x: any) => suma +   parseFloat(x.total_diferencia), 0)
          let totalesProvisiones =  this.RolGeneral.reduce((suma: number, x: any) => suma +   parseFloat(x.total_provisiones), 0)



          console.log(totalesIngresos)
          console.log(totalesEgresos)
          console.log(totalesDiferencia)
          let valoresColumnasSal = this.cols.filter(col => col.field === 'salario');
          if(valoresColumnasSal.length > 0){
            valoresColumnasSal.forEach(e =>{
              e.total = parseFloat(totalesSalario)
            })
          }

          let valoresColumnasIn = this.cols.filter(col => col.field === 'total_ingresos');
          if(valoresColumnasIn.length > 0){
            valoresColumnasIn.forEach(e =>{
              e.total = parseFloat(totalesIngresos)
            })
          }

          let valoresColumnasEg = this.cols.filter(col => col.field === 'total_egresos');
          if(valoresColumnasEg.length > 0){
            valoresColumnasEg.forEach(e =>{
              e.total = parseFloat(totalesEgresos)
            })
          }

          let valoresColumnasDif = this.cols.filter(col => col.field === 'total_diferencia');
          if(valoresColumnasDif.length > 0){
            valoresColumnasDif.forEach(e =>{
              e.total = parseFloat(totalesDiferencia)
            })
          }

          let valoresColumnasProv = this.cols.filter(col => col.field === 'total_provisiones');
            if(valoresColumnasProv.length > 0){
              valoresColumnasProv.forEach(e =>{
                e.total = parseFloat(totalesProvisiones)
              })
            }



          let lineaTotales = {}
            lineaTotales['linea'] = 'TOTAL';
            lineaTotales['nro_control'] = '';
            lineaTotales['nro_orden_pago'] = '';
            lineaTotales['id_persona'] = '';
            lineaTotales['full_name'] ='';
            lineaTotales['cedula'] ='';
            lineaTotales['programa_nombre'] = '';
            lineaTotales['area_nombre'] = '';
            lineaTotales['dep_nombre'] = '';
            lineaTotales['dias_trabajados'] ='';
            lineaTotales['horas_trabajadas'] ='';
            lineaTotales['salario'] ='';

            for ( let i = 0; i < cabeceraIngresos.length; i++){

              lineaTotales[cabeceraIngresos[i].codigo_rubro + cabeceraIngresos[i].id_catalogo_tipo_rubro] =0;

            }
            lineaTotales['total_ingresos'] = 0;

            for ( let i = 0; i < cabeceraEgresos.length; i++){

              lineaTotales[cabeceraEgresos[i].codigo_rubro + cabeceraEgresos[i].id_catalogo_tipo_rubro] =0;

            }
            lineaTotales['total_egresos'] = 0;
            lineaTotales['total_diferencia'] = 0;

            for ( let i = 0; i < cabeceraProvisiones.length; i++){

              lineaTotales[cabeceraProvisiones[i].codigo_rubro + cabeceraProvisiones[i].id_catalogo_tipo_rubro] =0;

            }
            lineaTotales['total_provisiones'] = 0;

            for(let i = 8; i < this.cols.length; i++){
              lineaTotales[this.cols[i].field] = parseFloat(this.cols[i].total);
              console.log(lineaTotales[this.cols[i].field])
            }
            console.log(lineaTotales)

            this.RolGeneral.push(lineaTotales);
            console.log(this.RolGeneral)
        // return
        //console.log(this.RolGeneral)
       // this.vmButtons[3].habilitar = false;
        this.vmButtons[3].habilitar = false;
        this.vmButtons[5].habilitar = false;
        this.vmButtons[4].habilitar = false;

        let sinAprobar = this.RolGeneral.filter(e => e.tiene_control == false)
          if(sinAprobar.length > 0){
            this.vmButtons[2].habilitar = false;
          }else {
            this.vmButtons[2].habilitar = true;
          }

      }else{
        this.lcargando.ctlSpinner(false);
        this.toastr.info('No hay registros para esta consulta')
      }


    })


  }

  numEmpleados(){
    if(this.RolGeneral.length  == 0){
      return this.RolGeneral.length
    }
    return this.RolGeneral.length - 1;
  }

  conNumeroControl(){
    let totalConNumControl = 0
    let conNumControl = this.RolGeneral.filter(e => e.tiene_control == true)
    return conNumControl.length;

  }
  sinNumeroControl(){
    let totalSinNumControl = 0
    let sinNumControl = this.RolGeneral.filter(e => e.tiene_control == false)
    return sinNumControl.length;
  }
  conNumeroOp(){
    let totalConNumOp = 0
    let conNumOp = this.RolGeneral.filter(e => e.tiene_op == true)
    return conNumOp.length;

  }
  sinNumeroOp(){
    let totalSinNumOp = 0
    let sinNumOp = this.RolGeneral.filter(e => e.tiene_op == false)
    return sinNumOp.length;

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


  async handleEnter({key}) {
    if (key === 'Enter') {
      if (this.lastRecord == null) {
        await this.getLatest()
        return
      }else{
       this.getNumControl()
      }

      // this.lcargando.ctlSpinner(true)
      // this.mensajeSpiner = 'Cargando Registro'


      // try {
      //   const response = await this.rolgeneralemplService.consultaNumControl({params: {filter: {id: this.lastRecord}, paginate: {page: 1, perPage: 1}}}) as any
      //   console.log(response)
      //   if (response.data.data.length > 0) {
      //     this.totalRecords = response.data.total
      //     this.comSrv.listaCompras$.emit(response.data.data[0])
      //     // this.lcargando.ctlSpinner(false)
      //   } else {
      //     this.limpiarForm()
      //     this.lcargando.ctlSpinner(false)
      //     Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
      //   }
      //   //
      // } catch (err) {
      //   console.log(err)
      //   this.lcargando.ctlSpinner(false)
      //   this.toastr.error(err.error?.message, 'Error cargando Registro')
      // }
    }
  }

  async getLatest() {
    this.lcargando.ctlSpinner(true)
    this.mensajeSpiner= 'Cargando Registro'
    try {
      const response = await this.rolgeneralemplService.getUltimoNumero()
      console.log(response)
      if (response.data) {
        // this.totalRecords = response.data.total
        this.lastRecord = response.data.id
        this.num_control = response.data.num_documento
        this.rolgeneralemplService.listaRoles$.emit(response.data)
        this.getRolNoControl()
        this.lcargando.ctlSpinner(false)
      } else {
        this.limpiarForm()
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

  async  getNumControl(){
    this.lcargando.ctlSpinner(true)
    this.mensajeSpiner = 'Cargando Registro'

    this.limpiarForm()
    try {
      const response = await this.rolgeneralemplService.getNumeroControl({id: this.lastRecord })
      if (response.data.num_documento) {
        this.num_control = response.data.num_documento
        this.getRolNoControl()
      } else {
        this.limpiarForm()
        this.lcargando.ctlSpinner(false)
        Swal.fire('Registro Inexistente', 'El registro solicitado no existe. Intente otro identificador.', 'warning')
      }
    } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error cargando Registro')
    }
  }

  convertirMes(){
    let month = 0
    switch (this.mes) {
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
