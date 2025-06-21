import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { PuestoService } from '../puesto.service';

import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
standalone: false,
  selector: 'app-modal-puestos',
  templateUrl: './modal-puestos.component.html',
  styleUrls: ['./modal-puestos.component.scss']
})
export class ModalPuestosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false})
  lcargando: CcSpinerProcesarComponent;
  fTitle = "Listado de Puestos de Mercado";
  mensajeSpinner: string = "Cargando...";
  vmButtons: any = [];
  
  puestos: any =[];

  paginate: any;
  filter: any;

  constructor(
    private activeModal: NgbActiveModal,
    private commonVarService: CommonVarService,
    private apiService: PuestoService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsModalPuestos",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.filter = {
      num_local: undefined,
      mercado: undefined,
      descripcion: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20]
    }

    setTimeout(() => {
      this.cargaPuestos()
    }, 0)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " REGRESAR":
        this.activeModal.close()
        break;
    }
  }

  cargaPuestos = () => {

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    };

    (this as any).mensajeSpinner = 'Cargando Puestos...';
    this.lcargando.ctlSpinner(true);

    this.apiService.getPuestosFiltro(data).subscribe(
      (res) => {
        // console.log(res);
        this.puestos = res ['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
         this.puestos = res['data']['data'];
        } else {
         this.puestos = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  deletePuesto(id, i) {
    Swal.fire({
      title: "¡Atención!",
      text: "¿Seguro que desea eliminar este Puesto de Mercado?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        (this as any).mensajeSpinner = 'Eliminando elemento';
        this.lcargando.ctlSpinner(true);
        this.apiService.deletePuesto({id_mercado_puesto: id}).subscribe(
          res => {
            this.puestos.splice(i, 1);
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "Operación exitosa",
              text: res["message"],
              icon: "success",
            })
          },
          err => {
            this.lcargando.ctlSpinner(false);
            Swal.fire({
              title: "¡Error!",
              text: err.error.message,
              icon: "warning",
            })
          }
        )
      }
    })
  }

  editPuesto = (puesto) => {
    this.commonVarService.editPuestoMercado.next(puesto);
    this.activeModal.close();
  }

  limpiarFiltros() {
    this.filter = {
      num_local: undefined,
      mercado: undefined,
      descripcion: undefined,
      filterControl: ""
    }
    this.cargaPuestos()
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargaPuestos();
  }

}
