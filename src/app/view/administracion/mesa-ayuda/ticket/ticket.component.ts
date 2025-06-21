import { Component, OnInit, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { TicketService } from './ticket.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { TicketFormComponent } from './ticket-form/ticket-form.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from 'src/app/global';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
//import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';


@Component({
standalone: false,
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Mesa de Ayuda (Tickets)";
  mensajeSpinner: string = "Cargando...";
  vmButtons = [];
  dataUser: any;
  permissions: any;
  categorias: any = [];
  subCategorias: any = [];
  organigrama: any = [];

  ticket: any = {};

  /*titulosDisabled = true;
  proveedorActive: any = {
    razon_social: ""
  };*/

  ticketsDt: any = [];
  estadoSelected = 0
  prioridadSelected = 0;
  estadoList = [
    {value: "P",label: "PENDIENTE"},
    {value: "PA",label: "PENDIENTE APROBACION"},
    {value: "G",label: "GESTION"},
    {value: "C",label: "CERRADO"},
    {value: "GA",label: "GARANTIA"}

  ]
  prioridadList = [
    {value: "A",label: "ALTA"},
    {value: "M",label: "MEDIA"},
    {value: "B",label: "BAJA"},
  ]

  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;
  verifyRestore = false;

  numero_max_reincidencia_ticket: any
  reapertura_ticket: any



  constructor(private ticketSrv: TicketService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal) {


      this.commonVarSrv.mesaAyuTicket.asObservable().subscribe(
        (res) => {
          //console.log(res);
          if (res) {
            this.cargarTickets();
          }
        }
      );

     /* this.commonVarSrv.selectProveedorCustom.asObservable().subscribe(
        (res) => {
          console.log(res);
          // this.cargarDatosModal(res);
          this.proveedorActive = res;
          this.titulosDisabled = false;
          this.vmButtons[3].habilitar = false;
        }
      );*/
     }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsTicket",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },

      {
        orig: "btnsTicket",
        paramAccion: "",
        boton: { icon: "fa fa-search", texto: " CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsTicket",
        paramAccion: "",
        boton: { icon: "fa fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
     /* {
        orig: "btnsTicket",
        paramAccion: "",
        boton: { icon: "far fa-square", texto: " MOSTRAR INACTIVOS" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      }*/
    ];



    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20, 50,100,200]
    };

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      id_ticket: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      observacion: "",
      categoria: 0,
      subcategoria: 0,
      estado: ['P','PA','N','G','C','GA'],
      prioridad: ['A','M','B']

    };


    setTimeout(()=> {
      this.validaPermisos();
      this.cargarTickets();
      this.getCatalogoCategoria();
      this.cargarParametros();
      this.getOrganigrama();
      //this.getCatalogoSubCategoria(event);
    }, 0);

  }

  validaPermisos() {
    (this as any).mensajeSpinner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRTTickets,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        //console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {
          this.cargarTickets();
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
  getCatalogoCategoria() {
    let data = {
      params: "'MDA_CATEGORIA','MDA_SUBCATEGORIA'",
    };
    (this as any).mensajeSpinner = "Buscando categoría...";
    this.lcargando.ctlSpinner(true);
    this.ticketSrv.getCatalogoCategoria(data).subscribe(

      (res) => {
        this.categorias = res["data"]['MDA_CATEGORIA'];
        this.subCategorias = res["data"]['MDA_SUBCATEGORIA'];
        this.lcargando.ctlSpinner(false);
        //console.log('catalogos '+res);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
  getCatalogoSubCategoria(evento: any) {
     this.subCategorias=0;
     let data = {
       grupo:evento
     };
     this.ticketSrv.getCatalogoSubCategoria(data).subscribe(

       (res) => {
         this.subCategorias = res["data"];
       },
       (error) => {
         this.lcargando.ctlSpinner(false);
         this.toastr.info(error.error.message);
       }
     );
   }

   cargarParametros() {

    let data = {
      id_empresa: this.dataUser.id_empresa
    }

    this.ticketSrv.getParametrosGenerales(data).subscribe(
      (res) => {
        if (res['data']) {
          this.numero_max_reincidencia_ticket = res['data']['parametros_generales']['numero_max_reincidencia_ticket'];
          this.reapertura_ticket = res['data']['parametros_generales']['reaperturar_ticket'];
        }
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    )
  }



  asignarEstado(evt: any) {
    if (!evt) {
        // Si el evento es undefined (se borró el select), asignar todos los valores de estadoList
        this.filter.estado = this.estadoList.map(op => op.value);
    } else {
        // Si se selecciona un estado, asignarlo normalmente
        this.filter.estado = [evt];
    }
  }

   asignarPrioridad(evt){
    this.filter.prioridad = [evt]
   }

  cargarTickets(flag: boolean = false) {
    (this as any).mensajeSpinner = "Cargando listado de Tickets...";
    this.lcargando.ctlSpinner(true);

    if (flag) this.paginate.page = 1;

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.ticketSrv.getTicketsByUsuario(data).subscribe(
      (res) => {
        console.log(res['data']['data'])
        this.ticketsDt = res['data']['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.ticketsDt = res['data']['data'];
        } else {
          this.ticketsDt = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }
  metodoGlobal(event){
    switch (event.items.boton.texto) {
      case " NUEVO":
       this.showTicketForm(true, {});
       break;
      case " CONSULTAR":
        this.cargarTickets(true);
      //  this.changeShowInactive(this.showInactive);
      break;
      case " LIMPIAR":
        this.limpiarFiltros();
      //  this.changeShowInactive(this.showInactive);
      break;
    }
  }

  showTicketForm(isNew:boolean, data?:any) {

    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Tickets.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Tickets.", this.fTitle);
    } else {
      const modalInvoice = this.modalSrv.open(TicketFormComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRTTickets;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.ticket = this.ticket;
      modalInvoice.componentInstance.numero_max_reincidencia_ticket = this.numero_max_reincidencia_ticket;
      modalInvoice.componentInstance.reapertura_ticket = this.reapertura_ticket;

    }
  }
 /* expandListProveedores() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    } else {
      const modalInvoice = this.modalSrv.open(ModalProveedoresComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      //modalInvoice.componentInstance.validacion = 8;
    }
  }*/



  limpiarFiltros() {
    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      observacion: "",
      categoria: 0,
      subcategoria: 0,
      estado: ['P','PA','N','G','C',]
    }
    this.estadoSelected = 0;
    this.prioridadSelected = 0;

  }
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarTickets();
  }

  getOrganigrama() {
    let data = {
      id_empresa: this.dataUser.id_empresa
    };

    (this as any).mensajeSpinner = "Buscando organigrama...";
    this.lcargando.ctlSpinner(true);
    this.ticketSrv.obtenerOrganigrama(data).subscribe(

      (res) => {
        console.log(res)
        this.organigrama=res['data']['organigrama']
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  showCategoryForm(isCategory:boolean) {
    console.log("Abre formulario de categoria")
    const modalInvoice = this.modalSrv.open(CategoriaFormComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.isCategory = isCategory;
    modalInvoice.componentInstance.categorias = this.categorias;
    modalInvoice.componentInstance.subCategorias = this.subCategorias;
    modalInvoice.componentInstance.organigrama = this.organigrama;
  }

}





