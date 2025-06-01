import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-permiso-det',
  templateUrl: './permiso-det.component.html',
  styleUrls: ['./permiso-det.component.scss']
})
export class PermisoDetComponent implements OnInit {
  mensajeSpiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent,{ static: false })
  lcargando: CcSpinerProcesarComponent;

  @Input() concepto: any;

  detalles: any = [];
  
  fTitle: any = 'Detalle de permiso';
  vmButtons: any = [];
  dataUser: any;

  constructor(
    private modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
     
    this.vmButtons = [
      {
        orig: "btnDetMulta",
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

    setTimeout(()=>{
      this.getDetalles();
    },0)

  }
  
  getDetalles() {

    console.log(this.concepto);
    this.detalles = this.concepto.detalles;
    console.log(this.detalles);

  }
  
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }
  
  closeModal() {
    this.modal.dismiss();
  }

}
