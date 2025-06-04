import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from "../../../../../global";
import { BandejaService } from '../bandeja.service';


interface Bodega {
  id_bodega: number;
  codigo: string;
  nombre: string;
}
interface Bodegas {
  id_bodega_stock: number;
  fk_producto: number;
  fk_bodega: number;
  stock:number;
  bodega: Bodega;
}
interface Detalle {
  fk_producto: number,
  cantidad: number;
  codigoProducto: string;
  producto: string;
  precio: number;
  porcentaje_descuento: number;
  porcentaje_descuento_adicional: number;
  subtotal: number;
  subtotal_costo: number;
  descuento: number;
  descuento_adicional: number;
  iva_valor:number;
  total_iva:number;
  total:number;
  total_con_iva:number;
  codigo_impuesto_iva: number;
  bodegas: Bodegas,
  fk_bodega: number;
  stock: number;
  url_ficha_tecnica: string;
  class: string;
  descuento_maximo: number;
  descuento_minimo:number;
  descuento_maximo_adicional: number;
  descuento_minimo_adicional:number;
  revision_descuento: string;
  revisar_stock: boolean;
  costopromedio: number;
  rentabilidad: number;
  rentabilidad_2: number;
  porcentaje_rentabilidad: number;
  porcentaje_rentabilidad_2: number;
  
}
interface Cliente {
  cliente_id: number;
  cliente_nombre: string;
  cliente_ruc: string;
  cliente_direccion: string;
  cliente_telefono: number;
  cliente_email: string;
  cliente_contacto: string;
  cliente_relacionado: string;
  cliente_segmentacion: string;
  cliente_precio: string;
  cliente_desc_max: number;
  cliente_desc_min: number;
  credito: ClienteCredito;
  fk_cliente_contacto: number;
  cliente_plazo: string;
}
interface ClienteCredito {
 
  // forma_pago: string;
  estado: string;
  // plazo: string;
  cupo:number;
  valores_vencidos: number;
  nro_facturas_vencidas: number;
  saldo_disponible: number;
  credito_adicional: boolean;
}

interface Cotizacion {
  id_documento: number;
  tipo_documento: string;
  numero: string;
  secuencia: string;
  fecha: string;
  cliente: Cliente;
  detalles: Detalle[];
  estado: string;
  subtotal:number;
  subtotal_iva:number;
  subtotal_iva_cero:number;
  subtotal_no_objeto_iva:number;
  subtotal_excento_iva:number;
  descuento: number;
  valor_descuento_adicional: number;
  total: number;
  total_costo: number;
  total_rentabilidad: number;
  total_rentabilidad_2: number;
  porcentaje_iva: number;
  iva: number;
  total_con_impuesto: number;
  documento_p1: string;
  documento_p2: string;
  documento_p3: string;
  documento_p4: string;
  costo_transporte: any;
  direccion_entrega: string;
  tipo_fuente_solicitud:string;
  id_seguimiento_lead:number;
  id_ficha_lead:number;
  fecha_forma_pago: string;
  forma_pago: string;
  plazo_forma_pago:string;
  contacto_logistica:string;
  email_logistica:string;
  telefono_logistica:string;
  proyecto:string;
  nombre_proyecto:string;
  terminos_despacho:string;
  fk_cliente_informacion_entrega: number;
  descuento_adicional: boolean;
  status_descuento: string;
  status_cartera: string;
  status_credito: string; 
  status_stock: string;
  nota:string;
  negociacion: boolean;
  revision_stock: boolean;
  total_porcentaje_rentabilidad: number;
  total_porcentaje_rentabilidad_2: number;
}


@Component({
standalone: false,
  selector: 'app-tarea-form',
  templateUrl: './tarea-form.component.html',
  styleUrls: ['./tarea-form.component.scss']
})


export class TareaFormComponent implements OnInit {


  
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;
  dataUser: any = {};
  vmButtons: any = {};
  needRefresh: boolean = false;
  movimiento: any
  datos: any
  deshabilitar: boolean= false

