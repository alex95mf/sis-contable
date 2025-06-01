import { Component, OnInit, ViewChild, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BitacoraService } from './bitacora.service'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/commonServices'
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import flatpickr from 'flatpickr';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { ExcelService } from 'src/app/services/excel.service';

declare const $: any;

@Component({
standalone: false,
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss']
})
export class BitacoraComponent implements OnDestroy, OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  //dtOptions: DataTables.Settings = {};
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDtBitacora: any = false;
  dataBitacora: any = [];
  dataUser: any;
  permisions: any;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  c: any = 0;
  processing: any = false;
  vmButtons: any;
  arrayUsers:any;
  userFilter:any = 0;
  dataBitacoraAux:any = [];

  paginate: any;
  filter: any;
  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;
  excelData: any = []

  constructor(private toastr: ToastrService, private commonServices: CommonService, private bitacoraService: BitacoraService, private xlsService: XlsExportService,private excelService: ExcelService,
    private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.vmButtons = [
      { orig: "btnsBitacora", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      //{ orig: "btnsBitacora", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
    ];

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 
    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      usuario: null
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fBitacora,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
      if (this.permisions[0].ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Bitácora");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getUsuarios();
        this.getDatabitacora();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getUsuarios() {
    this.bitacoraService.getUsuario().subscribe(res => {
      this.arrayUsers = res['data'];
      this.lcargando.ctlSpinner(false);
     // this.getDatabitacora();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }
  getDatabitacora(flag: boolean = false) {
    this.mensajeSppiner = "Cargando Auditoría...";
    this.lcargando.ctlSpinner(true);
    if (flag) this.paginate.page = 1

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.lcargando.ctlSpinner(true);
    this.bitacoraService.getConsultaAuditoria(data)
      .subscribe(res => {
        console.log(res)
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        /* this.c += 1; */
        this.validaDtBitacora = true;
        this.dataBitacora = res['data'];
        this.dataBitacoraAux = res['data']['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.dataBitacoraAux = res['data']['data'];
        } else {
          this.dataBitacoraAux = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.validaDtBitacora = true;
        this.dataBitacora = [];
        this.dataBitacoraAux = [];
        this.processing = true;
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      });
  }

  // getDatabitacora() {
  //   let date = moment(this.fromDatePicker).format('YYYY-MM-DD');
  //   let date2 = moment(this.toDatePicker).format('YYYY-MM-DD');
  //   let data = {
  //     date: date,
  //     date2: date2
  //   }

  //   this.dtOptions = {
  //     pagingType: 'full_numbers',
  //     pageLength: 10,
  //     //search: false,
  //     paging: true,
  //     dom: 'lfrtip',  //lfrtipB Bfrtip   
  //     order: [[0, "desc"]],
  //     buttons: [{
  //       extend: 'excel',
  //       footer: true,
  //       title: 'Bitácora de actividades',
  //       filename: 'Export_File'
  //     }, {
  //       extend: 'print',
  //       footer: true,
  //       title: 'Bitácora de actividades',
  //       filename: 'Export_File_pdf'
  //     }],
  //     language: {
  //       url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
  //     }
  //   };
  //   this.lcargando.ctlSpinner(true);
  //   this.bitacoraService.getBitacora(data)
  //     .subscribe(res => {
  //       this.lcargando.ctlSpinner(false);
  //       this.processing = true;
  //       /* this.c += 1; */
  //       this.validaDtBitacora = true;
  //       this.dataBitacora = res['data'];
  //       this.dataBitacoraAux = res['data'];
  //       setTimeout(() => {
  //         this.dtTrigger.next();
  //       }, 50);
  //     }, error => {
  //       this.lcargando.ctlSpinner(false);
  //       this.validaDtBitacora = true;
  //       this.dataBitacora = [];
  //       this.dataBitacoraAux = [];
  //       this.processing = true;
  //       setTimeout(() => {
  //         this.dtTrigger.next();
  //       }, 50);
  //     });
  // }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.validaDtBitacora = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getDatabitacora();
    });
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "EXCEL":
        //$('#tablaBitacora').DataTable().button('.buttons-excel').trigger();
        this.btnExportarExcel()
        break;
      // case "IMPRIMIR":
      //   $('#tablaBitacora').DataTable().button('.buttons-print').trigger();
      //   break;
    }
  }

  filterXUser(){
    this.validaDtBitacora = false;
    this.dataBitacoraAux = [];
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      if(this.userFilter == 0){
        this.validaDtBitacora = true;
        this.dataBitacoraAux = this.dataBitacora;
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      }else{
        this.validaDtBitacora = true;
        this.dataBitacoraAux = this.dataBitacora.filter(us => us.id_usuario == this.userFilter);
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      }
    });
  }


  btnExportarExcel() {

    console.log(this.dataBitacoraAux)
    this.mensajeSppiner = "Generando Archivo Excel...";
    this.lcargando.ctlSpinner(true); 
        
       
         this.excelData = [];
         console.log(this.dataBitacoraAux);
           Object.keys(this.dataBitacoraAux).forEach(key => {
             let filter_values = {};
             filter_values['Nombre'] = (this.dataBitacoraAux[key].nombre != null) ? this.dataBitacoraAux[key].nombre : "";
             filter_values['Modulo'] = (this.dataBitacoraAux[key].nombre_modulo != null) ? this.dataBitacoraAux[key].nombre_modulo : "";
             filter_values['Componente'] = (this.dataBitacoraAux[key].name_component != null) ? this.dataBitacoraAux[key].name_component : "";
             filter_values['Sucursal'] = (this.dataBitacoraAux[key].nombre_sucursal != null) ? this.dataBitacoraAux[key].nombre_sucursal : "";
             filter_values['Fecha'] = (this.dataBitacoraAux[key].fecha != null) ? this.dataBitacoraAux[key].fecha : "";
             filter_values['Hora'] = (this.dataBitacoraAux[key].hora != null) ? this.dataBitacoraAux[key].hora : "";
             filter_values['Acción'] = (this.dataBitacoraAux[key].accion != null) ? this.dataBitacoraAux[key].accion : "";
             filter_values['Ip'] = (this.dataBitacoraAux[key].ip != null) ? this.dataBitacoraAux[key].ip : "";

            
             this.excelData.push(filter_values);
             this.lcargando.ctlSpinner(false);
           })
           this.exportAsXLSX();
         
   }
     
   exportAsXLSX() {
     this.excelService.exportAsExcelFile(this.excelData, 'Reporte Consulta de Auditoría');
   }
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getDatabitacora();
  }

  limpiarFiltros() {
    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      usuario: undefined
    }
    this.dataBitacoraAux = []

  }
}
