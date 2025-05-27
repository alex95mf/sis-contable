import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Botonera from 'src/app/models/IBotonera';
import { ConceptosService } from '../conceptos.service';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

@Component({
  selector: 'app-modal-meses-interes',
  templateUrl: './modal-meses-interes.component.html',
  styleUrls: ['./modal-meses-interes.component.scss']
})
export class ModalMesesInteresComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() concepto: any;
  msgSpinner: string;
  vmButtons: Array<Botonera>;

  lst_tipo_persona: Array<string> = [];
  lst_dias: any[] = []
  lst_meses: any[] = []

  constructor(
    private apiService: ConceptosService,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalIntereses',
        paramAccion: '',
        boton: { icon: 'fas fa-floppy-o', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsModalIntereses',
        paramAccion: '',
        boton: { icon: 'fas fa-window-close', texto: 'CERRAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
    ]

    for (let index = 1; index <= 31; index++) {
      this.lst_dias.push({dia: index})
    }

    this.lst_meses = Array.apply(0, Array(12)).map(function(_,i){return {valor: i + 1, nombre: moment().month(i).format('MMM')}})
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 50);
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CERRAR":
        this.activeModal.close()
        break;
      case "GUARDAR":
        this.setMesesSinIntereses()
        break;
    
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Tipo de Persona'
      let tipoPersona = await this.apiService.getAgentRetencion()
      let datos = await this.apiService.getMesesIntereses({concepto: this.concepto})
      console.log(tipoPersona)
      console.log(datos)

      tipoPersona.forEach((tipo: any) => {
        const meses_sin_intereses = datos.find((data: any) => data.fk_tipo_persona == tipo.id)?.meses_sin_intereses ?? 0
        const meses_expediente = datos.find((data: any) => data.fk_tipo_persona == tipo.id)?.meses_expediente ?? 0
        const meses_coactiva = datos.find((data: any) => data.fk_tipo_persona == tipo.id)?.meses_coactiva ?? 0
        const dia = datos.find((data: any) => data.fk_tipo_persona == tipo.id)?.dia ?? 1
        const mes = datos.find((data: any) => data.fk_tipo_persona == tipo.id)?.mes ?? 1
        Object.assign(tipo, { meses_sin_intereses, meses_expediente, meses_coactiva, dia, mes })
      })
      this.lst_tipo_persona = tipoPersona;
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false);
      this.toastr.info(err.error?.message);
    }
  }

  async setMesesSinIntereses() {
    // Validacion de Datos
    let msgInvalid = ''

    this.lst_tipo_persona.forEach((element: any, idx: number) => {
      const y = moment().format('YYYY')
      const m = element.mes
      const diasMes = moment(`${y}-${m}`).daysInMonth()
      if (element.dia > diasMes) msgInvalid += `El dia seleccionado en item ${idx + 1} no es valida.<br>`
    })

    if (msgInvalid.length > 0) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return;
    }
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Guardando Configuracion'
      let response = await this.apiService.setMesesIntereses({concepto: this.concepto, configuracion: this.lst_tipo_persona})
      console.log(response)
      //
      this.lcargando.ctlSpinner(false)
      Swal.fire('Configuracion almacenada correctamente', '', 'success').then(() => this.activeModal.close())
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false);
      this.toastr.info(err.error?.message);
    }
  }

  setDias({valor}, idx) {
    // console.log(event, idx)
    const y = moment().format('YYYY')
    const m = valor
    const diasMes = moment(`${y}-${m}`).daysInMonth()
    console.log(y, m, `${y}-${m}`, diasMes)
    this.lst_dias = Array.apply(0, Array(diasMes)).map(function(_,i){return {dia: i + 1}})

  }

}
