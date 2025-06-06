import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { TarifaService } from '../tarifa.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
standalone: false,
  selector: 'app-modal-tarifas',
  templateUrl: './modal-tarifas.component.html',
  styleUrls: ['./modal-tarifas.component.scss']
})
export class ModalTarifasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false})
  lcargando: CcSpinerProcesarComponent;
  fTitle = 'Listado de Tarifas por Concepto';
  mensajeSpinner: string = "Cargando...";
  vmButtons: any = [];
  tarifas: any = [];

  filter: any;
  paginate: any;
  cmb_estado: any[] = [
    {value: 'A', label: 'Activo'},
    {value: 'I', label: 'Inactivo'},
  ]

  constructor(
    private activeModal: NgbActiveModal,
    private commonVarService: CommonVarService,
    private apiService: TarifaService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsTarifaDet",
        paramAccion: "",
        boton: { icon: "fa fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.filter = {
      descripcion: null,
      estado: null,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    }

    setTimeout(() => {
      this.cargaTarifas()
    }, 0)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "REGRESAR":
        this.activeModal.close()
        break;
    }
  }

  cargaTarifas() {
    (this as any).mensajeSpinner = 'Cargando Tarifas...';
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.apiService.getTarifasFiltro(data).subscribe(
      (res) => {
        console.log(res);
        this.tarifas = [];
        // if (Array.isArray(res['data']) && res['data'].length === 0) {
        //   Swal.fire({
        //     title: this.fTitle,
        //     text: 'No hay Tarifas para cargar.',
        //     icon: 'warning'
        //   })
        //   this.lcargando.ctlSpinner(false)
        //   return
        // }
        this.paginate.length = res['data']['total'];
          res['data']['data'].forEach(t => {
            let tarifa = {
              id: t.id_tarifa,
              descripcion: t.descripcion,
              estado: t.estado,
              concepto: t.concepto ? {
                id: t.concepto.id_concepto,
                codigo: t.concepto.codigo,
                nombre: t.concepto.nombre
              } : null
            }
            // if(tarifa.concepto.id){
              this.tarifas.push({ ...tarifa });
            // }
          })


        this.lcargando.ctlSpinner(false);
        // setTimeout(() => {
        //   this.dtTrigger.next(null)
        // }, 50)

      },
      (err) => {
        console.log(err)
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Tarifas');
      }
    )
  }


  editTarifa(tarifa) {
    /** param: ID de Tarifa */
    (this as any).mensajeSpinner = 'Obteniendo Tarifa...'
    this.lcargando.ctlSpinner(true);
    this.apiService.getTarifaConceptoDetalle(tarifa).subscribe(
      res => {
        this.lcargando.ctlSpinner(false);
        this.commonVarService.editTarifa.next(res['data']);
        this.activeModal.close();
      },
      err => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error obteniendo Tarifa');
      }
    )

  }


  limpiarFiltros() {
    this.filter = {
      estado: ['A'],
      descripcion: undefined,
      filterControl: ""
    };
    // this.cargaTarifas();
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargaTarifas();
  }

}
