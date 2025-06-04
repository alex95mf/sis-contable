import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CatalogoBienesService } from '../catalogo-bienes.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ToastrService } from 'ngx-toastr';

@Component({
standalone: false,
  selector: 'app-modal-edition',
  templateUrl: './modal-edition.component.html',
  styleUrls: ['./modal-edition.component.scss']
})
export class ModalEditionComponent implements OnInit {


  catalogo: any = {
    id: null,
    descripcion: null,
    codigo: null,
    estado: null
  }

  estado = [
    {valor: 'A', descripcion: 'Aprobado'},
    {valor: 'I', descripcion: 'Inactivo'},
    // {valor: 'E', descripcion: 'Emitido'},
  ]
  vmButtons: any;
  @Input() item: any;

  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string = "Cargando...";

  constructor(
    public activeModal: NgbActiveModal,
    private service: CatalogoBienesService,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-save", texto: "Guardar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsComprasP", paramAccion: "1", boton: { icon: "fas fa-chevron-left", texto: "Regresar" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false}
    ]

    setTimeout(()=>{
      console.log(this.item);
      this.catalogo.descripcion = this.item['descripcion'];
      this.catalogo.id = this.item['id_catalogo_bienes'];
      this.catalogo.codigo = this.item['codigo_bienes'];
      this.catalogo.estado = this.item['estado']
    })
  }

  metodoGlobal(event){
    switch(event.items.boton.texto){

      case "Guardar":
        this.validacion();
        break;

      case "Regresar":
        this.activeModal.close()
        break;
    }
  }

  validacion(){
    if(this.catalogo.descripcion == null || this.catalogo.descripcion == undefined){
      this.toastr.info('El campo descripcion no debe estar vacio');

    }else if(this.catalogo.codigo == null || this.catalogo.codigo == undefined){
      this.toastr.info('El campo codigo no debe estar vacio')
    }else if(this.catalogo.estado == null || this.catalogo.estado == undefined){
      this.toastr.info('El campo estado no debe estar vacio')
    }else {
      this.guardarEdition()
    }
  }


  guardarEdition(){

    this.mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    console.log(this.catalogo);
    this.service.updateCatalogoBienes(this.catalogo).subscribe(
      (res)=>{
        console.log(res);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "Se actualizó con éxito",
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