  bankSelect: any = null;
  arrayBanks: any;

  
  arrayMes: any =
  [
    {id: 1,name: "Enero" },
    {id: 2, name: "Febrero"},
    {id: 3,name: "Marzo"},
    {id: 4,name: "Abril"},
    {id: 5,name: "Mayo"},
    {id: 6,name: "Junio"},
    {id: 7,name: "Julio"},
    {id: 8,name: "Agosto"},
    {id: 9,name: "Septiembre"},
    {id: 10,name: "Octubre"},
    {id: 11,name: "Noviembre"},
    {id: 12,name: "Diciembre"},
  ];

  tipo_movimientos: any =
  [
    {id: "D",name: "Débito"},
    {id: "C",name: "Crédito"},
  ];

  estado_movimiento: any = [
    {id: "A",name: "Activo"},
    {id: "I",name: "Inactivo"}
  ]

  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;

  @Input() Perfil: string="";

   tarea:any={};
  @Input() lista_estados:any={};

  @Input() lista_responsables: any[] = [];

  @Input() lista_tipo_tareas: any[] = [];
 tabs:Cotizacion[]=[];


  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private apiSrv: BandejaService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal) { }

  ngOnInit(): void {

    this.vmButtons = [
       {
           orig: "btnMovForm",
           paramAccion: "",
           boton: { icon: "fas fa-save", texto: " GUARDAR" },
           permiso: true,
           showtxt: true,
           showimg: true,
           showbadge: false,
           clase: "btn btn-success boton btn-sm",
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
       },
       {
        orig: "btnMovForm",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: " TEST" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
    }
     ];

   
       
    this.movimiento = {
      id_banco: 0,
      cuenta_banco: '',
      anio: null,
      mes: null,
      valor: 0,
      tipo_movimiento: 0,
      numero: '',
      detalle: '',
      estado: 0,
      id_usuario: 0,
      fecha: moment(new Date()).format('YYYY-MM-DD')
    }
    
    setTimeout(()=> {
     // this.getInfoBank()
      this.cargaInicial() 
      this.validaPermisos();
    }, 0);

    if(!this.isNew){
   //   this.getInfoBank()
      this.datos = JSON.parse(JSON.stringify(this.data));
      this.tarea = this.datos

     
      this.deshabilitar=true;
    }
    else
    {

      this.tarea = {
        perfil_responsable: '',
        nombre_tarea:'',
        
        estado : 'PENDIENTE',
        secuencia:'000',
        observacion :''
      };



    }
  }
  ChangeMesCierrePeriodosMov(evento: any) {
    this.movimiento.mes = evento;
    //this.movimiento.mes = (Number().format('MM'))).toString();
  } 

  validaPermisos = () => {
    this.mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
   // this.empresLogo = this.dataUser.logoEmpresa;
    
    let params = {
      codigo: myVarGlobals.fCrmProductos,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
        
           
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " GUARDAR":
        this.validarTarea();
        break;
      case " REGRESAR":
          this.closeModal();
          break;
          case " TEST":
            this.createCotizacion();
            break;
    }
  
  }

  createCotizacion() {
    const cotizacion: Cotizacion = {
      id_documento: 0,
      tipo_documento: "PROFORMA",
      numero: null,
      secuencia: null,
      fecha: "2024-07-22",
      valor_descuento_adicional:0,
      cliente: {
        cliente_id: 2337,
        cliente_nombre: "elizabeth salcedo",
        cliente_ruc: "0966844383001",
        cliente_direccion: "la florida, san felipe",
        cliente_telefono: 9877781231,
        cliente_email: "elizelluz@gmail.com",
        cliente_contacto: null,
        cliente_relacionado: "SI",
        cliente_segmentacion: "Distribuidor Pequeño",
        cliente_precio: "PRECIO2",
        cliente_desc_max: 5,
        cliente_desc_min: 1,
        fk_cliente_contacto: 13,
        cliente_plazo: null,
        credito: {
          estado: "A",
          cupo: 0,
          valores_vencidos: 0,
          nro_facturas_vencidas: 0,
          saldo_disponible: 0,
          credito_adicional: true,
        },
      },
      detalles: [
        {
          fk_producto: 531,
          cantidad: 4,
          codigoProducto: "907037",
          producto: "ANT GPS 4 AVEC CABLE 20M",
          precio: 191.48,
          costopromedio: 162.7575,
          porcentaje_descuento: 5,
          subtotal: 765.92,
          subtotal_costo: 651.03,
          descuento: 38.296,
          iva_valor: 0.15,
          total_iva: 109.14359999999998,
          total: 727.6239999999999,
          total_con_iva: 836.7675999999999,
          codigo_impuesto_iva: 2,
          porcentaje_descuento_adicional:0,
          descuento_adicional:0,
          descuento_maximo_adicional:0,
          descuento_minimo_adicional:0,
        
          bodegas: 
            {
              id_bodega_stock: 3181,
              fk_bodega: 9,
              fk_producto: 531,
              stock: 0.00,
              bodega: {
                codigo:'',
                id_bodega: 9,
                nombre: "Portoviejo",
              },
            }
          ,
          fk_bodega: 9,
          stock: 0.00,
          url_ficha_tecnica: null,
          class: "table-active",
          descuento_maximo: 5,
          descuento_minimo: 1,
          revision_descuento: "SI",
          revisar_stock: false,
          rentabilidad: 114.88999999999999,
          rentabilidad_2: 76.59399999999994,
          porcentaje_rentabilidad: 15.000261123877168,
          porcentaje_rentabilidad_2: 10.5265906567128,
        },
        {
          fk_producto: 532,
          cantidad: 2,
          codigoProducto: "907451",
          producto: "MIC SIGMA MOD IP MURAL 110/230",
          porcentaje_descuento_adicional:0,
          precio: 1395.35,
          costopromedio: 1186.0439,
          porcentaje_descuento: 5,
          subtotal: 2790.7,
          subtotal_costo: 2372.0878,
          descuento: 139.535,
          iva_valor: 0.15,
          total_iva: 397.67474999999996,
          total: 2651.165,
          total_con_iva: 3048.83975,
          codigo_impuesto_iva: 2,
          descuento_adicional:0,
          descuento_maximo_adicional:0,
          descuento_minimo_adicional:0,
          bodegas: 
            {
              id_bodega_stock: 3182,
              fk_bodega: 9,
              fk_producto: 532,
              stock: 0.00,
              bodega: {
                codigo:'',
                id_bodega: 9,
                nombre: "Portoviejo",
              },
            },
          
          fk_bodega: 9,
          stock: 0.00,
          url_ficha_tecnica: null,
          class: "table-active",
          descuento_maximo: 5,
          descuento_minimo: 1,
          revision_descuento: "SI",
          revisar_stock: false,
          rentabilidad: 418.61220000000003,
          rentabilidad_2: 279.0772000000002,
          porcentaje_rentabilidad: 15.000257999785003,
          porcentaje_rentabilidad_2: 10.526587368194743,
        },
      ],
      estado: "PROCESO",
      subtotal: 3556.62,
      subtotal_iva: 3556.62,
      subtotal_iva_cero: 0,
      subtotal_no_objeto_iva: 0,
      subtotal_excento_iva: 0,
      descuento: 177.831,
      total: 3378.7889999999998,
      total_costo: 3023.1178,
      total_rentabilidad: 533.5022,
      total_rentabilidad_2: 355.6712000000001,
      porcentaje_iva: 0,
      iva: 506.81834999999995,
      total_con_impuesto: 3885.60735,
      documento_p1: null,
      documento_p2: null,
      documento_p3: null,
      documento_p4: null,
      costo_transporte: 0,
      direccion_entrega: "guayaquil norte",
      tipo_fuente_solicitud: "CLIENTE",
      id_seguimiento_lead: 0,
      id_ficha_lead: 0,
      fecha_forma_pago: "2024-07-22",
      forma_pago: "Cheque",
      plazo_forma_pago: "90",
      contacto_logistica: "miguel perez",
      email_logistica: null,
      telefono_logistica: "0987556421",
      proyecto: "SI",
      nombre_proyecto: null,
      terminos_despacho: null,
      fk_cliente_informacion_entrega: 7,
      descuento_adicional: true,
      status_cartera: "REVISION_CARTERA",
      status_descuento: "REVISION_DESCUENTO",
      status_stock: null,
      status_credito: "REVISION_CREDITO",
      nota: null,
      negociacion: true,
      revision_stock: false,
      total_porcentaje_rentabilidad: 15.000258672559905,
      total_porcentaje_rentabilidad_2: 10.526588076378848,
    };
    
    this.tabs.push(cotizacion);
    console.log(this.tabs);
  
    //return { cotizacion, estado };
  }


  async cargaInicial() {
    try {
    /*  this.lcargando.ctlSpinner(true);
      const resPeriodos = null;
      //await this.apiSrv.()
      this.cmb_periodo = resPeriodos
      this.lcargando.ctlSpinner(false);*/
    } catch (err) {
      this.lcargando.ctlSpinner(false);
    }
  }



  bankSelected(event){
    if(event){
      this.movimiento.id_banco = event
      console.log(this.arrayBanks)
      console.log(event)
      let bancoFilter = this.arrayBanks.filter(e => e.id_banks == event)
      console.log(bancoFilter)
      this.movimiento.cuenta_banco = bancoFilter[0].cuenta_contable
    }

   
    console.log(this.movimiento.id_banco)
    console.log(this.movimiento.cuenta_banco)
  }

  async validarTarea() {
    if (this.isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para guardar Tareas");
    } else if (!this.isNew && this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar Tareas.", this.fTitle);
    } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {

        if (respuesta) {
          if (this.isNew) {
            this.guardarTarea();
          } else {
            this.editarTarea();
          }
        }
      });
    }
  }


  getTemplateForPerfil(): string {
    switch (this.Perfil) {
      case 'ASESOR':
        return 'bienvenidoAsesor';
      case 'SUPERVISOR':
        return 'bienvenidoSupervisor';
      case 'CREDITO':
        return 'bienvenidoCredito';
      case 'VENDEDOR':
        return 'bienvenidoVendedor';
      default:
        return 'perfilNoReconocido';
    }
  }


  
  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.tarea.perfil_responsable == '' ||
        this.tarea.perfil_responsable == undefined
      ) {
        this.toastr.info("Debe seleccionar un Periodo Responsable");
        flag = true;
      }
      else if (
        this.tarea.nombre_tarea == 0||
        this.tarea.nombre_tarea == undefined
      ) {
        this.toastr.info("Debe seleccionar el tipo de Tarea ");
        flag = true;
      }
      else if (
        this.tarea.estado == undefined
      ) {
        this.toastr.info("Debe seleccionar un Estado");
        flag = true;
      }
      else if (
        this.tarea.observacion == '' ||
        this.tarea.observacion== undefined
      ) {
        this.toastr.info("El campo Observación no puede ser vacío");
        flag = true;
      }
    

      !flag ? resolve(true) : resolve(false);
    })
  }

  guardarTarea(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear una nueva Tarea?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = "Guardando Tarea...";
        this.lcargando.ctlSpinner(true);
  
        this.apiSrv.guardarTarea({tarea:this.tarea}).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Tarea Guardada",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.closeModal();
                 // this.commonVarSrv.mesaAyuTicket.next(res['data']);
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
            console.log(error);
          }
        )
      }
    });
  }

  editarTarea(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea editar esta Tarea?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSpinner = "Editando Tarea...";
        this.lcargando.ctlSpinner(true);
   
        this.tarea.id_usuario= this.dataUser['id_usuario'];

        console.log(this.tarea);
     



  
        this.apiSrv.editarTarea({tarea:this.tarea}).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Tarea Guardada",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.closeModal();
                 // this.commonVarSrv.mesaAyuTicket.next(res['data']);
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
            console.log(error);
          }
        )
      }
    });
  }
  closeModal() {
    //this.commonVarSrv.seguiTicket.next(this.needRefresh);
    this.apiSrv.tareas$.emit(this.needRefresh)
    this.activeModal.dismiss();
  }

}
