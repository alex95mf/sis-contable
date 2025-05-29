import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { BenefGastosPersonalesService } from '../benef-gastos-personales.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ExcelService } from 'src/app/services/excel.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
standalone: false,
  selector: 'app-view-masivo',
  templateUrl: './view-masivo.component.html',
  styleUrls: ['./view-masivo.component.scss']
})
export class ViewMasivoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  msgSpinner: string

  filter: any = {
    periodo: moment().format('YYYY'),
  }
  paginate: any = {
    pageIndex: 0,
    page: 1,
    perPage: 20,
    length: 0,
  }

  lst_periodo: any[] = []

  dsEmpleados: MatTableDataSource<any>;
  tblMasivoColumns: string[] = ['empleado', 'cargo', 'sueldo', 'anual', 'mensual', 'acumulado', 'pendiente', 'motivo'];

  constructor(
    private apiService: BenefGastosPersonalesService,
    private toastr: ToastrService,
    private excelService: ExcelService,
  ) {
    this.apiService.exportMasivo$.subscribe(() => this.exportarMasivoExcel())

    this.apiService.consultarMasivo$.subscribe(() => this.getTablaMasiva())

    this.apiService.limpiarMasivo$.subscribe(() => this.limpiarFilter())
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 0)
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      // Cargar Periodos
      this.msgSpinner = 'Cargando Periodos'
      let periodos = await this.apiService.getPeriodos()
      console.log(periodos)
      this.lst_periodo = periodos;

      // Cargar Tabla
      this.msgSpinner = 'Cargando Tabla de Datos'
      let response = await this.apiService.getTablaMasiva({params: { filter: this.filter }})
      console.log(response)
      this.dsEmpleados = new MatTableDataSource(response)
      this.dsEmpleados.paginator = this.paginator

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial Masiva')
    }
  }

  async getTablaMasiva() {
    this.lcargando.ctlSpinner(true)
    try {
      // Cargar Tabla
      this.msgSpinner = 'Cargando Tabla de Datos'
      let response = await this.apiService.getTablaMasiva({params: { filter: this.filter }})
      console.log(response)
      this.dsEmpleados = new MatTableDataSource(response)
      this.dsEmpleados.paginator = this.paginator

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial Masiva')
    }
  }

  async exportarMasivoExcel() {
    let result = await Swal.fire({
      titleText: 'Exportar Registros de Impuesto a la Renta',
      text: 'Esta seguro/a de realizar esta accion?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Exportar',
    })

    if (result.isConfirmed) {
      let excelData = []
      this.dsEmpleados.data.forEach((element: any) => {
        let o = {
          Identificacion: element.emp_identificacion,
          Nombre: element.emp_full_nombre,
          Anual: element.impuesto_renta?.impuesto_renta_anual ?? 0,
          Mensual: element.impuesto_renta?.impuesto_renta_mensual ?? 0,
          Acumulado: element.impuesto_renta?.acumulado ?? 0,
          Pendiente: element.impuesto_renta?.impuesto_renta_anual_x_cobrar ?? 0,
        }
        excelData.push(o)
      })
      this.excelService.exportAsExcelFile(excelData, `Empleados_ImpuestoRenta_${this.filter.periodo}`)
    }
  }

  limpiarFilter() {
    Object.assign(this.filter, {
      periodo: moment().format('YYYY')
    })
  }

}
