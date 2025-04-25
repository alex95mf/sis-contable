import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { TramitesService } from '../../tramites.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent implements OnInit {

  usuariospre: any = [];
  selectUser: any;

  vmButtons: any;

  constructor(
    private serviceAdmin: TramitesService,
    private activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsUser",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsUser",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false
      },
    ];
    this.cargarUsuarios();
    // setTimeout(() => {
      

    // }, 5);
  }


  metodoGlobal(event){
    switch (event.items.boton.texto){
      case 'REGRESAR':
        this.activeModal.close()
        break;
      case 'GUARDAR':
        this.guardarUser();
        break;
    }
  }

  guardarUser(){
    this.commonVrs.usuarioTramite.next({data: this.selectUser})
    this.activeModal.close()
  }


  cargarUsuarios(){
    this.serviceAdmin.getUsuarios({}).subscribe(
      (res)=>{
        console.log(res['data']);
        this.usuariospre = res['data']
      }
    )
  }

}
