import { Component, OnInit, ViewChild } from "@angular/core";
import { ArancelesService } from "./aranceles.service";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import * as myVarGlobals from "../../../../global";
import { CommonService } from "src/app/services/commonServices";
import { CommonVarService } from "src/app/services/common-var.services";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PageEvent } from '@angular/material/paginator';
import { Subject } from "rxjs";
import { ArancelFormComponent } from "./arancel-form/arancel-form.component";
import { MatPaginator } from '@angular/material/paginator';

@Component({
standalone: false,
  selector: "app-aranceles",
  templateUrl: "./aranceles.component.html",
  styleUrls: ["./aranceles.component.scss"],
})

export class ArancelesComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  fTitle: any = "Aranceles";

  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  
  arancelesDt: any = [];
  showInactive = false;

  paginate: any;
  filter: any;
  
  //pageEvent: PageEvent;

  constructor(
    private arancelesSrv: ArancelesService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal
  ) {
    this.commonVrs.editArancel.asObservable().subscribe(
      (res) => {
        if (res) {
          this.cargarAranceles();
        }
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsAranceles",
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
        orig: "btnsAranceles",
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
      descripcion: undefined,
      estado: ['A']
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [2, 5, 10, 20, 50]
    }

    setTimeout(()=> {
      this.validatePermission();
    }, 0);
  }

  validatePermission() {
    this.mensajeSppiner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRPAranceles,
      id_rol: this.dataUser.id_rol,
    };

    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {
          this.cargarAranceles();
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " NUEVO":
        this.showArancelForm(true, {});
        break;
      case " MOSTRAR INACTIVOS":
        this.changeShowInactive(this.showInactive);
        break;
    }
  }

  changeShowInactive(showInactive) {
    if (showInactive) {
      this.vmButtons[1].boton.icon = 'far fa-square';
      this.filter.estado = ['A'];
    } else {
      this.vmButtons[1].boton.icon = 'far fa-check-square';
      this.filter.estado = ['A', 'I'];
    }
    this.showInactive = !this.showInactive
    this.cargarAranceles();
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarAranceles();
  }

  cargarAranceles() {
    this.mensajeSppiner = "Cargando lista de Aranceles..."
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    
    this.arancelesSrv.getAranceles(data).subscribe(
      (res) => {
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.arancelesDt = res['data']['data'];
        } else {
          this.arancelesDt = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  limpiarFiltros() {
    this.filter.descripcion = undefined;
    this.cargarAranceles();
  }

  consultar(){
    Object.assign(this.paginate ,{
      page: 1,
      pageIndex: 0
    })
     this.paginator.firstPage()
     this.cargarAranceles()
  }

  deleteArancel(id) {
    if (this.permissions.eliminar == "0") {
      this.toastr.warning("No tiene permisos para eliminar Aranceles.", this.fTitle);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea eliminar este Arancel?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.mensajeSppiner = "Eliminando arancel..."
          this.lcargando.ctlSpinner(true);
          this.arancelesSrv.deteleArancel(id).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.lcargando.ctlSpinner(false);
                this.cargarAranceles();
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

  restoreArancel(id) {
    if (this.permissions.eliminar == "0") {
      this.toastr.warning("No tiene permisos para restaurar Aranceles.", this.fTitle);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea restarurar este Arancel?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.mensajeSppiner = "Restaurando arancel..."
          this.lcargando.ctlSpinner(true);
          this.arancelesSrv.restoreArancel(id).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.lcargando.ctlSpinner(false);
                this.cargarAranceles();
                Swal.fire({
                  icon: "success",
                  title: "Registro Restaurado",
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

  showArancelForm(isNuevoArancel, arancelId) {
    if (!isNuevoArancel && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Aranceles.", this.fTitle);
    } else if (isNuevoArancel && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Aranceles.", this.fTitle);
    } else {
      const modalInvoice = this.modalService.open(ArancelFormComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRPAranceles;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNuevoArancel = isNuevoArancel;
      modalInvoice.componentInstance.arancelId = arancelId;
      modalInvoice.componentInstance.permissions = this.permissions;
    }
  }
  
}