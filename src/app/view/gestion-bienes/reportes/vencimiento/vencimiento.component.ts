import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { VencimientoService } from './vencimiento.service';
import { ToastrService } from 'ngx-toastr';
import Botonera from 'src/app/models/IBotonera';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
standalone: false,
  selector: 'app-vencimiento',
  templateUrl: './vencimiento.component.html',
  styleUrls: ['./vencimiento.component.scss']
})
export class VencimientoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mensajeSpinner: string;
  vmButtons: Botonera[] = [];
  vSelector: boolean = true;

  filter: any = {
    num_documento: null,
    estado: null,
    tipo: null,
    fecha_desde: null,
    fecha_hasta: null,

  }
  cmb_tipo: any[] = [];
  documentos: any[] = [];

  
  cmb_estado: any[] = [
    { valor: 'P', descripcion: 'Pendiente' },
    { valor: 'C', descripcion: 'Cerrado' }
  ]

  paginate: any= {
    length:0,
    page:1,
    pageIndex:0,
    perPage:10,
    pageSizeOptions:[5,10,20,50]
  }
  
 // lst_documentos: MatTableDataSource<any>;
  documentoSelected: any;
  displayedColumns: string[] = ['num_documento', 'proveedor', 'fecha', 'estado'];

  constructor(
    private apiService: VencimientoService,
    private toastr: ToastrService,
    private excelService: ExcelService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsReporteVencimiento',
        paramAccion: '1',
        boton: { icon: 'far fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsReporteVencimiento',
        paramAccion: '1',
        boton: { icon: 'far fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsReporteVencimiento',
        paramAccion: '1',
        boton: { icon: 'far fa-file-excel', texto: 'EXCEL' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsReporteVencimiento',
        paramAccion: '2',
        boton: { icon: 'far fa-chevron-left', texto: 'REGRESAR' },
        clase: 'btn btn-sm btn-danger',
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
      this.dinamicoBotones('1')

      this.cargaInicial()
    }, 50)


  }

  changePage({pageIndex,pageSize})
  {
    Object.assign(this.paginate,{
      page:pageIndex+1,
      perPage:pageSize
      
    })
    this.cargarDocumentos();
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "EXCEL":
        this.exportExcel()
        break;
        case "CONSULTAR":
          this.cargarDocumentos()
          break;
          case "LIMPIAR":
            this.limpiarFiltros()
            break;

      case "REGRESAR":
        this.vSelector = true
        this.dinamicoBotones('1')
        break;
    
      default:
        break;
    }
  }

  dinamicoBotones(paramAccion: string) {
    this.vmButtons.map((item: Botonera) => {
      if (item.paramAccion == paramAccion) {
        item.showimg = true
      } else {
        item.showimg = false
      }
    })
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      // Cargar Catalogos
      this.mensajeSpinner = 'Cargando Catalogos'
      let catalogos = await this.apiService.getCatalogos({params: "'INV_REGISTRO_POLIZA'"});
      this.cmb_tipo = catalogos['INV_REGISTRO_POLIZA']
  
      // Cargar Documentos
      this.mensajeSpinner = 'Cargando Documentos'

    let params=
    {filter: this.filter, paginate : this.paginate};

      let respuesta = await this.apiService.getDocumentos({params: params});



      // let proyectos =await this.apiSrv.getProyectos({filter: this.filter, paginate : this.paginate});
      // this.lista_proyectos= proyectos.data;
      // this.paginate.length = proyectos.total;
console.log(respuesta);
//return;
       this.documentos= respuesta.data;
       this.paginate.length = respuesta.total;
 

   
     // this.lst_documentos = new MatTableDataSource(this.documentos)
     // this.lst_documentos.paginator = this.paginator
      //console.log(this.lst_documentos);
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  async cargarDocumentos() {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpinner = 'Cargando Documentos'

      let params=
    {filter: this.filter, paginate : this.paginate};

      let respuesta = await this.apiService.getDocumentos({params: params});


   



      // let proyectos =await this.apiSrv.getProyectos({filter: this.filter, paginate : this.paginate});
      // this.lista_proyectos= proyectos.data;
      // this.paginate.length = proyectos.total;


      this.documentos= respuesta.data;
    this.paginate.length = respuesta.total;
     // this.lst_documentos = new MatTableDataSource(documentos)
     // this.lst_documentos.paginator = this.paginator
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      num_documento: null,
      estado: null,
      fecha_desde: null,
      fecha_hasta: null,
    })
  }

  select(documento: any) {
    this.dinamicoBotones('2')
    this.vSelector = false
    this.documentoSelected = documento
  }

  exportExcel() {
    let excelData = []
    this.documentos.forEach((documento: any) => {
      let o = {
        NumDocumento: documento.num_documento,
        Tipo: documento.tipo_poliza,
        Proveedor: documento.proveedor.razon_social,
        Identificacion: documento.proveedor.num_documento,
        Fecha: `${documento.fecha}`,
        FechaInicio: `${documento.fecha_inicio}`,
        FechaFin: `${documento.fecha_fin}`,
        Estado: (documento.estado == 'P') ? 'Pendiente' : (documento.estado == 'C') ? 'Cerrado' : 'N/A'
      }
      excelData.push(o)
    })
    this.excelService.exportAsExcelFile(excelData, 'VencimientoPolizas')
  }

}
