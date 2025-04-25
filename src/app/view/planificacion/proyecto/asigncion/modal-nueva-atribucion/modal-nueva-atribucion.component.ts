import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AsigncionService } from '../asigncion.service';

interface Atribucion {
  valor: string;
  tipo: string;
  descripcion?: string;
}

@Component({
  selector: 'app-modal-nueva-atribucion',
  templateUrl: './modal-nueva-atribucion.component.html',
  styleUrls: ['./modal-nueva-atribucion.component.scss']
})
export class ModalNuevaAtribucionComponent implements OnInit {
  vmButtons: Array<any>;
  atribucion: Atribucion = {
    valor: null,
    tipo: 'PLA_ATRIBUCION'
  };

  constructor(
    private apiService: AsigncionService,
    private activeModal: NgbActiveModal,
  ) {
    this.vmButtons = [
      {
        orig: "btnsAttrNuevo",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsAttrNuevo",
        paramAccion: "",
        boton: { icon: "fas fa-window-close", texto: "CANCELAR" },
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

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.apiService.nuevaAtribucion$.emit(this.atribucion)
        this.activeModal.close()
        break;
      case "CANCELAR":
        this.activeModal.close()
        break;
    
      default:
        break;
    }
  }

}
