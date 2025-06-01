import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CatalogoBienesService } from '../catalogo-bienes.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.scss']
})
export class ModalCreateComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSppiner: string = "Cargando...";

  catalogo = {
    codigo: null,
    descripcion: null,
    estado: 'A'
  }

  vmButtons: any

  constructor(
    private service: CatalogoBienesService,
    private commonVrs: CommonVarService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-save", texto: "Guardar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-chevron-left", texto: "Regresar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false}
    ]
  }

  metodoGlobal(event){
    switch(event.items.boton.texto){

      case "Guardar":
        this.agregarCatalogo();
        break;
      
      case "Regresar":
        this.activeModal.close()
        break;
    }
  }

  agregarCatalogo(){
    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    
    console.log(this.catalogo);
    this.service.saveCatalogoBienes(this.catalogo).subscribe(
      (res)=>{
        console.log(res);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Se creo una nueva catalogo de bienes",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8'
        }).then((result) => {
          if (result.isConfirmed) {
            this.activeModal.close()
            this.commonVrs.CatalogoBienes.next()
          }
        })
      }
    )
  }

}
