import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from '../../../../global';

import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProyectosService } from './proyectos.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ProyectoFormComponent } from './proyecto-form/proyecto-form.component';

@Component({
standalone: false,
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

  
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
  lista_proyectos: any[] = [];
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

 periodoSelected(evt: any, year:any){
  console.log(evt)
  this.filter.periodo = evt

}


  constructor(
    private toastr: ToastrService,
    private apiSrv: ProyectosService,
    private modal: NgbModal) {


      this.apiSrv.proyectos$.subscribe(
        (res: any) => {
        console.log(res)
          if(res){
            this.consultar();
          }
        }
      )

       this.lista_estados = [
     { estado: "A",descripcion:"ACTIVO" },
     { estado: "I",descripcion:"INACTIVO" }


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
      this.cargaInicial();
      //this.getCatalogos();
    }, 50);
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {

      (this as any).mensajeSpinner = "Cargando Períodos";
      const resPeriodos = await this.apiSrv.getPeriodos();
      this.cmb_periodo = resPeriodos;

      (this as any).mensajeSpinner = 'Cargando Programas';
      this.programas = await this.apiSrv.getProgramas();
      (this as any).mensajeSpinner = 'Cargando Proyectos';
      let proyectos =await this.apiSrv.getProyectos({filter: this.filter, paginate : this.paginate});
this.lista_proyectos= proyectos.data;
this.paginate.length = proyectos.total;
      this.lcargando.ctlSpinner(false);
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false);
      this.toastr.error(err.error.message, 'Error en Carga Inicial');
    }
  }

  metodoGlobal(parametro): void{
    switch (parametro.items.boton.texto) {
      case "Consultar":
        this.consultar()
        break;
        case "Nuevo":
          // alert('grabar');
           this.crearProyecto(true,this.proyecto);
           break;
      case "Grabar":
         // alert('grabar');
          this.guardar();
          break;
     // case "Modificar":
     //   this.modificar(this.proyecto);

            break;
      case "Cancelar":
              this.cancelar();

                  break;
      default:
        break;
    }
  }
  changePage({pageIndex,pageSize})
  {
    Object.assign(this.paginate,{
      page:pageIndex+1,
      perPage:pageSize

    })
    this.CargarProyectos();
  }
  consultar()
  {
    Object.assign(this.paginate,{
      page:1,
      pageIndex:0,
      perPage:this.paginate.perPage
    })

    this.paginator.firstPage;
    this.CargarProyectos();
  }
  editarProyecto(item)
  {

    this.proyecto = {
      id_proyecto: item.id_proyecto,
      fk_programa:item.fk_programa,
      anio:  item.anio,
      estado : item.estado,
      secuencia:item.secuencia,
      descripcion :item.descripcion
    };


    const modalInvoice = this.modal.open(ProyectoFormComponent, {
      size: "xl",
      // backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fConciliacionBank;

    modalInvoice.componentInstance.isNew = false;
    modalInvoice.componentInstance.data = this.proyecto;

    modalInvoice.componentInstance.lista_estados = this.lista_estados;
    modalInvoice.componentInstance.programas = this.programas;
    modalInvoice.componentInstance.cmb_periodo= this.cmb_periodo;
  }
  inactivarProyecto(item)
  {

  }

  async CargarProyectos(){
    (this as any).mensajeSpinner = 'Cargando Proyectos';
    this.lcargando.ctlSpinner(true);
    try {


     //alert(JSON.stringify(this.filter));



      let proyectos =await this.apiSrv.getProyectos({filter: this.filter, paginate : this.paginate});
      this.lista_proyectos= proyectos.data;
      this.paginate.length = proyectos.total;
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }


  }

  crearProyecto(isNew:boolean, data?:any):void{
   // nuevoMovimiento(isNew:boolean, data?:any) {
  //alert('aaaa');
      const modalInvoice = this.modal.open(ProyectoFormComponent, {
        size: "xl",
        // backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fConciliacionBank;

      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;

      modalInvoice.componentInstance.lista_estados = this.lista_estados;
      modalInvoice.componentInstance.programas = this.programas;
      modalInvoice.componentInstance.cmb_periodo= this.cmb_periodo;






  }

  guardar():void{


  }

  cancelar():void{
    this.filter = {
      anio: Number(moment(new Date()).format('YYYY')),
      fk_programa: null,
      estado:null,
    }

  }


}
