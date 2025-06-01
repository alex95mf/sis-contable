import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { DepartamentoService } from './departamento.service';
import * as myVarGlobals from "../../../../global";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ModalNewUpdComponent } from './modal-new-upd/modal-new-upd.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.scss']
})
export class DepartamentoComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;

  fTitle: string = "Departamentos";

  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  paginate: any;
  filter: any;

  departamento: any = []

  onDestroy$: Subject<void> = new Subject();

  estado: any = [
    {valor: 'I', descripcion: 'Inactivo'},
    {valor: 'A', descripcion: 'Activo'}
  ]

  constructor(
    private conceptosSrv: DepartamentoService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
  ) {
    this.commonVarSrv.modalDepartamento.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res)=>{
        console.log('hOLIS');
        this.cargarDepartamento()
      }
    )
  }

  ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }


  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      }
    ];
    this.filter = {
      nombre: undefined,
      estado: undefined,
      filterControl: "",
    };

    // TODO: Habilitar codigo en Backend

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageIndex: 0,
      pageSizeOptions: [5, 10, 20, 50]
    };


    setTimeout(() => {
      this.cargarDepartamento()
    }, 500);
  }


  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case " NUEVO":
        this.showConceptoForm(true, {});
        break;

    }
  }
  consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })
    this.cargarDepartamento()
  }


  cargarDepartamento() {
    this.mensajeSppiner = 'Cargar Departamento... '
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.conceptosSrv.getDepartamento(data).subscribe(
      (res) => {
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.departamento = res['data']['data'];
        } else {
          this.departamento = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      }
    )
  }


  limpiarFiltros(){
    this.filter = {
      nombre: undefined,
      estado: undefined,
      filterControl: "",
    };
  }


  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarDepartamento();
  }

  showConceptoForm(validacion, item) {
    const modal = this.modalSrv.open(ModalNewUpdComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })


    modal.componentInstance.dato = item;
    modal.componentInstance.validacion = validacion;


  }

  ModalNewUpdComponent(validacion, item) {
    const modal = this.modalSrv.open(ModalNewUpdComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })


    modal.componentInstance.dato = item;
    modal.componentInstance.validacion = validacion;


  }


  deleteConcepto(id){
    console.log(id);
    this.mensajeSppiner = 'eliminar Departamento... '
    this.lcargando.ctlSpinner(true);
    Swal.fire({
      title: "Atención",
      text: "Seguro desea actualizar la siguiente información?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
        if (result.value) {
          this.conceptosSrv.deleteDepartamento({id_departamento: id}).subscribe(
            (res)=>{
              Swal.fire({
                icon: "success",
                title: "Departamento Eliminado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
              this.cargarDepartamento()
              this.lcargando.ctlSpinner(false);
            }
          )
        }else {
          this.lcargando.ctlSpinner(false);
        }

      }
    )


  }

}
