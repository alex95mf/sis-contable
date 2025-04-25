import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { ReporteProductosService } from './reporte-productos.service';
import * as moment from 'moment';
import { NgSelectComponent } from '@ng-select/ng-select';
import Botonera from 'src/app/models/IBotonera';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDepartamentosComponent } from 'src/app/config/custom/modal-departamentos/modal-departamentos.component';
import { EncargadoComponent } from 'src/app/config/custom/encargado/encargado.component';
import { CommonVarService } from '../../../../services/common-var.services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { ModalGruposComponent } from './modal-grupos/modal-grupos.component';
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';

@Component({
  selector: 'app-reporte-productos',
  templateUrl: './reporte-productos.component.html',
  styleUrls: ['./reporte-productos.component.scss']
})
export class ReporteProductosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChildren(NgSelectComponent) selects: Array<NgSelectComponent>;
  fTitle: string = 'Lista de Productos';
  vmButtons: Array<Botonera> = [];
  msgSpinner: string;

  selectedReporte: any;  // Tipo Reporte
  selectedTipo: any;  // Tipo Bien
  selectedData: string;  // Data a mostrar
  selectedGrupo: string;
  nombreProducto: string;
  selectedSubGrupo:  string;
  selectedProductos:  string;
  anioIngreso: any;
  mostrarMatriz: boolean = true;
  nombreCustodio: any;
  verifyRestore = false;
  claseSelect: any = 0;
  codigo_grupo:any
  isPerecible:boolean = false;
  mostrarLote:boolean = false;
  tiene_caducidad: any ;
 
  producto_exi: any = [];
  cmb_grupo: any[] = [];
  cmb_subgrupo: any[] = [];
  cmb_productos: [];
  cmb_grupo_filter: any[] = [];
  cmb_subgrupo_filter: any[] = [];
  cmb_productos_filter: any[] = [];
  cmb_tipo_bien: Array<any> = [
    { value: 'BCA', label: 'Bienes de Control Administrativo' },
    { value: 'BLD', label: 'Bienes de Larga Duracion' },
  ];
  cmb_data_mostrar: Array<any> = [
    { value: 'cantidad', label: 'Cantidad' },
    { value: 'valor', label: 'Valor' },
  ]

 
   estadoList = [
    {value: "A",label: "ACTIVO"},
    {value: "P",label: "INACTIVO"},
  ]

  columnas: Array<string> = [];
  filas: Array<any> = [];
  matriz: any = {};

  dataProducto:any[] = [];

  anio_ingreso: Date = new Date()
  departamentoSelect: any = {
    dep_nombre:""
  };

  today: Date = new Date();
  tomorrow: Date = new Date(this.today);
  firstday: Date = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
  lastday: Date = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

  fechaDesde: Date = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
  fechaHasta: Date = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

  estadoSelected = 0
  UserSelect: any;
  moduloUser: any = "";
  filtClient: any;
  grupo_descripcion: any;
  onDestroy$: Subject<void> = new Subject();
  constructor(
    private apiService: ReporteProductosService,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private xlsService: XlsExportService,
    private modalService: NgbModal,
    private commonVarServices: CommonVarService,
  ) {

    this.commonVarServices.selectGrupo.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        this.lcargando.ctlSpinner(false);
        this.claseSelect = res
        
        this.grupo_descripcion = this.claseSelect['codigo_grupo_producto'] + "-" + this.claseSelect['descripcion'] + "-" + this.claseSelect['tipo_bien']
        this.selectedGrupo = this.claseSelect['id_grupo_productos']
        console.log(this.claseSelect)
      }
    )
    this.commonVarServices.selectProducto.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res)
        this.producto_exi = res
        this.cmb_productos = res
        this.selectedProductos = res['id_producto']
        this.nombreProducto = res['nombre']

     
      }
    )
    this.commonVarServices.departamentoSelect.asObservable().subscribe(
      (res)=>{
        this.departamentoSelect = res;
      }
    )
    
    this.commonVarServices.encargadoSelect.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res);
        this.UserSelect = res['emp_full_nombre'];
        this.filtClient = {
          id_personal: res['id_empleado'],
          nombres: res['emp_full_nombre']

        }
        this.moduloUser = res['cargos']['car_nombre']
        

      }
    )
    this.vmButtons = [
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "CONSULTAR" },
        clase: "btn btn-primary boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: "LIMPIAR" },
        clase: "btn btn-warning boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
        clase: "btn btn-success boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: true
      },
    ];
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 50);
    console.log(this.tiene_caducidad)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "EXCEL":
        //this.exportarExcel()
        this.export();
        break;
      case "CONSULTAR":
        this.consultarReporte()
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
        break;
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Grupos'
      let response: Array<any> = await this.apiService.getGruposBienes();
      let subGrupo: Array<any> = await this.apiService.getSubGruposBienes();
      this.cmb_grupo = response
      this.cmb_grupo_filter = this.cmb_grupo.filter((item: any) => item.tipo_bien == 'EXI')
      this.cmb_subgrupo = subGrupo
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }
  // asignarEstado(evt) {
  //   this.filter.estado = [evt]
  //  }

  selectedPerecible(event){
    console.log(event)
    //if (event.checked.length > 0) {
      if (event) {
      this.mostrarLote = true;
      this.tiene_caducidad= 'S';
    } else {
      this.mostrarLote = false;
      this.tiene_caducidad= 'N';
      this.fechaDesde = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
      this.fechaHasta=  new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);
    }
    console.log(this.tiene_caducidad)
  }



  async consultarReporte() {
   // Validar opciones seleccionadas
    // let message: string = '';
    // if (this.selectedGrupo == undefined || this.selectedGrupo == null) message += '* Debe seleccionar un Grupo.<br>';
    // if (this.selectedProductos == undefined || this.selectedProductos == null) message += '* Debe seleccionar un Producto.<br>';
    // if (this.estadoSelected == undefined || this.estadoSelected == null) message += '* Debe seleccionar un Estado.<br>';
    // if (message.length > 0) {
    //   this.toastr.warning(message, 'Advertencia', { enableHtml: true })
    //   return;
    // }
    
    
    this.lcargando.ctlSpinner(true)
    try {
        let fecha_desde = ''
        let fecha_hasta = ''
      if(this.isPerecible){
         fecha_desde = moment(this.fechaDesde).format('YYYY-MM-DD')
         fecha_hasta = moment(this.fechaHasta).format('YYYY-MM-DD')
      }
      let data={
       // tipo_reporte: this.selectedReporte,
        grupo: this.selectedGrupo,
        producto: this.selectedProductos,
        estado: this.estadoSelected,
        perecible: this.tiene_caducidad,
        fecha_desde: fecha_desde,
        fecha_hasta: fecha_hasta,
      }

      let response = await this.apiService.getData(data);
      console.log(response)
      if(response.length > 0){
        this.dataProducto = response
      }else{
        this.dataProducto = []
      }
      this.vmButtons[2].habilitar = false
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error consultando Reporte')
    }
  }

  exportarExcel() {
    let excelData = [];
    this.matriz.forEach((registro: any) => {
      let o = {};
      Object.assign(o, { periodo: registro.date_part })
      this.columnas.forEach((columna: string) => {
        o[columna] = registro[columna] ?? 0
      })
      excelData.push(o)
    })
    // console.log(excelData);

    this.excelService.exportAsExcelFile(excelData, 'GestionBienes');
  }
  export() {
    console.log(this.nombreProducto)
    // if (this.permissions.exportar == 0) {
    //   this.toastr.warning("No tiene permisos para exportar.", this.fTitle)
    //   return
    // }
    // let grupo_producto = this.cmb_grupo.filter((item: any) => item.id_grupo_productos == this.selectedGrupo)
    // let producto = this.cmb_productos.filter((item: any) => item.id_producto == this.selectedProductos)
    let estado = this.estadoList.filter((item: any) => item.value == this.estadoSelected)
    this.dataProducto.forEach(e => {
      if(this.tiene_caducidad=='S'){
        Object.assign(e,{lote:e.lote,fecha_caducidad: e.fecha_caducidad,disponible:e.disponible})
      }else{
        Object.assign(e,{lote:'',fecha_caducidad: '',disponible:''})
      }
        
    })

    let data = {
      title: 'LISTA DE PRODUCTOS',
      // producto: producto,
      // grupo: grupo_producto[0]?.descripcion? grupo_producto[0]?.descripcion : '',
      producto: this.nombreProducto,
      grupo: this.grupo_descripcion,
      estado: estado[0]?.label ? estado[0]?.label : '',
      rows: this.dataProducto
    }
    console.log(data)

    this.xlsService.exportReporteListaProductos(data, 'Reporte Listado de Prodctos')
  }
 
  filterProductos(event: any) {
    console.log(event)
     this.lcargando.ctlSpinner(true)
     this.msgSpinner = 'Filtrando Productos por Grupo de Bien'
     let data={
      id_grupo: event.id_grupo_productos
     }
     this.apiService.getProductos(data).subscribe(res => {
      console.log(res['data'])
      this.cmb_productos= res['data']
      
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
    
     this.cmb_subgrupo_filter = this.cmb_subgrupo.filter((item: any) => item.parent_id == event.id_grupo_productos)
     
     setTimeout(() => this.lcargando.ctlSpinner(false), 750)
  
 }

  modalGrupos() {
    this.lcargando.ctlSpinner(false)

    let modal = this.modalService.open(ModalGruposComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true
    modal.componentInstance.verifyRestore = this.verifyRestore;
 
  }
  expandProductos() {

    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListBusquedaComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    
    modal.componentInstance.claseSelect = this.claseSelect
    modal.componentInstance.verifyRestore = this.verifyRestore;
  }
  limpiarFiltros() {
    this.selects.forEach((select: NgSelectComponent) => select.handleClearClick());
    this.anioIngreso= ''
    this.departamentoSelect.dep_nombre= ''
    this.UserSelect=undefined
    this.vmButtons[2].habilitar = true
    this.matriz = []
    this.columnas = []
    this.estadoSelected = 0
    this.claseSelect = []
    this.dataProducto = []
        
    this.grupo_descripcion = ''
    this.selectedGrupo = ''
    this.producto_exi = []
    this.cmb_productos = []
    this.selectedProductos = ''
    this.nombreProducto = ''
    this.isPerecible = false;
    this.tiene_caducidad ='N'
    this.fechaDesde = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.fechaHasta=  new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

  }
}
