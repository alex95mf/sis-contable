import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { GeneralService } from 'src/app/services/general.service';
import { EmpleadoService } from '../empleado.service';
import { EmployeesResponseI } from 'src/app/models/responseEmployee.interface';

@Component({
  selector: 'app-modal-retencion-judicial',
  templateUrl: './modal-retencion-judicial.component.html',
  styleUrls: ['./modal-retencion-judicial.component.scss']
})
export class ModalRetencionJudicialComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  msgSpinner: string;
  vmButtons: Botonera[] = []

  @Input() empleado: EmployeesResponseI
  @Input() input_retencion: any

  lst_bancos: any[] = []
  lst_tipo_cuenta: any[] = [
    { value: 'AHO', label: 'AHORROS' },
    { value: 'COR', label: 'CORRIENTE' },
  ]

  retencion: any = {
    resolucion: null,
    beneficiario: null,
    identificacion: null,
    motivo: null, 
    valor: 0,
    banco: null,
    tipo_cuenta: null,
    num_cuenta: null,
  }

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private generalService: GeneralService,
    private empleadoService: EmpleadoService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalRetencionJudicial',
        paramAccion: '',
        boton: {icon: 'far fa-save', texto: 'Guardar'},
        clase: 'btn btn-success btn-sm',
        permiso: true,
        habilitar: false,
        showbadge: false, 
        showimg: true,
        showtxt: true,
      },
      {
        orig: 'btnsModalRetencionJudicial',
        paramAccion: '',
        boton: {icon: 'far fa-save', texto: 'Modificar'},
        clase: 'btn btn btn-mod boton btn-sm',
        permiso: true,
        habilitar: true,
        showbadge: false, 
        showimg: true,
        showtxt: true,
      },
      {
        orig: 'btnsModalRetencionJudicial',
        paramAccion: '',
        boton: {icon: 'far fa-window-close', texto: 'Cancelar'},
        clase: 'btn btn-dark boton btn-sm',
        permiso: true,
        habilitar: false,
        showbadge: false, 
        showimg: true,
        showtxt: true,
      },
    ]
  }

  ngOnInit(): void {
    if (this.input_retencion) {
      Object.assign(this.retencion, this.input_retencion)
      this.vmButtons[0].habilitar = true
      this.vmButtons[1].habilitar = false
    }
    Object.assign(this.retencion, {fk_empleado: this.empleado.id_empleado})
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      await this.cargarBancos()
      this.lcargando.ctlSpinner(false)
    })
  }

  cargarBancos = async () => {
    try {
      this.msgSpinner = 'Cargando Bancos'
      const response = await this.empleadoService.getCatalogs({params: "'BANCO'"}).toPromise()
      this.lst_bancos = response['data']['BANCO']
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message)
    }
  }

  async metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "Cancelar":
        this.activeModal.close();
        break;
      case "Guardar":
        this.lcargando.ctlSpinner(true)
        this.msgSpinner = 'Almacenando Retencion Judicial'
        await this.setRetencionJudicial()
        this.lcargando.ctlSpinner(false)
        break;
      case "Modificar":
        this.updateRetencionJudicial()
    }
  }

  setRetencionJudicial = async () => {
    const msgValidacion = this.validacionGlobal();

    if (msgValidacion.length > 0) {
      this.toastr.warning(msgValidacion, 'Validacion de Datos', {enableHtml: true})
      return
    }

    try {
      const response = await this.empleadoService.setRetencionJudicial({data: this.retencion})
      console.log(response)
      this.empleadoService.setRetencionJudicial$.emit(response)
      this.activeModal.close()
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message)
    }
  }

  updateRetencionJudicial = async () => {
    const msgValidacion = this.validacionGlobal();

    if (msgValidacion.length > 0) {
      this.toastr.warning(msgValidacion, 'Validacion de Datos', {enableHtml: true})
      return
    }

    try {
      const response = await this.empleadoService.updateRetencionJudicial(this.retencion.id, {data: this.retencion})
      console.log(response)
      this.empleadoService.setRetencionJudicial$.emit(response)
      this.activeModal.close()
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message)
    }
  }

  validacionGlobal = () => {
    let message = ''

    if (!this.retencion.resolucion) message += '* No ha ingresado una Resolucion<br>'
    if (!this.retencion.beneficiario) message += '* No ha ingresado un Beneficiario<br>'
    if (!this.retencion.identificacion) message += '* No ha ingresado Identificacion del Beneficiario<br>'
    if (!this.retencion.motivo) message += '* No ha ingresado un Motivo<br>'
    if (this.retencion.valor <= 0) message += '* El valor de la Retencion no puede ser igual o menor a 0<br>'
    if (!this.retencion.banco) message += '* No ha seleccionado un Banco<br>'
    if (!this.retencion.tipo_cuenta) message += '* No ha seleccionado un Tipo de Cuenta<br>'
    if (!this.retencion.num_cuenta) message += '* No ha ingresado un Numero de Cuenta<br>'

    return message
  }

}
