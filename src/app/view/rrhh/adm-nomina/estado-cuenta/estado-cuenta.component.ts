import { Component, OnInit, ViewChild } from '@angular/core';
import { EstadoCuentaService } from './estado-cuenta.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { CcModalTableEmpleadoComponent } from 'src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { environment } from 'src/environments/environment';
import {MessageService} from 'primeng/api';
@Component({
  selector: 'app-estado-cuenta',
  templateUrl: './estado-cuenta.component.html',
  styleUrls: ['./estado-cuenta.component.scss'],
  providers: [DialogService, MessageService],
})
export class EstadoCuentaComponent implements OnInit {
 
  msgSpinner: string = "Cargando...";

	@ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: Botonera[] = [];

  empleadoActive: any = {
    emp_full_nombre: null
  }

  filter: any = {
    id_empleado: 0,
    fecha_desde: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
  }

  totalRecords: number = 0
  loading: boolean = false
  tbl_movimientos: any[] = [];

  infomovDataExcel: any = [];

  constructor(
    private apiService: EstadoCuentaService,
    private toastr: ToastrService,
    private dialogService: DialogService,
    private xlsService: XlsExportService,
    private messageService: MessageService,
  ) {
    this.vmButtons = [
      { orig: 'btnsEstadoCuentaEmpleados', paramAccion: '', boton: {icon: 'far fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      { orig: 'btnsEstadoCuentaEmpleados', paramAccion: '', boton: {icon: 'far fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      { orig: 'btnsEstadoCuentaEmpleados', paramAccion: '', boton: {icon: 'far fa-file-excel', texto: 'EXCEL'}, clase: 'btn btn-sm btn-success', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      { orig: 'btnsEstadoCuentaEmpleados', paramAccion: '', boton: {icon: 'far fa-file-pdf', texto: 'PDF'}, clase: 'btn btn-sm btn-danger',  permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false }

    ]
  }

  ngOnInit(): void {
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.getEstadoCuenta()
        break;
      case "LIMPIAR":
        this.clearFiltros()
        break;
      case "EXCEL":
        
      this.GenerarReporteExcel();
      break;
      case "PDF":
        
      this.GenerarReportePdf();
      break;
    
      default:
        break;
    }
  }

  async getEstadoCuenta(event?: any) {
    console.log(event)
    try {
      this.loading = true
      //const response: any[] = await this.apiService.getMovimientos({params: { filter: this.filter }})
      const response: any[] = await this.apiService.getMovimientosEmpleado({params: { filter: this.filter }})

				let saldo_anterior = 0
				response.forEach(element => {
					saldo_anterior += parseFloat(element.debe) - parseFloat(element.haber)
					Object.assign(element, {
                valor: parseFloat(element.valor),
                debe: parseFloat(element.debe),
                haber: parseFloat(element.haber),
								saldo: saldo_anterior })
				});
      this.tbl_movimientos = response
      this.totalRecords = response.length
      //
      this.loading = false
    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error cargando Estado de Cuenta')
    }
  }

  searchEmpleado() {
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
        this.empleadoActive = empleadoData
        this.filter.id_empleado = empleadoData.id_empleado
      }
    })
  }

  clearFiltros() {
    Object.assign(this.filter, {
      id_empleado: null,
      fecha_desde: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
    })
    this.empleadoActive = {
      emp_full_nombre: null
    }
  }

  calcularTotalEmpleado(empleadoNombre: string) {

    const total = this.tbl_movimientos.reduce((acc: number, curr: any) => {
      if (curr.emp_full_nombre === empleadoNombre) {
        let signo = 1
        if(curr.tipo_movimiento == 'EGRESO'){
          signo = -1
        }
        const v = Math.round(curr.valor * signo * 100) / 100
        return Math.round((acc + v) * 100) / 100
      }
      return acc
    }, 0)
    return total
  }

  GenerarReporteExcel(){

		//this.msgSpinner = "Generando Archivo Excel..."; 
		//this.lcargando.ctlSpinner(true); 
   
     this.infomovDataExcel = this.tbl_movimientos;
			if(this.infomovDataExcel.length > 0){
			  
				let data = {
				  title: 'Estado de Cuenta de Empleado',
				  empleado: this.empleadoActive.emp_full_nombre,
				  rows:  this.infomovDataExcel
				}
				console.log(data)
			  this.xlsService.exportExcelEstadoCuentaEmpleado(data, 'Estado de Cuenta de Empleado')
				//this.lcargando.ctlSpinner(false); 
			  }else{
				this.toastr.info("No hay datos para exportar")
				//this.lcargando.ctlSpinner(false); 
			  }
		
	  }

    GenerarReportePdf(){
      let idEmpleado = this.filter.id_empleado;
      if(idEmpleado == 0 || idEmpleado == undefined){
        return this.toastr.info('Debe selecionar un empleado.')
        //return this.messageService.add({key: 'tr', severity:'warn', summary: 'Advertencia', detail: 'Debe selecionar un empleado.'/* ,life:300000 */});
      }
      window.open(environment.ReportingUrl + "rpt_rrhh_estado_cuenta_empleado.pdf?&j_username="+environment.UserReporting+"&j_password="+environment.PasswordReporting+"&fecha_desde="+this.filter.fecha_desde+"&fecha_hasta="+this.filter.fecha_hasta+"&id_empresa=1&id_empleado="+idEmpleado, '_blank');
    }

}
