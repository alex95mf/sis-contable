import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { SaldosEmpleadoService } from './saldos-empleado.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonService } from 'src/app/services/commonServices';
import { XlsExportService } from 'src/app/services/xls-export.service';

import { CcModalTableEmpleadoComponent } from 'src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component';

@Component({
standalone: false,
  selector: 'app-saldos-empleado',
  templateUrl: './saldos-empleado.component.html',
  styleUrls: ['./saldos-empleado.component.scss'],
  providers: [DialogService],
})
export class SaldosEmpleadoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[] = [];

  filter: any = {
    empleado: {emp_full_nombre: null},
    fecha_inicio: moment().startOf('year').format('YYYY-MM-DD'),
    fecha_final: moment().format('YYYY-MM-DD')
  }

  tbl_registros: any[] = []
  loading: boolean = false

  infomovDataExcel: any =[];

  constructor(
    private apiService: SaldosEmpleadoService,
    private toastr: ToastrService,
    private dialogService: DialogService,
    private commonService: CommonService,
    private xlsService: XlsExportService,
  ) {
    this.vmButtons = [
      {orig: 'btnsSaldosEmpleados', paramAccion: '', boton: {icon: 'far fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true, },
      {orig: 'btnsSaldosEmpleados', paramAccion: '', boton: {icon: 'far fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, habilitar: false, showbadge: false, showimg: true, showtxt: true, },
      {orig: 'btnsSaldosEmpleados', paramAccion: '', boton: {icon: 'far fa-file-pdf', texto: 'PDF'}, clase: 'btn btn-sm btn-danger', permiso: true, habilitar: true, showbadge: false, showimg: true, showtxt: true, },
      {orig: 'btnsSaldosEmpleados', paramAccion: '', boton: {icon: 'far fa-file-excel', texto: 'EXCEL'}, clase: 'btn btn-sm btn-success', permiso: true, habilitar: true, showbadge: false, showimg: true, showtxt: true, },
    ]
  }

  ngOnInit(): void {

    setTimeout(async () => {

      await this.consultar()
     }, 50);
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        //
        break;
      case "PDF":
        this.GenerarReportePdf();
        break;
      case "EXCEL":
        this.GenerarReporteExcel();
        break;

      default:
        break;
    }
  }

  consultar = async () => {
    try {
      (this as any).mensajeSpinner = 'Cargando Saldos'
      const response: any = await this.apiService.getSaldos({params: { filter: this.filter }})
      console.log(response)
      response.forEach((element: any) => {
        if (element.id_catalogo_tipo_rubro == 'INGRESO') Object.assign(element, {debe: element.valor, haber: 0})
        if (element.id_catalogo_tipo_rubro == 'EGRESO') Object.assign(element, {debe: 0, haber: element.valor})
      });
      this.tbl_registros = response
      if(this.tbl_registros.length > 0){
        this.vmButtons[2].habilitar = false
        this.vmButtons[3].habilitar = false
      }

    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Saldos.')
    }
  }

  searchEmpleado = () => {
    const ref = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: "no",
        search : null,
        relation_selected : "",
      },
      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    })

    ref.onClose.subscribe((empleadoData: any) => {
      console.log(empleadoData)
      if (empleadoData) {
        const {id_empleado, emp_full_nombre} = empleadoData
        this.filter.empleado = {id_empleado, emp_full_nombre}
        // this.filter.id_empleado = empleadoData.id_empleado
        console.log(this.filter.empleado.id_empleado)
      }
    })
  }

  clearEmpleado = () => {
    Object.assign(this.filter, {empleado: {emp_full_nombre: null}})
  }

  GenerarReportePdf(){

    console.log(this.filter.id_empleado)
     let idEmpleado = 0
    if(this.filter.empleado.id_empleado == undefined){
      idEmpleado = 0
    }else{
      idEmpleado =this.filter.empleado.id_empleado ;
    }
      window.open(environment.ReportingUrl + "rpt_rrhh_saldos_empleado.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_empresa=1&id_empleado="+ idEmpleado +"&fecha_desde="+ this.filter.fecha_inicio + "&fecha_hasta="+ this.filter.fecha_final, '_blank');

  }

  // GenerarReporteExcel(){
  //   console.log(this.filter.id_empleado)
  //   let idEmpleado = 0
  //  if(this.filter.empleado.id_empleado == undefined){
  //    idEmpleado = 0
  //  }else{
  //    idEmpleado =this.filter.empleado.id_empleado ;
  //  }
  //    window.open(environment.ReportingUrl + "rpt_rrhh_saldos_empleado.xlsx?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&id_empresa=1&id_empleado="+ idEmpleado +"&fecha_desde="+ this.filter.fecha_inicio + "&fecha_hasta="+ this.filter.fecha_final, '_blank');

  // }


  GenerarReporteExcel = async () => {

		(this as any).mensajeSpinner = "Generando Archivo Excel...";
		this.lcargando.ctlSpinner(true);
		// let data = {
		// 	dateFrom: moment(this.filter.fecha_inicio).format('YYYY-MM-DD'),
		// 	dateTo: moment(this.filter.fecha_final).format('YYYY-MM-DD'),
		// }

    const response: any = await this.apiService.getSaldos({params: { filter: this.filter }})
		//this.reportesSrv.getMovimientoContable(data).subscribe(res => {
			console.log(response)
			this.infomovDataExcel =response;
      let totalValor = this.infomovDataExcel.reduce((suma: number, x: any) => suma + parseFloat(x.valor), 0)
      let totalSaldo = this.infomovDataExcel.reduce((suma: number, x: any) => suma + parseFloat(x.saldo), 0)
      let lineaTotales = {
        fecha: '',
        tipo_movimiento:'',
        documento:'',
        detalle:'',
        valor: totalValor,
        saldo: totalSaldo
      }
     // this.infomovDataExcel.push(lineaTotales)

			if(this.infomovDataExcel.length > 0){

				let data = {
				  title: 'Saldo de Empleados',
				  razon_social: 'Gobierno Autonomo Descentralizado',
				  razon_comercial: 'Gobierno Autonomo Descentralizado',
				  direccion: 'Canton La Libertad',
				  fecha_desde: this.filter.fecha_inicio,
				  fecha_hasta: this.filter.fecha_final,
				//   cuenta_desde: this.fromDatePicker,
				//   cuenta_hasta: this.toDatePicker,
				  rows:  this.infomovDataExcel
				}
				console.log(data);
			  this.xlsService.exportExcelSaldosEmpleados(data, 'Saldo de Empleados')
				// let tipo = 'Asiento'
				// this.exportAsXLSX(this.fieldsDaily,tipo);
				this.lcargando.ctlSpinner(false);
			  }else{
				this.toastr.info("No hay datos para exportar")
				this.lcargando.ctlSpinner(false);
			  }
		// }, error => {
		// 	this.toastr.info(error.error.mesagge);
		// 	this.lcargando.ctlSpinner(false);
		// });


	  }
  calculateTotalValor(name) {
    let total = 0.00;

    if (this.tbl_registros) {
      for (let empleado of this.tbl_registros) {
        if (empleado.emp_full_nombre === name) {
          //total += parseFloat(customer.monto_total);
          total += parseFloat(empleado.valor);
        }
      }
    }

    return total;
  }
  calculateTotalSaldo(name) {
    let total = 0.00;

    if (this.tbl_registros) {
      for (let empleado of this.tbl_registros) {
        if (empleado.emp_full_nombre === name) {
          //total += parseFloat(customer.monto_total);
          total += parseFloat(empleado.saldo);
        }
      }
    }

    return total;
  }

}
