import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { AsignacionIngresosService } from './cedula-gastos.service';
import { ExcelService } from 'src/app/services/excel.service';
import { environment } from 'src/environments/environment';
import Botonera from 'src/app/models/IBotonera';
import Swal, { SweetAlertResult } from 'sweetalert2';
@Component({
  selector: 'app-asignacion-ingresos',
  templateUrl: './cedula-gastos.component.html',
  styleUrls: ['./cedula-gastos.component.scss']
})
export class AsignacionIngresosComponent implements OnInit {
  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  
  fTitle: string = "Cedula de Gastos";
  errorcodigos: any;
  vmButtons: Botonera[] = [];
  dataUser: any;
  permisos: any;
  willDownload = false;
 erCodPro: any;
 erCodPre: any;
 erCodPar: any;
  jsonData: any;
  dataExcel: any = [];
  programas: any ;
  tiposNominas: any ;
  file: any;
  tiposCatalogos:any;
  periodo: any;
  yearDisabled = false;
  fileDisabled = true;
  btnDisabled = true;

  headersEnable = false;

  plantillaExcel: any = [];

  titles: any = [];
  titlesPLANTILLA: any = [];
  break = false;
  cmb_periodo: Array<any> = [];

  constructor(
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private apiSrv: AsignacionIngresosService,
    private excelSrv: ExcelService,
  ) {
    this.vmButtons = [
      {
        orig: "btnAsignacionIngresos",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnAsignacionIngresos",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnAsignacionIngresos",
        paramAccion: "",
        boton: { icon: "far fa-close", texto: "ELIMINAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnAsignacionIngresos",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnAsignacionIngresos",
        paramAccion: "",
        boton: { icon: "far fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
      },
      ,
      {
        orig: "btnAsignacionIngresos",
        paramAccion: "",
        boton: { icon: "far fa-file-excel", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: false,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ];
  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
this.errorcodigos = false;
    setTimeout(() => {
      this.obtenerPrograma();
      this.obtenermledn();
      this.validaPermisos();
      this.searchgetCatalogosPresupuestoJ();
    }, 0);

  }

  onlyNumber(event): boolean {
    let key = (event.which) ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  onlyNumberExcel(number): boolean {/* 
    return number !== '' && !isNaN(number); */
    return number !== null && number !== undefined && number !== '' && !isNaN(number);
  }

  descargarPlantilla() {
    if(this.periodo==undefined || this.periodo=='' ||
      (+this.periodo<1000)
    ){
      this.toastr.warning('Ingrese un período válido ');
      this.periodo = undefined;
      return ;
    }

   /*  let partida = 'PARTIDA';
    let denominacion = 'DENOMINACIÓN';
    let periodo1 = ''+(+this.periodo - 4);
    let periodo2 = ''+(+this.periodo - 3);
    let periodo3 = ''+(+this.periodo - 2);
    let ant_periodo = ''+(+this.periodo - 1);
    let act_periodo = ''+this.periodo;
    let semestre1 = 'ENERO a JUNIO '+ant_periodo;
    let semestre2 = 'JULIO a DICIEMBRE '+ant_periodo;
    let periodo4 = 'ENERO A DICIEMBRE '+ant_periodo;
    let provisional = 'PROVISIONAL '+act_periodo;
    let definitivo = 'AÑO '+act_periodo;
    let observaciones = 'OBSERVACIONES'; */

    let numeracion = 'No.'
    let partida = 'CUATRIMESTRES';
    let denominacion = 'DEPARTAMENTO';
    let periodo1 = 'PROGRAMA';
    let periodo2 = 'TIPO NOMINA';
    let periodo3 = 'REQUERIMIENTO';
    let ant_periodo = 'REQUERIMIENTO ACTIVIDAD';
    let act_periodo = 'NATURALEZA';
    let semestre1 = 'GRUPO';
    let semestre2 = 'SUBGRUPO';
    let periodo4 = 'PARTIDA PRESUPUESTARIA';
    let provisional = 'CANTIDAD';
   let codigoPrograma = "CODIGO PROGRAMA";
   let codigoTipo = "CODIGO DEPARTAMENTO"; 
   //let codigoPP ="CODIGO PP";
    let unidaddemedida = 'UNIDAD DE MEDIDA';
    let preciounitario = 'PRECIO UNITARIO';
    let cuentasporpagar = 'CUENTAS POR PAGAR';
    let nominayhonorarios = 'NOMINA Y HONORARIOS';
    let totalpresupuesto = 'TOTAL PRESUPUESTO';


    this.plantillaExcel = [];
    for(let i=0; i<2; i++){
      
      let data = {};
      data[numeracion]= i+1;
      data[partida] = '(C0-C0-C0)';
      data[denominacion] = 'DEPARTAMENTO';
      data[codigoPrograma] = "0000"
    
      data[periodo1] = 'PROGRAMA';
      data[codigoTipo] ="00"
     


      data[periodo2] = 'TIPO NOMINA';
      data[periodo3] = 'REQUERIMIENTO';
      data[ant_periodo]= 'REQUERIMIENTO ACTIVIDAD';
      data[act_periodo]= 0
      data[semestre1] = 0;
      data[semestre2] = 0;
    //  data[codigoPP] = 0;
      data[periodo4] = 0;
      data[provisional] = 0;
    
      data[unidaddemedida]='UNIDAD';
      data[preciounitario]=0;
      data[cuentasporpagar]=0;
      data[nominayhonorarios]=0;
      data[totalpresupuesto]=0;

      this.plantillaExcel.push(data);

    }


    /*  let definitivo = 'UNIDAD DE MEDIDA';
    let observaciones = 'PRECIO UNITARIO';  data[definitivo] = 0;
      data[observaciones] = 'Esto es una observacion para partida '+(i+1); definitivo, observaciones,*/
    this.titlesPLANTILLA =  [numeracion,partida,codigoTipo, denominacion,codigoPrograma, periodo1, periodo2, periodo3,ant_periodo,act_periodo, semestre1, semestre2, periodo4, provisional, unidaddemedida,
      preciounitario,
      cuentasporpagar,
      nominayhonorarios,
      totalpresupuesto];

    this.exportAsXLSX(this.plantillaExcel ,'Cedula de gastos '+this.periodo, {header: this.titlesPLANTILLA});
    
  }

  exportAsXLSX(body, title, header) {
    this.excelSrv.exportAsExcelFile(body, title , header);
  }

  getDataExportar() {
    console.log(this.dataExcel);
    let partida = 'CUATRIMESTRES';
    let denominacion = 'DEPARTAMENTO';
    let periodo1 = 'PROGRAMA';
    let periodo2 = 'TIPO NOMINA';
    let periodo3 = 'REQUERIMIENTO';
    let ant_periodo = 'REQUERIMIENTO ACTIVIDAD';
    let act_periodo = 'NATURALEZA';
    let semestre1 = 'GRUPO';
    let semestre2 = 'SUBGRUPO';
    let codigoPrograma = 'CODIGO PROGRAMA';
    let codigoTipo = 'CODIGO DEPARTAMENTO';
    
//   let codigoPP ="CODIGO PP";
    let periodo4 = 'PARTIDA PRESUPUESTARIA';
    let provisional = 'CANTIDAD';
    let definitivo = 'UNIDAD DE MEDIDA';
    let observaciones = 'PRECIO UNITARIO';
    let unidaddemedida = 'UNIDAD DE MEDIDA';
    let preciounitario = 'PRECIO UNITARIO';
    let cuentasporpagar = 'CUENTAS POR PAGAR';
    let nominayhonorarios = 'NOMINA Y HONORARIOS';
    let totalpresupuesto = 'TOTAL PRESUPUESTO';/* 
    let partida = 'PARTIDA';
    let denominacion = 'DENOMINACIÓN';
    let periodo1 = ''+(+this.periodo - 4);
    let periodo2 = ''+(+this.periodo - 3);
    let periodo3 = ''+(+this.periodo - 2);
    let ant_periodo = ''+(+this.periodo - 1);
    let act_periodo = ''+this.periodo;
    let semestre1 = 'ENERO a JUNIO '+ant_periodo;
    let semestre2 = 'JULIO a DICIEMBRE '+ant_periodo;
    let periodo4 = 'ENERO A DICIEMBRE '+ant_periodo;
    let provisional = 'PROVISIONAL '+act_periodo;
    let definitivo = 'AÑO '+act_periodo;
    let observaciones = 'OBSERVACIONES';
 */






    let copy = JSON.parse(JSON.stringify(this.dataExcel));
console.log("copu",copy);
    copy.forEach(e => {
     
      e[partida] = e.partida;
      e[codigoPrograma] = e.codigoprograma;
      e[denominacion] = e.denominacion;
     
      e[codigoTipo] = e.codigotipo;
      e[periodo1] = e.periodo1;
      e[periodo2] = e.periodo2;
      e[periodo3] = e.periodo3;
      e[ant_periodo] = e.ant_periodo;
      e[act_periodo] = e.act_periodo;
      /* e[codigoPrograma] = e.codigoPrograma;
      e[codigoTipo] = e.codigoTipo; */
     
      
      e[semestre1] = e.semestre1;
      e[semestre2] = e.semestre2;
   //   e[codigoPP] = e.codigoPP;
      e[periodo4] = e.periodo4;
      e[provisional] = e.provisional;
    
      e[unidaddemedida] = e.unidaddemedida;
      e[preciounitario] = e.preciounitario;
      e[cuentasporpagar] = e.cuentasporpagar;
      e[nominayhonorarios] = e.nominayhonorarios;
      e[totalpresupuesto] = e.totalpresupuesto;
      
      
      
      
      
      delete e.partida;
      delete e.denominacion;
      delete e.periodo2;
    //  delete e.codigoPP;
      delete e.codigoTipo;
      delete e.codigoPrograma;
      delete e.periodo3;
      delete e.ant_periodo;
      delete e.act_periodo;
      delete e.semestre1;
      delete e.semestre2;
      delete e.periodo4;
      delete e.provisional;
     
      delete e.unidaddemedida;
      delete e.preciounitario;
      delete e.cuentasporpagar;
      delete e.nominayhonorarios;
      delete e.totalpresupuesto;
    })
    
    /*  e[definitivo] = e.definitivo;
      e[observaciones] = e.observaciones; delete e.definitivo;definitivo, observaciones,
      delete e.observaciones;*/
    this.titles =  [partida,codigoTipo, denominacion,codigoPrograma,
       periodo1, periodo2, periodo3,ant_periodo,act_periodo, semestre1, semestre2, periodo4, provisional, unidaddemedida,preciounitario,cuentasporpagar,nominayhonorarios,totalpresupuesto];
      /* this.titles =  [partida, denominacion, periodo1, periodo2, periodo3, semestre1, semestre2, periodo4, provisional, definitivo, observaciones];
    */ console.log(copy);

    this.exportAsXLSX(copy, 'Cedula de Gastos '+this.periodo, {header: this.titles});
  }

  
  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
      this.validaGuardar();
        break;
      case "CONSULTAR":
        if(this.periodo<2000 || this.periodo>2050){
          this.toastr.warning('El periodo debe tener formato de año ');
          this.periodo = undefined;
        }else{
          this.inspeccionarPeriodo();
        }
        break;
      case "ELIMINAR":
        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que desea eliminar la cedula de gastos para el periodo "+this.periodo+"?",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        }).then((result) => {
          if (result.isConfirmed) {            
            this.eliminarIngresos(); 
          }
        });
        break;
      case "LIMPIAR":
        this.restoreForm();
        break;
      case "EXCEL":
      this.getDataExportar();
        break;
      case "PDF":
          this.getDataPDF();
            break;
    }
  }

  validaGuardar() {
    if(
      this.periodo == undefined
    ){
      this.toastr.info('Debe ingresar el Periodo');
      return ;
    }else if(
      this.file == undefined
    ){
      this.toastr.info('Debe subir un Archivo Excel con la Cedula de Gastos para el periodo');
      return ;
    }else if(
      this.dataExcel.length <= 0
    ){
      this.toastr.info('No existen registros para Guardar');
      return ;
    }else if(
      this.errorcodigos
    ){
     this.toastr.info('Existe un error en codigos');
     return ;
    }
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea registrar la Cedula de Gastos para el periodo "+this.periodo+"?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {            
        this.checkPeriodo(); 
      }
    });


  }

  checkPeriodo() {

    this.mensajeSpiner = 'Obteniendo Cedula de Gastos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      periodo: this.periodo      
    };

    console.log(data);
    this.apiSrv.getIngresosPorPeriodopbr(data).subscribe(
      res => {
        console.log(res);
        if(res['data'].length==0){
          this.guardarIngresos();
        }else{
          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text: 'No puede GUARDAR datos para el periodo '+this.periodo+', primero elimine su Cedula de Gastos anterior.',
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
          }).then((result) => {
            if (result.isConfirmed) {            
              this.restoreForm(); 

            }
            this.lcargando.ctlSpinner(false);
          });
        }
     
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error al inspeccionar la Cedula de Gastos')
      }
    )
  }

  guardarIngresos() {

    this.mensajeSpiner = 'Guardando Cedula de Gastos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      data_excel: this.dataExcel,
      periodo: this.periodo      
    };

    console.log(data);
    this.apiSrv.guardarIngresosPorPeriodoprb(data).subscribe(
      res => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Exito",
          // Cedula de Gastos para periodo "+this.periodo+" guardada satisfactoriamente
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
        this.vmButtons[0].habilitar = true;
        this.lcargando.ctlSpinner(false);
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error al guardar la Cedula de Gastos')
      }
    )
  }

  inspeccionarPeriodo() {
    this.mensajeSpiner = 'Obteniendo Cedula de Gastos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      periodo: this.periodo      
    };

    console.log(data);
    this.apiSrv.getIngresosPorPeriodopbr(data).subscribe(
      res => {
        console.log(res);
        if(res['data'].length==0){
          this.toastr.info('El periodo seleccionado no tiene una Cedula de Gastos aun, puede GUARDAR una subiendo un documento excel del periodo correspondiente');
        }else{
          this.fillTableBySearch(res);
        }
        this.lcargando.ctlSpinner(false);
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error al inspeccionar la Cedula de Gastos')
      }
    )
  }

  eliminarIngresos() {
    this.mensajeSpiner = 'Eliminando Cedula de Gastos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      periodo: this.periodo      
    };

    console.log(data);
    this.apiSrv.delIngresosPorPeriodoprb(data).subscribe(
      res => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Exito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
        this.restoreForm();
        this.lcargando.ctlSpinner(false);
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error al eliminar la Cedula de Gastos')
      }
    )
  }

  restoreForm() {
    this.errorcodigos = false;
    this.erCodPro= false;
      this.erCodPre= false;
      this.erCodPar=false ;
    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = false;
    this.vmButtons[4].habilitar = true;

    this.dataExcel = [];
    this.file = undefined;
    this.periodo = undefined;
    this.yearDisabled = false;
    this.fileDisabled = true;
    this.btnDisabled = true;

    this.headersEnable = false;
    this.break = false;
  }
  
  validaPermisos() {
    this.mensajeSpiner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);

    let params = {
      // cambiar despues con variable propia
      codigo: myVarGlobals.fPreAsignacionInicial,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {
        this.permisos = res["data"][0];
        console.log(this.permisos);
        if (this.permisos.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
          // this.getCatalogos();
          this.cargaInicial()
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpiner = 'Cargando Periodos'
      let periodos = await this.apiSrv.cargarPeriodos();
      console.log(periodos)
      this.cmb_periodo = periodos

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  async generarPeriodo() {
    let result: SweetAlertResult = await Swal.fire({
      title: 'Generar Periodo Contable',
      text: 'Esta seguro/a de generar un nuevo Periodo Contable? Esto debe realizarse una sola vez al iniciar el nuevo año.',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Generar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        this.mensajeSpiner = 'Generando Periodo'
        let periodo = await this.apiSrv.generarPeriodoPresupuesto()
        console.log(periodo)
        
        this.lcargando.ctlSpinner(false)
        Swal.fire(`Periodo ${periodo} generado`, '', 'success').then(() => this.cargaInicial())
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }
    }
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    this.file = ev.target.files[0];

    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        // console.log('two',initial);
        return initial;
      }, {});
      console.log(workBook);
      const dataString = JSON.stringify(jsonData);
      this.jsonData = jsonData;
      console.log(jsonData);
      this.btnDisabled = false;
      // this.fillTable(jsonData);
    }
    reader.readAsBinaryString(this.file);
  }

  // setDownload(data) {
  //   this.willDownload = true;
  //   setTimeout(() => {
  //     const el = document.querySelector("#download");
  //     el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
  //     el.setAttribute("download", 'xlsxtojson.json');
  //   }, 1000)
  // }

  fillTable(dataJson) {
    this.errorcodigos = false;
    this.erCodPro= false;
      this.erCodPre= false;
      this.erCodPar=false ;
    let year = this.periodo;
    let partida = 'CUATRIMESTRES';
    let denominacion = 'DEPARTAMENTO';
    let periodo1 = 'PROGRAMA';
    let periodo2 = 'TIPO NOMINA';
    let periodo3 = 'REQUERIMIENTO';
    let ant_periodo = 'REQUERIMIENTO ACTIVIDAD';
    let act_periodo = 'NATURALEZA';
    let semestre1 = 'GRUPO';
    let semestre2 = 'SUBGRUPO';
    let codigoPrograma = 'CODIGO PROGRAMA';
    let codigoTipo = 'CODIGO DEPARTAMENTO';
   // let codigoPP ="CODIGO PP";
    let periodo4 = 'PARTIDA PRESUPUESTARIA';
    let provisional = 'CANTIDAD';/* 
    let definitivo = 'UNIDAD DE MEDIDA';
    let observaciones = 'PRECIO UNITARIO';
     */let unidaddemedida = 'UNIDAD DE MEDIDA';
    let preciounitario = 'PRECIO UNITARIO';
    let cuentasporpagar = 'CUENTAS POR PAGAR';
    let nominayhonorarios = 'NOMINA Y HONORARIOS';
    let totalpresupuesto = 'TOTAL PRESUPUESTO';
    let existecodigoprograma = 'existecodigoprograma';
    let existecodigotipo = 'existecodigotipo';
    
    
    
    
    console.log(dataJson);
    if(dataJson['data']){
      let arr = dataJson['data'];
      this.dataExcel = [];
      arr.forEach(e => {
        let data = {
          partida: e[partida]??this.notData(),
          denominacion: e[denominacion]??this.notData(),
          periodo1: e[periodo1]??this.notData(),
          periodo2: e[periodo2]??this.notData(),
          periodo3: e[periodo3]??this.notData(),
          ant_periodo: e[ant_periodo]??this.notData(),
          act_periodo: e[act_periodo]??this.notData(),
          semestre1: e[semestre1]??this.notData(),
          semestre2: e[semestre2]??this.notData(),
       //   codigoPP: e[codigoPP]??this.notData(),
          tienecodigoPP: this.existeEnAr(1,e[periodo4]),//!!this.tiposCatalogos.find(p => p.codigo == e[codigoPP]),
          periodo4: e[periodo4]??this.notData(),
          provisional: e[provisional]??this.notData(),
          codigoprograma: this.toStringin(e[codigoPrograma])/* ??this.notData() */,
          existecodigoprograma:this.existeEnAr(2,e[codigoPrograma]),// !!this.programas.find(p => p.descripcion == e[codigoPrograma]),
          codigotipo: this.toStringin(e[codigoTipo])/* ??this.notData() */,
          existecodigotipo:this.existeEnAr(3,e[codigoTipo]),// !!this.tiposNominas.find(p => p.descripcion == e[denominacion]),
          
          unidaddemedida: e[unidaddemedida]??this.notData(),
          preciounitario: this.onlyNumberExcel(e[preciounitario]) ? e[preciounitario] : this.notData(),
          cuentasporpagar: e[cuentasporpagar]??this.notData(),
          nominayhonorarios: e[nominayhonorarios]??this.notData(),
          totalpresupuesto: e[totalpresupuesto]??this.notData(),
        }
        this.dataExcel.push(data);
    /*   if(data.tienecodigoPP || data.existecodigoprograma || data.preciounitario)  {
        this.vmButtons[0].habilitar = false;} */
      })
      this.titles =  [partida, codigoTipo,denominacion, 
        codigoPrograma, periodo1, periodo2, periodo3,ant_periodo,act_periodo, semestre1, semestre2, periodo4, provisional,unidaddemedida,preciounitario,cuentasporpagar,nominayhonorarios,totalpresupuesto];
      if(this.break){
        this.dataExcel = [];
        this.toastr.info('El archivo seleccionado no contiene el formato adecuado');
        return ;
      }
      if (this.erCodPro== true) {this.toastr.info('Error en campo codigo programa ');}
      if ( this.erCodPre== true){this.toastr.info('Error en campo codigo presupuesto ');}
        if (this.erCodPar== true){this.toastr.info('Error en campo partida presupuestaria ');}
      this.yearDisabled = true;
      this.headersEnable = true;
    }else{
      this.toastr.info('El archivo seleccionado no contiene el formato adecuado');
    }
  }

  notData(): number {
    this.break = true;
    return 0;
  }

  toString(x,tipo){


    this.validarPrograma(new String(x),tipo);

if (x!= undefined && x != '' && x != null){
  return new String(x);
}else{
  return 0;
}
  }



