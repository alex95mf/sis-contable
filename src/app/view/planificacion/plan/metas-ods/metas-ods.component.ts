import { Component, OnInit, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';

import { MetasOdsService } from './metas-ods.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetaViewComponent } from './meta-view/meta-view.component';

@Component({
standalone: false,
  selector: 'app-metas-ods',
  templateUrl: './metas-ods.component.html',
  styleUrls: ['./metas-ods.component.scss']
})
export class MetasOdsComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle = 'Asignacion de Objetivos y Componentes'
  mensajeSpinner: string
  vmButtons: any;

  dataUser: any
  permissions: any

  programas = []  // Datos a presentar en la tabla y el ComobBox
  cmb = {
    ods: [],
    metaods: [],
    eje: [],
    opg: [],
    ppg: [],
    meta: [],
    comp_gad: [],
    obj_pdot: [],
    meta_resultado: [],
    indicador: [],
    tendencia: [],
    intervencion: []
  }

  seleccion: any = {
    id: 0,  // id_programa
    ods: 0,
    meta_ods: 0,
    eje: 0,
    opg: 0,
    ppg: 0,
    metaZonal: 0,
    competencia: 0,
    oe: 0,
    metaResultado: 0,
    indicador: 0,
    tendencia: 0,
    intervencion: 0
  }

  constructor(
    private metasService: MetasOdsService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      // Guardar
      { orig: "metas_estra", paramAccion: "", boton: { icon: "fas fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false },
      // Cancelar
      { orig: "metas_estra", paramAccion: "", boton: { icon: "fas fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false },

    ]
    setTimeout(() => {
      this.validaPermisos();
    }, 50);

  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.guardaMetas()
        break;
      case "CANCELAR":
        this.limpiarPantalla()
        break;
    }
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fProgMetas,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true);
    this.commonServices.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          setTimeout(() => {
            this.vmButtons[0].habilitar = false
            this.cargaProgramas();
          }, 250)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  cargaProgramas() {
    (this as any).mensajeSpinner = 'Cargando Programas'

    this.lcargando.ctlSpinner(true);
    this.metasService.getProgramas().subscribe(
      res => {
        res['data'].forEach(r => {
          let programa = {
            id: r.id_catalogo,
            nombre: r.valor,
            meta: null,
            ods: { id: null, nombre: '' },
            meta_ods: { id:null, nombre: '' },
            eje: { id: null, nombre: '' },
            opg: { id: null, nombre: '' },
            ppg: { id: null, nombre: '' },
            metaZonal: { id: null, nombre: '' },
            competencia: { id: null, nombre: '' },
            oe: { id: null, nombre: '' },
            metaResultado: { id: null, nombre: '' },
            indicador: { id: null, nombre: '' },
            tendencia: { id: null, nombre: '' },
            intervencion: { id: null, nombre: '' }
          }
          this.programas.push(programa);
        })
        this.cargaODS()
        // this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error Cargando Programas')
      }
    )
  }

  cargaODS() {
    /**
     * Carga la lista de ODS
     */
    (this as any).mensajeSpinner = 'Cargando ODS'
    this.metasService.getODS().subscribe(
      res => {
        res['data'].forEach(ods => {
          let obj = {
            id: ods.id_catalogo,
            nombre: ods.descripcion
          }
          this.cmb.ods.push({...obj});
        })
        // this.lcargando.ctlSpinner(false)
        this.cargarCatalogos()
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando ODS')
      }
    )
  }

  cargaEje(event) {
    this.cmb.eje = []
    this.seleccion.eje = 0
    let data = {
      "ods": event
    }
    (this as any).mensajeSpinner = 'Cargando Ejes'

    this.lcargando.ctlSpinner(true);
    this.metasService.getEje(data).subscribe(
      res => {
        res['data'][0]['ejes'].forEach(eje => {
          let obj = {
            id: eje.id_catalogo,
            nombre: eje.descripcion,
            valor: eje.valor
          }
          this.cmb.eje.push({...obj})
        })
        setTimeout(() => {
          this.lcargando.ctlSpinner(false)
        }, 250)
       
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Ejes')
      }
    )
  }

  cargaMetaODS(event) {
    this.cmb.metaods = []
    this.seleccion.meta_ods = 0
    let data = {
      "ods": event
    }
    (this as any).mensajeSpinner = 'Cargado Metas para ODS'
    
    this.lcargando.ctlSpinner(true);
    this.metasService.getMetasODS(data).subscribe(
      res => {
        res['data'].forEach(m => {
          let obj = {
            id: m.id_catalogo,
            nombre: m.descripcion
          }
          this.cmb.metaods.push({...obj})
        })
        this.lcargando.ctlSpinner(false)
        this.cargaEje(event)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Metas para ODS')
      }
    )
  }

  cargaOPG(event) {
    this.cmb.opg = []
    this.seleccion.opg = 0
    let data = {
      'eje': event
    }
    (this as any).mensajeSpinner = 'Cargado OPG'
    
    this.lcargando.ctlSpinner(true);
    this.metasService.getOPG(data).subscribe(
      res => {
        res['data'].forEach(o => {
          let obj = {
            id: o.id_catalogo,
            valor: o.valor,
            nombre: o.descripcion
          }
          this.cmb.opg.push({...obj})
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando OPG')
      }
    )
  }

  cargaPPG(event) {
    this.cmb.ppg = []
    this.seleccion.ppg = 0
    (this as any).mensajeSpinner = 'Cargando Politicas'
    let data = {
      "opg": event
    }

    this.lcargando.ctlSpinner(true);
    this.metasService.getPoliticas(data).subscribe(
      res => {
        // console.log(res)
        res['data'].forEach(p => {
          let obj = {
            id: p.id_catalogo,
            valor: p.valor,
            nombre: p.descripcion
          }
          this.cmb.ppg.push({...obj})
          this.lcargando.ctlSpinner(false)
        })
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Politicas')
      }
    )
  }

  cargaMetaZonal(event) {
    this.cmb.meta = []
    this.seleccion.metaZonal = 0
    (this as any).mensajeSpinner = 'Cargando Metas para la Zona'
    let data = {
      "politica": event
    }

    this.lcargando.ctlSpinner(true);
    this.metasService.getMetaZona(data).subscribe(
      res => {
        // console.log(res)
        res['data'].forEach(p => {
          let obj = {
            id: p.id_catalogo,
            nombre: p.descripcion
          }
          this.cmb.meta.push({...obj})
          this.lcargando.ctlSpinner(false)
        })
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Politicas')
      }
    )
  }

  cargarCatalogos() {
    /**
     * Carga los dropdown con los items respectivos
     */
    (this as any).mensajeSpinner = 'Cargando Catalogos'
    let data = {
      params: "'PLA_COMPETENCIA','PLA_OE','PLA_META_RESULTADO',\
      'PLA_INDICADOR','PLA_TENDENCIA','PLA_TIPO_INTERVENCION'"
    };
    // this.lcargando.ctlSpinner(true);
    this.metasService.getCatalogs(data).subscribe(
      res => {
        // Cargar CMBs
        
        res['data']['PLA_COMPETENCIA'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          }
          this.cmb.comp_gad.push(obj);
        })
        res['data']['PLA_OE'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          }
          this.cmb.obj_pdot.push(obj);
        })
        res['data']['PLA_META_RESULTADO'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          }
          this.cmb.meta_resultado.push(obj);
        })
        res['data']['PLA_INDICADOR'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          }
          this.cmb.indicador.push(obj);
        })
        res['data']['PLA_TENDENCIA'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          }
          this.cmb.tendencia.push(obj);
        })
        res['data']['PLA_TIPO_INTERVENCION'].forEach(ond => {
          let obj = {
            id: ond.id_catalogo,
            nombre: ond.valor
          }
          this.cmb.intervencion.push(obj);
        })
        this.obtenerMetas()
        // this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }

  obtenerMetas() {
    /**
     * Si hay metas existentes en la tabla, cargarlas.
     */
    (this as any).mensajeSpinner = 'Obteniendo Metas'
    let data = {
      params: this.programas
    }

    this.metasService.obtenerMetas(data).subscribe(
      res => {
        // console.log(res['data'])
        if (res['data'].length > 0) {
          res['data'].forEach(m => {
            // console.log(m)
            let meta = {
              meta: m.id !== null ? m.id : null,
              ods: m.ods !== null ? { id: m.ods.id_catalogo, nombre: m.ods.descripcion } : { id: null, nombre: '' },
              meta_ods: m.meta_ods !== null ? { id: m.meta_ods.id_catalogo, nombre: m.meta_ods.descripcion } : { id: null, nombre: '' },
              eje: m.eje !== null ? { id: m.eje.id_catalogo, nombre: m.eje.descripcion } : { id: null, nombre: '' },
              opg: m.opg !== null ? { id: m.opg.id_catalogo, nombre: m.opg.descripcion } : { id: null, nombre: '' },
              ppg: m.ppg !== null ? { id: m.ppg.id_catalogo, nombre: m.ppg.descripcion } : { id: null, nombre: '' },
              metaZonal: m.meta_zonal !== null ? { id: m.meta_zonal.id_catalogo, nombre: m.meta_zonal.descripcion } : { id: null, nombre: '' },
              competencia: m.competencia !== null ? { id: m.competencia.id_catalogo, nombre: m.competencia.valor } : { id: null, nombre: '' },
              oe: m.oe !== null ? { id: m.oe.id_catalogo, nombre: m.oe.valor } : { id: null, nombre: '' },
              metaResultado: m.meta_resultado !== null ? { id: m.meta_resultado.id_catalogo, nombre: m.meta_resultado.valor } : { id: null, nombre: '' },
              indicador: m.indicador !== null ? { id: m.indicador.id_catalogo, nombre: m.indicador.valor } : { id: null, nombre: '' },
              tendencia: m.tendencia !== null ? { id: m.tendencia.id_catalogo, nombre: m.tendencia.valor } : { id: null, nombre: '' },
              intervencion: m.intervencion !== null ? { id: m.intervencion.id_catalogo, nombre: m.intervencion.valor } : { id: null, nombre: '' },
            }
            Object.assign(this.programas.find(p => p.id == m.programa.id_catalogo), meta)
          })
          this.lcargando.ctlSpinner(false)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error obteniendo Metas de Programas')
      }
    )
  }

  asignarMetas() {
    // TODO: Validar que un programa haya sido seleccionado
    if (this.seleccion.id == 0) {
      Swal.fire({
        title: this.fTitle,
        text: 'No ha seleccionado un Programa',
        icon: 'warning'
      })
      return
    }

    // TODO: Validar que ninguna propiedad de seleccion este vacio
    const vacio = (elem) => console.log(elem)
    if (
      this.seleccion.ods == 0 || this.seleccion.meta_ods == 0 || this.seleccion.eje == 0 ||
      this.seleccion.opg == 0 || this.seleccion.ppg == 0 || this.seleccion.metaZonal == 0 ||
      this.seleccion.competencia == 0 || this.seleccion.oe == 0 || this.seleccion.metaResultado == 0 ||
      this.seleccion.indicador == 0 || this.seleccion.tendencia == 0 || this.seleccion.intervencion == 0
    ) {
      Swal.fire({
        title: this.fTitle,
        text: 'Existe un campo sin seleccionar, verifique!',
        icon: 'warning'
      })
      return
    }

    Object.assign(this.programas.find(p => p.id == this.seleccion.id), this.seleccion)
    this.limpiarPantalla()
  }

  guardaMetas() {
    /**
     * Guarda las metas por Programa
     */
    if (this.permissions.guardar == '0') {
      this.toastr.warning('No tiene permisos para usar este recurso', this.fTitle)
      return
    } else {
      // TODO: Validar que todos los programas tengan Objetivos y Componentes
      let data = {
        accion: 'ASIGNAR METAS A PROGRAMAS',
        ip: this.commonServices.getIpAddress(),
        id_controlador: myVarGlobals.fProgMetas,

        params: this.programas
      }
      // console.log(data)
      (this as any).mensajeSpinner = 'Guardando Metas por Programa'

      this.lcargando.ctlSpinner(true);
      this.metasService.guardaMetas(data).subscribe(
        res => {
          // console.log(data)
          this.lcargando.ctlSpinner(false)
          Swal.fire({
            title: this.fTitle,
            text: res['data'],
            icon: 'success'
          })
        },
        err => {
          this.lcargando.ctlSpinner(false)
          // console.log(err);
          this.toastr.error(err.error.message, 'Error guardando Metas por Programa')
        }
      )
    }

  }

  limpiarPantalla() {
    this.seleccion = {
      id: 0,  // id_programa
      ods: 0,
      meta_ods: 0,
      eje: 0,
      opg: 0,
      ppg: 0,
      metaZonal: 0,
      competencia: 0,
      oe: 0,
      metaResultado: 0,
      indicador: 0,
      tendencia: 0,
      intervencion: 0
    }
  }

  limpiar(elem) {
    if (this.permissions.editar == 0) {
      this.toastr.warning('No tiene permisos para actualizar', this.fTitle)
      return
    }

    Swal.fire({
      title: this.fTitle,
      text: 'Seguro desea borrar las metas del Programa?',
      icon: 'question',
      showDenyButton: true
    }).then(
      res => {
        if (res.value) {
          (this as any).mensajeSpinner = 'Borrando datos'
          // Borra los datos cargados
          let empty = {
            ods: { id: null, nombre: '' },
            meta_ods: { id: null, nombre: '' },
            eje: { id: null, nombre: '' },
            opg: { id: null, nombre: '' },
            ppg: { id: null, nombre: '' },
            metaZonal: { id: null, nombre: '' },
            competencia: { id: null, nombre: '' },
            oe: { id: null, nombre: '' },
            metaResultado: { id: null, nombre: '' },
            indicador: { id: null, nombre: '' },
            tendencia: { id: null, nombre: '' },
            intervencion: { id: null, nombre: '' }
          }
          Object.assign(elem, empty)

          // Borra los datos en la base
          if (elem.meta !== 0) {
            let data = {
              accion: 'ELIMINACION DE METAS',
              ip: this.commonServices.getIpAddress(),
              id_controlador: myVarGlobals.fProgMetas,
              params: [elem]
            }
            this.lcargando.ctlSpinner(true);
            this.metasService.guardaMetas(data).subscribe(
              res => {
                // console.log(res['data'])
                this.lcargando.ctlSpinner(false)
                Swal.fire({
                  title: this.fTitle,
                  text: res['data'],
                  icon: 'success'
                })
              },
              err => {
                this.lcargando.ctlSpinner(false)
                this.toastr.error(err.error.message, 'Error eliminando Metas por Programa')
              }
            )
          }
        }
      }
    )

  }

  actualiza(elem) {
    if (this.permissions.editar == 0) {
      this.toastr.warning('No tiene permisos para actualizar', this.fTitle)
      return
    }

    const modal = this.modalService.open(MetaViewComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.registro = elem;
    // modal.componentInstance.catalogos = this.cmb;
    // modal.componentInstance.permissions = this.permissions
    modal.componentInstance.is_updated.subscribe(
      res => {
        // console.log(res)
        if (res.status === 1) {
          modal.dismiss()
          Swal.fire({
            title: this.fTitle,
            text: res['data'],
            icon: 'success'
          })
          this.obtenerMetas()
        }
      }
    )
  }
}
