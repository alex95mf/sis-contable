import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EgresosBodegaService } from './egresos-bodega.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DiferedComponent } from 'src/app/view/comercializacion/facturacion/invoice-sales/difered/difered.component';
import { GlobalTableComponent } from '../../../commons/modals/global-table/global-table.component';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { BusquedaEgresosComponent } from './busqueda-egresos/busqueda-egresos.component';
import { ModalDepartamentosComponent } from 'src/app/config/custom/modal-departamentos/modal-departamentos.component';
import { EncargadoTrasladoComponent } from '../traslado/encargado-traslado/encargado-traslado.component';
import { ModalGruposComponent } from '../../configuracion/producto/modal-grupos/modal-grupos.component';
import { environment } from 'src/environments/environment';
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';
import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';
import { ModalProductoDetallesComponent } from './modal-producto-detalles/modal-producto-detalles.component';
import Swal from 'sweetalert2';
import { ModalBuscaVehiculoComponent } from './modal-busca-vehiculo/modal-busca-vehiculo.component';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
standalone: false,
  selector: 'app-egresos-bodega',
  templateUrl: './egresos-bodega.component.html',
  styleUrls: ['./egresos-bodega.component.scss']
})
export class EgresosBodegaComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('TipoBienes') cmb_tipoBienes: NgSelectComponent

  permissions: any;
  processing: boolean = false;
  verifyRestore = false;
  toDatePicker: Date = new Date();

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
  num_documento: any;
  bodega: any;
  claseBien: any;
  arrayBodega: Array<any> = [];
  fecha_doc: string = moment().format('YYYY-MM-DD');



  filtClient: any;
  moduloUser: any = "";

  fecha: any;
  num_point_emision: any;
  validate_cupo: any = false;
  disabled: any = false;
  datoAsig = false;
  motivoBol = true;


  datoGene = false;
  tipo = [];
  motivoC = [];
  motivosCR = []
  catalog_filter:any = []

  responsable1 = true
  prooved = true
  instintic = true
  datGen = true
  datoEnt = false
  datoRecep=false
  datoRecepVal = true
  datoRecepVal1= true

  motivo: any;
  tipoEgreso: string|null = null;
  // dateConverter: any;
  tipo_bien: any
  id_responsable: any;
  UserSelect: any;
  id_solicitado_por: any;
  responsable: any;
  institucion: any;

  proveedorActive = {
    razon_social: null
  }

  departamentoSelect: any = {
    dep_nombre: ""
  };

  recibido = {
    id_responsable: null,
    recibido: null,
    nombre_departamento_recibido: null,
    nombre_cargo_recibido: null
  }

  autorizado = {
    id_responsable: null,
    recibido: null,
    nombre_departamento_recibido: null,
    nombre_cargo_recibido: null
  }

  entrega = {
    id_responsable: null,
    recibido: null,
    nombre_departamento_recibido: null,
    nombre_cargo_recibido: null
  }



  /*actions*/
  // actions: any = { dComponet: false };

  actions: any = {
    btnNuevo: false,
    btnGuardar: false,
    btnEnviar: false,
    btncancelar: false,
    btnDescargar: false,
    dComponet: false
  };

  disabledGrupo: any = true;
  disabledSubGrupo: any = true;
  agregaProduct: any = true;

  disabledCantidad: any = false;

  /*data totales*/
  dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };

  /*detalle compra*/
  // dataProducto = [{ nombre: null, codigoProducto: null, marca: null, stock: 0.00, cantidad_reservada: 0.00, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }];
  dataProducto: Array<any> = [];
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


  catalog: any = []


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
  listaProducto: any = {
    fk_grupo: 0,
    fk_subgrupo: 0,
    nombre: "",
    codigoBienes: "",
    UDMCompra: "",
    stock: 0,
    codigoProducto: "",
    costo: 0
  }
  id_egreso_bodega: any;

  genera_nota_credito: boolean = false;
  cmb_bodegas: any[] = [];
  bodegaOrigen: number|null = null;
  bodegaDestino: number|null = null;
  vehiculo: any;

  nombre_departamento_responsable: any;
  nombre_cargo_responsable: any;
  fixedBodega: boolean = false

  constructor(
    private commonServices: CommonService,
    private commonVarServices: CommonVarService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private invService: EgresosBodegaService,
    private socket: Socket,
    private cierremesService: CierreMesService
  ) {
    this.invService.cantEgreso$.subscribe(
      (res: any) => {
        // Asignar al producto el desglose
        Object.assign(
          this.dataProducto.find((item: any) => item.id_producto == res.producto.id_producto),
          { desglose: res.desglose }
        )

        console.log(this.dataProducto)
      }
    )

    this.invService.listaProductos$.subscribe(
      (res: any) => {
        console.log(res)
        this.fixedBodega = true
        this.addItems(res)
        this.vmButtons[0].habilitar = false;
      }
    )

    this.commonVarServices.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true); : this.lcargando.ctlSpinner(false);
    })
    this.commonVarServices.selectSubGrupo.asObservable().subscribe(
      (res) => {
        this.subgrupo = res
        console.log(this.subgrupo)
        this.listaProducto.fk_subgrupo = this.subgrupo.id_subgrupo_producto
        this.lcargando.ctlSpinner(false)
        this.disabled = false;
        this.agregaProduct = false;

      }
    )
    this.commonVarServices.encargadoSelect.asObservable().subscribe(
      (res)=>{
        console.log(res);

        if(res['tipo']==4){
          this.id_responsable= res['responsable']['id_empleado'];
          this.responsable = res['responsable']['emp_full_nombre'];
          this.nombre_departamento_responsable = res['responsable']['departamento']['dep_nombre'];
          this.nombre_cargo_responsable = res['responsable']['cargos']['car_nombre'];
        }else if(res['tipo']==1){
          console.log(res);
          this.recibido.id_responsable= res['dt']['id_empleado'];
          this.recibido.recibido = res['dt']['emp_full_nombre'];
          this.recibido.nombre_departamento_recibido = res['dt']['departamento']['dep_nombre'];
          this.recibido.nombre_cargo_recibido = res['dt']['cargos']['car_nombre'];

        }else if(res['tipo']==2){
          this.autorizado.id_responsable= res['dt']['id_empleado'];
          this.autorizado.recibido = res['dt']['emp_full_nombre'];
          this.autorizado.nombre_departamento_recibido = res['dt']['departamento']['dep_nombre'];
          this.autorizado.nombre_cargo_recibido = res['dt']['cargos']['car_nombre'];

        }else if(res['tipo']==3){
          this.entrega.id_responsable= res['dt']['id_empleado'];
          this.entrega.recibido = res['dt']['emp_full_nombre'];
          this.entrega.nombre_departamento_recibido = res['dt']['departamento']['dep_nombre'];
          this.entrega.nombre_cargo_recibido = res['dt']['cargos']['car_nombre'];

        } else{
          this.UserSelect = res['dt']['emp_full_nombre'];
          this.id_solicitado_por = res['dt']['id_empleado'];
        }


        this.filtClient = {
          id_personal: res['dt']['id_empleado'],
          nombres: res['dt']['emp_full_nombre']

        }
        //this.moduloUser = res['cargos']['car_nombre']

      }
    )
    // this.commonVarServices.encargadoSelect.asObservable().subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.UserSelect = res['emp_full_nombre'];
    //     this.filtClient = {
    //       id_personal: res['id_empleado'],
    //       nombres: res['emp_full_nombre']

    //     }
    //     this.moduloUser = res['cargos']['car_nombre']

    //   }
    // )

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

    this.commonVarServices.EgresosBodega.asObservable().subscribe(
      (res) => {
        console.log(res)

        // this.departamentoSelect = undefined

        this.disabled = true;
        this.num_doc = res.num_doc;
        this.id_egreso_bodega = res.id_egreso_bodega;
        this.bodegaOrigen = res.origen?.id_bodega_cab ?? null;
        this.bodegaDestino = res.destino?.id_bodega_cab ?? null;
        this.vehiculo = res.vehiculo ?? null;
        this.vmButtons[3].habilitar = false;
        // this.customerSelect = res.proveedor.razon_social;
        // this.customerSelect = res.contribuyente.razon_social;
        // this.customer.num_documento = res.contribuyente.num_documento;
        // this.cupo_credito = res.cupo_credito;
        // this.dateConverter = res.fecha;
        this.fecha_doc = res.fecha
        if (res.departamento != null) {
          this.departamentoSelect = {
            dep_nombre: ""
          };
          this.departamentoSelect.dep_nombre = res.departamento.dep_nombre;
        }
        if (res.empleado_solicita != null) {
          this.UserSelect = res.empleado_solicita.emp_full_nombre;
        }
        if (res.empleado != null) {
          this.responsable = res.empleado.emp_full_nombre;
        }
        // this.bodega = res.fk_bodega;
        this.customer.observationSales = res.observaciones;
        // this.customer['asesor']['nombre']=res.asesor.nombre;
        // this.dataProducto = [];
        // console.log(res.detalles[0].cantidad);


        this.grupo.tipo_bien = res.tipo_bien

        if(res.proveedor){
          this.proveedorActive = res.proveedor
          this.proveedorActive['razon_social'] = res.proveedor?.razon_social
        }

        this.institucion = res.institucion

        this.recibido = res.recibido === null ? {} : res.recibido
        this.recibido['recibido']= res.recibido?.emp_full_nombre
        this.recibido['nombre_departamento_recibido']= res?.recibido?.departamento.dep_nombre
        this.recibido['nombre_cargo_recibido']= res?.recibido?.cargos.car_nombre

        this.autorizado = res.autorizado === null ? {} : res.autorizado
        this.autorizado['recibido']= res?.autorizado?.emp_full_nombre
        this.autorizado['nombre_departamento_recibido']= res?.autorizado?.departamento.dep_nombre
        this.autorizado['nombre_cargo_recibido']= res?.autorizado?.cargos.car_nombre

        this.entrega = res.entrega === null ? {} : res.entrega
        this.entrega['recibido']= res?.entrega?.emp_full_nombre
        this.entrega['nombre_departamento_recibido']= res?.entrega?.departamento.dep_nombre
        this.entrega['nombre_cargo_recibido']= res?.entrega?.cargos.car_nombre
        this.tipoEgreso = res.tipoegreso
        this.mostrarCampos(res.tipoegreso)
        this.motivoBol = true
        this.motivo = res.motivo

        this.genera_nota_credito = res['genera_nota_credito']

        // entrega = {
        //   id_responsable: null,
        //   recibido: null,
        //   nombre_departamento_recibido: null,
        //   nombre_cargo_recibido: null
        // }

        // { id_responsable: null, recibido: null, nombre_departamento_recibido: null, nombre_cargo_recibido: null }

        console.log(this.departamentoSelect, this.responsable, this.UserSelect);
        if(res.departamento || res.empleado || res.empleado_solicita){
          console.log('H1');
          this.datoAsig = true
        }
        if(res.proveedor  || res.institucion ){
          console.log('H2');
          this.datoEnt = true
        }
        if(res.recibido || res.autorizado || res.entrega){
          console.log('H3');
          this.datoRecep = true
        }



        res.detalles.forEach((p) => {
          let desglose = [];
          p.producto.detalles.forEach((producto_detalle: any) => {
            console.log(producto_detalle)
            if (producto_detalle.desglose) {
              Object.assign(
                producto_detalle.desglose,
                {
                  cantidad: producto_detalle.cantidad,
                  lote: producto_detalle.lote,
                  fecha_caducidad: producto_detalle.fecha_caducidad
                }
              )
              desglose.push(producto_detalle.desglose)
            }
          });

          Object.assign(p,
            {
              action: true,
              nombre: p.producto.nombre,
              codigoProducto: p.codigoproducto,
              precio_normal: p.costo_unitario,
              stock: p.stock_actual,
              quantity: p.cantidad,
              price: p.costo,
              totalAux: p.costo_total,
              desglose: desglose,
            });
        });

        this.dataProducto = JSON.parse(JSON.stringify(res.detalles));
      }
    )
    // this.commonVarServices.selectProducto.asObservable().subscribe(
    //   (res) => {
    //     console.log(res)
    //     //this.dataProducto = res['data'];
    //     this.addItems(res)
    //     this.vmButtons[0].habilitar = false;

    // }
    // )



    this.commonVarServices.departamentoSelect.asObservable().subscribe(
      (res) => {
        this.departamentoSelect = res;

        //console.log(this.departamentoSelect)
      }
    )

    this.commonVarServices.selectProveedorCustom.subscribe(
      (res)=>{
        this.proveedorActive = res;
        console.log(this.proveedorActive);
        // this.titulosDisabled = false;
        // this.cuentaDisabled = false;
        //this.addConcepto = true;
        this.vmButtons[3].habilitar = false;
        // this.getCatalogoConceptos();
      }
    )

    this.invService.vehiculoSelected$.subscribe(
      (vehiculo: any) => {
        this.vehiculo = vehiculo;
      }
    )
  }

  mostrarCampos(campos){
    console.log(campos);

    if(campos === undefined){
      this.motivo = undefined
      this.motivosCR = []
      this.datoGene = false
      this.datGen = true

      this.datoEnt = false
      this.prooved = true

      this.datoAsig = false
      this.responsable1 = true

      this.datoRecep = false
      this.datoRecepVal = true
      this.datoRecepVal1 = true
    } else {
      let valor = this.motivoC.filter(e => e.grupo === campos.valor);

      this.datGen = false
      this.motivoBol = false
      this.motivosCR = valor
    }

    if (campos.valor == 'TRASLADO' || campos.valor == 'CUSTODIO') {
      this.grupo.tipo_bien = 'EXI'
      this.cmb_tipoBienes.setDisabledState(true)
      this.buscarGrupoProducto('EXI')
    } else {
      this.cmb_tipoBienes.setDisabledState(false)
    }
  }

  mostrarCamMotiv(evento){
    console.log(evento);
    if(evento === "Garantia" || evento === "Mantenimiento" || evento === "Prestamos" || evento === "Pignoraciones" || evento === "Comodatos" ){
      console.log('H1');
      this.datoGene = true
      this.datGen = false

      this.datoAsig = false
      this.responsable1 = true
      if(evento === "Garantia" || evento === "Mantenimiento"){
        this.datoEnt = true
        this.prooved = false

        this.datoRecep = true
        this.datoRecepVal = false

        this.instintic = true
        this.datoAsig = false
      }

      if(evento === "Prestamos" || evento === "Pignoraciones" || evento === "Comodatos"){
        this.datoEnt = true
        this.prooved = true
        this.instintic = false

        this.datoRecep = true
        this.datoRecepVal = false

        this.datoAsig = false
      }

    }else if(evento === "SM" ){
      this.datoGene = true
      this.datoAsig = true
      this.datGen = false
      this.responsable1 = false

      this.instintic = true
      this.datoRecep = false
      this.datoRecepVal = true
      this.datoRecepVal1 = true

      this.datoEnt = false
    }else if(evento === "Remate" || evento === "Venta" || evento === "Permuta" || evento === "Transferencia" || evento === "Chatarrizacion" || evento === "Reciclaje" || evento === "Destruccion" || evento === "Baja"){
      this.datoGene = true
      this.datGen = false

      this.datoEnt = false
      this.prooved = true

      this.datoAsig = false
      this.responsable1 = true

      this.datoRecep = true
      this.datoRecepVal = false
      this.datoRecepVal1 = false

      this.instintic = true

    }else{
      this.datoGene = true
      this.datGen = false

    }


  }

  detectBodega() {
    if (this.bodegaOrigen == this.bodegaDestino) {
      this.toastr.warning('La bodega de destino no puede ser la misma que la de Origen', 'Validacion')
      this.vmButtons[1].habilitar = true
    } else {
      this.vmButtons[1].habilitar = false
    }
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsEgreBode", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsEgreBode", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsEgreBode", paramAccion: "", boton: { icon: "far fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnsEgreBode", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: true },
      { orig: "btnsEgreBode", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    // this.dateConverter = moment(this.toDatePicker).format('YYYY-MM-DD');
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
        this.fillCatalog()
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    });
  }

  addItems(data) {
    if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
      return;
    }
      if (this.dataProducto.length > 0) {
        if (this.dataProducto[0].tipo_bien != this.grupo.tipo_bien) {
          this.toastr.info("No puede agregar items de diferente tipo de bien");
        } else {
          if (this.grupo.tipo_bien == 'EXI') {
            let items =
            {
              action: true,
              nombre: data.nombre,
              codigoProducto: data.codigoproducto,
              precio_normal: data.pvp,
              stock: data.stock,
              quantity: 0,
              price: data.costo,
              totalAux: 0.00,
              costo: data.costo,
              id_producto: data.id_producto,
              id_grupo_producto: this.claseSelect?.id_grupo_productos ?? data.grupo?.codigo_grupo_producto,
              id_subgrupo_producto: this.subgrupo.id_subgrupo_producto,
              tipo_bien: this.grupo.tipo_bien,
              perecible: data.perecible ?? null,
              bodega_stock: data.bodega_stock,
            };
            console.log(items)
            this.dataProducto.push(items);
          } else {
            if(this.tipoEgreso === "CUSTODIO"){
              if(this.id_responsable != undefined && this.departamentoSelect.id_departamento != undefined ){
                let items =
                {
                  action: true,
                  nombre: data.nombre,
                  codigoProducto: data.codigoproducto,
                  precio_normal: data.pvp,
                  stock: data.stock,
                  quantity: 1,
                  price: data.costo,
                  totalAux: 0.00,
                  costo: data.costo,
                  id_producto: data.id_producto,
                  id_grupo_producto: this.claseSelect.id_grupo_productos ?? data.grupo?.codigo_grupo_producto,
                  id_subgrupo_producto: this.subgrupo.id_subgrupo_producto,
                  tipo_bien: this.grupo.tipo_bien,
                  perecible: data.perecible ?? null,
                  fk_custodio: this.id_responsable,
                  fk_departamento_custodio: this.departamentoSelect.id_departamento,
                };
              this.dataProducto.push(items);
              this.disabledCantidad = true;
              }else{
                this.toastr.info("Debe seleccionar un Departamento y un Responsable");
              }

            }else{
              let items =
                {
                  action: true,
                  nombre: data.nombre,
                  codigoProducto: data.codigoproducto,
                  precio_normal: data.pvp,
                  stock: data.stock,
                  quantity: 1,
                  price: data.costo,
                  totalAux: 0.00,
                  costo: data.costo,
                  id_producto: data.id_producto,
                  id_grupo_producto: this.claseSelect.id_grupo_productos ?? data.grupo?.codigo_grupo_producto,
                  id_subgrupo_producto: this.subgrupo.id_subgrupo_producto,
                  tipo_bien: this.grupo.tipo_bien,
                  perecible: data.perecible ?? null,
                  bodega_stock: data.bodega_stock,
                };
              this.dataProducto.push(items);
              this.disabledCantidad = true;
            }
          }
        }
      } else {
        if (this.grupo.tipo_bien == 'EXI') {
          // Este es el que recibe para EXI
          let items =
          {
            action: true,
            nombre: data.nombre,
            codigoProducto: data.codigoproducto,
            precio_normal: data.pvp,
            stock: data.stock,
            quantity: 0,
            price: data.costo,
            totalAux: 0.00,
            costo: data.costo,
            id_producto: data.id_producto,
            id_grupo_producto: this.claseSelect?.id_grupo_productos ?? data.grupo?.codigo_grupo_producto,
            id_subgrupo_producto: this.subgrupo.id_subgrupo_producto,
            tipo_bien: this.grupo.tipo_bien,
            perecible: data.perecible ?? null,
            bodega_stock: data.bodega_stock,
          };
          console.log(items)
          this.dataProducto.push(items);
        } else {
          if(this.tipoEgreso === "CUSTODIO"){
            if(this.id_responsable != undefined && this.departamentoSelect.id_departamento != undefined ){
              let items =
              {
                action: true,
                nombre: data.nombre,
                codigoProducto: data.codigoproducto,
                precio_normal: data.pvp,
                stock: data.stock,
                quantity: 1,
                price: data.costo,
                totalAux: 0.00,
                costo: data.costo,
                id_producto: data.id_producto,
                id_grupo_producto: this.claseSelect.id_grupo_productos ?? data.grupo?.codigo_grupo_producto,
                id_subgrupo_producto: this.subgrupo.id_subgrupo_producto,
                tipo_bien: this.grupo.tipo_bien,
                perecible: data.perecible ?? null,
                fk_custodio: this.id_responsable,
                fk_departamento_custodio: this.departamentoSelect.id_departamento,
              };
            this.dataProducto.push(items);
            this.disabledCantidad = true;
            }else{
              this.toastr.info("Debe seleccionar un Departamento y un Responsable");
            }
          }else{
            let items =
              {
                action: true,
                nombre: data.nombre,
                codigoProducto: data.codigoproducto,
                precio_normal: data.pvp,
                stock: data.stock,
                quantity: 1,
                price: data.costo,
                totalAux: 0.00,
                costo: data.costo,
                id_producto: data.id_producto,
                id_grupo_producto: this.claseSelect.id_grupo_productos ?? data.grupo?.codigo_grupo_producto,
                id_subgrupo_producto: this.subgrupo.id_subgrupo_producto,
                tipo_bien: this.grupo.tipo_bien,
                perecible: data.perecible ?? null,
                bodega_stock: data.bodega_stock,
              };
            this.dataProducto.push(items);
            this.disabledCantidad = true;
          }
        }
      }
  }

  async getBodega() {
    /* this.invService.getBodegas().subscribe(res => {
      //this.toma.bodega = 0;
      this.arrayBodega = res['data'];

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    }) */
    try {
      let bodegas = await this.invService.getBodegasAsync()
      // console.log(bodegas)
      this.cmb_bodegas = bodegas
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Bodegas')
    }
  }

  getCatalogos() {
    let data = {
      params: "'TIPO PAGO','FORMA PAGO','TIPO COMPRA','INV_TIPO_BIEN' "
    }
    this.invService.getCatalogos(data).subscribe(res => {
      this.dataBuy.tipo_pago = res['data']['TIPO PAGO'];
      this.dataBuy.forma_pago = res['data']['FORMA PAGO'];
      this.catalog = res["data"]["INV_TIPO_BIEN"];
      this.getCustomers();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  buscarGrupoProducto(event) {
    if (event == undefined) return;
    this.claseSelect = []
    if (this.subgrupo) this.subgrupo.descripcion = undefined
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

  selectedGrupo(event) {
    if (event == undefined) return;
    console.log(event);
    this.subgrupo = event
    this.agregaProduct = false;
    if (event) {
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
      this.dataProducto = [{ nombre: null, codigoroducto: null, marca: null, stock: 0.00, cantidad_reservada: 0.00, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }];
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
    let message = ''

    if (this.bodegaOrigen == null) message += '* No ha escogido Bodega de Origen.<br>'
    if (this.grupo.tipo_bien == null || this.grupo.tipo_bien == 0) message += '* No ha escogido un Tipo de Bien.<br>'

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', {enableHtml: true})
      return
    }

    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListBusquedaComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    // modal.componentInstance.permissions = this.permissions;
    modal.componentInstance.validate = 'EB'
    modal.componentInstance.bodega = this.bodegaOrigen;
    modal.componentInstance.subgrupo = this.subgrupo
    modal.componentInstance.verifyRestore = this.verifyRestore;
    modal.componentInstance.tipo_bien = this.grupo.tipo_bien
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
      this.dataProducto[index]['price'] = this.dataProducto[index]['pvp'];
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
    // console.log('aqui')
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
    this.fixedBodega = false
    this.disabledCantidad = false;
    this.agregaProduct = true;
    this.disabledSubGrupo = true;
    this.disabledGrupo = true;
    this.disabled = false;
    this.responsable = "";
    this.departamentoSelect  = {
      dep_nombre: ""
    };
      this.grupo.tipo_bien = 0,
      this.UserSelect = "",
      this.claseSelect = "",
      this.subgrupo.descripcion = "",
      this.dataProducto = [],
      this.bodega = 0;
    this.num_doc = "";
    this.customer.observationSales = "";
    this.maxInvoicesPend = 0;
    this.maxInvoicesXCliente = 0;
    this.validate_cupo = false;
    localStorage.removeItem('dataProductsInvoice');
    this.quote = undefined;
    this.actions.dComponet = false;
    this.arraDetQuote = null;
    this.flagBtnDired = false;
    this.dataDifered = null;
    this.customer = { asesor: { nombre: null }, customerSelect: 0, group: { name: null } };
    this.customerSelect = 0;
    this.dataBuy.idTipDocSelect = 0;
    this.dataBuy.tipoPagoSelect = 0;
    this.dataBuy.formaPagoSelect = 0;
    this.id_responsable = undefined,
    this.id_solicitado_por = undefined,
    //this.valueLethers = "0 DÓLARES con 0 CENTAVOS";
    this.dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
    this.dataProducto = [];
    this.genera_nota_credito = false;
    //this.dataProducto = [{ nombre: null, codigoProducto: null, marca: null, stock: 0, cantidad_reservada: 0.00, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }];
    this.getTypeDocument();

    // this.dateConverter,
    this.grupo.tipo_bien,
    this.proveedorActive = {razon_social: null },
    this.institucion = undefined,
    this.recibido = {
      id_responsable: null,
      recibido: null,
      nombre_departamento_recibido: null,
      nombre_cargo_recibido: null
    },
    this.autorizado = {
      id_responsable: null,
      recibido: null,
      nombre_departamento_recibido: null,
      nombre_cargo_recibido: null
    },
    this.entrega = {
      id_responsable: null,
      recibido: null,
      nombre_departamento_recibido: null,
      nombre_cargo_recibido: null
    },
    this.tipoEgreso = null,
    this.motivo = undefined


    this.motivo = undefined
    this.motivosCR = []
    this.datoGene = false
    this.datGen = true
    this.datoEnt = false
    this.prooved = true
    this.datoAsig = false
    this.responsable1 = true
    this.datoRecep = false
    this.datoRecepVal = true
    this.datoRecepVal1 = true
    this.motivoBol = true

    this.bodegaOrigen = null;
    this.bodegaDestino = null;
    this.vehiculo = null;

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
      this.validateDataGlobal().then(respuesta => {
        if (respuesta) {

          (this as any).mensajeSpinner = "Verificando período contable";
          this.lcargando.ctlSpinner(true);
          let data = {
            "anio": Number(moment(this.fecha_doc).format('YYYY')),
            "mes": Number(moment(this.fecha_doc).format('MM'))
          }
            this.cierremesService.obtenerCierresPeriodoPorMes(data).subscribe(res => {

            /* Validamos si el periodo se encuentra aperturado */
            if (res["data"][0].estado !== 'C') {

              this.saveSales();

            } else {
              this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
              this.lcargando.ctlSpinner(false);
            }

            }, error => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.mesagge);
            })

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
      // if (this.dataProducto[0] == undefined) {
      //   this.toastr.info("Debe seleccionar productos");
      //   flag = true;
      // } else if(this.dataProducto.length != 0){
      //     for (let index = 0; index < this.dataProducto.length; index++) {
      //       if (this.dataProducto[index].codigoProducto == null) {
      //         this.toastr.info("No se pueden agregar productos sin código");
      //         flag = true; break;
      //       }
      //     }
      // }
      if (this.datoAsig && this.departamentoSelect.dep_nombre == "" || this.departamentoSelect.dep_nombre == undefined) {
        this.toastr.info("Debe seleccionar un departamento");
        flag = true;
      } else if (this.UserSelect == undefined && this.datoAsig) {
        this.toastr.info("Debe seleccionar un responsable");
        flag = true;
      }
      else if (this.grupo.tipo_bien === 'EXI') {
        if (this.dataProducto.length != 0) {

          for (let index = 0; index < this.dataProducto.length; index++) {
            console.log(this.dataProducto[index]);
            if (parseInt(this.dataProducto[index].quantity) <= 0 && this.dataProducto[index].action && this.grupo.tipo_bien === 'EXI') {
              this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0");
              flag = true; break;
            } else if (parseFloat(this.dataProducto[index].price) <= 0 && this.dataProducto[index].action && this.grupo.tipo_bien === 'EXI') {
              this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser 0");
              flag = true; break;
            }
            else if (parseInt(this.dataProducto[index]?.bodega_stock?.cantidad) <= 0 && this.dataProducto[index].action && this.grupo.tipo_bien === 'EXI') {
              this.toastr.info("Revise el stock de los productos, no puede estar vacio o ser 0");
              flag = true; break;
            } else if (parseInt(this.dataProducto[index].quantity) > parseInt(this.dataProducto[index]?.bodega_stock?.cantidad) && this.grupo.tipo_bien === 'EXI') {
              this.toastr.info("Revise la cantidad de los productos, no puede ser mayor al campo stock");
              flag = true; break;
            } else if (this.dataProducto[index].tipo_bien != this.grupo.tipo_bien) {
              this.toastr.info("No puede tener productos de diferente Tipo de bien");
              flag = true; break;
            }else if (this.dataProducto[index].codigoProducto == null) {
              this.toastr.info("No se pueden agregar productos sin código");
              flag = true; break;
            }
          }
        }
      }
      else if (this.grupo.tipo_bien === 'BCA' || this.grupo.tipo_bien === 'BLD' ) {
        if (this.dataProducto.length != 0) {

          for (let index = 0; index < this.dataProducto.length; index++) {
            console.log(this.dataProducto[index]);
            console.log(this.dataProducto[index].codigoproducto);
            if (this.dataProducto[index].quantity <= 0 && this.dataProducto[index].action && this.grupo.tipo_bien === 'EXI') {
              this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0");
              flag = true; break;
            } else if (this.dataProducto[index]?.stock <= 0 && this.dataProducto[index].action && this.grupo.tipo_bien === 'EXI') {
              this.toastr.info("Revise el stock de los productos, no puede estar vacio o ser 0");
              flag = true; break;
            } else if (this.dataProducto[index].codigoProducto == null) {
              this.toastr.info("No se pueden agregar productos sin código");
              flag = true; break;
            }else if (this.dataProducto[index].codigoProducto == null) {
              this.toastr.info("No se pueden agregar productos sin código");
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
      if (productSend[index].quantity <= 0 && this.grupo.tipo_bien === 'EXI') {
        this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0"); return;
      } else if (productSend[index].price <= 0 && this.grupo.tipo_bien === 'EXI') {
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

    this.validateStock(productSend).then(resultado => {
      if (resultado) {
        Swal.fire({
          text: 'Hay uno o varios productos con stock menor a la cantidad solicitada, ¿desea guardar la factura?',
          showDenyButton: true,
          confirmButtonText: `Guardar factura`,
          denyButtonText: `Revisar productos`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.save(productSend, notify, filter, prefict, info, resultado);
          }
        })
      } else {
        this.save(productSend, notify, filter, prefict, info, resultado);
      }
    })
  }

  async save(productSend, notify, filter, prefict, info, resultado) {
    console.log(productSend);
    (this as any).mensajeSpinner = "Guardando egreso de bodega...";
    this.lcargando.ctlSpinner(true);
    this.validatePrice(productSend).then(res => {
      localStorage.removeItem('dataProductsInvoice');
      this.textNotificationSend = ((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1) ? this.textNotificationSend + this.textNotification : this.textNotificationSend + "";
      this.textNotificationSend = (resultado) ? this.textNotificationSend + " Existen uno o varios productos con stock menor a la cantidad solicitada. " : this.textNotificationSend + "";
      this.textNotificationSend = (res) ? this.textNotificationSend + " Existen inconcistencia en los precios. " : this.textNotificationSend + "";
      this.textNotificationSend = (this.validate_cupo) ? this.textNotificationSend + ` Cliente ${this.customer.razon_social} no tiene suficiente cupo para el crédito ` : this.textNotificationSend + "";

      let data = {
        id_user: this.dataUser.id_usuario,
        tip_doc: this.dataBuy.idTipDocSelect,
        point_emision: this.num_point_emision,
        rentabilidad: 0.00,
        filter_doc: (res || resultado || this.validate_cupo || ((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1)) ? filter : this.latestStatus,
        status_venta: 0,
        pagada: 0,
        bodega: this.bodega,

        id_departamento: this.departamentoSelect.id_departamento,
        id_usuario_responsable: this.id_responsable,
        nombre_usuario_responsable: this.responsable,
        id_usuario_solicita: this.id_solicitado_por,
        nombre_usuario_solicita: this.UserSelect,

        fecha: this.fecha_doc,
        // dateConverter: this.dateConverter,
        tipo_bien: this.grupo.tipo_bien,
        proveedorActive: this.proveedorActive,
        institucion: this.institucion,
        recibido: this.recibido,
        autorizado: this.autorizado,
        entrega: this.entrega,
        tipoEgreso: this.tipoEgreso,
        motivo:this.motivo,
        genera_nota_credito: this.genera_nota_credito,

        list_product: productSend,

        fk_bodega_origen: this.bodegaOrigen,
        fk_bodega_destino: this.bodegaDestino,
        fk_vehiculo: this.vehiculo?.id_producto,

        // id_quotes: (this.quote != undefined) ? this.quote.id : null,

        // observation_sales: this.customer.observationSales,

        // customer: this.customer,
        // date: moment(this.toDatePicker).format('YYYY-MM-DD'),

        // totals: this.dataTotales,
        // payment_type: this.dataBuy.tipoPagoSelect,
        // payment_method: this.dataBuy.formaPagoSelect,

        // status: (res) ? "En proceso" : "Aprobado",

        // ip: this.commonServices.getIpAddress(),
        // accion: `Registro de Egreso de Bodega ${this.customer['asesor']['nombre']}`,
        // id_controlador: myVarGlobals.fGBEgreBodega,
        // notifycation: (!res && !resultado && !this.validate_cupo && !((this.maxInvoicesPend >= this.maxInvoicesXCliente) && this.customer.credito == 1)) ? notify : `${notify}, esta factura necesita ser aprobada`,
        // abbr_doc: prefict[0].codigo,
        // id_document: prefict[0].fk_documento,

        // usersFilter: this.commonServices.filterUserNotification(filter, 2),
        // id_us_aprob: null,
        // name_us_aprob: null,
        // sendNotification: res,
        // type_difered: (this.dataBuy.tipoPagoSelect == "Contado") ? info : this.dataDifered,
        // identifyQuotes: (this.quote != undefined) ? true : false,
        // //num_factura: this.num_fac,
        // num_serial: this.num_serial,
        // mot_notif_aprob: this.textNotificationSend,
        // fecha: this.dateConverter
      }
      console.log(data);
      this.invService.saveEgresoBodega(data).subscribe(
        res => {
          if (res["status"] == 1) {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: 'Proceso exitoso!!',
              text: `Su egreso de bodega se realizo exitosamente`,
              icon: 'success',
              confirmButtonColor: '#4DBD74',
              confirmButtonText: 'Aceptar'
            });

            console.log(res)
            this.num_doc = res['data'].num_doc;
            this.id_egreso_bodega = res['data'].id_egreso_bodega;

            this.disabled = true;
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
    this.disabled = false;

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;

  }

  imprimirComprobante() {
    console.log(this.id_egreso_bodega)
    window.open(environment.ReportingUrl + "rep_comprobante_egreso_bodega.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_egreso_bodega=" + this.id_egreso_bodega, '_blank')
  console.log(environment.ReportingUrl + "rep_comprobante_egreso_bodega.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_egreso_bodega=" + this.id_egreso_bodega)
  }

  expandListDocumentosRec() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(BusquedaEgresosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
    modal.componentInstance.tipo = this.tipo;
  }
  modalDepartamentos() {
    let modal = this.modalService.open(ModalDepartamentosComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  modalEncargado(data: any) {
    let modal = this.modalService.open(EncargadoTrasladoComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.tipo = data;
  }

  modalGrupos() {

    let modal = this.modalService.open(ModalGruposComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = true
    modal.componentInstance.verifyRestore = this.verifyRestore;
    modal.componentInstance.claseSelect = this.claseSelect;
    //this.generaActionRawMaterial()
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = "Cargando Catalogs";
    let data = {
      params: "'INV_TIPO_EGRESO', 'INV_MOTIVO_EGRESO', 'INV_TIPO_BIEN'",
    };
    this.invService.getCatalogs(data).subscribe(
      (res) => {
        // console.log(res);
        this.tipo = res["data"]["INV_TIPO_EGRESO"];
        this.motivoC = res["data"]["INV_MOTIVO_EGRESO"];
        this.catalog = res["data"]["INV_TIPO_BIEN"];
         //this.catalog = res["data"]["INV_TIPO_BIEN"].filter(c => {c.valor != 'EXI'});
        this.catalog_filter = this.catalog.filter(e => e.valor != 'EXI')

        // console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }


  expandListProveedores() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Liquidaciones.");
    } else {
      const modalInvoice = this.modalService.open(ModalProveedoresComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      //modalInvoice.componentInstance.validacion = 8;
    }
  }

  expandDetalles(producto: any) {
    if (this.bodegaOrigen == null) {
      this.toastr.warning('No ha seleccionado una Bodega de Origen')
      return
    }
    const modal = this.modalService.open(ModalProductoDetallesComponent , { size: 'xl', backdrop: 'static' });
    modal.componentInstance.producto = producto;
    modal.componentInstance.bodega = this.bodegaOrigen
    modal.componentInstance.disabled = this.disabled
  }

  expandVehiculos() {
    const modal = this.modalService.open(ModalBuscaVehiculoComponent, { size: 'xl', backdrop: 'static' })
  }
}
