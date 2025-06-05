import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-modal-vista-fotos',
  templateUrl: './modal-vista-fotos.component.html',
  styleUrls: ['./modal-vista-fotos.component.scss'],
  providers: [NgbCarouselConfig]
})
export class ModalVistaFotosComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent,{ static: false })
  lcargando: CcSpinerProcesarComponent;

  vmButtons: any = [];

  @Input() fotos: any = [];
  @Input() indexActive: any = 0;

  constructor(
    private modal: NgbActiveModal,
    config: NgbCarouselConfig
  ) {
    config.interval = 0;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnInspecciones",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];
    console.log(this.fotos)

  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      default:
        break;
    }
  }

  closeModal() {
    this.modal.dismiss();
  }

}
