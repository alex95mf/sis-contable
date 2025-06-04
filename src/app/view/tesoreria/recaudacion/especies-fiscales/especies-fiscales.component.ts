import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { AnulacionEspeciesComponent } from './anulacion-especies/anulacion-especies.component';
import { EspeciesFiscalesService } from './especies-fiscales.service';
import { HistorialAnulacionesComponent } from './historial-anulaciones/historial-anulaciones.component';
import { ModalEspeciesFiscalesComponent } from './modal-especies-fiscales/modal-especies-fiscales.component';
import { ExcelService } from 'src/app/services/excel.service';


@Component({
standalone: false,
  selector: 'app-especies-fiscales',
  templateUrl: './especies-fiscales.component.html',
  styleUrls: ['./especies-fiscales.component.scss']
})
export class EspeciesFiscalesComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;

  fTitle = "Especies Fiscales"

  paginate: any;
  filter: any;

  vmButtons: any;

  catalog: any;

  tipo_especie: any;

  today: any;
  firstday: any;
  tomorrow: any;
  lastday: any;

  especiesFiscales: any = []
  excelData: any [];
  exportList: any[];

  constructor(

    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
    private service: EspeciesFiscalesService,
    private excelService: ExcelService,
  ) {
    this.commonVarSrv.modalAnulacionEspeciesFiscales.asObservable().subscribe(
      (res) => {
        this.cargarEspeciesFiscales('');
      }
    )

    this.commonVarSrv.modalEspeciesFiscales.asObservable().subscribe(
      (res) => {
        this.cargarEspeciesFiscales('');
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsEspeciesFiscales",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsEspeciesFiscales",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel-o", texto: " EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      }

    ];


    this.today = new Date();
    this.firstday = moment(this.today).startOf('month').format('YYYY-MM-DD')
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    //this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: "",
    };

    // TODO: Habilitar codigo en Backend

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

    setTimeout(() => {
      this.fillCatalog()
      this.cargarEspeciesFiscales('');
    }, 500);

  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " NUEVO":
        if(this.tipo_especie == undefined || this.tipo_especie == ''){
          this.toastr.info('Seleccione un tipo');
        }else{
          this.newEspeciFiscal(true);
        }

        break;
      case " EXCEL":
        this.exportarExcel()
          break;
    }
  }


  limpiarFiltros(){
    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: "",
    };
  }


  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarEspeciesFiscales('');
  }


  cargarEspeciesFiscales(event?: any){
    this.mensajeSpinner = "Cargando listado de Configuracion Contable...";
    this.lcargando.ctlSpinner(true);
    let data = {
      id: this.tipo_especie,
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.service.getEspeciesfiscales(data).subscribe(
      (res)=>{
        this.paginate.length = res['data']['total'];
        if(res['data']['current_page'] == 1){
          this.especiesFiscales = res['data']['data'];
        }else{
          this.especiesFiscales = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },(error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    this.mensajeSpinner = "Cargando Catalogs";

    let data = {
      params: "'REC_ESPECIE_FISCAL'",
    };

    this.service.getCatalogs(data).subscribe(
      (res) => {
        console.log(res);
        this.catalog = res["data"]["REC_ESPECIE_FISCAL"];


        // console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );




  }

  deleteEspecie(data){
    let dat = {
      id: data
    }

    this.service.deleteEspeciesfiscales(dat).subscribe(
      (res)=>{

      },(error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }


  newEspeciFiscal(valid, data = ''){
    console.log(valid, data);
    let modal = this.modalSrv.open(ModalEspeciesFiscalesComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });

    console.log(this.tipo_especie);
    modal.componentInstance.new = valid;
    modal.componentInstance.data = data
    modal.componentInstance.tipo = this.tipo_especie
  }


  editEspeciFiscal(valid, data = ''){
    let modal = this.modalSrv.open(ModalEspeciesFiscalesComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });

    modal.componentInstance.new = valid;
    modal.componentInstance.data = data
  }

  anulacionEspeciFiscal(dt){
    let modal =this.modalSrv.open(AnulacionEspeciesComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.data = dt
  }

  historiaAnulaciones(dt){
    let modal =this.modalSrv.open(HistorialAnulacionesComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.data = dt
  }

  exportarExcel(){

    this.mensajeSpinner = "Generando Reporte Excel...";
    this.lcargando.ctlSpinner(true);
    let data = {
      id: this.tipo_especie,
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.service.getEspeciesfiscales(data).subscribe(
      (res)=>{
        this.paginate.length = res['data']['total'];
        if(res['data']['current_page'] == 1){
          this.exportList = res['data']['data'];
        }else{
          this.exportList = Object.values(res['data']['data']);
        }
        this.exportList.forEach(e => {
          Object.assign(e,{
            costo: parseFloat(e.costo),
            cantidad_disponibles: e.cantidad - e.cantidad_anuladas - e.cantidad_vendidas,
            valor_total_especies: e.costo * e.cantidad,
            valor_total_anuladas: e.costo * e.cantidad_anuladas,
            valor_total_vendidas: e.costo * e.cantidad_vendidas,
            valor_total_disponibles: e.costo * (e.cantidad - e.cantidad_anuladas - e.cantidad_vendidas),
            })
        })
        this.excelData = [];
        Object.keys(this.exportList).forEach(key => {
          let filter_values = {};
          filter_values['ID'] = key;
          filter_values['Tipo'] = (this.exportList[key].tipo_especie != null) ? this.exportList[key].tipo_especie : "";
          filter_values['Talonario'] = (this.exportList[key].nro_talonario != null) ? this.exportList[key].nro_talonario : "";
          filter_values['Desde'] = (this.exportList[key].desde != null) ? this.exportList[key].desde : "";
          filter_values['Hasta'] = (this.exportList[key].hasta != null) ? this.exportList[key].hasta : "";
          filter_values['Costo'] = (this.exportList[key].costo != null) ? this.exportList[key].costo : "";
          filter_values['Fecha de Registro'] = (this.exportList[key].fecha.split(" ")[0] != undefined) ? this.exportList[key].fecha.split(" ")[0] : "";
          filter_values['Cantidad de Especies'] = (this.exportList[key].cantidad != null) ? this.exportList[key].cantidad : "";
          filter_values['No. Actual'] = (this.exportList[key].nro_actual != null) ? this.exportList[key].nro_actual : "";
          filter_values['Cantidad Anuladas'] = (this.exportList[key].cantidad_anuladas != null) ? this.exportList[key].cantidad_anuladas : "";
          filter_values['Cantidad Vendidas'] = (this.exportList[key].cantidad_vendidas != null) ? this.exportList[key].cantidad_vendidas : "";
          filter_values['Cantidad Disponible'] = (this.exportList[key].cantidad_disponibles != null) ? this.exportList[key].cantidad_disponibles : "";
          filter_values['Valor Total Especies'] = (this.exportList[key].valor_total_especies != null) ? this.exportList[key].valor_total_especies : "";
          filter_values['Valor Total Anuladas'] = (this.exportList[key].valor_total_anuladas != null) ? this.exportList[key].valor_total_anuladas : "";
          filter_values['Valor Total Vendidas'] = (this.exportList[key].valor_total_vendidas != null) ? this.exportList[key].valor_total_vendidas : "";
          filter_values['Valor Total Disponibles'] = (this.exportList[key].valor_total_disponibles != null) ? this.exportList[key].valor_total_disponibles : "";

          this.excelData.push(filter_values);



        })
        this.exportAsXLSX();


        this.lcargando.ctlSpinner(false);
      },(error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }
  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Especies Fiscales');
  }


}
