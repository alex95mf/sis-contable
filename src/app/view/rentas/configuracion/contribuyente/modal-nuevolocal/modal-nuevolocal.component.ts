import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

// import { InspeccionService } from '../inspeccion.service';

import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
// import { ModalBusqContratoComponent } from '../modal-busq-contrato/modal-busq-contrato.component';
import { ContribuyenteService } from '../contribuyente.service';

@Component({
standalone: false,
  selector: 'app-modal-nuevolocal',
  templateUrl: './modal-nuevolocal.component.html',
  styleUrls: ['./modal-nuevolocal.component.scss']
})
export class ModalNuevolocalComponent implements OnInit {
  @Input() contribuyente: any;
  @Input() nuevo: boolean = true;
  @Input() id_local;
  @Input() permissions: any;
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle: string = 'Nuevo Local'
  mensajeSpinner: string
  vmButtons: any[] = []

  tipos_negocio: any[] = []
  sectores: any[] = []  // Cargar los sectores desde Catalogo
  mercados: any[] = []
  grupos: any[] = []
  estados: any[] = []
  actividades_comerciales: any[] = []

  local: any = {
    id_local: null,
    razon_social: null,
    tipo_local: false,  // False: Local Comercial, True: Local Municipal
    fk_actividad_comercial: null,
    tipo_negocio: null,  // Mayorista - Minorista
    fk_sector: null,
    fk_grupo: null,
    fk_puesto: {
      numero: null
    },
    estado: null,
    estado_contrato: null,
    fecha: moment().format('YYYY-MM-DD'),
    fecha_vencimiento: moment().format('YYYY-MM-DD'),
    contrato: {
      numero: null
    }
  }

