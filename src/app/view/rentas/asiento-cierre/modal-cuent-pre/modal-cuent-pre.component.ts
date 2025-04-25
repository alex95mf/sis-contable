import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { AsientoCierreService } from '../asiento-cierre.service';
import { IPaginate } from 'src/app/view/contabilidad/auxiliares/IAuxiliares';
import { ToastrService } from 'ngx-toastr';
import Swal, { SweetAlertResult } from 'sweetalert2';
import Botonera from 'src/app/models/IBotonera';

@Component({
  selector: 'app-modal-cuent-pre',
  templateUrl: './modal-cuent-pre.component.html',
  styleUrls: ['./modal-cuent-pre.component.scss']
})
export class ModalCuentPreComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = "Cuentas Contables";
  vmButtons: Array<Botonera> = [];
  msgSpinner: string;

  filter: any
  paginate: any;

  cuentas: Array<any> = [];


  constructor(
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private apiService: AsientoCierreService,
    private toastr: ToastrService,
  ) { 
    this.vmButtons = [
      {
        orig: "btnsModalCuentas",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.filter = {
      codigo: null,
      nombre: null,
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }
  }

  ngOnInit(): void {
    setTimeout(() => this.cargarCuentas(), 50)

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close();
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, { page: 1 })
    this.cargarCuentas()
  }

  async cargarCuentas(){
    this.lcargando.ctlSpinner(true);
    try {
      let response: any = await this.apiService.getConCuentas({params: { filter: this.filter, paginate: this.paginate }})
      // console.log(response)
      this.paginate.length = response.total
      this.cuentas = response.data
      
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  limpiarFiltros(){
    this.filter = {
      codigo: null,
      nombre: null,
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarCuentas();
  }

  async selectOption(cuenta: any){
    let result: SweetAlertResult = await Swal.fire({
      title: 'Seleccion de Cuenta Contable',
      text: 'Seguro/a desea seleccionar esta cuenta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Seleccionar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      this.apiService.cuentaSelected$.emit(cuenta)
      this.activeModal.close()
    }
  }

}
