import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ModalProveedoresService } from './modal-proveedores.service';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "src/app/config/custom/modal-proveedores/modal-proveedores.component";
import { ValidacionesFactory } from '../utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-modal-proveedores',
  templateUrl: './modal-proveedores.component.html',
  styleUrls: ['./modal-proveedores.component.scss']
})
export class ModalProveedoresComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any = false;
  @Input() validacion: any;

  vmButtons: any;
  proveedoresDt: any = [];
  paginate: any;
  filter: any;
  validaciones: ValidacionesFactory = new ValidacionesFactory()

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private mdlSrv: ModalProveedoresService,
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnProveedorForm",
        paramAction: "",
        boton: { icon: "fas fa-search", texto: " CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnProveedorForm",
        paramAction: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnProveedorForm",
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

    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 7, 10]
    }

    setTimeout(() => {
      this.cargarProveedores();
    }, 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " CONSULTAR":
        this.cargarProveedores();
        break;
        case " LIMPIAR":
          this.limpiarFiltros();
          break;
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.mensajeSpinner = "Cargando lista de Proveedores...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    this.mdlSrv.getProveedores(data).subscribe(
      (res) => {
        // console.log(data);
        // console.log(res);
        if (Array.isArray(res['data']) && res['data'].length == 0) {
          this.proveedoresDt = []
        } else {
          this.paginate.length = res['data']['total'];
          if (res['data']['current_page'] == 1) {
            this.proveedoresDt = res['data']['data'];
          } else {
            this.proveedoresDt = Object.values(res['data']['data']);
          }
        }

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
    this.filter.razon_social = undefined;
    this.filter.num_documento = undefined;
    // this.cargarProveedores();
  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea seleccionar otro proveedor? Los demás campos y cálculos realizados serán reiniciados.",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.closeModal(data);
        }
      });
    } else {
      this.closeModal(data);
    }
  }

  closeModal(data?: any) {
    if (data) {
      let dato = data
      dato["valid"] = this.validacion;
      this.commonVrs.selectProveedorCustom.next(data);
    }
    this.activeModal.dismiss();
  }

}
