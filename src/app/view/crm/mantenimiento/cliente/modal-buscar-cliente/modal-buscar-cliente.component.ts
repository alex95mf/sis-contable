import { Component, OnInit ,Input,ViewChild} from '@angular/core';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { MatPaginator } from '@angular/material/paginator';


import { ClienteServiceService } from '../cliente-service.service';
import * as moment from 'moment';
@Component({
  selector: 'app-modal-buscar-cliente',
  templateUrl: './modal-buscar-cliente.component.html',
  styleUrls: ['./modal-buscar-cliente.component.scss']
})
export class ModalBuscarClienteComponent implements OnInit {
  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator : MatPaginator

  @Input() cliente: any;
  @Input() TipoConsulta: String="";
  needRefresh: boolean = true;
  vmButtons: any = {};
  filter: any = {};
  paginate: any = {};
  lista_clientes: any[] = [];
  constructor(

    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private clienteSrv: ClienteServiceService,
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

      


      this.mensajeSpiner = 'Cargando Productos'
      let clientes =await this.clienteSrv.getClientes({filter: this.filter, paginate : this.paginate});
this.lista_clientes= clientes.data;
this.paginate.length = clientes.total;
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
    this.cliente = {
      id_cliente: item.id_cliente,

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
    this.CargarClientes();
  }
  changePage({pageIndex,pageSize})
  {
    Object.assign(this.paginate,{
      page:pageIndex+1,
      perPage:pageSize
      
    })
    this.CargarClientes();
  }
  async CargarClientes(){
    this.mensajeSpiner = 'Cargando Productos';
    this.lcargando.ctlSpinner(true)
    try {

   
     //alert(JSON.stringify(this.filter));
     
      let clientes =await this.clienteSrv.getClientes({filter: this.filter, paginate : this.paginate});
      this.lista_clientes= clientes.data;
      this.paginate.length = clientes.total;
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }


  }
  closeModal() {

    
    //this.commonVarSrv.seguiTicket.next(this.needRefresh);
    this.clienteSrv.clientes$.emit({refrescar:this.needRefresh,id:this.cliente.id_cliente,TipoConsulta:this.TipoConsulta})
    this.activeModal.dismiss();
  }


}
