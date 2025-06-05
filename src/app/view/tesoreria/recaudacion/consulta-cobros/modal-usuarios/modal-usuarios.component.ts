import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ModalUsuariosService } from './modal-usuarios.service'; 
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { MatPaginator } from '@angular/material/paginator';
import { Paginator } from 'primeng/paginator';

@Component({
standalone: false,
  selector: 'app-modal-usuarios',
  templateUrl: './modal-usuarios.component.html',
  styleUrls: ['./modal-usuarios.component.scss']
})
export class ModalUsuariosComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator

  @Input() valid: any = 0;
  @Input() tipo: any = '';

  dataUser: any;

  vmButtons: any;
  usuariosDt: any = [];
  paginate: any;
  filter: any;
  validaciones: ValidacionesFactory = new ValidacionesFactory()

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private mdlSrv: ModalUsuariosService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnUsuarioForm",
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

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    console.log(this.tipo)

    this.filter = {
      usuario: undefined,
      nombre: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(() => {
      this.cargarUsuarios();
    }, 0);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }

  changePaginate({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1});
    this.cargarUsuarios();
  }

  aplicarFiltros() {
    Object.assign(this.paginate, {pageIndex: 0, page: 1})
    this.paginator.firstPage()
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    (this as any).mensajeSpinner = "Cargando lista de Usuarios...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    this.mdlSrv.getUsuarios(data).subscribe(
      (res: any) => {
     
        this.usuariosDt = res.data.data
        this.paginate.length = res.data.total
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  limpiarFiltros() {
    this.filter.usuario = undefined;
    this.filter.nombre = undefined;
    // this.cargarContribuyentes();
  }

  selectOption(dt){

    this.commonVrs.selectUsuario.next({data:dt,valid: this.valid, tipo: this.tipo})
    this.activeModal.close()

  }

  closeModal(){
    this.activeModal.close()
  }

}
