import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { SimulacionService } from './simulacion.service';
import { ExcelService } from 'src/app/services/excel.service';
import Botonera from 'src/app/models/IBotonera';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
standalone: false,
  selector: 'app-simulacion',
  templateUrl: './simulacion.component.html',
  styleUrls: ['./simulacion.component.scss']
})
export class SimulacionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[];

  filter: any = {
    fecha_desde: null,
    fecha_hasta: null,
    codigo: null,
  }

  paginate: any = {
    page: 1,
    perPage: 30,
    length: 0,
    pageSizeOptions: [15, 30, 50]
  }

  cmb_concepto: any[] = [
    { codigo: '1,5', nombre:'Activos Totales' },
    { codigo: 'PATENTE', nombre:'Patente' },
  ];

  lst_impuestos: any[];
  displayedColumns: string[] = ['orden', 'local', 'contribuyente', 'codigo', 'total'];

  constructor(
    private apiService: SimulacionService,
    private excelService: ExcelService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsSimulacion',
        paramAccion: '',
        boton: { icon: 'fas fa-file-excel', texto: 'EXCEL'},
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
    setTimeout(() => this.cargaInicial(), 0)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "EXCEL":
        this.exportExcel()
        break;
    
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Impuestos'
      let impuestos = await this.apiService.getImpuestos({params: {paginate: this.paginate}})
      console.log(impuestos)
      this.paginate.length = impuestos.total
      this.lst_impuestos = impuestos.data
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
    //
  }

  consultar() {
    Object.assign(this.paginate, { pageIndex: 0, page: 1 })
    this.getImpuestos()
  }

  async getImpuestos() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Impuestos'
      let impuestos = await this.apiService.getImpuestos({ params: { filter: this.filter, paginate: this.paginate }})
      this.paginate.length = impuestos.total
      this.lst_impuestos = impuestos.data
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  changePage(event: PageEvent) {
    Object.assign(this.paginate, { page: event.pageIndex + 1 })
    this.getImpuestos()
  }

  clearFilter() {
    Object.assign(this.filter, {
      fecha_desde: null,
      fecha_hasta: null,
      codigo: null,
    })
  }

  async exportExcel() {
    this.lcargando.ctlSpinner(true);
    try {
      let excelData = [];
      let impuestos = await this.apiService.getImpuestos({params: { filter: this.filter }})
      impuestos.forEach((element: any) => {
        let o = {
          OrdenInspeccion: element.orden_inspeccion.numero_orden,
          Fecha: element.orden_inspeccion.fecha,
          LocalComercial: element.orden_inspeccion.fk_local.razon_social,
          CodCatastro: element.orden_inspeccion.fk_local.cod_catastro,
          Contribuyente: element.orden_inspeccion.fk_local.fk_contribuyente.razon_social,
          Identificacion: `${element.orden_inspeccion.fk_local.fk_contribuyente.tipo_documento} ${element.orden_inspeccion.fk_local.fk_contribuyente.num_documento}`,
          Codigo: element.codigo_detalle == '1,5' ? 'Activos Totales' : element.codigo_detalle == 'PATENTE' ? 'Patente' : 'N/A',
          Valor: `$ ${parseFloat(element.total).toFixed(2)}`,
        }
        excelData.push(o)
      });
      let total = impuestos.reduce((acc, curr) => acc + parseFloat(curr.total), 0);
      excelData.push({Valor: `$ ${total}`})

      this.lcargando.ctlSpinner(false)
      this.excelService.exportAsExcelFile(excelData, 'SimulacionActivosFijosPatentes')
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

}
