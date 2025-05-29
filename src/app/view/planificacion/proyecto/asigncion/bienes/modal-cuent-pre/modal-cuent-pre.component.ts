import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
// import { CategoriaProductoService } from '../categoria-producto.service';
// import { ConceptosService } from '../conceptos.service';
import { RubrosService } from 'src/app/view/rrhh/configuracion/rubros/rubros.service';//'../rubros.service';.ts

@Component({
standalone: false,
  selector: 'app-modal-cuent-pre',
  templateUrl: './modal-cuent-pre.component.html',
  styleUrls: ['./modal-cuent-pre.component.scss']
})
export class ModalCuentPreComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  fTitle: string;

  encargados: any = []

  vmButtons: any

  dataUser: any

  filter: any
  paginate: any
  


  @Input() detalle: any
  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private servicio: RubrosService
  ) {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnEncargadoForm",
        paramAction: "",
        boton: { icon: "fas fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnEncargadoForm",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.fTitle = 'Editar detalle';//(this.validacionModal) ? 'Cuentas Contables' : 'Codigo Presupuestario'

    setTimeout(()=>{
     
      
    }, 50)

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        //this.activeModal.close({ detalle: this.detalle }); //'Modal cerrado correctamente'
        this.activeModal.close();
        break;
        case " GUARDAR":
        this.activeModal.close({ detalle: this.detalle }); //'Modal cerrado correctamente'
        //this.activeModal.close();
        break;
    }
  }


  

}
