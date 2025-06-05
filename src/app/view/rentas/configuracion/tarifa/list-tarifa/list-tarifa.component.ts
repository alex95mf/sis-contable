import { Component, OnInit, ViewChild } from '@angular/core';

import { CommonVarService } from 'src/app/services/common-var.services';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TarifaService } from '../tarifa.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { Subject } from 'rxjs';

@Component({
standalone: false,
  selector: 'app-list-tarifa',
  templateUrl: './list-tarifa.component.html',
  styleUrls: ['./list-tarifa.component.scss']
})
export class ListTarifaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle = 'Listado de Tarifas por Concepto'
  mensajeSpinner: string
  vmButtons: any
  dtOptions: DataTables.Settings = {}
  dtTrigger = new Subject();

  tarifas = []

  constructor(
    private activeModal: NgbActiveModal,
    private commonVarService: CommonVarService,
    private apiService: TarifaService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsTarifaDet",
        paramAccion: "",
        boton: { icon: "fa fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    setTimeout(() => {
      this.cargaTarifas()
    }, 125)
  }

  cargaTarifas() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 7,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };

    (this as any).mensajeSpinner = 'Cargando Tarifas'
    this.lcargando.ctlSpinner(true)
    this.apiService.getTarifas().subscribe(
      res => {
        // console.log(res['data'])
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Tarifas para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res['data'].forEach(t => {
          let tarifa = {
            id: t.id_tarifa,
            descripcion: t.descripcion,
            estado: t.estado == 'A',
            concepto: {
              id: t.concepto.id_concepto,
              codigo: t.concepto.codigo,
              nombre: t.concepto.nombre
            } || null
          }
          this.tarifas.push({ ...tarifa })

          this.lcargando.ctlSpinner(false)
        })
        setTimeout(() => {
          this.dtTrigger.next(null)
        }, 50)

      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Tarifas')
      }
    )
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CANCELAR":
        this.activeModal.close()
        break;
    }
  }

  editTarifa(tarifa) {
    /** param: ID de Tarifa */
    (this as any).mensajeSpinner = 'Obteniendo Tarifa'
    this.lcargando.ctlSpinner(true)
    this.apiService.getTarifaConceptoDetalle(tarifa).subscribe(
      res => {
        this.lcargando.ctlSpinner(false)
        this.commonVarService.editTarifa.next(res['data'])
        this.activeModal.close()
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error obteniendo Tarifa')
      }
    )

  }

}
