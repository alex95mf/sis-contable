import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PrestamoService } from './prestamo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInvoicesProductComponent } from 'src/app/view/comercializacion/facturacion/invoice-sales/modal-invoices-product/modal-invoices-product.component';
import { DiferedComponent } from 'src/app/view/comercializacion/facturacion/invoice-sales/difered/difered.component';
import { GlobalTableComponent } from '../../../commons/modals/global-table/global-table.component';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { BusquedaPrestamoComponent } from './busqueda-prestamo/busqueda-prestamo.component';
import { BusquedaPrestamoSalidasComponent } from './busqueda-prestamo-salidas/busqueda-prestamo-salidas.component';
import { ListBusquedaPrestamoComponent } from './list-busqueda-prestamo/list-busqueda-prestamo.component';
import { ModalDepartamentosComponent } from 'src/app/config/custom/modal-departamentos/modal-departamentos.component';
import { EncargadoTrasladoComponent } from '../traslado/encargado-traslado/encargado-traslado.component';
import { ModalGruposComponent } from '../../configuracion/producto/modal-grupos/modal-grupos.component';
import { ModalVistaFotosComponent } from '../traslado/modal-vista-fotos/modal-vista-fotos.component';
import { DetallesProductoComponent } from '../traslado/detalles-producto/detalles-producto.component';
import { ModalContribuyentesComponent } from "src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component";
import { ModalRegContribuyenteComponent } from './modal-reg-contribuyente/modal-reg-contribuyente.component';
import { environment } from 'src/environments/environment';


@Component({
standalone: false,
  selector: 'app-prestamo',
  templateUrl: './prestamo.component.html',
  styleUrls: ['./prestamo.component.scss']
})
export class PrestamoComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle = "Préstamo de bienes";
  permissions: any;
  processing: boolean = false;
  verifyRestore = false;
  toDatePicker: Date = new Date();
  dateConverter: any;
  dataUser: any;
  flagBtnDired: any = false;
  arrayCustomer: any = [];
  arrayCustomerAux: any;
  isNew: boolean = true;
  ///customer: any = { asesor: { nombre: null }, customerSelect: 0 };
  customer: any = { asesor: { nombre: null }, customerSelect: 0, group: { name: null } };
  dataBuy: any = { activoFijo: false, idTipDocSelect: 0, tipoPagoSelect: 0, formaPagoSelect: 0 };
  valueLethers: any = "0 Dólares con 0 centavos";
  ivaConverter: any;
  validChange: any = false;
  dataDifered: any = null;
  customerSelect: any = 0;
  latestStatus: any;
  prefict: any;
  quote: any;
  num_aut: any = "N/A";
  num_fac: any = "N/A";
  num_serial: any;
  num_doc: any;
  cupo_credito: any;
  num_documento:any;
  bodega: any;
  claseBien: any;
  arrayBodega: Array < any > = [];


  UserSelect: any;
  filtClient: any;
  moduloUser: any = "";

  fecha:any;
  num_point_emision: any;
  validate_cupo: any = false;
  disabled: any = false;

  today: any;
  id_prestamo: any
  fotos: any = [];
  fotosEliminar: any = [];
  disabledCampos: boolean = true;

  /*actions*/
  // actions: any = { dComponet: false };

  actions: any = { btnNuevo: false,
    btnGuardar: false,
    btnEnviar: false,
    btncancelar: false,
    btnDescargar: false,
    dComponet: false,
    view: false };

    disabledGrupo: any = true;
    disabledSubGrupo: any = true;
    agregaProduct: any = true;

    disabledCantidad: any = false;


    prestamo = {
      tipo:null,
      fecha:moment(new Date()).format('YYYY-MM-DD'),
      num_doc:null,
      responsable:null,
      id_responsable:null,
      nombre_departamento_responsable:null,
      nombre_cargo_responsable:null,
      recibido:null,
      id_recibido:null,
      nombre_departamento_recibido:null,
      nombre_cargo_recibido:null,
      recibido_por:null,
      tipo_persona:null,
      zona:0,
      codigo_sector:0,
      fk_id_contribuyente:null,
      doc_salida:null,
      observaciones:null,
      estado:null
    }

    estadoList = [

      {value: "B",label: "Bueno"},
      {value: "R",label: "Regular"},
      {value: "M",label: "Mal estado"}

    ]
    tipoList = [
      {value: "S",label: "Salida"},
      {value: "D",label: "Devolución"},
    ]
    tipoPersonasList = [
      {value: "E",label: "Empleado"},
      {value: "C",label: "Contribuyente"},
      {value: "N",label: "No Contribuyente"}
    ]

  /*data totales*/
  dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };

  /*detalle compra*/
 // dataProducto = [{ nombre: null, codigoProducto: null, marca: null, stock: 0.00, cantidad_reservada: 0.00, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }];
 dataProducto : Array < any > = [];
 arrayProductos: any;

  /*ver cotizaciones*/
  arrayQuote: any;
  arraDetQuote: any = null;
  dataProductoAux: any = [];
  vmButtons: any;

  /*Maximo de facturas por cliente*/
  maxInvoicesPend: any = 0;
  maxInvoicesXCliente: any = 0;
  textNotification: any = "";
  textNotificationSend = "Notificación: ";

  departamentoSelect: any = {
    dep_nombre:""
  };
  catalog: any = []
  catalog_filter:any = []

  zona_filter:any = []
  sector_filter:any = []



  grupo = {
    codigo_grupo_producto: null,
    descripcion: null,
    codigo_cuenta_contable: null,
    codigo_presupuesto: null,
    estado: null,
    descripcion_cuenta: null,
    descripcion_presupuesto: null,
    tipo_bien: null
  }
  claseSelect: any = 0;
  listaProductos: any = []

  subgrupo: any = [];
  listaProducto : any = {
  fk_grupo :0,
  fk_subgrupo:0,
  nombre: "",
  codigoBienes:"",
  UDMCompra:"",
  stock:0,
  codigoProducto:"",
  costo: 0
}
id_egreso_bodega: any;

estado_producto: any;
fileList: FileList;
disabledCampo: boolean = false;

tipoEventosList: any = [];
zonaList: any = [];
sectorList: any = [];

evento: any = {
  id_cal_eventos: 0,
  titulo: '',
  fecha_inicio: moment(new Date()).format('YYYY-MM-DD'),
  hora_inicio: moment(new Date()).format('HH:00:00'),
  fecha_fin: moment(new Date()).format('YYYY-MM-DD'),
  hora_fin: moment(new Date()).format('HH:00:00'),
  descripcion: '',
  tipo_evento: 0,
  id_origin: 0
};