existeEnAr(op,e){
  if(op == 1){
    if (!this.tiposCatalogos.some(p => p.codigo == e)) {
      this.errorcodigos = true;
      this.erCodPar= true;
      return false;
     
     
     
  }
  return true;
  return this.tiposCatalogos.some(p => p.codigo == e)
  }
  if(op== 2){
    if (!this.programas.some(p => p.descripcion == e)) {
      this.errorcodigos = true;
      this.erCodPro= true;
      return false;
  }return true;
  
    return this.programas.some(p => p.descripcion == e)
  }
  if(op== 3){
    if (!this.tiposNominas.some(p => p.descripcion == e)) {
      this.errorcodigos = true;
      this.erCodPre= true;
      return false;
  }  return true;
    
    return this.tiposNominas.some(p => p.descripcion == e)
  }
}




validarPrograma(codeIn,tipoConsulta){
  let programas: any;
  this.apiSrv.searchProgramabyCode({codigo: codeIn,tipoConsulta:tipoConsulta })
    .subscribe(
      res => {
        programas = res;
        console.log("validando existencia de codigo",codeIn)
        console.log("resultado de servicio",programas)
        if(programas.length === 0) {
          this.break = true;    return 0;//;  throw new Error('Código de programa no encontrado');
        } else{
          return new String(codeIn);
        }
        
        // Código existe, iterar programas...
        
      }
    );
}


