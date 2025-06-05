import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { CajasService } from './cajas.service';
import * as myVarGlobals from "../../../../global";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CajasFormComponent } from './cajas-form/cajas-form.component';

@Component({
standalone: false,
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
  styleUrls: ['./cajas.component.scss']
})
export class CajasComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;

  fTitle: string = "Cajas";

  vmButtons: any = [];
  dataUser: any;
  permissions: any;

  cajasDt: any = [];
  usuariosList: any = [];
  showInactive = false;
  establecimientosList = [];

  paginate: any;
  filter: any;

  constructor(
    private apiSrv: CajasService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
  ) {

    this.commonVarSrv.needRefresh.asObservable().subscribe(
      (res) => {
        if (res) {
          this.cargarCajas();
        }
      }
    )

   }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsCajas",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsCajas",
        paramAccion: "",
        boton: { icon: "far fa-square", texto: " MOSTRAR INACTIVOS" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      }
    ];

    this.filter = {
      usuario: undefined,
      sucursal: undefined,
      nombre: undefined,
      estado: ['A', 'I'],
      filterControl: "",
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

    setTimeout(()=> {
      this.validaPermisos();
    }, 0);

  }

  validaPermisos() {
    (this as any).mensajeSpinner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fTesCreacionCaja,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {
          this.cargarCajas();
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cargarCajas() {
    (this as any).mensajeSpinner = "Cargando Cajas del sistema...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.apiSrv.getCajas(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.cajasDt = res['data']['data'];
        } else {
          this.cajasDt = Object.values(res['data']['data']);
        }
        // this.lcargando.ctlSpinner(false);
        this.cargarUsuarios();
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  cargarUsuarios() {
    (this as any).mensajeSpinner = "Cargando Usuarios del sistema...";
    this.lcargando.ctlSpinner(true);

    this.apiSrv.getUsuarios().subscribe(
      (res) => {
        console.log(res);
        this.usuariosList = res['data'];
        // this.paginate.length = res['data']['total'];
        // if (res['data']['current_page'] == 1) {
        //   this.cajasDt = res['data']['data'];
        // } else {
        //   this.cajasDt = Object.values(res['data']['data']);
        // }
        // this.lcargando.ctlSpinner(false);
        this.getCatalogos();
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  getCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos...';
    this.lcargando.ctlSpinner(true);

    let data = {
      params: "'REC_CAJA_ESTABLECIMIENTO'",
    }

    this.apiSrv.getCatalogos(data).subscribe(
      (res) => {
        console.log(res);
        this.establecimientosList = [];
        res['data']['REC_CAJA_ESTABLECIMIENTO'].forEach(e => {
          let establecimiento = {
            nombre: e.descripcion,
            valor: e.valor
          }
          this.establecimientosList.push(establecimiento);
        })

        this.lcargando.ctlSpinner(false);
      },
      (err) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " NUEVO":
        this.showCajasForm(true, {});
        break;
      case " MOSTRAR INACTIVOS":
        this.changeShowInactive(this.showInactive);
        break;
    }
  }

  deleteCaja(id) {
    if (this.permissions.eliminar == "0"){
      this.toastr.warning("No tiene permisos para eliminar Cajas.", this.fTitle);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea eliminar esta Caja?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          (this as any).mensajeSpinner = "Eliminando caja..."
          this.lcargando.ctlSpinner(true);
          this.apiSrv.deleteCaja(id).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.lcargando.ctlSpinner(false);
                this.cargarCajas();
                Swal.fire({
                  icon: "success",
                  title: "Registro Eliminado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                });
              } else {
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                });
              }
            },
            (error) => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.message);
            }
          )
        }
      });
    }
  }

  changeShowInactive(showInactive) {
    if (showInactive) {
      this.vmButtons[1].boton.icon = 'far fa-square';
      this.filter.estado = ['A', 'I'];
    } else {
      this.vmButtons[1].boton.icon = 'far fa-check-square';
      this.filter.estado = ['I'];
    }
    this.showInactive = !this.showInactive;
    this.cargarCajas();
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarCajas();
  }

  limpiarFiltros() {
    this.filter = {
      usuario: undefined,
      sucursal: undefined,
      nombre: undefined,
      estado: ['A', 'I'],
      filterControl: "",
    };
  }

  showCajasForm(isNew:boolean, data?:any) {
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Cajas.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Cajas.", this.fTitle);
    } else {
      const modalInvoice = this.modalSrv.open(CajasFormComponent, {
        size: "lg",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fTesCreacionCaja;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.usuariosList = this.usuariosList;
      modalInvoice.componentInstance.establecimientosList = this.establecimientosList;
    }
  }



}
