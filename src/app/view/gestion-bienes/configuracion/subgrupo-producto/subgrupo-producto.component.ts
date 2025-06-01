import { Component, OnInit ,ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { SubgrupoProductoService} from './subgrupo-producto.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ModalGruposComponent } from './modal-grupos/modal-grupos.component';
import { ToastrService } from 'ngx-toastr';
import { event } from 'jquery';
import { ThisReceiver } from '@angular/compiler/src/expression_parser/ast';
@Component({
standalone: false,
  selector: 'app-subgrupo-producto',
  templateUrl: './subgrupo-producto.component.html',
  styleUrls: ['./subgrupo-producto.component.scss']
})
export class SubgrupoProductoComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSppiner: string = "Cargando...";
  estadoList = [
    { value: "A", label: "ACTIVO" },
    { value: "I", label: "INACTIVO" },
    { }
  ]
  filter: any;
  paginate: any
  vmButtons: any
  firstday: any;
  today: any;
  tomorrow: any;
  subgrupos: any = []
  verifyRestore = false;
  subgrupo = {
    codigo_grupo_producto:"",
    fk_grupo_producto:0,
    secuencia:0,
    codigo_subgrupo_producto:"",
    descripcion:"",
    estado:""
  }

  grupo: any = [];
  validacion: boolean = true


  constructor(
    private service: SubgrupoProductoService,
    private modalDet: NgbModal,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
  ) {
    this.commonVrs.selectGrupo.asObservable().subscribe(
      (res) => {
        this.grupo = res
        //console.log(this.grupo)
        this.subgrupo.codigo_grupo_producto = this.grupo.codigo_grupo_producto
        this.subgrupo.fk_grupo_producto = this.grupo.id_grupo_productos
        console.log(this.grupo)
        this.generaActionRawMaterial()

      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      //{ orig: "btnsGrupoProducto", paramAccion: "1", boton: { icon: "far fa-plus-square", texto: "Nuevo" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsGrupoProducto", paramAccion: "1", boton: { icon: "fas fa-save", texto: "Guardar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsGrupoProducto", paramAccion: "1", boton: { icon: "fas fa-edit", texto: "Editar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsGrupoProducto", paramAccion: "1", boton: { icon: "fas fa-eraser", texto: "Limpiar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ]

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);

    this.filter = {
      // fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      // fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      codigo_subgrupo_producto: null,
      descripcion: null,
      filterControl: ""
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    setTimeout(()=>{
      this.cargarSubgrupos()

      // this.ObtenerCatalogoBienes()
    },500)
  }

  metodoGlobal(event){
    switch(event.items.boton.texto){

      case "Nuevo":
        //this.newGrupo();
        break;

      case "Guardar":
       this.crearSubgrupo()
        break;

      case "Editar":
        this.guardarEdition();
        break;

      case "Limpiar":
        this.limpiarForm()
        // this.activeModal.close()
        break;
    }
  }
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    //this.ObtenerCatalogoBienes();
  }

  limpiarFiltro(){
    this.filter = {
      // fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      // fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      codigo_subgrupo_producto: null,
      descripcion: null,
      // estado: null,
      filterControl: ""
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };
  }
  modalGrupos(){

    let modal = this.modalDet.open(ModalGruposComponent,{
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true
    modal.componentInstance.verifyRestore = this.verifyRestore;
    //this.generaActionRawMaterial()


  }

  cargarSubgrupos(){
    this.mensajeSppiner = "Cargando";
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.service.getSubproductos(data).subscribe(
      (res) => {
        console.log(res)
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.subgrupos = res['data']['data'];
        } else {
          this.subgrupos = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  generaActionRawMaterial() {


   // this.lcargando.ctlSpinner(true);


    let codigo = this.grupo.codigo_grupo_producto
    let inicial =1

    this.service.countProductos({parametro:  this.grupo.codigo_grupo_producto}).subscribe(
      (res)=>{
        console.log(res);
        if(res['data'] >= 10){
          codigo = codigo + "-" + (parseInt(res['data']) + 1)
        }
        else if(res['data'].length == 0){
          codigo = codigo + "-" + "0" + inicial
          this.subgrupo.secuencia = 1;
          console.log(codigo)
        }else{
          codigo = codigo + "-" + "0"+ (parseInt(res['data']) + 1)

          this.grupo.secuencia = (res['data'] + 1)
        }


        console.log(this.subgrupo.secuencia)
        this.subgrupo.codigo_subgrupo_producto = codigo;
        console.log(codigo);
        console.log(this.subgrupo)

      }
    )


  }

  crearSubgrupo(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar este subgrupo ?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        //this.mensajeSpinner = "Cargando...";
        this.lcargando.ctlSpinner(true);


        let data = {
          // subgrupo: {
          //   codigo_grupo_producto:this.subgrupo.codigo_grupo_producto,
          //   fk_grupo_producto:this.subgrupo.fk_grupo_producto,
          //   secuencia:this.subgrupo.secuencia,
          //   codigo_subgrupo_producto:this.subgrupo.codigo_subgrupo_producto,
          //   descripcion:this.subgrupo.descripcion,
          //   estado:this.subgrupo.estado
          // }
          subgrupo: this.subgrupo
        }
        console.log(this.subgrupo)

        this.service.crearsubgrupos(data).subscribe(
          (res) => {
            res['data']=this.subgrupo
            console.log(res);

            if (res["status"] == 1) {
              this.lcargando.ctlSpinner(false);

              Swal.fire({
                icon: "success",
                title: "Se guardo con éxito ",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  console.log("hola")
                  this.cargarSubgrupos()
                  this.vmButtons[0].habilitar = true

                }
              });
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
      }
    });
  }

  limpiarForm(){

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
        this.vmButtons[0].habilitar = false
        this.vmButtons[1].habilitar = true
        this.vmButtons[2].habilitar = false
        this.validacion = true
        this.subgrupo = {
          codigo_grupo_producto: null,
          descripcion: null,
          estado: null,
          fk_grupo_producto:0,
          secuencia:0,
          codigo_subgrupo_producto:null
        }
        this.grupo.descripcion = null
      }
    });

  }

  guardarEdition(){
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    console.log(this.subgrupo);
    let data = {

      subgrupo: this.subgrupo
    }
    console.log(data)
    this.service.updateSubgrupo(data).subscribe(
      (res)=>{
        // res =this.subgrupo
        console.log(res);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Se actualizó con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8'
        }).then((result) => {
          if (result.isConfirmed) {
            // this.activeModal.close()
            // this.commonVrs.CatalogoBienes.next(null)
            this.cargarSubgrupos()
          }
        })


      }
    )
  }


  EditarGrupo(item){
    console.log(item);

    this.subgrupo = item
    this.grupo = item.grupo[0]
    this.validacion = false
    this.vmButtons[0].habilitar = true
    this.vmButtons[1].habilitar = false
    this.vmButtons[2].habilitar = false
  }


}
