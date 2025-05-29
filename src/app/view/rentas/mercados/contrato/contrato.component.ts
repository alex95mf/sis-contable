import { Component, OnInit, ViewChild } from '@angular/core';

import { ListContratosComponent } from './list-contratos/list-contratos.component';
import { EmailDestinatarioComponent } from './email-destinatario/email-destinatario.component';
// import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ContratoService } from './contrato.service';
import { ModalContribuyentesComponent } from './modal-contribuyentes/modal-contribuyentes.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from "src/app/services/common-var.services";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { resolve } from 'path';
import { Socket } from 'src/app/services/socket.service';

@Component({
standalone: false,
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.scss']
})
export class ContratoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle = "Generación de Contrato"
  msgSpinner: string
  vmButtons = []
  dataUser: any
  permissions: any

  contrato = {
    id: null,
    numero: '',
    tipo: 0, // 1 Primera Vez, 2 Renovacion
    fk_contribuyente: { razon_social: '', email: 'dbarrera@todotek.net' },
    mercado: 0,
    puesto: 0,
    mensualidad: 0,
    garantia: 0,
    total: 0,
    fechaInicio: moment().format('YYYY-MM-DD'),
    fechaVencimiento: moment().endOf('year').format('YYYY-MM-DD'),
    observaciones: '',
    estado: 'A',
    estado_legal: 'N',
    local: '',
    bienes: '',
    detalles: []
  }

  newcontrato = {
    id: null,
    numero: '',
    tipo: 0, // 1 Primera Vez, 2 Renovacion
    fk_contribuyente: { razon_social: '', email: 'dbarrera@todotek.net' },
    mercado: 0,
    puesto: 0,
    mensualidad: null,
    garantia: null,
    total: null,
    fechaInicio: moment().format('YYYY-MM-DD'),
    fechaVencimiento: moment().endOf('year').format('YYYY-MM-DD'),
    observaciones: '',
    estado: true,
    local: '',
    bienes: '',
    detalles: []
  }

  estados: any[] = [
    { id: 'A', label: 'ACTIVO' },
    { id: 'I', label: 'INACTIVO' },
    { id: 'X', label: 'ANULADO' }
  ]

  estados_legal: any[] = [
    { id: 'L', label: 'LEGALIZADO' },
    { id: 'N', label: 'NO LEGALIZADO' }
  ]

  contribuyentes = []
  mercados: any[] = []
  puestos = []
  fileList: FileList
  fileName: string
  readOnlyMode: boolean = false
  valorGarantia: any
  valorMensualidad: any

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private apiService: ContratoService,
    public validaciones: ValidacionesFactory,
    private socket: Socket,
  ) {
    this.apiService.contribuyente$.subscribe(
      (res: any) => {
        this.contrato.fk_contribuyente = res
      }
    )
    this.commonVarService.editContrato.asObservable().subscribe(
      async (res: any) => {
        this.valorGarantia = this.commonVarService.NumeroALetras(Math.trunc(res['valor_garantia']), 0)
        this.valorMensualidad = this.commonVarService.NumeroALetras(Math.trunc(res['valor_arriendo']), 0)
        this.newcontrato = res.id_mercado_contrato

        this.msgSpinner = 'Cargando Contrato'
        this.lcargando.ctlSpinner(true)
        try {
          console.log(res)
          this.puestos = await this.getPuestos(this.mercados.find(m => m.id == res.fk_mercado))

          let contrato = {
            id: res.id_mercado_contrato,
            numero: res.numero_contrato,
            tipo: res.tipo_contrato,
            fk_contribuyente: res.fk_contribuyente,
            mercado: this.mercados.find(m => m.id == res.fk_mercado),
            puesto: this.puestos.find(p => p.id == res.fk_mercado_puesto.id_mercado_puesto),
            mensualidad: res.valor_arriendo,
            garantia: res.valor_garantia,
            total: res.total,
            fechaInicio: moment.utc(res.fecha_inicio).format('YYYY-MM-DD'),
            fechaVencimiento: moment.utc(res.fecha_vencimiento).format('YYYY-MM-DD'),
            observaciones: res.observacion,
            estado: res.estado,
            local: res.local,
            bienes: res.bienes,
            estado_legal: res.estado_legalizacion,
            detalles: []
          }
          Object.assign(this.contrato, contrato)

          let detalles = res.detalles
          if (Array.isArray(detalles) && res.detalles.length > 0) {
            detalles.forEach(d => {
              let detalle = {
                num_cuota: d.nro_cuota,
                fechaDesde: moment(d.fecha_desde).format('YYYY-MM-DD'),
                fechaHasta: moment(d.fecha_hasta).format('YYYY-MM-DD'),
                valor: d.valor
              }
              this.contrato.detalles.push({ ...detalle })
            })
          }

          this.vmButtons[0].habilitar = true
          this.vmButtons[1].habilitar = false
          this.vmButtons[2].habilitar = false
          this.vmButtons[5].habilitar = false
          this.vmButtons[6].habilitar = false

          this.lcargando.ctlSpinner(false)

        } catch (err) {
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err, 'Error cargando Puestos de Mercado')
        }

      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsRenContrato",
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
        orig: "btnsRenContrato",
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
        orig: "btnsRenContrato",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "ANULAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRenContrato",
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
        orig: "btnsRenContrato",
        paramAccion: "",
        boton: { icon: "far fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-danger boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenContrato",
        paramAccion: "",
        boton: { icon: "far fa-envelope", texto: "ENVIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-dark boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsRenContrato",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-info boton btn-sm",
        habilitar: true,

      }
      // {
      //   orig: "btnsRenContrato",
      //   paramAccion: "",
      //   boton: { icon: "far fa-file-pdf", texto: "IMPRIMIR R2" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-warning boton btn-sm",
      //   habilitar: false,

      // }

    ]

    setTimeout(() => {
      // this.validaPermisos()
      this.inicializacion()
    }, 50)
  }

  async inicializacion() {
    this.msgSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))

    this.lcargando.ctlSpinner(true)
    try {
      this.permissions = await this.getPermisos()
      if (this.permissions.abrir == 0) {
        this.lcargando.ctlSpinner(false)
        this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        return
      }

      this.msgSpinner = 'Cargando Mercados'
      this.mercados = await this.getMercados()
      this.lcargando.ctlSpinner(false)
    } catch (err: any) {
      this.toastr.warning(err, 'Advertencia')
    }

    /* let params = {
      codigo: myVarGlobals.fRenContrato,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true)
    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          /*setTimeout(() => {
            this.getContribuyentes()
          }, 150)
          this.getMercados()
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    ) */
  }

  getPermisos() {
    return new Promise((resolve, reject) => {
      let params = {
        codigo: myVarGlobals.fRenContrato,
        id_rol: this.dataUser.id_rol,
      };

      this.commonService.getPermisionsGlobas(params).subscribe(
        (res: any) => {
          resolve(res.data[0])
        },
        (err: any) => {
          reject(err)
        }
      )
    })
  }

  metodoGlobal(event) {
    // console.log(event)
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.setContrato()
        break;

      case "BUSCAR":
        this.buscaContrato()
        break;

      case "CANCELAR":
        this.limpiar()
        break;

      case "ANULAR":
        this.anularContrato()
        break;

      case "ENVIAR":
        this.enviarCorreo()
        break;

      case "IMPRIMIR":
        this.printReporte1()
        break;

      case "IMPRIMIR R2":
        this.printReporte2()
        break;

      case "ACTUALIZAR":
        this.actualizaContrato()
        break;

      default:
        break;
    }

  }

  getMercados = () => {
    return new Promise<any[]>((resolve, reject) => {
      this.apiService.getMercados({ params: "'REN_MERCADO'" }).subscribe(
        (res: any) => {
          if (Array.isArray(res.data) && res.data.length === 0) {
            reject('No hay Mercados para cargar.')
          }

          let mercados = []
          res.data.REN_MERCADO.forEach((m: any) => {
            const { id_catalogo, valor, descripcion } = m
            mercados = [...mercados, { id: id_catalogo, nombre: valor }]
          })
          resolve(mercados)
        },
        (err: any) => {
          reject(err)
        }
      )
    })
  }

  cargarPuestos = async (event) => {
    this.msgSpinner = 'Cargando Puestos de Mercado'
    this.contrato.puesto = 0
    this.lcargando.ctlSpinner(true)
    try {
      this.puestos = await this.getPuestos(event, 'D')
      this.lcargando.ctlSpinner(false)
    } catch (err: any) {
      this.lcargando.ctlSpinner(false)
      this.toastr.warning(err, 'Adventencia')
    }

  }

  getPuestos = (event, estado?) => {
    return new Promise<any[]>((resolve, reject) => {
      console.log(event, estado)
      this.apiService.getPuestos({ mercado: event, estado: estado }).subscribe(
        (res: any) => {
          console.log(res)
          if (Array.isArray(res.data) && res.data.length === 0) {
            reject("No hay Puestos de Mercado disponibles")
          }

          let puestos = [];
          res.data.forEach((puesto: any) => {
            const { id_mercado_puesto, numero_puesto, descripcion, estado, valor } = puesto
            puestos = [...puestos, { id: id_mercado_puesto, numero: numero_puesto, descripcion: descripcion, estado: estado, valor: valor }]
          })
          resolve(puestos)
        },
        (err: any) => {
          reject(err)
        }
      )
    })
    /* this.contrato.puesto=0; // cada que se cambia el mercado debe reiniciarse el puesto

    this.msgSpinner = 'Cargando Puestos de Mercado'
    this.lcargando.ctlSpinner(true)
    this.puestos = []
    this.apiService.getPuestos({ mercado: event, estado: 'D' }).subscribe(
      (res: any) => {
        if (Array.isArray(res.data) && res.data.length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Puestos de Mercado disponibles.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res.data.forEach((p: any) => {
          const { id_mercado_puesto, numero_puesto, descripcion, estado, valor } = p
          this.puestos = [...this.puestos, { id: id_mercado_puesto, numero: numero_puesto, descripcion: descripcion, estado: estado, valor: valor }]
        })
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Puestos de Mercado')
      }
    ) */
  }

  puestoSelected(event) {
    // console.log('puestoSelected', event)
    this.contrato.mensualidad = event.valor
    this.contrato.garantia = 2 * parseFloat(event.valor)
  }

  generarCuotas() {

    this.valorGarantia = this.commonVarService.NumeroALetras(Math.trunc(this.contrato.garantia), 0)
    this.valorMensualidad = this.commonVarService.NumeroALetras(Math.trunc(this.contrato.mensualidad), 0)

    if (this.contrato.fechaVencimiento <= this.contrato.fechaInicio) {
      this.toastr.warning('La fecha de Vencimiento no puede ser anterior o igual a la fecha de Inicio.', 'Error generando Cuotas')
      return
    }

    if (this.contrato.fechaVencimiento.split('-')[0] !== this.contrato.fechaInicio.split('-')[0]) {
      this.toastr.error('El año de Vencimiento es diferente al de Inicio.', 'Error generando Cuotas')
      return
    }

    this.contrato.detalles = []
    let cuotas = this.monthDiff(this.contrato.fechaInicio, this.contrato.fechaVencimiento)
    console.log(cuotas)
    for (let mes = 0; mes <= cuotas; mes++) {

      let mesCuota = (parseInt(this.contrato.fechaInicio.split('-')[1]) + mes).toString().padStart(2, '0')
      let fechaDesdeCuota = `${this.contrato.fechaInicio.split('-')[0]}-${mesCuota}-01`
      let fechaHastaCuota = `${this.contrato.fechaInicio.split('-')[0]}-${mesCuota}-${this.lastDayInMonth(new Date(fechaDesdeCuota))}`

      if (mes === 0 && fechaDesdeCuota < this.contrato.fechaInicio) fechaDesdeCuota = this.contrato.fechaInicio
      if (mes === cuotas && fechaHastaCuota > this.contrato.fechaVencimiento) fechaHastaCuota = this.contrato.fechaVencimiento

      this.contrato.detalles.push({
        num_cuota: mes + 1,
        fechaDesde: fechaDesdeCuota,
        fechaHasta: fechaHastaCuota,
        // valor: this.calculaProporcional(fechaDesdeCuota, fechaHastaCuota)
        valor: this.contrato.mensualidad,
      })

    }
    this.calculaTotal()
  }

  async setContrato() {
    // if (this.permissions.guardar === 0) {
    //   this.toastr.warning('No tiene permisos para generar un contrato', this.fTitle)
    //   return
    // }

    try {
      await this.validarDatos()

      this.msgSpinner = 'Almacenando Contrato'
      this.lcargando.ctlSpinner(true)

      const data = {
        contrato: this.contrato,
        // Para la Notificacion
        sendNotificacion: true,
        id_controlador: myVarGlobals.fRenContrato,
        ip: this.commonService.getIpAddress(),
        mensaje: `Se ha generado un nuevo Contrato de Mercado por parte de ${this.dataUser.nombre}`
      }

      this.apiService.setContrato(data).subscribe(
        (res: any) => {
          console.log(res)
          Object.assign(
            this.contrato,
            {
              id: res.data.id_mercado_contrato,
              numero: res.data.numero_contrato
            }
          )
          if (data.sendNotificacion) {
            this.socket.onEmitNotification(res['data']['notify']);
          }
          this.newcontrato = res.data.id_mercado_contrato
          this.lcargando.ctlSpinner(false)
          Swal.fire('Contrato almacenado satisfactoriamene', '', 'success')
          this.setReadOnly()
        },
        (err: any) => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.warning(err.error.message, 'Advertencia almacenando Contrato')
        }
      )

    } catch (err) {
      this.toastr.warning(err, 'Errores de Validación', { enableHtml: true })
    }

    /* this.validarDatos().then(
      () => {
        // Subir archivos si hay por subir y el contrato ya tiene un ID asignado
        if (this.fileList && this.contrato.id !== null) {
          this.uploadFile()
        } else if (this.fileList && this.contrato.id === null) {
          this.toastr.warning('No se puede almacenar anexos sin primero haber guardado el contrato.', this.fTitle)
        }

        this.msgSpinner = 'Almacenando Contrato'
        this.lcargando.ctlSpinner(true)
        this.apiService.setContrato({contrato: this.contrato}).subscribe(
          (res: any) => {
            // console.log(res['data'])
            // this.lcargando.ctlSpinner(false)
            // if (res['data']['message'] == 'OK') {
            this.contrato.id = res.data.contrato.id_mercado_contrato
            this.newcontrato = res.data.contrato.id_mercado_contrato
            this.lcargando.ctlSpinner(false)
            Swal.fire({
              title: this.fTitle,
              text: res['data']['message'] == 'OK' ? 'Contrato almacenado con éxito' : 'Anexo asociado con éxito',
              icon: 'success'
            })
            this.setReadOnly()
            // }
            this.commonService.saveContrato.next({ id_contrato: res['data']['contrato']['id_mercado_contrato'] })
          },
          err => {
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error almacenando el Contrato')
          }
        )
      }
    ).catch((message) => {
      this.toastr.warning(message, 'Errores de Validación', {enableHtml: true})
    }) */
  }

  actualizaContrato = async () => {
    this.msgSpinner = 'Espere...'
    this.lcargando.ctlSpinner(true)
    try {
      // Si hay anexos, almacenarlos
      this.msgSpinner = 'Almacenando Anexos'
      if (this.fileList && this.contrato.id !== null) {
        await this.uploadFile()
      } else if (this.fileList && this.contrato.id === null) {
        // Como llegamos a esto?
        this.toastr.warning('No se puede almacenar anexos sin primero haber guardado el contrato.', this.fTitle)
      }

      this.msgSpinner = 'Actualizando Contrato'
      let res: any = await this.updateContrato()
      Object.assign(
        this.contrato, 
        {
          local: res.local,
          bienes: res.bienes,
          observaciones: res.observacion,
          estado_legal: res.estado_legalizacion
        }
      )
      this.fileList = undefined
      this.apiService.showAnexos$.emit(res);
      this.lcargando.ctlSpinner(false)
      Swal.fire('Contrato actualizado satisfactoriamente', '', 'success')
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err, 'Error actualizando el Contrato')
    }
  }

  updateContrato = () => {
    return new Promise<any>((resolve, reject) => {
      this.apiService.updateContrato({contrato: this.contrato}, this.contrato.id).subscribe(
        (res: any) => {
          resolve(res.data)
        },
        (err: any) => {
          reject(err.error.message)
        }
      )
    })
  }

  buscaContrato() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    } else {
      const modalInvoice = this.modalService.open(ListContratosComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      //modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
    }
  }

  anularContrato() {
    Swal.fire({
      title: 'Ingrese motivo para anular Contrato',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showLoaderOnConfirm: true,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      inputPlaceholder: 'Ingrese un motivo...',
      inputValidator: (value) => {
        if (!value) {
          return 'No ha ingresado un motivo'
        }
      },
      preConfirm: (observacion: string) => {
        return this.apiService.anularContrato(this.contrato.id, { observacion: observacion }).subscribe(
          (res: any) => {
            console.log(res)
          },
          (err: any) => {
            console.log(err)
            Swal.showValidationMessage(
              `Hubo un error: ${err}`
            )
          }
        )
      },
      allowOutsideClick: () => !Swal.isLoading,
    }).then((result: any) => {
      if (result.isConfirmed) {
        Object.assign(this.contrato, { estado: 'X' });
        Swal.fire('Contrato Anulado', '', 'success')
      }
    })
  }

  limpiar() {
    let empty = {
      id: null,
      numero: '',
      tipo: 0, // P Primera Vez, R Renovacion
      fk_contribuyente: { razon_social: '', email: 'dbarrera@todotek.net' },
      mercado: 0,
      puesto: 0,
      mensualidad: 0,
      garantia: 0,
      total: 0,
      fechaInicio: moment().format('YYYY-MM-DD'),
      fechaVencimiento: moment().endOf('year').format('YYYY-MM-DD'),
      observaciones: '',
      estado: true,
      bienes: '',
      local: '',
      detalles: []
    }
    this.commonVarService.clearContratoForm.next()
    Object.assign(this.contrato, empty)
    this.readOnlyMode = false
    this.fileList = undefined
    this.vmButtons[0].habilitar = false
    this.vmButtons[1].habilitar = true
    this.vmButtons[2].habilitar = true
    this.vmButtons[5].habilitar = true
    this.vmButtons[6].habilitar = true
  }

  setReadOnly() {
    this.readOnlyMode = true
    this.vmButtons[0].habilitar = true
    this.vmButtons[1].habilitar = false
    this.vmButtons[2].habilitar = false
    this.vmButtons[5].habilitar = false
    this.vmButtons[6].habilitar = false
  }

  enviarCorreo() {
    const modal = this.modalService.open(EmailDestinatarioComponent, { size: 'md', backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.contrato = this.contrato
  }

  cargaArchivo(archivos) {

    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).')
        // this.vmButtons[0].habilitar = false
      }, 50)
    }
  }

  uploadFile = async () => {
    let data = {
      module: this.permissions.id_modulo,
      component: myVarGlobals.fRenContrato,
      identifier: this.contrato.id,
      id_controlador: myVarGlobals.fRenContrato,
      accion: `Nuevo anexo para Contrato ${this.contrato.id}`,
      ip: this.commonService.getIpAddress() ?? '127.0.0.1'
    }

    for (let i = 0; i < this.fileList.length; i++) {
      await this.UploadService(this.fileList[i], data);
    }
    this.lcargando.ctlSpinner(false)
  }

  UploadService(file, payload?: any) {
    return new Promise((resolve, reject) => {
      this.apiService.fileService(file, payload).subscribe(
        res => {
          resolve(true)
        },
        err => {
          reject(err.error.message)
        })

    })
  }

  /** Funciones helpers */
  monthDiff = (fi, ff) => {
    /** Calcula los meses diferencia entre dos fechas */
    let fechaIni = moment(fi)
    let fechaFin = moment(ff)

    fechaFin.subtract(fechaIni.month(), 'months')

    return fechaFin.month()
  }

  lastDayInMonth = (fecha: Date) => {
    /** Devuelve el ultimo dia del mes */
    let year = fecha.getFullYear()
    let month = fecha.getMonth() + 2
    return new Date(year, month, 0).getDate()
  }

  calcularGarantia() {
    this.contrato.garantia = 2 * this.contrato.mensualidad
  }

  calculaProporcional = (fechaInicial, fechaFinal) => {
    let dateInicial = parseInt(fechaInicial.split('-')[2])
    let dateFinal = parseInt(fechaFinal.split('-')[2])
    let finDeMes = this.lastDayInMonth(new Date(fechaInicial))

    if (dateFinal < finDeMes) {
      return (this.contrato.mensualidad / finDeMes) * (dateFinal - dateInicial + 1)
    }

    return (this.contrato.mensualidad / finDeMes) * (finDeMes - dateInicial + 1)
  }

  calculaTotal = () => {
    let sum_cuotas = parseFloat(this.contrato.detalles.map(d => d.valor).reduce((sumatoria, valor) => sumatoria + valor, 0))
    this.contrato.total = sum_cuotas + this.contrato.garantia
  }

  expandContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenContrato;
    modalInvoice.componentInstance.permissions = this.permissions;
  }

  validarDatos() {
    let message: string = ''

    return new Promise((resolve, reject) => {
      if (!this.contrato.fk_contribuyente.razon_social.trim().length) {
        message += '* No ha seleccionado un Contribuyente<br />'
      }

      if (this.contrato.mercado == 0) {
        message += '* No ha seleccionado un Mercado<br />'
      }

      if (this.contrato.puesto == 0) {
        message += '* No ha seleccionado un Puesto para Mercado<br />'
      }

      if (this.contrato.tipo == 0) {
        message += '* No ha seleccionado un Tipo de Contrato<br />'
      }

      // El numero de contrato se genera en el Back
      // if (!this.contrato.numero.trim().length) {
      //   message += '* No ha asignado un Número al Contrato<br />'
      // }

      if (this.contrato.mensualidad == 0) {
        message += '* No ha asignado un valor de Mensualidad<br />'
      }

      if (this.contrato.garantia == 0) {
        message += '* No ha asignado un valor de Garantía<br />'
      }

      if (this.contrato.local == "" || this.contrato.local == undefined) {
        message += '* No ha ingresado la actividad del local<br />'
      }

      if (this.contrato.bienes == "" || this.contrato.bienes == undefined) {
        message += '* No ha ingresado los bienes que tiene el local<br />'
      }

      if (!this.contrato.detalles.length) {
        message += '* No ha generado las Cuotas al Contrato<br />'
      }
      return (message.length) ? reject(message) : resolve(true)
    })
  }


  printReporte1() {
    console.log(this.newcontrato)
    window.open(environment.ReportingUrl + "rpt_contrato_arriendo_local_01.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_mercado_contrato=" + this.newcontrato + "&valorMensualidad=" + this.valorMensualidad + "&valorGarantia=" + this.valorGarantia, '_blank')
  }

  printReporte2() {
    console.log(this.newcontrato)
    window.open(environment.ReportingUrl + "rpt_contrato_arriendo_local_02.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_mercado_contrato=" + this.newcontrato, '_blank')
  }

}
