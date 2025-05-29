import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { SeguridadService } from '../../../panel-control/accesos/seguridad/seguridad.service';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { IngresoBodegaService } from './ingreso-bodega.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { AnexosDocComponent } from '../../../commons/modals/anexos-doc/anexos-doc.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ShowOrderComponent } from './show-order/show-order.component';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ListDocumentosComponent } from './list-documentos/list-documentos.component';
import { GlobalTableComponent } from '../../../commons/modals/global-table/global-table.component'
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';
import { EncargadoComponent } from 'src/app/config/custom/encargado/encargado.component';
import { ModalSolicitudComponent } from './modal-solicitud/modal-solicitud.component';
import { ModalSolicitudCatComponent } from './modal-solicitud-cat/modal-solicitud-cat.component';
import { ModalGruposComponent } from './modal-grupos/modal-grupos.component';
import { ModalCodigoBienesComponent } from './modal-codigo-bienes/modal-codigo-bienes.component';
import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';
import { ThisReceiver } from '@angular/compiler/src/expression_parser/ast';
import { data } from 'jquery';
import { takeUntil } from 'rxjs/operators';
import { ModalProductoDetallesComponent } from './modal-producto-detalles/modal-producto-detalles.component';
declare const $: any;

@Component({
standalone: false,
  selector: 'app-ingreso-bodega',
  templateUrl: './ingreso-bodega.component.html',
  styleUrls: ['./ingreso-bodega.component.scss']
})
export class IngresoBodegaComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  processing: any;
  dataEmpresa: any = {};
  dataUser: any;
  descriptionAnulated: any;
  arrayBodega: Array<any> = [];

  arrayProveedor: any;
  arrayUsers: any;
  permisions: any;
  toDatePicker: Date = new Date();
  fecha: any = moment(this.toDatePicker).format('YYYY-MM-DD HH:mm:ss');

  /*user*/
  UserSelect: any;
  moduloUser: any = "";
  tipoProceso: any = "";
  flagUser: any = true;

  /*edit users*/
  editname: any;
  editPerfil: any;
  editCorreo: any;
  observacion: any;
  filtClient: any;
  bodega: any = null;
  objectoProceso: any;
  valorReferencia: any;
  donaciones: any = false;
  tipoIngreso: any;
  ingresoDepartamento: any;
  id_solicitud: any;
  departamento: any = [];
  catalog: any = [];
  listaProductos: any = []
  productosIds: any = []
  numero_ingreso_bodega: any;
  estado: any;
  /*providers*/
  providersSelec: any = 0;
  nomComerPro: any;
  direccionPro: any;
  num_partida: any;
  fk_idp: any;
  numProceso: any;
  lineaPro: any;
  telefonoPro: any;
  wsPro: any;
  cliente: any;
  fk_bodega: any;
  nombreBodega: any;

  id_ordenes: any = 0; 
  num_orden: any = '';  
  valor_orden: any = 0;  

  /*productos*/
  dataProducto = [];
  arrayProductos: any;
  //productSelect:any;
  id: any;
  paginate: any;

  /*totales*/
  iva: any;
  ivaConverter: any;
  dataTotales: any = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
  condiciones: any;
  filters: any = [];
  fields: Object = { text: 'sec', value: 'id' };
  waterMark: string = '  Filtros de solicitud';
  selectFilters: any;
  anexoAdd: any = [];
  emailExist: any;

  /*data table */
  validaDtOrder: any = false;
  dataOrder: any = [];
  contador: any = 0;
  NexPermisions: any;
  latestStatus: any;
  varDeleteOrde: any;
  position: any = false;
  prefict: any;
  vmButtons: any;

  claseSelect: any = 0;
  listaIngreso: any = []
  secuencias: any
  productoCodigo: any

  listaProducto: any = {
    fk_grupo: 0,
    fk_subgrupo: 0,
    nombre: "",
    codigoBienes: "",
    udmcompra: "",
    stock: 0,
    codigoProducto: "",
    costo: 0
  }
  verifyRestore = false;
  subgrupo: any = [];
  codigoBienesDescripcion: any;
  dataUDM: Array<any> = [];
  catalogoDisabled = true;
  grupo_descripcion: any;
  codigo_grupo: any
  grupo_tipo_bien: any

  estadoList = [
    { value: "P", label: "PENDIENTE" },
    { value: "C", label: "CERRADO" }
  ]

  tipoProcesoList = [
    { value: "Contratacion", label: "Contratación" },
    { value: "Infimas", label: "Infimas" },
    { value: "Catalogo Electronico", label: "Catalogo Electrónico" }
  ]

  /*actions*/
  actions: any = {
    btnNuevo: false,
    btnGuardar: false,
    btnEnviar: false,
    btncancelar: false,
    btnDescargar: false,
    dComponet: false
  };
  deshabilitarTi: boolean = true
  deshabilitarItems: boolean = true
  bienDisabled: boolean = false

  /*validateBtnSave */
  btnSave: any = false;

  fileList: FileList;

  ingresoDisabled = false;
  adminCompras: string = ""
  producto_exi: any = [];
  totalValorItems: any = 0
  totalValorSolicitud: any = 0
  totalValorAprobado: any = 0
  deshabilitarCatalogo: boolean = true;

  proveedorActive: any = {
    razon_social: ""
  };

  ingreso_doc: any;
  centroCosto: any = []


  onDestroy$: Subject<void> = new Subject();
  fechaDocumento: string = moment().format('YYYY-MM-DD')

  constructor(private commonServices: CommonService,
    private seguridadServices: SeguridadService,
    private toastr: ToastrService,
    private router: Router,
    private ordenesServices: IngresoBodegaService,
    private modalService: NgbModal,
    private commonVarSrvice: CommonVarService,
    private cierremesService: CierreMesService,
    private socket: Socket) {
    this.commonVarSrvice.selectProveedorCustom.asObservable().subscribe(
      (res) => {

        this.proveedorActive = res;
        this.providersSelec = res.id_proveedor
        this.nomComerPro = res.nombre_comercial_prov;
        this.telefonoPro = res.telefono;
        console.log(this.providersSelec);

      }
    )

    this.commonVarSrvice.encargadoSelect.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res);
        this.UserSelect = res['emp_full_nombre'];
        this.filtClient = {
          id_personal: res['id_empleado'],
          nombres: res['emp_full_nombre']

        }
        this.moduloUser = res['cargos']['car_nombre']

      }
    )

    //this.commonVarSrvice.seleciconSolicitud.pipe(takeUntil(this.onDestroy$)).subscribe(
    this.ordenesServices.listaSolicitudes$.subscribe(
      (res) => {
        console.log(res);
        if(res.tipo=='COM'){
          if (res['data']['tipo_proceso'] == "Contratacion" || res['data']['tipo_proceso'] == "contratacion") {
            if (res['data']["administrador_cont"] != null) {
              this.adminCompras = res['data']['administrador_cont']['emp_full_nombre']
            }
            else {
              this.adminCompras = "No tiene administrador de compras."
            }
          } else if (res['data']['tipo_proceso'] == "Infimas") {
            if (res['data']["administrador_inf"] != null) {
              this.adminCompras = res['data']['administrador_inf']['emp_full_nombre']
            }
            else {
              this.adminCompras = "No tiene administrador de compras"
            }
          }
          else {
            this.adminCompras = "No hay administrador"
          }

          this.id_solicitud = res['data']['id_solicitud']
          this.numProceso = res['data']['num_solicitud']
          this.num_partida = res['data']['idp']
          this.fk_idp = res['data']['fk_idp']
          this.objectoProceso = res['data']['descripcion']
          this.tipoProceso = res['data']['tipo_proceso']

         /*  if (res['data']['tipo_proceso'] == "Contratacion" || res['data']['tipo_proceso'] == "contratacion") {
            this.valorReferencia = res['data']['con_valor']
          } else if (res['data']['tipo_proceso'] == 'Infimas') {
            this.valorReferencia = res['data']['inf_valor']
          }  */
          this.valorReferencia = res.data.valor

          //this.dataOrder = res['detalles']
        this.dataOrder = res['data']['detalles'];
        console.log(this.dataOrder)
        let pagoTotalSoli = 0;
        let pagoTotalApro = 0;

        this.dataOrder.forEach(e => {
          if(e.precio_aprobado==undefined){
            e.precio_aprobado = 0
          }
          pagoTotalSoli += +e.precio_cotizado;
          pagoTotalApro += +e.precio_aprobado;
        });
        this.totalValorSolicitud = pagoTotalSoli
        this.totalValorAprobado = pagoTotalApro

        }

        if(res.tipo=='CAT'){
       
          
          this.valor_orden = res['data']['valor_orden']
          if (res['data']['solicitud']['administrador'] != null) {
            this.adminCompras = res['data']['solicitud']['administrador']['emp_full_nombre']
          }
          else {
            this.adminCompras = "No tiene administrador de compras"
          }

          this.id_solicitud = res['data']['solicitud']['id_solicitud']
          this.numProceso = res['data']['solicitud']['num_solicitud']
          this.num_partida = res['data']['solicitud']['idp']
          this.fk_idp = res['data']['solicitud']['fk_idp']
          this.objectoProceso = res['data']['solicitud']['descripcion']
          this.id_ordenes = res['data']['id_ordenes']
          this.num_orden = res['data']['num_orden']
          this.valor_orden = res['data']['valor']

        

             //this.dataOrder = res['detalles']
        this.dataOrder = res['data']['solicitud']['detalles'];
        console.log(this.dataOrder)
        let pagoTotalSoli = 0;
        let pagoTotalApro = 0;

        this.dataOrder.forEach(e => {
          if(e.precio_aprobado==undefined){
            e.precio_aprobado = 0
          }
          pagoTotalSoli += +e.precio_cotizado;
          pagoTotalApro += +e.precio_aprobado;
        });
        this.totalValorSolicitud = pagoTotalSoli
        this.totalValorAprobado = pagoTotalApro
        this.valorReferencia = pagoTotalSoli
        }
      }
    )


    this.commonVarSrvice.setDocOrder.pipe(takeUntil(this.onDestroy$)).subscribe(res => {
      this.anexoAdd = [];
      this.anexoAdd = res;
    })

    this.commonVarSrvice.selectInventario.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res: any) => {
        console.log(res)
        this.fechaDocumento = res.fecha
        this.ingreso_doc = res;
        this.vmButtons[5].habilitar = false;
        this.listaIngreso = res
        this.estado = res['estado']
        this.id = res['id']
        this.numero_ingreso_bodega = res['numero_ingreso_bodega']
        this.providersSelec = res['fk_proveedor']
        this.telefonoPro = res['proveedor']['telefono']
        this.nomComerPro = res['proveedor']['razon_social']
        this.direccionPro = res['proveedor']['direccion']
        this.wsPro = res['proveedor']['website']
        // this.UserSelect = res['cliente'][0]['id_personal']
        // this.emailUser = res['cliente'][0]['email']
        // this.moduloUser = res['cliente'][0]['cargo']
        this.bodega = res['bodega']['nombre']

        this.numProceso = res['num_proceso']
        this.num_partida = res['num_partida']
        this.fk_idp = res['fk_idp']
        this.objectoProceso = res['objeto_proceso']
        this.valorReferencia = parseFloat(res['valor_referencia'] ?? 0)
        this.tipoProceso = res['tipo_proceso']
        this.UserSelect = res['nombre_cli'];
        this.moduloUser = res['cargo_cli']
        this.tipoIngreso = res['tipo_ingreso']
        //this.ingresoDepartamento = res['departamento']
        this.observacion = res['observaciones_cli']
        this.lineaPro = res['factura']
        this.id_solicitud = res['id_solicitud']
        this.bodega = res['fk_bodega']
        this.cliente = res['fk_cli']
        this.fk_bodega = res['fk_bodega']
        this.nombreBodega = res['bodega']['nombre']

        if(res['tipo_proceso']=='Catalogo Electronico'){
          this.num_orden= res.ordenes?.num_orden
          this.valor_orden= res.ordenes?.valor
          this.id_ordenes= res.ordenes?.id_ordenes
        }else {
          this.num_orden= ''
          this.valor_orden= 0
          this.id_ordenes= 0
        }

        if (res.solicitud.length > 0) {
          this.dataOrder = res['solicitud'][0]['detalles'];
          console.log(this.dataOrder)
        }
        
        // let pagoTotalApro = 0;
        // //let pagoTotalSolicitud = 0;
        // this.dataOrder.forEach(e => {
        //   if(e.precio_aprobado==undefined){
        //     e.precio_aprobado = 0
        //   }
        //  // pagoTotalSolicitud += +e.precio_cotizado;
        //   pagoTotalApro += +e.precio_aprobado;
        // });
        // //this.totalValorSolicitud = pagoTotalSolicitud
        // this.totalValorAprobado = pagoTotalApro


       

        // this.dataOrder = res.solicitud === null ? [] : res.solicitud.detalles
        console.log(res['estado']);
        this.ingresoDisabled = false
        if (res['estado'] == "C") {
          this.vmButtons[4].habilitar = true;
          this.vmButtons[5].habilitar = true;
          this.vmButtons[6].habilitar = false;
          this.actions.dComponet = false;
          this.ingresoDisabled = true;
          this.catalogoDisabled = true
        }
        else {
          this.vmButtons[4].habilitar = false;
          this.vmButtons[5].habilitar = false;
          this.actions.dComponet = true;
        }
        const det: any = []

        console.log(res['detalles'])
        res['detalles'].forEach((res) => {
          let data = {
            id: res['id'],
            fk_product: res['fk_product'],
            productSelect: res['description'],
            description: res['description'],
            quantity: res['cantidad'],
            price: res['precio_unitario'],
            totalItems: res['total'],
            fk_grupo: res['fk_grupo'],
            fk_subgrupo: res['fk_subgrupo'],
            codigo_bienes: res['codigo_bienes'],
            codigo: res['codigo_grupo_producto'],
            grupo_bien: res['grupo_bien'],
            udmcompra: res['udmcompra'],
            centro_costo: res['centro_costo']
          }
          det.push(data)
        })
        this.dataProducto = det
        this.calcTotal()

        // Este pedazo causa problemas
        let pagoTotalSoli = 0;
        let pagoTotalApro = 0;
        if (res.solicitud.length > 0) {
          pagoTotalSoli = res.solicitud[0].detalles.reduce((acc, curr) => acc + parseFloat(curr.precio_cotizado), 0)
          pagoTotalApro = res.solicitud[0].detalles.reduce((acc, curr) => acc + parseFloat(curr.precio_aprobado), 0)
         
          // this.dataOrder = res.solicitud[0].detalles

          // this.dataOrder.forEach(e => {
          //   pagoTotalSoli += +e.precio_cotizado; 
          // });
        }
        this.totalValorSolicitud = pagoTotalSoli
        this.totalValorAprobado = pagoTotalApro

        console.log(this.dataProducto)

        this.commonVarSrvice.contribAnexoLoad.next({ condi: 'infimas', id: res.id })
        this.vmButtons[0].habilitar = true
        this.vmButtons[1].habilitar = true
        this.vmButtons[2].habilitar = false
        this.vmButtons[3].habilitar = false

        this.vmButtons[7].habilitar = false
      }

    )
    this.commonVarSrvice.selectProducto.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res)
        this.producto_exi = res
        console.log(this.producto_exi)
        this.addItems(res)


      }
    )

    this.commonVarSrvice.setPosition.pipe(takeUntil(this.onDestroy$)).subscribe(res => {
      this.position = res;
    })

    this.commonVarSrvice.updPerm.asObservable().subscribe(res => {
      // (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonServices.onHandleNotification.pipe(takeUntil(this.onDestroy$)).subscribe(res => {
      if (this.contador == 0) {
        this.contador += 1;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          // this.getDataTableOrder();
        });
      }
    })

    // this.commonVarSrvice.selectProducto.asObservable().subscribe(
    //   (res) => {
    //     if (res["validacion"] = 'IB') {
    //       console.log(res);
    //     }
    //   }
    // )

    this.commonVarSrvice.selectGrupo.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        this.lcargando.ctlSpinner(false);
        this.claseSelect = res
        this.deshabilitarItems = false;
        this.grupo_descripcion = this.claseSelect['codigo_grupo_producto'] + "-" + this.claseSelect['descripcion'] + "-" + this.claseSelect['tipo_bien']
        this.codigo_grupo = this.claseSelect['codigo_grupo_producto']
        console.log(this.claseSelect)
        if (this.claseSelect.tipo_bien == "EXI" || this.claseSelect.tipo_bien == "EX") {
          console.log(this.claseSelect)
          this.catalogoDisabled = true
          this.deshabilitarCatalogo = true
          // this.expandProductos()
        }
        else {
          this.catalogoDisabled = false
          this.deshabilitarCatalogo = false

          //this.catalogoDisabled = true
          console.log("hola")
        }



      }
    )

    this.commonVarSrvice.selectCatalogo.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        console.log(res)
        this.deshabilitarItems = false
        this.listaProducto.codigoBienes = res['codigo_bienes']
        this.codigoBienesDescripcion = res['codigo_bienes'] + "-" + res['descripcion']
        this.generaActionRawMaterial()
      }
    )
  }


  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }



  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.newOrder();
        break;
      case "GUARDAR":
        this.validaSaveOrder();
        break;
      case "CANCELAR":
        this.delete();
        break;
      case " BUSCAR":
        this.expandListDocumentosRec();
        break;

      case " EDITAR":
        this.editar()
        break;
      case " APROBAR":
        this.aprobacion()
        break;
      case "IMPRIMIR":
        this.imprimirComprobante();
        break;
      case "ENVIAR":
        this.enviarCorreo();
        break;
    }
  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    this.vmButtons = [
      { orig: "btnsOrdenCompra", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsOrdenCompra", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsOrdenCompra", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      {
        orig: "btnsOrdenCompra",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: " BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsOrdenCompra",
        paramAccion: "1",
        boton: { icon: "fas fa-edit", texto: " EDITAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success btn-sm",
        habilitar: true,
        imprimir: false
      },
      {
        orig: "btnsOrdenCompra",
        paramAccion: "1",
        boton: { icon: "far fa-check-square", texto: " APROBAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning btn-sm",
        habilitar: true,
        imprimir: false
      },
      {
        orig: "btnsOrdenCompra",
        paramAccion: "",
        boton: { icon: "fa fa-print", texto: "IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success btn-sm",
        habilitar: true
      },
      {
        orig: "btnsOrdenCompra",
        paramAccion: "",
        boton: { icon: "fa fa-envelope", texto: "ENVIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-success btn-sm",
        habilitar: true
      },
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
      this.getBodega()
      this.grupoProducto()
      this.getCatalogos()
      this.getCentroCostos()

    }, 50);

    /*obtener el ultimo status*/
    this.prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 5);
    if (this.prefict[0]['filtros'] != null && this.prefict[0]['filtros'] != undefined) {
      let filter = this.prefict[0]['filtros'].split(',');
      this.latestStatus = parseInt(filter[filter.length - 1]);
    }
    /*fin*/

    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fOrdenesCompra,
      id_rol: id_rol
    }
    this.seguridadServices.getPermisionsGlobas(data).subscribe(res => {
      console.log(res);
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Ordenes de compra");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        (this.permisions.descargar == "0") ? this.actions.btnDescargar = false : this.actions.btnDescargar = true;
        this.getEmpresa();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  callSection(data) {
    let id = "#" + data;
    let x = document.querySelector(id);
    if (x) {
      setTimeout(() => {
        x.scrollIntoView();
      }, 150);
    }
  }

  getEmpresa() {
    this.seguridadServices.getEmpresa().subscribe(res => {
      console.log(res)
      this.dataEmpresa.empresa = res['data'];
      this.getSucursales();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }
  getCentroCostos() {

    this.ordenesServices.listaCentroCostos().subscribe((res: any) => {
      console.log(res);
      this.centroCosto = res['data']
      // res.map((data) => {
      //   this.centroCosto.push(data)
      //   console.log(this.centroCosto)

      // })
    })
  }

  getSucursales() {

    let data = {
      id_empresa: this.dataUser.id_empresa
    }
    this.ordenesServices.getSucursales(data).subscribe(res => {
      console.log(res)
      this.dataEmpresa.suscursales = res['data'];
      this.filterDataEmpresaSucursal();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  filterDataEmpresaSucursal() {
    this.dataEmpresa.filterEmpresa = this.dataEmpresa.empresa.filter(e => e.id_empresa == this.dataUser.id_empresa);
    this.dataEmpresa.filterSucursal = this.dataEmpresa.suscursales.filter(e => e.id_sucursal == this.dataUser.id_sucursal);
    this.getProveedores();
  }

  getProveedores() {
    this.lcargando.ctlSpinner(true);
    this.ordenesServices.getProveedores().subscribe(res => {
      this.arrayProveedor = res['data'];
      this.getEmpleado();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })

    // this.ordenesServices.getDepartamento({}).subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.departamento = res['data']

    //   }
    // )

    // let data = {
    //   params: " 'INV_TIPO_INGRESO' ",
    // };
    // this.ordenesServices.getCatalogs(data).subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.catalog = res["data"]["INV_TIPO_INGRESO"];

    //     console.log(this.catalog);
    //     this.lcargando.ctlSpinner(false);
    //   },
    //   (error) => {
    //     this.lcargando.ctlSpinner(false);
    //     this.toastr.info(error.error.message);
    //   }
    // );


  }

  getEmpleado() {
    this.ordenesServices.getEmpleado().subscribe(res => {
      this.arrayUsers = res['data'];
      this.getProductos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  getProductos() {
    let data = {
      clase: ['Productos', 'Servicios']
    }
    this.ordenesServices.searchProduct(data).subscribe(res => {
      this.arrayProductos = res['data'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  getimpuestos() {
    this.ordenesServices.getImpuestos().subscribe(res => {
      this.iva = res['data'][0];
      this.iva = this.iva.valor;
      this.ivaConverter = (this.iva / 100) * 100;
      this.getSolicitudes();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  getSolicitudes() {
    let data = {
      id: 4
    }
    this.ordenesServices.geSolicitudes(data).subscribe(res => {
      this.filters = res['data'];
      console.log(res)
      this.lcargando.ctlSpinner(false);
      // this.dataOrder = res['data']
      // this.getDataTableOrder();
    }, error => {
      // this.getDataTableOrder();
      this.lcargando.ctlSpinner(false);
      this.processing = true;
    })
  }

  getSolicitudesAux() {
    let data = {
      id: 4
    }
    this.ordenesServices.geSolicitudes(data).subscribe(res => {
      this.filters = res['data'];
    }, error => {
      this.processing = true;
    })
  }




  getDataTableOrder() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      order: [[0, "desc"]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.ordenesServices.presentaTablaOrder()
      .subscribe(res => {
        this.processing = true;
        this.validaDtOrder = true;
        this.dataOrder = res['data'];
        if (this.position) {
          setTimeout(() => {
            this.callSection('tudiv');
          }, 500);
        }
        setTimeout(() => {
          this.dtTrigger.next();
          // this.lcargando.ctlSpinner(false);
        }, 50);
      }, error => {
        this.validaDtOrder = true;
        this.dataOrder = [];
        setTimeout(() => {
          this.dtTrigger.next();
          //this.lcargando.ctlSpinner(false);
        }, 50);
      });
  }

  nexStatus(dt) {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para actualizar el estado");
    } else {
      let permission = this.commonServices.filterPermissionStatus(dt.filter_doc, 5);
      this.NexPermisions = this.commonServices.filterNexStatus(dt.filter_doc, 5);
      if (permission) {
        this.confirmSave("Seguro desea cambiar de estado de la orden?", "MOD_ORDER", dt);
      } else {
        this.toastr.info("Usuario no tiene Permiso para cambiar al siguiente estado o los permisos aún no han sido asignados");
      }
    }
  }

  getFilterProveedor(evt) {
    let filt = this.arrayProveedor.filter(e => e.id_proveedor == evt);
    filt = filt[0];
    if (filt != undefined) {
      this.nomComerPro = filt.nombre_comercial_prov;
      this.direccionPro = filt.direccion;
      this.lineaPro = filt.linea;
      this.telefonoPro = filt.telefono;
      this.wsPro = filt.website;
    } else {
      this.providersSelec = undefined;
      this.nomComerPro = "";
      this.direccionPro = "";
      this.numProceso = '';
      this.lineaPro = "";
      this.telefonoPro = "";
      this.wsPro = "";
    }
  }

  getFilterUser(evt) {
    this.filtClient = this.arrayUsers.filter(e => e.id_personal == evt);
    this.filtClient = this.filtClient[0];
    if (this.filtClient != undefined) {
      this.moduloUser = this.filtClient.cargo;
      // this.emailUser = this.filtClient.email;
    } else {
      this.moduloUser = "";
      // this.emailUser = "";
    }
  }

  changeAction() {
    this.flagUser = !this.flagUser;
    this.editname = "";
    this.editPerfil = "";
    this.editCorreo = "";
  }

  getDataProduct(evt, index) {
    if (evt != 0) {
      let filt = this.arrayProductos.filter(e => e.id_producto == evt);
      filt = filt[0];
      let validt = false;
      this.dataProducto.forEach(element => {
        if (element.codigo == filt.codigoProducto) { validt = true; }
      });
      if (validt) {
        Swal.fire(
          'Atención!',
          'Este producto ya se encuenta en la lista ingresada!',
          'error'
        )
      } else {
        /* this.dataProducto[index].price = filt.PVP; */
        this.dataProducto[index].price = 0.00;
        this.dataProducto[index].codigo = filt.codigoProducto;
        this.dataProducto[index].Iva = filt.Iva;
        setTimeout(() => {
          document.getElementById('idAmount').focus();
        }, 50);
      }
    }/* else{

    } */
  }

  sumTotal(index) {
    this.dataTotales.subTotalPagado = 0.00;
    this.dataTotales.ivaPagado = 0.00;
    this.dataTotales.totalPagado = 0.00;
    this.dataTotales.ivaBase = 0.00;
    this.dataTotales.iva0 = 0.00;

    /* this.dataProducto[index].totalItems = this.dataProducto[index].quantity * this.dataProducto[index].price;
    this.dataProducto.forEach(element => {
      this.dataTotales.subTotalPagado += element.totalItems;
    });
    this.dataTotales.ivaPagado = this.dataTotales.subTotalPagado * (this.ivaConverter / 100);
    this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado; */

    this.dataProducto[index].totalItems = this.dataProducto[index].quantity * this.dataProducto[index].price;


    this.dataProducto.forEach(element => {
      if (element.Iva == 1) {
        this.dataTotales.subTotalPagado += parseFloat(element.totalItems);
        this.dataTotales.ivaBase += parseFloat(element.totalItems);
      } else {
        this.dataTotales.iva0 += parseFloat(element.totalItems);
      }
    });
    this.dataTotales.ivaPagado = parseFloat(this.dataTotales.ivaBase) * (parseFloat(this.ivaConverter) / 100);
    this.dataTotales.subTotalPagado += parseFloat(this.dataTotales.iva0);
    this.dataTotales.totalPagado = parseFloat(this.dataTotales.subTotalPagado) + parseFloat(this.dataTotales.ivaPagado);
    this.calcTotal()

  }
  calcTotal() {
    let pagoTotal = 0;

    this.dataProducto.forEach(e => {
      // if (e.aplica) {
      pagoTotal += +e.totalItems; // en este caso es total porque sale de valor unitario * cantidad
      // }
    });
    this.totalValorItems = pagoTotal

  }

  addItems(data) {
    console.log(data)

    if (this.bodega == null) {
      this.toastr.warning('No ha seleccionado Bodega de Origen')
      return
    }

    if (this.claseSelect.tipo_bien == "BLD" || this.claseSelect.tipo_bien == "BCA") {
      this.deshabilitarCatalogo = false;
      this.bienDisabled = true
      if (this.codigoBienesDescripcion == null || this.codigoBienesDescripcion == undefined || this.codigoBienesDescripcion == "") {

        this.toastr.info('Debe seleccionar un bien en el campo Catalogo bienes');
      } else if (this.listaProducto['nombre'] == null || this.listaProducto['nombre'] == undefined) {

        this.toastr.info('Debe proporcionar un nombre para el bien a ingresar');
      } else if (this.listaProducto.udmcompra == null || this.listaProducto.udmcompra == undefined || this.listaProducto.udmcompra == 0) {

        this.toastr.info('Debe seleccionar la Unidad de Medida');
      } else {

        let items = {
          id: 0,
          productSelect: this.listaProducto['nombre'],
          codigo: this.claseSelect['codigo_grupo_producto'],
          description: this.listaProducto['nombre'],
          quantity: this.listaProducto.stock,
          price: 0.00,
          totalItems: 0.00,
          Iva: 0,
          fk_product: 0,
          fk_grupo: this.claseSelect['id_grupo_productos'],
          fk_subgrupo: this.subgrupo['id_subgrupo_producto'],
          codigo_bienes: this.listaProducto['codigoBienes'],
          clase: this.claseSelect['descripcion'],
          grupo_producto: this.claseSelect['codigo_grupo_producto'],
          udmcompra: this.listaProducto['udmcompra'],
          grupo_bien: this.claseSelect['tipo_bien'],
          codigo_cuenta_contable: this.claseSelect['codigo_cuenta_contable'],
          codigo_presupuesto: this.claseSelect['codigo_presupuesto']
        };

        this.dataProducto.push(items);

      }
      console.log(this.dataProducto)
    } else {
      this.deshabilitarCatalogo = true;
      this.expandProductos()
      if (data) {
        let items = {
          id: 0,
          productSelect: data['nombre'],
          codigo: this.claseSelect['codigo_grupo_producto'],
          description: data['nombre'],
          quantity: 0,
          price: data['precio_ultima_compra'],
          totalItems: 0.00,
          Iva: 0,
          fk_product: data['id_producto'],
          fk_grupo: this.claseSelect['id_grupo_productos'],
          fk_subgrupo: this.claseSelect['id_grupo_productos'],
          clase: this.claseSelect['descripcion'],
          codigo_bienes: 0,
          grupo_producto: this.claseSelect['codigo_grupo_producto'],
          udmcompra: this.listaProducto['udmcompra'],
          grupo_bien: this.claseSelect['tipo_bien'],
          codigo_cuenta_contable: this.claseSelect['codigo_cuenta_contable'],
          codigo_presupuesto: this.claseSelect['codigo_presupuesto']
        };
        this.dataProducto.push(items);
      }


    }

  }


  deleteItems(d) {
    // if (this.permisions.eliminar == "0") {
    //   this.toastr.info("Usuario no tiene permiso para eliminar");
    // } else {
    this.dataTotales.subTotalPagado = 0.00;
    this.dataTotales.ivaPagado = 0.00;
    this.dataTotales.totalPagado = 0.00;
    this.dataTotales.ivaBase = 0.00;
    this.dataTotales.iva0 = 0.00;
    if (d.id !== null || d.id !== 0) this.productosIds.push(d.id)
    console.log(this.productosIds)
    // if (item.id !== null) this.bienesEliminar.push(item.id)
    this.dataProducto.splice(this.dataProducto.indexOf(d), 1)


    //this.dataProducto.splice(d, 1);

    /* this.dataProducto.forEach(element => {
      this.dataTotales.subTotalPagado += element.totalItems;
    });
    this.dataTotales.ivaPagado = this.dataTotales.subTotalPagado * (this.ivaConverter / 100);
    this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado; */

    this.dataProducto.forEach(element => {
      if (element.Iva == 1) {
        this.dataTotales.subTotalPagado += parseFloat(element.totalItems);
        this.dataTotales.ivaBase += parseFloat(element.totalItems);
      } else {
        this.dataTotales.iva0 += parseFloat(element.totalItems);
      }
    });
    this.dataTotales.ivaPagado = parseFloat(this.dataTotales.ivaBase) * (parseFloat(this.ivaConverter) / 100);
    this.dataTotales.subTotalPagado += parseFloat(this.dataTotales.iva0);
    this.dataTotales.totalPagado = parseFloat(this.dataTotales.subTotalPagado) + parseFloat(this.dataTotales.ivaPagado);
    this.calcTotal()
    // }
  }

  showAnexosProduct() {
    this.anexoAdd = [];
    var params = { module: this.permisions.id_modulo, component: myVarGlobals.fSolicitud }
    const modalInvoice = this.modalService.open(AnexosDocComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.params = params;
  }

  newOrder() {
    this.actions.dComponet = true;
    this.actions.btncancelar = true;
    this.actions.btnGuardar = true;
    this.actions.btnNuevo = true;
    this.deshabilitarTi = false
    this.estado = 'P';

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.vmButtons[5].habilitar = true;
    this.vmButtons[6].habilitar = true;
  }


  delete() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea limpiar el formulario de ingreso de bodega?.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actions.dComponet = false;
        this.actions.btnGuardar = false;
        this.actions.btnEnviar = false;
        this.actions.btnNuevo = false;
        this.deshabilitarTi = true;
        this.deshabilitarItems = true;
        this.deshabilitarCatalogo = true;
        this.bienDisabled = false;
        this.ingresoDisabled = false;
        this.catalogoDisabled = false

        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = false;
        this.vmButtons[4].habilitar = true;
        this.vmButtons[5].habilitar = true;
        this.vmButtons[6].habilitar = true;
        this.vmButtons[7].habilitar = true

        this.dataProducto = [];
        this.nomComerPro = "";
        this.direccionPro = "";
        this.numProceso = '';
        this.tipoIngreso = '';
        this.valorReferencia = '';
        this.objectoProceso = '';
        this.lineaPro = "";
        this.telefonoPro = "";
        this.wsPro = "";
        this.num_partida = "";
        this.fk_idp = undefined;
        this.UserSelect = undefined;
        this.moduloUser = "";
        this.tipoProceso = "";
        this.flagUser = true;
        this.editname = "";
        this.editPerfil = "";
        this.editCorreo = "";
        this.providersSelec = 0;
        this.observacion = "";
        this.dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
        this.selectFilters = undefined;
        this.anexoAdd = [];
        this.condiciones = "";
        this.contador = 0;
        this.bodega = "";
        this.dataOrder = []
        this.listaProducto = []
        this.claseSelect = []
        this.subgrupo = []
        this.codigoBienesDescripcion = []
        this.numero_ingreso_bodega = "";
        this.estado = "";
        this.grupo_descripcion = "";
        this.codigo_grupo = "";
        this.totalValorItems = 0;
        this.totalValorSolicitud = 0;
        this.commonVarSrvice.clearAnexos.next()
      }
    });
  }

  validateDataGlobal() {
    let flag = false;
    let c = 0;
    return new Promise((resolve, reject) => {
      /* if(this.selectFilters == undefined){
        this.toastr.info("seleccione una solicitus de referencia");
        document.getElementById("idsolrefer").focus();
      }else */ if (this.providersSelec == 0) {
        this.toastr.info("Seleccione un Proveedor");
        document.getElementById("IdProvidersDoc").focus();
      } else if (this.flagUser && this.UserSelect == 0) {
        this.toastr.info("seleccione un cliente a enviar");
        document.getElementById("IdRolesUsersDoc").focus();
      } else if (!this.flagUser && (this.editname == undefined || this.editname == "")) {
        this.toastr.info("Ingrese un nombre de cliente");
        document.getElementById("edtname").focus();
      } else if (!this.flagUser && (this.editPerfil == undefined || this.editPerfil == "")) {
        this.toastr.info("Ingrese un cargo de cliente");
        document.getElementById("edtmod").focus();
      } else if (!this.flagUser && (this.tipoProceso == undefined || this.tipoProceso == "")) {
        this.toastr.info("Ingrese un correo de cliente");
        document.getElementById("edtemail").focus();
      } else if (!this.flagUser && !this.validarEmail(this.editCorreo)) {
        this.toastr.info("Ingrese un correo válido de cliente");
        document.getElementById("edtemail").focus();
      } else if (this.observacion == undefined || this.observacion == "") {
        this.toastr.info("Ingrese una observación");
        document.getElementById("txobserva").focus();
      }
      //  else if (this.ingresoDepartamento == undefined || this.ingresoDepartamento == "") {
      //   this.toastr.info("Ingrese un departamento");

      // } 
      else if (this.tipoIngreso == undefined || this.tipoIngreso == "") {
        this.toastr.info("Ingrese un tipo de ingreso");
        // document.getElementById("txobserva").focus();
      }


      else if (this.dataProducto.length == 0) {
        this.toastr.info("Ingrese al menos un producto");
      } /* else if (this.anexoAdd.length == 0) {
        this.toastr.info("Debe adjuntar una solicitud aprobada previo a la creación de esta orden de compra");
      } else if (this.condiciones == "" || this.condiciones == undefined) {
        this.toastr.info("Ingrese una condición");
        document.getElementById("idCondition").focus();
      } */ else {
        c = 0;
        for (let index = 0; index < this.dataProducto.length; index++) {
          if (this.dataProducto[index].productSelect == 0) {
            c += 1;
            if (c == 1) { this.toastr.info("Falta de seleccionar un producto"); }
            flag = true; return;

          } /* else if (this.dataProducto[index].description == null || this.dataProducto[index].description == "") {
            this.toastr.info("El campo descripción en los productos no puede ser vacio");
            flag = true; break;
          } */ else if (this.dataProducto[index].quantity == 0) {
            c += 1;
            if (c == 1) { this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0"); }
            flag = true; return;
          } else if (this.dataProducto[index].price == 0.00) {
            c += 1;
            if (c == 1) { this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser 0"); }
            flag = true; return;
          }
        }

        let factura = this.lineaPro.split("-")
        if (!this.donaciones) {
          // if (this.valorReferencia == undefined || this.valorReferencia == "") {
          //   this.toastr.info("Ingrese un valor de referencia");
          //   flag = true
          //   // document.getElementById("txobserva").focus();
          // } 
          // if (this.num_partida == undefined || this.num_partida == "") {
          //   this.toastr.info("Ingrese un numero de partida");
          //   flag = true
          //   // document.getElementById("txobserva").focus();
          // } 
          if (this.numProceso == undefined || this.numProceso == "") {
            this.toastr.info("Ingrese un numero de proceso");
            flag = true
            // document.getElementById("txobserva").focus();
          }
          //  else if (this.objectoProceso == undefined || this.objectoProceso == "") {
          //   this.toastr.info("Ingrese un objeto del proceso");
          //   flag = true
          //   // document.getElementById("txobserva").focus();
          // } 
          else if (this.tipoProceso == undefined || this.tipoProceso == "") {
            this.toastr.info("Ingrese un tipo de proceso");
            flag = true
            // document.getElementById("txobserva").focus();
          } else if (this.lineaPro == undefined || this.lineaPro == "") {
            this.toastr.info("Ingrese una factura");
            flag = true
            // document.getElementById("txobserva").focus();
          }
          // else if(factura[0].length != 3 || factura[1].length !=3 || factura[2].length != 9){
          //   this.toastr.info("el formato de la factura es xxx-xxx-xxxxxxxxx");
          //   flag = true
          // }
        }
        if (!flag && !this.flagUser) {
          let data = {
            email: this.editCorreo
          }
          this.ordenesServices.getEmailExist(data).subscribe(res => {
            if (res['data'].length == 0) {
              this.emailExist = false;
              resolve(true);
            } else {
              this.emailExist = true;
              this.toastr.info("El correo ya existe");
              document.getElementById("edtemail").focus(); return;
            }
          })
        } else {
          (!flag) ? resolve(true) : resolve(false);
        }
      }
    });
  }

  async validaSaveOrder() {
    console.log(this.dataProducto);
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      if (this.tipoIngreso == undefined) {
        this.toastr.info("Seleccione un Tipo de Ingreso");
      }
      else if (this.providersSelec == undefined || this.providersSelec == "" || this.providersSelec == 0) {
        this.toastr.info("Seleccione un Proveedor");
      }
      else if (this.UserSelect == 0 || this.UserSelect == '' || this.UserSelect == undefined) {
        this.toastr.info("Seleccione una persona que reciba");
      } else if (this.dataProducto.length == 0) {
        this.toastr.info("Debe seleccionar productos");
      }else if( this.tipoIngreso?.valor == 'BAC' &&   parseFloat(this.totalValorItems) > parseFloat(this.totalValorAprobado)){
        this.toastr.info("El valor total de los bienes ingresados de $" + this.commonServices.formatNumberDos(this.totalValorItems)
        +" no puede ser mayor al valor total aprobado de $" +this.commonServices.formatNumberDos(this.totalValorAprobado)
        +" la diferencia es de $" + this.commonServices.formatNumberDos(parseFloat(this.totalValorItems) - parseFloat(this.totalValorAprobado)));
      }
      else if (this.dataProducto.length > 0) {
        for (let i = 0; i < this.dataProducto.length; i++) {
          if (this.dataProducto[i].price <= 0 || this.dataProducto[i].price == null) {
            this.toastr.info("Debe ingresar el  precio del producto")
            return;
          } else if (this.dataProducto[i].quantity <= 0 || this.dataProducto[i].quantity == null) {
            this.toastr.info("Debe ingresar la cantidad del producto")
            return;
          } else if (this.dataProducto[i].centro_costo == undefined || this.dataProducto[i].centro_costo == null || this.dataProducto[i].centro_costo == '') {
            this.toastr.info("Debe seleccionar un centro de costo")
            return;
          }
          else {
            this.confirmSave("Seguro desea guardar la orden?", "SAVE_ORDER");
          }
        }
      }

      // let resp = await this.validateDataGlobal().then(respuesta => {
      // if (respuesta) {
      // this.confirmSave("Seguro desea guardar la orden?", "SAVE_ORDER");
      // let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 5);
      // let filter = prefict[0]['filtros'].split(',');
      // filter = filter[0];
      // if (this.commonServices.filterUser(filter, 5)) {
      //   this.confirmSave("Seguro desea guardar la orden?", "SAVE_ORDER");
      // } else {
      //   this.delete();
      //   this.toastr.info("Usuario no tiene permiso para crear una orden");
      // }
      // }
      // })
    }
  }

  async confirmSave(message, action, order?: any) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      // type: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_ORDER") {
          this.btnSave = true;
          this.processing = false;
          this.saveOrder();
          this.vmButtons[6].habilitar = false;


        } else if (action == "DELETE_ORDER") {
          ($('#exampleModal') as any).modal('hide'); /* linea para cerrar el modal de boostrap */
          this.processing = false;
          this.anularOrder(order);
        } else if (action == "MOD_ORDER") {
          this.processing = false;
          this.modOrder(order);
        }
      }
    })
  }

  modOrder(order) {
    //this.lcargando.ctlSpinner(true);
    let data = {
      nexPermi: this.NexPermisions,
      id: order.id,
      ip: this.commonServices.getIpAddress(),
      accion: `Cambio de estado de la orden con id ${order.id}`,
      id_controlador: myVarGlobals.fOrdenesCompra,
      filter_doc: this.NexPermisions,
      id_document: 5,
      abbr_doc: this.dataUser.permisos_doc.filter(e => e.fk_documento == 5)[0].codigo,
      notifycation: `Se ha cambiado de estado a la orden de compra por el usuario ${this.dataUser.nombre}`,
      secuence: order.secuence
    }

    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 5);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];
    let currentStatus = this.commonServices.filterNexStatus(filter, 5);
    if (parseInt(this.latestStatus) != parseInt(currentStatus)) {
      data['usersFilter'] = this.commonServices.filterUserNotification(filter, 5);
      data['usersAprobated'] = null;
      data['idUserAprobated'] = null;
    } else {
      data['usersFilter'] = Array.from(new Set(this.commonServices.allUserNotification(5)));
      data['usersAprobated'] = this.dataUser.nombre;
      data['idUserAprobated'] = this.dataUser.id_usuario;
    }

    this.ordenesServices.updatePermissions(data).subscribe(res => {
      this.delete();
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.socket.onEmitNotification(data['usersFilter']);
      this.toastr.success(res['message']);
      setTimeout(() => {
        this.getSolicitudesAux();
      }, 100);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })

  }


  saveOrder() {

    this.mensajeSppiner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);
    let dat = {
      "anio": Number(moment(this.fechaDocumento).format('YYYY')),
      "mes": Number(moment(this.fechaDocumento).format('MM'))
    }
      this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(res => {
      
      /* Validamos si el periodo se encuentra aperturado */
      if (res["data"][0].estado !== 'C') {
        this.mensajeSppiner = "Guardando ingreso...";
        this.lcargando.ctlSpinner(true);
        let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 5);
        let filter = prefict[0]['filtros'].split(',');
        filter = filter[0];
    
        let data = {
          id_empresa: this.dataEmpresa.filterEmpresa[0].id_empresa,
          id_sucursal: this.dataEmpresa.filterSucursal[0].id_sucursal,
          id_proveedor: this.providersSelec,
          /* id_anexos: this.anexoAdd.id_anexos, */
          num_anexo: Number(this.anexoAdd.length),
          id_cliente: this.filtClient.id_personal,
          nombre_cliente: this.filtClient.nombres,
          cargo_cliente: this.moduloUser,
          tipo_ingreso: this.tipoIngreso.descripcion + " " + this.tipoIngreso.valor,
          inicial_ingreso: this.tipoIngreso.valor,
          tipo_proceso: this.tipoProceso,
          factura: this.lineaPro,
          num_proceso: this.numProceso,
          num_partida: this.num_partida,
          id_ordenes: this.id_ordenes,
          fk_idp: this.fk_idp,
          objeto_proceso: this.objectoProceso,
          valor_referencia: this.valorReferencia,
          //departamento: this.ingresoDepartamento,
          observacion: this.observacion,
          id_solicitud: this.id_solicitud,
          // condiciones: this.condiciones,
          totales: this.dataTotales,
          // ref_solicitudes: this.selectFilters,
          list_product: this.dataProducto,
          ip: this.commonServices.getIpAddress(),
          accion: "creación de nueva orden de compra",
          id_controlador: myVarGlobals.fOrdenesCompra,
          notifycation: `Se ha generado una nueva orden compra por el usuario ${this.dataUser.nombre}`,
          abbr_doc: prefict[0].codigo,
          id_document: prefict[0].fk_documento,
          filter_doc: filter,
          usersFilter: this.commonServices.filterUserNotification(filter, 5),
          id_us_aprob: null,
          name_us_aprob: null,
          bodega: this.bodega,
          numero_ingreso_bodega: this.numero_ingreso_bodega,
          estado: this.estado,
          fecha: this.fechaDocumento
        }
       
        this.ordenesServices.saveOrdersBuy(data).subscribe(res => {
    
          Swal.fire({
            title: 'Proceso exitoso!!',
            text: `Su registro de ingreso a bodega se realizo exitosamente con el No.` + res['data']['numero_ingreso_bodega'] + ` Por favor debe actualizar los datos del bien en la ficha del Producto`,
            icon: 'success',
            confirmButtonColor: '#4DBD74',
            confirmButtonText: 'Aceptar'
          });
          this.actions.dComponet = true;
          this.deshabilitarTi = true;
          this.vmButtons[1].habilitar = true;
          this.vmButtons[5].habilitar = false;
          this.vmButtons[6].habilitar = true;
          this.listaIngreso = res['data']
          this.numero_ingreso_bodega = res['data']['numero_ingreso_bodega']
          this.id = this.listaIngreso.id
    
          if (this.fileList != undefined) {
            this.uploadFile(res['data']['id']);
          }
    
          // this.saveAnexo(res['data'], "N");
          this.socket.onEmitNotification(this.commonServices.filterUserNotification(filter, 5));
          this.lcargando.ctlSpinner(false);
          this.processing = true;
          this.socket.onEmitNotification(data['usersFilter']);
          setTimeout(() => {
            this.getSolicitudesAux();
    
          }, 100);
    
        }, error => {
          this.processing = true;
          this.btnSave = false;
          this.toastr.info(error.error.message);
        })
      
  
      } else {
        this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
        this.lcargando.ctlSpinner(false);
      }
  
      }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
      })





   
  }


  timer: any;
  valida: boolean = false;
  saveAnexo(res: any, tipo) {

    if (this.anexoAdd.length > 0) {
      let params = {};
      if (tipo == "N") {
        params = {
          description: "Ingreso de Anexo de orden de compra",
          module: this.permisions.id_modulo,
          component: myVarGlobals.fOrdenesCompra,
          identifier: res.id_orden,
          ip: this.commonServices.getIpAddress(),
          accion: `Registro de anexos de orden de compra ${res.secuencia.toString().padStart(10, '0')} `,
          id_controlador: myVarGlobals.fOrdenesCompra,
        };
      }

      let contador: any = 0;
      for (let j = 0; j < this.anexoAdd.length; j++) {
        let fileItem = this.anexoAdd[j]._file;
        this.ordenesServices.fileService(fileItem, params).subscribe((res) => {
          contador++;
          if (contador == this.anexoAdd.length) {
            this.toastr.success("Proceso éxitoso");
            this.delete();
          }
        }, (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        });
      }
    } else {
      this.delete();
      this.lcargando.ctlSpinner(false);
      this.toastr.success("Proceso éxitoso");
    }
  }


  modalSolicitud() {

    if (this.providersSelec == 0) {

      this.toastr.info('Debe seleccionar primero un proveedor')

    } else if (this.tipoProceso == undefined || this.tipoProceso == '') {

      this.toastr.info('Debe seleccionar un tipo de proceso')
    }
    else {

      if (this.tipoProceso == "Catalogo Electronico") {
        let modal = this.modalService.open(ModalSolicitudCatComponent, {
          size: "xl",
          backdrop: "static",
          windowClass: "viewer-content-general",
        })
        modal.componentInstance.proveedor = this.proveedorActive
        modal.componentInstance.tipo_proceso = this.tipoProceso
      }
      else {
        let modal = this.modalService.open(ModalSolicitudComponent, {
          size: "xl",
          backdrop: "static",
          windowClass: "viewer-content-general",
        })
        modal.componentInstance.proveedor = this.proveedorActive
        modal.componentInstance.tipo_proceso = this.tipoProceso
      }




      // let modal = this.modalService.open(ModalSolicitudComponent, {
      //   size: "xl",
      //   backdrop: "static",
      //   windowClass: "viewer-content-general",
      // })

      // modal.componentInstance.proveedor = { id_proveedor: this.providersSelec }

    }

  }



  validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  validarEmailExist(email, table) {
    let data = {
      email: email
    }
    this.ordenesServices.getEmailExist(data).subscribe(res => {
      if (res['data'].length == 0) {
        this.emailExist = false;
      } else {
        this.emailExist = true;
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  validateDeleteOrder() {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso de administración para anular Orden ");
    } else {
      /* let permission = this.commonServices.filterPermissionStatus(dt.filter_doc,5);
      this.NexPermisions = this.commonServices.filterNexStatus(dt.filter_doc,5);
      if(permission){
        this.confirmSave("Seguro desea anular la orden?","DELETE_ORDER",dt);
      }else{
        this.toastr.info("Usuario no puede anular la orden");
      }  */
      if (this.descriptionAnulated == "" || this.descriptionAnulated == undefined) {
        document.getElementById('idDesOrderAnulared').focus();
        this.toastr.info("Ingrese un motivo para anular la orden");
      } else {
        this.confirmSave("Seguro desea anular la orden?", "DELETE_ORDER", this.varDeleteOrde);
      }
    }
  }

  validacionIngreso(event) {
    console.log(this.tipoIngreso)
    if (event == 'BAD' || event == 'BAR') {
      this.lineaPro = '';
      this.numProceso = '';
      this.num_partida = '';
      this.fk_idp = undefined;
      this.objectoProceso = '';
      this.valorReferencia = '';
      this.tipoProceso = '';

      this.donaciones = true
    } else {
      this.donaciones = false
    }
    console.log(event);
  }

  modalEncargado() {
    let modal = this.modalService.open(EncargadoComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  setOrder(dt) {
    $('#exampleModal').appendTo("body").modal('show');
    this.varDeleteOrde = dt;
  }

  anularOrder(dt) {
    this.lcargando.ctlSpinner(true);
    let data = {
      id: dt.id,
      ip: this.commonServices.getIpAddress(),
      accion: this.descriptionAnulated,
      id_controlador: myVarGlobals.fOrdenesCompra
    }
    this.contador = 0;
    this.ordenesServices.deleteOrder(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.validaDtOrder = false;
      this.dataOrder = [];
      this.processing = true;
      this.delete();
      this.processing = true;
      this.socket.onEmitNotification(data['usersFilter']);
      this.toastr.success(res['message']);
      setTimeout(() => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.getSolicitudes();
        });
      }, 300);

    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  showOrder(dt) {
    const modalInvoice = this.modalService.open(ShowOrderComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.order = dt;
    modalInvoice.componentInstance.params = { componente: myVarGlobals.fOrdenesCompra, permSendMail: this.permisions.enviar, perDowload: this.permisions.descargar, preficOrder: this.dataUser.permisos_doc.filter(e => e.fk_documento == 5)[0].codigo, iva: this.ivaConverter, ruc: this.dataEmpresa.filterEmpresa[0].ruc };
  }

  expandListDocumentosRec() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListDocumentosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    // modal.componentInstance.permissions = this.permissions;
  }


  searchModoalsProduct() {
    const modalInvoice = this.modalService.open(GlobalTableComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content' });
    modalInvoice.componentInstance.title = "PRODUCTO";
    modalInvoice.componentInstance.module = this.permisions[0].id_modulo;
    modalInvoice.componentInstance.component = myVarGlobals.fIngresoProducto;
  }

  expandProductos() {

    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListBusquedaComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    // modal.componentInstance.permissions = this.permissions;
    modal.componentInstance.validate = 'IB'
    modal.componentInstance.claseSelect = this.claseSelect
    modal.componentInstance.verifyRestore = this.verifyRestore;
  }

  getBodega() {

    this.ordenesServices.getBodegas().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      //this.toma.bodega = 0;
      this.arrayBodega = res['data'];

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  grupoProducto() {
    this.lcargando.ctlSpinner(true);
    this.ordenesServices.getGrupoProducto({}).subscribe((res: any) => {
      this.lcargando.ctlSpinner(false)
      console.log(res);
      this.listaProductos = res.data
      console.log(this.listaProductos)
      // res.map((data)=>{
      //   this.listaProductos.push(data.descripcion)
      // })
    })
  }

  modalGrupos() {
    this.lcargando.ctlSpinner(false)

    let modal = this.modalService.open(ModalGruposComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true
    modal.componentInstance.verifyRestore = this.verifyRestore;
    //modal.componentInstance.claseSelect = this.claseSelect;
    //this.generaActionRawMaterial()
    this.reiniciarProducto()
  }
  expandCodigoBienes() {

    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ModalCodigoBienesComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.validate = 'PR'
    // modal.componentInstance.contr = this.contribuyenteActive;
    // modal.componentInstance.permissions = this.permissions;
  }



  guardar() {
    let magnitude = {
      fk_unidad_masa: "Kilogramo",
      fk_unidad_longitud: "Metro",
      masa: "0",
      longitud_1: 0,
      longitud_2: 0,
      longitud_3: 0,
      fk_arancel: 0,
      code: "1"
    }

    this.listaProducto.fk_grupo = this.claseSelect.id_grupo_productos
    let data = {
      id_grupo: this.listaProducto.fk_grupo,
      id_subgrupo: this.listaProducto.fk_subgrupo,
      nombre: this.listaProducto.nombre,
      codigoBienes: this.listaProducto.codigoBienes,
      udmc: this.listaProducto.udmcompra,
      stock: this.listaProducto.stock,
      codigo_producto: this.listaProducto.codigoProducto,
      costo: 0,
      magnitude,


    }
    console.log(data)
    this.ordenesServices.saveProducto(data).subscribe(res => {
      console.log(res);
      this.toastr.success(res['message']);

    }, error => {
      console.log(error)
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCatalogos() {
    this.lcargando.ctlSpinner(true);
    let data = {
      params: "'UNIDAD DE MEDIDA','UDM_LONGITUD','UDM_MASA','INV_TIPO_INGRESO'"
    }
    this.ordenesServices.getUDM(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);

      this.dataUDM = res['data']['UNIDAD DE MEDIDA'];
      this.catalog = res["data"]["INV_TIPO_INGRESO"];
      console.log(this.dataUDM)
      console.log(this.catalog)

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)

    })
    // let data = {
    //   params: " 'INV_TIPO_INGRESO' ",
    // };
    // this.ordenesServices.getCatalogs(data).subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.catalog = res["data"]["INV_TIPO_INGRESO"];

    //     console.log(this.catalog);
    //     this.lcargando.ctlSpinner(false);
    //   },
    //   (error) => {
    //     this.lcargando.ctlSpinner(false);
    //     this.toastr.info(error.error.message);
    //   }
    // );
  }

  generaActionRawMaterial() {


    console.log(this.claseSelect.tipo_bien)
    if (this.claseSelect.tipo_bien == "BLD" || this.claseSelect.tipo_bien == "BCA") {
      let codigo = this.listaProducto.codigoBienes
      let inicial = 1
      this.ordenesServices.countProductosBienes({ parametro: this.listaProducto.codigoBienes }).subscribe(
        (res) => {
          console.log(res);

          if (res['data'] >= 10) {
            codigo = codigo + "-" + (parseInt(res['data']) + 1)
          } else if (res['data'].length == 0) {
            codigo = codigo + "-" + "0" + inicial
            this.secuencias = 1;
            //console.log(this.secuencial)
            console.log(codigo)
          } else {
            codigo = codigo + "-" + "0" + (parseInt(res['data']) + 1)

            this.secuencias = (res['data'] + 1)
          }
          // this.grupo_producto = ['codigo_subgrupo_producto']
          this.lcargando.ctlSpinner(false);
          // this.listaProducto.codigoProducto = codigo;
          // console.log(this.listaProducto.codigoProducto)
          console.log(codigo);

          this.productoCodigo = codigo

        }
      )
    }

    else {
      this.listaProducto.codigoProducto = 0


    }

  }


  verificar(event) {

    console.log(event)
    if (event.tipo_bien == "EXI" || event.tipo_bien == "EX") {
      console.log(event)
      this.catalogoDisabled = true
      // this.expandProductos()
    }
    else {
      this.catalogoDisabled = false
      //this.catalogoDisabled = true
      console.log("hola")
    }
  }


  async aprobacion() {
    
    this.mensajeSppiner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);
    let data = {
      "anio": Number(moment(this.fechaDocumento).format('YYYY')),
      "mes": Number(moment(this.fechaDocumento).format('MM'))
      }
      
      this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(async (res) => {
          try {
            if (res["data"][0].estado !=='C') {
              this.lcargando.ctlSpinner(true)
              this.mensajeSppiner = 'Validando datos'
              let message = ''
              let id_productos = []
              this.dataProducto.forEach((producto: any) => {
                if (producto.grupo_bien == 'EXI') {
                  id_productos.push(producto.fk_product)
                }
              })
          
              // Existen productos de Tipo EXI
              if (id_productos.length) {
                // Listado de productos perecibles que aparecen en dataProductos
                const perecibles = await this.ordenesServices.getPerecibles({ productos: id_productos })
                console.log(perecibles)
          
                let detalles: any;
                // Si hay productos perecibles, obtener sus detalles
                if (perecibles.data.length > 0) {
                  detalles = await this.ordenesServices.getDetalles({
                    documento_id: this.id,
                    productos: id_productos
                  })
                  console.log(detalles.data)
          
                  // Si no hay detalles, no han agregado los lotes a consumir
                  if (!detalles.data.length) {
                    this.lcargando.ctlSpinner(false)
                    // this.toastr.warning('No ha ingresado detalles de Lotes')
                    message += '* No ha ingresado detalles de Lotes.<br>'
                    // return;
                  }
                }
          
                // Validar que la sumatoria de Cantidad por Lote sea igual a la cantidad por Item
                const dataProductoFilter = this.dataProducto.filter((element: any) => perecibles.data.some((perecible: any) => perecible.id_producto === element.fk_product))
                
                dataProductoFilter.forEach((producto: any) => {
                  const detalleProd = detalles.data.filter((element: any) => producto.fk_product == element.fk_producto)
                  console.log(detalleProd) // Detalle de Lotes
                  const totalCantidadProd = detalleProd.reduce((acc, curr) => acc + curr.cantidad, 0)
                  console.log(totalCantidadProd) // Cantidad en Detalles de Lotes
                  // console.log(totalCantidadProd, parseFloat(producto.quantity), totalCantidadProd != parseFloat(producto.quantity))
                  if (totalCantidadProd != parseFloat(producto.quantity)) message += `* La cantidad de ${producto.description} no ha sido completada en sus lotes.<br>`
          
                  // const detalle = detalles.data.find((element: any) => producto.fk_product == element.fk_producto)
                })
          
                if (message.length > 0) {
                  this.lcargando.ctlSpinner(false)
                  this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true })
                  return;
                }
              }
          
              this.estado = 'C';
              this.lcargando.ctlSpinner(true)
              this.crearProducto()
              this.vmButtons[4].habilitar = true;
              this.vmButtons[5].habilitar = true;
              this.vmButtons[6].habilitar = false;
              this.vmButtons[7].habilitar = false;
              /* this.dataProducto.forEach(e => {
                console.log(e)
                  if(e.grupo_bien == "BCA" || e.grupo_bien == "BLD" ){
                  }
                  else{
                    this.updateExi(e)
                    this.vmButtons[5].habilitar = true;
                  }
              }) */
            } else {
                
                this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                this.lcargando.ctlSpinner(false);
            }
          } catch (error) {
              console.error("Error occurred:", error);
              this.lcargando.ctlSpinner(false);
          }
      });

  }

  editar() {
  
   
  this.mensajeSppiner = "Verificando período contable";
  this.lcargando.ctlSpinner(true);
  let dat = {
    "anio": Number(moment(this.fechaDocumento).format('YYYY')),
    "mes": Number(moment(this.fechaDocumento).format('MM'))
  }
    this.cierremesService.obtenerCierresPeriodoPorMes(dat).subscribe(res => {
    
    /* Validamos si el periodo se encuentra aperturado */
    if (res["data"][0].estado !== 'C') {
      
      this.mensajeSppiner = "Editando ingreso";
      this.lcargando.ctlSpinner(true);
  
      let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 5);
      let filter = prefict[0]['filtros'].split(',');
      filter = filter[0];
  
  
      let data = {
        id: this.id,
        id_empresa: 1,
        id_sucursal: 1,
        id_proveedor: this.providersSelec,
        num_anexo: Number(this.anexoAdd.length),
        id_cliente: 14,
        nombre_cliente: this.UserSelect,
        cargo_cliente: this.moduloUser,
        tipo_ingreso: this.tipoIngreso,
        tipo_proceso: this.tipoProceso,
        factura: this.lineaPro,
        num_proceso: this.numProceso,
        num_partida: this.num_partida,
        fk_idp: this.fk_idp,
        objeto_proceso: this.objectoProceso,
        valor_referencia: this.valorReferencia,
        //departamento: this.ingresoDepartamento,
        observacion: this.observacion,
        id_solicitud: this.id_solicitud,
        totales: this.dataTotales,
        list_product: this.dataProducto,
        filter_doc: 1,
        id_us_aprob: null,
        name_us_aprob: null,
        fk_bodega: this.fk_bodega,
        bodega: this.bodega,
        numero_ingreso_bodega: this.numero_ingreso_bodega,
        estado: this.estado,
        detallesEliminar: this.productosIds
      }
      this.ordenesServices.updateIngresoBodega(data).subscribe(
        (res) => {
  
  
          // if (res['data']['estado'] == "C") {
  
          //   this.dataProducto.forEach(e => {
          //     console.log(e)
          //       if(e.grupo_bien == "BCA" || e.grupo_bien == "BLD" ){
          //         this.crearProducto()
          //         this.vmButtons[4].habilitar = true;
          //       }
          //       else{
          //         this.updateExi()
          //       }
          //   })
  
  
          //   // if(this.claseSelect.tipo_bien == "BCA" || this.claseSelect.tipo_bien == "BLD"){
          //   //   this.crearProducto()
          //   // this.vmButtons[4].habilitar = true;
          //   // }
          //   // else{
          //   //   this.updateExi()
          //   // }
  
          // }
  
  
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
              console.log(res['data'])
              console.log(res['data']['detalles'])
              this.dataProducto = []
              const det: any = []
  
              console.log(res['detalles'])
              res['data']['detalles'].map((res) => {
                let data = {
                  id: res['id'],
                  fk_product: res['fk_product'],
                  productSelect: res['description'],
                  description: res['description'],
                  quantity: res['cantidad'],
                  price: res['precio_unitario'],
                  totalItems: res['total'],
                  fk_grupo: res['fk_grupo'],
                  fk_subgrupo: res['fk_subgrupo'],
                  codigo_bienes: res['codigo_bienes'],
                  codigo: res['codigo_grupo_producto'],
                  grupo_bien: res['grupo_bien'],
                  udmcompra: res['udmcompra']
                }
                det.push(data)
              })
              this.dataProducto = det
              //this.dataProducto= res['data']['detalles'];
              console.log(this.dataProducto)
              this.delete()
  
            } else {
  
            }
          })
        },
        (error) => {
          console.log(error);
          this.toastr.info('Ocurrio un error: ', error);
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

  crearProducto() {
    let magnitude = {
      fk_unidad_masa: "Kilogramo",
      fk_unidad_longitud: "Metro",
      masa: "0",
      longitud_1: 0,
      longitud_2: 0,
      longitud_3: 0,
      fk_arancel: 0,
      code: "1"
    }
    let ingreso_bodega: 0
    ingreso_bodega = this.listaIngreso.id;


    let data = {}
    console.log({ productos: this.dataProducto, ingreso: ingreso_bodega, magnitude: magnitude })

    console.log(this.dataProducto);

    this.ordenesServices.saveProductoBien({ productos: this.dataProducto, ingreso: ingreso_bodega, magnitude: magnitude, id_ingresoB: this.listaIngreso.id, id_bodega: this.bodega }).subscribe(
      (res: any) => {
        this.lcargando.ctlSpinner(false)
        Swal.fire({
          title: 'Proceso exitoso!!',
          text: `Se aprobó el Ingreso a Bodega`,
          icon: 'success',
          confirmButtonColor: '#4DBD74',
          confirmButtonText: 'Aceptar'
        });
        console.log(res.data)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error guardando productos')
      }
    )


    // this.dataProducto.map((res) => {
    //   console.log(res)
    //   for (let i = 0; i < res['quantity']; i++) {
    //     data = {
    //       id_grupo: res['fk_grupo'],
    //       id_subgrupo: res['fk_subgrupo'],
    //       clase: res['clase'],
    //       codigoBienes: res['codigo_bienes'],
    //       nombre: res['productSelect'],
    //       grupo_producto: res['grupo_producto'],
    //       costo: 0,
    //       magnitude,
    //       stock: this.listaProducto.stock,
    //       fk_ingreso_bodega: ingreso_bodega,
    //     }

    //     console.log(data)
    //     this.ordenesServices.saveProductoBien(data).subscribe(
    //       (res) => {
    //         console.log(res);
    //         this.lcargando.ctlSpinner(false);
    //         Swal.fire({
    //           icon: "success",
    //           title: "Se actualizó con éxito",
    //           text: res['message'],
    //           showCloseButton: true,
    //           confirmButtonText: "Aceptar",
    //           confirmButtonColor: '#20A8D8'
    //         }).then((result) => {
    //           if (result.isConfirmed) {
    //           }
    //         })

    //       }
    //     )
    //   }
    // })
  }


  imprimirComprobante() {
    console.log(this.id)
    window.open(environment.ReportingUrl + "rpt_comprobante_ingreso_bodega.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_ingreso_bodega=" + this.id, '_blank')
  }


  reiniciarProducto() {
    this.listaProducto = []
    this.grupo_descripcion = ""
    this.codigoBienesDescripcion = ""
    this.codigo_grupo = ""

  }


  updateExi(item) {
    console.log(item);
    let data = {
      id_ingresoB: this.listaIngreso.id,
      id: item.id,
      stock: item['quantity'],
      precio1: item['price'],
    }

    // console.log(this.dataProducto)
    console.log(data)

    this.ordenesServices.updateExi(data, data.id).subscribe(
      (res) => {
        console.log(res)
        if (res["status"] == 1) {
          console.log("bien")
          this.lcargando.ctlSpinner(false);
        }
        else {
          this.lcargando.ctlSpinner(false)
          console.log("se cayo")
        }
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
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
      module: this.permisions.id_modulo,
      description: "Ingreso de Anexo de orden de compra",
      // module:21,
      component: myVarGlobals.fOrdenesCompra,
      identifier: id_prestamo,
      id_controlador: myVarGlobals.fGestBienesPrestamo,
      accion: `Nuevo anexo para Prestamo de Bienes ${id_prestamo}`,
      ip: this.commonServices.getIpAddress(),
      custom1: 'INV-INGRESO-BODEGA'
    }
    // params = {
    //   description: "Ingreso de Anexo de orden de compra",
    //   module: this.permisions.id_modulo,
    //   component: myVarGlobals.fOrdenesCompra,
    //   identifier: res.id_orden,
    //   ip: this.commonServices.getIpAddress(),
    //   accion: `Registro de anexos de orden de compra ${res.secuencia.toString().padStart(10, '0')} `,
    //   id_controlador: myVarGlobals.fOrdenesCompra,
    // };
    if (this.fileList.length != 0) {
      for (let i = 0; i < this.fileList.length; i++) {
        this.UploadService(this.fileList[i], id_prestamo, data);
      }
    }
    this.fileList = undefined
    this.lcargando.ctlSpinner(false)
  }

  UploadService(file, identifier, payload?: any): void {
    this.ordenesServices.uploadAnexo(file, payload).subscribe(
      res => {
        this.commonVarSrvice.contribAnexoLoad.next({ condi: 'infimas', id: identifier })
      },
      err => {
        this.toastr.info(err.error.message);
      })
  }
  expandListProveedores() {
    // if (this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    // } else {
    const modalInvoice = this.modalService.open(ModalProveedoresComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    //modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    //modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    //modalInvoice.componentInstance.validacion = 8;
    //}
  }

  //  cargarTablaSolicitudes(){
  //   let data = {
  //     id_solicitud: this.id_solicitud
  //   }
  //   this.ordenesServices.getSolicitudes(data).subscribe(
  //     (res)=> {
  //       this.dataOrder = res['data']
  //       console.log(this.dataOrder)
  //     }
  //   )
  //  }

  enviarCorreo = async () => {
    if (this.estado !== 'C') {
      Swal.fire('El documento no se encuentra cerrado.', '', 'warning')
      return;
    }

    const { value: email } = await Swal.fire({
      title: 'Escriba el correo del destinatario',
      input: 'email',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      inputLabel: 'Correo Electronico',
      inputPlaceholder: 'Escriba el correo electronico'
    })

    if (email) {
      this.lcargando.ctlSpinner(true)
      try {
        let response = await this.ordenesServices.enviarCorreo({ destinatario: email, ingreso: this.id })
        console.log(response)
        this.lcargando.ctlSpinner(false)
        Swal.fire(`Notificacion enviada a ${email}.`, '', 'success')
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error enviando Correo')
      }
    }
  }

  expandProductoDetalles(id: number, producto: any) {
    if (id == null) {
      Swal.fire('Ingreso de Bodega no ha sido guardado.', 'Guarde primero el documento para ingresar los detalles.', 'warning')
      return;
    }

    const modal = this.modalService.open(ModalProductoDetallesComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.documento = { id, estado: this.estado, bodega: this.bodega }
    modal.componentInstance.doc_detalle_producto = producto
  }

}
