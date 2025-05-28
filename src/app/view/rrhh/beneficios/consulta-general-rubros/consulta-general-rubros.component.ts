import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ApiServiceService } from './api-service.service';
import Botonera from 'src/app/models/IBotonera';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-consulta-general-rubros',
  templateUrl: './consulta-general-rubros.component.html',
  styleUrls: ['./consulta-general-rubros.component.scss']
})
export class ConsultaGeneralRubrosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = 'Consulta General de Rubros';
  msgSpinner: string;
  vmButtons: Array<Botonera> = [];
  filter: any = {
    periodo: null,
    mes: null,
    rubro: null,
    empleado: null
  }
  periodo_selected: any;
  //periodo_selected: Date = new Date();


  lst_mes: Array<any> = [];
  lst_rubro: Array<any> = [];
  registros: Array<any> = [];
  cmb_periodo: any[] = []


  constructor(
    private apiService: ApiServiceService,
    private toastr: ToastrService,
    private excelService: ExcelService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsConsultaRubros',
        paramAccion: '',
        boton: {icon: 'fas fa-search', texto: 'CONSULTAR'},
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: 'btn btn-sm btn-primary',
        habilitar: false,
      },
      {
        orig: 'btnsConsultaRubros',
        paramAccion: '',
        boton: {icon: 'fas fa-file-excel', texto: 'EXCEL'},
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: 'btn btn-sm btn-success',
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 50)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.consultar()
        break;
      case "EXCEL":
        this.exportarExcel()
        break;

      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {

      this.msgSpinner = "Cargando Períodos"
      const resPeriodos = await this.apiService.getPeriodos()
      this.cmb_periodo = resPeriodos

      this.msgSpinner = 'Cargando Listado de Meses'
      this.lst_mes = await this.apiService.getMeses('MES')

      this.msgSpinner = 'Cargando Listado de Rubros'
      this.lst_rubro = await this.apiService.getRubros()

      this.lcargando.ctlSpinner(false)

      this.consultar()
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }

  async consultar() {
    Object.assign(this.filter, { periodo: this.periodo_selected })
    //Object.assign(this.filter, { periodo: moment(this.periodo_selected).format('YYYY') })
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Empleados y Rubros'
      this.registros = await this.apiService.getRubrosEmpleados({params: { filter: this.filter }})

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Registros')
    }
  }

  exportarExcel() {
    let excelData = [];
    this.registros.forEach((registro: any) => {
      const { emp_full_nombre } = registro.empleado
      const { rub_descripcion } = registro.rubro
      const { valor } = registro
      const data = {
        NombreEmpleado: emp_full_nombre,
        Rubro: rub_descripcion,
        Valor: valor
      }
      excelData.push(data)
    })
    this.excelService.exportAsExcelFile(excelData, 'ConsultaRubrosEmpleados');
  }

  buscarMes(mes){
    let month = ''
    switch (mes) {
      case 1:
        month = 'Enero';
        break;
      case 2:
        month = 'Febrero';
        break;
      case 3:
        month = 'Marzo';
        break;
      case 4:
        month = 'Abril';
        break;
      case 5:
        month = 'Mayo';
        break;
      case 6:
        month = 'Junio';
        break;
      case 7:
        month = 'Julio';
        break;
      case 8:
        month = 'Agosto';
        break;
      case 9:
        month = 'Septiembre';
        break;
      case 10:
        month = 'Octubre';
        break;
      case 11:
        month = 'Noviembre';
        break;
      case 12:
        month = 'Diciembre';
        break;
      default:
    }
  return  month;
  }

}
