import { Component, OnInit, Input } from '@angular/core';
import { Proyecto } from '../../proyecto.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowProyectoComponent implements OnInit {
  @Input() proyecto : Proyecto;
  vmButtons : any;

  constructor(private activeModal : NgbActiveModal) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsShowProyecto", paramAccion: "", boton: { icon: "far fa-window-close", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false }
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
