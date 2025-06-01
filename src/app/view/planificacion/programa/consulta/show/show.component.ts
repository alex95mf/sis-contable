import { Component, OnInit, Input } from '@angular/core';
import { Programa } from '../../programa.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
standalone: false,
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowProgramaComponent implements OnInit {
  @Input() programa : Programa;
  vmButtons : any;

  constructor(private activeModal : NgbActiveModal) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsShowPrograma", paramAccion: "", boton: { icon: "far fa-window-close", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false }
    ]
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.closeModal();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

}
