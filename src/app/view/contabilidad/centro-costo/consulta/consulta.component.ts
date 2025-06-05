import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ConsultaService } from './consulta.service';
import * as myVarGlobals from '../../../../global';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShowDiarioComponent } from './show-diario/show-diario.component';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { ValidacionesFactory } from '../../../../config/custom/utils/ValidacionesFactory';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { formatDate } from '@angular/common';
am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);
declare const $: any;

@Component({
standalone: false,
  selector: 'app-consulta-centro',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {

  viewDate: Date = new Date();
  fromDatePicker: any = formatDate(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1), 'yyyy-MM-dd', 'en');
  toDatePicker: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  dataUser: any;
  permisions: any;
  fk_centro_costo: any = 0;
  arrayCentroCosto: any;
  arrayAccountHigher: any = [];
  fk_account: any = 0;
  fk_group: any = 0;
  dataDT: any;
  validaDt: any;
  locality: any;
  totales: any;
  dataConsultar: any = {};
  validate: any = false;
  prespuesto: any = "0.00";
  saldo: any = "0.00";
  alerta: any = "0.00";

  lengtinit: any = 0;
  lengtinitm: any = 33;
  lengtinite: any = 66;
  lengtinitf: any = 100;
  valueHand:any = 50;

  vmButtons:any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private cosuSrv: ConsultaService,
    private commonVarSrv: CommonVarService,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) {

    setTimeout(() => {
      this.fchart(this.lengtinit, this.lengtinitm, this.lengtinite, this.lengtinitf);
    }, 1500);
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnConsCc", paramAccion: "1", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false},
      { orig: "btnConsCc", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "LIMPIAR FILTROS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false}
    ];

    this.elementRef.nativeElement.ownerDocument.body.style = 'background: url(/assets/img/findo.jpg) !important ;background-size: cover !important;no-repeat;';
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);
    this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "LIMPIAR FILTROS":
        this.limpiarFiltros();
      break;
      case "CONSULTAR":
        this.rerender();
      break;
    }
  }

  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fCentroCostoConsulta,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario consulta de centro de costo");
        // this.router.navigateByUrl('dashboard');
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.processing = true;
        this.getCentroCosto();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCentroCosto() {
    this.cosuSrv.getCentroCosto().subscribe(res => {
      this.arrayCentroCosto = res['data'];
      this.getCentroCostoXCuentas();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCentroCostoXCuentas() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let data = {
      filter_proyect: this.fk_centro_costo,
      filter_cuenta: this.fk_account,
      filter_grupo: this.fk_group,
      desde: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      hasta: moment(this.toDatePicker).format('YYYY-MM-DD')
    }

    this.cosuSrv.getCentroCostoXCuentas(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.validaDt = true;
      this.dataDT = res['data']['maping'];
      this.totales = res['data'];
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, error => {
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.toastr.info(error.error.message);
    });
  }

  rerender(): void {
    this.dataDT = [];
    this.validaDt = false;
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getCentroCostoXCuentas();
    });
  }

  getAccountFather(evt) {
    if (evt != 0) {
      let infoChart = this.arrayCentroCosto.filter(e => e.id == evt)[0];
      this.prespuesto = /* (infoChart.presupuesto > 0) ?  */infoChart.presupuesto /* : "1.00"; */
      this.saldo = /* (infoChart.saldo_acumulado > 0) ? */ infoChart.saldo_acumulado /* : "1.00"; */
      this.alerta = /* (infoChart.monto_alerta_cumplimiento > 0) ? */ infoChart.monto_alerta_cumplimiento /* : "1.00"; */

      let sumTotal = (parseFloat(this.prespuesto) + parseFloat(this.saldo) + parseFloat(this.alerta))
      this.lengtinitm = Math.round((parseFloat(this.prespuesto) * 100) / sumTotal);
      this.lengtinite = Math.round((parseFloat(this.saldo) * 100) / sumTotal);
      this.lengtinite += this.lengtinitm;
      this.valueHand = /* Math.round( */(parseFloat(this.saldo) * 100) / parseFloat(this.prespuesto)/* ) */;
      this.valueHand = 100 - this.valueHand;
      let auxVal = this.valueHand.toFixed(2).toString();
      this.valueHand = auxVal.toString();
      this.fchart(this.lengtinit, this.lengtinitm, this.lengtinite, this.lengtinitf);

      let data = {
        id: evt,
        desde: moment(this.fromDatePicker).format('YYYY-MM-DD'),
        hasta: moment(this.toDatePicker).format('YYYY-MM-DD')
      }

      this.cosuSrv.getAccountFather(data).subscribe(res => {
        this.arrayAccountHigher = res['data'];
      }, error => {
        this.toastr.info(error.error.message);
      })
    } else {
      this.arrayAccountHigher = [];
      this.fk_account = 0;
      this.fk_group = 0;
      this.prespuesto = "0.00";
      this.saldo = "0.00";
      this.alerta = "0.00";
      this.lengtinit = 0;
      this.lengtinitm = 33;
      this.lengtinite = 66;
      this.lengtinitf = 100;
      this.fchart(this.lengtinit, this.lengtinitm, this.lengtinite, this.lengtinitf);
    }
  }

  formatNumber(params) {
    this.locality = 'en-EN';
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 2
    })
    params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
    return params;
  }


  showAsiento(dt) {
    const modalInvoice = this.modalService.open(ShowDiarioComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.info = dt;
  }

  fchart(lgt1, lgt2, lgt3, lgt4) {
    var chart = am4core.create("chartdiv", am4charts.GaugeChart);
    chart.innerRadius = am4core.percent(82);
    var axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis.min = 0;
    axis.max = 100;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(80);
    axis.renderer.inside = true;
    axis.renderer.line.strokeOpacity = 1;
    axis.renderer.ticks.template.strokeOpacity = 1;
    axis.renderer.ticks.template.length = 10;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = 40;
    axis.renderer.labels.template.adapter.add("text", function (text) {
      return text + "%";
    })

    var colorSet = new am4core.ColorSet();
    var axis2 = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis2.min = 0;
    axis2.max = 100;
    axis2.renderer.innerRadius = 200
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    var range0 = axis2.axisRanges.create();
    range0.value = lgt1;
    range0.endValue = lgt2;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = am4core.color("#68FF33");

    var range1 = axis2.axisRanges.create();
    range1.value = lgt2;
    range1.endValue = lgt3;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = am4core.color("#184BB8");

    var range2 = axis2.axisRanges.create();
    range2.value = lgt3;
    range2.endValue = lgt4;
    range2.axisFill.fillOpacity = 1;
    range2.axisFill.fill = am4core.color("#CD0F0F");

    var label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 15;
    label.x = am4core.percent(20);
    label.y = am4core.percent(50);
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    label.text = (this.fk_centro_costo != 0 ) ? this.valueHand+"%" : "50%" ;

    var hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value = (this.fk_centro_costo != 0 ) ? parseFloat(this.valueHand) : 50 ;

    hand.events.on("propertychanged", function (ev) {
      range0.setValue = ev.target.value;
      range1.setValue = ev.target.value;
      range2.setValue = ev.target.value;
      axis2.invalidate();
    });

    /* setInterval(() => {
      var value = Math.round(Math.random() * 100);
      label.text = value + "%";
      var animation = new am4core.Animation(hand, {
        property: "value",
        to: value
      }, 1000, am4core.ease.cubicOut).start();
    }, 2000); */
  }

  limpiarFiltros(){
    this.fk_centro_costo = 0;
    this.fk_account = 0;
    this.fk_group = 0;
    this.fromDatePicker = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    this.toDatePicker = new Date();
    this.arrayAccountHigher = [];
    this.rerender();
  }

}
