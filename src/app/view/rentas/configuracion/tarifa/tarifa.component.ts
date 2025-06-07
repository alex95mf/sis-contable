import { Component, OnInit, ViewChild } from '@angular/core';

import { ListTarifaComponent } from './list-tarifa/list-tarifa.component';
import { ModalTarifasComponent } from './modal-tarifas/modal-tarifas.component';
import { TarifaService } from './tarifa.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { ModalExoneracionesComponent } from '../../liquidacion/generacion-valor/modal-exoneraciones/modal-exoneraciones.component';

@Component({
standalone: false,
  selector: 'app-tarifa',
  templateUrl: './tarifa.component.html',
  styleUrls: ['./tarifa.component.scss']
})
export class TarifaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle = 'Tarifas'
  mensajeSpinner: string
  vmButtons = []
  dataUser: any
  permissions: any
  empresLogo: any
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm')

  tarifas = []
  tarifa: any = {
    id: null,
    fk_concepto: 0,
    descripcion: '',
    estado: false,
    detalles: []
  }
  editMode: boolean = false

  // Cargados de la base de datos
  conceptos = []
  procesoCM: boolean = true;
  exoneraciones: any = [];

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: TarifaService
  ) {
    this.commonVarService.editTarifa.asObservable().subscribe(
      res => {
        // console.log(res)
        let tare = {
          id: res.id_tarifa,
          fk_concepto: res.fk_concepto,
          descripcion: res.descripcion,
          estado: res.estado == 'A',
          detalles: []
        }

        if (res.concepto_detalle.length > 0) {
          res.concepto_detalle.forEach(d => {
            let detalle = {
              id: null,
              fk_concepto_detalle: d.id_concepto_detalle,
              codigo: d.codigo_detalle,
              nombre: d.nombre_detalle,
              estado: false,
              valor: 0
            }
            tare.detalles.push({ ...detalle })
          })
          this.cargaTarifaDetalles(tare)
        }

        Object.assign(this.tarifa, tare)
        this.editMode = true
        this.vmButtons[0].habilitar = true
        this.vmButtons[1].habilitar = false
        this.vmButtons[3].habilitar = false
        
      }
    )
    this.commonVarService.selectExonerLiqPURen.asObservable().subscribe(
      res => {
        console.log(res)
        this.exoneraciones = res
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsTarifa",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsTarifa",
        paramAccion: "",
        boton: { icon: "far fa-edit", texto: "ACTUALIZAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsTarifa",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsTarifa",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
        printSection: "Printsection", imprimir: true
      },
      {
        orig: "btnsTarifa",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
    ]
    setTimeout(() => {
      this.validaPermisos()
    }, 50)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case 'LIMPIAR':
        this.nuevaTarifa()
        break;
      case 'GUARDAR':
        this.validaFormulario();
        // this.almacenaTarifa()
        break;
      case 'ACTUALIZAR':
        this.validaFormulario();
        // this.almacenaTarifa()
        break;
      case 'BUSCAR':
        this.expandTarifas()
        break;
      default:
        break;
    }
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))
    this.empresLogo = this.dataUser.logoEmpresa;

    let params = {
      codigo: myVarGlobals.fRenTarifa,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true);
    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          setTimeout(() => {
            // this.tarifa.id = this.asignaIdTarifa()
            this.cargaConceptos()
          }, 150)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  cargaConceptos() {
    /** Llama a la API para cargar la lista desplegable con los conceptos */
    (this as any).mensajeSpinner = 'Cargando Conceptos'
    this.lcargando.ctlSpinner(true);
    this.apiService.getConceptos().subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Conceptos para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res['data'].forEach(c => {
          let concepto = {
            id: c.id_concepto,
            codigo: c.codigo,
            nombre: c.nombre
          }
          this.conceptos.push({ ...concepto })
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  asignaConcepto(event) {
    console.log(event);
    if (event === 0) {
      this.tarifa.fk_concepto = 0
      this.vmButtons[0].habilitar = true
      this.tarifa.detalles = [];
      this.procesoCM = true
      return
    }
    else if (event ==33){
      this.procesoCM = false
    }
    else{
      this.procesoCM = true
    }
    this.tarifa.fk_concepto = event
    this.vmButtons[0].habilitar = false
    this.cargaConceptoDetalles(event)
  }

  cargaConceptoDetalles(concepto) {
    /** Llama a la API para cargar la lista de detalles del concepto seleccionado */
    (this as any).mensajeSpinner = 'Obteniendo Detalles del Concepto'
    this.tarifa.detalles = [];
    this.lcargando.ctlSpinner(true);
    this.apiService.getDetallesConcepto({id_concepto: concepto}).subscribe(
      res => {
        // console.log(res['data'])
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No existen Detalles del Concepto',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res['data'].forEach(d => {
          let detalle = {
            id: null,
            fk_concepto_detalle: d.id_concepto_detalle,
            codigo: d.codigo_detalle,
            nombre: d.nombre_detalle,
            estado: d.estado == 'A',
            valor: 0
          }
          this.tarifa.detalles.push({ ...detalle })
        });
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Detalles de Concepto')
      }
    )
  }

  async validaFormulario() {
    if (this.permissions.guardar=="0") {
      this.toastr.warning("No tiene permisos para agregar tarifas.");
    } else if (this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para editar este tarifas.", this.fTitle);
    } else {
      let resp = await this.validarCampos().then((respuesta) => {
        if(respuesta) {
          this.almacenaTarifa();
        }
      })
    }
  }

  validarCampos() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (
        this.tarifa.fk_concepto == undefined ||
        this.tarifa.fk_concepto == 0
      ) {
        this.toastr.info("Debe seleccionar un concepto");
        flag = true;
      } else if(
        this.tarifa.descripcion == undefined ||
        this.tarifa.descripcion == ''
      )  {
        this.toastr.info("Debe ingresar una descripción para la tarifa");
        flag = true;
      }
        !flag ? resolve(true) : resolve(false);
    });
  }

  almacenaTarifa() {
    if (this.permissions.guardar === 0) {
      this.toastr.warning('No tiene permisos para guardar', this.fTitle)
      return
    };

    (this as any).mensajeSpinner = 'Almacenando Tarifa'
    this.tarifa.estado = this.tarifa.estado ? 'A' : 'I'  // Altera el valor del estado de la tarifa para guardar en la base
    this.tarifa.detalles.map(d => d.estado = d.estado ? 'A' : 'I')

    this.lcargando.ctlSpinner(true);


        if (this.editMode) {
          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text: "¿Seguro que desea actualizar la tarifa?",
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
            }).then((result) => {
              if (result.isConfirmed) {
              this.apiService.updateTarifa({tarifa: this.tarifa}).subscribe(
                (res: any) => {
                  console.log(res);
                  this.tarifa.estado = res.data.estado == 'A'
                  this.lcargando.ctlSpinner(false)
                  Swal.fire({
                    title: this.fTitle,
                    text: res['message'],
                    icon: 'success'
                  })
                  this.cargaTarifaDetalles(this.tarifa)
                },
                err => {
                  this.lcargando.ctlSpinner(false)
                  this.toastr.error(err.error.message, 'Error actualizando Tarifa')
                }
              )
            }else {
              this.lcargando.ctlSpinner(false);
            }
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text: "¿Seguro que desea guardar la tarifa?",
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
            }).then((result) => {
              if (result.isConfirmed) {
              this.apiService.setTarifa({tarifa: this.tarifa}).subscribe(
                res => {
                  console.log(res);
                  this.lcargando.ctlSpinner(false)
                  Swal.fire({
                    title: this.fTitle,
                    text: `Tarifa (${res['data'].id}) almacenada correctamente.`,
                    icon: 'success'
                  })
                  this.tarifa.id = res['data'].id
                  this.cargaTarifaDetalles(this.tarifa)
                  // Entra en modo edicion
                  this.editMode = true
                  // this.vmButtons[1].habilitar = true
                  this.vmButtons[1].habilitar = false
                  this.vmButtons[4].habilitar = false
                },
                err => {
                  this.lcargando.ctlSpinner(false)
                  this.toastr.error(err.error.message, 'Error almacenando Tarifa')
                }
              )
            }else {
              this.lcargando.ctlSpinner(false);
            }
          });
        }

  
  }

  buscaTarifa() {
    if (this.permissions.editar === 0) {
      this.toastr.warning('No tiene permisos para editar', this.fTitle)
    }
    const modal = this.modalService.open(ListTarifaComponent, { size: 'lg', backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.tarifas = this.tarifas
  }

  expandTarifas() {
    if (this.permissions.editar === 0) {
      this.toastr.warning('No tiene permisos para editar', this.fTitle)
    }
    const modal = this.modalService.open(ModalTarifasComponent, { size: 'lg', backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.tarifas = this.tarifas
  }

  nuevaTarifa() {
    let emptyTarifa = {
      id: null,
      fk_concepto: 0,
      descripcion: '',
      estado: false,
      detalles: []
    }
    Object.assign(this.tarifa, emptyTarifa)
    this.editMode = false
    // this.vmButtons[0].habilitar = false
    this.vmButtons[1].habilitar = true
    this.vmButtons[3].habilitar = true
  }

  resetEstados() {
    this.tarifa.estado = this.tarifa.estado == 'A'
    this.tarifa.detalles.map(d => d.estado = d.estado == 'A')
  }

  cargaTarifaDetalles(tarifa) {
    
    (this as any).mensajeSpinner = 'Cargando Detalles de Tarifa'
    this.lcargando.ctlSpinner(true);
    this.apiService.getTarifa(tarifa.id).subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No existen Detalles del Concepto',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res['data']['detalles'].forEach(d => {
          let valores = {
            id: d.id_tarifa_detalle,
            estado: d.estado == 'A',
            valor: d.valor
          }
          Object.assign(this.tarifa.detalles.find(td => td.fk_concepto_detalle == d.fk_concepto_detalle), valores)
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Detalles de Tarifa')
      }
    )
  }

  onlyNumberDot(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
        return false;
    }
    return true;
  }

  expandExoneracion() {
    const modalInvoice = this.modalService.open(ModalExoneracionesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    //  modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    modalInvoice.componentInstance.exoneracionesSelect = this.exoneraciones;
  }

  removeExoneracion(index) {
    this.exoneraciones.splice(index, 1);
  
  }


}
