
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
import { ConstatacionFisicaBCAService } from './constatacion-fisica-bca.service';
// import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBusquedaConstatacionComponent } from './modal-busqueda-constatacion/modal-busqueda-constatacion.component';
import { CommonVarService } from 'src/app/services/common-var.services';

@Component({
  selector: 'app-constatacion-fisica-bca',
  templateUrl: './constatacion-fisica-bca.component.html',
  styleUrls: ['./constatacion-fisica-bca.component.scss']
})
export class ConstatacionFisicaBCAComponent implements OnInit {
  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  fTitle: string = "Constatacion fisica BCA";

  vmButtons: any = [];
  dataUser: any;
  permisos: any;
  willDownload = false;

  jsonData: any;
  dataExcel: any = [];

  file: any;
  codigo: any;
  periodo: any;
  yearDisabled = false;
  fileDisabled = true;
  btnDisabled = false;
  headersEnable = false;
  departamento1: any = {
    departamento: ''
  }
  plantillaExcel = [];
  selectDepartamento: any = ' ';
  titles: any = [];
  break = false;
  listaCatalogo: any = []
  listaProductos: any = []
  listaDepartamento: any = []
  fecha = moment(new Date()).format('YYYY-MM-DD')
  numero_documento: any
  observacion: any
  estado = 'E'
  constDisabled = false

