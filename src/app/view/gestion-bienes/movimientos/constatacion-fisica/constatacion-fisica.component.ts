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
import { ConstatacionFisicaService } from './constatacion-fisica.service';
// import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBusquedaConstatacionComponent } from './modal-busqueda-constatacion/modal-busqueda-constatacion.component';
import { CommonVarService } from 'src/app/services/common-var.services';


@Component({
  selector: 'app-constatacion-fisica',
  templateUrl: './constatacion-fisica.component.html',
  styleUrls: ['./constatacion-fisica.component.scss']
})
export class ConstatacionFisicaComponent implements OnInit {

  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  
  fTitle: string = "Constatacion fisica";

  vmButtons: any = [];
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
  listaCatalogo:any= []
  listaProductos:any= []
  fecha= moment(new Date()).format('YYYY-MM-DD')
  numero_documento:any
  observacion:any
  estado = 'E'
  constDisabled = false

  constructor(
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private apiSrv: ConstatacionFisicaService,
    private excelSrv: ExcelService,
    private modal: NgbModal,
    private commonVrs: CommonVarService,
  ) { 
    this.commonVrs.modalConstFisica.asObservable().subscribe(
      (res)=>{
        console.log(res)
        this.fecha = res['fecha'],
        this.observacion = res['observacion']
        this.estado = res['estado']
        this.periodo = res['tipo_bien']
        this.numero_documento = res['numero_documento']
        this.fillTableBySearch(res)
        this.constDisabled = true
      }
    )
  }

  ngOnInit(): void {
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
        boton: { icon: "far fa-search", texto: "BUSCAR" },
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
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(() => {
      //this.validaPermisos();
      this.catalogo()
      this.productos()
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
    if(this.periodo==undefined || this.periodo=='' ){
      this.toastr.warning('Ingrese un tipo de bien ');
      this.periodo = undefined;
      return ;
    }

    let codigo = 'CÓDIGO';
    let producto = 'PRODUCTO';
    let stock = 'STOCK SISTEMA';
    let stock_fisico = 'STOCK FÍSICO';
    let diferencia = 'DIFERENCIA';
    let observacion = 'OBSERVACIÓN';
    // let periodo2 = ''+(+this.periodo - 3);
    // let periodo3 = ''+(+this.periodo - 2);
    // let ant_periodo = ''+(+this.periodo - 1);
    // let act_periodo = ''+this.periodo;
    // let semestre1 = 'ENERO a JUNIO '+ant_periodo;
    // let semestre2 = 'JULIO a DICIEMBRE '+ant_periodo;
    // let periodo4 = 'ENERO A DICIEMBRE '+ant_periodo;
    // let provisional = 'PROVISIONAL '+act_periodo;
    // let definitivo = 'AÑO '+act_periodo;
    // let observaciones = 'OBSERVACIONES';

    this.plantillaExcel = [];
    for(let i=0; i<this.listaProductos.length; i++){
      
      let data = {};
      data[codigo] = this.listaProductos[i].codigoProducto;
      data[producto] = this.listaProductos[i].nombre;
      data[stock] = 0;
      data[stock_fisico] = 0;
      data[diferencia] = 0;
      data[observacion] = '';
      // data[periodo2] = 0;
      // data[periodo3] = 0;
      // data[semestre1] = 0;
      // data[semestre2] = 0;
      // data[periodo4] = 0;
      // data[provisional] = 0;
      // data[definitivo] = 0;
      // data[observaciones] = 'Esto es una observacion para partida '+(i+1);

      this.plantillaExcel.push(data);

    }
    console.log(this.plantillaExcel);
    this.titles =  [codigo, producto, stock,stock_fisico,diferencia,observacion];

    this.exportAsXLSX(this.plantillaExcel ,'Constatacion fisica '+this.periodo, {header: this.titles});
    
  }

  exportAsXLSX(body, title, header) {
    this.excelSrv.exportAsExcelFile(body, title , header);
  }

  getDataExportar() {
    console.log(this.dataExcel);
    let codigo = 'CÓDIGO';
    let producto = 'PRODUCTO';
    let stock = 'STOCK SISTEMA';
    let stock_fisico = 'STOCK FÍSICO';
    let diferencia = 'DIFERENCIA';
    let observacion = 'OBSERVACIÓN';
    

    let copy = JSON.parse(JSON.stringify(this.dataExcel));

    copy.forEach(e => {
      e[codigo] = e.codigo;
      e[producto] = e.producto;
      e[stock] = e.stock;
      e[stock_fisico] = e.stock_fisico;
      e[diferencia] = e.diferencia;
      e[observacion] = e.observacion;
      
      delete e.codigo;
      delete e.producto;
      delete e.stock;
      delete e.stock_fisico;
      delete e.diferencia;
      delete e.observacion;
      
    })
    
    this.titles =  [codigo, producto, stock, stock_fisico, diferencia,observacion];
    console.log(copy);

    this.exportAsXLSX(copy, 'Constatación fisica '+this.periodo, {header: this.titles});
  }

  
  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " GUARDAR":
      this.validaGuardar();
        break;
      case "BUSCAR": 
          this.modalReformas();
        
        break;
      case " ELIMINAR":
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
      case " LIMPIAR":
        this.restoreForm();
        break;
      case " EXCEL":
      this.getDataExportar();
        break;
    }
  }

