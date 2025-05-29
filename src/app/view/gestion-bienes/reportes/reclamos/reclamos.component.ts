import { Component, OnInit, ViewChild } from '@angular/core';
import { ReclamosService } from './reclamos.service';
import { ExcelService } from 'src/app/services/excel.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Botonera from 'src/app/models/IBotonera';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';

@Component({
standalone: false,
  selector: 'app-reclamos',
  templateUrl: './reclamos.component.html',
  styleUrls: ['./reclamos.component.scss']
})
export class ReclamosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  msgSpinner: string;
  vmButtons: Botonera[] = [];

  filter: any = {
    producto: null,
    fecha_desde: null,
    fecha_hasta: null,
    estado: null,
  }
 


  paginate: any= {
    length:0,
    page:1,
    pageIndex:0,
    perPage:20,
    pageSizeOptions:[20,50,100]
  }


  lst_estado = [
    { value: 'P', label: 'Pendiente' },
    { value: 'C', label: 'Cerrado' },
  ]

  lst_reclamos: any[];
  displayedColumns: string[] = ['producto', 'fecha', 'obs_inicial', 'obs_final', 'estado'];

  constructor(
    private apiService: ReclamosService,
    private excelService: ExcelService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsReporteReclamos',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'CONSULTAR'},
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsReporteReclamos',
        paramAccion: '',
        boton: { icon: 'fas fa-eraser', texto: 'LIMPIAR'},
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsReporteReclamos',
        paramAccion: '',
        boton: { icon: 'fas fa-file', texto: 'EXCEL'},
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargarReportes()
    }, 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "EXCEL":
        this.exportExcel()
        break;
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.clearFilter()
        break;
    
      default:
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, { pageIndex: 0, page: 1 })
    this.cargarReportes()
  }



  async cargarReportes() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Reclamos'
      let reportes = await this.apiService.getReportes({params: {filter: this.filter, paginate: this.paginate}});
      console.log(reportes)
      this.lst_reclamos = reportes.data;
      this.paginate.length = reportes.total
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Reclamos')
    }
  }





  changePage(event: PageEvent) {
    Object.assign(this.paginate, { page: event.pageIndex + 1})
    this.cargarReportes()
  }

  clearFilter() {
    Object.assign(this.filter, {
      producto: null,
      fecha_desde: null,
      fecha_hasta: null,
      estado: null,
    })
  }

  async exportExcel() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Exportando Reclamos'
      let excelData = [];
      let reclamos = await this.apiService.getReportes({params: {filter: this.filter}})

      //console.log(reclamos);
    

      reclamos.forEach((reclamo: any) => {
        let o = {
          Producto: reclamo.producto?.nombre,
          Codigo: reclamo.producto?.codigoproducto,
          Fecha: reclamo.fecha,
          Estado: reclamo.estado == 'P' ? 'Pendiente' : reclamo.estado == 'C' ? 'Cerrado' : 'N/A',
          ObservacionInicial: reclamo.observacion_inicial ?? '',
          ObservacionFinal: reclamo.observacion_final ?? ''
        }
        excelData.push(o)
      })
  
      this.lcargando.ctlSpinner(false)

      //console.log(excelData);
      //return;

      this.excelService.exportAsExcelFile(excelData, 'ReporteReclamos')
      //
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error obteniendo Reclamos')
    }
  }

}
