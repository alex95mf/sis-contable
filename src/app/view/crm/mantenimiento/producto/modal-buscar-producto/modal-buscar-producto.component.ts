import { Component, OnInit ,Input,ViewChild} from '@angular/core';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { MatPaginator } from '@angular/material/paginator';


import { ProductoServiceService } from './../producto-service.service';
import * as moment from 'moment';
@Component({
standalone: false,
  selector: 'app-modal-buscar-producto',
  templateUrl: './modal-buscar-producto.component.html',
  styleUrls: ['./modal-buscar-producto.component.scss']
})
export class ModalBuscarProductoComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator : MatPaginator

  @Input() producto: any;
  needRefresh: boolean = false;
  vmButtons: any = {};
  filter: any = {};
  paginate: any = {};
  lista_productos: any[] = [];
  constructor(

    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private productoSrv: ProductoServiceService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,


  ) {



   }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnMovForm",
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: " BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
    },

      {
          orig: "btnMovForm",
          paramAccion: "",
          boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-danger boton btn-sm",
          habilitar: false,
      }
    ];

    this.filter = {
      anio: Number(moment(new Date()).format('YYYY')),
      fk_programa: null,
      estado:null,
      nombre:''
    }
    this.paginate= {
      length:0,
      page:1,
      pageIndex:0,
      perPage:10,
      pageSizeOptions:[5,10,20,50]
    }

    setTimeout(()=> {
      this.cargaInicial()
      //this.getCatalogos();
    }, 50);

  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {




      this.mensajeSpinner = 'Cargando Productos'
      let productos =await this.productoSrv.getProductos({filter: this.filter, paginate : this.paginate});
this.lista_productos= productos.data;
this.paginate.length = productos.total;
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " BUSCAR":
       this.consultar();
    //    this.validarMoimientoBancario();
        break;
      case " REGRESAR":
          this.closeModal();
          break;

    }

  }

  seleccionarProducto(item)
  {
    console.log(item);
    this.producto = {
      id_producto: item.id_producto,

    };
   // alert(this.producto.id_producto);
    this.needRefresh= true;

    this.closeModal();
  };
  consultar()
  {
    Object.assign(this.paginate,{
      page:1,
      pageIndex:0,
      perPage:this.paginate.perPage
    })

    this.paginator.firstPage;
    this.CargarProductos();
  }
  changePage({pageIndex,pageSize})
  {
    Object.assign(this.paginate,{
      page:pageIndex+1,
      perPage:pageSize

    })
    this.CargarProductos();
  }
  async CargarProductos(){
    this.mensajeSpinner = 'Cargando Productos';
    this.lcargando.ctlSpinner(true)
    try {


     //alert(JSON.stringify(this.filter));

      let productos =await this.productoSrv.getProductos({filter: this.filter, paginate : this.paginate});
      this.lista_productos= productos.data;
      this.paginate.length = productos.total;
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }


  }
  closeModal() {


    //this.commonVarSrv.seguiTicket.next(this.needRefresh);
    this.productoSrv.productos$.emit({refrescar:this.needRefresh,id:this.producto.id_producto})
    this.activeModal.dismiss();
  }


}
