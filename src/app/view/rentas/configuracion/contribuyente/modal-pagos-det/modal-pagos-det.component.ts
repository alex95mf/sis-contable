import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-pagos-det',
  templateUrl: './modal-pagos-det.component.html',
  styleUrls: ['./modal-pagos-det.component.scss']
})
export class ModalPagosDetComponent implements OnInit {
  @Input() documento: any
  fTitle: string = 'Detalle de Documeto de Pago'
  vmButtons: any[]

  constructor(
    private activeModal: NgbActiveModal,
  ) {
    this.vmButtons = [
      {
        orig: "btnsModalPagosDet", 
        paramAccion: "", 
        boton: { icon: "fas fa-window-close", texto: "CERRAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-danger boton btn-sm", 
        habilitar: false 
      }
    ]
  }

  ngOnInit(): void {
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

}