  constructor(
    private apiService: ContribuyenteService,
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
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsLcomNuevoLocal",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    setTimeout(() => {
      // this.cargaTipoNegocio()
      this.handleLoad().then(
        (res: any) => {
          if (res && !this.nuevo) {
            this.fTitle = 'Actualizar Local';
            (this as any).mensajeSpinner = 'Cargando datos de Local'
            this.lcargando.ctlSpinner(true);
            this.apiService.getLocal({ local: this.id_local }).subscribe(
              (res: any) => {
                this.lcargando.ctlSpinner(false)
                // console.log(res)
                this.local = {
                  id_local: res.data.id_local,
                  razon_social: res.data.razon_social,
                  tipo_local: res.data.tipo_local,  // False: Local Comercial, True: Local Municipal
                  fk_actividad_comercial: res.data.fk_actividad_comercial,
                  tipo_negocio: res.data.tipo_negocio.descripcion,  // Mayorista - Minorista
                  fk_sector: (res.data.tipo_local == 0) ? res.data.fk_sector : res.data.fk_contrato.fk_mercado.id_catalogo,
                  fk_grupo: (res.data.tipo_local == 0) ? res.data.fk_grupo : null,
                  fk_puesto: {
                    id: (res.data.tipo_local == 1) ? res.data.fk_contrato.fk_mercado_puesto.id_mercado_puesto : null,
                    numero: (res.data.tipo_local == 1) ? res.data.fk_contrato.fk_mercado_puesto.numero_puesto : null
                  },
                  contrato: {
                    id: (res.data.tipo_local == 1) ? res.data.fk_contrato.id_mercado_contrato : null,
                    numero: (res.data.tipo_local == 1) ? res.data.fk_contrato.numero_contrato : null,
                  },
                  estado: res.data.estado,
                  fecha: moment(res.data.fecha).format('YYYY-MM-DD'),
                  fecha_vencimiento: (res.data.tipo_local == 1) ? moment(res.data.vencimiento_contrato).format('YYYY-MM-DD') : null,
                }
              },
              (err: any) => {
                console.log(err)
                this.lcargando.ctlSpinner(false)
                this.toastr.error(err.error.message, 'Error cargando Local')
              }
            )
          }
        }
      )
    }, 50)
  }

  handleLoad() {
    // Nos aseguramos que se carguen los catalogos antes de realizar cualquier cosa
    return new Promise((resolve, reject) => {
      // (this as any).mensajeSpinner = 'Cargando Catalogos'
      // this.lcargando.ctlSpinner(true);
      this.apiService.getCatalogos({ params: "'REN_TIPO_NEG','CAT_SECTOR', 'REN_MERCADO','REN_GRUPO_NEG','REN_ESTADO_NEG','REN_LOCAL_TIPO_NEGOCIO'" }).subscribe(
        (res: any) => {
          // console.log(res)
          // Sectores
          res.data.CAT_SECTOR.forEach((elem: any) => {
            let obj = {
              id: elem.id_catalogo,
              codigo: elem.valor,
              nombre: elem.descripcion
            }
            this.sectores.push({ ...obj })
          })

          res.data.REN_MERCADO.forEach((elem: any) => {
            let obj = {
              id: elem.id_catalogo,
              nombre: elem.valor
            }
            this.mercados.push({ ...obj })
          })
          // Estados
          res.data.REN_ESTADO_NEG.forEach((elem: any) => {
            let obj = {
              id: elem.id_catalogo,
              codigo: elem.descripcion,
              nombre: elem.valor
            }
            this.estados.push({ ...obj })
          })
          // Grupos
          res.data.REN_GRUPO_NEG.forEach((elem: any) => {
            let obj = {
              id: elem.id_catalogo,
              nombre: elem.valor
            }
            this.grupos.push({ ...obj })
          })
          // Actividades Comerciales
          res.data.REN_TIPO_NEG.forEach((elem: any) => {
            let obj = {
              id: elem.id_catalogo,
              nombre: elem.valor
            }
            this.actividades_comerciales.push({ ...obj })
          })
          // Tipo de Negocio
          res.data.REN_LOCAL_TIPO_NEGOCIO.forEach((elem: any) => {
            let obj = {
              id: elem.id_catalogo,
              codigo: elem.descripcion,
              nombre: elem.valor
            }
            this.tipos_negocio.push({ ...obj })
          })
          // this.lcargando.ctlSpinner(false)
          resolve(true)
        },
        (err: any) => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error cargando Catalogos')
          resolve(false)
        }
      )
    })
  }

  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
      
      case " REGRESAR":
        this.activeModal.close()
        break;

      default:
        break;
    }
  }

  // async validaLocal() {
  //   if(this.permissions.guardar=="0"){
  //     this.toastr.warning("No tiene permisos para guardar este formulario.", this.fTitle);
  //   } else {
  //     let resp = await this.validaDataLocal().then((respuesta)=>{
  //       if (respuesta) {
  //         this.guardarLocal();
  //       }
  //     })
  //   }
  // }

  cambioTipoLocal(event: any) {
    // Si se intercambia el Tipo de Local (Comercial <=> Municipal), validar datos de Contrato
    if (event.checked) {
      // Local Comercial => Local Municipal
      // Se borra el Sector para almacenar un Mercado
      this.local.fk_sector = null
    } else {
      // Local Municipal => Local Comercial
      // Se borra datos de Contrato y Puesto de Mercado
      this.local.fk_sector = null
      this.local.contrato = { numero: null }
      this.local.fk_puesto = { numero: null }
      this.local.fecha_vencimiento = null
    }
  }

  validaDataLocal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if(
        this.local.razon_social=="" ||
        this.local.razon_social==undefined
      ) {
        this.toastr.info("Debe ingresar una razón social");
        flag = true;
      } else if(
        this.local.fk_actividad_comercial==0 ||
        this.local.fk_actividad_comercial==undefined
      ) {
        this.toastr.info("Debe seleccionar una actividad comercial");
        flag = true;
      } else if (
        this.local.tipo_negocio==0 ||
        this.local.tipo_negocio==undefined
      ) {
        this.toastr.info("Debe seleccionar un tipo de negocio");
        flag = true;
      } else if (
        (!this.local.tipo_local) &&
        (this.local.fk_grupo==0 ||
        this.local.fk_grupo==undefined)
      ) {
        this.toastr.info("Debe seleccionar un grupo para local comercial");
        flag = true;
      } else if (
        (!this.local.tipo_local) &&
        (this.local.fk_sector==0 ||
        this.local.fk_sector==undefined)
      ) {
        this.toastr.info("Debe seleccionar un sector para local comercial");
        flag = true;
      } else if (
        this.local.estado==0 ||
        this.local.estado==undefined
      ) {
        this.toastr.info("Debe seleccionar un estado");
        flag = true;
      } else if (
        (this.local.tipo_local) &&
        (!this.local.contrato.numero ||
        this.local.contrato.numero==undefined)
      ) {
        this.toastr.info("Debe seleccionar un contrato para local municipal");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    })
  }

  // guardarLocal() {
  //   if (this.local.id_local == null) {
  //     // Almanenar el local en la base de datos
  //     this.local['fk_contribuyente'] = { id_cliente: this.contribuyente.id_cliente }
  //     (this as any).mensajeSpinner = 'Almacenando Nuevo Local'
  //     this.lcargando.ctlSpinner(true);
  //     this.apiService.setLocal({ local: this.local }).subscribe(
  //       res => {
  //         // console.log(res)
  //         this.lcargando.ctlSpinner(false)
  //         this.commonVarService.setNuevoLocal.next(res['data'])
  //         this.activeModal.close()
  //       },
  //       err => {
  //         this.lcargando.ctlSpinner(false)
  //         console.log(err)
  //         this.toastr.error(err.error.message, 'Error almacenando Nuevo Local')
  //       }
  //     )
  //   } else {
  //     this.local['fk_contribuyente'] = { id_cliente: this.contribuyente.id_cliente }
  //     (this as any).mensajeSpinner = 'Actualizando Local'
  //     this.lcargando.ctlSpinner(true);
  //     this.apiService.actualizarLocal({ local: this.local }, this.local.id_local).subscribe(
  //       res => {
  //         // console.log(res)
  //         this.lcargando.ctlSpinner(false)
  //         this.commonVarService.setActualizarLocal.next(res['data'])
  //         this.activeModal.close()
  //       },
  //       err => {
  //         this.lcargando.ctlSpinner(false)
  //         console.log(err)
  //         this.toastr.error(err.error.message, 'Error almacenando Nuevo Local')
  //       }
  //     )
  //   }
  // }

  // buscarContrato() {
  //   const modal = this.modalService.open(ModalBusqContratoComponent, { size: 'xl', backdrop: 'static', windowClass: 'viewer-content-general' })
  //   modal.componentInstance.contribuyente = this.contribuyente
  // }

}