toStringin(x){

if (x!= undefined && x != '' && x != null){
return new String(x);
}else{
return 0;
}
}

obtenerPrograma(){
  this.lcargando.ctlSpinner(true);
  let programas: any;
  this.apiSrv.searchProgramaAll({tipoConsulta:'PLA_PROGRAMA'})
    .subscribe(
      res => {
        this.programas = res;
       console.log("this.programas",this.programas);
       this.lcargando.ctlSpinner(false);
        
      }
    );
}

obtenermledn(){
  this.lcargando.ctlSpinner(true);
  let programas: any;
  this.apiSrv.searchProgramaAll({tipoConsulta: 'PLA_DEPARTAMENTO'})
    .subscribe(
      res => {
        this.tiposNominas = res;
       console.log("this.tiposNominas",this.tiposNominas);
       this.lcargando.ctlSpinner(false);
      }
    );
}



searchgetCatalogosPresupuestoJ(){
  this.lcargando.ctlSpinner(true);
  let programas: any;
  this.apiSrv.searchgetCatalogosPresupuestoJ({})
    .subscribe(
      res => {
        console.log("tiposCatalogos", this.tiposCatalogos);
        this.tiposCatalogos = res;
      
       this.lcargando.ctlSpinner(false);
      }
    );
}

validarTipoNomina(codeIn){
  let programas: any;
  this.apiSrv.searchProgramabyCode({codigo: codeIn,tipoConsulta: 'PLA_DEPARTAMENTO'})
    .subscribe(
      res => {
        programas = res;
        console.log("validando existencia de codigo",codeIn)
        console.log("resultado de servicio",programas)
        if(programas.length === 0) {
          this.break = true;    return 0;// throw new Error('Código de programa no encontrado');
        }else{
          return new String(codeIn);
        }
        
        // Código existe, iterar programas...
        
      }
    );
}

  fillTableBySearch(data) {
    let partida = 'cuatrimestres';
    let denominacion = 'departamento';
    let periodo1 = 'programa';
    let periodo2 = 'tiponomina';
    let periodo3 = 'requerimientos';
    let ant_periodo = 'requerimientoactividad';
    let act_periodo = 'naturaleza';
    let semestre1 = 'grupo';
    let semestre2 = 'subgrupo';
    let periodo4 = 'partidapresupuestaria';
    let codigoPrograma = "codigoprograma";
    let codigoTipo = "codigotipo";
   
    //let codigoPP ="codigopresupuesto";
    let provisional = 'cantidad';
    let definitivo = 'unidadmedida';
    let observaciones = 'preciounitario';
    let unidaddemedida = 'unidadmedida';
    let preciounitario = 'preciounitario';
    let cuentasporpagar = 'cuentasporpagar';
    let nominayhonorarios = 'nominahonorarios';
    let totalpresupuesto = 'totalpresupuesto';
    
    
    let teLpartida = 'CUATRIMESTRES';
    let teLdenominacion = 'DEPARTAMENTO';
    let teLperiodo1 = 'PROGRAMA';
    let teLperiodo2 = 'TIPO NOMINA';
    let teLperiodo3 = 'REQUERIMIENTO';
    let teLant_periodo = 'REQUERIMIENTO ACTIVIDAD';
    let teLact_periodo = 'NATURALEZA';
    let teLcodigoPrograma = "CODIGO PROGRAMA";
    let teLcodigoTipo = "CODIGO DEPARTAMENTO";
    let teLsemestre1 = 'GRUPO';
    let teLsemestre2 = 'SUBGRUPO';
    
   //let teLcodigoPP ="CODIGO PP";
    let teLperiodo4 = 'PARTIDA PRESUPUESTARIA';
    let teLprovisional = 'CANTIDAD';
    let teLdefinitivo = 'UNIDAD DE MEDIDA';
    let teLobservaciones = 'PRECIO UNITARIO';
    let teLunidaddemedida = 'UNIDAD DE MEDIDA';
    let teLpreciounitario = 'PRECIO UNITARIO';
    let teLcuentasporpagar = 'CUENTAS POR PAGAR';
    let teLnominayhonorarios = 'NOMINA Y HONORARIOS';
    let teLtotalpresupuesto = 'TOTAL PRESUPUESTO';
    
    /* 
    let partida = 'CUATRIMESTRES';
    let denominacion = 'DEPARTAMENTO';
    let periodo1 = 'PROGRAMA';
    let periodo2 = 'TIPO NOMINA';
    let periodo3 = 'REQUERIMIENTO';
    let ant_periodo = 'REQUERIMIENTO ACTIVIDAD';
    let act_periodo = 'NATURALEZA';
    let semestre1 = 'GRUPO';
    let semestre2 = 'SUBGRUPO';
    let periodo4 = 'PARTIDA PRESUPUESTARIA';
    let provisional = 'CANTIDAD';
    let definitivo = 'UNIDAD DE MEDIDA';
    let observaciones = 'PRECIO UNITARIO';
    let unidaddemedida = 'UNIDAD DE MEDIDA';
    let preciounitario = 'PRECIO UNITARIO';
    let cuentasporpagar = 'CUENTAS POR PAGAR';
    let nominayhonorarios = 'NOMINA Y HONORARIOS';
    let totalpresupuesto = 'TOTAL PRESUPUESTO'; */
    let arr = data.data;
    this.dataExcel = [];
    arr.forEach(e => {
      let data = {
          partida: e[partida]??'',
          denominacion: e[denominacion]??'',
          periodo1: e[periodo1]??this.notData(),
          periodo2: e[periodo2]??this.notData(),
          periodo3: e[periodo3]??this.notData(),
          ant_periodo: e[ant_periodo]??this.notData(),
          act_periodo: e[act_periodo]??this.notData(),
          semestre1: e[semestre1]??this.notData(),
          semestre2: e[semestre2]??this.notData(),
        //  codigoPP: e[codigoPP]??this.notData(),
          tienecodigoPP:true, existecodigoprograma: true, existecodigotipo:true,
          periodo4: e[periodo4]??this.notData(),
          provisional: e[provisional]??this.notData(),
          codigoprograma: e[codigoPrograma]/* ??this.notData() */,
          codigotipo: e[codigoTipo]/* ??this.notData() */,
          unidaddemedida: e[unidaddemedida]??'',
          preciounitario: e[preciounitario]??'',
          cuentasporpagar: e[cuentasporpagar]??'',
          nominayhonorarios: e[nominayhonorarios]??'',
          totalpresupuesto: e[totalpresupuesto]??'',
      }
      this.dataExcel.push(data);
    });
  /*     definitivo: e[definitivo]??this.notData(),
          observaciones: e[observaciones]??'', */
/* 
    partida: e['partida']??'',
    denominacion: e['denominacion']??'',
    periodo1: e['periodo1']??0,
    periodo2: e['periodo2']??0,
    periodo3: e['periodo3']??0,
    semestre1: e['semestre1']??0,
    semestre2: e['semestre2']??0,
    periodo4: e['periodo4']??0,
    provisional: e['provisional']??0,
    definitivo: e['definitivo']??0,
    observaciones: e['observaciones']??'', */
    
    /*  
    let partida = 'PARTIDA';
    let denominacion = 'DENOMINACIÓN';
    let periodo1 = ''+(+this.periodo - 4);
    let periodo2 = ''+(+this.periodo - 3);
    let periodo3 = ''+(+this.periodo - 2);
    let ant_periodo = ''+(+this.periodo - 1);
    let act_periodo = ''+this.periodo;
    let semestre1 = 'ENERO a JUNIO '+ant_periodo;
    let semestre2 = 'JULIO a DICIEMBRE '+ant_periodo;
    let periodo4 = 'ENERO A DICIEMBRE '+ant_periodo;
    let provisional = 'PROVISIONAL '+act_periodo;
    let definitivo = 'AÑO '+act_periodo;
    let observaciones = 'OBSERVACIONES'; */

    this.headersEnable = true;
    this.titles =  [teLpartida,teLcodigoTipo, teLdenominacion,
      teLcodigoPrograma, teLperiodo1,  teLperiodo2, teLperiodo3,teLant_periodo,teLact_periodo, teLsemestre1, teLsemestre2, teLperiodo4, teLprovisional,teLunidaddemedida,teLpreciounitario,teLcuentasporpagar,teLnominayhonorarios,teLtotalpresupuesto];
    /* this.titles =  [partida, denominacion, periodo1, periodo2, periodo3, semestre1, semestre2, periodo4, provisional, definitivo, observaciones]; definitivo, observaciones,
    */ this.vmButtons[0].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[4].habilitar = false;
    //this.vmButtons[5].habilitar = false;

  }

  agregaPeriodo() {
   
    if(this.periodo<2000 || this.periodo>2050){
      this.toastr.warning('Ingrese un periodo valido ');
      this.periodo = undefined;
      return ;
    }
    this.break = false;
    console.log(this.jsonData);
    this.fillTable(this.jsonData);
  }

  getDataPDF(){
    window.open(environment.ReportingUrl +"rpt_pre_asignacion_ingreso.pdf?&j_username="  + environment.UserReporting 
    + "&j_password=" + environment.PasswordReporting+"&periodo=" + this.periodo,'_blank')

  }

}
