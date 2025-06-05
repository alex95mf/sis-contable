import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { BandejaTrabajoService } from './bandeja-trabajo.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { GestionFormComponent } from './gestion-form/gestion-form.component';
import { SeguimientoFormComponent } from './seguimiento-form/seguimiento-form.component';


import * as myVarGlobals from 'src/app/global';

@Component({
standalone: false,
  selector: 'app-bandeja-trabajo',
  templateUrl: './bandeja-trabajo.component.html',
  styleUrls: ['./bandeja-trabajo.component.scss']
})
export class BandejaTrabajoComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Mesa de Ayuda (Bandeja Trabajo)";
  mensajeSpinner: string = "Cargando...";

  vmButtons = [];
  dataUser: any;
  permissions: any;
  categorias: any = [];
  subCategorias: any = [];
  ticket: any = {};
  estadoList:any = [];


  ticketsDt: any = [];

  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  estadoSelected = 0
  prioridadSelected = 0
  // estadoList = [
  //   {value: "P",label: "PENDIENTE"},
  //   {value: "G",label: "GESTION"},
  //   {value: "C",label: "CERRADO"},
  //   {value: "GA",label: "GARANTIA"}
  // ]

  prioridadList = [
    {value: "A",label: "ALTA"},
    {value: "M",label: "MEDIA"},
    {value: "B",label: "BAJA"},

  ]

  ticketSeleccionado: any
  motivoAprobacion: any
  estadoAprobacion: any
  @ViewChild('aprobarModal') aprobarModal!: TemplateRef<any>; // Referencia al modal



  constructor(private ticketSrv: BandejaTrabajoService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal) {

      this.commonVarSrv.seguiTicket.asObservable().subscribe(
        (res) => {
          //console.log(res);
          if (res) {
            this.cargarTicketsGlobal();
          }
        }
      )
      this.commonVarSrv.bandTrabTicket.asObservable().subscribe(
        (res) => {
          //console.log(res);
          if (res) {
            this.cargarTicketsGlobal();
          }
        }
      )

     }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsBandejaTrabajo",
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
        orig: "btnsBandejaTrabajo",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];
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
      estado: ['P','G','C','GA','PA','N'],
      prioridad: ['A','M','B']

    };

    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20, 50,100,200]
    };



    setTimeout(()=> {
      this.validaPermisos();
      this.cargarTicketsGlobal();
      this.getCatalogoCategoria();
      //this.getCatalogoSubCategoria(event);
    }, 0);

  }

  evaluateTicket(documento: any): string {
    const statusMessages: string[] = [];
    const today = new Date();
    const fechaDocumento = new Date(documento.fecha);
    // Si el estado es pendiente (P)
    if (documento.estado !== 'C') {
       // Suponiendo que documento.fecha es un string o Date válido
      const diffTime = Math.abs(today.getTime() - fechaDocumento.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Diferencia en días

      let status = 'Pendiente';

      if (diffDays <= 2) {
        // Hasta 2 días: verde
        statusMessages.push(`<span class="text-success">en ${diffDays} día(s)</span><br>`);
      } else if (diffDays <= 4) {
        // Hasta 4 días: amarillo
        statusMessages.push(`<span class="text-warning">en ${diffDays} día(s)</span><br>`);
      } else {
        // Más de 4 días: rojo
        statusMessages.push(`<span class="text-danger">en ${diffDays} día(s)</span><br>`);
      }
    }

    // Si el estado es cerrado (C)
    if (documento.estado === 'C') {

      const fechaCierre = new Date(documento.fecha_cierre); // Suponiendo que documento.fecha_cierre es un string o Date válido
      const diffTime = Math.abs(fechaDocumento.getTime() - fechaCierre.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Diferencia en días

      let status = 'Cerrado';

      if (diffDays <= 2) {
        // Hasta 2 días: verde
        statusMessages.push(`<span class="text-success">Atendido en ${diffDays} día(s)</span><br>`);
      } else if (diffDays <= 4) {
        // Hasta 4 días: amarillo
        statusMessages.push(`<span class="text-warning">Atendido en ${diffDays} día(s)</span><br>`);
      } else {
        // Más de 4 días: rojo
        statusMessages.push(`<span class="text-danger">Atendido en ${diffDays} día(s)</span><br>`);
      }
    }

    // Unir todos los elementos del array en una única cadena
    return statusMessages.join('');
  }
  metodoGlobal(event){
    switch (event.items.boton.texto) {
      case " CONSULTAR":
       this.cargarTicketsGlobal(true)
       break;

      case " LIMPIAR":
        this.limpiarFiltros();
      //  this.changeShowInactive(this.showInactive);
      break;
    }
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
        console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {
          this.cargarTicketsGlobal();
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
      params: "'MDA_CATEGORIA','MDA_SUBCATEGORIA','MDA_ESTADOS'",
    };
    /*(this as any).mensajeSpinner = "Buscando categoría...";
    this.lcargando.ctlSpinner(true);*/
    this.ticketSrv.getCatalogoCategoria(data).subscribe(

      (res) => {
        this.categorias = res["data"]['MDA_CATEGORIA'];
        this.subCategorias = res["data"]['MDA_SUBCATEGORIA'];
        this.estadoList = res["data"]['MDA_ESTADOS'];
        //this.lcargando.ctlSpinner(false);
        //console.log('catalogos '+res);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
  getCatalogoSubCategoria(evento: any) {
    // console.log('Aquiiii '+evento);
     this.subCategorias=0;
     let data = {
       grupo:evento
     };
     this.ticketSrv.getCatalogoSubCategoria(data).subscribe(

       (res) => {
         //console.log('AQQQQQQQQQ'+res["data"])
         this.subCategorias = res["data"];
         //console.log( this.subCategorias);
       },
       (error) => {
         this.lcargando.ctlSpinner(false);
         this.toastr.info(error.error.message);
       }
     );
   }

    asignarEstado(evt: any) {
      if (!evt) {
          // Si el evento es undefined (se borró el select), asignar todos los valores de estadoList
          this.filter.estado = this.estadoList.map(op => op.valor);
      } else {
          // Si se selecciona un estado, asignarlo normalmente
          this.filter.estado = [evt];
      }
    }

   asignarPrioridad(evt) {
    this.filter.prioridad = [evt]
   }

  cargarTicketsGlobal(flag: boolean = false) {
    (this as any).mensajeSpinner = "Cargando listado de Tickets...";
    this.lcargando.ctlSpinner(true);

    if (flag) this.paginate.page = 1

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    console.log(data)

    this.ticketSrv.getTicketsGlobal(data).subscribe(
      (res) => {
        //console.log(res);
        // this.ticketsDt = res['data']['data'];
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

  showGestionTicketForm(isNew:boolean, data?:any) {

   // console.log('DATOOSSSS TICKET '+data['usuario']['nombre']);
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Tickets.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Tickets.", this.fTitle);
    } else {


      const modalInvoice = this.modalSrv.open(GestionFormComponent, {
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

    }
  }

  showSeguiTicketForm(isNew:boolean, data?:any) {

    //console.log('DATOOSSSS TICKET '+data['usuario']['nombre']);
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Tickets.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Tickets.", this.fTitle);
    } else {

      const modalInvoice = this.modalSrv.open(SeguimientoFormComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general"
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRTSeguiTickets;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.ticket = this.ticket;

    }
  }

  limpiarFiltros() {
    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      observacion: "",
      categoria: 0,
      subcategoria: 0,
      estado: ['P','G','C','GA','PA','N'],
      prioridad: ['A','M','B']
    }
    this.estadoSelected = 0
    this.prioridadSelected = 0

  }
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarTicketsGlobal();
  }

  deshabilitarBotonAprobacion(ticket: any): boolean {
    let rolUsuarioActual = this.dataUser.id_rol;

    const aprobacionesConMiRol = ticket.aprobaciones.filter(aprob =>
      aprob.id_rol === rolUsuarioActual && aprob.estado_aprobacion === 'PENDIENTE'
    );

    if (aprobacionesConMiRol.length === 0) {
      return true;
    }
    // 5. Para cada aprobación con mi rol, validar orden
    for (const aprobacion of aprobacionesConMiRol) {
      // Si es orden 1, no se deshabilita
      if (aprobacion.orden_aprobacion === 1) {
        return false;
      }

      // Para órdenes mayores, verificar aprobación anterior
      const aprobacionAnterior = ticket.aprobaciones.find(a =>
        a.orden_aprobacion === aprobacion.orden_aprobacion - 1
      );

      // Si la anterior no existe o no está aprobada, deshabilitar
      if (!aprobacionAnterior || aprobacionAnterior.estado_aprobacion !== 'APROBADO') {
        return true;
      }
    }

    // 6. Si pasó todas las validaciones, no deshabilitar
    return false;
  }

  openAprobarModal(dt: any) {
    this.ticketSeleccionado = dt;
    this.motivoAprobacion = ''; // Resetear el motivo al abrir el modal
    this.modalSrv.open(this.aprobarModal);
    console.log(this.ticketSeleccionado)
  }

  validarAprobacion(modal: any) {
    if (!this.estadoAprobacion || this.estadoAprobacion.trim() === '0') {
      this.toastr.error('Debe de seleccionar el estado de la aprobación del ticket.', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
      return; // Detiene la ejecución si no hay motivo
    }
    if (!this.motivoAprobacion || this.motivoAprobacion.trim() === '') {
      this.toastr.error('Debe ingresar una observación de la aprobación/rechazo del ticket.', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
      return; // Detiene la ejecución si no hay motivo
    }

    this.confirmarAprobacion();
    modal.close();
  }

  // Lógica final para retornar el trámite
  private confirmarAprobacion() {
    const aprobacionActiva = this.ticketSeleccionado.aprobaciones.find(ap =>
      ap.id_rol == this.dataUser.id_rol &&
      ap.estado_aprobacion === 'PENDIENTE' // Asegurar que esté pendiente
    );

    if (!aprobacionActiva) {
      console.error('No hay aprobaciones pendientes con tu rol');
      return;
    }

    let data = {
      id_ticket: this.ticketSeleccionado.id_ticket,
      estado_aprobacion: this.estadoAprobacion,
      motivo_aprobacion: this.motivoAprobacion,
      id_aprobacion_ticket: aprobacionActiva.id_aprobacion_ticket
    }

    console.log(data)
    console.log(aprobacionActiva)
    this.lcargando.ctlSpinner(true);
    this.ticketSrv.aprobarTicket({data}).subscribe(

      (res) => {

        this.lcargando.ctlSpinner(false);
        this.cargarTicketsGlobal();
        if(this.estadoAprobacion == 'APROBADO'){
          this.toastr.success('Ticket aprobado correctamente.', 'Éxito');
        }
        if(this.estadoAprobacion == 'NEGADO'){
          this.toastr.success('Ticket negado.', 'Éxito');
        }

        this.estadoAprobacion = '0'

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
       // console.log(error)
      }
    );

  }

  puedeGestionarTicket(ticket: any): boolean {
    // Validación básica de estados
    if (['C', 'PA', 'N'].includes(ticket.estado)) {
        return false;
    }

    // Si no tiene aprobaciones, puede gestionar
    if (!ticket.aprobaciones?.length) {
        return true;
    }

    // Si tiene aprobaciones, solo puede gestionar si es de mesa de ayuda
    return this.dataUser?.mesa_ayuda === 'SI';
  }


}
