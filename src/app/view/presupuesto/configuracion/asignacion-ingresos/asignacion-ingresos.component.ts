import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { AsignacionIngresosService } from './asignacion-ingresos.service';
import { ExcelService } from 'src/app/services/excel.service';
import { environment } from 'src/environments/environment';
import Botonera from 'src/app/models/IBotonera';
import Swal, { SweetAlertResult } from 'sweetalert2';
@Component({
  selector: 'app-asignacion-ingresos',
  templateUrl: './asignacion-ingresos.component.html',
  styleUrls: ['./asignacion-ingresos.component.scss']
})
export class AsignacionIngresosComponent implements OnInit {
  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  
  fTitle: string = "Asignación inicial de ingresos";

  vmButtons: Botonera[] = [];
  dataUser: any;
  permisos: any;
  willDownload = false;

  jsonData: any;
  dataExcel: any = [];

  file: any;
  
  periodo: any;
  yearDisabled = false;
  fileDisabled = true;
  btnDisabled = true;

  headersEnable = false;

  plantillaExcel: any = [];

  titles: any = [];
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
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ];
  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(() => {
      this.validaPermisos();
    }, 0);

  }

  onlyNumber(event): boolean {
    let key = (event.which) ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  descargarPlantilla() {
    if(this.periodo==undefined || this.periodo=='' ||
      (+this.periodo<1000)
    ){
      this.toastr.warning('Ingrese un período válido ');
      this.periodo = undefined;
      return ;
    }

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

    this.plantillaExcel = [];
    for(let i=0; i<2; i++){
      
      let data = {};
      data[partida] = i+1;
      data[denominacion] = 'Esto es una denominacion para partida '+(i+1);
      data[periodo1] = 0;
      data[periodo2] = 0;
      data[periodo3] = 0;
      data[semestre1] = 0;
      data[semestre2] = 0;
      data[periodo4] = 0;
      data[provisional] = 0;
      data[definitivo] = 0;
      data[observaciones] = 'Esto es una observacion para partida '+(i+1);

      this.plantillaExcel.push(data);

    }

    this.titles =  [partida, denominacion, periodo1, periodo2, periodo3, semestre1, semestre2, periodo4, provisional, definitivo, observaciones];

    this.exportAsXLSX(this.plantillaExcel ,'Asignacion inicial periodo '+this.periodo, {header: this.titles});
    
  }

  exportAsXLSX(body, title, header) {
    this.excelSrv.exportAsExcelFile(body, title , header);
  }

  getDataExportar() {
    console.log(this.dataExcel);
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

    let copy = JSON.parse(JSON.stringify(this.dataExcel));

    copy.forEach(e => {
      e[partida] = e.partida;
      e[denominacion] = e.denominacion;
      e[periodo1] = e.periodo1;
      e[periodo2] = e.periodo2;
      e[periodo3] = e.periodo3;
      e[semestre1] = e.semestre1;
      e[semestre2] = e.semestre2;
      e[periodo4] = e.periodo4;
      e[provisional] = e.provisional;
      e[definitivo] = e.definitivo;
      e[observaciones] = e.observaciones;
      delete e.partida;
      delete e.denominacion;
      delete e.periodo1;
      delete e.periodo2;
      delete e.periodo3;
      delete e.semestre1;
      delete e.semestre2;
      delete e.periodo4;
      delete e.provisional;
      delete e.definitivo;
      delete e.observaciones;
    })
    
    this.titles =  [partida, denominacion, periodo1, periodo2, periodo3, semestre1, semestre2, periodo4, provisional, definitivo, observaciones];
    console.log(copy);

    this.exportAsXLSX(copy, 'Asignacion inicial periodo '+this.periodo, {header: this.titles});
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
          text: "¿Seguro que desea eliminar la asignacion de ingresos para el periodo "+this.periodo+"?",
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
      this.toastr.info('Debe subir un Archivo Excel con la asignacion de ingresos para el periodo');
      return ;
    }else if(
      this.dataExcel.length <= 0
    ){
      this.toastr.info('No existen registros para Guardar');
      return ;
    }
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea registrar la asignacion de ingresos para el periodo "+this.periodo+"?",
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

    this.mensajeSpiner = 'Obteniendo asignacion de ingresos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      periodo: this.periodo      
    };

    console.log(data);
    this.apiSrv.getIngresosPorPeriodo(data).subscribe(
      res => {
        console.log(res);
        if(res['data'].length==0){
          this.guardarIngresos();
        }else{
          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text: 'No puede GUARDAR datos para el periodo '+this.periodo+', primero elimine su asignacion de ingresos anterior.',
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
          });
        }
        this.lcargando.ctlSpinner(false);
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error al inspeccionar la asignacion de ingresos')
      }
    )
  }

  guardarIngresos() {

    this.mensajeSpiner = 'Guardando asignacion de ingresos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      data_excel: this.dataExcel,
      periodo: this.periodo      
    };

    console.log(data);
    this.apiSrv.guardarIngresosPorPeriodo(data).subscribe(
      res => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Exito",
          // Asignacion de ingresos para periodo "+this.periodo+" guardada satisfactoriamente
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
        this.toastr.error(err.error.message, 'Error al guardar la asignacion de ingresos')
      }
    )
  }

  inspeccionarPeriodo() {
    this.mensajeSpiner = 'Obteniendo asignacion de ingresos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      periodo: this.periodo      
    };

    console.log(data);
    this.apiSrv.getIngresosPorPeriodo(data).subscribe(
      res => {
        console.log(res);
        if(res['data'].length==0){
          this.toastr.info('El periodo seleccionado no tiene una asignacion de ingresos aun, puede GUARDAR una subiendo un documento excel del periodo correspondiente');
        }else{
          this.fillTableBySearch(res);
        }
        this.lcargando.ctlSpinner(false);
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error al inspeccionar la asignacion de ingresos')
      }
    )
  }

  eliminarIngresos() {
    this.mensajeSpiner = 'Eliminando asignacion de ingresos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      periodo: this.periodo      
    };

    console.log(data);
    this.apiSrv.delIngresosPorPeriodo(data).subscribe(
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
        this.toastr.error(err.error.message, 'Error al eliminar la asignacion de ingresos')
      }
    )
  }

  restoreForm() {
    this.vmButtons[0].habilitar = false;
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
    let year = this.periodo;
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
    if(dataJson['data']){
      let arr = dataJson['data'];
      this.dataExcel = [];
      arr.forEach(e => {
        let data = {
          partida: e[partida]??'',
          denominacion: e[denominacion]??'',
          periodo1: e[periodo1]??this.notData(),
          periodo2: e[periodo2]??this.notData(),
          periodo3: e[periodo3]??this.notData(),
          semestre1: e[semestre1]??this.notData(),
          semestre2: e[semestre2]??this.notData(),
          periodo4: e[periodo4]??this.notData(),
          provisional: e[provisional]??this.notData(),
          definitivo: e[definitivo]??this.notData(),
          observaciones: e[observaciones]??'',
        }
        this.dataExcel.push(data);
      })
      this.titles =  [partida, denominacion, periodo1, periodo2, periodo3, semestre1, semestre2, periodo4, provisional, definitivo, observaciones];
      if(this.break){
        this.dataExcel = [];
        this.toastr.info('El archivo seleccionado no contiene el formato adecuado');
        return ;
      }
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

  fillTableBySearch(data) {
    let arr = data.data;
    this.dataExcel = [];
    arr.forEach(e => {
      let data = {
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
        observaciones: e['observaciones']??'',
      }
      this.dataExcel.push(data);
    });
    
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

    this.headersEnable = true;
    this.titles =  [partida, denominacion, periodo1, periodo2, periodo3, semestre1, semestre2, periodo4, provisional, definitivo, observaciones];
    this.vmButtons[0].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[4].habilitar = false;
    //this.vmButtons[5].habilitar = false;

  }

  agregaPeriodo() {
    console.log(this.periodo);
    // this.toastr.info('Agregue un archivo excel correspondiente al periodo '+this.periodo);
    // this.file = undefined;
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
