import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detalle-compras',
  templateUrl: './detalle-compras.component.html',
  styleUrls: ['./detalle-compras.component.scss']
})
export class DetalleComprasComponent implements OnInit {

  vmButtons: any;
  programa: any;
  departamento: any = []
  atribucion: any = []
  asigna: any = []
  cont: any = []

  detalles: any = {
    programa: null,
    departamento: null,
    atribucion: null,
    asigna: null,
    proceso: null,
    estado: 'A',
    idp: null,
    tipo_proceso: null,
    observacion: null
  }

  @Input() item: any;

  listaSolicitudes: any = []
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.detalles = {
      programa: null,
      departamento: null,
      atribucion: null,
      asigna: null,
      proceso: null
    }


    this.vmButtons = [
      { orig: "btnsCompaContrata", paramAccion: "1", boton: { icon: "fas fa-chevron-left", texto: "Regresar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ]

    setTimeout(() => {
      console.log(this.item);
      this.listaSolicitudes = this.item['detalles']
      // this.detalles.programa = this.item['catalogo_programa'][0]['valor']
      // this.detalles.departamento = this.item['catalogo_departamento']['valor']
      // this.detalles.atribucion = this.item['catalogo']['valor']
      this.detalles.asigna = this.item['valor']
      this.detalles.proceso = this.item['tipo_proceso']
      this.detalles.idp = this.item['idp']
      this.detalles.observacion = this.item['observacion']
      
    }, 50);
  }

  metodoGlobal(event: any){
    switch(event.items.boton.texto){
      
      case "Regresar":
        this.cerrar()
        break;
    }
  }

  cerrar(){
    this.activeModal.close()
    this.detalles = {
      programa: null,
      departamento: null,
      atribucion: null,
      asigna: null,
      proceso: null
    }
  }

}
