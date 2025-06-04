import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CategoriaProductoService } from '../categoria-producto.service';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
standalone: false,
  selector: 'app-modal-creacion',
  templateUrl: './modal-creacion.component.html',
  styleUrls: ['./modal-creacion.component.scss']
})
export class ModalCreacionComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";

  catalogo = {
    codigo: null,
    descripcion: null,
    estado: 'A'
  }

  vmButtons: any

  constructor(
    private service: CategoriaProductoService,
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
    this.mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);

    console.log(this.catalogo);
    this.service.saveCatalogoBienes(this.catalogo).subscribe(
      (res)=>{
        console.log(res);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Se creo una nueva grupo de producto",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8'
        }).then((result) => {
          if (result.isConfirmed) {
            this.activeModal.close()
            this.commonVrs.CatalogoBienes.next(null)
          }
        })
      }
    )
  }

}
