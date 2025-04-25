import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuxiliaresService } from '../auxiliares.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IAuxuliar } from '../IAuxiliares';
import Botonera from 'src/app/models/IBotonera';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.scss']
})
export class ModalCreateComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() auxiliar: IAuxuliar;
  @Input() cmb_tipo: Array<any>;
  @Input() cmb_referencia: Array<any>;
  @Input() cmb_naturaleza: Array<any>;
  fTitle: string = 'Creacion de Auxiliar';
  msgSpinner: string;
  vmButtons: Array<Botonera> = [];

  constructor(
    private apiService: AuxiliaresService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalAuxiliar',
        paramAccion: '',
        boton: { icon: 'fas fa-floppy-o', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-primary',
        showimg: true,
        showtxt: true,
        permiso: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsModalAuxiliar',
        paramAccion: '',
        boton: { icon: 'fas fa-floppy-o', texto: 'MODIFICAR' },
        clase: 'btn btn-sm btn-primary',
        showimg: true,
        showtxt: true,
        permiso: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsModalAuxiliar',
        paramAccion: '',
        boton: { icon: 'fas fa-window-close', texto: 'CANCELAR' },
        clase: 'btn btn-sm btn-danger',
        showimg: true,
        showtxt: true,
        permiso: true,
        showbadge: false,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    if (this.auxiliar) {
      this.fTitle = 'Edicion de Auxiliar'

      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
    } else {
      this.auxiliar = {
        codref: null,
        tip_aux: null,
        nom_tip_aux: null,
        descripcion: null,
        naturaleza: null,
      }

      this.vmButtons[0].habilitar = false;
      this.vmButtons[1].habilitar = true;
    }
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.setAuxiliar()
        break;
      case "MODIFICAR":
        this.setAuxiliar()
        break;
      case "CANCELAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  async setAuxiliar() {
    this.lcargando.ctlSpinner(true)
    try {
      let response = await this.apiService.setAuxiliar({auxiliar: this.auxiliar})
      console.log(response)
      this.apiService.auxiliarStore$.emit(response)

      this.lcargando.ctlSpinner(false)
      this.activeModal.close()
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error guardando Auxiliar')
    }
  }

  handleSelectTipo(event) {
    console.log(event)
    Object.assign(this.auxiliar, { tip_aux: event.valor, nom_tip_aux: event.descripcion })
  }

}
