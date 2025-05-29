import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/commonServices';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ProductoService } from './producto.service';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalTableComponent } from '../../../commons/modals/global-table/global-table.component'
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ListDocumentosComponent } from './list-documentos/list-documentos.component';
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ModalGruposComponent } from './modal-grupos/modal-grupos.component';
import * as moment from 'moment';
import { ModalVistaFotosComponent } from './modal-vista-fotos/modal-vista-fotos.component';
import { ModalNuevoComponent } from './modal-nuevo/modal-nuevo.component';
import { ModalBodegaComponent } from './modal-bodega/modal-bodega.component';
import { SweetAlertResult } from 'sweetalert2';
import { ModalReclamosComponent } from './modal-reclamos/modal-reclamos.component';
import { IReclamo } from './modal-reclamos/IReclamos';
import { ModalUdmComponent } from './modal-udm/modal-udm.component';
import { Chart } from 'chart.js';
//import { ConsoleReporter } from 'jasmine';
import { CurrencyMaskDirective } from "ngx-currency";
declare const $: any;

interface Costo {
  id?: number;
  fecha: string;
  descripcion: string;
  observacion: string | null;
  valor: number;
}

@Component({
standalone: false,
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  dataGrupo: any = [];
  dataTipo: any = [{ id: "Producto", nombre: "Producto" }, { id: "Materia Prima", nombre: "Materia Prima" }];
  dataTipoCompra: any = [{ id: "Local", nombre: "Local" }, { id: "Importación", nombre: "Importación" }, { id: "Producción", nombre: "Producción" }];
  dataMetodoCosto: any = [{ id: "Directo", nombre: "Directo" }, { id: "Promedio", nombre: "Promedio" }];
  dataProServicio: any = [{ id: "Productos", nombre: "Productos" }, { id: "Servicios", nombre: "Servicios" }];
  fTitle = "Producto en Bodega";
  bodegas: any = [];
  bodegaDisabled = false;
  dataMarcas: any;
  dataModelos: any;
  dataColores: any;
  dataPaises: any;
  dataUMC: any;
  dataUMV: any;
  dataUser: any;
  permisions: any = [{ver: 0, abrir: 0, consultar: 0, editar: 0}];
  grupoSelect: any = 0;
  tipoSelect: any = "Producto";
  TipoCompraSelect: any = 0;
  origenData: any = 0;
  presentacionData: any;
  descuentoData: any;
  tasaData: any;
  udmcSelect: any = null;
  udmvSelect: any = 0;
  CBData: any;
  sugeridoData: any;
  enVentaData: any = true;
  minimoData: any;
  maximoData: any;
  nameData: any;
  metCostoSelect: any = 0;
  claseSelect: any = 0;
  costoData: any = 0;
  codigoData: any;
  permissions: any;
  checkCodigo: any;
  genericoData: any;
  NumParteData: any;
  marcaSelect: any = 0;
  modeloSelect: any = 0;
  colorSelect: any = 0;
  formulaSelect: any;
  newCatalogo: any;
  tipoCatalogo: any;
  valNameGlobal: any;
  valorCatalogo: any = null;
  description: any = null;
  valueLabel: any;
  btnBorrar: any = true;
  btncancelar: any = true;
  btnModificar: any = true;
  btnGuardar: any = true;
  btnNuevo: any;
  disabledProduct: any;
  randomGenerate: any;
  disabledCode: any;
  processing: any;
  checkAuth: any = false;
  dataContabilidad: any = {};
  newCodeSend: any;
  disabledForCheck: any;
  formulaData: any;
  btnDelete: any = true;
  searchData: any;
  searchDataUpdateDelete: any;
  disabledModSearch: any = false;
  editCode: any;
  editSelectCode: any;
  id_group_receibed: any;
  materiaPrima: any = false;
  disabledMateriaPrima: any = false;
  disabledClaseServicio: any = false;
  dbQr: any = false;
  dAction: any = false;
  btnBuscar: any = false;
  observation: any = "";
  marcaSelectNew: any = null;
  disableMarca: any = true;
  flag: any = false;
  codigoBienes: any;
  codigoBienesDescripcion: any;
  grupo_producto: any;
  secuencial: any;
  id_producto: any;
  id_subgrupo: 0
  listaCatalogo: any = []
  peligrosidad: any;
  perecible: any;
  fecha_caducidad: any = moment(new Date()).format('YYYY-MM-DD')
  observacion_peligrosidad: any;
  fecha_garantia: any = moment(new Date()).format('YYYY-MM-DD')
  tipo_material: any;
  ano_vida_util: any;
  serie: any;
  observacion_requerimiento: any;
  nuevoCodigo: any;
  estado_ficha_prod: any
  id_grupo_producto: any

  /* dictionaries */
  masa: Array<any> = [];
  long: Array<any> = [];
  aranceles: Array<any> = [];
  vmButtons: any = [];
  arrayCountrys: Array<any> = [];
  disabledFormula: any = false;
  listaProductos: any = []
  stock: any
  verifyRestore = false;
  subgrupo: any = [];
  bldDisabled = true;
  bcaDisabled = true;
  exDisabled = true;
  vidautilDisabled = true;
  serieDisabled = true;
  tipomaterialDisabled = true;
  observacionDisabled = true;
  departamentoDisabled = true;
  stockDisabled = true;
  catalogoDisabled = true;
  grupoDisabled = false;
  subgrupoDisabled = false;
  nroIngresoBodega: any
  vehiculo: any
  placa: any
  numero_chasis: any
  motor: any
  nro_vehiculo: any
  /* valores pedidos/liquidacion */
  values: any = {
    fk_arancel: 0, code: "", porcentaje: 0, nombre: "", fk_unidad_masa: 0, masa: 0.00, fk_unidad_longitud: 0, longitud_1: 0.00, longitud_2: 0.00, longitud_3: 0.00
  }
  stockaData: any;
  fechaUltimaCompra: string = null;
  precioUltimaCompra: number = null;

  /* Datatables */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: any = {};
  dtTrigger = new Subject();
  stockActualData: any = false;
  disabledCostor: any = true;
  dataUDM: Array<any> = [];

  departamento: any = [];
  ingresoDepartamento: any;
  estadoList = [
    { value: "P", label: "PENDIENTE" },
    { value: "C", label: "CERRADO" },

  ]
  fk_ingreso_bodega: any
  fotos: any = [];
  fotosEliminar: any = [];

  depCustodio: any;
  nombreCustodio: any;
  depResponsable: any;
  nombreResponsable: any;
  disabledCustodio: boolean = true;
  disabledResponsable: boolean = true;

  grupo_description = ""
  paginate: any
  filter: any;
  traslado: any = [];
  mantenimiento: any = [];
  codigo_auxiliar = ""
  poliza: any = [];
  titulo = "";
  dt : any

  bodegasStock: any = []

  tipo_bien_visibilidad: string = 'ALL'
  grupoProd: any

  produto: any;
  conceptos: Array<any>;
  conceptoSelected: any;
  costos: Array<Costo> = [];
  lotes: Array<any> = [];
  cmb_presentacion_a: Array<any> = [];
  cmb_presentacion_b: Array<any> = [];

  cmb_metodo_depreciacion: Array<any> = [];
  
  presentacion_a: number;
  presentacion_b: number;
  cmb_vehiculo = [
    { value: 'S', label: 'Si' },
    { value: 'N', label: 'No' },
  ]
  cmb_estado_bien = [
    { value: 'B', label: 'Bueno' },
    { value: 'R', label: 'Regular' },
    { value: 'M', label: 'Malo' },
    { value: 'P', label: 'Perdido' },
  ]
  selectedEstadoBien: string = 'B';

  selectedMetodoDepreciacion: string = 'LINEA_RECTA';

  chart1: Chart;
  ReportGrafiFPBarras: any;

  periodo: Date = new Date();
  mes_actual: any = 0;

  constructor(private toastr: ToastrService, private commonServices: CommonService, private router: Router,
    private ingresoService: ProductoService, private modalService: NgbModal
    , private commonVrs: CommonVarService, private elementRef: ElementRef) {
      
    this.commonServices.sendAccountingInv.asObservable().subscribe(res => {
      this.dataContabilidad = res;
    });

    this.commonServices.formulaInformation.asObservable().subscribe(res => {
      if (Object.entries(res).length > 0) {
        this.formulaData = res;
        if (this.formulaData.header !== undefined) {
          this.costoData = this.formulaData.header.costFinalFormCab
        }
      }
    });

    this.commonServices.cancelFormula.asObservable().subscribe(res => {
      this.checkAuth = false;
      this.disabledForCheck = false;
      this.costoData = 0;
    });

    this.commonServices.actionsSearchProduct.asObservable().subscribe(res => {
      this.searchData = res;
      this.searchProduct();
    })

    this.commonVrs.selectCatalogo.asObservable().subscribe(
      (res) => {
        console.log(res);
        this.codigoBienes = res['codigo_bienes']
        console.log(this.codigoBienes)
        this.codigoBienesDescripcion = res['codigo_bienes'] + "-" + res['descripcion']
        console.log(this.codigoBienesDescripcion)
        this.generaActionRawMaterial()
      }
    )

    //this.commonVrs.selectUbicacionProducto.asObservable().subscribe( 
    this.ingresoService.bodegas$.subscribe(
      (res) => {
        console.log(res)
        this.bodegas = res;
        //this.observacionesDisabled = false;
        //this.conceptosDisabled = false;
        //this.exoneracionDisabled = false;
  
        // this.bodegas.forEach(c => {
  
        // })
  
        
      }
    );

    this.ingresoService.updateUdm$.subscribe(
      async () => {
        this.lcargando.ctlSpinner(true)
        try {
          this.mensajeSppiner = 'Actualizando Unidades de Medida'
          let response = await this.ingresoService.getCatalogo({params: "'UNIDAD DE MEDIDA'"})
          console.log(response)
          this.dataUDM = response['UNIDAD DE MEDIDA'];

          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message)
        }
      }
    )

    this.commonVrs.selectGrupo.asObservable().subscribe(
      (res) => {
        this.claseSelect = res
        console.log(this.claseSelect)
        this.tipo_bien_visibilidad = this.claseSelect.tipo_bien;
        this.grupo_description = res['codigo_grupo_producto'] + "-" + res['descripcion'] + "-" + res['tipo_bien']
        this.grupo_producto = res['codigo_grupo_producto']
        if (this.claseSelect.tipo_bien == "EXI") {
          this.serieDisabled = true
          this.tipomaterialDisabled = true
          this.observacionDisabled = true
          this.catalogoDisabled = true
          this.stockDisabled = false
          this.departamentoDisabled = true
         

         // this.consultarReportGrafi();
        }
        else {
          this.serieDisabled = false
          this.tipomaterialDisabled = false
          this.observacionDisabled = false
          this.catalogoDisabled = false
          this.stockDisabled = true
          this.departamentoDisabled = false
         
        }
        //this.id_subgrupo = this.subgrupo.id_subgrupo_producto
        this.generarCodigoEx()
      }
    )


    this.commonVrs.selectProducto.asObservable().subscribe(
      (res) => {
        this.vmButtons[3].habilitar = false
        this.produto = res;
        this.costos = res.costos;
        this.lotes = (res.detalles != null) ? res.detalles : [];
        let costo_actual: number = this.produto.costo - this.produto.depreciacion_acumulada
        Object.assign(this.produto, { costo_actual })
        /* if (this.produto.depreciacion != null) {
          let anios: number = this.produto.depreciacion.años_depreciables
        } */
        
        if (res['validacion'] == 'PR' || res['validacion'] == null || res['validacion'] == undefined) {

          this.catalogoDisabled = true
          this.grupoDisabled = true
          //this.subgrupoDisabled = true

          console.log(res);
          this.tipo_bien_visibilidad = res['grupo']['tipo_bien']
          if (res['grupo']['tipo_bien'] == "EXI" || res['grupo']['tipo_bien'] == "EX" || res['grupo']['tipo_bien'] == "") {
            
            if(res?.stock_bodega.length > 0){
              this.bodegasStock = res?.stock_bodega.filter(e => e.bodega?.estado == 'A')
              console.log(this.bodegasStock)
            }
            console.log(this.bodegasStock)
           
            this.serieDisabled = true
            this.tipomaterialDisabled = true
            this.observacionDisabled = true
            this.catalogoDisabled = true
            this.stockDisabled = false
            this.departamentoDisabled = true
            this.estado_ficha_prod = res['estado_ficha_prod']
            this.ingresoDepartamento = "No hay departamento"
            this.vehiculo = res['vehiculo']
            this.nro_vehiculo = res['nro_vehiculo']
            this.placa = res['placa']
            this.numero_chasis = res['numero_chasis']
            this.motor = res['motor']
            this.nuevoCodigo = res['codigoproducto']
            // this.subgrupo.descripcion = res['subgrupo']['descripcion']
            //this.id_subgrupo = res['fk_subgrupo']
            this.id_producto = res['id_producto']
            this.claseSelect = res['grupo']
            this.origenData = res['procedencia']
            this.nameData = res['nombre']
            this.presentacionData = res['presentacion']
            this.marcaSelect = res['marca']
            this.grupoSelect = res['fk_grupo']
            this.udmcSelect = res['udmcompra']
            this.colorSelect = res['color']
            this.TipoCompraSelect = res['tipocompra']
            this.minimoData = res['minStock']
            this.maximoData = res['maxStock']
            this.sugeridoData = res['sugStock']
            this.observation = res['observation']
            this.codigoData = res['codigoproducto']

            this.selectedMetodoDepreciacion = res['metodo_depreciacion']
            //this.stock = res['stock']
            //this.stock =  res?.stock_bodega.reduce((suma: number, x: any) => suma + parseFloat(x.cantidad), 0)

            this.stock = res?.stock_bodega.reduce((acc: number, curr) => {
              if (curr.bodega?.estado == 'A') return acc + parseFloat(curr.cantidad)
              return acc
            }, 0)
            this.modeloSelect = res['modelo']
            this.tipo_material = res['tipo_material']
            this.fecha_caducidad = res['fecha_caducidad']
            this.fecha_garantia = res['fecha_garantia']
            this.observacion_peligrosidad = res['observacion_peligrosidad']
            this.observacion_requerimiento = res['observacion_requerimiento']
            this.peligrosidad = res['peligrosidad']
            this.perecible = res['perecible']
            this.serie = res['serie']
            this.codigo_auxiliar = "No tiene código auxiliar"
            this.codigoBienesDescripcion = "No tiene código de bienes"
            this.costoData = res['costo']
            this.grupo_producto = res['grupo_producto'];
            this.grupo_description = res['grupo']['codigo_grupo_producto'] + "-" + res['grupo']['descripcion'] + "-" + res['grupo']['tipo_bien']
            if (res['ingreso_bodega'] == null || res['ingreso_bodega'] == undefined || res['ingreso_bodega'] == "") {
              this.nroIngresoBodega = "No tiene ingreso bodega"
            }
            else {
              this.nroIngresoBodega = res['ingreso_bodega']['numero_ingreso_bodega']
            }
            this.ano_vida_util = res['ano_vida_util']
            !res['bienes'] ? this.codigoBienesDescripcion = undefined : this.codigoBienesDescripcion = res['bienes']['codigo_bienes'] + "-" + res['bienes']['descripcion']
            this.disabledCustodio = true;
            this.disabledResponsable = true;
            
            this.fechaUltimaCompra = res['fecha_ultima_compra'];
            this.precioUltimaCompra = res['precio_ultima_compra'];

            

          } else if (res['grupo']['tipo_bien'] == "BLD" || res['grupo']['tipo_bien'] == "BCA") {
            this.serieDisabled = false
            this.tipomaterialDisabled = false
            this.observacionDisabled = false
            this.catalogoDisabled = res['bienes'] != null
            this.stockDisabled = true
            this.departamentoDisabled = false
            this.estado_ficha_prod = res['estado_ficha_prod']
            this.vehiculo = res['vehiculo']
            this.nro_vehiculo = res['nro_vehiculo']
            this.placa = res['placa']
            this.numero_chasis = res['numero_chasis']
            this.motor = res['motor']
            this.costoData = res['costo']
            this.grupo_producto = res['grupo_producto'];
            this.grupo_description = res['grupo']['codigo_grupo_producto'] + "-" + res['grupo']['descripcion'] + "-" + res['grupo']['tipo_bien']
            if (res['departamento'] == undefined || res['departamento'] == null || res['departamento'] == "") {
              this.ingresoDepartamento = "No hay departamento"
            } else {
              this.ingresoDepartamento = res['departamento']['id_departamento']
            }
            this.nuevoCodigo = res['codigoproducto']
            // this.subgrupo.descripcion = res['subgrupo']['descripcion'] 
            //this.id_subgrupo = res['fk_subgrupo']
            this.id_producto = res['id_producto']
            this.claseSelect = res['grupo']
            this.origenData = res['procedencia']
            this.nameData = res['nombre']
            this.codigoBienes = res['codigoBienes']
            this.presentacionData = res['presentacion']
            this.marcaSelect = res['marca']
            this.grupoSelect = res['fk_grupo']
            this.udmcSelect = res['udmcompra']
            this.colorSelect = res['color']
            this.modeloSelect = res['modelo']
            this.TipoCompraSelect = res['tipocompra']
            this.minimoData = res['minStock']
            this.maximoData = res['maxStock']
            this.sugeridoData = res['sugStock']
            this.observation = res['observation']
            this.codigoData = res['codigoproducto']
            //this.codigoData = res['codigoBarra']
            this.stock = res['stock']
            this.tipo_material = res['tipo_material']
            this.fecha_caducidad = res['fecha_caducidad']
            this.fecha_garantia = res['fecha_garantia']
            this.observacion_peligrosidad = res['observacion_peligrosidad']
            this.observacion_requerimiento = res['observacion_requerimiento']
            this.peligrosidad = res['peligrosidad']
            this.perecible = res['perecible']
            this.serie = res['serie']
            this.nroIngresoBodega = (res['ingreso_bodega'] != null) ? res['ingreso_bodega']['numero_ingreso_bodega'] : null
            this.fk_ingreso_bodega = (res['ingreso_bodega'] != null) ? res['ingreso_bodega']['id'] : null
            this.ano_vida_util = res['ano_vida_util']
            this.codigo_auxiliar = res['codigo_auxiliar']
            this.codigoBienesDescripcion = (res['bienes'] != null) ? res['bienes']['codigo_bienes'] + "-" + res['bienes']['descripcion'] : 'Revisar relacion.'
            // !res['bienes'] ? this.codigoBienesDescripcion = undefined : this.codigoBienesDescripcion = res['bienes']['codigo_bienes'] + "-" + res['bienes']['descripcion']
            this.disabledCustodio = false;
            this.disabledResponsable = false;

            
          }

          if (res['estado_ficha_prod'] == "C" ) {
            this.vmButtons[2].habilitar = true
            // this.vmButtons[3].habilitar = true
            this.vmButtons[6].habilitar = true
            this.vmButtons[4].habilitar = false
          }else if(res['estado_ficha_prod']!= "C"  && res['grupo']['tipo_bien'] == "EXI" || res['grupo']['tipo_bien'] == "EX" || res['grupo']['tipo_bien'] == ""){
            this.vmButtons[4].habilitar = false
            this.vmButtons[6].habilitar = true
          }
           else {
            this.vmButtons[0].habilitar = true
            this.vmButtons[1].habilitar = true
            this.vmButtons[2].habilitar = true
            // this.vmButtons[3].habilitar = false
            this.vmButtons[4].habilitar = false
            this.vmButtons[6].habilitar = false
          }

          this.presentacion_a = res['presentacion_primaria']
          this.presentacion_b = res['presentacion_secundaria']
          this.selectedEstadoBien = res['estado_bien']
          this.disabledClaseServicio = false;
          this.disabledProduct = true;
          this.searchData = "";
          this.editCode = false;
          this.formulaData = undefined;
          this.dataContabilidad = undefined;
        }

        if (res['tiene_custodio'] == 'S') {
          if (res['departamento_custodio'] != null) {
            this.depCustodio = res['departamento_custodio']['dep_nombre'];
          } else {
            this.depCustodio = 'No tiene departamento custodio';
          }
          if (res['custodio'] != null) {
            this.nombreCustodio = res['custodio']['emp_full_nombre'];
          } else {
            this.nombreCustodio = 'No tiene custodio';
          }
        } else {
          this.depCustodio = 'No tiene departamento custodio';
          this.nombreCustodio = 'No tiene custodio';
        }

        if (res['tiene_responsable'] == 'S') {
          if (res['departamento_responsable'] != null) {
            this.depResponsable = res['departamento_responsable']['dep_nombre'];
          } else {
            this.depResponsable = 'No tiene departamento responsable';
          }
          if (res['responsable'] != null) {
            this.nombreResponsable = res['responsable']['emp_full_nombre'];
          } else {
            this.nombreResponsable = 'No tiene responsable';
          }
        } else {
          this.depResponsable = 'No tiene departamento responsable';
          this.nombreResponsable = 'No tiene responsable';
        }
        console.log(res.fotos)
        if (res.fotos != null) {
          if (res.fotos.length > 0) {
            res.fotos.map(element => {
              Object.assign(element, {
                fk_producto: element.fk_producto,
                id_producto_fotos: element.id_producto_fotos,
                id_usuario: element.id_usuario,
                num_foto: element.num_foto,
                recurso: element.recurso
              })
              this.fotos = res.fotos
              //this.fotos.push(arrayFotos)
            });
          } /* else {
            console.log("aqui")
            this.fotos.push(res.fotos)
          } */
        }
        // this.cargarHistorialTraslado()
        // this.cargarMantenimiento()
        // this.cargarPoliza()
        this.cargarProductoAdicional()


      }
    )

    this.ingresoService.setReclamo$.subscribe(
      (reclamo: IReclamo) => {
        this.produto.reclamos.push(reclamo);
      }
    )

    this.vmButtons = [
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fas fa-edit", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true },
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true },
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-trash-o", texto: "ELIMINAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-secondary boton btn-sm", habilitar: true },
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fas fa-edit", texto: "COMPLETAR INGRESO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      // Modal de Marca, Modelo, Color
      { orig: "btnIProductoModal", paramAccion: "2", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnIProductoModal", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      // Modal Codigo de Barra
      { orig: "btnIQrModal", paramAccion: "3", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      // Modal Tarifas Arancelarias
      { orig: "btnarancelModal", paramAccion: "4", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },

    ];
    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };
  }

  ngOnInit(): void {
    setTimeout(async () => {
      // this.lcargando.ctlSpinner(true);
      this.grupoProducto()
      this.catalogo()
      this.getDepartamentos()
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
      this.mes_actual = Number(moment(new Date()).format('MM'));
      let id_rol = this.dataUser.id_rol;
      let data = {
        id: 2,
        codigo: myVarGlobals.fIngresoProducto,
        id_rol: id_rol
      }
      this.commonServices.getPermisionsGlobas(data).subscribe(res => {
        this.permisions = res['data'];
        if (this.permisions[0].ver == "0") {
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Ingreso de productos");
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          this.id_group_receibed = localStorage.getItem("id_grupo");
          this.getGrupos();
          this.getCurrencys();
          this.getAranceles();
          this.values.porcentaje = "";
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);

      })

      await this.cargaInicial()
    }, 150);
  }

  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; } 
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.paramAccion) {
      case "NUEVO1":
        this.newProduct();
        break;
      case "BUSCAR1":
        this.expandProductos();
        break;
      case "GUARDAR1":
        this.validaSaveProduct();
        break;
      case "MODIFICAR1":
        // this.updateProduct();
        this.validaUpdateproducto();
        break;
      case "CANCELAR1":
        this.borrar();
        break;
      case "ELIMINAR1":
        this.validateDeleteProduct();
        break;
      case "CERRAR2":
        this.cancelcatalogo();
        break;
      case "GUARDAR2":
        this.vaidateSaveCatalogo();
        break;
      case "CERRAR3":
        ($('#exampleModalQr') as any).modal('hide');
        break;
      case "CERRAR4":
        this.closeModal();
        break;

      case "COMPLETAR INGRESO1":
        console.log('holis')
        this.saveAllProducts();
        break;
    }
  }

