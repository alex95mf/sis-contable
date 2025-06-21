


import { Component, Input, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BandejaService } from './bandeja.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from '../../../../global';
import { TareaFormComponent } from './tarea-form/tarea-form.component';

@Component({
standalone: false,
  selector: 'app-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss']
})
export class BandejaComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator : MatPaginator


  @Input() Perfil: any = {
    nombre:'',
    edad:10
  };

  tarea:any={
    id_tarea: 0,
    fk_documento:0,
    fk_documento_version:0,
    estado : 'PENDIENTE',
    secuencia:'',
    descripcion :'',
    perfil_responsable:'',
    nombre_tarea:'',
    fk_tarea_principal:0
};

lista_estados:any={};
lista_tareas: any[] = [];
cmb_periodo: any[] = [];
vmButtons:any={};
nombreBarraBotones="btnsMantenimientoProyecto";
lista_tipo_tareas: any[] = [];
lista_responsables: any[] = [];

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

datosSesion:string="";
nombreRol:string="";
rolValido:boolean=false;
titulo :string="";
  constructor(
    private toastr: ToastrService,
    private apiSrv: BandejaService,
    private modal: NgbModal
  ) {


    this.apiSrv.tareas$.subscribe(
      (res: any) => {
      console.log(res)
        if(res){
          this.consultar();
        }
      }
    )

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

      this.lista_responsables=[
        {
          id_catalogo:1,
          valor:"CREDITO"
        },
        {
          id_catalogo:2,
          valor:"SUPERVISOR"
        },
        {
          id_catalogo:3,
          valor:"BODEGA"
        },
        {
          id_catalogo:4,
          valor:"ASESOR"
        }

      ];

      this.lista_tipo_tareas=[
        {
          id_catalogo:10,
          valor:"REVISION CREDITO"
        },
        {
          id_catalogo:20,
          valor:"REVISION DESCUENTO"
        },
        {
          id_catalogo:30,
          valor:"REVISION STOCK"
        },
        {
          id_catalogo:40,
          valor:"REVISION DOCUMENTOS"
        }

      ];



  }

  ngOnInit(): void {

    let datos=JSON.parse(localStorage.getItem('Datauser'));
    //this.DatosSesion = datos;
    this.nombreRol = datos.rol.nombre_rol;


    const perfilesValidos = ["PEDIDO_ONLINE", "BODEGA", "VENDEDOR", "COBRANZA", "JEFE_COMERCIAL"];

    // Validar si nombre_perfil está en la lista de perfiles válidos
    if (perfilesValidos.includes(this.nombreRol)) {
      this.titulo = "BANDEJA DE TRABAJO ["+this.Perfil.nombre.replace(/_/g, ' ')+"]";
      this.rolValido=true;
    } else {
      this.rolValido=false;
    }

    setTimeout(()=> {
      this.cancelar();
     // this.cargaInicial()

      //this.getCatalogos();
    }, 50);





  }

  editarTarea(item)
  {
    this.tarea = {
      id_tarea: item.id_tarea,
      nombre_tarea:item.nombre_tarea,
      perfil_responsable:  item.perfil_responsable,
      estado : item.estado,
      fecha:item.fecha,
      observacion :item.observacion,
      fk_tarea_principal: item.fk_tarea_principal,
      fk_documento: item.fk_documento,
      fk_documento_revision: item.fk_documento_revision
    };


    const modalInvoice = this.modal.open(TareaFormComponent, {
      size: "xl",
      // backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fConciliacionBank;

    modalInvoice.componentInstance.isNew = false;
    modalInvoice.componentInstance.data = this.tarea;
    modalInvoice.componentInstance.Perfil = this.Perfil.nombre;

    modalInvoice.componentInstance.lista_estados = this.lista_estados;
    modalInvoice.componentInstance.lista_tipo_tareas= this.lista_tipo_tareas;

    modalInvoice.componentInstance.lista_responsables= this.lista_responsables;

  }

  inactivarTarea(item)
  {

  }

  crearTarea(isNew:boolean, data?:any):void{
    // nuevoMovimiento(isNew:boolean, data?:any) {
   //alert('aaaa');
       const modalInvoice = this.modal.open(TareaFormComponent, {
         size: "xl",
         // backdrop: "static",
         windowClass: "viewer-content-general",
       });
       modalInvoice.componentInstance.module_comp = myVarGlobals.fCrmProductos;

       modalInvoice.componentInstance.isNew = isNew;
       modalInvoice.componentInstance.data = data;
       modalInvoice.componentInstance.Perfil = this.Perfil.nombre;
        modalInvoice.componentInstance.lista_estados = this.lista_estados;
        modalInvoice.componentInstance.lista_tipo_tareas = this.lista_tipo_tareas;
        modalInvoice.componentInstance.lista_responsables = this.lista_responsables;

     //  modalInvoice.componentInstance.programas = this.programas;
     //  modalInvoice.componentInstance.cmb_periodo= this.cmb_periodo;






   }

  async cargarTareas(){
    (this as any).mensajeSpinner = 'Cargando Proyectos';
    this.lcargando.ctlSpinner(true);
    try {


     //alert(JSON.stringify(this.filter));

      let tareas =await this.apiSrv.getTareas({filter: this.filter, paginate : this.paginate});
      this.lista_tareas= tareas.data;
      this.paginate.length = tareas.total;
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


      (this as any).mensajeSpinner = 'Cargando Tareas'
      let tareas =await this.apiSrv.getTareas({filter: this.filter, paginate : this.paginate});
this.lista_tareas= tareas.data;
this.paginate.length = tareas.total;
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }

  changePage({pageIndex,pageSize})
  {
    Object.assign(this.paginate,{
      page:pageIndex+1,
      perPage:pageSize

    })
    this.cargarTareas();
  }

  metodoGlobal(parametro): void{
    switch (parametro.items.boton.texto) {
      case "Consultar":
        this.consultar()
        break;
        case "Nuevo":

           this.crearTarea(true,this.tarea);
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

  cancelar():void

  {
    this.filter={

      fecha_desde: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')) - 1, 1).toISOString().substring(0, 10),
      fecha_hasta: new Date(Number(moment(new Date()).format('YYYY')), Number(moment(new Date()).format('MM')), 0).toISOString().substring(0, 10),
      nombre_cliente:'',
      nombre_usuario:'',
      estado : '',
      perfil_responsable: this.Perfil.nombre


  };
  this.consultar();
  this.tarea={
    id_tarea: 0,
    fk_documento:0,
    fk_documento_version:0,
    estado : 'PENDIENTE',
    secuencia:'',
    descripcion :'',
    perfil_responsable:'',
    nombre_tarea:'',
    fk_tarea_principal:0
};


  }
  consultar()
  {
    Object.assign(this.paginate,{
      page:1,
      pageIndex:0,
      perPage:this.paginate.perPage
    })

    this.paginator.firstPage;
    this.cargarTareas();
  }





}
