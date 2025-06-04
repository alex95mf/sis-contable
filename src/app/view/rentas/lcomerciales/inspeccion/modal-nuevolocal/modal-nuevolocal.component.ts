import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js'

import { InspeccionService } from '../inspeccion.service';

import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ModalBusqContratoComponent } from '../modal-busq-contrato/modal-busq-contrato.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ModalContribuyentesComponent } from '../modal-contribuyentes/modal-contribuyentes.component';
import { ModalFeriasComponent } from '../modal-ferias/modal-ferias.component';

@Component({
standalone: false,
  selector: 'app-modal-nuevolocal',
  templateUrl: './modal-nuevolocal.component.html',
  styleUrls: ['./modal-nuevolocal.component.scss']
})
export class ModalNuevolocalComponent implements OnInit {
  @Input() nuevo: boolean = true;
  @Input() id_local;
  @Input() permissions: any;
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle: string = 'Nuevo Local'
  mensajeSpinner: string
  // contribuyente: any;
  vmButtons: any[] = []
  validaciones = new ValidacionesFactory()

  tipos_negocio: any[] = []
  zonas: any[] = []
  sectores: any[] = []  // Cargar los sectores desde Catalogo
  sectores_filter: any[] = []
  mercados: any[] = []
  grupos: any[] = []
  estados: any[] = []
  provincias: any[] = []
  cantones: any[] = []
  cantones_filter: any[] = []
  actividades_comerciales: any[] = []
  tipo_estable = [
    { value: "MA", label: "MATRIZ" },
    { value: "SU", label: "SUCURSAL" }
  ]
  tiene_fabrica = ['S', 'N']
  cmb_tipo_local: any[] = [
    { id: 0, value: 'Local Comercial' },
    { id: 1, value: 'Local Municipal' },
    { id: 2, value: 'No Físico' },
    { id: 3, value: 'Feria Eventual' },
  ]
  cmb_lt_cat: any[] = []
  cmb_lt_cat_2: any[] = []
  cmb_lt_cat_2_filter: any[] = []
  lblCantidad: string = 'Cantidad de '

  local: any = {
    fk_contribuyente: { razon_social: '' },
    id_local: null,
    razon_social: null,
    tipo_local: 0,  // 0: Local Comercial, 1: Local Municipal, 2 Local Ambulante, 3 Feria/Eventual
    fk_actividad_comercial: 0,
    tipo_establecimiento: 0,
    tiene_fabrica: 0,
    tipo_negocio: 0,  // Mayorista - Minorista
    uso_suelo: null,
    // fk_provincia: 0,
    // fk_canton: 0,
    patrimonio: 0,
    turismo: false,
    lt_categoria: 0,
    lt_categoria_2: 0,
    lt_cantidad: 0,
    fk_zona: 0,
    fk_sector: 0,
    manzana: 0,
    solar: 0,
    fk_grupo: 0,
    fk_puesto: {
      numero: null
    },
    estado: 0,
    estado_contrato: null,
    fecha: moment().format('YYYY-MM-DD'),
    fecha_vencimiento: moment().format('YYYY-MM-DD'),
    contrato: {
      numero: null
    }
  }

  constructor(
    private apiService: InspeccionService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarService: CommonVarService,
    private modalService: NgbModal
  ) {
    this.commonVarService.selectContratoContribuyente.asObservable().subscribe(
      (res) => {
        let obj = {
          contrato: {
            id: res.id,
            numero: res.numero_contrato
          },
          fecha: moment(res.fecha_inicio).format('YYYY-MM-DD'),
          fecha_vencimiento: moment(res.fecha_vencimiento).format('YYYY-MM-DD'),
          fk_sector: res.mercado_id,
          fk_puesto: {
            id: res.puesto_id,
            numero: res.puesto
          }
        }
        Object.assign(this.local, obj)
      }
    )

    this.apiService.contribuyenteSelected$.subscribe(
      (res: any) => {
        this.local.fk_contribuyente = res
      }
    )

    this.apiService.feriaSelected$.subscribe(
      (feria: any) => {
        Object.assign(this.local, { feria })
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsLcomNuevoLocal",
        paramAction: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsLcomNuevoLocal",
        paramAction: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsLcomNuevoLocal",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    setTimeout(() => {
      this.cargaCatalogos()
    }, 50)
  }

  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
      case "GUARDAR":
        this.validaLocal();
        break;

      case "LIMPIAR":
        this.limpiarForm();
        break;

        case "REGRESAR":
        this.activeModal.close()
        break;

