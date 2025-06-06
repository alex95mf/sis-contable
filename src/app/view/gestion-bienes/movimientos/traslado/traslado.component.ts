import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TrasladoService } from './traslado.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiferedComponent } from 'src/app/view/comercializacion/facturacion/invoice-sales/difered/difered.component';
import { GlobalTableComponent } from '../../../commons/modals/global-table/global-table.component';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { BusquedaTrasladoComponent } from './busqueda-traslado/busqueda-traslado.component';
import { ListBusquedaTrasladoComponent } from './list-busqueda/list-busqueda-traslado.component';
import { ModalDepartamentosComponent } from 'src/app/config/custom/modal-departamentos/modal-departamentos.component';
import { EncargadoTrasladoComponent } from './encargado-traslado/encargado-traslado.component';
import { ModalGruposComponent } from '../../configuracion/producto/modal-grupos/modal-grupos.component';
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';
import { DetallesProductoComponent } from '../traslado/detalles-producto/detalles-producto.component';
import { environment } from 'src/environments/environment';

@Component({
standalone: false,
  selector: 'app-traslado',
  templateUrl: './traslado.component.html',
  styleUrls: ['./traslado.component.scss']
})
export class TrasladoComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  permissions: any;
  processing: boolean = false;
  verifyRestore = false;
  toDatePicker: Date = new Date();
  dateConverter: any;
  dataUser: any;
  flagBtnDired: any = false;
  arrayCustomer: any = [];
  arrayCustomerAux: any;
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
  tieneCustodio: boolean = false
  disabledBienes: boolean = false


  UserSelect: any;
  filtClient: any;
  moduloUser: any = "";

  fecha:any;
  num_point_emision: any;
  validate_cupo: any = false;
  disabled: any = false;

  today: any;
  id_traslado: any
  fotos: any = [];
  fotosAux: any = [];
  fotosEliminar: any = [];
  productoFotos = [];

  descripcionTraslado: any = "";


  arrayTrasladoConfig: any = [];
  aplicarConfig: any = [];

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


    traslado = {

      tipo_traslado:null,
      fecha:moment(this.toDatePicker).format('YYYY-MM-DD'),
      num_doc:null,
      fk_id_departamento_recibe:null,
      desarrollo:null,
      observaciones:null,
      custodio:null,
      id_custodio:null,
      nombre_departamento_custodio:null,
      fk_departamento_custodio:null,
      nombre_cargo_custodio:null,
      entregado:null,
      id_entregado:null,
      nombre_persona_entregado:null,
      nombre_departamento_entregado:null,
      nombre_cargo_entregado:null,
      recibido:null,
      id_recibido:null,
      nombre_departamento_recibido:null,
      nombre_cargo_recibido:null,
      nota:null,
      responsable:null,
      id_responsable:null,
      nombre_departamento_responsable:null,
      fk_departamento_responsable: null,
      nombre_cargo_responsable:null,
      fecha_devolucion:null,
      doc_ref_informe_tecnico:null,
      doc_devolucion_sistemas:null,
      ubicacion_final:null,
      estado:null,
      informe_tecnico:null,
      elabora: null,
      id_elabora:null,
      nombre_departamento_elabora:null,
      nombre_cargo_elabora:null,
      verifica: null,
      id_verifica:null,
      nombre_departamento_verifica:null,
      nombre_cargo_verifica:null,
      id_custodio_origen:null,
      custodio_origen:null,
      nombre_departamento_custodio_origen: null,
      nombre_cargo_custodio_origen : null
    }

    estadoList = [

      {value: "B",label: "Bueno"},
      {value: "R",label: "Regular"},
      {value: "M",label: "Mal estado"}

    ]
    estadosTraslado = [

      {value: "E",label: "Emitido"},
      {value: "A",label: "Aprobado"},
      {value: "N",label: "Negado"}

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
  tipoTraslado: any = []


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
isNew: boolean = true;

codigoActa:any;

  constructor(
    private commonServices: CommonService,
    private commonVarServices: CommonVarService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private invService: TrasladoService,
    private socket: Socket
  ) {
    this.commonVarServices.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })
    this.commonVarServices.selectSubGrupo.asObservable().subscribe(
      (res) => {
        this.subgrupo = res
        console.log(this.subgrupo)
        this.listaProducto.fk_subgrupo = this.subgrupo.id_subgrupo_producto
        this.lcargando.ctlSpinner(false)
        this.disabled=false;
        this.agregaProduct=false;
      }
    )
    this.commonVarServices.encargadoSelect.asObservable().subscribe(
      (res)=>{
        console.log(res);
        this.UserSelect = res['dt']['emp_full_nombre'];
        if(res['tipo']==1){
          Object.assign(
            this.traslado,
            {
              id_recibido: res['recibido']['id_empleado'],
              recibido: res['recibido']['emp_full_nombre'],
              nombre_departamento_recibido: res['recibido']['departamento']['dep_nombre'],
              nombre_cargo_recibido: res['recibido']['cargos']['car_nombre'],
              id_departamento_custodio: res['recibido']['departamento']['id_departamento'],
            }
          )
        }else if(res['tipo']==2){
          this.traslado.id_custodio= res['dt']['id_empleado'];
          this.traslado.custodio = res['dt']['emp_full_nombre'];
          this.traslado.nombre_departamento_custodio = res['dt']['departamento']['dep_nombre'];
          this.traslado.fk_departamento_custodio = res['dt']['departamento']['id_departamento'];
          this.traslado.nombre_cargo_custodio = res['dt']['cargos']['car_nombre'] == null ? 'Sin cargo' : res['dt']['cargos']['car_nombre'];
        }else if(res['tipo']==3){
          this.traslado.id_entregado= res['dt']['id_empleado'];
          this.traslado.entregado = res['dt']['emp_full_nombre'];
          this.traslado.nombre_departamento_entregado = res['dt']['departamento']['dep_nombre'];
          this.traslado.nombre_cargo_entregado = res['dt']['cargos']['car_nombre'];
        }else if(res['tipo']==4){
          this.traslado.id_responsable= res['responsable']['id_empleado'];
          this.traslado.responsable = res['responsable']['emp_full_nombre'];
          this.traslado.fk_departamento_responsable = res['responsable']['departamento']['id_departamento'];
          this.traslado.nombre_departamento_responsable = res['responsable']['departamento']['dep_nombre'];
          this.traslado.nombre_cargo_responsable = res['responsable']['cargos']['car_nombre'];
        }else if(res['tipo']==5){
          this.traslado.id_elabora= res['elabora']['id_empleado'];
          this.traslado.elabora = res['elabora']['emp_full_nombre'];
          this.traslado.nombre_departamento_elabora = res['elabora']['departamento']['dep_nombre'];
          this.traslado.nombre_cargo_elabora = res['elabora']['cargos']['car_nombre'];
        }else if(res['tipo']==6){
          this.traslado.id_verifica= res['verifica']['id_empleado'];
          this.traslado.verifica = res['verifica']['emp_full_nombre'];
          this.traslado.nombre_departamento_verifica = res['verifica']['departamento']['dep_nombre'];
          this.traslado.nombre_cargo_verifica = res['verifica']['cargos']['car_nombre'];
        }else if(res['tipo']==7){
          this.traslado.id_custodio_origen= res['custodio_origen']['id_empleado'];
          this.traslado.custodio_origen = res['custodio_origen']['emp_full_nombre'];
          this.traslado.nombre_departamento_custodio_origen = res['custodio_origen']['departamento']['dep_nombre'];
          this.traslado.nombre_cargo_custodio_origen = res['custodio_origen']['cargos']['car_nombre'];
        }
        this.filtClient = {
          id_personal: res['dt']['id_empleado'],
          nombres: res['dt']['emp_full_nombre']

        }

        if(this.traslado.tipo_traslado==7){
          this.disabledBienes=true
          this.buscarBienesCustodiados();
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

    this.commonVarServices.TrasladoBienes.asObservable().subscribe(
      (res) => {
       console.log(res)

        this.disabled=true;
        this.isNew = false;
        //this.num_doc= res.num_doc;
        this.id_traslado= res.id_traslado;
        this.traslado = res;
        this.traslado.recibido = res['nombre_persona_recibido'];
        this.traslado.custodio = res['nombre_persona_custodio'];
        this.traslado.entregado = res['nombre_persona_entregado'];
        this.traslado.responsable = res['nombre_persona_responsable'];
        this.traslado.elabora = res['nombre_persona_elabora'];
        this.traslado.verifica = res['nombre_persona_verifica'];
        this.traslado.custodio_origen = res['nombre_custodio_origen'];

        this.vmButtons[3].habilitar = false;
        if(res.departamento!=null){
          this.departamentoSelect.dep_nombre = res.departamento.dep_nombre;
        }
        console.log(res.fotos)
        if (res.fotos.length > 0) {
          this.fotos = res.fotos;
        }



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

        this.arrayTrasladoConfig.forEach(e => {
          if(this.traslado.tipo_traslado==e.tipo_traslado_codigo){
            this.aplicarConfig = e
          }
        });
      }
    )
    //this.commonVarServices.selectProducto.asObservable().subscribe(
      this.invService.listaBienes$.subscribe(
      (res) => {
        console.log(res)
        this.agregaProduct=false
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
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsTrasBien", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsTrasBien", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsTrasBien",paramAccion: "",boton: { icon: "far fa-search", texto: "BUSCAR" },permiso: true,showtxt: true,showimg: true,showbadge: false,clase: "btn btn-primary boton btn-sm",habilitar: false},
      { orig: "btnsTrasBien",paramAccion: "",boton: { icon: "fa fa-print", texto: "IMPRIMIR" },permiso: true,showtxt: true,showimg: true,showbadge: false,clase: "btn btn-warning btn-sm",habilitar: true},
      { orig: "btnsTrasBien", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    if(this.traslado.tipo_traslado==5){
      this.traslado.fecha_devolucion= moment(this.toDatePicker).format('YYYY-MM-DD');
    }


    this.validatePermission();
    setTimeout(() => {
      this.getTrasladoConfig();
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

  custodioCheck(event){
    //console.log(event);
    console.log(this.tieneCustodio)
    if(!this.tieneCustodio){
      console.log('tiene custodio')
    }else{
      console.log(' no tiene custodio')
    }
  }

  buscarBienesCustodiados(){
    (this as any).mensajeSpinner = "Cargando bienes...";
    this.lcargando.ctlSpinner(true);
    let data = {
      id_custodio: this.traslado.id_custodio
    }
    this.invService.getBienesCustodiados(data).subscribe(res => {
      console.log(res["data"])

      //this.fotosAux = res["data"]
      res["data"].forEach(e => {
        let items =
        {
          action: true,
          nombre: e.nombre,
          codigoProducto : e.codigoproducto,
          precio_normal:e.PVP,
          stock: e.stock,
          quantity: 1,
          price: parseFloat(e.costo),
          totalAux: 0.00,
          costo:parseFloat(e.costo),
          id_producto:e.id_producto,
          id_grupo_producto:e.fk_grupo,
          id_subgrupo_producto:0,
          tipo_bien:e.detalle_traslado?.tipo_bien,
          estado: e.detalle_traslado?.estado

        };
        this.dataProducto.push(items);
      })

      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }
  addItems(data) {

    // if(this.dataProducto.length > 0 ){
    //   let bien = this.dataProducto.filter(e => { e.codigoProducto == data.codigoproducto})
    //   console.log(bien)
    // }
    if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      if(this.estado_producto==undefined){
        this.toastr.info("Debe seleccionar un estado");
      }
      else{
        let items =
        {
          action: true,
          nombre: data.nombre,
          codigoProducto : data.codigoproducto,
          precio_normal:data.PVP,
          stock: data.stock,
          quantity: 1,
          price: parseFloat(data.costo),
          totalAux: 0.00,
          costo:parseFloat(data.costo),
          id_producto:data.id_producto,
          id_grupo_producto:this.claseSelect.id_grupo_productos,
          id_subgrupo_producto:this.subgrupo.id_subgrupo_producto,
          tipo_bien:this.grupo.tipo_bien,
          estado: this.estado_producto

        };
        this.dataProducto.push(items);
        console.log(this.dataProducto)
        this.disabledCantidad=true;
        this.buscarFotoProducto(data.id_producto)
      }

    }
  }
  buscarFotoProducto(id_producto){
    console.log(id_producto);
    (this as any).mensajeSpinner = "Cargando foto...";
    this.lcargando.ctlSpinner(true);
    let data = {
      id_producto: id_producto
    }
    this.invService.getFotoProducto(data).subscribe(res => {
      console.log(res["data"])
      //this.productoFotos= res["data"]
      // this.fotos.push(res["data"])
      res["data"].forEach(e => {
        Object.assign(e,{id_traslado_fotos:0,recurso:e.recurso});
      });
      this.fotosAux = res["data"]
      console.log(this.fotosAux)
      this.fotosAux.forEach(e => {
        this.fotos.push(e)
      });
      console.log(this.fotos)
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
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

  getTrasladoConfig() {
		this.invService.getTrasladoConfig().subscribe(res => {

      this.arrayTrasladoConfig = res['data']
      console.log(res)

		}, error => {
			this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

  getCatalogos() {
    let data = {
      params: "'INV_TIPO_BIEN','INV_TIPO_TRASLADO' "
    }
    this.invService.getCatalogos(data).subscribe(res => {
      // this.dataBuy.tipo_pago = res['data']['TIPO PAGO'];
      // this.dataBuy.forma_pago = res['data']['FORMA PAGO'];
      this.catalog = res["data"]["INV_TIPO_BIEN"];
      //this.catalog = res["data"]["INV_TIPO_BIEN"].filter(c => {c.valor != 'EXI'});
     this.catalog_filter = this.catalog.filter(e => e.valor != 'EXI')
      this.tipoTraslado = res["data"]["INV_TIPO_TRASLADO"];
      this.getCustomers();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }
  mostrarCampos(event){
    console.log(event);
    this.disabledBienes = false;
    this.aplicarConfig = []
    // if(event=='1'){
    //   this.codigoActa='ATBI-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[0]
    //   // console.log(this.aplicarConfig)
    // }
    // else if(event=='2'){
    //   this.codigoActa='AERBA-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[1]
    //   // console.log(this.aplicarConfig)
    // }
    // else if(event=='3'){
    //   this.codigoActa='ADSBI-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[2]
    //   // console.log(this.aplicarConfig)
    // }
    // else if(event=='4'){
    //   this.codigoActa='ADIBI-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[3]
    //   // console.log(this.aplicarConfig)
    // }
    // else if(event=='5'){
    //   this.codigoActa='ADBEME-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[4]
    //   // console.log(this.aplicarConfig)
    // }
    // else if(event=='6'){
    //   this.codigoActa='ADUFE-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[5]
    //   // console.log(this.aplicarConfig)
    // }
    // else if(event=='7'){
    //   this.disabledBienes = true;
    //   this.codigoActa='AFDG-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[6]
    //   // console.log(this.aplicarConfig)
    // }
    // else if(event=='8'){
    //   this.codigoActa='ADUFD-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[7]
    //   // console.log(this.aplicarConfig)
    // }
    // else if(event=='9'){
    //   this.codigoActa='ADUFF-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[8]
    //   // console.log(this.aplicarConfig)
    // }
    // else if(event=='10'){
    //   this.codigoActa='ACCA-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[9]
    //   // console.log(this.aplicarConfig)
    // }
    // else if(event=='11'){
    //   this.codigoActa='ACCDE-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[10]
    //   // console.log(this.aplicarConfig)
    // }
    // else if(event=='12'){
    //   this.codigoActa='ATBI-MDPL';
    //   // this.aplicarConfig = this.arrayTrasladoConfig[11]
    //   // console.log(this.aplicarConfig)
    // }

    this.arrayTrasladoConfig.forEach(e => {
      if(event==e.tipo_traslado_codigo){
        this.aplicarConfig = e
      }
    });
    this.codigoActa = this.aplicarConfig.documento_prefix
    console.log(this.aplicarConfig)
    console.log(this.codigoActa)


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
    if(event){
      this.disabledSubGrupo = false;
      this.agregaProduct=false;
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
      this.dataProducto = [{ nombre: null, codigoProducto: null, marca: null, stock: 0.00, cantidad_reservada: 0.00, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }];
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
  const modal = this.modalService.open(ListBusquedaTrasladoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
  // modal.componentInstance.contr = this.contribuyenteActive;
  // modal.componentInstance.permissions = this.permissions;
  modal.componentInstance.validate = 'EB'
  modal.componentInstance.claseSelect = this.subgrupo
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

    this.id_traslado=null;
    this.isNew = true;

    this.traslado = {
      tipo_traslado:null,
      fecha:moment(this.toDatePicker).format('YYYY-MM-DD'),
      num_doc:null,
      fk_id_departamento_recibe:null,
      desarrollo:null,
      observaciones:null,
      custodio:null,
      id_custodio:null,
      nombre_departamento_custodio:null,
      fk_departamento_custodio:null,
      nombre_cargo_custodio:null,
      entregado:null,
      id_entregado:null,
      nombre_persona_entregado:null,
      nombre_departamento_entregado:null,
      nombre_cargo_entregado:null,
      recibido:null,
      id_recibido:null,
      nombre_departamento_recibido:null,
      nombre_cargo_recibido:null,
      nota:null,
      responsable:null,
      id_responsable:null,
      nombre_departamento_responsable:null,
      fk_departamento_responsable:null,
      nombre_cargo_responsable:null,
      fecha_devolucion:moment(this.toDatePicker).format('YYYY-MM-DD'),
      doc_ref_informe_tecnico:null,
      doc_devolucion_sistemas:null,
      ubicacion_final:null,
      estado:null,
      informe_tecnico:null,
      elabora: null,
      id_elabora:null,
      nombre_departamento_elabora:null,
      nombre_cargo_elabora:null,
      verifica: null,
      id_verifica:null,
      nombre_departamento_verifica:null,
      nombre_cargo_verifica:null,
      id_custodio_origen:null,
      custodio_origen:null,
      nombre_departamento_custodio_origen: null,
      nombre_cargo_custodio_origen : null
    }

    this.disabledCantidad = false;
    this.agregaProduct=true;
    this.disabledSubGrupo = true;
    this.disabledGrupo = true;
    this.departamentoSelect.dep_nombre="",
    this.grupo.tipo_bien=0,
    this.UserSelect = "",
    this.claseSelect ="",
    this.subgrupo.descripcion = "",
    this.dataProducto =[],
    this.bodega=0;
    this.num_doc="";
    this.disabled= false;

    this.fotos = [];
    this.fotosEliminar = [];

    this.productoFotos = [];
    this.aplicarConfig = [];

    this.actions.dComponet = false;
    this.disabledBienes = false;
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
    //console.log(this.fotos)

    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
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
      if (this.departamentoSelect.dep_nombre == "" || this.departamentoSelect.dep_nombre == undefined) {
        this.toastr.info("Debe seleccionar un departamento");
        flag = true;
      }
      else if (this.aplicarConfig.fld_custodio_origen == true && this.traslado.custodio_origen == undefined) {
        this.toastr.info("Debe seleccionar un Custodio de Origen");
        flag = true;
      }
      else if (this.aplicarConfig.fld_entregado_por == true && this.traslado.entregado == undefined) {
        this.toastr.info("El campo Entregado por no puede ser vacio");
        flag = true;
      }
      else if (this.aplicarConfig.fld_funcionario_responsable == true && this.traslado.responsable == undefined) {
        this.toastr.info("Debe seleccionar un Funcionario Responsable");
        flag = true;
      }
      else if (this.aplicarConfig.fld_verificacion_usuario == true && this.traslado.verifica == undefined) {
        this.toastr.info("El campo Verificado por no puede ser vacio");
        flag = true;
      }
      else if (this.aplicarConfig.fld_elaborado_por == true && this.traslado.elabora== undefined) {
        this.toastr.info("El campo Elaborado Por no puede ser vacio");
        flag = true;
      }
      else if (this.aplicarConfig.fld_fecha_devolucion == true && this.traslado.fecha_devolucion== undefined) {
        this.toastr.info("Debe seleccionar una Fecha devolución");
        flag = true;
      }
      else if (this.aplicarConfig.fld_documento_referencia == true && (this.traslado.doc_ref_informe_tecnico== undefined || this.traslado.doc_ref_informe_tecnico== '')) {
        this.toastr.info("Debe seleccionar una Fecha devolución");
        flag = true;
      }
      else if (this.aplicarConfig.fld_doc_devolucion == true && (this.traslado.doc_devolucion_sistemas== undefined || this.traslado.doc_devolucion_sistemas== '')) {
        this.toastr.info("El campo Doc. devolución sistemas no puede ser vacio");
        flag = true;
      }
      else if (this.aplicarConfig.fld_destino_final == true && (this.traslado.ubicacion_final== undefined || this.traslado.ubicacion_final== '')) {
        this.toastr.info("El campo Doc. devolución sistemas no puede ser vacio");
        flag = true;
      }
      else if (this.aplicarConfig.fld_estado == true && (this.traslado.estado== undefined || this.traslado.estado== '')) {
        this.toastr.info("Debe seleccionar un estado");
        flag = true;
      }
      else if (this.aplicarConfig.fld_informe_tecnico == true && (this.traslado.informe_tecnico== undefined || this.traslado.informe_tecnico== '')) {
        this.toastr.info("El campo Informe técnico no puede ser vacio");
        flag = true;
      }
      else if (this.aplicarConfig.fld_desarrollo == true && (this.traslado.desarrollo== undefined || this.traslado.desarrollo== '')) {
        this.toastr.info("El campo Desarrollo no puede ser vacio");
        flag = true;
      }
      else if (this.aplicarConfig.fld_nota == true && (this.traslado.nota== undefined || this.traslado.nota== '')) {
        this.toastr.info("El campo Nota no puede ser vacio");
        flag = true;
      }
      else if (this.aplicarConfig.fld_observacion == true && (this.traslado.observaciones == undefined || this.traslado.observaciones== '')) {
        this.toastr.info("El campo Observación no puede ser vacio");
        flag = true;
      }
      else if(this.dataProducto[0]==undefined){
        this.toastr.info("Debe seleccionar productos");
        flag = true;
      }else if (this.dataProducto[0].codigoProducto == null && this.dataProducto.length == 1) {
        this.toastr.info("Ingrese al menos un producto");
        flag = true;
      }


      // else if (this.UserSelect == undefined) {
      //   this.toastr.info("Debe seleccionar un responsable");
      //   flag = true;
      // }
      else if(this.grupo.tipo_bien === 'EXI'){
       if(this.dataProducto.length != 0 ) {

            for (let index = 0; index < this.dataProducto.length; index++) {
              if (this.dataProducto[index].quantity <= 0 && this.dataProducto[index].action &&  this.grupo.tipo_bien === 'EXI') {
                this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0");
                flag = true; break;
              } else if (this.dataProducto[index].price <= 0 && this.dataProducto[index].action &&  this.grupo.tipo_bien === 'EXI') {
                this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser 0");
                flag = true; break;
              }
              else if (this.dataProducto[index].stock <= 0 && this.dataProducto[index].action &&  this.grupo.tipo_bien === 'EXI') {
                this.toastr.info("Revise el stock de los productos, no puede estar vacio o ser 0");
                flag = true; break;
            }else if (this.dataProducto[index].quantity > this.dataProducto[index].stock &&  this.grupo.tipo_bien === 'EXI') {
              this.toastr.info("Revise la cantidad de los productos, no puede ser mayor al campo stock");
              flag = true; break;
            }else if (this.dataProducto[index].tipo_bien != this.grupo.tipo_bien) {
              this.toastr.info("No puede tener productos de diferente Tipo de bien");
              flag = true; break;
            }
          }
        }
    }
    (!flag) ? resolve(true) : resolve(false);
  });
  }


  async saveSales() {

    let notify = `Se ha generado una nuevo Egreso de Bodega por el usuario ${this.dataUser.nombre}`;
    let productSend = [];
    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 2);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];

    this.dataProducto.forEach(element => {
      if (element.action) {
        productSend.push(element);
      }
    });

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
    console.log(productSend)


    (this as any).mensajeSpinner = "Guardando traslado de bienes...";
    this.lcargando.ctlSpinner(true);
    let res = await this.validatePrice(productSend).then(res => {
      localStorage.removeItem('dataProductsInvoice');
      this.textNotificationSend = ((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1) ? this.textNotificationSend + this.textNotification : this.textNotificationSend + "";
      this.textNotificationSend = (resultado) ? this.textNotificationSend + " Existen uno o varios productos con stock menor a la cantidad solicitada. " : this.textNotificationSend + "";
      this.textNotificationSend = (res) ? this.textNotificationSend + " Existen inconcistencia en los precios. " : this.textNotificationSend + "";
      this.textNotificationSend = (this.validate_cupo) ? this.textNotificationSend + ` Cliente ${this.customer.razon_social} no tiene suficiente cupo para el crédito ` : this.textNotificationSend + "";

      this.tipoTraslado.map(e =>{
        if(e.valor == this.traslado.tipo_traslado){
          this.descripcionTraslado = e.descripcion
        }
      });
      console.log(this.descripcionTraslado)

      if(this.traslado.tipo_traslado=='01'){
        this.codigoActa='ATBI-MDPL';
      }
      else if(this.traslado.tipo_traslado=='02'){
        this.codigoActa='AERBA-MDPL';
      }
      else if(this.traslado.tipo_traslado=='03'){
        this.codigoActa='ADSBI-MDPL';
      }
      else if(this.traslado.tipo_traslado=='04'){
        this.codigoActa='ADIBI-MDPL';
      }
      else if(this.traslado.tipo_traslado=='05'){
        this.codigoActa='ADBEME-MDPL';
      }
      else if(this.traslado.tipo_traslado=='06'){
        this.codigoActa='ADUFE-MDPL';
      }
      else if(this.traslado.tipo_traslado=='07'){
        this.disabledBienes = true;
        this.codigoActa='AFDG-MDPL';
      }
      else if(this.traslado.tipo_traslado=='08'){
        this.codigoActa='ADUFD-MDPL';
      }
      else if(this.traslado.tipo_traslado=='09'){
        this.codigoActa='ADUFF-MDPL';
      }
      else if(this.traslado.tipo_traslado=='10'){
        this.codigoActa='ACCA-MDPL';
      }
      else if(this.traslado.tipo_traslado=='11'){
        this.codigoActa='ACCDE-MDPL';
      }
      else if(this.traslado.tipo_traslado=='12'){
        this.codigoActa='ATBI-MDPL';
      }

      let data = {
        list_product: productSend,
        id_user: this.dataUser.id_usuario,
        tip_doc: this.dataBuy.idTipDocSelect,
        ip: this.commonServices.getIpAddress(),
        accion: `Registro de Traslado de Bienes ${this.customer['asesor']['nombre']}`,
        id_controlador: myVarGlobals.fGBEgreBodega,
        notifycation: (!res && !resultado && !this.validate_cupo && !((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1)) ? notify : `${notify}, esta factura necesita ser aprobada`,
        bodega: this.bodega,
        fk_id_departamento_recibe:this.departamentoSelect.id_departamento,
        traslado:this.traslado,
        tipo_bien: this.grupo.tipo_bien,
        fotos: this.fotos.filter(e => e.id_traslado_fotos === 0),
        fotosEliminar: this.fotosEliminar,
        descripcion_traslado:this.descripcionTraslado,
        codigo_secuencial_acta: this.codigoActa

      }
       console.log(data);
      this.invService.saveTrasladoBienes(data).subscribe(
        res => {
        if (res["status"] == 1) {
          this.lcargando.ctlSpinner(false);
          Swal.fire({
            title: 'Proceso exitoso!!',
            text: `Su traslado de bienes se realizo exitosamente`,
            icon: 'success',
            confirmButtonColor: '#4DBD74',
            confirmButtonText: 'Aceptar'
          });

          console.log(res)
          this.traslado=res['data'];
          this.arrayTrasladoConfig.forEach(e => {
            if(res['data']['tipo_traslado']==e.tipo_traslado_codigo){
              this.aplicarConfig = e
            }
          });
          this.traslado.custodio_origen = res['data']['nombre_custodio_origen']
          this.traslado.recibido = res['data']['nombre_persona_recibido'];
          this.traslado.custodio = res['data']['nombre_persona_custodio'];
          this.traslado.entregado = res['data']['nombre_persona_entregado'];
          this.traslado.responsable = res['data']['nombre_persona_responsable'];
          this.traslado.elabora = res['data']['nombre_persona_elabora'];
          this.traslado.verifica = res['data']['nombre_persona_verifica'];
          this.id_traslado=res['data'].id_traslado;
          console.log(this.traslado)
          this.disabled=true;
          this.actions.dComponet = false;
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = false;
          this.imprimirComprobante()

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
        this.imprimirComprobante();
        break;
      case "CANCELAR":
        this.cancelSales();
        break;
    }
  }
  newOrder() {
    this.actions.dComponet = true;
    this.actions.btncancelar = true;
    this.actions.btnGuardar = true;
    this.actions.btnNuevo = true;
    this.disabledBienes = false;
    this.disabled = false;

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;

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
      console.log(this.fotos)
    } else if ((archivos.length + this.fotos.length) > 5) {
      this.toastr.warning("No puede subir más de 5 fotos", "¡Atención!");
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

  imprimirComprobante(){
    console.log(this.traslado.tipo_traslado)
    console.log(this.id_traslado)
    if(this.traslado.tipo_traslado==1 || this.traslado.tipo_traslado=="1"){
      window.open(environment.ReportingUrl + "rep_bienes_traslado_01.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_traslado , '_blank')

    }else if(this.traslado.tipo_traslado==2 || this.traslado.tipo_traslado=="2"){
      window.open(environment.ReportingUrl + "rep_bienes_traslado_02.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_traslado , '_blank')

    }else if(this.traslado.tipo_traslado==3 || this.traslado.tipo_traslado=="3"){
      window.open(environment.ReportingUrl + "rep_bienes_traslado_03.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_traslado , '_blank')

    }else if(this.traslado.tipo_traslado==4 || this.traslado.tipo_traslado=="4"){
      window.open(environment.ReportingUrl + "rep_bienes_traslado_04.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_traslado , '_blank')

    }else if(this.traslado.tipo_traslado==5 || this.traslado.tipo_traslado=="5"){
      window.open(environment.ReportingUrl + "rep_bienes_traslado_05.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_traslado , '_blank')

    }else if(this.traslado.tipo_traslado==6 || this.traslado.tipo_traslado=="6"){
      window.open(environment.ReportingUrl + "rep_bienes_traslado_06.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_traslado , '_blank')

    }else if(this.traslado.tipo_traslado==7 || this.traslado.tipo_traslado=="7"){
      window.open(environment.ReportingUrl + "rep_bienes_traslado_07.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_traslado , '_blank')

    }else if(this.traslado.tipo_traslado==8 || this.traslado.tipo_traslado=="8"){
      window.open(environment.ReportingUrl + "rep_bienes_traslado_08.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_traslado , '_blank')

    }else if(this.traslado.tipo_traslado==9 || this.traslado.tipo_traslado=="9"){
      window.open(environment.ReportingUrl + "rep_bienes_traslado_09.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_traslado , '_blank')

    }else if(this.traslado.tipo_traslado==10 || this.traslado.tipo_traslado=="10"){
      window.open(environment.ReportingUrl + "rep_bienes_traslado_10.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_traslado , '_blank')

    }else if(this.traslado.tipo_traslado==11 || this.traslado.tipo_traslado=="11") {
      window.open(environment.ReportingUrl + "rep_bienes_traslado_11.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + this.id_traslado , '_blank')
    }

      //window.open(environment.ReportingUrl + "rep_comprobante_egreso_bodega.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_egreso_bodega=" + this.id_egreso_bodega , '_blank')
  }

  expandListDocumentosRec() {

    const modal = this.modalService.open(BusquedaTrasladoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
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

  modalGrupos() {

    let modal = this.modalService.open(ModalGruposComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true
    modal.componentInstance.verifyRestore = this.verifyRestore;
    modal.componentInstance.claseSelect = this.claseSelect;

    //this.generaActionRawMaterial()
  }
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




}
