import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { InspeccionService } from '../inspeccion.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Botonera from 'src/app/models/IBotonera';

@Component({
standalone: false,
  selector: 'app-modal-ferias',
  templateUrl: './modal-ferias.component.html',
  styleUrls: ['./modal-ferias.component.scss']
})
export class ModalFeriasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @Input() id_cliente: number;
  msgSpinner: string;
  vmButtons: Botonera[] = []

  lst_ferias: any[] = []
  displayedColumns: string[] = ['nombre', 'inicio', 'fin', 'acciones']

  constructor(
    private toastr: ToastrService,
    private apiService: InspeccionService,
    private activeModal: NgbActiveModal,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsModalFerias',
        paramAccion: '',
        boton: { icon: 'fas fa-window-close', texto: 'CERRAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false
      }
    ]
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      await this.getFerias()
      this.lcargando.ctlSpinner(false)
    }, 50)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CERRAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

  async getFerias() {
    try {
      this.msgSpinner = 'Cargando Ferias de Contribuyente'
      let ferias = await this.apiService.getFerias({ params: { filter: { id_cliente: this.id_cliente }}})
      console.log(ferias)
      this.lst_ferias = ferias
      //
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message)
    }
  }

  selectRow(feria: any) {
    this.apiService.feriaSelected$.emit(feria)
    this.activeModal.close()
  }

}