      default:
        break;
    }
  }

  async cargaCatalogos() {
    this.mensajeSpinner = 'Cargando Catalogos'
    this.lcargando.ctlSpinner(true)

    try {
      let catalogos: any = await this.apiService.getCatalogos({ params: "'REN_TIPO_NEG', 'CAT_ZONA','CAT_SECTOR', 'REN_MERCADO','REN_GRUPO_NEG','REN_ESTADO_NEG','REN_LOCAL_TIPO_NEGOCIO','REN_LOCAL_TURISTICO_CATEGORIA','REN_LOCAL_TURISTICO_CATEGORIA_2'" })
      // Zona
      catalogos.CAT_ZONA.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          codigo: elem.valor,
          nombre: elem.descripcion,
        }
        this.zonas.push({ ...obj })
      })
      // Sectores
      catalogos.CAT_SECTOR.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          grupo: elem.grupo,
          codigo: elem.valor,
          nombre: elem.descripcion,
        }
        this.sectores.push({ ...obj })
      })
      // Mercados
      catalogos.REN_MERCADO.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          nombre: elem.valor
        }
        this.mercados.push({ ...obj })
      })
      // Estados
      catalogos.REN_ESTADO_NEG.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          codigo: elem.descripcion,
          nombre: elem.valor
        }
        this.estados.push({ ...obj })
      })
      // Grupos
      catalogos.REN_GRUPO_NEG.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          nombre: elem.valor
        }
        this.grupos.push({ ...obj })
      })
      // Actividades Comerciales
      catalogos.REN_TIPO_NEG.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          nombre: elem.valor
        }
        this.actividades_comerciales.push({ ...obj })
      })
      // Tipo de Negocio
      catalogos.REN_LOCAL_TIPO_NEGOCIO.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          codigo: elem.descripcion,
          nombre: elem.valor
        }
        this.tipos_negocio.push({ ...obj })
      })
      // Local Turistico
      catalogos.REN_LOCAL_TURISTICO_CATEGORIA.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          codigo: elem.descripcion,
          nombre: elem.valor
        }
        this.cmb_lt_cat.push({ ...obj })
      })
      catalogos.REN_LOCAL_TURISTICO_CATEGORIA_2.forEach((elem: any) => {
        let obj = {
          id: elem.id_catalogo,
          grupo: elem.grupo,
          codigo: elem.descripcion,
          nombre: elem.valor
        }
        this.cmb_lt_cat_2.push({ ...obj })
      })
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Catalogos')
    }
  }

  limpiarForm() {
    this.local = {
      id_local: null,
      razon_social: null,
      tipo_local: 0,  // 0: Local Comercial, 1: Local Municipal, 2 Local Ambulante
      fk_actividad_comercial: 0,
      tipo_establecimiento: 0,
      tiene_fabrica: 0,
      tipo_negocio: 0,  // Mayorista - Minorista
      // fk_provincia: 0,
      // fk_canton: 0,
      patrimonio: parseFloat('0.00').toFixed(2),
      turismo: false,
      lt_categoria: 0,
      lt_categoria_2: 0,
      fk_zona: 0,
      fk_sector: 0,
      manzana: 0,
      solar: 0,
      fk_grupo: 0,
      fk_puesto: {
        numero: null
      },
      estado: 0,
      estado_contrato: null,
      fecha: moment().format('YYYY-MM-DD'),
      fecha_vencimiento: moment().format('YYYY-MM-DD'),
      contrato: {
        numero: null
      },
      uso_suelo: null,
    }
  }

  cambioTipoLocal(event: any) {
    // Si se intercambia el Tipo de Local (Comercial <=> Municipal), validar datos de Contrato
    if (event.id == 1) {
      // Local Comercial => Local Municipal
      // Se borra el Sector para almacenar un Mercado
      this.local.fk_sector = null
    } else if (event.id == 0 || event.id == 2) {
      // Local Municipal => Local Comercial
      // Se borra datos de Contrato y Puesto de Mercado
      this.local.fk_sector = 0
      this.local.contrato = { numero: null }
      this.local.fk_puesto = { numero: null }
      this.local.fecha_vencimiento = moment().format('YYYY-MM-DD')
    }
  }

  filterSector(event) {
    // console.log(event)
    this.local.fk_sector = 0
    this.sectores_filter = this.sectores.filter(e => e.grupo == event.codigo);
  }

  filter_cat_2(event) {
    this.local.lt_categoria_2 = 0
    this.cmb_lt_cat_2_filter = this.cmb_lt_cat_2.filter(e => e.grupo == event.codigo)
  }

  async validaLocal() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para guardar este formulario.", this.fTitle);
    } else {
      let resp = await this.validaDataLocal().then((respuesta) => {
        if (respuesta) {
          this.guardarLocal();
          // console.log(JSON.stringify({local: this.local}))
        }
      })
    }
  }

  validaDataLocal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (
        this.local.fk_contribuyente.razon_social == ''
      ) {
        this.toastr.info("Debe seleccionar un Contribuyente");
        flag = true;
      } else if (
        this.local.razon_social?.trim().length == 0 ||
        this.local.razon_social == undefined
      ) {
        this.toastr.info("Debe ingresar una razón social");
        flag = true;
      } else if (
        this.local.direccion?.trim().length == 0 ||
        this.local.direccion == undefined ||
        this.local.direccion == null
      ) {
        this.toastr.info("Debe ingresar la dirección del local");
        flag = true;
      } else  if (
        this.local.fk_actividad_comercial == 0 ||
        this.local.fk_actividad_comercial == undefined
      ) {
        this.toastr.info("Debe seleccionar una actividad comercial");
        flag = true;
      } else if (
        this.local.patrimonio == 0 ||
        this.local.patrimonio == undefined
      ) {
        this.toastr.info("Debe ingresar una cantidad para patrimonio");
        flag = true;
      } else if (
        this.local.tipo_negocio == 0 ||
        this.local.tipo_negocio == undefined
      ) {
        this.toastr.info("Debe seleccionar un tipo de negocio");
        flag = true;
      } else if (
        (this.local.tipo_local == 0 || this.local.tipo_local == 2) &&
        (this.local.fk_grupo == 0 ||
          this.local.fk_grupo == undefined)
      ) {
        this.toastr.info("Debe seleccionar un grupo para local comercial");
        flag = true;
      } /*else if (
        (this.local.fk_provincia==0 ||
        this.local.fk_provincia==undefined)
      ) {
        this.toastr.info("Debe seleccionar una provincia para local comercial");
        flag = true;
      } else if (
        (this.local.fk_canton==0 ||
        this.local.fk_canton==undefined)
      ) {
        this.toastr.info("Debe seleccionar un canton para local comercial");
        flag = true;
      } */else if (
        (this.local.tipo_local == 0 || this.local.tipo_local == 2) &&
        (this.local.fk_zona == 0 ||
          this.local.fk_zona == undefined)
      ) {
        this.toastr.info("Debe seleccionar una zona para local comercial");
        flag = true;
      } else if (
        (this.local.tipo_local == 0 || this.local.tipo_local == 2) &&
        (this.local.fk_sector == 0 ||
          this.local.fk_sector == undefined)
      ) {
        this.toastr.info("Debe seleccionar un sector para local comercial");
        flag = true;
      } else if (
        this.local.estado == 0 ||
        this.local.estado == undefined
      ) {
        this.toastr.info("Debe seleccionar un estado");
        flag = true;
      } else if (
        (this.local.tipo_local == 1) &&
        (!this.local.contrato.numero ||
          this.local.contrato.numero == null ||
          this.local.contrato.numero == undefined)
      ) {
        this.toastr.info("Debe seleccionar un contrato para local municipal");
        flag = true;
      } else if (this.local.tipo_local == 3 && (this.local.feria == undefined || this.local.feria == null)) {
        this.toastr.info("No ha seleccionado una Feria")
        flag = true
      }
      !flag ? resolve(true) : resolve(false);
    })
  }

  async guardarLocal() {
    let result = await Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo local?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    })

    if (result.isConfirmed) {
      // this.local['fk_contribuyente'] = { id_cliente: this.contribuyente.id_cliente }
      this.mensajeSpinner = 'Almacenando Nuevo Local'
      this.lcargando.ctlSpinner(true)

      // console.log({local: this.local});
      // return;

      this.apiService.setLocal({ local: this.local }).subscribe(
        (res: any) => {
          // console.log(res.data)

          this.lcargando.ctlSpinner(false)
          this.commonVarService.setNuevoLocal.next(null)

          Swal.fire({
            icon: 'success',
            title: this.fTitle,
            html: `Local Comercial creado`
          }).then(() => this.activeModal.close())
        },
        (err: any) => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error registrando Local Comercial')
        }
      )
    }
  }

  buscarContrato() {
    const modal = this.modalService.open(ModalBusqContratoComponent, {
      size: 'xl',
      backdrop: 'static',
      windowClass: 'viewer-content-general'
    })
    modal.componentInstance.contribuyente = this.local.fk_contribuyente
  }

  filtrarCantones(event) {
    this.local.fk_canton = 0
    this.local.fk_sector = 0
    this.cantones_filter = this.cantones.filter(e => e.provincia == event.nombre)
  }

  expandContribuyente() {
    const modal = this.modalService.open(ModalContribuyentesComponent, {
      size: 'xl',
      backdrop: 'static',
      windowClass: "viewer-content-general",
    })
  }

  expandFerias() {
    const modal = this.modalService.open(ModalFeriasComponent, {size: 'xl', backdrop: 'static'})
    modal.componentInstance.id_cliente = this.local.fk_contribuyente.id_cliente
  }

  handleLabelCantidad(event: any) {
    // console.log(event)
    switch (event.grupo) {
      case "AGENCIA":
        this.lblCantidad = "No. Establecimientos"
        this.local.lt_cantidad = 1
        break;
      case "ALOJAMIENTO":
        this.lblCantidad = "No. Habitaciones"
        this.local.lt_cantidad = 0
        break;
      case "COMIDAS":
        this.lblCantidad = "No. Mesas"
        this.local.lt_cantidad = 0
        break;
      case "RECREACION":
        this.lblCantidad = "No. Mesas"
        this.local.lt_cantidad = 0
        break;
      case "RECREACIONTURISTICA":
        this.lblCantidad = "Cantidad"
        this.local.lt_cantidad = 1
        break;
      case "TRANSPORTEMARITIMO":
        this.lblCantidad = "Cantidad"
        this.local.lt_cantidad = 1
        break;
      case "TRANSPORTETERRESTRE":
        this.lblCantidad = "No. Vehículos"
        this.local.lt_cantidad = 1
        break;
      default:
        break;
    }
    // Modifica el label de Cantidad
  }

}
