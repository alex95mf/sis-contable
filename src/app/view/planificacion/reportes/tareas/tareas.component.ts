import { Component, OnInit, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ExcelService } from 'src/app/services/excel.service';

import { TareasService } from './tareas.service';
import Botonera from 'src/app/models/IBotonera';

@Component({
standalone: false,
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss']
})
export class TareasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string
  fTitle: string = 'Resumen General de Tareas por Meta (Cartera de Proyectos)'
  vmButtons: Array<Botonera> = []

  meses: any = [
    { num: '01', nom: 'ENE' },
    { num: '02', nom: 'FEB' },
    { num: '03', nom: 'MAR' },
    { num: '04', nom: 'ABR' },
    { num: '05', nom: 'MAY' },
    { num: '06', nom: 'JUN' },
    { num: '07', nom: 'JUL' },
    { num: '08', nom: 'AGO' },
    { num: '09', nom: 'SEP' },
    { num: '10', nom: 'OCT' },
    { num: '11', nom: 'NOV' },
    { num: '12', nom: 'DIC' }
  ]
  metas: string[] = []
  totales: Array<number> = [];
  metaTareas: any

  cmb_periodo: Array<any> = [];
  periodoSelected: number;

  constructor(
    private toastr: ToastrService,
    private apiService: TareasService,
    private excelService: ExcelService,
  ) {
    this.vmButtons = [
      {
        orig: "btnsReporteTareas",
        paramAccion: "",
        boton: { icon: "fa fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsReporteTareas",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success btn-sm",
        habilitar: true,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargaInicial()
    }, 50)
  }

  metodoGlobal(evt) {
    // TODO: MAnejar la exportacion a EXCEL
    switch (evt.items.boton.texto) {
      case "EXCEL":
        this.exportarExcel()
        break;
      case "CONSULTAR":
        this.cargarData()
        break;
    
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Periodos'
      let periodos = await this.apiService.getPeriodos();
      console.log(periodos)
      this.cmb_periodo = periodos;

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  async cargarData() {
    this.lcargando.ctlSpinner(true);
    try {
      this.metas = [];
      this.totales = [];
      (this as any).mensajeSpinner = 'Obteniendo Tareas por Meta'
      let metas = await this.apiService.getMetasTareas({periodo: this.periodoSelected});
      console.log(metas)
      this.metas = Object.keys(metas)
      this.metaTareas = metas
      this.vmButtons[1].habilitar = false

      // Totalizar metas
      this.metas.forEach((meta: string) => {
        this.meses.forEach((mes: any) => {
          if ('total' in this.metaTareas[meta]) {
            this.metaTareas[meta]['total'] += this.metaTareas[meta][mes.num]
          } else {
            this.metaTareas[meta]['total'] = this.metaTareas[meta][mes.num] ?? 0
          }

          // Totales Verticales
          if (mes.num in this.totales) {
            this.totales[mes.num] += this.metaTareas[meta][mes.num]
          } else {
            this.totales[mes.num] = this.metaTareas[meta][mes.num] ?? 0
          }
        })
      })
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  exportarExcel = () => {
    let excelData = []
    (this as any).mensajeSpinner = "Descargando Listado"
    this.lcargando.ctlSpinner(true);
    try {
      this.metas.forEach((meta: string) => {
        let obj = {
          Meta: meta,
          Ene: this.metaTareas[meta]['01'],
          Feb: this.metaTareas[meta]['02'],
          Mar: this.metaTareas[meta]['03'],
          Abr: this.metaTareas[meta]['04'],
          May: this.metaTareas[meta]['05'],
          Jun: this.metaTareas[meta]['06'],
          Jul: this.metaTareas[meta]['07'],
          Ago: this.metaTareas[meta]['08'],
          Sep: this.metaTareas[meta]['09'],
          Oct: this.metaTareas[meta]['10'],
          Nov: this.metaTareas[meta]['11'],
          Dic: this.metaTareas[meta]['12'],
        }
        
        excelData.push(obj)
      })
      this.excelService.exportAsExcelFile(excelData, 'CarteraProyectos')
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
    }
    /* this.mdlSrv.getContribuyentes({ params: { filter: this.filter } }).subscribe(
      (res: any) => {
        console.log(res)
        res.data.forEach((element: any) => {
          const {tipo_documento, num_documento, razon_social, ciudad } = element
          const data = {
            TipoDocumento: tipo_documento,
            NumeroDocumento: num_documento,
            RazonSocial: razon_social,
            Ciudad: ciudad
          }
          excelData.push(data)
        })
        this.excelService.exportAsExcelFile(excelData, 'Contribuyentes')
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Contribuyentes')
      }
    )*/
  }

}
