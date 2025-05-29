import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';


@Component({
standalone: false,
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.component.html',
  styleUrls: ['./detalle-solicitud.component.scss']
})
export class DetalleSolicitudComponent implements OnInit {

  listaSolicitudes: any = []



  asigna: any =[]

  proceso: any = []

  vmButtons: any;

  detalles: any = {
    programa: null,
    departamento: null,
    atribucion: null,
    asigna: null,
    proceso: null
  }

  @Input() item: any;

  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-chevron-left", texto: "Regresar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false}
    ]


    setTimeout(() => {
      console.log(this.item);
      this.listaSolicitudes = this.item['detalles']
      // this.detalles.programa = this.item['catalogo_programa']['valor']
      // this.detalles.departamento = this.item['catalogo_departamento']['valor']
      // this.detalles.atribucion = this.item['catalogo']['valor']
      // this.detalles.proceso = this.item['tipo_proceso']
      this.commonVrs.contribAnexoLoad.next({ id_cliente: this.item.id_solicitud, condi: 'dis' })
    }, 50);

    

  }

  metodoGlobal(event: any){
    switch(event.items.boton.texto){
      
      case "Regresar":
        this.activeModal.close()
        break;
    }
  }



}
