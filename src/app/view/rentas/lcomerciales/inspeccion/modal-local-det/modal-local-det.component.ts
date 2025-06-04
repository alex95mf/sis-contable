import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import * as moment from 'moment'
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from "src/app/services/common-var.services";
import { InspeccionService } from '../inspeccion.service';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ModalBusqContratoComponent } from '../modal-busq-contrato/modal-busq-contrato.component';

@Component({
standalone: false,
  selector: 'app-modal-local-det',
  templateUrl: './modal-local-det.component.html',
  styleUrls: ['./modal-local-det.component.scss']
})
export class ModalLocalDetComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() local_id: any
  @Input() contribuyente: any
  validaciones = new ValidacionesFactory();

  fTitle: string = "Detalles de Local"
  mensajeSpinner: string
  vmButtons: any[]

  cmb_activ_comer: any[] = []
  cmb_grupo: any[] = []
  cmb_tipo_negocio: any[] = []
  cmb_zona: any[] = []
  cmb_sector: any[] = []
  cmb_sector_filter: any[] = []
  cmb_mercado: any[] = []
  cmb_turistico_categoria: any[] = []
  cmb_turistico_subcategoria: any[] = []
  cmb_turistico_subcategoria_filter: any[] = []
  cmb_tipo_estable = [
    { value: "MA", label: "MATRIZ" },
    { value: "SU", label: "SUCURSAL" }
  ]
  cmb_tiene_fabrica = ['S', 'N']
  cmb_tipo_local: any[] = [
    { id: 0, value: 'Local Comercial' },
    { id: 1, value: 'Local Municipal' },
    { id: 2, value: 'No Físico' },
  ]
  lblCantidad: string = 'Cantidad'
  estados: any[] = []

  local: any = {
    razon_social: null,
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    fk_actividad_comercial: 0,
    fk_grupo: 0,
    direccion: null,
    tipo_establecimiento: 0,
    tiene_fabrica: 0,
    tipo_negocio: 0,
    estado: null,
    zona: 0,
    uso_suelo: null,
    // fk_provincia: null,
    // fk_canton: null,
    fk_zona: 0,
    fk_sector: 0,
    manzana: null,
    solar: null,
    catastro: null,
    mercado: 0,
    piso: null,
    bloque: null,
    fk_puesto: { id: null, numero: null },
    tipo_local: 0,  // 0 = Local Comercial, 1 = Local Municipal, 2 = Local Ambulante
    i_pym: false,  // Pesa y Medida
    i_turistico: false,  // Local Turistico
    i_vpublica: false,  // Via Publica
    i_capmin: false,  // Uso Cap Min
    lt_categoria: { descripcion: 0 },  // Local Turistico
    lt_categoria_2: { descripcion: 0 },  // Local Turistico
    lt_cantidad: 0,
    letreros: [],
    via_publica: [],
    balanzas: null
  }



  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private apiService: InspeccionService,
    private toastr: ToastrService,
    private commonVarService: CommonVarService,
  ) { }

  ngOnInit(): void {
    // console.log(this.local_id);
    this.vmButtons = [
      {
        orig: "btnsModalLocalDet",
        paramAction: "",
        boton: { icon: "fas fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsModalLocalDet",
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
      this.getCatalogos()
    }, 50)
  }

  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close()
        break;

      case "GUARDAR":
        Swal.fire({
          icon: "warning",
          title: this.fTitle,
          text: "¿Seguro que desea actualizar este local?",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          cancelButtonColor: '#F86C6B',
          confirmButtonColor: '#4DBD74',
        }).then((result) => {
          if (result.isConfirmed) {
            // this.local['fk_contribuyente'] = { id_cliente: this.contribuyente.id_cliente }
            this.local.lt_categoria = this.local.local_turistico ? this.cmb_turistico_categoria.find(e => e.descripcion == this.local.lt_categoria.descripcion) : { descripcion: 0 }
            this.local.lt_categoria_2 = this.local.local_turistico ? this.cmb_turistico_subcategoria.find(e => e.descripcion == this.local.lt_categoria_2.descripcion) : { descripcion: 0 }
            this.mensajeSpinner = 'Actualizando Local'
            this.lcargando.ctlSpinner(true);

            // console.log({ local: this.local });
            // return;

            this.apiService.actualizarLocal({ local: this.local }).subscribe(
              (res: any) => {
                console.log(res.data)
                this.lcargando.ctlSpinner(false)
                this.commonVarService.setActualizarLocal.next(res['data'])

                Swal.fire({
                  icon: "success",
                  title: "Local Actualizado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.activeModal.close()
                  }
                });
              },
              (err: any) => {
                console.log(err)
                this.lcargando.ctlSpinner(false)
                this.toastr.error(err.error.message, 'Error actualizando Local')
              }
            )
          }
        });
        break;

      default:
        break;
    }
  }

  async getCatalogos() {
    this.mensajeSpinner = 'Cargando Catalogos'
    this.lcargando.ctlSpinner(true)
    try {
      //
      let data = {
        params: "'REN_TIPO_NEG','CAT_SECTOR','CAT_ZONA','REN_MERCADO','REN_GRUPO_NEG', 'REN_ESTADO_NEG','REN_LOCAL_TIPO_NEGOCIO','REN_LOCAL_TURISTICO_CATEGORIA','REN_LOCAL_TURISTICO_CATEGORIA_2'"
      }

      let catalogos = await this.apiService.getCatalogos(data)

      // Zona
      catalogos['CAT_ZONA'].forEach((element: any) => {
        let o = {
          id: element.id_catalogo,
          codigo: element.valor,
          nombre: element.descripcion
        }
        this.cmb_zona.push(o)
      })
      // Sector
      catalogos.CAT_SECTOR.forEach((element: any) => {
        let o = {
          id: element.id_catalogo,
          grupo: element.grupo,
          codigo: element.valor,
          nombre: element.descripcion
        }
        this.cmb_sector.push({ ...o })
      })
      // Grupo
      catalogos.REN_GRUPO_NEG.forEach((element: any) => {
        let o = {
          id: element.id_catalogo,
          codigo: element.valor,
          nombre: element.descripcion
        }
        this.cmb_grupo.push({ ...o })
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
      // Actividad Comercial
      catalogos.REN_TIPO_NEG.forEach((element: any) => {
        let o = {
          id: element.id_catalogo,
          codigo: element.valor,
          nombre: element.descripcion
        }
        this.cmb_activ_comer.push({ ...o })
      })
      // Mercado
      catalogos.REN_MERCADO.forEach((element: any) => {
        let o = {
          id: element.id_catalogo,
          codigo: element.valor,
          nombre: element.descripcion
        }
        this.cmb_mercado.push({ ...o })
      })
      // Tipo de Local
      catalogos.REN_LOCAL_TIPO_NEGOCIO.forEach((element: any) => {
        let o = {
          id: element.id_catalogo,
          codigo: element.valor,
          nombre: element.descripcion
        }
        this.cmb_tipo_negocio.push({ ...o })
      })
      // Locales Turisticos - Categorias
      catalogos.REN_LOCAL_TURISTICO_CATEGORIA.forEach((element: any) => {
        let o = {
          id: element.id_catalogo,
          valor: element.valor,
          descripcion: element.descripcion
        }
        this.cmb_turistico_categoria.push({ ...o })
      })
      catalogos.REN_LOCAL_TURISTICO_CATEGORIA_2.forEach((element: any) => {
        let o = {
          id: element.id_catalogo,
          grupo: element.grupo,
          valor: element.valor,
          descripcion: element.descripcion
        }
        this.cmb_turistico_subcategoria.push({ ...o })
        this.cmb_turistico_subcategoria_filter.push({ ...o })
      })

      setTimeout(() => { this.getLocal() }, 50)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Catalogos')
    }
  }

  getLocal() {
    this.mensajeSpinner = 'Cargando datos de Local'
    this.lcargando.ctlSpinner(true)
    this.apiService.getLocal({ local: this.local_id }).subscribe(
      (res: any) => {
        console.log(res.data)

        this.local = res.data
        Object.assign(this.local, {
          fecha: moment(res.data.fecha).format('YYYY-MM-DD'),
          fk_grupo: res.data.fk_grupo ?? { id_catalogo: null },

          fk_zona: res.data.fk_zona ? res.data.fk_zona : { valor: 0 },
          fk_sector: res.data.fk_sector ? res.data.fk_sector : { valor: 0 },

          local_turistico: (res.data.local_turistico) ? res.data.local_turistico : false,
          lt_categoria: (res.data.local_turistico) ? res.data.lt_categoria : { descripcion: 0 },
          lt_categoria_2: (res.data.local_turistico) ? res.data.lt_categoria_2 : { descripcion: 0 },

          created_at: moment(res.data.created_at).format('YYYY-MM-DD'),
        })
        this.handleLabelCantidad(res.data.lt_categoria)

        this.cmb_sector_filter = this.cmb_sector.filter(e => e.grupo == res.data.fk_zona.valor)
        this.cmb_turistico_subcategoria_filter = this.cmb_turistico_subcategoria.filter(e => e.grupo == res.data.lt_categoria.descripcion)
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Local')
      }
    )
  }

  expandContratos(contribuyente) {
    const modalContrato = this.modalService.open(ModalBusqContratoComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
    modalContrato.componentInstance.contribuyente = contribuyente
  }

  filter_cat_2(event) {
    // console.log(event)
    this.local.lt_categoria_2 = { descripcion: 0 }
    this.cmb_turistico_subcategoria_filter = this.cmb_turistico_subcategoria.filter(e => e.grupo == event)
    this.handleLabelCantidad(event)
  }

  filter_sector(event) {
    // console.log(event)
    this.local.fk_sector = { valor: 0 }
    this.cmb_sector_filter = this.cmb_sector.filter(e => e.grupo == event)
  }

  handleLabelCantidad(event: any) {
    switch (event) {
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
