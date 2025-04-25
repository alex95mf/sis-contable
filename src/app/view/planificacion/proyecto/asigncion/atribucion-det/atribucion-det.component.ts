import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-atribucion-det',
  templateUrl: './atribucion-det.component.html',
  styleUrls: ['./atribucion-det.component.scss']
})
export class AtribucionDetComponent implements OnInit {
  @Input() atribucion

  vmButtons = []

  constructor(private activeModal : NgbActiveModal) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsAttrDet", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ]
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.dismiss()
        break;
    
      default:
        break;
    }
  }

}