contribuyenteActive: any = {
  razon_social: ""
};
cantidad_bienes: any = 0
bienes: any = [];
disabledDevolucion: boolean = false;

fecha_salida: undefined;
doc_salida: "";
selectedReporte: any = undefined;
eventoNombre: any;
eventoAux: any = [];
zonaAux: any = [];
sectorAux: any = [];
zonaNombre: any;
sectorNombre: any;

  constructor(
    private commonServices: CommonService,
    private commonVarServices: CommonVarService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private invService: PrestamoService,
    private socket: Socket
  ) {
    this.commonVarServices.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })
    // this.commonVarServices.selectSubGrupo.asObservable().subscribe(
    //   (res) => {
    //     this.subgrupo = res
    //     console.log(this.subgrupo)
    //     this.listaProducto.fk_subgrupo = this.subgrupo.id_subgrupo_producto
    //     this.lcargando.ctlSpinner(false)
    //     this.disabled=false;
    //     this.agregaProduct=false;

    //   }
    // )
    this.commonVarServices.selectContribuyenteCustom.asObservable().subscribe(
      (res) => {
        console.log(res);

        this.contribuyenteActive = res;
      });



    this.commonVarServices.encargadoSelect.asObservable().subscribe(
      (res)=>{
        console.log(res);
        this.dataProducto= [];
        this.UserSelect = res['dt']['emp_full_nombre'];
         if(res['tipo']==4){
          this.prestamo.id_responsable= res['responsable']['id_empleado'];
          this.prestamo.responsable = res['responsable']['emp_full_nombre'];
          this.prestamo.nombre_departamento_responsable = res['responsable']['departamento']['dep_nombre'];
          this.prestamo.nombre_cargo_responsable = res['responsable']['cargos']['car_nombre'];
        }else if(res['tipo']==1){
            this.prestamo.id_recibido= res['recibido']['id_empleado'];
            this.prestamo.recibido = res['recibido']['emp_full_nombre'];
            this.prestamo.nombre_departamento_recibido = res['recibido']['departamento']['dep_nombre'];
            this.prestamo.nombre_cargo_recibido = res['recibido']['cargos']['car_nombre'];
        }

        this.filtClient = {
          id_personal: res['dt']['id_empleado'],
          nombres: res['dt']['emp_full_nombre']

        }
        //this.moduloUser = res['cargos']['car_nombre']

      }
    )

    this.commonVarServices.setListProductInvoice.asObservable().subscribe(res => {

      console.log(res)
      this.dataProducto = [];
      res.forEach(element => {
        if (element.action) {
          element['price'] = parseFloat(element['price']).toFixed(4);
          element['totalAux'] = parseFloat('0.00').toFixed(4);
          element['quantity'] = null;
          this.dataProducto.push(element);
        }
      });
      res.forEach(element => {
        if (!element.action) {
          element['price'] = parseFloat(element['price']).toFixed(4);
          element['totalAux'] = parseFloat('0.00').toFixed(4);
          element['quantity'] = null;
          this.dataProducto.push(element);
        }
      });
      this.dataProducto = this.dataProducto.sort();
      setTimeout(() => {
        document.getElementById("quantyId").focus();
      }, 200);
    })

    this.commonVarServices.listenDiferedInvoice.asObservable().subscribe(res => {
      this.dataDifered = res;
    })

    this.commonVarServices.listenQuotes.asObservable().subscribe(res => {
      this.lcargando.ctlSpinner(true);
      this.quote = res;
      this.actions.dComponet = true;
      let custom = this.arrayCustomer.filter(e => e.id_cliente == res.fk_client)[0];
      this.customerSelect = custom.id_cliente;
      this.getCustomer(custom.id_cliente);
      this.invService.getDetQuotes({ id: res.id }).subscribe(result => {
        this.dataTotales.subTotalPagado = parseFloat(res.subtotal);
        this.dataTotales.ivaPagado = parseFloat(res.iva);
        this.dataTotales.totalPagado = parseFloat(res.total);
        this.dataTotales.ivaBase = parseFloat(res.iva_base);
        this.dataTotales.iva0 = parseFloat(res.iva_cero);
        this.valueLethers = this.commonVarServices.NumeroALetras(this.dataTotales.totalPagado, false);
        this.dataProducto = [];
        result['data'].forEach(element => {
          if (element.action) {
            element['price'] = parseFloat(element['price']).toFixed(4);
            element['quantity'] = parseFloat(element['quantity']).toFixed(4);
            element['totalItems'] = parseFloat(element['totalItems']).toFixed(4);
            element['totalAux'] = parseFloat(element['totalItems']).toFixed(4);
            this.dataProducto.push(element);
          }
        });
        result['data'].forEach(element => {
          if (!element.action) {
            element['price'] = parseFloat(element['price']).toFixed(4);
            element['quantity'] = parseFloat(element['quantity']).toFixed(4);
            element['totalItems'] = parseFloat(element['totalItems']).toFixed(4);
            element['totalAux'] = parseFloat(element['totalItems']).toFixed(4);
            this.dataProducto.push(element);
          }
        });
        this.dataProducto = this.dataProducto.sort();

        console.log(result['data'])

        this.lcargando.ctlSpinner(false);
      })
    })

    this.commonVarServices.PrestamoBienes.asObservable().subscribe(
      (res) => {
       console.log(res)

        this.disabledCampos = true;
        this.disabledCampo = true;
        this.disabled=true;
        this.isNew = false;
        //this.num_doc= res.num_doc;
        this.id_prestamo= res.id_prestamo;
        this.prestamo = res;
        this.prestamo.responsable = res.nombre_persona_responsable;
        this.prestamo.recibido = res.nombre_empleado_recibido;

        this.prestamo.tipo_persona = res.tipo_persona_recibido;

        if(this.prestamo.tipo_persona=='E'){
          this.prestamo.nombre_departamento_recibido = res.nombre_departamento_recibido;
          this.prestamo.nombre_cargo_recibido = res.nombre_cargo_recibido;
        }else if(this.prestamo.tipo_persona=='C'){
          this.contribuyenteActive.razon_social = res.nombre_persona_recibido;
        }else if(this.prestamo.tipo_persona=='N'){
          this.prestamo.recibido_por = res.nombre_persona_recibido;
        }else {

        }
        if(res.tipo=='D'){
          this.prestamo.tipo='D';
          this.prestamo.doc_salida = res.documento_salida;
        }else if(res.tipo=='S'){
          this.prestamo.tipo='S';
          this.prestamo.doc_salida = res.num_doc;
        }else{

        }
        if (res.fotos.length > 0) {
          this.fotos = res.fotos;
        }
        if(res.contribuyente_recibido!=null){
          this.contribuyenteActive.razon_social= res.contribuyente_recibido.razon_social;
        }
        if(res.eventos!=null){

          Object.assign(this.evento, {
            id_cal_eventos: res.eventos.id_cal_eventos,
            titulo: res.eventos.titulo,
            descripcion: res.eventos.descripcion,
            tipo_evento: res.eventos.tipo_evento,
            fecha_inicio: res.eventos.fecha_inicio.split(' ')[0],
            hora_inicio: res.eventos.fecha_inicio.split(' ')[1],
            fecha_fin: res.eventos.fecha_fin.split(' ')[0],
            hora_fin: res.eventos.fecha_fin.split(' ')[1],
          })
          this.eventoAux = this.tipoEventosList.filter(e => e.valor == this.evento.tipo_evento)
          this.eventoNombre = this.eventoAux[0].descripcion

          // this.evento= res.eventos;
          // this.evento.fecha_inicio= res.eventos.fecha_inicio.split(' ')[0];
          // this.evento.fecha_fin= res.eventos.fecha_fin.split(' ')[0];
          // this.evento.hora_inicio= res.eventos.fecha_inicio.split(' ')[1];
          // this.evento.hora_fin= res.eventos.fecha_fin.split(' ')[1];
        }else{
          this.eventoNombre = ""
        }

        if(this.prestamo.tipo='S'){
          this.zonaAux = this.zonaList.filter(e => e.valor == this.prestamo.zona )
          this.sectorAux = this.sectorList.filter(e => e.valor == this.prestamo.codigo_sector )
          this.zonaNombre = this.zonaAux[0].descripcion
          this.sectorNombre = this.sectorAux[0].descripcion
        }else if(this.prestamo.tipo='D'){
          this.zonaNombre = this.prestamo.zona
          this.sectorNombre = this.prestamo.codigo_sector
        }
        this.vmButtons[3].habilitar = false;



        this.cantidad_bienes =res.detalles.length

       console.log(res.detalles);
       res.detalles.forEach((p) => {
              Object.assign(p,
                {
                  action: true,
                  nombre: p.producto[0].nombre,
                  codigoProducto : p.code_product,
                  precio_normal:p.costo_unitario,
                  stock: p.stock_actual,
                  quantity: p.cantidad,
                  price: p.costo,
                  totalAux:  p.costo_total,

                });
        });
        this.dataProducto = JSON.parse(JSON.stringify(res.detalles));

        this.commonVarServices.contribAnexoLoad.next({condi:'infimas', id: res.id_prestamo});
      }
    )
    this.commonVarServices.PrestamoBienesSalidas.asObservable().subscribe(
      (res) => {
       console.log(res)

        this.disabledCampos = false;
        this.disabledCampo = false;
        this.disabledDevolucion = true;

        this.disabledGrupo = true;
        this.disabled=true;
        this.isNew = true;
        //this.num_doc= res.num_doc;
        this.id_prestamo= res.id_prestamo;
        //this.prestamo = res;
        this.prestamo.tipo = 'D';
        this.prestamo.num_doc = null;
        this.prestamo.estado = res.estado;
        this.prestamo.fecha = moment(new Date()).format('YYYY-MM-DD');
        this.prestamo.recibido = res.nombre_empleado_recibido;

        this.prestamo.tipo_persona = res.tipo_persona_recibido;
        if(this.prestamo.tipo_persona=='E'){
          this.prestamo.nombre_departamento_recibido = res.nombre_departamento_recibido;
          this.prestamo.nombre_cargo_recibido = res.nombre_cargo_recibido;
        }else if(this.prestamo.tipo_persona=='C'){
          this.contribuyenteActive.razon_social = res.nombre_persona_recibido;
        }else if(this.prestamo.tipo_persona=='N'){
          this.prestamo.recibido_por = res.nombre_persona_recibido;
        }else {

        }

        if(res.tipo_persona_recibido=='E'){
          this.prestamo.recibido = res.nombre_empleado_recibido;
          this.prestamo.nombre_departamento_recibido = res.nombre_departamento_recibido;
          this.prestamo.nombre_cargo_recibido = res.nombre_cargo_recibido;
        }
        this.prestamo.responsable=res.nombre_persona_responsable;
        this.prestamo.nombre_cargo_responsable=res.nombre_cargo_responsable;
        this.prestamo.nombre_departamento_responsable=res.nombre_cargo_responsable;
        this.fecha_salida = res.fecha;
        this.prestamo.doc_salida = res.num_doc;
        //this.grupo.tipo_bien =


        this.zona_filter = this.zonaList.filter(e => e.valor === res.zona)
        this.prestamo.zona = this.zona_filter[0].descripcion;
        console.log(this.zona_filter)

        this.sector_filter = this.sectorList.filter(e => e.valor === res.codigo_sector)
        this.prestamo.codigo_sector = this.sector_filter[0].descripcion;
        console.log(this.sector_filter)
        // if (res.fotos.length > 0) {
        //   this.fotos = res.fotos;
        // }
        if(res.contribuyente_recibido!=null){
          this.contribuyenteActive.razon_social= res.contribuyente_recibido.razon_social;
        }
        // if(res.eventos!=null){

        //   Object.assign(this.evento, {
        //     id_cal_eventos: res.eventos.id_cal_eventos,
        //     titulo: res.eventos.titulo,
        //     descripcion: res.eventos.descripcion,
        //     tipo_evento: res.eventos.tipo_evento,
        //     fecha_inicio: res.eventos.fecha_inicio.split(' ')[0],
        //     hora_inicio: res.eventos.fecha_inicio.split(' ')[1],
        //     fecha_fin: res.eventos.fecha_fin.split(' ')[0],
        //     hora_fin: res.eventos.fecha_fin.split(' ')[1],
        //   })
        //   // this.evento= res.eventos;
        //   // this.evento.fecha_inicio= res.eventos.fecha_inicio.split(' ')[0];
        //   // this.evento.fecha_fin= res.eventos.fecha_fin.split(' ')[0];
        //   // this.evento.hora_inicio= res.eventos.fecha_inicio.split(' ')[1];
        //   // this.evento.hora_fin= res.eventos.fecha_fin.split(' ')[1];
        // }

        //this.vmButtons[3].habilitar = false;



        this.cantidad_bienes =res.detalles.length

       console.log(res.detalles);
       res.detalles.forEach((p) => {
              Object.assign(p,
                {
                  action: true,
                  nombre: p.producto[0].nombre,
                  codigoProducto : p.code_product,
                  precio_normal:p.costo_unitario,
                  stock: p.stock_actual,
                  quantity: p.cantidad,
                  price: p.costo,
                  totalAux:  p.costo_total,

                });
        });
        this.dataProducto = JSON.parse(JSON.stringify(res.detalles));

       // this.commonVarServices.contribAnexoLoad.next({condi:'infimas', id: res.id_prestamo});
      }
    )
    this.commonVarServices.selectProducto.asObservable().subscribe(
      (res) => {
        console.log(res)
        //this.dataProducto = res['data'];

        this.addItems(res)
        this.vmButtons[0].habilitar = false;

    }
    )

    this.commonVarServices.departamentoSelect.asObservable().subscribe(
      (res)=>{
        this.departamentoSelect = res;
      }
    )
    this.commonVarServices.compPubInfimas.asObservable().subscribe(
      (res) => {
        console.log(res)
        if(res.custom1 == 'INV-PRESTAMO-BIENES'){
          // this.disabledCampo = res.validacion;
        }


      }
    );
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsTrasBien", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsTrasBien", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsTrasBien",paramAccion: "",boton: { icon: "far fa-search", texto: "BUSCAR" },permiso: true,showtxt: true,showimg: true,showbadge: false,clase: "btn btn-primary boton btn-sm",habilitar: false},
      { orig: "btnsTrasBien",paramAccion: "",boton: { icon: "fa fa-print", texto: "IMPRIMIR" },permiso: true,showtxt: true,showimg: true,showbadge: false,clase: "btn btn-warning btn-sm",habilitar: true,printSection: "PrintSection", imprimir: true},
      { orig: "btnsTrasBien", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    this.dateConverter = moment(this.toDatePicker).format('YYYY-MM-DD');
    this.validatePermission();
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);
  }

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    /*obtener el ultimo status*/
    this.prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 2);
    if (this.prefict[0]['filtros'] != null && this.prefict[0]['filtros'] != undefined) {
      let filter = this.prefict[0]['filtros'].split(',');
      this.latestStatus = parseInt(filter[filter.length - 1]);
    }

    let params = {
      codigo: myVarGlobals.fFacturaVenta,
      id_rol: this.dataUser.id_rol
    }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Egresos de Bodega");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getCatalogos();
        this.getBodega();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    });
  }
  addItems(data) {
    if(this.cantidad_bienes==0){
      this.dataProducto = [];
    }
    if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      if(this.estado_producto==undefined){
        this.toastr.info("Debe seleccionar un estado");
      }else{

        if(this.dataProducto.length > 0){
          let flag = true;
          for(let i = 0 ; i<this.dataProducto.length; i++){
            if(this.dataProducto[i].codigoProducto === data.codigoproducto){
              flag = false;
              break;
            }
          }
          if(flag){
            let cantidad= 0
            let items =
               {
                action: true,
                nombre: data.nombre,
                codigoProducto : data.codigoproducto,
                precio_normal:data.PVP,
                stock: data.stock,
                quantity: 1,
                price: data.costo,
                totalAux: 0.00,
                costo:data.costo,
                id_producto:data.id_producto,
                id_grupo_producto:this.claseSelect.id_grupo_productos,
                id_subgrupo_producto:this.subgrupo.id_subgrupo_producto,
                tipo_bien:this.grupo.tipo_bien,
                estado: this.estado_producto

              };

              this.dataProducto.push(items);
              this.sumarItems()
              console.log(this.dataProducto)
              this.disabledCantidad=true;
            console.log(flag)
          }else{
            console.log(flag)
            this.toastr.info( "No puede seleccionar el mismo bien dos veces");
          }
          // this.dataProducto.forEach(p=> {
          //   if(p.codigoProducto == data.codigoProducto){
          //     this.toastr.info("No puede repetir este bien");
          //   }else{
          //     let items =
          //     {
          //       action: true,
          //       nombre: data.nombre,
          //       codigoProducto : data.codigoProducto,
          //       precio_normal:data.PVP,
          //       stock: data.stock,
          //       quantity: 1,
          //       price: data.costo,
          //       totalAux: 0.00,
          //       costo:data.costo,
          //       id_producto:data.id_producto,
          //       id_grupo_producto:this.claseSelect.id_grupo_productos,
          //       id_subgrupo_producto:this.subgrupo.id_subgrupo_producto,
          //       tipo_bien:this.grupo.tipo_bien,
          //       estado: this.estado_producto

          //     };
          //     this.dataProducto.push(items);
          //     console.log(this.dataProducto)
          //     this.disabledCantidad=true;

          //   }
          // });
        }else{
          let items =
              {
                action: true,
                nombre: data.nombre,
                codigoProducto : data.codigoproducto,
                precio_normal:data.PVP,
                stock: data.stock,
                quantity: 1,
                price: data.costo,
                totalAux: 0.00,
                costo:data.costo,
                id_producto:data.id_producto,
                id_grupo_producto:this.claseSelect.id_grupo_productos,
                id_subgrupo_producto:this.subgrupo.id_subgrupo_producto,
                tipo_bien:this.grupo.tipo_bien,
                estado: this.estado_producto

              };
              this.dataProducto.push(items);
              this.sumarItems()
              console.log(this.dataProducto)
              this.disabledCantidad=true;
        }
      }

    }
  }

  sumarItems(){
    this.cantidad_bienes += +1;
  }
  restarItems(){
    let valor_restar=1
    let cantidad = this.cantidad_bienes
    if(this.cantidad_bienes!=0){
      this.cantidad_bienes =  +cantidad - +valor_restar;
    }
  }

  getBodega() {
		this.invService.getBodegas().subscribe(res => {
			//this.toma.bodega = 0;
			this.arrayBodega = res['data'];

		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

  getCatalogos() {
    let data = {
      params: "'INV_TIPO_BIEN','CAL_EVENTO','CAT_ZONA','CAT_SECTOR'"
    }
    this.invService.getCatalogos(data).subscribe(res => {
      this.tipoEventosList = [];

      res['data']['CAL_EVENTO'].forEach(e => {
        this.tipoEventosList.push(e);
      });
      this.catalog = res["data"]["INV_TIPO_BIEN"];
      this.catalog_filter = this.catalog.filter(e => e.valor == 'BCA')
      this.zonaList = res['data']['CAT_ZONA'];
      this.sectorList = res['data']['CAT_SECTOR'];
      this.getCustomers();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }
  mostrarTipo(event){
    console.log(event);
    if(event=='D'){
      this.expandListDocumentosSalidasRec()
    }


  }

  buscarGrupoProducto(event){
    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);

    let data = {
       tipo_bien: event
    }
    this.invService.getGrupoProducto(data).subscribe(res => {
      this.listaProductos = res["data"]
      this.disabledGrupo = false;
      console.log(res["data"])
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }
  selectedGrupo(event){
    this.subgrupo = event
    this.agregaProduct = false;
    // console.log(event);
    if(event){
      this.disabledSubGrupo = false;
    }
  }

  getCustomers() {

    this.invService.getCustomers().subscribe(res => {
      this.arrayCustomer = res['data'];
      this.arrayCustomerAux = res['data'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getimpuestos() {
    this.invService.getImpuestos().subscribe(res => {
      this.ivaConverter = (res['data'][0].valor / 100) * 100;
      this.getTypeDocument();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTypeDocument() {
    let data = {
      params: "'V'"
    }
    this.invService.getTypeDocument(data).subscribe(res => {
      this.dataBuy.tip_doc = res['data']['V'];
      this.getNumautNumFac(this.dataBuy.tip_doc[0].id);
      this.dataBuy.idTipDocSelect = this.dataBuy.tip_doc[0].id;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getNumautNumFac(id) {
    if (this.dataTotales.totalPagado > 0) {
      this.dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
      this.dataProducto = [{ nombre: null, codigoproducto: null, marca: null, stock: 0.00, cantidad_reservada: 0.00, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }];
    }
    let data = {
      id: id
    }
    this.lcargando.ctlSpinner(true);
    this.invService.getNumautNumFac(data).subscribe(res => {
      this.num_point_emision = res['data'][0]['num_punto_emision'];
      this.num_serial = res['data'][0]['num_fact_serial'];
      this.num_aut = res['data'][0]['num_autorizacion'];
      this.num_fac = `${res['data'][0]['num_establecimiento']}-${res['data'][0]['num_punto_emision']}-${res['data'][0]['num_fact_serial'].toString().padStart(9, '0')}`;
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getCustomerFilter(dat) {
    this.arrayCustomerAux = [];
    let res = this.arrayCustomer.filter(e => e.num_documento.substring(0, dat.length) == dat.toString()
      || e.razon_social.substring(0, dat.length) == dat.toString());
    setTimeout(() => {
      this.arrayCustomerAux = res;
    }, 100);
  }

  getCustomer(e) {
    this.textNotification = "";
    this.maxInvoicesPend = 0;
    this.maxInvoicesXCliente = 0;
    this.customer = this.arrayCustomer.filter(evt => evt.id_cliente == e)[0];
    this.maxInvoicesXCliente = this.customer.plazo_credito;
    this.lcargando.ctlSpinner(true);
    this.invService.validateInvoicePend({ id_cliente: this.customer.id_cliente }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.maxInvoicesPend = res['data'].length;
      /*if ((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1) {
        this.textNotification = "Cliente ha superado el máximo de facturas de crédito. ";
      }*/
    })
  }

  addProduct() {
  // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
  const modal = this.modalService.open(ListBusquedaPrestamoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
  // modal.componentInstance.contr = this.contribuyenteActive;
  // modal.componentInstance.permissions = this.permissions;
  modal.componentInstance.validate = 'EB'
  modal.componentInstance.subgrupo = this.subgrupo
  modal.componentInstance.id_custodio = this.prestamo.id_responsable
  modal.componentInstance.verifyRestore = this.verifyRestore;

  }

  deleteItems(index) {
    if (this.permissions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.dataTotales.subTotalPagado = 0.00;
      this.dataTotales.ivaPagado = 0.00;
      this.dataTotales.totalPagado = 0.00;
      this.dataTotales.ivaBase = 0.00;
      this.dataTotales.iva0 = 0.00;
      this.dataProducto[index]['action'] = false;
      this.dataProducto[index]['quantity'] = 0;
      this.dataProducto[index]['price'] = this.dataProducto[index]['PVP'];
      this.dataProducto[index]['totalItems'] = 0.00;
      this.dataProducto[index]['totalAux'] = parseFloat('0.00').toFixed(4);


      this.dataProducto.forEach(element => {
        if (element.Iva == 1) {
          this.dataTotales.subTotalPagado += element.totalItems;
          this.dataTotales.ivaBase += element.totalItems;
        } else {
          this.dataTotales.iva0 += element.totalItems;
        }
      });
      this.dataTotales.ivaPagado = this.dataTotales.ivaBase * (this.ivaConverter / 100);
      this.dataTotales.subTotalPagado += this.dataTotales.iva0;
      this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado;
      this.valueLethers = this.commonVarServices.NumeroALetras(this.dataTotales.totalPagado, false);
      this.restarItems()

    }
  }

  sumTotal(index) {
    console.log('aqui')
    this.dataTotales.subTotalPagado = 0.00;
    this.dataTotales.ivaPagado = 0.00;
    this.dataTotales.totalPagado = 0.00;
    this.dataTotales.ivaBase = 0.00;
    this.dataTotales.iva0 = 0.00;

    this.dataProducto[index].totalItems = this.dataProducto[index].quantity * this.dataProducto[index].price;
    this.dataProducto[index]['totalAux'] = this.dataProducto[index].quantity * this.dataProducto[index].price;
    this.dataProducto[index]['totalAux'] = parseFloat(this.dataProducto[index]['totalAux']).toFixed(4);
    this.dataProducto.forEach(element => {
      if (element.Iva == 1 && (this.dataBuy.idTipDocSelect != 8)) {
        this.dataTotales.subTotalPagado += element.totalItems;
        this.dataTotales.ivaBase += element.totalItems;
      } else {
        this.dataTotales.iva0 += element.totalItems;
      }
    });
    this.dataTotales.ivaPagado = this.dataTotales.ivaBase * (this.ivaConverter / 100);
    this.dataTotales.subTotalPagado += this.dataTotales.iva0;
    this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado;
    this.valueLethers = this.commonVarServices.NumeroALetras(this.dataTotales.totalPagado, false);
  }

  changeDisabledBtn() {
    if (this.dataBuy.tipoPagoSelect == 'Crédito') {
      this.flagBtnDired = true;
    } else {
      this.flagBtnDired = false;
    }
  }

  setNumCuotas() {
    const modalInvoice = this.modalService.open(DiferedComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.diferedEdit = this.dataDifered;
    modalInvoice.componentInstance.ammount = this.dataTotales.totalPagado;
  }

  cancelSales() {

    this.id_prestamo=null;
    this.isNew = true;

    this.prestamo = {
      tipo:null,
      fecha:moment(new Date()).format('YYYY-MM-DD'),
      num_doc:null,
      responsable:null,
      id_responsable:null,
      nombre_departamento_responsable:null,
      nombre_cargo_responsable:null,
      recibido:null,
      id_recibido:null,
      nombre_departamento_recibido:null,
      nombre_cargo_recibido:null,
      recibido_por:null,
      tipo_persona:null,
      zona:0,
      codigo_sector:0,
      fk_id_contribuyente:null,
      doc_salida:null,
      observaciones:null,
      estado:null



      // recibido:null,
      // id_recibido:null,
      // nombre_departamento_recibido:null,
      // nombre_cargo_recibido:null,
    }
    this.disabledCampos = false;
    this.disabledCampo = false;
    this.disabledCantidad = false;
    this.agregaProduct=true;
    this.disabledSubGrupo = true;
    this.disabledGrupo = true;
    this.disabledDevolucion = false;
    this.departamentoSelect.dep_nombre="",
    this.grupo.tipo_bien=0,
    this.UserSelect = "",
    this.claseSelect ="",
    this.subgrupo.descripcion = "",
    this.dataProducto =[],
    this.bodega=0;
    this.num_doc="";
    this.cantidad_bienes=0;

    this.fotos = [];
    this.fotosEliminar = [];

    this.fileList = undefined;

    this.evento= {
      id_cal_eventos: 0,
      titulo: '',
      fecha_inicio: moment(new Date()).format('YYYY-MM-DD'),
      hora_inicio: moment(new Date()).format('HH:00:00'),
      fecha_fin: moment(new Date()).format('YYYY-MM-DD'),
      hora_fin: moment(new Date()).format('HH:00:00'),
      descripcion: '',
      tipo_evento: 0,
      id_origin: 0
    };

    this.contribuyenteActive = {
      razon_social: ""
    };

    this.commonVarServices.clearAnexos.next(null)

    this.actions.dComponet = false;
    this.dataProducto = [];
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
  }

  searchQuotes() {
    if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      const modalInvoice = this.modalService.open(GlobalTableComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content' });
      modalInvoice.componentInstance.title = "COTIZACIONES";
      modalInvoice.componentInstance.module = this.permissions.id_modulo;
      modalInvoice.componentInstance.component = myVarGlobals.fFacturaVenta;
    }
  }

  async validateSaveSales() {

    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      console.log(this.evento);
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.saveSales();
        }
      })
    }
  }



  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      // if (this.customerSelect == 0) {
      //   this.toastr.info("seleccione un cliente");
      //   document.getElementById("IdRolesUsersDoc").focus(); return;
      // }
      //if (this.UserSelect == undefined) {
      //   this.toastr.info("Debe seleccionar un responsable");
      //   flag = true;
      // }else if (this.prestamo.recibido_por == "" || this.prestamo.recibido_por == undefined) {
      //   this.toastr.info("Debe ingresar el nombre de la persona que recibira los bienes prestados");
      //   flag = true;
      // }
      console.log(this.prestamo.tipo);
      if (this.prestamo.zona == 0 || this.prestamo.zona == undefined) {
        this.toastr.info('Debe ingresar la zona.')
        flag = true;
      }
      else if (this.prestamo.codigo_sector == 0 || this.prestamo.codigo_sector == undefined) {
        this.toastr.info('Debe ingresar el sector.')
        flag = true;
      }
      else if (this.prestamo.tipo_persona == 0 || this.prestamo.tipo_persona == undefined) {
        this.toastr.info('Debe seleccionar el tipo de persona que recibe.')
        flag = true;
      }
      else if (this.prestamo.tipo_persona=='E') {
        if (this.prestamo.recibido == '' || this.prestamo.recibido == undefined) {
          this.toastr.info('Debe ingresar el nombre del empleado que recibirá el bien.')
          flag = true;
        }
      }else if(this.prestamo.tipo_persona=='C'){
        if (this.contribuyenteActive.razon_social == '' || this.contribuyenteActive.razon_social == undefined) {
          this.toastr.info('Debe ingresar el nombre del contribuyente que recibirá el bien.')
          flag = true;
        }
      }else if(this.prestamo.tipo_persona=='N'){
        if (this.prestamo.recibido_por== '' || this.prestamo.recibido_por == undefined) {
          this.toastr.info('Debe ingresar el nombre de la persona que recibirá el bien.')
          flag = true;
        }
      }


      if (this.prestamo.tipo=='S'){
        if (
          this.evento.titulo == '' || this.evento.titulo == undefined
        ) {
          this.toastr.info('Debe ingresar un título para el evento.')
          flag = true;
        } else if(
          this.evento.descripcion == '' || this.evento.descripcion == undefined
        ) {
          this.toastr.info('Ingrese una descripción para el evento.')
          flag = true;
        } else if(
          this.evento.tipo_evento == 0 || this.evento.tipo_evento == undefined
        ) {
          this.toastr.info('Debe seleccionar un tipo de evento.')
          flag = true;
        }

        if(
          this.evento.fecha_fin < this.evento.fecha_inicio
        ) {
          this.toastr.info('La fecha final del evento no puede ser anterior a la fecha de inicio.')
          flag = true;
        } else if(
          (this.evento.fecha_fin == this.evento.fecha_inicio) &&  (this.evento.hora_fin <= this.evento.hora_inicio)
        ) {
          this.toastr.info('Si el evento es del mismo día la hora final no puede ser igual o menor a la hora inicial del evento.')
          flag = true;
        }


      }




      else if(this.dataProducto.length != 0 ) {

            for (let index = 0; index < this.dataProducto.length; index++) {
              if (this.dataProducto[index].quantity <= 0 && this.dataProducto[index].action ) {
                this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0");
                flag = true; break;
              } else if (this.dataProducto[index].stock <= 0 && this.dataProducto[index].action ) {
                this.toastr.info("Revise el stock de los productos, no puede estar vacio o ser 0");
                flag = true; break;
            }else if (this.dataProducto[index].quantity > this.dataProducto[index].stock ) {
              this.toastr.info("Revise la cantidad de los productos, no puede ser mayor al campo stock");
              flag = true; break;
            }
            // else if (this.dataProducto[index].tipo_bien != this.grupo.tipo_bien) {
            //   this.toastr.info("No puede tener productos de diferente Tipo de bien");
            //   flag = true; break;
            // }
          }
        }
        if(this.fotos.length == 0){
          this.toastr.info("Ingrese al menos una foto");
          flag = true;
        } else if(this.dataProducto[0]==undefined){
          this.toastr.info("Debe seleccionar productos");
          flag = true;
        }else if (this.dataProducto[0].codigoproducto == null && this.dataProducto.length == 0) {
          this.toastr.info("Ingrese al menos un producto");
          flag = true;
        }

    (!flag) ? resolve(true) : resolve(false);
  });
  }


  async saveSales() {

    let notify = `Se ha generado una nuevo Prestamo de bienes por el usuario ${this.dataUser.nombre}`;
    let productSend = [];
    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 2);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];

    this.dataProducto.forEach(element => {
      if (element.action) {
        productSend.push(element);
      }
    });

    this.prestamo.fk_id_contribuyente= this.contribuyenteActive.id_cliente;

    console.log(this.evento);
    let hora_ini = this.evento.hora_inicio.split(':');
    let hora_fin = this.evento.hora_fin.split(':');
    if(hora_ini.length==2){
      this.evento.hora_inicio = this.evento.hora_inicio + ':00';
      console.log(this.evento.hora_inicio);
    }
    if(hora_fin.length==2){
      this.evento.hora_fin = this.evento.hora_fin + ':00';
      console.log(this.evento.hora_fin);
    }

    let fechahora_inicio = this.evento.fecha_inicio + ' ' + this.evento.hora_inicio;
    let fechahora_fin = this.evento.fecha_fin + ' ' + this.evento.hora_fin;
    Object.assign(this.evento, {
      fechahora_inicio: fechahora_inicio,
      fechahora_fin: fechahora_fin,
    })
    console.log(this.evento);

    for (let index = 0; index < productSend.length; index++) {
      if (productSend[index].quantity <= 0 &&  this.grupo.tipo_bien === 'EXI') {
        this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0"); return;
      } else if (productSend[index].price <= 0 &&  this.grupo.tipo_bien === 'EXI') {
        this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser 0"); return;
      }
    }

    let info;
    if (this.dataBuy.tipoPagoSelect == "Contado") {
      let objCoutas = {};
      objCoutas['Num_cuota'] = 1;
      objCoutas['monto_cuota'] = this.dataTotales.totalPagado.toFixed(4);
      objCoutas['fecha_vencimiento'] = moment(this.toDatePicker).format('YYYY-MM-DD');
      let arrCoutas = [];
      arrCoutas.push(objCoutas);
      info = {
        amount: this.dataTotales.totalPagado.toFixed(4),
        cuotas: 1,
        difered: arrCoutas
      }
    }

    let validate = await this.validateStock(productSend).then(resultado => {
      if (resultado) {
        Swal.fire({
          text: 'Hay uno o varios productos con stock menor a la cantidad solicitada, ¿desea guardar la factura?',
          showDenyButton: true,
          confirmButtonText: `Guardar factura`,
          denyButtonText: `Revisar productos`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.save(productSend, notify, filter, prefict, info, resultado);
          } else if (result.isDenied) {
          }
        })
      } else {
        this.save(productSend, notify, filter, prefict, info, resultado);
      }
    })
  }

  async save(productSend, notify, filter, prefict, info, resultado) {
    console.log(productSend);
    (this as any).mensajeSpinner = "Guardando prestamo de bienes...";
    this.lcargando.ctlSpinner(true);
    let res = await this.validatePrice(productSend).then(res => {
      localStorage.removeItem('dataProductsInvoice');
      this.textNotificationSend = ((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1) ? this.textNotificationSend + this.textNotification : this.textNotificationSend + "";
      this.textNotificationSend = (resultado) ? this.textNotificationSend + " Existen uno o varios productos con stock menor a la cantidad solicitada. " : this.textNotificationSend + "";
      this.textNotificationSend = (res) ? this.textNotificationSend + " Existen inconcistencia en los precios. " : this.textNotificationSend + "";
      this.textNotificationSend = (this.validate_cupo) ? this.textNotificationSend + ` Cliente ${this.customer.razon_social} no tiene suficiente cupo para el crédito ` : this.textNotificationSend + "";

      this.prestamo['recibido_por'] = this.prestamo['recibido_por'] ? this.prestamo['recibido_por'] :  this.prestamo['recibido'] ? this.prestamo['recibido'] :  this.contribuyenteActive['razon_social'] && this.contribuyenteActive['razon_social']  ;

      console.log(this.prestamo);
      if(this.prestamo.tipo=='S'){
        this.prestamo.estado='E';
      }else if(this.prestamo.tipo=='D'){
        this.prestamo.estado='D';
      }

      let data = {
        list_product: productSend,
        id_user: this.dataUser.id_usuario,
        tip_doc: this.dataBuy.idTipDocSelect,
        ip: this.commonServices.getIpAddress(),
        accion: `Registro de Prestamo de Bienes ${this.customer['asesor']['nombre']}`,
        id_controlador: myVarGlobals.fGBEgreBodega,
        notifycation: (!res && !resultado && !this.validate_cupo && !((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1)) ? notify : `${notify}, esta factura necesita ser aprobada`,
        bodega: this.bodega,
        fk_id_departamento_recibe:this.departamentoSelect.id_departamento,
        prestamo:this.prestamo,
        tipo_bien: this.grupo.tipo_bien,
        fotos: this.fotos.filter(e => e.id_traslado_fotos === 0),
        fotosEliminar: this.fotosEliminar,
        evento:this.evento,

      }
       console.log(data);
      this.invService.savePrestamoBienes(data).subscribe(
        res => {
        if (res["status"] == 1) {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            title: 'Proceso exitoso!!',
            text: `Su Préstamo de bienes se realizó  exitosamente`,
            icon: 'success',
            confirmButtonColor: '#4DBD74',
            confirmButtonText: 'Aceptar'
          });

          this.disabledCampos = true;
          this.disabledCampo = true;
          this.disabledGrupo = true;
          this.agregaProduct=true;

          console.log(res['data'])
          this.prestamo=res['data'];
          this.id_prestamo=res['data'].id_prestamo;
          this.prestamo.tipo_persona=res['data'].tipo_persona_recibido;
          this.prestamo.responsable=res['data'].nombre_persona_responsable;
          this.prestamo.nombre_cargo_responsable=res['data'].nombre_cargo_responsable;
          this.prestamo.nombre_departamento_responsable=res['data'].nombre_cargo_responsable;
          this.prestamo.recibido=res['data'].recibido_por;
          this.prestamo.recibido_por=res['data'].nombre_persona_recibido;
          this.prestamo.doc_salida=res['data'].documento_salida;




          this.uploadFile(res['data'].id_prestamo)
          console.log(this.prestamo)

          if(this.evento !=null){
            this.eventoAux = this.tipoEventosList.filter(e => e.valor == this.evento.tipo_evento)
            if(this.eventoAux[0]!=undefined){
              this.eventoNombre = this.eventoAux[0].descripcion
            }

          }else{
            this.eventoNombre = ""
          }

          if(this.prestamo.tipo='S'){
            this.zonaAux = this.zonaList.filter(e => e.valor == this.prestamo.zona )
            this.sectorAux = this.sectorList.filter(e => e.valor == this.prestamo.codigo_sector )
            if(this.zonaAux[0]!=undefined){
              this.zonaNombre = this.zonaAux[0].descripcion
            }
            if(this.sectorAux[0]!=undefined){
              this.sectorNombre = this.sectorAux[0].descripcion
            }

          }else if(this.prestamo.tipo='D'){
            this.zonaNombre = this.prestamo.zona
            this.sectorNombre = this.prestamo.codigo_sector
          }

          this.disabled=true;
          this.actions.dComponet = false;
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = false;

         // this.imprimirComprobante()

        } else {
          this.lcargando.ctlSpinner(false);
          this.cancelSales();
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    })
  }

  async validatePrice(prod) {
    let sendNotification = false;
    prod.forEach(element => {
      if ((parseFloat(element.price) < parseFloat(element['price_min']) || parseFloat(element.price) > parseFloat(element['price_max']))) {
        sendNotification = true;
      }
    });
    return sendNotification;
  }

  async validateStock(product) {
    let stock = false;
    product.forEach(element => {
      if (element.quantity > (element['stock'] - element.cantidad_reservada) && element['clase'] == "Productos") {
        stock = true;
      }
    });
    return stock;
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.newOrder();
        break;
      case "GUARDAR":
        this.validateSaveSales();
        break;
      case "BUSCAR":
        this.expandListDocumentosRec();
        break;
      case "IMPRIMIR":
       /*this.imprimirComprobante();*/
        break;
      case "CANCELAR":
        this.cancelSales();
        break;
    }
  }
  newOrder() {
    this.cancelSales();
    this.actions.dComponet = true;
    this.actions.btncancelar = true;
    this.actions.btnGuardar = true;
    this.actions.btnNuevo = true;

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
    this.disabledCampos = false

  }

  cargaFoto(archivos) {
    (this as any).mensajeSpinner = 'Cargando fotos...';
    this.lcargando.ctlSpinner(true);
    if (archivos.length > 0 && (archivos.length + this.fotos.length) <= 3) {
      for (let i = 0; i < archivos.length; i++) {
        const reader = new FileReader();
        reader.onload = (c: any) => {
          this.fotos.push({
            id_traslado_fotos: 0,
            recurso: c.target.result
          });
        };
        reader.readAsDataURL(archivos[i]);
      }
    } else if ((archivos.length + this.fotos.length) > 5) {
      this.toastr.warning("No puede subir más de 3 fotos", "¡Atención!");
    }
    this.lcargando.ctlSpinner(false);
  }

  removeFoto(index) {
    if (this.fotos[index].id_traslado_fotos > 0) {
      this.fotosEliminar.push(this.fotos.splice(index, 1)[0].id_traslado_fotos);
    } else {
      this.fotos.splice(index, 1);
    }
  }

  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos')
      }, 50)
    }
  }
  uploadFile(id_prestamo) {
    console.log(id_prestamo)
    let data = {
      //module: this.permissions.id_modulo,
      module:21,
      component: myVarGlobals.fGestBienesPrestamo,
      identifier: id_prestamo,
      id_controlador: myVarGlobals.fGestBienesPrestamo,
      accion: `Nuevo anexo para Prestamo de Bienes ${id_prestamo}`,
      ip: this.commonServices.getIpAddress(),
      custom1:'INV-PRESTAMO-BIENES'
    }
    if(this.fileList != undefined && this.fileList.length!=0){
      for (let i = 0; i < this.fileList.length; i++) {
        this.UploadService(this.fileList[i], id_prestamo,data );
      }
    }
    this.fileList = undefined
    this.lcargando.ctlSpinner(false)
  }
  UploadService(file,  identifier, payload?: any): void {
    this.invService.uploadAnexo(file, payload).subscribe(
      res => {
        this.commonVarServices.contribAnexoLoad.next({condi:'infimas', id: identifier})
      },
      err => {
        this.toastr.info(err.error.message);
      })
  }

  imprimirComprobante(){
    console.log(this.id_prestamo)
    this.selectedReporte= 5;
      //window.open(environment.ReportingUrl + "rpt_bienes_prestamo_acta_entrega.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_prestamo , '_blank')
      let reporteUrl: string = `${environment.baseUrl}/reports/reporte-jasper?reporte=${this.selectedReporte}&p_id=${this.id_prestamo}`
      // console.log(reporteUrl)
      window.open(reporteUrl, "_blank")
    }


  expandListDocumentosRec() {

    const modal = this.modalService.open(BusquedaPrestamoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }
  expandListDocumentosSalidasRec() {

    const modal = this.modalService.open(BusquedaPrestamoSalidasComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
  }
  modalDepartamentos(){
    let modal = this.modalService.open(ModalDepartamentosComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  modalEncargado(data: any){
    let modal = this.modalService.open(EncargadoTrasladoComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.tipo = data;
  }

  // modalGrupos() {

  //   let modal = this.modalService.open(ModalProductoComponent, {
  //     size: "lg",
  //     backdrop: "static",
  //     windowClass: "viewer-content-general",
  //   })

  //   modal.componentInstance.validacionModal = true;
  //   modal.componentInstance.validar = true
  //   modal.componentInstance.verifyRestore = this.verifyRestore;
  //   modal.componentInstance.claseSelect = this.claseSelect;

  //   //this.generaActionRawMaterial()
  // }
  expandirVistaFotos(index) {
    const modalInvoice = this.modalService.open(ModalVistaFotosComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.fotos = this.fotos;
    modalInvoice.componentInstance.indexActive = index;
  }
  showDetalleProducto(data) {

    const modalInvoice = this.modalService.open(DetallesProductoComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.data = data;
    modalInvoice.componentInstance.isNew = this.isNew;

  }
  modalContirbuyente(){
    let modal =  this.modalService.open(ModalContribuyentesComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modal.componentInstance.module_comp = myVarGlobals.fGestBienesPrestamo
    modal.componentInstance.editar = this.permissions.editar;
    modal.componentInstance.eliminar = this.permissions.eliminar;
    modal.componentInstance.validacion = 7;
  }
  showRegContribuyente(isNew:boolean, data?:any) {
    // console.log(data);
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para crear Contribuyente.");
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Contribuyente.");
    } else {
      const modalInvoice = this.modalService.open(ModalRegContribuyenteComponent, {
        size: "xl",
        // backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fGestBienesPrestamo;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      //modalInvoice.componentInstance.ticket = this.ticket;

    }
  }


}
