import { Component, OnInit, ViewChild } from '@angular/core';

import { CommonVarService } from 'src/app/services/common-var.services';

import { DataTableDirective } from 'angular-datatables';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PuestoService } from '../puesto.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-list-puestos',
  templateUrl: './list-puestos.component.html',
  styleUrls: ['./list-puestos.component.scss']
})
export class ListPuestosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle = 'Listado de Puestos de Mercado'
  mensajeSpinner: string
  vmButtons: any
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {}
  dtTrigger = new Subject();

  puestos = []

  constructor(
    private activeModal: NgbActiveModal,
    private commonVarService: CommonVarService,
    private apiService: PuestoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsListPuestos",
        paramAccion: "",
        boton: { icon: "fa fa-times", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    setTimeout(() => {
      this.cargaPuestos()
    }, 125)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close()
        break;
    }
  }

  cargaPuestos = () => {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 7,
      search: true,
      paging: true,
      scrollY: "500px",
      scrollCollapse: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };

    this.mensajeSpinner = 'Cargando Puestos'
    this.lcargando.ctlSpinner(true)
    this.apiService.getPuestos().subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Puestos para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }
        this.puestos = res["data"]
        this.lcargando.ctlSpinner(false)

        setTimeout(() => {
          this.dtTrigger.next(null)
        }, 50)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message)
      }
    )
  }

  deletePuesto(id, i) {
    Swal.fire({
      title: "¡Atención!",
      text: "¿Seguro que desea guardar este Puesto de Mercado?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        this.mensajeSpinner = 'Eliminando elemento';
        this.lcargando.ctlSpinner(true);
        this.apiService.deletePuesto({id_mercado_puesto: id}).subscribe(
          res => {
            this.puestos.splice(i, 1);
            this.rerender();
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

}
