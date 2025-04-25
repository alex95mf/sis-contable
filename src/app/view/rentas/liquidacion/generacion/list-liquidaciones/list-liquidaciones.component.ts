import { Component, OnInit, ViewChild } from '@angular/core';

import { CommonVarService } from 'src/app/services/common-var.services';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneracionService } from '../generacion.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-liquidaciones',
  templateUrl: './list-liquidaciones.component.html',
  styleUrls: ['./list-liquidaciones.component.scss']
})
export class ListLiquidacionesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle = 'Listado de Tarifas por Concepto'
  msgSpinner: string
  vmButtons: any
  dtOptions: DataTables.Settings = {}
  dtTrigger = new Subject();

  liquidaciones = []

  constructor(
    private activeModal: NgbActiveModal,
    private commonVarService: CommonVarService,
    private apiService: GeneracionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsLiqQuery",
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
      this.cargaLiquidaciones()
    }, 125)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CANCELAR":
        this.activeModal.close()
        break;
    }
  }

  cargaLiquidaciones = () => {
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

    this.msgSpinner = 'Cargando Liquidaciones'
    this.lcargando.ctlSpinner(true)
    this.apiService.getLiquidaciones().subscribe(
      res => {
        if (Array.isArray(res['data']) && res['data'].length === 0) {
          Swal.fire({
            title: this.fTitle,
            text: 'No hay Tarifas para cargar.',
            icon: 'warning'
          })
          this.lcargando.ctlSpinner(false)
          return
        }

        res['data'].forEach(l => {
          let liquidacion = {
            id: l.id_liquidacion,
            doc: l.documento,
            fecha: l.fecha,
            total: l.total
          }
          this.liquidaciones.push({...liquidacion})
        })
        this.lcargando.ctlSpinner(false)

        setTimeout(() => {
          this.dtTrigger.next()
        }, 50)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message)
      }
    )
  }

  editLiquidacion = (liquidacion) => {
    this.msgSpinner = 'Obteniendo Liquidacion'
    this.lcargando.ctlSpinner(true)
    this.apiService.getLiquidacionCompleta(liquidacion).subscribe(
      res => {
        this.lcargando.ctlSpinner(false)
        this.commonVarService.editLiquidacion.next(res['data'])
        this.activeModal.close()
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error obteniendo Liquidacion')
      }
    )
  }

}
