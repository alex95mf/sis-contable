import { Component, OnInit, ViewChild } from '@angular/core';
import { BugsServiceService } from './bugs-service.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelDetallesComponent } from './model-detalles/model-detalles.component';
import { ModalHistoryComponent } from './modal-history/modal-history.component';

@Component({
  standalone: false,
  selector: 'app-bugs',
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.scss']
})
export class BugsComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent
  @ViewChild(MatPaginator) paginator : MatPaginator
  total_costo:number=0;
  nro_items:number=0;
  isNuevo:boolean=true;
  cmb_tipo_identificacion: Array<any>=[];
  cmb_estado_civil: Array<any>=[];
  lstestados: Array<any>=[];
  bug:any={};

  lst_bugs: Array<any>=[];
  vmButtons : Array<any>=[];
  filter: any = {
    costo_desde: null,
    costo_hasta: null,
    tipo_documento: null,
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
    private apiBugsService:BugsServiceService,
    private modalService:NgbModal
    ) {

    this.apiBugsService.actualizarFormulario$.subscribe(
      ()=>{
        this.cargarBugs();
      }
    )
    this.lstestados = [
      { estado: "CERRADO" },
      { estado: "PENDIENTE" },
      { estado: "OTRO" },
      { estado: "EN GESTION" },

    ]

this.vmButtons=[
  {
    orig: 'btnsMantenimientoBubs',
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
    orig: 'btnsMantenimientoBubs',
    paramAccion: "",
    boton: { icon: "far fa-plus-square", texto: "Nuevo" },
    permiso: true,
    showtxt: true,
    showimg: true,
    showbadge: false,
    clase: "btn btn-primary boton btn-sm",
    habilitar: false,
  },
  {
    orig: 'btnsMantenimientoBubs',
    paramAccion: "",
    boton: { icon: "far fa-floppy-o", texto: "Grabar" },
    permiso: true,
    showtxt: true,
    showimg: true,
    showbadge: false,
    clase: "btn btn-success boton btn-sm",
    habilitar: false,
  },
  {
    orig: 'btnsMantenimientoBubs',
    paramAccion: "",
    boton: { icon: "far fa-edit", texto: "Modificar" },
    permiso: true,
    showtxt: true,
    showimg: true,
    showbadge: false,
    clase: "btn btn-info text-white boton btn-sm",
    habilitar: false,
  }
  ,
  {
    orig: 'btnsMantenimientoBubs',
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

    setTimeout(() =>this.cargaInicial(),50);


  }

  metodoGlobal(parametro): void{
    switch (parametro.items.boton.texto) {
      case "Consultar":
        this.consultar()
        break;
        case "Nuevo":
          // alert('grabar');
           this.crearBug(this.bug);
           break;
      case "Grabar":
         // alert('grabar');
          this.guardar();
          break;
      case "Modificar":
        this.modificar(this.bug);

            break;
      default:
        break;
    }
  }

  crearBug(item):void{

  // let bug = {
  //   fk_cliente: 0,
  //   fk_tipo_documento: 0,
  //   tipo_documento: "CEDULA",
  //   num_documento: "",
  //   fecha: "2023-05-01",
  //   estado: "",
  //   observacion: "",
  //   costo: 0,
  //   histories:[]
  // }
  //  this.bug = bug;
    //alert(item.id_test_bugs);
    const modal= this.modalService.open(ModelDetallesComponent,
      {
        size:"lg",
        backdrop:"static"
      });

    modal.componentInstance.isNuevo=true;
   // modal.componentInstance.bug=this.bug;
    modal.componentInstance.cmb_tipo_identificacion = this.cmb_tipo_identificacion;
    modal.componentInstance.lstestados = this.lstestados;

    //this.bug = item;

  }
  editarBug(item):void{
    //alert(item.id_test_bugs);
    const modal= this.modalService.open(ModelDetallesComponent,
      {
        size:"lg",
        backdrop:"static"
      });
      modal.componentInstance.isNuevo=false;
    modal.componentInstance.bug=item;
    modal.componentInstance.cmb_tipo_identificacion = this.cmb_tipo_identificacion;
    modal.componentInstance.lstestados = this.lstestados;

    //this.bug = item;

  }
  agregarHistory(item):void{

    const modal= this.modalService.open(ModalHistoryComponent,
      {
        size:"lg",
        backdrop:"static"
      });
      modal.componentInstance.bug=item;
      modal.componentInstance.lstestados = this.lstestados;
      modal.componentInstance.cmb_tipo_identificacion = this.cmb_tipo_identificacion;
  }
  inactivarDetalle(item):void{
    alert(item.fecha);
  }
  async cargaInicial()
  {
    this.lcargando.ctlSpinner(true);
    let response=await this.apiBugsService.cargaCatalogo({params:"'DOCUMENTO','ESTADO CIVIL'"});
    console.log(response);

    this.cmb_tipo_identificacion=response['DOCUMENTO'];
    this.cmb_estado_civil=response['ESTADO CIVIL'];

    let bugs =await this.apiBugsService.obtenerBugs({filter: this.filter, paginate : this.paginate});
 //itemArray.map(a => a.value).reduce(function(a, b)
 /*
 {
   return a + b;
 });
 */



   // console.log(bugs);

   bugs.data.forEach((e: any) => Object.assign(e, {contribuyente: e.cliente}))
    this.lst_bugs= bugs.data;
    this.paginate.length = bugs.total;


    let sum: number = this.lst_bugs.map(a => Number(a.costo)).reduce(function (a, b) {
      return a + b;
    });

    let contador: number = this.lst_bugs.map(a =>1).reduce(function (a, b) {
      return a + b;
    });


    //console.log(sum);
    this.total_costo =sum;
    this.nro_items = contador;

/*
    let valorTotalCotizado = 0;
    let valorTotalAprobado = 0;
    res['data'].forEach(element => {
      valorTotalCotizado += +element.precio_cotizado;
      valorTotalAprobado += +element.precio_aprobado;

    });
    this.totalCotizado = valorTotalCotizado
    this.totalAprobado = valorTotalAprobado
    */


    this.lcargando.ctlSpinner(false)

  }
  consultar()
  {
    Object.assign(this.paginate,{
      page:1,
      pageIndex:0,
      perPage:this.paginate.perPage
    })

    this.paginator.firstPage;
    this.cargarBugs();
  }
  changePage({pageIndex,pageSize})
  {
    Object.assign(this.paginate,{
      page:pageIndex+1,
      perPage:pageSize

    })
    this.cargarBugs();
  }
  async cargarBugs() {
    this.lcargando.ctlMensaje("Actualizando Lista de Bugs....!!!");
    this.lcargando.ctlSpinner(true);



    let bugs = await this.apiBugsService.obtenerBugs({filter: this.filter, paginate : this.paginate});
    console.log(bugs)
    this.lst_bugs= bugs.data;
    this.paginate.length = bugs.total;


    this.lcargando.ctlSpinner(false)
  }

  async guardar() {
    let bug = {
      fk_cliente: 1,
      fk_tipo_documento: 1,
      tipo_documento: "CEDULA",
      num_documento: "0911112233",
      fecha: "2023-05-01",
      estado: "PENDIENTE",
      observacion: "pruebassss ddd dddd",
      costo: 100,
      histories:[]
    }
    let respuesta = await this.apiBugsService.guardarBug({ bugs: bug });
    console.log(respuesta);
  }

  async modificar(bug) {
  /*  let bug = {
      fk_cliente: 1,
      fk_tipo_documento: 1,
      tipo_documento: "CEDULA",
      num_documento: "0911112233",
      fecha: "2023-05-01",
      estado: "PENDIENTE",
      observacion: "pruebassss ddd dddd",
      costo: 100,
      histories:[]
    }*/
    bug.observacion+='aaa';
    console.log(bug);
    let respuesta = await this.apiBugsService.modificarBug(bug.id_test_bugs,{ bugs: bug });
    console.log(respuesta);
  }


}

