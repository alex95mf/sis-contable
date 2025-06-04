import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-modal-idpdetalles',
  templateUrl: './modal-idpdetalles.component.html',
  styleUrls: ['./modal-idpdetalles.component.scss']
})
export class ModalIdpdetallesComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() solicitu: any;

  solicitud: any = [];

  solicitudDetalle: any = [];

  vmButtons: any = [];

  constructor(
    private modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    
    this.vmButtons = [
      {
        orig: "btnListRecDocumento",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    setTimeout(() => {
      console.log(this.solicitu);
      let sol = {
        num_solicitud: this.solicitu.num_solicitud,
        tipo_proceso: this.solicitu.tipo_proceso,
        fecha_creacion: this.solicitu.fecha_creacion,
        valor: this.solicitu.valor,
        estado: this.solicitu.estado
      }
      this.solicitud = [sol];
  
      this.solicitudDetalle = this.solicitu.detalles
      
    }, 50);
    

    
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.modal.close()
        break;
    }
  }

}
