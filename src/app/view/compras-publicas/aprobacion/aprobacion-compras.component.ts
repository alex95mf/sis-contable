import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { AprobacionCompraPublicaComponent } from './aprobacion-compra-publica/aprobacion-compra-publica.component';
import { AprobacionService } from './aprobacion.service';
import { CierreMesService } from '../../contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { DenegacionCompraPublicaComponent } from './denegacion-compra-publica/denegacion-compra-publica.component';
import { DetalleComprasComponent } from './detalle-compras/detalle-compras.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import moment from 'moment';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-aprobacion-compras',
  templateUrl: './aprobacion-compras.component.html',
  styleUrls: ['./aprobacion.component.scss']
})
export class AprobacionComprasComponent implements OnInit {

  programa: any = []
  departamento: any = []
  atribucion: any = []
  cmb_periodo: any[] = [];
  listaSolicitudes: any = []

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSppiner: string = "Cargando...";

  paginate: any;
  filter: any;

  atribucionParams: any = {
    programa: null,
    departamento: null,
    atribucion: null
  }

  periodo: any = new Date();


  firstday: any;
  today: any;
  tomorrow: any;

  estadoSelected: any = 0

  vmButtons: any;

  dato_Programa:any =[]
  datoDepartamento: any = []
  fecha: Date = new Date();

  estadoList = [
    {value: "A",label: "Aprobado"},
    {value: "P",label: "Pendiente"},
    {value: "D",label: "Denegado"},
  ]

  constructor(
    private modulo: NgbModal,
    private service: AprobacionService,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
    private cierremesService: CierreMesService,
  ) {
    this.commonVrs.guardarAprobacion.subscribe((res)=>{
      this.mensajeSppiner = "Cargando solicitudes...";
      this.lcargando.ctlSpinner(true);
      this.SearchList(this.atribucionParams['atribucion'])
    })
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsComprasAprobacion", paramAccion: "1", boton: { icon: "fas fa-eraser", texto: "Limpiar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ]

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);


    this.filter = {
      num_solicitud:"",
      estado:['A','P','D'],
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      proveedor: undefined,
      con_contrato: undefined,
      filterControl: ""
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };
    this.periodo =  moment().format('YYYY');

    setTimeout(async() => {
      this.cargarPrograma()
      this.SearchList({})
      await this.cargaInicial()
    }, 500);






  }


  async cargaInicial() {
    try {
      this.mensajeSppiner = "Carga Inicial"
      const resPeriodos = await this.service.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos
    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }


  metodoGlobal(event){
    switch(event.items.boton.texto){

      case "Limpiar":
        this.limpiar();
        break;
    }
  }


  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.SearchList(this.atribucionParams['atribucion']);
  }

  onMaterialGroupChange(event){
    console.log(event);
  }
  asignarEstado(evt) {
    this.filter.estado = [evt]
   }

  periodoSelected(evt: any, year:any){
    console.log(evt)
    this.periodo = evt
    if(evt){
      this.cargarPrograma();
    }
  }

  limpiar(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea limpiar el formulario?.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {

      if (result.isConfirmed) {
        this.atribucionParams = {
          programa: null,
          departamento: null,
          atribucion: null
        }

        this.listaSolicitudes = []
      }
    })

  }


  cargarPrograma(){
    this.mensajeSppiner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);

    let data ={

      periodo: Number(this.periodo),
    }
    console.log(data)
    this.service.searchPrograma(data).subscribe((res: any)=>{
       console.log(res);
       this.lcargando.ctlSpinner(false);
      let program = []
      res.map((data)=>{

        let dat = {
          ...data.catalogo,
          value: data.catalogo['descripcion'] + '-'+ data.catalogo['valor']
        }
        program.push(dat)
       // this.lcargando.ctlSpinner(false);
      })
      this.programa = program
      console.log(this.programa);
    })
  }

  departamentoSearch(event){
    console.log(event);
    this.mensajeSppiner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);

    let data = {
      programa: this.dato_Programa
    }

    this.service.searchDepartamento(data).subscribe((data: any)=>{
      console.log(data);

      let depa = []
      data.map((res)=>{
        let d = {
          ...res,
          value: res['descripcion'] + '-'+ res['valor'],

        }
        depa.push(d)
      })
      this.departamento = depa
      this.lcargando.ctlSpinner(false);
    })
  }

  AtribucionSearch(event){
    console.log(event);
    this.mensajeSppiner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data = {
      departamento: event.valor
    }
    this.service.searchAtribucion(data).subscribe((dat)=>{
      console.log(dat);
      this.atribucion = dat['data']
      this.lcargando.ctlSpinner(false);
    })
  }

  SearchList(event,flag: boolean = false){


    console.log(event);
    this.mensajeSppiner = "Cargando Solicitudes...";
    this.lcargando.ctlSpinner(true);
    if (flag) this.paginate.page = 1
    let data = {
      id: this.datoDepartamento,
      params:{
        paginate: this.paginate,
        filter: this.filter
      }


    }
    this.service.searchSolicitud(data).subscribe((dat)=>{
      console.log(dat);
      if(dat['data'].length == 0){
        this.listaSolicitudes = [];
      }else{
        this.paginate.length = dat['data']['total'];
        if (dat['data']['current_page'] == 1) {
          this.listaSolicitudes = dat['data']['data'];
        } else {
          this.listaSolicitudes = Object.values(dat['data']['data']);
        }
      }


      this.lcargando.ctlSpinner(false);
    },
    (error)=>{
      console.log(error);
      this.lcargando.ctlSpinner(false);
    }
    )
  }

  moduloDetalle(item){
    let modal = this.modulo.open(DetalleComprasComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.item = item
  }

  moduloDenegacion(item){
    let modal = this.modulo.open(DenegacionCompraPublicaComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.item = item
  }

  moduloAprobacionCompra(item){
    let modal = this.modulo.open(AprobacionCompraPublicaComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.item = item
  }

  moduloReversarSolicitud(item){

    console.log(item)
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea reversar esta solicitud?.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {

      if (result.isConfirmed) {


          this.mensajeSppiner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);

          let dat = {
            "anio": Number(moment().format('YYYY')),
            "mes": Number(moment().format('MM'))
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(res => {

            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {
              this.mensajeSppiner = "Cargando...";
              this.lcargando.ctlSpinner(true);

              let data ={
                id_solicitud: item.id_solicitud,
                idp: item.idp
              }

              this.service.reversarSolicitud(data).subscribe((res: any)=>{
                 console.log(res);
                 if (res["status"] == 1) {
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "success",
                    title: "La solicitud " + res["data"].num_solicitud + " fue reversada con éxito",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  });
                  this.SearchList({})
                  this.lcargando.ctlSpinner(false);
                } else {
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: res['message'],
                    showCloseButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: '#20A8D8',
                  });
                }


              },
              (error) => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.message);
              }
              )

            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

            }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.mesagge);
            })
      }
    })
  }

  limpiarFiltro(){
    this.filter = {
      num_solicitud:"",
      estado:['A','P','D'],
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: ""
    };
    this.estadoSelected = 0

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };
  }

}
