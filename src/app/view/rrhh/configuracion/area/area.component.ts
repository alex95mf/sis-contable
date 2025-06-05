import { Component, OnInit,ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { AreaService } from './area.service';
import * as myVarGlobals from "../../../../global";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ConceptoFormComponent } from './area-form/concepto-form.component';
import { MatPaginator } from '@angular/material/paginator';




@Component({
standalone: false,
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fTitle: string = "Direcciones";
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  paginate: any;
  filter: any;
  areas: any = [];
  showInactive = false;

  constructor(
    private conceptosSrv: AreaService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
  ) {
    this.commonVarSrv.editArea.asObservable().subscribe(
      (res) => {
        if(res){
          this.cargarAreas()
        }
      }
    )


  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: "NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "far fa-square", texto: "MOSTRAR INACTIVOS" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
    ];
    this.filter = {
      are_descripcion: undefined,
      are_nombre: undefined,
      estado: ['A'],
      filterControl: "",
    };
    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };
    setTimeout(()=> {
      this.cargarAreas();
    }, 0);
  }

  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.cargarAreas()
  }

  changePaginate({pageIndex, pageSize}) {
    Object.assign(this.paginate, {page: pageIndex + 1, perPage: pageSize})
    this.cargarAreas()
  }

  cargarAreas() {
    (this as any).mensajeSpinner = "Cargando listado de Áreas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.conceptosSrv.getAreas(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        this.areas = res['data']['data'];
        /* if (res['data']['current_page'] == 1) {
          this.areas = res['data']['data'];
        } else {
          this.areas = Object.values(res['data']['data']);
        } */
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  limpiarFiltros() {
    this.filter.are_descripcion = undefined;
    this.filter.are_nombre = undefined;
  }

  showConceptoForm(isNew:boolean, data?:any) {
      console.log(data);
      const modalInvoice = this.modalSrv.open(ConceptoFormComponent, {
        size: "lg",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "NUEVO":
        this.showConceptoForm(true, {});
        break;
      case "MOSTRAR INACTIVOS":
        this.changeShowInactive(this.showInactive);
        break;
    }
  }

  deleteConcepto(id) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea eliminar está área?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          (this as any).mensajeSpinner = "Eliminando área..."
          this.lcargando.ctlSpinner(true);
          let data = {
            id:this.areas.id_area
          }
          this.conceptosSrv.eliminarArea(id).subscribe(
            (res) => {
              if (res["status"] == 1) {
                this.lcargando.ctlSpinner(false);
                this.cargarAreas();
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

  changeShowInactive(showInactive) {
    if (showInactive) {
      console.log("hola")
      this.vmButtons[1].boton.icon = 'far fa-square';
      this.filter.estado = ['A'];
    }
    else {
      console.log("aqui")
      this.vmButtons[1].boton.icon = 'far fa-check-square';
      this.filter.estado = ['A', 'I'];
    }
    this.showInactive = !this.showInactive;
    this.cargarAreas();
  }


}
