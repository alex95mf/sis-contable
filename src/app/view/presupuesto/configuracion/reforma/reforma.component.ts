import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
// import { AsignacionIngresosService } from './asignacion-ingresos.service';
import { ExcelService } from 'src/app/services/excel.service';
import { de } from 'date-fns/locale';
import { ReformaService } from './reforma.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalBusquedaReformaComponent} from './modal-busqueda-reforma/modal-busqueda-reforma.component'
import { CommonVarService } from 'src/app/services/common-var.services';
import { environment } from 'src/environments/environment';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
@Component({
standalone: false,
  selector: 'app-reforma',
  templateUrl: './reforma.component.html',
  styleUrls: ['./reforma.component.scss']
})
export class ReformaComponent implements OnInit {

  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  
  fTitle: string = "Reforma";

  vmButtons: any = [];
  dataUser: any;
  permisos: any;
  willDownload = false;

  jsonData: any;
  dataExcel: any = [];

  file: any;
  
  periodo: any;
  estado: any;
  yearDisabled = false;
  fileDisabled = true;
  btnDisabled = true;

  headersEnable = false;

  plantillaExcel: any = [];

  titles: any = [];
  break = false;
  tipoReforma: any = 0;
  id : any;
  catalog: any = [];
  no_reforma: any;
  cmb_periodo: Array<any> = [];
  cmb_programas: Array<any> = [];
  programaSelected: any = {};

  estadoList = [
    {value: "A",label: "ACTIVO"},
    {value: "I",label: "INACTIVO"},
    {value: "X",label: "ANULADO"}
  ]


  fileValid:any;
  fecha_ingreso:any = moment(new Date()).format('YYYY-MM-DD')

  totalSCingresos: any = 0
  totalSCegresos: any = 0

  totalRCingresos: any = 0
  totalRCegresos: any = 0


  totalTCincremento: any = 0
  totalTCreduccion: any = 0

  totalFinal: any = 0

