import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { ReporteDetalladoBienesServices } from './reporte-detallado-bienes.service'; 
import moment from 'moment';
import { NgSelectComponent } from '@ng-select/ng-select';
import Botonera from 'src/app/models/IBotonera';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDepartamentosComponent } from 'src/app/config/custom/modal-departamentos/modal-departamentos.component';
import { ModalDepartamentosResComponent } from './modal-departamentos-res/modal-departamentos-res.component';
import { EncargadoComponent } from 'src/app/config/custom/encargado/encargado.component';
import { EncargadoTrasladoComponent } from '../../movimientos/traslado/encargado-traslado/encargado-traslado.component';
import { CommonVarService } from '../../../../services/common-var.services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { XlsExportService } from 'src/app/services/xls-export.service';

@Component({
standalone: false,
  selector: 'app-reporte-detallado-bienes',
  templateUrl: './reporte-detallado-bienes.component.html',
  styleUrls: ['./reporte-detallado-bienes.component.scss']
})
export class ReporteDetalladoBienesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChildren(NgSelectComponent) selects: Array<NgSelectComponent>;
  fTitle: string = 'Reporte detallado de Bienes';
  vmButtons: Array<Botonera> = [];
  mensajeSpinner: string = "Cargando...";

  selectedReporte: any;  // Tipo Reporte
  selectedTipo: any;  // Tipo Bien
  selectedData: string;  // Data a mostrar
  selectedGrupo: string;
  selectedSubGrupo:  string;
  anioIngreso: any;
  mostrarMatriz: boolean = true;
  nombreCustodio: any;
  centro_costo: any ;

  cmb_periodo: any[] = []
  cmb_grupo: any[] = [];
  cmb_subgrupo: any[] = [];
  cmb_grupo_filter: any[] = [];
  cmb_subgrupo_filter: any[] = [];
  cmb_centro_costo: any[] = [];
  cmb_tipo_bien: Array<any> = [
    { value: 'BCA', label: 'Bienes de Control Administrativo' },
    { value: 'BLD', label: 'Bienes de Larga Duracion' },
  ];
  cmb_data_mostrar: Array<any> = [
    { value: 'cantidad', label: 'Cantidad' },
    { value: 'valor', label: 'Valor' },
  ]

  columnas: Array<string> = [];
  filas: Array<any> = [];
  matriz: any = {};

  dataProducto:any[] = [];

  //anio_ingreso: Date = new Date()
  anio_ingreso: any = moment().format('YYYY')
  departamentoSelect: any = {
    dep_nombre:""
  };
  departamentoSelectRes: any = {
    dep_nombre:""
  };
  UserSelect: any;
  UserSelectResponsable: any;
  moduloUser: any = "";
  filtClient: any;
 
  onDestroy$: Subject<void> = new Subject();
  constructor(
    private apiService: ReporteDetalladoBienesServices,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private xlsService: XlsExportService,
    private modalService: NgbModal,
    private commonVarServices: CommonVarService,
  ) {
    this.commonVarServices.departamentoSelect.asObservable().subscribe(
      (res)=>{
        this.departamentoSelect = res;
      }
    )
    this.commonVarServices.departamentoSelectRes.asObservable().subscribe(
      (res)=>{
        this.departamentoSelectRes = res;
      }
    )
    this.commonVarServices.encargadoSelect.asObservable().subscribe(
      (res)=>{
        console.log(res);
      
        if(res['tipo']==2){
          this.UserSelect= res['custodio']['emp_full_nombre'];
        }else if(res['tipo']==4){
          this.UserSelectResponsable = res['responsable']['emp_full_nombre'];
        }
       
      }
    )
    // this.commonVarServices.encargadoSelect.pipe(takeUntil(this.onDestroy$)).subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.UserSelect = res['emp_full_nombre'];
    //     this.filtClient = {
    //       id_personal: res['id_empleado'],
    //       nombres: res['emp_full_nombre']

    //     }
    //     this.moduloUser = res['cargos']['car_nombre']
        

    //   }
    // )
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
    this.selectedTipo= ''
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
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando...'
      let response: Array<any> = await this.apiService.getGruposBienes();
      let subGrupo: Array<any> = await this.apiService.getSubGruposBienes();
      let centroCostos: Array<any> = await this.apiService.listaCentroCostos();
      let resPeriodos: Array<any> = await this.apiService.getPeriodos()
    
      console.log(centroCostos)
      this.cmb_grupo = response
      this.cmb_subgrupo = subGrupo
      this.cmb_centro_costo = centroCostos
      this.cmb_periodo = resPeriodos
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }
 

  limpiarFiltros() {
    this.selects.forEach((select: NgSelectComponent) => select.handleClearClick());
    this.anioIngreso= ''
    this.departamentoSelect.dep_nombre= ''
    this.departamentoSelectRes.dep_nombre= ''
    this.UserSelect=undefined
    this.UserSelectResponsable=undefined
    this.vmButtons[2].habilitar = true
    this.matriz = [];
    this.columnas = [];
    this.dataProducto = [];
  }

  async consultarReporte() {
    // Validar opciones seleccionadas
    // let message: string = '';
    // if (this.selectedReporte == undefined || this.selectedReporte == null) message += '* Debe seleccionar un Tipo de Reporte.<br>';
    // if (this.selectedReporte != 'DEP' && (this.selectedTipo == undefined || this.selectedTipo == null)) message += '* Debe seleccionar un Tipo de Bien.<br>';
    // if (this.selectedReporte != 'SUM' && (this.selectedData == undefined || this.selectedData == null)) message += '* Debe seleccionar los Datos a Mostrar.<br>';
    // if (message.length > 0) {
    //   this.toastr.warning(message, 'Advertencia', { enableHtml: true })
    //   return;
    // }

    
    this.lcargando.ctlSpinner(true);
    try {
      let data={
       // tipo_reporte: this.selectedReporte,
        tipo_bien: this.selectedTipo,
        tipo_grupo: this.selectedGrupo,
        tipo_subgrupo: this.selectedSubGrupo,
        anio_ingreso: this.anio_ingreso,
        departamento:this.departamentoSelect.dep_nombre,
        departamento_res:this.departamentoSelectRes.dep_nombre,
        custodio: this.UserSelect,
        responsable: this.UserSelectResponsable,
        centro_costo: this.centro_costo
      }

      let response = await this.apiService.getData(data);
      console.log(response)
      if(response.length > 0){
        
        response.forEach(e => {
          let tipo_bien = this.cmb_tipo_bien.filter((item: any) => item.value == e.tipo_bien)
          console.log(tipo_bien)
          Object.assign(e,{tipo_bien: tipo_bien[0]['label']  })
        })
        this.dataProducto = response

      }else{
        this.dataProducto = [];
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
    console.log(this.selectedSubGrupo)
    // if (this.permissions.exportar == 0) {
    //   this.toastr.warning("No tiene permisos para exportar.", this.fTitle)
    //   return
    // }
    let grupoDescripcion
    if(this.selectedSubGrupo!=undefined){
      let grupo_producto = this.cmb_subgrupo_filter.filter((item: any) => item.id_grupo_productos == this.selectedSubGrupo)
      grupoDescripcion =grupo_producto[0]['descripcion']
    }
    let data = {
      title: 'REPORTE BIENES ADMINISTRADOS POR EL MUNICIPIO',
      tipo: this.selectedTipo.label,
      grupo: this.selectedTipo.label,
      sub_grupo: grupoDescripcion ? grupoDescripcion : '',
      anio_ingreso:  this.anio_ingreso,
      ubicacion: this.departamentoSelect.dep_nombre,
      responsable: this.UserSelect,
      rows: this.dataProducto


    }
    console.log(data);

    this.xlsService.exportReporteDetalladoBienes(data, 'Reporte Detallado Bienes')
  }

  filterByTipoBien(event: any) {
     console.log(event);
    if (event != undefined ) {
      this.lcargando.ctlSpinner(true);
      (this as any).mensajeSpinner = 'Filtrando Grupos por Tipo de Bien'
      this.cmb_grupo_filter = this.cmb_grupo.filter((item: any) => item.tipo_bien == event.value)
      setTimeout(() => this.lcargando.ctlSpinner(false), 750)
    }
  }
  filterByGrupo(event: any) {
    console.log(this.cmb_subgrupo)
   //if (event != undefined && this.selectedReporte == 'PSG') {
     this.lcargando.ctlSpinner(true);
     (this as any).mensajeSpinner = 'Filtrando Sub Grupos por Grupo de Bien'
     this.cmb_subgrupo_filter = this.cmb_subgrupo.filter((item: any) => item.parent_id == event.id_grupo_productos)
     
     setTimeout(() => this.lcargando.ctlSpinner(false), 750)
  // }
 }

  modalDepartamentos(){
    let modal = this.modalService.open(ModalDepartamentosComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }
  modalDepartamentosResponsable(){
    let modal = this.modalService.open(ModalDepartamentosResComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }
  // modalEncargado() {
  //   let modal = this.modalService.open(EncargadoComponent, {
  //     size: "lg",
  //     backdrop: "static",
  //     windowClass: "viewer-content-general",
  //   })
  // }
  modalEncargado(data: any){
    let modal = this.modalService.open(EncargadoTrasladoComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.tipo = data;
  }

}
