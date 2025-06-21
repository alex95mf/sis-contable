import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from '../../../../global';

import { CommonVarService } from 'src/app/services/common-var.services';

import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConsultaCotizacionesService } from './consulta-cotizaciones.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-consulta-cotizaciones',
  templateUrl: './consulta-cotizaciones.component.html',
  styleUrls: ['./consulta-cotizaciones.component.scss']
})
export class ConsultaCotizacionesComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator : MatPaginator

  proyecto:any={
    id_proyecto: 0,
    fk_programa:null,
    anio:  Number(moment(new Date()).format('YYYY')),
    estado : 'A',
    secuencia:'000',
    descripcion :''
};
lista_estados:any={};
lista_cotizaciones: any[] = [];
cmb_periodo: any[] = [];
vmButtons:any={};
nombreBarraBotones="btnsMantenimientoProyecto";
programas: any[] = [];

anioActual: any;
mes_actual: any = 0;


viewDate: Date = new Date();


filter: any = {
anio: Number(moment(new Date()).format('YYYY')),
fk_programa: null,
estado:null,
}
paginate: any= {
length:0,
page:1,
pageIndex:0,
perPage:10,
pageSizeOptions:[5,10,20,50]
}
  constructor(
    private toastr: ToastrService,
    private apiSrv: ConsultaCotizacionesService,
    private modal: NgbModal
  ) {

    this.lista_estados = [
      { estado: "PENDIENTE",descripcion:"PENDIENTE" },
      { estado: "GESTION",descripcion:"GESTION" },
      { estado: "APROBADO",descripcion:"APROBADO" },
      { estado: "NEGADO",descripcion:"NEGADO" }


    ]

    this.vmButtons=[
      {
        orig: this.nombreBarraBotones,
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "Consultar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: this.nombreBarraBotones,
        paramAccion: "",
        boton: { icon: "far fa-plus-square", texto: "Nuevo" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      // {
      //   orig: this.nombreBarraBotones,
      //   paramAccion: "",
      //   boton: { icon: "far fa-floppy-o", texto: "Grabar" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-success boton btn-sm",
      //   habilitar: false,
      // },
      // {
      //   orig: this.nombreBarraBotones,
      //   paramAccion: "",
      //   boton: { icon: "far fa-edit", texto: "Modificar" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-info text-white boton btn-sm",
      //   habilitar: false,
      // },

      {
        orig: this.nombreBarraBotones,
        paramAccion: "",
        boton: { icon: "far fa-times", texto: "Cancelar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
      ]


  }

  ngOnInit(): void {
    setTimeout(()=> {
      this.cancelar();
     // this.cargaInicial()

      //this.getCatalogos();
    }, 50);
  }



  metodoGlobal(parametro): void{
    switch (parametro.items.boton.texto) {
      case "Consultar":
        this.consultar()
        break;
        case "Nuevo":

          // this.crearProyecto(true,this.proyecto);
           break;
      case "Grabar":

      //    this.guardar();


            break;
      case "Cancelar":
            this.cancelar();

                  break;
      default:
        break;
    }
  }
  editarProyecto(item)
  {

  }

  async CargarCotizaciones(){
    (this as any).mensajeSpinner = 'Cargando Proyectos';
    this.lcargando.ctlSpinner(true);
    try {


     alert(JSON.stringify(this.filter));

      let cotizaciones =await this.apiSrv.getCotizaciones({filter: this.filter, paginate : this.paginate});
      this.lista_cotizaciones= cotizaciones.data;
      this.paginate.length = cotizaciones.total;
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }


  }
  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {


      (this as any).mensajeSpinner = 'Cargando Cotizaciones'
      let cotizaciones =await this.apiSrv.getCotizaciones({filter: this.filter, paginate : this.paginate});
this.lista_cotizaciones= cotizaciones.data;
this.paginate.length = cotizaciones.total;
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }

  cancelar():void

  {
    this.filter={

      fecha_desde: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10),
      fecha_hasta: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')), 0).toISOString().substring(0, 10),
      nombre_cliente:'',
      nombre_usuario:'',
      estado : ''


  };
  this.consultar();


  }
  consultar()
  {
    Object.assign(this.paginate,{
      page:1,
      pageIndex:0,
      perPage:this.paginate.perPage
    })

    this.paginator.firstPage;
    this.CargarCotizaciones();
  }
  changePage({pageIndex,pageSize})
  {
    Object.assign(this.paginate,{
      page:pageIndex+1,
      perPage:pageSize

    })
    this.CargarCotizaciones();
  }

}
