import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import { InspeccionService } from './inspeccion.service';
import { ModalNuevolocalComponent } from './modal-nuevolocal/modal-nuevolocal.component';
import { ModalNuevaInspeccionComponent } from './modal-nueva-inspeccion/modal-nueva-inspeccion.component';
import * as myVarGlobals from 'src/app/global';
import { CommonService } from 'src/app/services/commonServices';
import { ModalLocalDetComponent } from './modal-local-det/modal-local-det.component';
import { ExcelService } from 'src/app/services/excel.service';
import { environment } from 'src/environments/environment';
import { PageEvent } from '@angular/material/paginator';


@Component({
standalone: false,
  selector: 'app-inspeccion',
  templateUrl: './inspeccion.component.html',
  styleUrls: ['./inspeccion.component.scss']
})
export class InspeccionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = 'Gestión de Locales Comerciales'
  mensajeSpinner: string = "Cargando...";
  dataUser: any;
  permissions: any;
  vmButtons: any[] = []

  readOnly: boolean = false;
  localSelected: boolean = false;

  contribuyente: any = {
    razon_social: ''
  }
  locales: any[] = [];
  // inspecciones: any[] = [];

  local: any = {
    razon_social: null,
    inspecciones: []
  }

  localSel: any = {}

  estados_ins: any = {
    'A': {style: 'far fa-check text-success', tooltip: 'Aprobado'},
    'F': {style: 'far fa-times text-danger', tooltip: 'Denegado'},
    'P': {style: 'far fa-minus-circle text-primary', tooltip: 'Pendiente'}
  }

  cmb_tipo_local: any[] = [
    { value: 99, label: 'TODOS' },
    { value: 0, label: 'Local Comercial' },
    { value: 1, label: 'Local Municipal' },
    { value: 2, label: 'Local No Físico' },
    { value: 3, label: 'Feria/Eventual' },
  ]

  cmb_tipo_negocio: any[] = [
    { id_catalogo: 0, valor: 'TODOS', descripcion: 'TODOS' },
  ]

  cmb_tipo_actividad: any[] = [
    { id_catalogo: 0, valor: 'TODOS', descripcion: 'TODOS' },
  ]

  cmb_zona: any[] = [
    { valor: 0, descripcion: 'TODOS' },
  ]

  cmb_sector: any[] = []

  cmb_sector_filter: any[] = [
    { id_catalogo: 0, grupo: 'ALL', descripcion: 'TODOS' },
  ]

  cmb_mercados: any[] = [
    { id_catalogo: 0, descripcion: 'TODOS' },
  ]
  estados: any[] = []

  viewer: boolean = true;

  paginate: any = {
    length: 0,
    perPage: 10,
    page: 1,
  }

  filter: any = {
    contribuyente: null,
    razon_social: null,
    tipo_local: 99,
    tipo_negocio: 'TODOS',
    tipo_actividad: 0,
    zona: 0,
    sector: 0,
    mercado: 0,
    ultima_fecha_patente_desde: null,
    ultima_fecha_patente_hasta: null,
    ultima_fecha_pago_patente_desde: null,
    ultima_fecha_pago_patente_hasta: null,
  }


  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private apiService: InspeccionService,
    private commonVarService: CommonVarService,
    private commonSrv: CommonService,
    private excelService: ExcelService,
  ) {
    /**
     * Inserta el nuevo local a la tabla
     */
    this.commonVarService.setNuevoLocal.asObservable().subscribe(
      () => {
        this.buscarLocales()
        // this.locales.push(elem);
        // // Cargar las ordenes que se generaron automaticamente
        // this.cargaInspecciones(elem);
        // this.localSelected = true
      }
    )

    this.commonVarService.setActualizarLocal.asObservable().subscribe(
      (elem: any) => {
        console.log(elem)
        elem.created_at = moment(elem.created_at).format('YYYY-MM-DD')
        // Buscar en cmb_estado_neg el estado del elem e intercambiar con su descripcion
        elem.estado = this.estados.find(e => e.descripcion == elem.estado)

        Object.assign(this.locales.find(local => local.id_local == elem.id_local), elem);
      }
    )

    /**
     * Inserta una nueva inspeccion a la tabla
     */
    this.commonVarService.setNuevaInspeccion.asObservable().subscribe(
      (res) => {
        console.log(res)
        this.local.inspecciones.push({ ...res })
      }
    )
  }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: 'btnsRentasLocalComercial',
        paramAccion: "",
        boton: { icon: "far fa-plus-square", texto: "NUEVO LOCAL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: 'btnsRentasLocalComercial',
        paramAccion: "",
        boton: { icon: "far fa-file-plus", texto: "NUEVA INSPECCION" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
      },
      {
        orig: 'btnsRentasLocalComercial',
        paramAccion: "",
        boton: { icon: "far fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: 'btnsRentasLocalComercial',
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-danger boton btn-sm",
        habilitar: false,
        // printSection: "print-section", 
        // imprimir: true 
      },
    ]

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    setTimeout(() => {
      this.validaPermisos();
    }, 0);

  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "NUEVA INSPECCION":
        this.nuevaInspeccion()
        break;
      case "NUEVO LOCAL":
        this.nuevoLocal()
        break;
      case "EXCEL":
        this.exportarExcel()
        break;
      case "PDF":
        let url = `${environment.ReportingUrl}rpt_locales_comerciales.pdf?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}`
        window.open(url, '_blank')
        break;
      default:
        break;
    }
  }

  changePaginate(event: PageEvent) {
    Object.assign(this.paginate, {pageIndex: event.pageIndex, page: event.pageIndex + 1});
    this.lcargando.ctlSpinner(true);
    this.getLocales()
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);

    let params = {
      codigo: myVarGlobals.fRenInspeccionOrden,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {
        // console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          // this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permissions para usar este recurso.", this.fTitle);
        } else {
          this.cargarCatalogo()
          // this.lcargando.ctlSpinner(false);
        }
      },
      err => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario');
      }
    )
  }

  async cargarCatalogo() {
    (this as any).mensajeSpinner = 'Cargando Catalogos'
    // this.lcargando.ctlSpinner(true);

    try {
      let catalogos: any = await this.apiService.getCatalogos({ params: "'REN_TIPO_NEG','REN_LOCAL_TIPO_NEGOCIO','CAT_ZONA','CAT_SECTOR','REN_MERCADO','REN_ESTADO_NEG'" })

      catalogos.REN_TIPO_NEG.forEach((element: any) => {
        const { id_catalogo, valor, descripcion } = element
        this.cmb_tipo_actividad = [...this.cmb_tipo_actividad, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
      })

      catalogos.REN_LOCAL_TIPO_NEGOCIO.forEach((element: any) => {
        const { id_catalogo, descripcion, valor } = element
        this.cmb_tipo_negocio = [...this.cmb_tipo_negocio, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
      })

      catalogos.CAT_ZONA.forEach((element: any) => {
        const { valor, descripcion } = element
        this.cmb_zona = [...this.cmb_zona, { valor: valor, descripcion: descripcion }]
      })

      catalogos.CAT_SECTOR.forEach((element: any) => {
        const { id_catalogo, grupo, descripcion } = element
        this.cmb_sector = [...this.cmb_sector, { id_catalogo: id_catalogo, grupo: grupo, descripcion: descripcion }]
      })

      catalogos.REN_MERCADO.forEach((element: any) => {
        const { id_catalogo, valor, descripcion } = element
        this.cmb_mercados = [...this.cmb_mercados, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
      })

      catalogos.REN_ESTADO_NEG.forEach((element: any) => {
        const { id_catalogo, valor, descripcion } = element
        this.estados = [...this.estados, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
      })

      this.getLocales()
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err, 'Error cargando Catalogos')
    }
  }

  filterSector(event: any) {
    // console.log(event.valor)
    this.cmb_sector_filter = [
      { valor: 0, descripcion: 'TODOS' },
    ]
    if (event.valor != 0) {
      let filtered = this.cmb_sector.filter((e: any) => e.grupo == event.valor)
      this.cmb_sector_filter = [...this.cmb_sector_filter, ...filtered]
    }
  }

  buscarLocales() {
    // Deshabilitar el boton de Nueva Inspeccion
    this.vmButtons[1].habilitar = true

    // Limpieza de datos
    this.local = {
      razon_social: null,
      inspecciones: []
    }

    // Volver a pagina 1 al presionar Consultar
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })

    // Validar integridad de los parametros de busqueda
    this.filter.contribuyente = (!this.filter.contribuyente?.trim().length) ? null : this.filter.contribuyente
    this.filter.razon_social = (!this.filter.razon_social?.trim().length) ? null : this.filter.razon_social

    this.lcargando.ctlSpinner(true);
    this.getLocales()
  }

  async getLocales() {
    (this as any).mensajeSpinner = 'Cargando Locales'
    try {
      let res = await this.apiService.getLocales({ params: { filter: this.filter, paginate: this.paginate } })
      this.paginate.length = res.total
      this.locales = res.data
      this.locales.map((local: any) => local.created_at = moment(local.created_at).format('YYYY-MM-DD'))
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Locales')
    }
  }

  async exportarExcel() {
    let excelData = [];

    (this as any).mensajeSpinner = 'Exportando Locales Comerciales'
    this.lcargando.ctlSpinner(true);
    try {
      //
      let locales = await this.apiService.getLocales({ params: { filter: this.filter } })
      locales.map((local: any) => local.created_at = moment(local.created_at).format('YYYY-MM-DD'))

      locales.forEach((local: any) => {
        const { id_local, razon_social, tipo_local, tipo_negocio, ultima_fecha_patente } = local
        const { razon_social: propietario, num_documento, tipo_documento } = local.fk_contribuyente
        const { valor: actividad_comercial } = local.fk_actividad_comercial

        const data = {
          ID: id_local,
          Nombre: razon_social,
          TipoLocal: (tipo_local == 1) ? "Municipal" : "Comercial",
          Sector: (local.fk_sector != null) ? local.fk_sector.descripcion : 'N/A',
          Grupo: (local.fk_grupo != null) ? local.fk_grupo.descripcion ?? local.fk_grupo.valor : 'N/A',
          ActComercial: actividad_comercial,
          Propietario: propietario,
          TipoDocumento: tipo_documento,
          NumDocumento: num_documento,
          Contrato: (local.contrato != null) ? local.contrato : 'N/A',
          UltimoPagoPatente: ultima_fecha_patente ?? 'N/A',
          Vencimiento: (local.vencimiento_contrato != null) ? moment(local.vencimiento_contrato).format('YYYY-MM-DD') : 'N/A'
        }
        excelData.push(data)
      })
      this.excelService.exportAsExcelFile(excelData, 'LocalesComerciales')
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error exportando Locales')
    }
  }

  nuevoLocal() {
    const modal = this.modalService.open(ModalNuevolocalComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contribuyente = this.contribuyente;
    modal.componentInstance.permissions = this.permissions;
  }

  actualizarLocal(local) {
    const modal = this.modalService.open(ModalLocalDetComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.contribuyente = this.contribuyente;
    modal.componentInstance.local_id = local.id_local;
    // modal.componentInstance.nuevo = false;
    // modal.componentInstance.permissions = this.permissions;
  }

  nuevaInspeccion() {
    const modal = this.modalService.open(ModalNuevaInspeccionComponent, { size: 'lg', backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.local = this.local;
    modal.componentInstance.contribuyente = this.local.fk_contribuyente
  }

  editaInspeccion(inspeccion: any) {
    const modal = this.modalService.open(ModalNuevaInspeccionComponent, { size: 'lg', backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.local = this.local;
    modal.componentInstance.i_inspeccion = inspeccion;
  }

  changeView() {
    this.viewer = !this.viewer
  }

  /**
   * Muestra los detalles de un local comercial
   * @param local 
   */
  viewLocal(local: any) {
    (this as any).mensajeSpinner = 'Obteniendo datos de Local'
    this.lcargando.ctlSpinner(true);
    this.apiService.getLocal({ local: local.id_local }).subscribe(
      (res: any) => {
        // console.log(res.data)
        Object.assign(this.local, res.data)
        // Manipulacion de datos para mostrar
        Object.assign(this.local, {
          fk_grupo: res.data.fk_grupo ? res.data.fk_grupo : { valor: 'N/A' },
          fecha: moment(res.data.fecha).format('YYYY-MM-DD'),
          fecha_vencimiento: res.data.fk_contrato ? res.data.fk_contrato.fecha_vencimiento : null,
          direccion: res.data.direccion ? res.data.direccion : 'No especifiada',
          tipo_establecimiento: res.data.tipo_establecimiento == 'MA' ? 'Matriz' : 'Sucursal',
          tiene_fabrica: res.data.tiene_fabrica == 'N' ? 'No' : 'Sí',
          tipo_local: res.data.tipo_local == 0 ? 'Local Comercial' : res.data.tipo_local == 1 ? 'Local Municipal' : res.data.tipo_local == 2 ? 'No Físico' : res.data.tipo_local == 3 ? 'Feria/Eventual' : 'N/A',
          balanzas: res.data.balanzas ? res.data.balanzas : { h_cantidad: 0, h_estado: 'N/A' },
          fk_zona: res.data.fk_zona ? res.data.fk_zona : { descripcion: 'N/A' },
          cod_catastro: res.data.cod_catastro ? res.data.cod_catastro : 'N/A',
        })
        this.changeView()
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando datos de Local')
      }
    )
  }

  /**
   * Recuperar las inspecciones asociadas al local
   * @param local 
   */
  async cargaInspecciones(local: any) {
    // Llevar registro del local seleccionado
    Object.assign(this.local, local)
    this.local.inspecciones = [];

    (this as any).mensajeSpinner = 'Cargando Inspecciones...';
    this.lcargando.ctlSpinner(true);
    
    try {
      this.local.inspecciones = await this.apiService.getInspecciones({ local: local })
      this.local.inspecciones.forEach((inspeccion: any) => {
        inspeccion.estado_1 = this.estados_ins[inspeccion.estado_1]
        inspeccion.estado_2 = this.estados_ins[inspeccion.estado_2]
        inspeccion.estado_3 = this.estados_ins[inspeccion.estado_3]
        inspeccion.estado_4 = this.estados_ins[inspeccion.estado_4]
  
        inspeccion.fecha = moment(inspeccion.fecha).format('YYYY-MM-DD')
        inspeccion.created_at = moment(inspeccion.created_at).format('YYYY-MM-DD')
      })
      this.vmButtons[1].habilitar = ['X', 'I'].includes(this.local.estado.descripcion)
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false);
      this.toastr.error(err.error.message, 'Error cargando Inspecciones');
    }
  }

  limpiarFiltros() {
    this.filter = {
      contribuyente: null,
      razon_social: null,
      tipo_local: 99,
      tipo_negocio: 'TODOS',
      tipo_actividad: 0,
      zona: 0,
      sector: 0,
      mercado: 0,
      ultima_fecha_patente_desde: null,
      ultima_fecha_patente_hasta: null,
      ultima_fecha_patente_pago_desde: null,
      ultima_fecha_patente_pago_hasta: null,
    }
  }

  handleButtonFechaDesde() {
    Object.assign(this.filter, { ultima_fecha_patente_desde: null })
  }
  handleButtonFechaHasta() {
    Object.assign(this.filter, { ultima_fecha_patente_hasta: null })
  }

  handleButtonFechaPagoDesde() {
    Object.assign(this.filter, { ultima_fecha_patente_pago_desde: null })
  }

  handleButtonFechaPagoHasta() {
    Object.assign(this.filter, { ultima_fecha_patente_pago_hasta: null })
  }

}
