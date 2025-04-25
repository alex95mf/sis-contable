import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { EmisionArancelesService } from '../emision-aranceles.service';
// import { GeneracionService } from '../generacion.service';

@Component({
  selector: 'app-modal-exon-contribuyente',
  templateUrl: './modal-exon-contribuyente.component.html',
  styleUrls: ['./modal-exon-contribuyente.component.scss']
})
export class ModalExonContribuyenteComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @Input() contribuyente: number
  msgSpinner: string;

  vmButtons: Botonera[] = [];
  lst_exoneraciones: any = [];

  constructor(
    private apiService: EmisionArancelesService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      // { orig: "btnModalExonContribuyente", paramAccion: "", boton: { icon: "fas fa-plus", texto: "APLICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnModalExonContribuyente", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
  }

  ngOnInit(): void {
    setTimeout(() => this.getExoneraciones(), 0)
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close()
        break;
      case "APLICAR":
        // this.aplicarExoneracion();
        break;
    }
  }

  async getExoneraciones() {
    try {
      this.lcargando.ctlSpinner(true)
      this.msgSpinner = 'Cargando Exoneraciones'
      const response = await this.apiService.getExoneraciones({contribuyente: this.contribuyente, concepto: {codigo: 'RP'}}).toPromise<any>()
      console.log(response)
      this.lst_exoneraciones = response.data
      //
      this.lcargando.ctlSpinner(false)
    } catch(err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Exoneraciones')
    }
  }

  aplicarExoneracion(element: any) {
    // element: exoneracion
    this.apiService.exoneracionContribuyente$.emit({contribuyente_id: this.contribuyente, exoneracion: element})
    this.activeModal.close()
  }

}