  constructor(
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private apiSrv: ConstatacionFisicaBCAService,
    private excelSrv: ExcelService,
    private modal: NgbModal,
    private commonVrs: CommonVarService,
  ) {
    this.commonVrs.modalConstFisica.asObservable().subscribe(
      (res) => {
        console.log(res)

        // this.codigo = res['codigo']
        //this.fecha = res['fecha_adquisicion'],
        /*this.observacion = res['observacion']
        this.estado = res['estado']
        this.periodo = res['tipo_bien']
        this.numero_documento = res['numero_documento']*/
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
        habilitar: false,
      },
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(() => {
      //this.validaPermisos();
      this.catalogo()
      this.productos()
      this.Departamentos()
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
    if (this.periodo == undefined || this.periodo == '') {
      this.toastr.warning('Ingrese un tipo de bien ');
      this.periodo = undefined;
      return;
    }

    /*let fecha_adquisicion = 'FECHA ADQUISICION';
    let codigo = 'codigo';
    let descripcion = 'descripcion';
    let cant = 'cant';
    let caracteristica = 'caracteristica';
    let color = 'color';
    let custodio = 'custodio';
    let igual_custodio ='igual_custodio';
    let valor_inicial = 'valor_inicial';
    let estado = 'estado';
    let existencia_real = 'existencia_real';
    let no_ingreso = 'no_ingreso';
    let cod_int_bodega = 'cod_int_bodega';
    let observacion = 'observacion';*/


    let parametros = {
      //departamento:this.selectDepartamento
    };

    let plantilla = []
    this.apiSrv.listarBienesPorDepartamento(parametros = {
      departamento: this.selectDepartamento,
      bien: this.periodo
    }).subscribe(
      (res: any) => {
        console.log(res)
        res.data.forEach((e: any) => {

          const data = {
            'FECHA ADQUISICION': e.fecha_adquisicion,
            'CODIGO': e.codigo,
            'DESCRIPCION': e.descripcion,
            'CANTIDAD': e.cant,
            'CARACTERISTICA': e.caracteristica,
            'COLOR': e.color,
            'CUSTODIO': e.custodio,
            'IGUAL CUSTODIO: (S / N)': '',
            'VALOR INICIAL': e.valor_inicial,
            'ESTADO: REGULAR= R  BUENO= B  PERDIDO= P  MALO= M': '',
            'EXISTENCIA REAL: EN USO= U SIN USAR= SU': '',
            'NO INGRESO': e.no_ingreso,
            'COD INT BODEGA': e.cod_int_bodega,
            'OBSERVACION': e.observacion,
          }
          plantilla.push(data)
          
        })
        
        this.titles = ['FECHA ADQUISICION','CODIGO','DESCRIPCION','CANTIDAD','CARACTERISTICA','COLOR','CUSTODIO','IGUAL CUSTODIO: (S / N)','VALOR INICIAL','ESTADO: REGULAR= R  BUENO= B  PERDIDO= P  MALO= M','EXISTENCIA REAL: EN USO= U SIN USAR= SU','NO INGRESO','COD INT BODEGA','OBSERVACION'];
        this.exportAsXLSX(plantilla, 'Constatacion fisica BCA ' + this.periodo,{header: this.titles});
      })
    console.log(plantilla);


    // this.titles =  [fecha_adquisicion, codigo, descripcion, cant, caracteristica, color, custodio , valor_inicial , estado, existencia_real , no_ingreso , cod_int_bodega];

  }


  exportAsXLSX(body, title, header) {
    this.excelSrv.exportAsExcelFile(body, title, header);






  }

  getDataExportar() {
    console.log(this.dataExcel);

    let fecha_adquisicion = 'FECHA_ADQUISICION'
    let codigo = 'CODIGO';
    let descripcion = 'DESCRIPCION';
    let cant = 'CANT';
    let caracteristica = 'CARACTERISTICA';
    let color = 'COLOR';
    let custodio = 'CUSTODIO';
    let valor_inicial = 'VALOR INICIAL';
    let estado = 'ESTADO';
    let existencia_real = 'EXISTENCIA REAL';
    let no_ingreso = 'NO. INGRESO';
    let cod_int_bodega = 'COD. INT. BODEGA';

    let copy = JSON.parse(JSON.stringify(this.dataExcel));

    copy.forEach(e => {
      e[fecha_adquisicion] = e.fecha_adquisicion;
      e[codigo] = e.codigo;
      e[descripcion] = e.descripcion;
      e[cant] = e.cant;
      e[caracteristica] = e.caracteristica;
      e[color] = e.color;
      e[custodio] = e.custodio;
      e[valor_inicial] = e.valor_inicial;
      e[estado] = e.estado;
      e[existencia_real] = e.existencia_real;
      e[no_ingreso] = e.no_ingreso;
      e[cod_int_bodega] = e.cod_int_bodega;


      delete e.fecha_adquisicion;
      delete e.codigo;
      delete e.descripcion;
      delete e.cant;
      delete e.caracteristica;
      delete e.color;
      delete e.custodio;
      delete e.valor_inicial;
      delete e.estado;
      delete e.existencia_real;
      delete e.no_ingreso;
      delete e.cod_int_bodega;

    })

    this.titles = [fecha_adquisicion, codigo, descripcion, cant, caracteristica, color, custodio, valor_inicial, estado, existencia_real, no_ingreso, cod_int_bodega];
    console.log(copy);

    this.exportAsXLSX(copy, 'Constatación fisica BCA' + this.periodo, { header: this.titles });
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
          text: "¿Seguro que desea eliminar la asignacion de ingresos para el periodo " + this.periodo + "?",
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
    if (
      this.periodo == undefined
    ) {
      this.toastr.info('Debe ingresar el tipo de bien');
      return;
    } else if (
      this.file == undefined
    ) {
      this.toastr.info('Debe subir un Archivo Excel con la constatación física');
      return;
    } else if (
      this.dataExcel.length <= 0
    ) {
      this.toastr.info('No existen registros para Guardar');
      return;
    }
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea registrar la constatación física de  " + this.periodo + "?",
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
        if (res['data'].length == 0) {
          this.guardarIngresos();
        } else {
          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text: 'No puede GUARDAR datos para el tipo de bien ' + this.periodo + '.',
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
    console.log(this.dataExcel);
    let data = {
      data_excel: this.dataExcel,
      fk_departamento: this.selectDepartamento,
      periodo: this.periodo,
      fecha: this.fecha,
      observacion: this.observacion,
    };
    /*this.dataExcel.forEach(e => {
      this.apiSrv.listarIdProducto({ nombre: e.codigo}).subscribe(
        res => {
          Object.assign(e,{
            fk_producto: res['data'][0]['fk_producto']
          })
      })
    })*/
    console.log(this.dataExcel);
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
    console.log(data);
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
        if (res['data'].length == 0) {
          this.toastr.info('El periodo seleccionado no tiene una asignacion de ingresos aun, puede GUARDAR una subiendo un documento excel del periodo correspondiente');
        } else {
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
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = false;


    this.dataExcel = [];
    this.file = undefined;
    this.periodo = undefined;
    this.file = undefined;
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
      console.log(jsonData);
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
    console.log(dataJson['data']);

    if (dataJson['data']) {
      let arr = dataJson['data'];
      this.dataExcel = [];
      console.log(arr);
      arr.forEach(e => {
        let data = {
          fecha_adquisicion: e['FECHA ADQUISICION'] ?? '',
          codigo: e['CODIGO'] ?? '',
          descripcion: e['DESCRIPCION'] ?? '',
          cant: e['CANTIDAD'] ?? '',
          caracteristica: e['CARACTERISTICA'] ?? '',
          color: e['COLOR'] ?? '',
          custodio: e['CUSTODIO'] ?? '',
          igual_custodio: e['IGUAL CUSTODIO: (S / N)'] ?? '',
          valor_inicial: e['VALOR INICIAL'] ?? '',
          estado: e['ESTADO: REGULAR= R  BUENO= B  PERDIDO= P  MALO= M'] ?? '',
          existencia_real: e['EXISTENCIA REAL: EN USO= U SIN USAR= SU'] ?? '',
          no_ingreso: e['NO INGRESO'] ?? '',
          cod_int_bodega: e['COD INT BODEGA'] ?? '',
          observacion: e['OBSERVACION'] ?? '',
        }
        console.log(data);
        this.dataExcel.push(data);
      })
      console.log(this.dataExcel)

     
      let mensaje: string = '';
      this.titles = ['FECHA ADQUISICIÓN','CÓDIGO','DESCRIPCIÓN','CANTIDAD','CARACTERÍSTICA','COLOR','CUSTODIO','IGUAL CUSTODIO: (S / N)','VALOR INICIAL','ESTADO: REGULAR= R  BUENO= B  PERDIDO= P  MALO= M','EXISTENCIA REAL: EN USO= U SIN USAR= SU','NO. INGRESO','COD. INT. BODEGA','OBSERVACIÓN'];
      for(let i=0; i<this.dataExcel.length; i++){
        console.log(this.dataExcel[i]['igual_custodio'])
        // if((this.dataExcel[i]['estado'] != 'R' && this.dataExcel[i]['estado'] != 'B' && this.dataExcel[i]['estado'] != 'M' && this.dataExcel[i]['estado'] != 'P')
        // || (this.dataExcel[i]['existencia_real'] != 'SU' && this.dataExcel[i]['existencia_real'] != 'U')
        // || (this.dataExcel[i]['igual_custodio'] != 'N' && this.dataExcel[i]['igual_custodio'] != 'S')){
            
        //   //this.toastr.info('El archivo no tiene formato adecuado, no se le permitirà GUARDAR');
        //   Swal.fire({
        //     icon: "warning",
        //     title: "¡Atención!",
        //     text: "El archivo no tiene formato adecuado, no se le permitirà GUARDAR. En color rojo se muestran los campos erròneos",
        //     showCloseButton: true,
        //     showCancelButton: false,
        //     showConfirmButton: true,
        //     //cancelButtonText: "Cancelar",
        //     confirmButtonText: "Aceptar",
        //     cancelButtonColor: '#F86C6B',
        //     confirmButtonColor: '#4DBD74',
        //   }).then((result) => {
        //     if (result.isConfirmed) {
        //       this.vmButtons[0].habilitar = true;
        //     }
        //   });
          
        // };
        if (this.dataExcel[i]['igual_custodio'] != 'N' && this.dataExcel[i]['igual_custodio'] != 'S') mensaje += '* Debe corregir el valor de la columna IGUAL CUSTODIO: (S / N) en la fila '+ [i+2] +' en el archivo excel el valor no puede ser '+this.dataExcel[i]['igual_custodio'] +'<br>'
        if (this.dataExcel[i]['estado'] != 'R' && this.dataExcel[i]['estado'] != 'B' && this.dataExcel[i]['estado'] != 'M' && this.dataExcel[i]['estado'] != 'P') mensaje += '* Debe corregir el valor de la columna ESTADO: REGULAR= R  BUENO= B  PERDIDO= P  MALO= M en la fila '+ [i+2] + ' en el archivo excel el valor no puede ser '+ this.dataExcel[i]['estado'] +'<br>'
        if (this.dataExcel[i]['existencia_real'] != 'SU' && this.dataExcel[i]['existencia_real'] != 'U') mensaje += '* Debe corregir el valor de la columna EXISTENCIA REAL: EN USO= U SIN USAR= SU en la fila '+ [i+2] +' en el archivo excel el valor no puede ser '+ this.dataExcel[i]['existencia_real'] +'<br>'

        /*if((this.dataExcel[i]['existencia_real'] != 'SU' && this.dataExcel[i]['existencia_real'] != 'U')){
          this.toastr.info('El archivo no tiene el campo existencia_real en formato adecuado, no se le permitirà GUARDAR');
          this.vmButtons[0].habilitar = true;
        };
        if((this.dataExcel[i]['igual_custodio'] != 'N' && this.dataExcel[i]['igual_custodio'] != 'S')){
          this.toastr.info('El archivo no tiene el campo igual_custodio en formato adecuador, no se le permitirà GUARDAR');
          this.vmButtons[0].habilitar = true;
        };*/
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
          }).then((result) => {
            if (result.isConfirmed) {
              this.vmButtons[0].habilitar = true;
            }
          });
        //this.toastr.warning(mensaje, 'Validacion de Datos', { enableHtml: true })
        return;
      }


      if (this.break) {
        this.dataExcel = [];
        this.toastr.info('El archivo seleccionado no contiene el formato adecuado');
        return;
      }
      this.yearDisabled = true;
      this.headersEnable = true;
    } else {
      this.toastr.info('El archivo seleccionado no contiene el formato adecuado');
    }
  }

  notData(): number {
    this.break = true;
    return 0;
  }

  fillTableBySearch(data) {
    let fecha_adquisicion = 'fecha_adquisicion';
    let codigo = 'codigo';
    let descripcion = 'descripcion';
    let cant = 'cant';
    let caracteristica = 'caracteristica';
    let color = 'color';
    let custodio = 'custodio';
    let igual_custodio = 'igual_custodio'
    let valor_inicial = 'valor_inicial';
    let estado = 'estado';
    let existencia_real = 'existencia_real';
    let no_ingreso = 'no_ingreso';
    let cod_int_bodega = 'cod_int_bodega';
    let observacion = 'observacion';
    let arr = data.detalles;
    let fecha = data.fecha;
    console.log(data.fecha);
    this.dataExcel = [];
    console.log(arr);
    console.log(data.detalles)
    arr.forEach(e => {


      this.apiSrv.listarDescripcionProducto({ codigo: e.codigo }).subscribe(
        res => {
          
          console.log(res['data']);
          let data = {
            fecha_adquisicion: fecha ?? '',
            codigo: e[codigo] ?? '',
            descripcion:  res['data'][0]['nombre'] ?? '',
            custodio: res['data'][0]['custodio'] ?? '',
            igual_custodio: e[igual_custodio] ?? '',
            existencia_real: e[existencia_real] ?? '',
            cod_int_bodega: e[cod_int_bodega] ?? '',
            estado: e[estado] ?? '',
            color: res['data'][0]['color'] ?? '',
            valor_inicial:  res['data'][0]['costo'] ?? '',
            caracteristica: res['data'][0]['presentacion'] ?? '',
            observacion: e[observacion] ?? '',
            cant: 1 ?? '',
            no_ingreso: e[no_ingreso] ?? '',

            /*fecha_adquisicion: e[fecha_adquisicion] ?? '',
            codigo: e[codigo] ?? '',
            descripcion: e[producto] ?? '',
            cant: e[cant] ?? '',
            caracteristica: e[caracteristica] ?? '',
            color: e[color] ?? '',
            valor_inicial: e[valor_inicial] ?? '',
            no_ingreso: e[no_ingreso] ?? '',
            cod_int_bodega: e[cod_int_bodega] ?? '',*/
    
    
          }
          console.log(data)
          this.dataExcel.push(data);
        })

    })

    console.log(this.dataExcel);
    arr.forEach(e => {

    });
    console.log(this.dataExcel);


    this.headersEnable = true;
    this.titles = ['FECHA ADQUISICIÓN','CÓDIGO','DESCRIPCIÓN','CANTIDAD','CARACTERÍSTICA','COLOR','CUSTODIO','IGUAL CUSTODIO: (S / N)','VALOR INICIAL','ESTADO: REGULAR= R  BUENO= B  PERDIDO= P  MALO= M','EXISTENCIA REAL: EN USO= U SIN USAR= SU','NO. INGRESO','COD. INT. BODEGA','OBSERVACIÓN'];
    this.vmButtons[0].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = false;

  }

  agregaPeriodo() {
    console.log(this.periodo);
    // this.toastr.info('Agregue un archivo excel correspondiente al periodo '+this.periodo);
    // this.file = undefined;
    /*if (this.periodo == '' || this.periodo == undefined) {
      this.toastr.warning('Ingrese un tipo de bien valido ');
      this.periodo = undefined;
      return;
    }*/
    this.break = false;
    console.log(this.jsonData);
    this.fillTable(this.jsonData);
   // this.file = undefined;

  }

  catalogo() {

    this.apiSrv.listarCatalogo({}).subscribe((res: any) => {
      res.map((data) => {
        let datos = {
          valor: data.valor,
          descripcion: data.descripcion
        };
        this.listaCatalogo.push(datos)

      })
    })
  }


  Departamentos() {

    this.apiSrv.listarDepartamentos({}).subscribe((res: any) => {
      res.map((data) => {
        let datos = {
          dep_nombre: data.dep_nombre,
          id_departamento: data.id_departamento
        };
        this.listaDepartamento.push(datos)
        //this.listaDepartamento.push(data.dep_nombre)
        console.log(this.listaDepartamento);
      })
    })
  }

  getProductos() {

    this.apiSrv.listarDepartamentos({}).subscribe((res: any) => {
      res.map((data) => {
        let datos = {
          dep_nombre: data.dep_nombre,
          id_departamento: data.id_departamento
        };
        this.listaDepartamento.push(datos)
        //this.listaDepartamento.push(data.dep_nombre)
        console.log(this.listaDepartamento);
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

  modalReformas() {
    const modal = this.modal.open(ModalBusquedaConstatacionComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }


}

