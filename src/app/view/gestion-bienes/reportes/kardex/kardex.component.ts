import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { KardexService } from './kardex.service'; 
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
import { ListBusquedaComponent } from '../reporte-productos/list-busqueda/list-busqueda.component'; 


@Component({
standalone: false,
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss'],
  styles: [`
  :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      position: -webkit-sticky;
      position: sticky;
      top: -10px;
  }

  .layout-news-active :host ::ng-deep .p-datatable tr > th {
      top: 7rem;
  }
`]
})
export class KardexComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChildren(NgSelectComponent) selects: Array<NgSelectComponent>;
  fTitle: string = 'Kardex - Movimientos';
  vmButtons: Array<Botonera> = [];
  msgSpinner: string;

  selectedReporte: any;  // Tipo Reporte
  selectedTipo: any;  // Tipo Bien
  selectedData: string;  // Data a mostrar
  selectedGrupo: any;
  selectedSubGrupo:  string;
  nombreProducto:string;
  selectedProductos:  any;
  anioIngreso: any;
  ubicacion: any;
  mostrarMatriz: boolean = true;
  nombreCustodio: any;
  viewDate: Date = new Date();
  fechaCorte: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);

  verifyRestore = false;
  claseSelect: any = 0;
  codigo_grupo:any

  today: Date = new Date();
  tomorrow: Date = new Date(this.today);
  firstday: Date = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
  lastday: Date = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

  fechaDesde: Date = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
  fechaHasta: Date = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

  cmb_grupo: any[] = [];
  cmb_subgrupo: any[] = [];
  cmb_productos: [];
  cmb_grupo_filter: any[] = [];
  cmb_subgrupo_filter: any[] = [];
  cmb_productos_filter: any[] = [];

  arrayBodega: Array<any> = [];
 
   stockList = [
    {value: "1",label: "CON STOCK"},
    {value: "2",label: "SIN STOCK"},
    {value: "0",label: "TODOS"},
  ]
  grupo_descripcion: any;
  producto_exi: any = [];

  dataProducto:any[] = [];

  estadoSelected = 0
  selectedBodega = 0
  stockSelected = 0
  UserSelect: any;
  moduloUser: any = "";
  filtClient: any;
  onDestroy$: Subject<void> = new Subject();
  constructor(
    private apiService: KardexService,
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

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 
    setTimeout(() => this.cargaInicial(), 50);
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
      let bodegas: Array<any> = await this.apiService.getBodegas();
      this.cmb_grupo = response
      this.arrayBodega = bodegas
      this.cmb_grupo_filter = this.cmb_grupo.filter((item: any) => item.tipo_bien == 'EXI')
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

    if(this.selectedBodega == undefined || this.selectedBodega == 0){
      this.toastr.info('Debe seleccionar una bodega')
    }else{
      this.lcargando.ctlSpinner(true)
    try {
      let data={
        grupo: this.selectedGrupo,
        producto: this.nombreProducto,
        bodega: this.selectedBodega,
        fecha_desde: moment(this.fechaDesde).format('YYYY-MM-DD'),
        fecha_hasta: moment(this.fechaHasta).format('YYYY-MM-DD'),
        ubicacion: this.ubicacion,
        stock: this.stockSelected,
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
    
  }

  export() {
    console.log(this.selectedSubGrupo)
    // if (this.permissions.exportar == 0) {
    //   this.toastr.warning("No tiene permisos para exportar.", this.fTitle)
    //   return
    // }
    // let grupo_producto = this.cmb_grupo.filter((item: any) => item.id_grupo_productos == this.selectedGrupo)
    // let producto = this.cmb_productos?.filter((item: any) => item.id_producto == this.selectedProductos)


    let bodega = this.arrayBodega.filter((item: any) => item.id_bodega_cab == this.selectedBodega)
    let stock = this.stockList.filter((item: any) => item.value == this.stockSelected)

    
    this.dataProducto.forEach(e => {
      Object.assign(e , {
        ini_costo:Number(e.ini_costo),
        ini_costo_total:Number(e.ini_costo_total),
        mov_costo:Number(e.mov_costo),
        mov_costo_total:Number(e.mov_costo_total),
        fin_costo:Number(e.fin_costo),
        fin_costo_total:Number(e.fin_costo_total)
       })
    })

    console.log()

    let data = {
      title: 'KARDEX',
      // producto: producto,
      // grupo: grupo_producto[0]?.descripcion? grupo_producto[0]?.descripcion : '',
      producto: this.nombreProducto,
      grupo: this.grupo_descripcion,
      bodega:bodega[0]?.nombre,
      ubicacion:this.ubicacion,
      fecha_desde: moment(this.fechaDesde).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.fechaHasta).format('YYYY-MM-DD'),
      stock: stock[0]?.label ? stock[0]?.label : '',
      rows: this.dataProducto
    }
    console.log(data)

    this.xlsService.exportReporteKardex(data, 'Reporte Kardex')
  }

  filterProductos(event: any) {
    console.log(event)
    // console.log(this.selectedGrupo)
   //if (event != undefined && this.selectedReporte == 'PSG') {
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
  // }
 }

  limpiarFiltros() {
    this.selects.forEach((select: NgSelectComponent) => select.handleClearClick());
    this.anioIngreso= ''
    this.UserSelect=undefined
    this.vmButtons[2].habilitar = true
    this.cmb_grupo = []
    this.cmb_productos = []
    this.cmb_grupo_filter = []
    this.stockSelected = 0
    this.selectedBodega = 0
    this.selectedGrupo = ''
    this.ubicacion = ''
    this.fechaCorte = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    this.fechaDesde = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.fechaHasta = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.dataProducto = []
    this.grupo_descripcion = ''
    this.producto_exi = []
    this.selectedProductos = ''
    this.nombreProducto = ''
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

}
