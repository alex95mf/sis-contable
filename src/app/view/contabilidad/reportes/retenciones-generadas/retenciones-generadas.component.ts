import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../services/commonServices'
import Swal from "sweetalert2";;
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from '../../../../global';

import * as moment from "moment";

import { ToastrService } from 'ngx-toastr';
import { ReportRetencionGeneradasService } from './retenciones-generadas.service';

import { environment } from 'src/environments/environment';
 
@Component({
standalone: false,
  selector: 'app-retenciones-generadas',
  templateUrl: './retenciones-generadas.component.html',
  styleUrls: ['./retenciones-generadas.component.scss']
})
export class RetencionesGeneradasComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  vmButtons: any = [];

  dataUser: any;
  empresLogo: any;
  permiso_ver: any = "0";
  permisions: any;

  dtConsultaRetencionesGeneradas:any;
  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;


  viewDate: Date = new Date();
  // fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  // toDatePicker: Date = new Date();
  fromDatePicker: any ;
  toDatePicker: any;

  constructor(private commonServices: CommonService, 
    private toastr: ToastrService,
    private progeneracionderetencionService: ReportRetencionGeneradasService,) {}

  ngOnInit(): void {

    this.vmButtons =
      [
        { orig: "btnsRetenGener", paramAccion: "1", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false },
        { orig: "btnsRetenGener", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
        { orig: "btnsRetenGener", paramAccion: "1", boton: { icon: "fa fa-file-pdf", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false },

      ];

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 


    this.fromDatePicker= moment(this.firstday).format('YYYY-MM-DD'),
    this.toDatePicker= moment(this.today).format('YYYY-MM-DD'),

    

    setTimeout(() => {

      this.lcargando.ctlSpinner(true);
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

      let data = {
        id: 2,
        codigo: myVarGlobals.fComDiario,
        id_rol: this.dataUser.id_rol
      }

      this.commonServices.getPermisionsGlobas(data).subscribe(res => {
        this.permisions = res["data"][0];

        this.permiso_ver = this.permisions.ver;

        if (this.permisions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Comprobante Diario");
          this.vmButtons = [];
        }

        this.lcargando.ctlSpinner(false);

      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }, 10);

  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":
        this.ConsultarListaRetenciones();
        break;
      case "EXCEL":
        this.ConsultarListaRetencionesExcel();
        break;
      case "PDF":
        this.ConsultarListaRetencionesPdf();
        break;
    }
  }





  ConsultarListaRetenciones(){

    this.lcargando.ctlSpinner(true);

    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
		let dateTo = moment(this.toDatePicker).format('YYYYMMDD');

    this.progeneracionderetencionService.getRetencionesGeneradas(dateFrom, dateTo).subscribe(res => {

     console.log(res['data'])
      this.dtConsultaRetencionesGeneradas = res['data'];
      this.lcargando.ctlSpinner(false);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);

    })

  }



  ConsultarListaRetencionesImpresion(){


    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
		let dateTo = moment(this.toDatePicker).format('YYYYMMDD');

    window.open(environment.ReportingUrl + "rpt_retenciones_emitidas.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde="+dateFrom+"&fecha_hasta="+dateTo, '_blank')

  }
  ConsultarListaRetencionesPdf(){
    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
		let dateTo = moment(this.toDatePicker).format('YYYYMMDD');

    window.open(environment.ReportingUrl + "rpt_retenciones_emitidas.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde="+dateFrom+"&fecha_hasta="+dateTo, '_blank')

  }


  ConsultarListaRetencionesExcel(){


    let dateFrom = moment(this.fromDatePicker).format('YYYYMMDD');
		let dateTo = moment(this.toDatePicker).format('YYYYMMDD');

    window.open(environment.ReportingUrl + "rpt_retenciones_emitidas.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde="+dateFrom+"&fecha_hasta="+dateTo, '_blank')

  }

}


