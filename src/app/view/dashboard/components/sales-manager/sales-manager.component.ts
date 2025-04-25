import { Component, OnInit, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SalesManagerService } from './sales-manager.service'
import { CommonService } from '../../../../services/commonServices'

/* amCharts imports */
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-sales-manager',
  templateUrl: './sales-manager.component.html',
  styleUrls: ['./sales-manager.component.scss']
})
export class SalesManagerComponent implements OnInit, AfterViewInit {
  /* current params */
  userPayload: any;
  dashboard: any = [];
  gross_margin: any;
  amChartDashboard: any = [];
  label: boolean = true;

  /* amCharts */
  chart: am4charts.XYChart;

  constructor(private managerSrv: SalesManagerService, private toastr: ToastrService, private router: Router,
    private elementRef: ElementRef, private zone: NgZone) { }

  ngOnInit(): void {
    this.userPayload = JSON.parse(localStorage.getItem('Datauser'));
    this.DashboardParameters();
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.getChart();
      }, 1000)
    });

  }

  DashboardParameters() {
    this.managerSrv.getDashboardParameters({ profile: this.userPayload.perfil, company: this.userPayload.id_empresa }).subscribe(res => {
      this.dashboard = res["data"]["dashboard"];
      this.gross_margin = res["data"]["gross_margin"];
      this.amChartDashboard = res["data"]["amChartValues"];
    })
  }

  getChart() {
    var chart = am4core.create("dashboardChart", am4charts.XYChart);
    chart.data = this.amChartDashboard;

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 15;
    categoryAxis.fontWeight = "bold";

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.fontWeight = "bold";

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "category";
    series.dataFields.valueY = "value";
    series.columns.template.tooltipText = "{valueY.value}";
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeOpacity = 0;

    chart.colors.list = [
      am4core.color("#3C8FEF"),  /* Ingresos */
      am4core.color("#EDED5E"), /* Costos */
      am4core.color("#F62541"), /* Gastos */
    ];

    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });
  }
}