  validaGuardar() {
    if(
      this.periodo == undefined
    ){
      this.toastr.info('Debe ingresar el tipo de bien');
      return ;
    }else if(
      this.file == undefined
    ){
      this.toastr.info('Debe subir un Archivo Excel con la constatación física');
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
      text: "¿Seguro que desea registrar la constatación física de  "+this.periodo+"?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {            
       this.guardarIngresos()
      }
    });


  }

  checkPeriodo() {

    this.mensajeSpiner = 'Obteniendo constatación física...';
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
            text: 'No puede GUARDAR datos para el tipo de bien '+this.periodo+'.',
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
        this.toastr.error(err.error.message, 'Error al inspeccionar la constatación física')
      }
    )
  }

  guardarIngresos() {

    this.mensajeSpiner = 'Guardando constatación física...';
    this.lcargando.ctlSpinner(true);

    let data = {
      data_excel: this.dataExcel,
      periodo: this.periodo,      
      fecha:this.fecha,
      observacion: this.observacion
    };

    console.log(data);
    this.apiSrv.guardarConstatacion(data).subscribe(
      res => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Exito",
          // Asignacion de ingresos para periodo "+this.periodo+" guardada satisfactoriamente
          text: 'Se guardo exitosamente la constatacion fisica',
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
        this.vmButtons[0].habilitar = true;
        this.vmButtons[3].habilitar = false;
        this.lcargando.ctlSpinner(false);
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error al guardar la constatación física')
      }
    )
  }

  inspeccionarPeriodo() {
    this.mensajeSpiner = 'Obteniendo constatación física...';
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
    console.log("aqui")
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = false;
   

    this.dataExcel = [];
    this.file = undefined;
    this.periodo = undefined;
    this.yearDisabled = false;
    this.fileDisabled = true;
    this.btnDisabled = true;
    this.observacion = '',
    this.estado = 'E',
    this.numero_documento = ''

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
    let codigo = 'CÓDIGO';
    let producto = 'PRODUCTO';
    let stock = 'STOCK SISTEMA';
    let stock_fisico = 'STOCK FÍSICO';
    let diferencia = 'DIFERENCIA';
    let observacion = 'OBSERVACIÓN';

    if(dataJson['data']){
      let arr = dataJson['data'];
      this.dataExcel = [];
      arr.forEach(e => {
        let data = {
          codigo: e[codigo]??'',
          producto: e[producto]??'',
          stock: e[stock]?? '0',
          stock_fisico: e[stock_fisico]??this.notData(),
          diferencia: e[diferencia]?? '0',
          observacion: e[observacion]?? '',
          
          // periodo2: e[periodo2]??this.notData(),
          // periodo3: e[periodo3]??this.notData(),
          // semestre1: e[semestre1]??this.notData(),
          // semestre2: e[semestre2]??this.notData(),
          // periodo4: e[periodo4]??this.notData(),
          // provisional: e[provisional]??this.notData(),
          // definitivo: e[definitivo]??this.notData(),
          // observaciones: e[observaciones]??'',
        }
        this.dataExcel.push(data);
      })
      console.log(this.dataExcel)
      for(let i = 0 ; i < this.listaProductos.length; i++){
        console.log(i)
        this.dataExcel[i]['stock'] = this.listaProductos[i]['stock']
        this.dataExcel[i]['diferencia'] = this.listaProductos[i]['stock'] - this.dataExcel[i]['stock_fisico']


      }
      console.log(this.dataExcel)
      this.titles =  [codigo, producto, stock, stock_fisico,diferencia,observacion];
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
    let arr = data.detalles;
    this.dataExcel = [];
    arr.forEach(e => {
      let data = {
        codigo: e['codigo']??'',
        producto: e['producto']??'',
        stock: e['stock_sistema']??0,
        stock_fisico: e['stock_fisico']??0,
        diferencia: e['diferencia']??0,
        observacion: e['observacion']??'',
        
        
      }
      this.dataExcel.push(data);
    });
    
    let codigo = 'CÓDIGO';
    let producto = 'PRODUCTO';
    let stock = 'STOCK SISTEMA';
    let stock_fisico = 'STOCK FÍSICO';
    let diferencia = 'DIFERENCIA';
    let observacion = 'OBSERVACIÓN';
   

    this.headersEnable = true;
    this.titles =  [codigo, producto, stock, stock_fisico, diferencia,observacion];
    this.vmButtons[0].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = false;

  }

  agregaPeriodo() {
    console.log(this.periodo);
    // this.toastr.info('Agregue un archivo excel correspondiente al periodo '+this.periodo);
    // this.file = undefined;
    if(this.periodo=='' || this.periodo==undefined){
      this.toastr.warning('Ingrese un tipo de bien valido ');
      this.periodo = undefined;
      return ;
    }
    this.break = false;
    console.log(this.jsonData);
    this.fillTable(this.jsonData);
  }

  catalogo() {

    this.apiSrv.listarCatalogo({}).subscribe((res: any) => {
      res.map((data) => {
        this.listaCatalogo.push(data.descripcion)

      })
    })
  }

  productos() {

    this.apiSrv.listarProducto({}).subscribe((res: any) => {
      res.map((data) => {
        this.listaProductos.push(data)
        
      })
      console.log(this.listaProductos)
    })
  }

  modalReformas(){
    const modal = this.modal.open(ModalBusquedaConstatacionComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }


}
