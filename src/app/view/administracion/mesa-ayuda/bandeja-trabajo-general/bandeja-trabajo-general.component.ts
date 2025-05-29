import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { BandejaTrabajoService } from '../bandeja-trabajo/bandeja-trabajo.service';
import { TramitesService } from '../../tramites/tramites.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { SeguimientoFormComponent } from '../bandeja-trabajo/seguimiento-form/seguimiento-form.component'; 
import { ReasignarUsuarioComponent } from './reasignar-usuario/reasignar-usuario.component';
import { ModalDepartamentosComponent } from 'src/app/config/custom/modal-departamentos/modal-departamentos.component';

import * as myVarGlobals from 'src/app/global';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
standalone: false,
  selector: 'app-bandeja-trabajo-general',
  templateUrl: './bandeja-trabajo-general.component.html',
  styleUrls: ['./bandeja-trabajo-general.component.scss']
})
export class BandejaTrabajoGeneralComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Mesa de Ayuda (Bandeja de Trabajo General)";
  msgSpinner: string;
  vmButtons = [];
  dataUser: any;
  permissions: any;
  categorias: any = {};
  subCategorias: any = {};
  ticket: any = {};
  

  ticketsDt: any = [];
  usuariospre: any = [];
  estadoList:any = [];
  
  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  excelData: any [];
  exportList: any[];

  departamentoSelect: any = {
    dep_nombre:""
  };

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

  reasignacion_ticket: any
  perfiles_reasignacion: any[]

  ticketSeleccionado: any
  motivoAprobacion: any
  estadoAprobacion: any
   @ViewChild('aprobarModal') aprobarModal!: TemplateRef<any>; // Referencia al modal


  constructor(private ticketSrv: BandejaTrabajoService,
    private tramiteSer: TramitesService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
    private excelService: ExcelService
    ) {

      this.commonVarSrv.seguiTicket.asObservable().subscribe(
        (res) => {
         // console.log(res);
          if (res) {
            this.cargarTicketsGlobal();
          }
        }
      );
      this.commonVarSrv.departamentoSelect.asObservable().subscribe(
        (res)=>{
          this.departamentoSelect = res;
          this.filter.dep_nombre = res['dep_nombre'];
  
          //console.log(this.departamentoSelect)
        }
      )
     
     }

  ngOnInit(): void {
    this.vmButtons = [
      { 
        orig: "btnsBandejaTrabajo", 
        paramAccion: "2", 
        boton: { icon: "fa fa-search", texto: "CONSULTAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-primary boton btn-sm", 
        habilitar: false
      },
      { 
        orig: "btnsBandejaTrabajo", 
        paramAccion: "2", 
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-success boton btn-sm", 
        habilitar: false
      },


      { 
        orig: "btnsBandejaTrabajo", 
        paramAccion: "2", 
        boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-danger boton btn-sm", 
        habilitar: false
      },
      /* {
         orig: "btnsBandejaTrabajo",
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
         boton: { icon: "far fa-square", texto: " MOSTRAR INACTIVOS" },
         permiso: true,
         showtxt: true,
         showimg: true,
         showbadge: false,
         clase: "btn btn-warning boton btn-sm",
         habilitar: false,
       }*/
     ];

   
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.today = new Date();
    this.firstday = moment(this.today).startOf('month').format('YYYY-MM-DD')
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    //this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 

    this.filter = {
      id_ticket: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      observacion: "",
      categoria: 0,
      subcategoria: 0,
      estado: ['P','PA','N','G','C'],
      prioridad: ['A','M','B'],
      nombre:"",
      dep_nombre:""
    
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
      this.cargarParametros();
     // this.getCatalogoSubCategoria(event);
    }, 0);
    setTimeout(() => {this.cargarUsuarios()}, 50)

  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "EXCEL":
        this.btnExportar();
        break;
        case "CONSULTAR":
          this.cargarTicketsGlobal(true);
          break;
          case "LIMPIAR":
            this.limpiarFiltros();
            break;
    }
  }

  validaPermisos() {
    this.mensajeSpinner = "Verificando permisos del usuario...";
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
    /*this.mensajeSppiner = "Buscando categoría...";
    this.lcargando.ctlSpinner(true);*/
    this.ticketSrv.getCatalogoCategoria(data).subscribe(
     
      (res) => {
        console.log(res)
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

   btnExportar() {
    this.mensajeSpinner = "Generando Archivo Excel...";
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
      }
    }
    this.ticketSrv.getTicketsExport(data).subscribe(
      (res) => {
        if (res["status"] == 1) {
          this.lcargando.ctlSpinner(false);
          console.log(res);
        this.exportList = res['data']
        this.excelData = [];
        console.log(this.exportList);
        if (this.permissions.exportar == "0") {
          this.toastr.info("Usuario no tiene permiso para exportar");
        } else {
          Object.keys(this.exportList).forEach(key => {
            let filter_values = {};
            filter_values['ID'] = this.exportList[key].id_ticket;
            filter_values['Fecha'] = (this.exportList[key].fecha.split(" ")[0] != undefined) ? this.exportList[key].fecha.split(" ")[0] : "";
            filter_values['Usuario Creador'] = (this.exportList[key].usuario.nombre != null) ? this.exportList[key].usuario.nombre.trim() : "";
            filter_values['Observación'] = (this.exportList[key].observacion != null) ? this.exportList[key].observacion.trim() : "";
            filter_values['Categoría'] = (this.exportList[key].catalogo_categoria.descripcion != null) ? this.exportList[key].catalogo_categoria.descripcion.trim() : "";
            filter_values['Sub Categoría'] = (this.exportList[key].catalogo_sub_categoria.descripcion != undefined) ? this.exportList[key].catalogo_sub_categoria.descripcion : "";
            filter_values['Estado'] = (this.exportList[key].estado != undefined) ? (this.exportList[key].estado == 'P' ? 'Pendiente' : this.exportList[key].estado == 'G' ? 'Gestión' : this.exportList[key].estado == 'C' ? 'Cerrado' : this.exportList[key].estado == 'GA' ? 'Garantía' : this.exportList[key].estado == 'PA' ? 'Pendiente de Aprobación' : this.exportList[key].estado == 'N' && 'Negado') : "";
            filter_values['Prioridad'] = (this.exportList[key].prioridad != undefined) ? (this.exportList[key].prioridad == 'M' ? 'Media' : this.exportList[key].prioridad == 'A' ? 'Alta' :'Baja' ) : "";
            filter_values['Usuario de Gestión'] = (this.exportList[key].usuario_asignado != undefined || this.exportList[key].usuario_asignado != null) ? this.exportList[key].usuario_asignado.nombre.trim() : "Sin usuario asignado";
            this.excelData.push(filter_values);
          })
          this.exportAsXLSX();
        }
         
        } else {
          this.lcargando.ctlSpinner(false);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }

    )
    
  }

  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Mesa de ayuda-Tickets');
  }

   cargarUsuarios(){
   // console.log('ejecuto');
    this.mensajeSpinner = "Cargando lista de Usuarios...";
    this.lcargando.ctlSpinner(true);
    this.tramiteSer.getUsuarios({}).subscribe(
      (res)=>{
       // console.log(res['data']);
        res['data'].map((data)=>{
          data['id_flujo_usuarios'] =  0
        })
        
        this.usuariospre = res['data']
        // console.log('Usuarios '+this.usuariospre);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

  cargarTicketsGlobal(flag: boolean = false) {
    this.mensajeSpinner = "Cargando listado de Tickets...";
    this.lcargando.ctlSpinner(true);

    if (flag) this.paginate.page = 1 
    
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    
    this.ticketSrv.getTicketsGlobalGeneral(data).subscribe(
      (res) => {
       // console.log(res);
        //this.ticketsDt = res['data']['data'];
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

    //console.log('Aquuiii tickets  '+this.ticketsDt);
  }

  cargarParametros() {
    let data = {
      id_empresa: this.dataUser.id_empresa
    }

    let dataPerfilReasignacion = {
      id_empresa: this.dataUser.id_empresa,
      tipo_accion: "PERFIL_REASIGNACION"
    }

    this.ticketSrv.getParametrosGenerales(data).subscribe(
      (res) => {
        if (res['data']) {
          console.log(res['data'])
          this.reasignacion_ticket = res['data']['parametros_generales']['reaperturar_ticket'];
        }
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    )

    this.ticketSrv.getAccionesConfiguracion(dataPerfilReasignacion).subscribe(
      (res) => {
        if (res['data']) {
          console.log(res['data'])
          this.perfiles_reasignacion = res['data'];
        }
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    )

    //console.log('Aquuiii tickets  '+this.ticketsDt);
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
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRTSeguiTickets;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.ticket = this.ticket;
      modalInvoice.componentInstance.mostrarEliminar = false;
    
  
      
    }
  }
  reasignarTicket(data){
    if (this.permissions.guardar == "0"){
      this.toastr.warning("No tiene permisos para reasignar Tickets.", this.fTitle);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea reasignar este Ticket?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.mensajeSpinner = "Reasignando Ticket..."
          this.lcargando.ctlSpinner(true);
          this.ticketSrv.reasignarTicket(data).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.lcargando.ctlSpinner(false);
                this.cargarTicketsGlobal();
                Swal.fire({
                  icon: "success",
                  title: "Ticket Reasignado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
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
  }

  anularTicket(id){
    if (this.permissions.eliminar == "0"){
      this.toastr.warning("No tiene permisos para anular Tickets.", this.fTitle);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea anular este Ticket?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.mensajeSpinner = "Anulando Ticket..."
          this.lcargando.ctlSpinner(true);
          this.ticketSrv.anularTicket(id).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.lcargando.ctlSpinner(false);
                this.cargarTicketsGlobal();
                Swal.fire({
                  icon: "success",
                  title: "Ticket Anulado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
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
  }

  showReasignarUsusario(isNew:boolean, data?:any) {
    
    //console.log('DATOOSSSS TICKET '+data['usuario']['nombre']);
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para reasignar Usuario para la gestión de Tickets.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para reasignar Usuario para la gestión de Tickets.", this.fTitle);
    } else {
       
      const modalInvoice = this.modalSrv.open(ReasignarUsuarioComponent, {
        size: "md",
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

  modalDepartamentos(){
    let modal = this.modalSrv.open(ModalDepartamentosComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }
  
  limpiarFiltros() {
    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      observacion: "",
      categoria: 0,
      subcategoria: 0,
      estado: ['P','PA','N','G','C'],
      prioridad: ['A','M','B'],
      nombre:"",
      dep_nombre:"",
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

  deshabilitarBotonReasignacion(ticket: any): boolean {
    let tienePermiso = this.perfiles_reasignacion.some(perfil => perfil.perfil === this.dataUser.rol.nombre_rol);
    
    if(ticket.estado !== 'C' && ticket.estado !== 'PA' && this.reasignacion_ticket === 'S'){
      return !tienePermiso
    }else{
      return true
    }
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
        
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
       // console.log(error)
      }
    );
    
  }

  


}