  constructor(
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private apiSrv: ReformaService,
    private excelSrv: ExcelService,
    private modal: NgbModal,
    private commonVar: CommonVarService,
    private cierremesService: CierreMesService
  ) {
    this.vmButtons = [
      {
        orig: "btnAsignacionIngresos",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: " GUARDAR" },
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
        boton: { icon: "far fa-search", texto: " BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },
      // {
      //   orig: "btnAsignacionIngresos",
      //   paramAccion: "",
      //   boton: { icon: "far fa-close", texto: " ELIMINAR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-danger boton btn-sm",
      //   habilitar: true,
      // },
      {
        orig: "btnAsignacionIngresos",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: " LIMPIAR" },
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
        boton: { icon: "far fa-file-excel", texto: " EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnAsignacionIngresos",
        paramAccion: "",
        boton: { icon: "far fa-file-excel", texto: " PDF" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnAsignacionIngresos",
        paramAccion: "",
        boton: { icon: "fa fa-trash-o", texto: " ANULAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
    ];

    // Observables
    this.commonVar.modalReformaBusqueda.asObservable().subscribe(
      (res)=>{
        console.log(res);
        this.fileValid = true
        this.fecha_ingreso = moment(res.fecha_registro).format('YYYY-MM-DD')
        this.periodo = res.periodo;
        this.estado = res.estado;
        this.tipoReforma = res.tipo_reforma;
        this.no_reforma = res.no_reforma;
        this.programaSelected = { id_catalogo: res.fk_programa }
        this.fillTableBySearch(res)
        this.id = res.id_reforma;
        this.vmButtons[5].habilitar = false;


      }
    )
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

    let year = this.periodo;
    let partida = 'PARTIDA';
    let concepto = 'CONCEPTO';
    let programa = 'PROGRAMA';
    let anual = 'ANUAL';
    let sp_ingresos = 'SC_INGRESOS';
    let sp_egresos = 'SC_EGRESOS';
    let rc_ingresos = 'RC_INGRESOS';
    let rc_egresos = 'RC_EGRESOS';
    let tc_incremento = 'TC_INCREMENTO';
    let tc_reduccion = 'TC_REDUCCION';
    let final = 'FINAL';
   

    this.plantillaExcel = [];
    for(let i=0; i<2; i++){
      
      let data = {};
      data[partida] = i+1;
      data[concepto] = 'Esto es un concepto para reforma '+(i+1);
      data[programa] = 0;
      data[anual] = 0;
      data[sp_ingresos] = 0;
      data[sp_egresos] = 0;
      data[rc_ingresos] = 0;
      data[rc_egresos] = 0;
      data[tc_incremento] = 0;
      data[tc_reduccion] = 0;
      data[final] = 0;
      

      this.plantillaExcel.push(data);

    }

    this.titles =  [partida, concepto, programa, anual, sp_ingresos, sp_egresos, rc_ingresos, rc_egresos, tc_incremento, tc_reduccion, final ];

    this.exportAsXLSX(this.plantillaExcel ,'Reforma '+this.periodo, {header: this.titles});
    
  }

  

  getDataExportar() {
console.log(this.dataExcel)
   
        let excelData = [];
    
        if (this.permisos.exportar == "0") {
          this.toastr.info("Usuario no tiene permiso para exportar");
        } else {
          this.mensajeSpiner = "Generando Archivo Excel...";
          this.lcargando.ctlSpinner(true);

          Object.keys(this.dataExcel).forEach(key => {
            let filter_values = {};

            filter_values['PARTIDA'] = (this.dataExcel[key].partida != null) ? this.dataExcel[key].partida.trim() : "";
            filter_values['CONCEPTO'] = (this.dataExcel[key].concepto != null) ? this.dataExcel[key].concepto.trim() : "";
            filter_values['PROGRAMA'] = (this.dataExcel[key].programa != null) ? this.dataExcel[key].programa.trim() : "";
            filter_values['ANUAL'] = (this.dataExcel[key].anual != null) ? this.dataExcel[key].anual.trim() : "";
            filter_values['SC_INGRESOS'] = (this.dataExcel[key].sp_ingresos != null) ? this.dataExcel[key].sp_ingresos.trim() : "";
            filter_values['SC_EGRESOS'] = (this.dataExcel[key].sp_egresos != null) ? this.dataExcel[key].sp_egresos.trim() : "";
            filter_values['RC_INGRESOS'] = (this.dataExcel[key].rc_ingresos != null) ? this.dataExcel[key].rc_ingresos.trim() : "";
            filter_values['RC_EGRESOS'] = (this.dataExcel[key].rc_egresos != null) ? this.dataExcel[key].rc_egresos.trim() : "";
            filter_values['TC_INCREMENTO'] = (this.dataExcel[key].tc_incremento != null) ? this.dataExcel[key].tc_incremento.trim() : "";
            filter_values['TC_REDUCCION'] = (this.dataExcel[key].tc_reduccion != null) ? this.dataExcel[key].tc_reduccion.trim() : "";
            filter_values['FINAL'] = (this.dataExcel[key].final != null) ? this.dataExcel[key].final.trim() : "";

            excelData.push(filter_values);
          })
          this.exportarAsXLSX(excelData);
          this.lcargando.ctlSpinner(false);
        }
    // this.mensajeSpiner = 'Generando reporte Excel...';
    // this.lcargando.ctlSpinner(true);
    // console.log(this.dataExcel);
    // let year = this.periodo;
    // let partida = 'PARTIDA';
    // let concepto = 'CONCEPTO';
    // let programa = 'PROGRAMA';
    // let anual = 'ANUAL';
    // let sp_ingresos = 'SC_INGRESOS';
    // let sp_egresos = 'SC_EGRESOS';
    // let rc_ingresos = 'RC_INGRESOS';
    // let rc_egresos = 'RC_EGRESOS';
    // let tc_incremento = 'TC_INCREMENTO';
    // let tc_reduccion = 'TC_REDUCCION';
    // let final = 'FINAL';

    // let copy = JSON.parse(JSON.stringify(this.dataExcel));

    // copy.forEach(e => {
    //   e[partida] = e.partida;
    //   e[concepto] = e.concepto;
    //   e[programa] = e.programa;
    //   e[anual] = e.anual;
    //   e[sp_ingresos] = e.sp_ingresos;
    //   e[sp_egresos] = e.sp_egresos;
    //   e[rc_ingresos] = e.rc_ingresos;
    //   e[rc_egresos] = e.rc_egresos;
    //   e[tc_incremento] = e.tc_incremento;
    //   e[tc_reduccion] = e.tc_reduccion;
    //   e[final] = e.final;
    //   delete e.partida;
    //   delete e.denoiodo1;
    //   delete e.perminacion;
    //   delete e.periodo2;
    //   delete e.periodo3;
    //   delete e.semestre1;
    //   delete e.semestre2;
    //   delete e.periodo4;
    //   delete e.provisional;
    //   delete e.definitivo;
    //   delete e.observaciones;
    // })
    
    // this.titles =  [partida, concepto, programa, anual, sp_ingresos, sp_egresos, rc_ingresos, rc_egresos, tc_incremento, tc_reduccion, final];
    // console.log(copy);

    // this.exportAsXLSX(copy, 'Asignacion inicial periodo '+this.periodo, {header: this.titles});
    // this.lcargando.ctlSpinner(false);
  }

  exportAsXLSX(body, title, header) {
    this.excelSrv.exportAsExcelFile(body, title , header);
  }
  exportarAsXLSX(excelData) {
    this.excelSrv.exportAsExcelFile(excelData, 'Asignacion inicial periodo '+this.periodo);
  }

  
  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " GUARDAR":
      this.validaGuardar();
        break;
      case " BUSCAR":
        if(this.periodo<2000 || this.periodo>2050){
          this.toastr.warning('El periodo debe tener formato de año ');
          this.periodo = undefined;
        }else{
          this.modalReformas();
        }
        break;
      case " ANULAR":
        Swal.fire({
          icon: "warning",
          title: "¡Atención!",
          text: "¿Seguro que desea anular la asignacion de ingresos para el periodo "+this.periodo+"?",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        }).then((result) => {
          if (result.isConfirmed) {            
            this.anularIngresos(); 
          }
        });
        break;
      case " LIMPIAR":
        this.restoreForm();
        break;
      case " EXCEL":
          this.getDataExportar();
        break;
      case " PDF":
          this.getDataPDF();
          break;
    }
  }

  validaGuardar() {

    let mensaje: string = '';
    if(
      this.periodo == undefined
    ){
      mensaje += '* Debe ingresar el Periodo<br>'
    }
    else if(this.tipoReforma == undefined || this.tipoReforma == ''){
      mensaje += '* Debe seleccionar un tipo de reforma<br>'
    }
    else if(
      this.file == undefined
    ){
      mensaje += '* Debe subir un Archivo Excel con la asignacion de ingresos para el periodo<br>'
    }else if(this.dataExcel.length <= 0){
      mensaje += '* No existen registros para Guardar<br>'

    }else if(this.periodo != undefined && this.periodo != moment(this.fecha_ingreso).format('YYYY')){
      mensaje += '* La fecha no coincide con el período seleccionado<br>'
    }
    else if(this.dataExcel.length > 0){
      console.log(this.dataExcel)
      if(this.tipoReforma == 'SUPLEMENTO'){
        let totalIngresos = 0
        let totalEgresos = 0
        this.dataExcel.forEach(element => {
          console.log(element['sp_ingresos'])
          console.log(element['sp_egresos'])
          totalIngresos += +parseFloat(element['sp_ingresos'])
          totalEgresos += +parseFloat(element['sp_egresos'])
        });
        console.log(totalIngresos,totalEgresos )
        if((totalIngresos == 0 &&  totalEgresos == 0)){
          mensaje += '* El total de SC_INGRESOS y SC_EGRESOS no puede ser 0<br>'
        
        }else if((totalIngresos != totalEgresos) ){
          mensaje += '* El total de SC_INGRESOS debe ser igual al total de SC_EGRESOS<br>'
        
        }
      }else if(this.tipoReforma == 'REDUCCION'){
          let totalIngresos = 0
          let totalEgresos = 0
          this.dataExcel.forEach(element => {
            totalIngresos += +parseFloat(element['rc_ingresos'])
            totalEgresos += +parseFloat(element['rc_egresos'])
          });
          if((totalIngresos == 0 &&  totalEgresos == 0)){
            mensaje += '* El total de RC_INGRESOS y RC_EGRESOS no puede ser 0<br>'
         
          }else if((totalIngresos != totalEgresos) ){
            mensaje += '* El total de RC_INGRESOS debe ser igual al total de RC_EGRESOS<br>'
        
          } 
      }else if (this.tipoReforma == 'TRASPASO'){
            let totalIngresos = 0
            let totalEgresos = 0
            this.dataExcel.forEach(element => {
              totalIngresos += +parseFloat(element['tc_incremento'])
              totalEgresos += +parseFloat(element['tc_reduccion'])
            });
            console.log(totalIngresos, totalEgresos)
            if((totalIngresos == 0 &&  totalEgresos == 0)){
              mensaje += '* El total de TC_INCREMENTO y TC_REDUCCION no puede ser 0<br>'

            }else if((totalIngresos != totalEgresos) ){
              mensaje += '* El total de TC_INCREMENTO debe ser igual al total de TC_REDUCCION<br>'
            }
          
      }
     
    }
      if (mensaje.length > 0) {
          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            //text: mensaje,
            html:mensaje,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            //cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
      })
      }else{
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
            this.mensajeSpiner = "Verificando período contable";
            this.lcargando.ctlSpinner(true);
            let data = {
              "anio": Number(this.periodo),
              "mes": Number(moment(this.fecha_ingreso).format('MM'))
            }
              this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {
              
              /* Validamos si el periodo se encuentra aperturado */
              if (res["data"][0].estado !== 'C') {
               
                this.guardarIngresos(); 
          
              } else {
                this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                this.lcargando.ctlSpinner(false);
              }
          
              }, error => {
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.mesagge);
              })
          
          }
        });
      }

  }

  checkPeriodo() {

    this.mensajeSpiner = 'Obteniendo asignacion de ingresos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      periodo: this.periodo      
    };

    console.log(data);
    this.apiSrv.getReformas(data).subscribe(
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

  async fillCatalog() {
    this.lcargando.ctlSpinner(true);
    try {
      //
      this.mensajeSpiner = 'Cargando catalogos';
      let catalogos = await this.apiSrv.getCatalogo({params: "'PRE_REFORMAS'"});
      this.catalog = catalogos['PRE_REFORMAS'];

      this.mensajeSpiner = 'Cargando Periodos';
      let periodos = await this.apiSrv.getPeriodos();
      this.cmb_periodo = periodos;

      this.mensajeSpiner = 'Cargando Programas';
      let programas = await this.apiSrv.getProgramas();
      programas.map((programa: any) => Object.assign(programa, { label: `${programa.descripcion}. ${programa.valor}` }))
      this.cmb_programas = programas;

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial')
    }

    /* this.mensajeSpiner = "Cargando Catalogs";

    let data = {
      params: "'PRE_REFORMAS'",
    };

    this.apiSrv.getCatalogs(data).subscribe(
      (res) => {
        console.log(res);
        this.catalog = res["data"]["PRE_REFORMAS"];
        

        // console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    ); */
  }

  handleSelectPrograma(event: any) {
    this.programaSelected = event
  }

  guardarIngresos() {

    this.mensajeSpiner = 'Guardando Reformas...';
    this.lcargando.ctlSpinner(true);

    let data = {
      data_excel: this.dataExcel,
      periodo: this.periodo,
      fecha: moment(this.fecha_ingreso).format('YYYY-MM-DD'),
      tipoReforma: this.tipoReforma,
      programa: this.programaSelected  
    };

    console.log(data);
    this.apiSrv.guardarIngresosPorPeriodo(data).subscribe(
      (res:any) => {
        console.log(res);
        
        console.log(this.fecha_ingreso);
        Swal.fire({
          icon: "success",
          title: "Guardada la reforma con éxito",
          // Asignacion de ingresos para periodo "+this.periodo+" guardada satisfactoriamente
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
        this.no_reforma = res['No_reforma'];
        this.fecha_ingreso = moment(res.fecha_registro).format('YYY-MM-DD')
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
    this.mensajeSpiner = 'Obteniendo reformas...';
    this.lcargando.ctlSpinner(true);

    let data = {
      periodo: this.periodo      
    };

    console.log(data);
    this.apiSrv.getReformas(data).subscribe(
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
  anularIngresos() {


    this.mensajeSpiner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);
    let data = {
      "anio": Number(this.periodo),
      "mes": Number(moment(this.fecha_ingreso).format('MM'))
    }
      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {
      
      /* Validamos si el periodo se encuentra aperturado */
      if (res["data"][0].estado !== 'C') {
       
        this.mensajeSpiner = 'Anulando asignacion de ingresos...';
        this.lcargando.ctlSpinner(true);

        let data2 = {
          periodo: this.periodo, 
          id_reforma : this.id   
        };

        console.log(data2);
        this.apiSrv.anularIngrePorPeriodo(data2).subscribe(
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
            this.toastr.error(err.error.message, 'Error al anular la asignacion de ingresos')
          }
        )
  
      } else {
        this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
        this.lcargando.ctlSpinner(false);
      }   
  
      }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
      })
  }

  restoreForm() {
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    // this.vmButtons[2].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[5].habilitar = true;

    this.dataExcel = [];
    this.file = undefined;
    this.periodo = undefined;
    this.estado = undefined;
    this.yearDisabled = false;
    this.fileDisabled = true;
    this.btnDisabled = true;

    this.headersEnable = false;
    this.break = false;
    this.tipoReforma = 0;
    this.no_reforma = undefined;
    this.fileValid = false;
    this.fecha_ingreso = moment(new Date()).format('YYYY-MM-DD');
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
          this.fillCatalog()
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
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
       //this.fillTable(jsonData);
      
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
 
    // console.log(dataJson);
    let year = this.periodo;
    let partida = 'PARTIDA';
    let concepto = 'CONCEPTO';
    let programa = 'PROGRAMA';
    let anual = 'ANUAL';
    let sp_ingresos = 'SC_INGRESOS';
    let sp_egresos = 'SC_EGRESOS';
    let rc_ingresos = 'RC_INGRESOS';
    let rc_egresos = 'RC_EGRESOS';
    let tc_incremento = 'TC_INCREMENTO';
    let tc_reduccion = 'TC_REDUCCION';
    let final = 'FINAL';

    let mensaje: string = '';
    
    if(dataJson['data']){
     
      let arr = dataJson['data'];
      let totalSCingresos = 0
      let totalSCegresos = 0
    
      let totalRCingresos = 0
      let totalRCegresos = 0
    
      let totalTCincremento = 0
      let totalTCreduccion = 0

      let totalFinal= 0

      this.dataExcel = [];
      this.totalSCingresos = 0
      this.totalSCegresos = 0
    
      this.totalRCingresos = 0
      this.totalRCegresos = 0
    
       this.totalTCincremento = 0
       this.totalTCreduccion = 0
       this.totalFinal = 0

      arr.forEach(e => {
        let data = {
          partida: e[partida]??'',
          concepto: e[concepto]??'',
          programa: e[programa]??'',
          anual: e[anual]??this.notData(e[anual]),
          sp_ingresos: e[sp_ingresos]??this.notData(e[anual]),
          sp_egresos: e[sp_egresos]??this.notData(e[anual]),
          rc_ingresos: e[rc_ingresos]??this.notData(e[anual]),
          rc_egresos: e[rc_egresos]??this.notData(e[anual]),
          tc_incremento: e[tc_incremento]??this.notData(e[anual]),
          tc_reduccion: e[tc_reduccion]??this.notData(e[anual]),
          final: e[final]??this.notData(e[anual]),

         
          
        }

        totalSCingresos += +parseFloat(e[sp_ingresos])
        totalSCegresos += +parseFloat(e[sp_egresos])
        totalRCingresos += +parseFloat(e[rc_ingresos])
        totalRCegresos += +parseFloat(e[rc_egresos])
        totalTCincremento += +parseFloat(e[tc_incremento])
        totalTCreduccion += +parseFloat(e[tc_reduccion])
        totalFinal += +parseFloat(e[final])

        this.dataExcel.push(data);
      })

      this.totalSCingresos = totalSCingresos
      this.totalSCegresos = totalSCegresos
    
      this.totalRCingresos = totalRCingresos
      this.totalRCegresos = totalRCegresos
    
      this.totalTCincremento = totalTCincremento
      this.totalTCreduccion = totalTCreduccion
      this.totalFinal = totalFinal
      console.log(this.dataExcel);
 

      this.titles =  [partida, concepto, programa,  anual, sp_ingresos, sp_egresos, rc_ingresos, rc_egresos, tc_incremento, tc_reduccion, final ];
      // for(let i=0; i<this.dataExcel.length; i++){
      //   console.log(this.dataExcel[i]['igual_custodio'])
       
      //   if (this.dataExcel[i]['partida'] == undefined && this.dataExcel[i]['partida'] == '') mensaje += '* Debe ingresar un número de partida en la fila '+ [i+2] +' en el archivo excel. La partida  no puede estar vacio.<br>'
      //   if (this.dataExcel[i]['programa'] == undefined && this.dataExcel[i]['programa'] == '') mensaje += '* Debe ingresar un programa en la fila '+ [i+2] + ' en el archivo excel. El programa no puede estar  vacios.<br>'
      // }

      // if (mensaje.length > 0) {
      //     Swal.fire({
      //       icon: "warning",
      //       title: "¡Atención!",
      //       //text: mensaje,
      //       html:mensaje,
      //       showCloseButton: true,
      //       showCancelButton: false,
      //       showConfirmButton: true,
      //       //cancelButtonText: "Cancelar",
      //       confirmButtonText: "Aceptar",
      //       cancelButtonColor: '#F86C6B',
      //       confirmButtonColor: '#4DBD74',
      //     }).then((result) => {
      //       if (result.isConfirmed) {
      //         this.vmButtons[0].habilitar = true;
      //       }
      //     });
      //   //this.toastr.warning(mensaje, 'Validacion de Datos', { enableHtml: true })
      //   return;
      // }

      
      if(this.break){
        this.dataExcel = [];
        this.toastr.info('El archivo seleccionado no contiene el formato adecuado');
        return ;
      }
      this.yearDisabled = true;
      this.headersEnable = true;
    }else{
      console.log('holis');
      this.toastr.info('El archivo seleccionado no contiene el formato adecuado');
    }
  }

  notData(e): number {
    // console.log(e);
    this.break = true;
    return 0;
  }

  fillTableBySearch(data) {
    let arr = data.detalles;
    this.dataExcel = [];

    let totalSCingresos = 0
    let totalSCegresos = 0
  
    let totalRCingresos = 0
    let totalRCegresos = 0
  
    let totalTCincremento = 0
    let totalTCreduccion = 0
    let totalFinal= 0

    this.totalSCingresos = 0
    this.totalSCegresos = 0
  
    this.totalRCingresos = 0
    this.totalRCegresos = 0
  
     this.totalTCincremento = 0
     this.totalTCreduccion = 0
     this.totalFinal = 0


    arr.forEach(e => {
      let data = {
        partida: e['partida']??'',
        //concepto: e['concepto']??'',
        concepto: e['presupuesto']['nombre']??'',
        programa: e['programa']['descripcion']+'-'+e['programa']['valor']??0,
        anual: e['anual']??0,
        sp_ingresos: e['sp_ingresos']??0,
        sp_egresos: e['sp_egresos']??0,
        rc_ingresos: e['rc_ingresos']??0,
        rc_egresos: e['rc_egresos']??0,
        tc_incremento: e['tc_incremento']??0,
        tc_reduccion: e['tc_reduccion']??0,
        final: e['final']??0,
      }


      this.dataExcel.push(data);
    });
    console.log( this.dataExcel)

    this.dataExcel.forEach(e => {
      
      totalSCingresos += +parseFloat(e.sp_ingresos)
      totalSCegresos += +parseFloat(e.sp_egresos)
      totalRCingresos += +parseFloat(e.rc_ingresos)
      totalRCegresos += +parseFloat(e.rc_egresos)
      totalTCincremento += +parseFloat(e.tc_incremento)
      totalTCreduccion += +parseFloat(e.tc_reduccion)
      totalFinal += +parseFloat(e.final)
    });

    this.totalSCingresos = totalSCingresos
    this.totalSCegresos = totalSCegresos
  
    this.totalRCingresos = totalRCingresos
    this.totalRCegresos = totalRCegresos
  
    this.totalTCincremento = totalTCincremento
    this.totalTCreduccion = totalTCreduccion
    this.totalFinal = totalFinal
    
    let year = this.periodo;
    let partida = 'PARTIDA';
    let concepto = 'CONCEPTO';
    let programa = 'PROGRAMA';
    let anual = 'ANUAL';
    let sp_ingresos = 'SC_INGRESOS';
    let sp_egresos = 'SC_EGRESOS';
    let rc_ingresos = 'RC_INGRESOS';
    let rc_egresos = 'RC_EGRESOS';
    let tc_incremento = 'TC_INCREMENTO';
    let tc_reduccion = 'TC_REDUCCION';
    let final = 'FINAL';


    this.headersEnable = true;
    this.titles =  [partida, concepto, programa, anual, sp_ingresos, sp_egresos, rc_ingresos, rc_egresos, tc_incremento, tc_reduccion, final ];
    this.vmButtons[0].habilitar = true;
    // this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = false;
    //this.vmButtons[4].habilitar = false;

  }

  agregaPeriodo() {
 
    if(this.periodo == undefined){
      this.toastr.info('Debe seleccionar un periodo');
      // this.periodo = undefined;
      // return ;
    }
    else if(this.tipoReforma == undefined || this.tipoReforma == 0){
      this.toastr.info('Debe seleccionar un tipo de reforma');
    }
    else{
      this.validaPartidas(this.jsonData)
    }
    // this.break = false;
    // console.log(this.jsonData);
   
  }

  validaPartidas(excel) {
    this.mensajeSpiner = 'Cargando archivo';
    this.lcargando.ctlSpinner(true);

      let partida = 'PARTIDA';
      let programa = 'PROGRAMA';
      this.dataExcel = [];
      let datos = [];
      if(excel['data']){
       
        let arr = excel['data'];
        arr.forEach(e => {
          let data = {
            codigo:e[partida],
            programa:e[programa]
          };
          datos.push(data)
        })
      }
  
      let params = {
        partida_programa: datos,
      };
  
      this.apiSrv.validarPartidas(params).subscribe(
        res => {
         console.log(res)
         let partNoEncontradas = res['data'][0].partnoencontradas
         let progNoEncontrados = res['data'][0].prognoencontrados
         console.log(partNoEncontradas)
         console.log(progNoEncontrados)
  
         this.lcargando.ctlSpinner(false)
  
         let mensaje: string = '';
         if(partNoEncontradas != undefined ){
          for(let i=0; i<partNoEncontradas.length; i++){
            mensaje += '* Debe corregir el valor de la columna PARTIDA en el archivo excel. El valor de la partida no puede ser '+ partNoEncontradas[i]['partida'] +' en la fila '+ (partNoEncontradas[i]['linea'] + 2)+'<br>'
          }
         }
         if(progNoEncontrados != undefined){
          for(let i=0; i<progNoEncontrados.length; i++){
            mensaje += '* Debe corregir el valor de la columna PROGRAMA en el archivo excel. El valor del programa no puede ser '+ progNoEncontrados[i]['programa'] +' en la fila '+ (progNoEncontrados[i]['linea'] + 2 )+'<br>'
           }
         }
         
   
         if (mensaje.length > 0) {
             Swal.fire({
               icon: "warning",
               title: "¡Atención!",
               //text: mensaje,
               html:mensaje,
               showCloseButton: true,
               showCancelButton: false,
               showConfirmButton: true,
               //cancelButtonText: "Cancelar",
               confirmButtonText: "Aceptar",
               cancelButtonColor: '#F86C6B',
               confirmButtonColor: '#4DBD74',
             })
            //  .then((result) => {
            //    if (result.isConfirmed) {
            //      this.vmButtons[0].habilitar = true;
            //    }
            //  });
           //this.toastr.warning(mensaje, 'Validacion de Datos', { enableHtml: true })
           return;
         }else{
          
          this.fillTable(excel);
         }
        },
        err => {
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error validando datos de partidas y programas')
        }
      )
    

  
  }




  modalReformas(){
    const modal = this.modal.open(ModalBusquedaReformaComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  getDataPDF(){
    window.open(environment.ReportingUrl +"rpt_pre_reforma.pdf?&j_username=" + environment.UserReporting 
    + "&j_password=" + environment.PasswordReporting+"&id=" + this.id,'_blank')
  }

}