async cargaInicial() {
  this.lcargando.ctlSpinner(true)
  try {
    let responseArr: Array<any>;
    this.mensajeSppiner = 'Cargando Conceptos'
    responseArr = await this.ingresoService.getConceptos();
    // console.log(responseArr)
    this.conceptos = responseArr;

    this.mensajeSppiner = 'Cargando Presentaciones'
    let response: any = await this.ingresoService.getCatalogo({ params: "'PRESENTACION','INV_METODO_DEPRECIACION'"})
    console.log(response);
    this.cmb_presentacion_a = response.PRESENTACION;
    this.cmb_presentacion_b = response.PRESENTACION;
    this.cmb_metodo_depreciacion = response.INV_METODO_DEPRECIACION;

    this.lcargando.ctlSpinner(false)
  } catch (err) {
    console.log(err)
    this.lcargando.ctlSpinner(false)
    this.toastr.error(err.error.message, 'Error cargando Conceptos')
  }
}

  setTasaDescuento() {
    if (!this.descuentoData) { this.tasaData = 0; }
  }

  generaActionRawMaterial() {


    this.lcargando.ctlSpinner(true);
    this.values = { fk_arancel: 1, code: 1, porcentaje: 0, nombre: "No aplica", fk_unidad_masa: 0, masa: 0.00, fk_unidad_longitud: 0, longitud_1: 0.00, longitud_2: 0.00, longitud_3: 0.00 }

    console.log(this.claseSelect.tipo_bien)
    if (this.claseSelect.tipo_bien == "BLD" || this.claseSelect.tipo_bien == "BCA") {
      let codigo = this.codigoBienes
      let inicial = 1
      this.ingresoService.countProductosBienes({ parametro: this.codigoBienes }).subscribe(
        (res) => {
          console.log(res);
          if (res['data'] >= 10) {
            codigo = codigo + "-" + (parseInt(res['data']) + 1)
          } else if (res['data'].length == 0) {
            codigo = codigo + "-" + "0" + inicial
            this.secuencial = 1;
            console.log(this.secuencial)
            console.log(codigo)
          } else {
            codigo = codigo + "-" + "0" + (parseInt(res['data']) + 1)

            this.secuencial = (res['data'] + 1)
          }
          // this.grupo_producto = ['codigo_subgrupo_producto']
          this.lcargando.ctlSpinner(false);
          this.codigoData = codigo;
          console.log(this.codigoData)
          // console.log(codigo);

        }
      )
    }

    else {
      this.codigoData = 0
      //let inicial = 1

      // this.ingresoService.countProductos({parametro:  this.subgrupo.codigo_subgrupo_producto}).subscribe(
      //   (res)=>{
      //     console.log(res);
      //     if(res['data'] >= 10){
      //       codigo = codigo + "-" + (parseInt(res['data']) + 1)
      //     }else if(res['data'].length == 0){
      //       codigo = codigo + "-" + "0" + inicial
      //       this.secuencial = 1;
      //       console.log(this.secuencial)
      //       console.log(codigo)
      //     }else{
      //       codigo = codigo + "-" + "0"+ (parseInt(res['data']) + 1)

      //       this.secuencial = (res['data'] + 1)
      //     }
      //     // this.grupo_producto = ['codigo_subgrupo_producto']
          this.lcargando.ctlSpinner(false);
      //     this.codigoData = codigo;
      //     console.log(this.codigoData)
      //     // console.log(codigo);

      //   }
      // )

    }

  }

  generarCodigoEx() {
    this.lcargando.ctlSpinner(true)
    this.mensajeSppiner = 'Generando codigo de Producto...'
    if (this.claseSelect.tipo_bien == "EXI") {


      let codigo = this.claseSelect.codigo_grupo_producto
      let inicial = 1

      this.ingresoService.countProductos({ parametro: this.claseSelect.codigo_grupo_producto }).subscribe(
        (res: any) => {
          console.log(res);
          if (Array.isArray(res.data) && !res.data.length) {
            codigo += '-01'
            this.secuencial = 1
          } else {
            let secuencialResponse = parseInt(res.data)
            codigo += '-' + `${secuencialResponse + 1}`.padStart(2, '0')
            this.secuencial = secuencialResponse + 1
          }

          /* if (res['data'] >= 10) {
            codigo = codigo + "-" + (parseInt(res['data']) + 1)
          } else if (res['data'].length == 0) {
            codigo = codigo + "-" + "0" + inicial
            this.secuencial = 1;
            console.log(this.secuencial)
            console.log(codigo)
          } else {
            codigo = codigo + "-" + "0" + (parseInt(res['data']) + 1)

            this.secuencial = (res['data'] + 1)
          } */
          // this.grupo_producto = ['codigo_subgrupo_producto']
          this.codigoData = codigo;
          this.lcargando.ctlSpinner(false);
          console.log(this.codigoData)
          // console.log(codigo);

        },
        (err: any) => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error generando Codigo de Producto')
        }
      )
    }
    else {
      this.codigoData = '0'
      this.lcargando.ctlSpinner(false);
    }

  }

  getGrupos() {
    this.ingresoService.getGrupos().subscribe(res => {
      console.log(res)
      this.lcargando.ctlSpinner(false);
      this.dataGrupo = res['data'];
      this.getCatalogos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getCatalogos
    () {
    let data = {
      params: "'MODELOS','MARCAS','COLORES','UNIDAD DE MEDIDA','PAIS','UDM_LONGITUD','UDM_MASA'"
    }
    this.ingresoService.getCatalogos(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.dataMarcas = res['data']['MARCAS'];
      this.dataModelos = res['data']['MODELOS'];
      this.dataColores = res['data']['COLORES'];
      this.dataPaises = res['data']['PAIS'];
      this.dataUDM = res['data']['UNIDAD DE MEDIDA'];
      this.getUDM();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)

    })
  }

  selectedModels(event) {
    this.dataModelos = undefined;
    this.ingresoService.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.dataModelos = res['data'];
      this.disableMarca = false;
      this.modeloSelect = 0;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getUDM() {
    this.ingresoService.getUDM().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.dataUMC = res['data'];
      this.dataUMV = res['data'];
      if (this.id_group_receibed != undefined) {
        this.grupoSelect = this.id_group_receibed;
        this.newProduct();
        localStorage.removeItem("id_grupo")
        setTimeout(() => {
          document.getElementById("idTipo").focus();
        }, 1000);
      }
      this.getUDMByMagnitude();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getUDMByMagnitude() {
    let data = { in: ["Masa", "Longitud"] };
    this.ingresoService.getUDMMagnitudeConversion(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.masa = res["data"]["udms"]["Masa"]
      this.long = res["data"]["udms"]["Longitud"]

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)

    })
  }

  getAranceles() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    }
    this.ingresoService.getAvailableAranceles().subscribe(res => {
      this.aranceles = res["data"]
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      setTimeout(() => {
        this.dtTrigger.next();
      }, 50);
    }, error => {
      this.processing = true;
      this.aranceles = [];
      this.lcargando.ctlSpinner(false);

      setTimeout(() => {
        this.dtTrigger.next();
      }, 50);
      this.toastr.info(error.error.message)
    })
  }

  presentarCodBarra() {
    $('#exampleModalQr').appendTo('body').modal('show');
  }

  presentarAranceles() {
    $('#ArancelesModal').appendTo('body').modal('show');
  }

  setCatalogoTitle(titulo: string, tipo: string, label: string) {
    $('#exampleModal').appendTo("body").modal('show');
    this.newCatalogo = titulo;
    this.tipoCatalogo = tipo;
    this.valueLabel = label;
  }

  async vaidateSaveCatalogo() {
    if (this.permisions[0].guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
      return;
    } /* else { */
      this.flag = true;
      if (this.valorCatalogo == null) {
        document.getElementById("IdValorCatalogo").focus();
        this.toastr.info("Ingrese un valor");
        this.flag = false;
        return;
      } else if (this.tipoCatalogo == "MODELOS" && (this.marcaSelectNew == "" || this.marcaSelectNew == null)) {
        this.toastr.info("Seleccione una Marca");
        this.flag = false;
        return;
      } else {
        try {
          await this.ingresoService.getValidaNameGlobalAsync({ valor: this.valorCatalogo, type: this.tipoCatalogo })
          //
          this.confirmSave('Seguro desea crear el registro?', 'ADD_CATALOGO');
        } catch (err) {
          console.log(err)
          document.getElementById("IdValorCatalogo").focus();
          this.toastr.warning("Valor ya esta registrado", 'Validacion de Datos');
        }
      }
    /* } */

  }

  crearCatalogo() {
    this.lcargando.ctlSpinner(true);
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de ${this.valorCatalogo} como nuevo catálogo`,
      id_controlador: myVarGlobals.fIngresoProducto,
      tipo: this.tipoCatalogo,
      group: (this.marcaSelectNew != undefined) ? this.marcaSelectNew : null,
      descripcion: this.description,
      valor: this.valorCatalogo,
      estado: "A",
      id_empresa: this.commonServices.getDataUserLogued().id_empresa
    }

    this.ingresoService.saveRowCatalogo(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.disableMarca = true;
      this.description = null;
      this.valorCatalogo = null;
      this.marcaSelectNew = null;
      this.colorSelect = 0;
      this.modeloSelect = 0;
      this.marcaSelect = 0;
      this.dataMarcas = undefined;
      this.dataModelos = undefined;
      this.dataColores = undefined;
      this.flag = false;
      this.getCatalogos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  cancelcatalogo() {
    this.description = null;
    this.valorCatalogo = null;
    ($('#exampleModal') as any).modal('hide');
  }


  rand_code(chars, lon) {
    if (!this.checkCodigo) {
      this.editSelectCode = true;
      let code = "";
      let x = 0;
      for (x = 0; x < lon; x++) {
        let rand = Math.floor(Math.random() * chars.length);
        code += chars.substr(rand, 1);
      }
      this.randomGenerate = code;

      let data = {
        secuencial: this.randomGenerate/* "198456689" */
      }
      this.ingresoService.validateSecuencial(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.codigoData = this.claseSelect.substring(0, 3) + "-" + code;
        this.codigoData = this.codigoData.toUpperCase();
        this.dbQr = (this.claseSelect == "Productos") ? true : false;
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.codigoData = "";
        this.checkCodigo = false;
        this.dbQr = (this.claseSelect == "Productos") ? false : true;
        this.toastr.info(error.error.message);
      })
    } else {
      this.dbQr = (this.claseSelect == "Productos" && (this.codigoData == "")) ? true : false;
      this.editSelectCode = false;
      this.codigoData = "";
    }
  }

  generateCode() {
    this.checkCodigo = !this.checkCodigo;
    this.codigoData = "";

    /* let filt = this.dataGrupo.filter(d => d.id_grupo == e)
    filt = filt[0]['clase'].substring(0, 1) */
  }

  newProduct() {
    /* this.btnBuscar = true; */
    this.disabledClaseServicio = false;
    /*  this.btnBorrar = false;
        this.btnGuardar = false;
        this.btncancelar = false;
        this.btnModificar = true;
        this.btnDelete = true; */
    this.disabledProduct = true;
    this.searchData = "";
    this.editCode = false;
    this.formulaData = undefined;
    this.dataContabilidad = undefined;
    this.catalogoDisabled = false;

    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[4].habilitar = false;
    this.vmButtons[6].habilitar = true;

    if (this.searchDataUpdateDelete != undefined) { this.borrar() }
    let data = {
      nuevo: this.disabledProduct
    }
    this.commonServices.disabledComponent.next(data);
  }

  validaUpdateproducto() {
    if (this.permisions[0].editar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar");
    } else {
      /* if(this.searchDataUpdateDelete.fk_formula != null) {this.commonServices.updateData.next()}; */
      // let val1 = (this.searchDataUpdateDelete.fk_formula != null) ? true : false;
      // this.commonServices.updateData.next(val1);
      this.validaGlobalData()
        .then(() => this.confirmSave('Seguro desea actualizar el producto', 'UPDATE_PRODUCT'))
        .catch((err: string) => this.toastr.warning(err, 'Validacion de Datos', {enableHtml: true}))
    }
  }

  validaSaveProduct() {
    this.validaGlobalData()
      .then(() => this.confirmSave('Seguro desea guardar este producto?', 'SAVE_PRODUCT'))
      .catch(
        (err: string) => this.toastr.warning(err, 'Validacion de Datos', {enableHtml: true})
      )
    // this.saveProduct()
  }

  validaGlobalData() {
    let message = '';
    console.log(this.TipoCompraSelect);
    let flag = true;
    return new Promise((resolve, reject) => {
      if (this.claseSelect == 0 || this.claseSelect == undefined) {
        message += '* No ha seleccionado el Grupo del Producto.<br>'
        // this.toastr.info('Seleccione el campo Grupo Producto')
        // flag = false;
      }
      //  else if (this.origenData == 0 || this.origenData == undefined) {
      //   this.toastr.info('Seleccione el campo Origen')
      //   flag = false;

      // } 
      if (this.nameData == null || this.nameData.trim() == '') {
        message += '* El campo Nombre Producto no debe estar vacio.<br>'
        // this.toastr.info('El campo Nombre Producto no debe estar vacio')
        // flag = false;
      } 

      if (this.udmcSelect == undefined || this.udmcSelect == null) {
        message += '* No ha seleccionado una Unidad de Medida.<br>'
      }
       
      // else if (this.presentacionData == undefined) {
      //   this.toastr.info('El campo Presentacion no debe estar vacio')
      //   flag = false;
      // }
      //  else if (this.marcaSelect == undefined || this.marcaSelect == 0) {
      //   this.toastr.info('Seleccione el campo Marca')
      //   flag = false;

      // }
      // else if (this.grupoSelect == undefined || this.grupoSelect == 0) {
      //   this.toastr.info('Seleccione el campo Grupo')
      //   flag = false;

      // } 
      // else if (this.udmcSelect == undefined || this.udmcSelect == 0) {
      //   this.toastr.info('Seleccione el campo - Compra')
      //   flag = false;
      // } else if (this.colorSelect == undefined || this.colorSelect == 0) {
      //   this.toastr.info('Seleccione el campo Color')
      //   flag = false;
      // } 
      // else if (this.TipoCompraSelect == undefined || this.TipoCompraSelect == 0) {
      //   this.toastr.info('Seleccione el campo Tipo Compra');
      //   flag = false;
      // } else if (this.minimoData == undefined) {
      //   this.toastr.info('Seleccione el campo Stock Minimo');
      //   flag = false;
      // } else if (this.maximoData == undefined) {
      //   this.toastr.info('Seleccione el campo Stock Máximo');
      //   flag = false;
      // } else if (this.sugeridoData == undefined) {
      //   this.toastr.info('Seleccione el campo Stock Surgerido');
      //   flag = false;
      // }

      /* if (this.tipo_bien_visibilidad == 'EXI' && (this.presentacion_a == null || this.presentacion_b == null)) {
        message += '* No ha seleccionado Presentacion';
        // this.toastr.warning('No ha seleccionado Presentacion')
        // flag = false;
      } */

      return (!message.length) ? resolve(true) : reject(message) 


    });
  }

  validaDataContabilidad() {
    this.commonServices.selectContabilidad.next(true);
  }

  validaDataFormula() {
    this.commonServices.selectFormula.next();
  }

  async confirmSave(message, action) {
    const result = await Swal.fire({
      title: "Atención!!",
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    })

    if (result.isConfirmed) {
      if (action == "ADD_CATALOGO") {
        ($('#exampleModal') as any).modal('hide'); /* linea para cerrar el modal de boostrap */
        this.crearCatalogo();
      } else if (action == "SAVE_PRODUCT") {
        this.saveProduct();
      } else if (action == "DELETE_PRODUCT") {
        this.deleteProduct();
      } else if (action == "UPDATE_PRODUCT") {
        this.updateProduct();
      }
    }


    /* Swal.fire({
      title: "Atención!!",
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "ADD_CATALOGO") {
          ($('#exampleModal') as any).modal('hide');
          this.crearCatalogo();
        } else if (action == "SAVE_PRODUCT") {
          this.saveProduct();
        } else if (action == "DELETE_PRODUCT") {
          this.deleteProduct();
        } else if (action == "UPDATE_PRODUCT") {
          this.updateProduct();
        }
      }
    }) */
  }

  async updateProduct() {
    console.log('Oka');
    this.lcargando.ctlSpinner(true);
    let datagroup = this.dataGrupo.filter(d => d.id_grupo == this.grupoSelect)
    // let codigo = null;
    // let nivel = null;
    // let codigo_padre = null;
    // if (datagroup[0]['id_grupo'] != this.searchDataUpdateDelete['fk_grupo']) {
    //   let c = await this.generateCidgoFatherChildren().then(res => {
    //     codigo = res;
    //     nivel = (parseInt(datagroup[0]['nivel']) + 1).toString();
    //     codigo_padre = datagroup[0]['codigo'];
    //   })
    // }
    console.log(this.grupoSelect);

    let data = {
      id_grupo: this.claseSelect.id_grupo_productos,
      id_producto: this.id_producto,
      tipo: (this.materiaPrima) ? "Materia Prima" : "Producto",
      clase: this.claseSelect.descripcion,
      en_venta: (this.enVentaData) ? 1 : 0,
      codigo_producto: this.codigoData,
      codigo_barra: this.codigoData,
      numero_parte: this.NumParteData,
      nombre: this.nameData,
      generico: this.genericoData,
      tipo_compra: this.TipoCompraSelect,
      id_formula: null,
      marca: this.marcaSelect,
      modelo: this.modeloSelect,
      color: this.colorSelect,
      udmc: this.udmcSelect,
      umdv: this.udmvSelect,
      presentacion: this.presentacionData,
      presentacion_primaria: this.presentacion_a,
      presentacion_secundaria: this.presentacion_b,
      estado_bien: this.selectedEstadoBien,
      procedencia: this.origenData,
      stock: 0,
      en_producccion: 0,
      en_tra_local: 0,
      en_importacion: 0,
      min_stock: this.minimoData,
      max_stock: this.maximoData,
      suge_stock: this.sugeridoData,
      bajo_stock: true,
      costo: parseFloat(this.costoData),
      costo_anterior: 0,
      metodo_costo: this.metCostoSelect,
      descuento: (this.descuentoData) ? 1 : 0,
      codigoBienes: this.codigoBienes,
      grupo_producto: this.grupo_producto,
      secuencial: this.secuencial,
      perecible: this.perecible,
      fecha_caducidad: this.fecha_caducidad,
      peligrosidad: this.peligrosidad,
      observacion_peligrosidad: this.observacion_peligrosidad,
      fecha_garantia: this.fecha_garantia,
      ano_vida_util: this.ano_vida_util,
      serie: this.serie,
      tipo_material: this.tipo_material,
      observacion_requerimiento: this.observacion_requerimiento,
      departamento: this.ingresoDepartamento,
      placa: this.placa,
      numero_chasis: this.numero_chasis,
      motor: this.motor,
      nro_vehiculo: this.nro_vehiculo,
      vehiculo: this.vehiculo,
      estado_ficha_prod:this.estado_ficha_prod,
      metodo_depreciacion: this.selectedMetodoDepreciacion,

      /*  tasa_descuento: this.tasaData, */
      tasa_descuento: 0,
      // cuenta_costo: this.dataContabilidad.costos,
      // cuenta_venta: this.dataContabilidad.ventas,
      // cuenta_devolu: this.dataContabilidad.devoluciones,
      // cuenta_descuento: this.dataContabilidad.descuentos,
      // cuenta_perdida: this.dataContabilidad.perdidas,
      // deducible_ir: (this.dataContabilidad.impuestoRent) ? 1 : 0,
      // iva: (this.dataContabilidad.iva) ? 1 : 0,
      // iva_compra: this.dataContabilidad.iva_compra,
      // iva_venta: this.dataContabilidad.iva_venta,
      // cuenta_inventario: this.dataContabilidad.inventario,
      // pvp: 0,
      // precio_1: 0,
      // precio_2: 0,
      // precio_3: 0,
      // precio_4: 0,
      // precio_5: 0,
      // estado: "A",
      // nivel: (parseInt(datagroup[0]['nivel']) + 1).toString(),
      // codigo: codigo,
      // codigo_padre: datagroup[0]['codigo'],
      ip: this.commonServices.getIpAddress(),
      accion: `Creación del nuevo producto ${this.nameData} `,
      id_controlador: myVarGlobals.fIngresoProducto,
      observation: this.observation,
      reserva: 0,
      magnitude: this.values,
      fotos: this.fotos.filter(e => e.id_producto_fotos === 0),
    }

    // if (this.dataContabilidad != undefined) {
    //   data['cuenta_costo'] = this.dataContabilidad.costos;
    //   data['cuenta_venta'] = this.dataContabilidad.ventas;
    //   data['cuenta_devolu'] = this.dataContabilidad.devoluciones;
    //   data['cuenta_descuento'] = this.dataContabilidad.descuentos;
    //   data['cuenta_perdida'] = this.dataContabilidad.perdidas;
    //   data['deducible_ir'] = (this.dataContabilidad.impuestoRent) ? 1 : 0;
    //   data['iva'] = (this.dataContabilidad.iva) ? 1 : 0;
    //   data['iva_compra'] = this.dataContabilidad.iva_compra;
    //   data['iva_venta'] = this.dataContabilidad.iva_venta
    //   data['cuenta_inventario'] = this.dataContabilidad.inventario;
    // } else {
    //   data['cuenta_costo'] = this.searchDataUpdateDelete.cuentaCostos;
    //   data['cuenta_venta'] = this.searchDataUpdateDelete.cuentaVentas;
    //   data['cuenta_devolu'] = this.searchDataUpdateDelete.cuentaDevoluciones;
    //   data['cuenta_descuento'] = this.searchDataUpdateDelete.cuentaDescuentos;
    //   data['cuenta_perdida'] = this.searchDataUpdateDelete.cuentaPerdida;
    //   data['deducible_ir'] = (this.searchDataUpdateDelete.deducibleIR) ? 1 : 0;
    //   data['iva'] = (this.searchDataUpdateDelete.Iva) ? 1 : 0;
    //   data['iva_compra'] = this.searchDataUpdateDelete.IvaCompra;
    //   data['iva_venta'] = this.searchDataUpdateDelete.IvaVenta
    //   data['cuenta_inventario'] = this.searchDataUpdateDelete.cuentaInvCosto;
    // }

    // if (this.checkAuth) {
    //   data['detail_formula'] = this.formulaData.details;
    //   data['complements_formula'] = this.formulaData.complements;
    //   data['header_formula'] = this.formulaData.header;
    //   data['comdel'] = this.formulaData.comdel;
    //   data['detdel'] = this.formulaData.detdel;
    // }
    // data['anxDel'] = this.formulaData.anxDel;
    console.log(data);
    this.disabledClaseServicio = true;
    this.disabledProduct = false;
    this.searchData = "";
    this.editCode = true;
    this.ingresoService.updateProduct(data).subscribe(res => {
      console.log(res);
      this.toastr.success(res['message']);
      this.vmButtons[6].habilitar = false;
      // let params = { module: this.permisions[0].id_modulo, component: myVarGlobals.fIngresoProducto, identifier: this.searchDataUpdateDelete.id_producto }
      // this.commonServices.setAnexos.next(params);
      // this.borrar();
      setTimeout(() => {
        this.getGrupos();
        this.getCurrencys();
      }, 300);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })

  }

  async saveProduct() {
    this.mensajeSppiner = 'Almacenando Producto'
    this.lcargando.ctlSpinner(true);
    let codigo;
    // let c = await this.generateCidgoFatherChildren().then(res => {
    //   codigo = res;
    // })
    let datagroup = this.dataGrupo.filter(d => d.id_grupo == this.grupoSelect)
    let data = {
      id_subgrupo: 1,
      id_grupo: this.claseSelect.id_grupo_productos,
      tipo: (this.materiaPrima) ? "Materia Prima" : "Producto",
      clase: this.claseSelect.descripcion,
      en_venta: (this.enVentaData) ? 1 : 0,
      codigo_producto: this.codigoData,
      codigo_barra: this.codigoData,
      numero_parte: this.NumParteData,
      nombre: this.nameData,
      generico: this.genericoData,
      tipo_compra: this.TipoCompraSelect,
      id_formula: null,
      marca: this.marcaSelect,
      modelo: this.modeloSelect,
      color: this.colorSelect,
      udmc: this.udmcSelect,
      umdv: this.udmvSelect,
      presentacion: this.presentacionData,
      presentacion_primaria: this.presentacion_a,
      presentacion_secundaria: this.presentacion_b,
      estado_bien: this.selectedEstadoBien,
      procedencia: this.origenData,
      stock: 0,
      en_producccion: 0,
      en_tra_local: 0,
      en_importacion: 0,
      min_stock: this.minimoData,
      max_stock: this.maximoData,
      suge_stock: this.sugeridoData,
      bajo_stock: true,
      costo: parseFloat(this.costoData),
      costo_anterior: 0,
      metodo_costo: this.metCostoSelect,
      descuento: (this.descuentoData) ? 1 : 0,
      codigoBienes: this.codigoBienes,
      grupo_producto: this.grupo_producto,
      secuencial: this.secuencial,
      perecible: this.perecible,
      fecha_caducidad: this.fecha_caducidad,
      peligrosidad: this.peligrosidad,
      observacion_peligrosidad: this.observacion_peligrosidad,
      fecha_garantia: this.fecha_garantia,
      ano_vida_util: this.ano_vida_util,
      serie: this.serie,
      tipo_material: this.tipo_material,
      observacion_requerimiento: this.observacion_requerimiento,
      departamento: this.ingresoDepartamento,
      placa: this.placa,
      numero_chasis: this.numero_chasis,
      motor: this.motor,
      nro_vehiculo: this.nro_vehiculo,
      vehiculo: this.vehiculo,
      metodo_depreciacion: this.selectedMetodoDepreciacion,

      /*  tasa_descuento: this.tasaData, */
      tasa_descuento: 0,
      // cuenta_costo: this.dataContabilidad.costos,
      // cuenta_venta: this.dataContabilidad.ventas,
      // cuenta_devolu: this.dataContabilidad.devoluciones,
      // cuenta_descuento: this.dataContabilidad.descuentos,
      // cuenta_perdida: this.dataContabilidad.perdidas,
      // deducible_ir: (this.dataContabilidad.impuestoRent) ? 1 : 0,
      // iva: (this.dataContabilidad.iva) ? 1 : 0,
      // iva_compra: this.dataContabilidad.iva_compra,
      // iva_venta: this.dataContabilidad.iva_venta,
      // cuenta_inventario: this.dataContabilidad.inventario,
      // pvp: 0,
      // precio_1: 0,
      // precio_2: 0,
      // precio_3: 0,
      // precio_4: 0,
      // precio_5: 0,
      // estado: "A",
      // nivel: (parseInt(datagroup[0]['nivel']) + 1).toString(),
      codigo: codigo,
      // codigo_padre: datagroup[0]['codigo'],
      ip: this.commonServices.getIpAddress(),
      accion: `Creación del nuevo producto ${this.nameData} con código ${codigo}`,
      id_controlador: myVarGlobals.fIngresoProducto,
      observation: this.observation,
      reserva: 0,
      magnitude: this.values,
      fotos: this.fotos.filter(e => e.id_producto_fotos === 0),
    }
    // if (this.checkAuth) {
    //   data['detail_formula'] = this.formulaData.details;
    //   data['complements_formula'] = this.formulaData.complements;
    //   data['header_formula'] = this.formulaData.header;
    // }
    console.log(data)
    this.ingresoService.saveProducto(data).subscribe(res => {
      console.log(res);
      this.toastr.success(res['message']);
      let params = { module: this.permisions[0].id_modulo, component: myVarGlobals.fIngresoProducto, identifier: res['data']['id'] }
      this.commonServices.setAnexos.next(params);
      if(this.claseSelect.tipo_bien != "EXI"){
        this.vmButtons[6].habilitar = false;
      }
   
      // this.borrar();
      setTimeout(() => {
        /*   location.reload(); */
        this.id_group_receibed = localStorage.getItem("id_grupo");
        this.getGrupos();
        this.getCurrencys();
      }, 300);
    }, error => {
      console.log(error)
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message, 'Error almacenando Producto');
    })
  }

  generateCidgoFatherChildren() {
    return new Promise((resolve, reject) => {
      let filt = this.dataGrupo.filter(d => d.id_grupo == 1)
      let data = {
        code_father: filt[0]['codigo']
      }
      this.ingresoService.getMaxCodeChildren(data).subscribe(res => {
        let codigo = res['data'].codigo;
        let subcadena = codigo.split(".", -1);
        let subcadenaFinal = subcadena[subcadena.length - 1];
        let cadenaSumada = parseInt(subcadenaFinal) + 1;
        this.newCodeSend = filt[0]['codigo'] + "." + cadenaSumada.toString();
        resolve(this.newCodeSend);
      }, error => {
        this.newCodeSend = filt[0]['codigo'] + "." + "1";
        resolve(this.newCodeSend);
      })
    });
  }

  searchModoalsProduct() {
    const modalInvoice = this.modalService.open(GlobalTableComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content' });
    modalInvoice.componentInstance.title = "PRODUCTO";
    modalInvoice.componentInstance.module = this.permisions[0].id_modulo;
    modalInvoice.componentInstance.component = myVarGlobals.fIngresoProducto;
  }

  borrar() {
    this.produto = undefined;
    this.lotes = [];
    this.presentacion_a = null;
    this.presentacion_b = null;

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.vmButtons[5].habilitar = true;
    this.vmButtons[6].habilitar = true;

    this.fotos = [];
    this.fotosEliminar = [];

    this.tipo_bien_visibilidad = 'ALL';
    this.observation = "";
    this.dbQr = false;
    this.disabledMateriaPrima = false;
    this.dAction = false;
    this.grupoSelect = 0;
    this.materiaPrima = false;
    this.TipoCompraSelect = 0;
    this.metCostoSelect = 0;
    this.claseSelect = 0;
    this.origenData = 0;
    this.presentacionData = "";
    this.ingresoDepartamento = "";
    this.vehiculo = "";
    this.placa = "";
    this.numero_chasis = "";
    this.motor = "";
    this.nro_vehiculo = 0;
    this.nroIngresoBodega = "";
    /*     this.tasaData = ""; */
    this.CBData = "";
    this.sugeridoData = "";
    this.codigoData = "";
    this.minimoData = "";
    this.maximoData = "";
    this.nameData = "";
    this.costoData = 0;
    this.genericoData = "";
    this.NumParteData = "";
    this.marcaSelect = 0;
    this.modeloSelect = 0;
    this.colorSelect = 0;
    this.udmcSelect = 0;
    this.udmvSelect = 0;
    this.formulaSelect = undefined;
    this.id_producto = undefined;
    this.codigoBienesDescripcion = undefined;
    this.stock = undefined;
    this.id_subgrupo = 0;
    this.subgrupo.descripcion = "";
    this.peligrosidad = "";
    this.perecible = "";
    this.fecha_caducidad = moment(new Date()).format('YYYY-MM-DD');
    this.observacion_peligrosidad = "";
    this.fecha_garantia = moment(new Date()).format('YYYY-MM-DD');
    this.observacion_peligrosidad = "";
    this.tipo_material = "";
    this.ano_vida_util = 0;
    this.serie = "";
    this.observacion_requerimiento = "";
    this.estado_ficha_prod = "";
    /*   this.enVentaData = false; */
    this.enVentaData = true;
    /*     this.descuentoData = false; */
    this.checkCodigo = false;
    this.checkAuth = false;
    this.randomGenerate = "";
    this.stockActualData = false;
    this.traslado = [];
    this.mantenimiento = [];
    this.poliza = []
    if (this.searchDataUpdateDelete != undefined) { this.searchDataUpdateDelete = undefined }
    this.codigoBienes = undefined;
    this.grupo_producto = undefined;
    this.secuencial = undefined;
    this.grupo_description = ""
    this.values = {
      fk_arancel: 0, code: "", porcentaje: 0, nombre: "", fk_unidad_masa: 0, masa: 0.00, fk_unidad_longitud: 0, longitud_1: 0.00, longitud_2: 0.00, longitud_3: 0.00
    }

    let data = {
      borrar: true
    }
    this.commonServices.disabledComponent.next(data);
    this.disabledProduct = false;
    this.disabledCustodio = true;
    this.disabledResponsable = true;
    this.catalogoDisabled = false;
    // this.rerender();
   
  }

  tabSelection() {
    this.checkAuth = !this.checkAuth;
    if (this.checkAuth) {
      /* this.disabledMateriaPrima = true; */
      this.dAction = true;
      this.disabledForCheck = true;
      this.disabledFormula = false;
      this.metCostoSelect = "Directo";
      this.costoData = 0;
    } else {
      this.materiaPrima = false;
      /* this.disabledMateriaPrima = false; */
      this.dAction = false;
      this.disabledForCheck = false;
      this.costoData = 0;
    }
    this.commonServices.setClassPills.next(this.checkAuth);
  }

  searchProduct() {
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para consultar");
      return;
    }

    if (this.searchData == undefined || this.searchData == "") {
      document.getElementById("IdValorCatalogo").focus();
      this.toastr.info("Ingrese un número de parte");
      return;
    }

    this.lcargando.ctlSpinner(true);
    this.borrar();
    let data = {
      num_parte: this.searchData,
      module: this.permisions[0].id_modulo,
      component: myVarGlobals.fIngresoProducto
    }

    this.ingresoService.searchProduct(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.searchDataUpdateDelete = res['data'];
      /* this.disabledClaseServicio = true; */
      if (this.searchDataUpdateDelete.clase == "Servicios") {
        this.dbQr = false;
        this.disabledClaseServicio = true;
        this.disabledMateriaPrima = true;
        this.metCostoSelect = "Directo"
        this.materiaPrima = false;
        this.CBData = "No aplica para servicio";
        this.origenData = 0;
        this.TipoCompraSelect = 0;
        /*  this.descuentoData = false; */
        /* this.tasaData = 0; */
        this.minimoData = 0;
        this.maximoData = 0;
        this.sugeridoData = 0;
        this.udmcSelect = 0;
        this.udmvSelect = 0;
        this.presentacionData = "";
        this.genericoData = "";
        this.NumParteData = "";
        this.marcaSelect = 0;
        this.modeloSelect = 0;
        this.colorSelect = 0;
        this.codigoData = "";
        this.enVentaData = false;
        this.checkCodigo = false;
      } else {
        this.dbQr = true;
      }
      /* this.btnDelete = false;
      this.btnModificar = false;
      this.btnGuardar = true;
      this.btncancelar = false; */
      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = false;
      this.vmButtons[4].habilitar = false;
      this.vmButtons[5].habilitar = false;
      this.disabledProduct = true;
      this.dataContabilidad = undefined;
      this.formulaData = {};
      this.setDataUpdateDelete();
    }, 
    (error: any) => {
      console.log(error)
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })


    /* if (this.permisions[0].consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para consultar");
    } else {
      if (this.searchData == undefined || this.searchData == "") {
        this.lcargando.ctlSpinner(false);
        let autFocus = document.getElementById("IdValorCatalogo").focus();
        this.toastr.info("Ingrese un número de parte");
      } else {
        this.lcargando.ctlSpinner(false);
        this.borrar();
        let data = {
          num_parte: this.searchData,
          module: this.permisions[0].id_modulo,
          component: myVarGlobals.fIngresoProducto
        }
        this.ingresoService.searchProduct(data).subscribe(res => {
          this.lcargando.ctlSpinner(false);
          this.searchDataUpdateDelete = res['data'];
          // this.disabledClaseServicio = true;
          if (this.searchDataUpdateDelete.clase == "Servicios") {
            this.dbQr = false;
            this.disabledClaseServicio = true;
            this.disabledMateriaPrima = true;
            this.metCostoSelect = "Directo"
            this.materiaPrima = false;
            this.CBData = "No aplica para servicio";
            this.origenData = 0;
            this.TipoCompraSelect = 0;
            // this.descuentoData = false;
            // this.tasaData = 0;
            this.minimoData = 0;
            this.maximoData = 0;
            this.sugeridoData = 0;
            this.udmcSelect = 0;
            this.udmvSelect = 0;
            this.presentacionData = "";
            this.genericoData = "";
            this.NumParteData = "";
            this.marcaSelect = 0;
            this.modeloSelect = 0;
            this.colorSelect = 0;
            this.codigoData = "";
            this.enVentaData = false;
            this.checkCodigo = false;
          } else {
            this.dbQr = true;
          }
          // this.btnDelete = false;
          // this.btnModificar = false;
          // this.btnGuardar = true;
          // this.btncancelar = false;
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = false;
          this.vmButtons[4].habilitar = false;
          this.vmButtons[5].habilitar = false;
          this.disabledProduct = true;
          this.dataContabilidad = undefined;
          this.formulaData = {};
          this.setDataUpdateDelete();
        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        })
      }
    } */
  }

  setDataUpdateDelete() {
    console.log(this.searchDataUpdateDelete)
    if (this.searchDataUpdateDelete.fk_formula != null) {
      this.disabledForCheck = true;
      this.metCostoSelect = "Directo";
      (this.searchDataUpdateDelete.fk_formula != null) ? this.disabledFormula = false : this.disabledFormula = true;
    };
    if (this.searchDataUpdateDelete.clase == "Productos") {
      this.disabledMateriaPrima = (this.searchDataUpdateDelete.fk_formula != null) ? true : false;
      (this.searchDataUpdateDelete.fk_formula != null) ? this.disabledFormula = false : this.disabledFormula = true; //disabled check
    }
    this.disabledModSearch = (this.searchDataUpdateDelete.fk_formula != null) ? true : false;
    (this.searchDataUpdateDelete.fk_formula != null) ? this.disabledFormula = false : this.disabledFormula = true;
    this.checkAuth = (this.searchDataUpdateDelete.fk_formula != null) ? true : false;
    this.grupoSelect = this.searchDataUpdateDelete.fk_grupo;
    this.materiaPrima = (this.searchDataUpdateDelete.tipo == "Producto") ? false : true;
    this.TipoCompraSelect = this.searchDataUpdateDelete.tipoCompra;
    this.claseSelect = this.searchDataUpdateDelete.clase;
    this.enVentaData = (this.searchDataUpdateDelete.enVenta == 1) ? true : false;
    /*  this.descuentoData = (this.searchDataUpdateDelete.descuento == 1) ? true : false;
     this.tasaData = this.searchDataUpdateDelete.tasa_descuento; */
    this.udmcSelect = this.searchDataUpdateDelete.UDMCompra;
    this.udmvSelect = this.searchDataUpdateDelete.UDMVenta;
    this.sugeridoData = this.searchDataUpdateDelete.sugStock;
    this.origenData = this.searchDataUpdateDelete.procedencia;
    this.codigoData = this.searchDataUpdateDelete.codigoproducto;
    this.editCode = true;
    this.checkCodigo = true;
    this.checkCodigo = true;
    this.minimoData = this.searchDataUpdateDelete.minStock;
    this.maximoData = this.searchDataUpdateDelete.maxStock;
    this.stockaData = this.searchDataUpdateDelete.stock;
    this.nameData = this.searchDataUpdateDelete.nombre;
    this.metCostoSelect = this.searchDataUpdateDelete.metodoCosto;
    this.costoData = this.searchDataUpdateDelete.costo;
    this.CBData = this.searchDataUpdateDelete.codigoBarra;
    this.presentacionData = this.searchDataUpdateDelete.presentacion;
    this.genericoData = this.searchDataUpdateDelete.generico;
    this.NumParteData = this.searchDataUpdateDelete.num_parte;
    this.marcaSelect = this.searchDataUpdateDelete.marca;
    this.modeloSelect = this.searchDataUpdateDelete.modelo;
    this.colorSelect = this.searchDataUpdateDelete.color;
    this.observation = this.searchDataUpdateDelete.observation;

    var dataAccount = {};
    dataAccount['cuenta_costo'] = this.searchDataUpdateDelete.cuentaCostos;
    dataAccount['cuenta_descuento'] = this.searchDataUpdateDelete.cuentaDescuentos;
    dataAccount['cuenta_devolucion'] = this.searchDataUpdateDelete.cuentaDevoluciones;
    dataAccount['cuenta_perdida'] = this.searchDataUpdateDelete.cuentaPerdida;
    dataAccount['cuenta_venta'] = this.searchDataUpdateDelete.cuentaVentas;
    dataAccount['deducible_ir'] = this.searchDataUpdateDelete.deducibleIR;
    dataAccount['iva'] = this.searchDataUpdateDelete.Iva;
    dataAccount['cuenta_inventario'] = this.searchDataUpdateDelete.cuentaInvCosto;
    dataAccount['iva_compra'] = this.searchDataUpdateDelete.IvaCompra;
    dataAccount['iva_venta'] = this.searchDataUpdateDelete.IvaVenta;
    dataAccount['anexos'] = this.searchDataUpdateDelete.anexos;

    if (this.searchDataUpdateDelete.fk_formula != null) {
      dataAccount['formuladetails'] = this.searchDataUpdateDelete.formulecab;
    }

    (this.metCostoSelect == 'Promedio') ? this.disabledCostor = true : this.disabledCostor = false;;

    /* UDM */
    this.values.fk_unidad_masa = (this.searchDataUpdateDelete.fk_unidad_masa != null) ? this.searchDataUpdateDelete.fk_unidad_masa : 0;
    this.values.masa = (this.searchDataUpdateDelete.masa != null) ? this.searchDataUpdateDelete.masa : 0.00;
    this.values.fk_unidad_longitud = (this.searchDataUpdateDelete.fk_unidad_longitud != null) ? this.searchDataUpdateDelete.fk_unidad_longitud : 0;
    this.values.longitud_1 = (this.searchDataUpdateDelete.longitud_1 != null) ? this.searchDataUpdateDelete.longitud_1 : 0.00;
    this.values.longitud_2 = (this.searchDataUpdateDelete.longitud_2 != null) ? this.searchDataUpdateDelete.longitud_2 : 0.00;
    this.values.longitud_3 = (this.searchDataUpdateDelete.longitud_3 != null) ? this.searchDataUpdateDelete.longitud_3 : 0.00;

    /* Aranceles */
    this.values.fk_arancel = (this.searchDataUpdateDelete.fk_arancel != null) ? this.searchDataUpdateDelete.fk_arancel : 0;
    this.values.code = (this.searchDataUpdateDelete.code != null || this.searchDataUpdateDelete.code != "") ? this.searchDataUpdateDelete.code : "";
    (this.searchDataUpdateDelete.fk_arancel == undefined || this.searchDataUpdateDelete.fk_arancel == "") ? this.values.porcentaje = "" : this.values.porcentaje = this.aranceles[this.searchDataUpdateDelete.fk_arancel]['tarifa_arancelaria'];
    (this.searchDataUpdateDelete.fk_arancel == undefined || this.searchDataUpdateDelete.fk_arancel == "") ? this.values.nombre = "" : this.values.nombre = this.aranceles[this.searchDataUpdateDelete.fk_arancel]['nombre'];
    this.commonServices.editDeleteData.next(dataAccount);
    this.stockActualData = true;
  }

  validateDeleteProduct() {
    if (this.permisions[0].eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para consultar");
    } else {
      this.confirmSave("Seguro desea eliminar el producto?", "DELETE_PRODUCT");
    }
  }

  deleteProduct() {
    this.lcargando.ctlSpinner(true);
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Eliminación del producto con número de parte ${this.searchDataUpdateDelete.num_parte}`,
      id_controlador: myVarGlobals.fIngresoProducto,
      id_producto: this.searchDataUpdateDelete.id_producto
    }
    this.ingresoService.deleteProduct(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      setTimeout(() => {
        location.reload();
      }, 300);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }
  cargaFoto(archivos) {
    this.mensajeSppiner = 'Cargando fotos...';
    this.lcargando.ctlSpinner(true);
    if (archivos.length > 0 && (archivos.length + this.fotos.length) <= 5) {
      for (let i = 0; i < archivos.length; i++) {
        const reader = new FileReader();
        reader.onload = (c: any) => {
          this.fotos.push({
            id_producto_fotos: 0,
            recurso: c.target.result
          });
        };
        reader.readAsDataURL(archivos[i]);
      }
    } else if ((archivos.length + this.fotos.length) > 5) {
      this.toastr.warning("No puede subir más de 5 fotos", "¡Atención!");
    }
    this.lcargando.ctlSpinner(false);
  }

  removeFoto(index) {
    if (this.fotos[index].id_producto_fotos > 0) {
      this.fotosEliminar.push(this.fotos.splice(index, 1)[0].id_producto_fotos);
    } else {
      this.fotos.splice(index, 1);
    }
  }

  /* Modals */
  getArancelEvent(idx) {
    this.values.fk_arancel = this.aranceles[idx]['id'];
    this.values.code = this.aranceles[idx]['codigo'];
    this.values.porcentaje = this.aranceles[idx]['tarifa_arancelaria'];
    this.values.nombre = this.aranceles[idx]['nombre'];
    this.closeModal();
  }

  closeModal() {
    ($('#ArancelesModal') as any).modal('hide');
  }

  getCurrencys() {
    this.ingresoService.getCurrencys().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.arrayCountrys = res['data'];
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  metodoCosto(data) {
    if (data == 'Promedio') {
      this.disabledCostor = true;
    } else {
      this.disabledCostor = false;
    }
  }

  rerender(): void {
    this.processing = true;
    this.lcargando.ctlSpinner(true);
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getAranceles();
    });
  }

  grupoProducto() {

    this.ingresoService.getProductos({}).subscribe((res: any) => {
      console.log(res);
      this.listaProductos = res.data
      console.log(this.listaProductos)
      // res.map((data)=>{
      //   this.listaProductos.push(data.descripcion)
      // })
    })
  }

  expandListDocumentosRec() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListDocumentosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.validate = 'PR'
    // modal.componentInstance.contr = this.contribuyenteActive;
    // modal.componentInstance.permissions = this.permissions;
  }

  expandProductos() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalService.open(ListBusquedaComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    // modal.componentInstance.permissions = this.permissions;
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

  catalogo() {

    this.ingresoService.listarCatalogo({}).subscribe((res: any) => {
      console.log(res);
      res.map((data) => {
        this.listaCatalogo.push(data.descripcion)

      })
    })
  }

  verificar(event) {
    console.log(event)
    if (event.tipo_bien == "BLD") {
      this.vidautilDisabled = false
      this.serieDisabled = false
      this.tipomaterialDisabled = false
      this.observacionDisabled = false
      this.catalogoDisabled = false
      this.stockDisabled = true
      this.departamentoDisabled = false

    }
    else if (event.tipo_bien == "BCA") {
      this.vidautilDisabled = true
      this.serieDisabled = false
      this.tipomaterialDisabled = false
      this.observacionDisabled = false
      this.catalogoDisabled = false
      this.stockDisabled = true
      this.departamentoDisabled = false

    }
    else if (event.tipo_bien == "EXI") {
      this.vidautilDisabled = true
      this.serieDisabled = true
      this.tipomaterialDisabled = true
      this.observacionDisabled = true
      this.catalogoDisabled = true
      this.stockDisabled = false
      this.departamentoDisabled = true
    }
    else {
      this.vidautilDisabled = true
      this.serieDisabled = true
      this.tipomaterialDisabled = true
      this.observacionDisabled = true
      this.catalogoDisabled = true
      this.stockDisabled = true
      this.departamentoDisabled = true
    }
  }

  borrar_2() {

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.vmButtons[5].habilitar = true;

    this.observation = "";
    this.dbQr = false;
    this.disabledMateriaPrima = false;
    this.dAction = false;
    this.materiaPrima = false;
    this.TipoCompraSelect = 0;
    this.metCostoSelect = 0;

    this.origenData = 0;
    this.presentacionData = "";
    /*     this.tasaData = ""; */
    this.CBData = "";
    this.sugeridoData = "";
    this.codigoData = "";
    this.minimoData = "";
    this.maximoData = "";
    this.nameData = "";
    this.costoData = 0;
    this.genericoData = "";
    this.NumParteData = "";
    this.marcaSelect = 0;
    this.modeloSelect = 0;
    this.colorSelect = 0;
    this.udmcSelect = 0;
    this.udmvSelect = 0;
    this.formulaSelect = undefined;
    this.id_producto = undefined;
    this.codigoBienesDescripcion = undefined;
    this.stock = undefined;
    this.id_subgrupo = 0;
    this.subgrupo.descripcion = "";
    this.peligrosidad = "";
    this.perecible = "";
    this.fecha_caducidad = moment(new Date()).format('YYYY-MM-DD');
    this.observacion_peligrosidad = "";
    this.fecha_garantia = moment(new Date()).format('YYYY-MM-DD');
    this.observacion_peligrosidad = "";
    this.tipo_material = "";
    this.ano_vida_util = 0;
    this.serie = "";
    this.observacion_requerimiento = "";
    /*   this.enVentaData = false; */
    this.enVentaData = true;
    /*     this.descuentoData = false; */
    this.checkCodigo = false;
    this.checkAuth = false;
    this.randomGenerate = "";
    this.stockActualData = false;
    if (this.searchDataUpdateDelete != undefined) { this.searchDataUpdateDelete = undefined }
    this.codigoBienes = undefined;

    this.secuencial = undefined;
    this.values = {
      fk_arancel: 0, code: "", porcentaje: 0, nombre: "", fk_unidad_masa: 0, masa: 0.00, fk_unidad_longitud: 0, longitud_1: 0.00, longitud_2: 0.00, longitud_3: 0.00
    }

    let data = {
      borrar: true
    }
    this.commonServices.disabledComponent.next(data);
    this.disabledProduct = false;
    this.rerender();
  }

  getDepartamentos() {
    this.ingresoService.getDepartamento({}).subscribe(
      (res) => {
        this.departamento = res['data']
      }
    )

  }

  saveAllProducts() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar todos los productos de este ingreso de bodega?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSppiner = "Guardando datos...";
        this.lcargando.ctlSpinner(true);
        let datagroup = this.dataGrupo.filter(d => d.id_grupo == this.grupoSelect)
        let data = {
          ingreso: {
            nroIngresoBodega: this.fk_ingreso_bodega,
            grupoProducto: this.grupo_producto
          },

          datos: {
            fecha_garantia: this.fecha_garantia,
            perecible: this.perecible,
            fecha_caducidad: this.fecha_caducidad,
            peligrosidad: this.peligrosidad,
            observacion_peligrosidad: this.observacion_peligrosidad,
            serie_nueva: this.serie,
            tipo_material: this.tipo_material,
            observacion_requerimiento: this.observacion_requerimiento,
            vehiculo: this.vehiculo,
            nro_vehiculo: this.nro_vehiculo,
            placa: this.placa,
            numero_chasis: this.numero_chasis,
            motor: this.motor,
            departamento: this.ingresoDepartamento,
            presentacion: this.presentacionData,
            marca: this.marcaSelect,
            id_grupo: this.grupoSelect,
            udmc: this.udmcSelect,
            modelo: this.modeloSelect,
            color: this.colorSelect,
            procedencia: this.origenData,
            tipo_compra: this.TipoCompraSelect,
            costo: this.costoData,
            observation: this.observation,
            fotos: this.fotos.filter(e => e.id_producto_fotos === 0),

            //id_empleado: this.adminActive.id_empleado
          }
        }

        this.ingresoService.updateAllIngresos(data).subscribe(
          (res) => {
            console.log(res)
            if (res["status"] == 1) {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Los Datos fueron guardados con éxito",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  console.log("se guardo")
                  //this.borrar();
                  this.vmButtons[2].habilitar = true
                  this.vmButtons[3].habilitar = true

                  // this.datosAdminElec= res['data']
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
          }
        )
      }
    });
  }

async cargarProductoAdicional() {
  this.lcargando.ctlSpinner(true)
  try {
    let response: any = await this.ingresoService.getInfoProducto(this.id_producto, { params: { filter: this.filter, paginate: this.paginate}})
    
    // TODO: Paginate por cada tabla
console.log(response)
    this.traslado = response.traslado.data
    this.mantenimiento = response.mantenimiento.data
    this.poliza = response.poliza.data

    this.lcargando.ctlSpinner(false)
  } catch (err) {
    console.log(err)
    this.lcargando.ctlSpinner(false)
    this.toastr.error(err.error.message, 'Error cargando Producto')
  }
}


  expandirVistaFotos(index) {
    const modalInvoice = this.modalService.open(ModalVistaFotosComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.fotos = this.fotos;
    modalInvoice.componentInstance.indexActive = index;
  }

  /* cargarHistorialTraslado() {

    this.mensajeSppiner = "Cargando 1";
    this.lcargando.ctlSpinner(true);
    // console.log(this.claseSelect)
    // let id = this.claseSelect.id_grupo_productos
    let id = this.id_producto
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.ingresoService.getHistorialTraslado(data, id).subscribe(
      (res) => {
        console.log(res)
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.traslado = res['data']['data'];
        } else {
          this.traslado = Object.values(res['data']['data']);
        }
        //console.log(this.subgrupos)
        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cargarMantenimiento() {
    this.mensajeSppiner = "Cargando 1";
    this.lcargando.ctlSpinner(true);
    // console.log(this.claseSelect)
    // let id = this.claseSelect.id_grupo_productos
    let id = this.id_producto
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.ingresoService.getHistorialMantenimiento(data, id).subscribe(
      (res) => {
        console.log(res)
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.mantenimiento = res['data']['data'];
        } else {
          this.mantenimiento = Object.values(res['data']['data']);
        }
        //console.log(this.subgrupos)
        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

    cargarPoliza() {
    this.mensajeSppiner = "Cargando 1";
    this.lcargando.ctlSpinner(true);
    // console.log(this.claseSelect)
    // let id = this.claseSelect.id_grupo_productos
    let id = this.id_producto
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.ingresoService.getHistorialPoliza(data, id).subscribe(
      (res) => {
        console.log(res)
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.poliza = res['data']['data'];
        } else {
          this.poliza = Object.values(res['data']['data']);
        }
        //console.log(this.subgrupos)
        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  } */

  mostrarFormLTur(dt,titulo){
    const modal = this.modalService.open(ModalNuevoComponent,{
      size:"xl",
      backdrop:"static",
      windowClass: "viewer-content-general"
    });
   // modal.componentInstance.module_comp = variablesGlobales.fLTuristicos;
    modal.componentInstance.titulo = titulo;
    modal.componentInstance.dt = dt;
    //modal.componentInstance.esNuevoLTur= esNuevoLTur;
    //modal.componentInstance.dato = dato;
    
  }

  /*expandModalBodega() {

      const modalInvoice = this.modalService.open(ModalBodegaComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      // modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      // modalInvoice.componentInstance.id_concepto = this.concepto.id;
      //modalInvoice.componentInstance.listaConceptos = this.conceptosList;
      //modalInvoice.componentInstance.codigo = this.concepto.codigo;
      //modalInvoice.componentInstance.fk_contribuyente = this.contribuyenteActive.id_cliente;
      //modalInvoice.componentInstance.deudas = this.deudas;
    
  }*/

  expandModalBodega() {

    const modal = this.modalService.open(ModalBodegaComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }

  removeUbicacion(index) {
    //this.ubicaciones[index].valor = 0;
    this.bodegas[index].aplica = false;
    this.bodegas.splice(index,1);
    console.log(this.bodegas);
  }


  guardarProductoBodega(){
    this.mensajeSppiner = 'Guardando Detalles...';
      this.lcargando.ctlSpinner(true);
      console.log(this.bodegas);
      let data = {
        codigoproducto: this.codigoData,
        detallesBodegas: this.bodegas,
      };
      console.log(data);
      if (this.codigoData == undefined){
        Swal.fire({
          icon: "warning",
          title: "Error",
          // Asignacion de ingresos para periodo "+this.periodo+" guardada satisfactoriamente
          text: 'Elija un producto en la parte superior',
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
        this.lcargando.ctlSpinner(false);
      }
      if (this.bodegas.length == 0){
        Swal.fire({
          icon: "warning",
          title: "Error",
          // Asignacion de ingresos para periodo "+this.periodo+" guardada satisfactoriamente
          text: 'Elija una ubicación',
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
        });
        this.lcargando.ctlSpinner(false);
      }
      else if (this.codigoData != undefined &&  this.bodegas.length > 0){
        this.ingresoService.guardarBodegaProducto(data).subscribe(
          res => {
            console.log(res);
    
            Swal.fire({
              icon: "success",
              title: "Exito",
              // Asignacion de ingresos para periodo "+this.periodo+" guardada satisfactoriamente
              text: 'Se guardó exitosamente',
              showCloseButton: true,
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#20A8D8',
            });
            this.lcargando.ctlSpinner(false);
    
          },
          err => {
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error al guardar el Detalle')
          }
        )

      }
      //this.vmButtons[4].habilitar = false;
      //this.constDisabled = true;
      //this.calculoDisabled = true;
      //this.calcAmortizaciones();
      //this.limpiarData()
  }

  seleccionaConcepto(event) {
    this.conceptoSelected = event
  }

  agregarConcepto() {
    let costo: Costo = {
      fecha: moment().format('YYYY-MM-DD'),
      descripcion: this.conceptoSelected.nombre,
      observacion: null,
      valor: 0.00,
    }
    this.costos = [...this.costos, costo]
  }

  async almacenarCostos() {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSppiner = 'Almacenando Costos Adicionales'
      let response = await this.ingresoService.setCostos(this.produto.id_producto, {costos: this.costos})
      console.log(response)

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error almacenando Costos')
    }
  }

  async eliminarCosto(costo: Costo) {
    if (costo.id != null) {
      let result: SweetAlertResult = await Swal.fire({
        // 'Seguro/a desea eliminar el costo asociado?', '', 'question'
        title: 'Seguro/a desea eliminar el costo asociado?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        this.lcargando.ctlSpinner(true)
        try {
          this.mensajeSppiner = 'Eliminando Costo Adicional'
          let response = await this.ingresoService.delCosto(costo.id)
          console.log(response)
          
          this.costos.splice(this.costos.indexOf(costo), 1);
          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error eliminando Costo')
        }
      }
    } else {
      this.costos.splice(this.costos.indexOf(costo), 1);
    }

  }

  expandReclamos(reclamo?: any) {
    const modal = this.modalService.open(ModalReclamosComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.producto = this.produto
    if (reclamo) modal.componentInstance.reclamo = reclamo
  }

  expandUdm() {
    const modal = this.modalService.open(ModalUdmComponent, { size: 'lg', backdrop: 'static' })
  }
  consultarReportGrafi() {


    // let motivo = (typeof this.tipo_permiso_id_cc === 'undefined') ? "" : (this.tipo_permiso_id_cc === null) ? "" : this.tipo_permiso_id_cc;
     
     let id =this.id_producto
     let parameterUrl: any = {
        flpr_anio: '2023'
       // flpr_anio: new Date(this.anio_reporte + '-12-01').getFullYear(),
       // id_mes: this.mesConsulta == null ? 0 : this.mesConsulta,
       // motivo_permiso: motivo
     };
    
     this.mensajeSppiner = 'Cargando...'
     this.lcargando.ctlSpinner(true)
     this.ingresoService.getReporteGraficoTendencia(parameterUrl,id).subscribe((res: any) => {
      this.lcargando.ctlSpinner(false)
         let labelInfoBar = [];
         let DataSetGrafit = [];
         console.log(res);
         if (this.chart1 != undefined) {
           this.chart1.clear()
           this.chart1.destroy()
           console.log('ejecuta1');
         }
 
 
 
         for (let i = 0; i < res['data'].length; i++) {
           labelInfoBar.push(res['data'][i].mes);
         }
 
         /*Recorremos el elemento principal que son los  motivos */
         
         for (let i = 0; i < res['data'].length; i++) {
 
 
           if (DataSetGrafit.length > 0) {
 
             let labelGraf = DataSetGrafit.filter(co => co.label == res['data'][i].motivo);
            
 
             if (labelGraf.length > 0) {
               labelGraf[0]['data'].push(res['data'][i].total);
             } else {
 
               let dataPointGrafit = []
 
               dataPointGrafit.push(res['data'][i].total);
 
               DataSetGrafit.push({
                 label: res['data'][i].motivo,
                 backgroundColor: '#42A5F5',
                 data: dataPointGrafit
               })
 
             }
 
           } else {
 
             let dataPointGrafit = []
 
             dataPointGrafit.push(res['data'][i].total);
 
             DataSetGrafit.push({
               label: res['data'][i].motivo,
               backgroundColor: '#42A5F5',
               data: dataPointGrafit
             })
 
           }
           console.log(DataSetGrafit)
         
           const datos = DataSetGrafit[0]?.data
           const posiciones = datos?.map((valor, indice) => indice + 0.5);
           const lineaTendencia = this.calcularLineaTendencia(posiciones, datos);
           const valoresYLineaTendencia = posiciones.map(x => lineaTendencia.m * x + lineaTendencia.b); // Calcula los valores Y correspondientes a la línea de tendencia
           console.log(valoresYLineaTendencia)
         
 
           //labelInfoBar.push(res[i].mes);
       
         this.ReportGrafiFPBarras = {
           labels: labelInfoBar,
           datasets: DataSetGrafit
         };
         console.log(labelInfoBar, DataSetGrafit);
         let data = DataSetGrafit.length == 0 ? [] : DataSetGrafit[0].data;
         let tendencia = valoresYLineaTendencia
         // let label = labelInfoBar === : labelInfoBar
         setTimeout(() => {
           this.chart1 = this.chart("chart1", "bar", labelInfoBar, data,tendencia);
           console.log(this.chart1);
         }, 50);
 
 
 
       }
       
     },
     (error) => {
       this.lcargando.ctlSpinner(false);
       this.processing = true;
       this.toastr.info(error.error.message);
     });
   }
   calcularLineaTendencia(x, y) {
     const n = x.length;
     let sumX = 0;
     let sumY = 0;
     let sumXY = 0;
     let sumXX = 0;
   
     for (let i = 0; i < n; i++) {
       sumX += x[i];
       sumY += Number(y[i]);
       sumXY += x[i] * Number(y[i]);
       sumXX += x[i] * x[i];
     }
   
     const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
     const b = (sumY - m * sumX) / n;
   
     return { m, b }; // Devuelve los coeficientes de la línea de tendencia (pendiente y ordenada al origen)
   }
 
 
  chart(name: string, tipo: string, label: string[], data: number[], tendencia: number[]) {

    let htmlRef = this.elementRef.nativeElement.querySelector(`#chart1`);

    console.log(data)
    console.log(tendencia)
        return new Chart(htmlRef, {
          type: tipo,
          data: {
            labels: label,
            datasets: [{
              label: '# Mensual',
              data: data,
              type:'bar',
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(146, 79, 44, 0.8)',
                'rgba(144, 169, 26, 0.8)',
                'rgba(26, 169, 120, 0.8)',
                'rgba(6, 117, 134, 0.8)',
                'rgba(109, 47, 127, 0.8)',
                'rgba(119, 37, 103, 0.8)',
                'rgba(37, 77, 119, 0.8)',
                'rgba(245, 39, 145, 0.17)',
                'rgba(165, 39, 245, 0.17)',
                'rgba(39, 245, 71, 0.17)',
                'rgba(8, 104, 23, 0.52)',
                'rgba(121, 183, 3, 0.52)',
                'rgba(183, 143, 3, 0.52)',
                'rgba(212, 132, 17, 0.52)',
                'rgba(212, 17, 68, 0.52)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(144, 169, 26, 0.8)',
                'rgba(26, 169, 120, 0.8)',
                'rgba(6, 117, 134, 0.8)',
                'rgba(109, 47, 127, 0.8)',
                'rgba(119, 37, 103, 0.8)',
                'rgba(37, 77, 119, 0.8)',
                'rgba(245, 39, 145, 0.17)',
                'rgba(165, 39, 245, 0.17)',
                'rgba(39, 245, 71, 0.17)',
                'rgba(8, 104, 23, 0.52)',
                'rgba(121, 183, 3, 0.52)',
                'rgba(183, 143, 3, 0.52)',
                'rgba(212, 132, 17, 0.52)',
                'rgba(212, 17, 68, 0.52)'
              ],
              borderWidth: 1
            },
            {
              label: 'Tendencia',
              data:tendencia ,
              type:'line',
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(146, 79, 44, 0.8)',
                'rgba(144, 169, 26, 0.8)',
                'rgba(26, 169, 120, 0.8)',
                'rgba(6, 117, 134, 0.8)',
                'rgba(109, 47, 127, 0.8)',
                'rgba(119, 37, 103, 0.8)',
                'rgba(37, 77, 119, 0.8)',
                'rgba(245, 39, 145, 0.17)',
                'rgba(165, 39, 245, 0.17)',
                'rgba(39, 245, 71, 0.17)',
                'rgba(8, 104, 23, 0.52)',
                'rgba(121, 183, 3, 0.52)',
                'rgba(183, 143, 3, 0.52)',
                'rgba(212, 132, 17, 0.52)',
                'rgba(212, 17, 68, 0.52)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(144, 169, 26, 0.8)',
                'rgba(26, 169, 120, 0.8)',
                'rgba(6, 117, 134, 0.8)',
                'rgba(109, 47, 127, 0.8)',
                'rgba(119, 37, 103, 0.8)',
                'rgba(37, 77, 119, 0.8)',
                'rgba(245, 39, 145, 0.17)',
                'rgba(165, 39, 245, 0.17)',
                'rgba(39, 245, 71, 0.17)',
                'rgba(8, 104, 23, 0.52)',
                'rgba(121, 183, 3, 0.52)',
                'rgba(183, 143, 3, 0.52)',
                'rgba(212, 132, 17, 0.52)',
                'rgba(212, 17, 68, 0.52)'
              ],
              
              borderWidth: 1
            },
           
          ]
          },
          options: {
            // plugins: {
            //   tooltip: {
            //     callbacks: {
            //       title: (ttItem) => (ttItem[0].dataset.label)
            //     }
            //   }
            // },
            scales: {
              xAxes: [{
                ticks: {
                  beginAtZero: true
                },
    
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true
                },
    
              }]
            }
          }
        });
      }
 
      periodoSelected() {}
}
